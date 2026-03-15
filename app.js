console.log('✅ app.js cargado');

function iniciarApp() {
    if (typeof window.supabase === 'undefined') {
        console.log('⏳ Esperando a Supabase...');
        setTimeout(iniciarApp, 100);
        return;
    }

    console.log('✅ Supabase encontrado');

    const SUPABASE_URL = 'https://jimbsityxbidiyqhbutk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbWJzaXR5eGJpZGl5cWhidXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDY2MzksImV4cCI6MjA1NzcyMjYzOX0.L6q9x4N30T6jYIw_cPrirw_umuZDBoC';

    // ⚠️ Usamos un nombre diferente para evitar conflictos
    const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente Supabase creado');

    // El resto del código usando "sb" en lugar de "supabase"
    // ===============================================
    // ELEMENTOS DOM
    // ===============================================
    let editor;
    let currentUser = null;
    let autoSaveInterval;

    // ===============================================
    // CODEMIRROR
    // ===============================================
    function initializeCodeMirror() {
        const textarea = document.getElementById('yaml-editor');
        if (!textarea) return;
        
        editor = CodeMirror.fromTextArea(textarea, {
            mode: 'yaml',
            theme: 'dracula',
            lineNumbers: true,
            lineWrapping: true,
            tabSize: 2
        });
        
        editor.setValue(`version: '3.8'

services:
  app:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: unless-stopped
`);

        // Auto-save cada 30 segundos
        autoSaveInterval = setInterval(async () => {
            if (currentUser) {
                await saveYAML(true);
            }
        }, 30000);
    }

    // ===============================================
    // AUTENTICACIÓN
    // ===============================================
    async function checkAuth() {
        const { data: { user } } = await sb.auth.getUser();
        
        if (user) {
            currentUser = user;
            showAuthenticatedUI();
            await loadUserYAMLs();
        } else {
            showUnauthenticatedUI();
        }
    }

    function showAuthenticatedUI() {
        const authBtn = document.querySelector('#auth-section button');
        const userInfo = document.getElementById('user-info');
        const userEmail = document.getElementById('user-email');
        const mainContent = document.getElementById('main-content');
        
        if (authBtn) authBtn.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (userEmail) userEmail.textContent = currentUser.email;
        if (mainContent) mainContent.style.display = 'grid';
    }

    function showUnauthenticatedUI() {
        const authBtn = document.querySelector('#auth-section button');
        const userInfo = document.getElementById('user-info');
        const mainContent = document.getElementById('main-content');
        
        if (authBtn) authBtn.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (mainContent) mainContent.style.display = 'none';
    }

    async function login() {
        console.log('🟢 Intentando login...');
        const { error } = await sb.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${window.location.pathname}`
            }
        });
        
        if (error) {
            console.error('❌ Error login:', error);
            alert('Error al iniciar sesión: ' + error.message);
        }
    }

    async function logout() {
        const { error } = await sb.auth.signOut();
        if (!error) {
            currentUser = null;
            clearInterval(autoSaveInterval);
            showUnauthenticatedUI();
        }
    }

    // ===============================================
    // OPERACIONES YAML
    // ===============================================
    async function saveYAML(silent = false) {
        if (!currentUser) {
            !silent && alert('Debes iniciar sesión para guardar');
            return;
        }

        const content = editor.getValue();
        const fileName = `docker-compose-${Date.now()}.yml`;

        const { error } = await sb
            .from('user_yamls')
            .insert([
                { 
                    user_id: currentUser.id,
                    name: fileName,
                    category: 'auto',
                    content: content
                }
            ]);

        if (error) {
            !silent && alert('Error al guardar: ' + error.message);
            updateStatus('❌ Error al guardar', 'error');
        } else {
            !silent && updateStatus('✅ Guardado exitosamente', 'success');
            await loadUserYAMLs();
        }
    }

    async function loadUserYAMLs() {
        const { data, error } = await sb
            .from('user_yamls')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading YAMLs:', error);
            return;
        }

        const list = document.getElementById('my-yamls-list');
        if (!list) return;
        
        list.innerHTML = '';

        data.forEach(yaml => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${yaml.name}</span>
                <button onclick="window.loadYAML('${yaml.id}')">Cargar</button>
            `;
            list.appendChild(li);
        });
    }

    async function loadYAML(id) {
        const { data, error } = await sb
            .from('user_yamls')
            .select('*')
            .eq('id', id)
            .single();

        if (!error && data && editor) {
            editor.setValue(data.content);
            updateStatus('✅ YAML cargado', 'success');
        }
    }

    function downloadYAML() {
        if (!editor) return;
        const content = editor.getValue();
        const blob = new Blob([content], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'docker-compose.yml';
        a.click();
        URL.revokeObjectURL(url);
        updateStatus('⬇️ Descargado', 'success');
    }

    function copyYAML() {
        if (!editor) return;
        navigator.clipboard.writeText(editor.getValue());
        updateStatus('📋 Copiado al portapapeles', 'success');
    }

    function updateStatus(message, type) {
        const status = document.getElementById('save-status');
        if (!status) return;
        
        status.textContent = message;
        status.className = `status ${type}`;
        setTimeout(() => {
            status.textContent = '';
            status.className = 'status';
        }, 3000);
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const saveBtn = document.getElementById('save-btn');
        const downloadBtn = document.getElementById('download-btn');
        const copyBtn = document.getElementById('copy-btn');
        
        if (loginBtn) {
            console.log('✅ Botón login encontrado');
            loginBtn.addEventListener('click', login);
        }
        
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
        if (saveBtn) saveBtn.addEventListener('click', () => saveYAML(false));
        if (downloadBtn) downloadBtn.addEventListener('click', downloadYAML);
        if (copyBtn) copyBtn.addEventListener('click', copyYAML);

        sb.auth.onAuthStateChange((event) => {
            console.log('🔄 Auth event:', event);
            if (event === 'SIGNED_IN') {
                checkAuth();
            } else if (event === 'SIGNED_OUT') {
                showUnauthenticatedUI();
            }
        });
    }

    // ===============================================
    // INICIALIZACIÓN
    // ===============================================
    document.addEventListener('DOMContentLoaded', () => {
        initializeCodeMirror();
        setupEventListeners();
        checkAuth();
    });

    window.loadYAML = loadYAML;
}

iniciarApp();