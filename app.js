// ===============================================
// APP FINAL - CON ESPERA A CODEMIRROR Y SUPABASE
// ===============================================
console.log('✅ app-final.js cargado');

(function() {
    // ===============================================
    // ESPERAR A QUE SUPABASE CARGUE
    // ===============================================
    if (typeof window.supabase === 'undefined') {
        console.log('⏳ Esperando a Supabase...');
        setTimeout(arguments.callee, 100);
        return;
    }
    console.log('✅ Supabase encontrado');

    // ===============================================
    // ESPERAR A QUE CODEMIRROR CARGUE
    // ===============================================
    if (typeof CodeMirror === 'undefined') {
        console.log('⏳ Esperando a CodeMirror...');
        setTimeout(arguments.callee, 100);
        return;
    }
    console.log('✅ CodeMirror encontrado');

    // ===============================================
    // CONFIGURACIÓN SUPABASE
    // ===============================================
    const SUPABASE_URL = 'https://jimbsityxbidiyqhbutk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbWJzaXR5eGJpZGl5cWhidXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDY2MzksImV4cCI6MjA1NzcyMjYzOX0.L6q9x4N30T6jYIw_cPrirw_umuZDBoC';

    const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Cliente Supabase creado');

    // ===============================================
    // VARIABLES GLOBALES
    // ===============================================
    let editor;
    let currentUser = null;
    let autoSaveInterval;

    // ===============================================
    // FUNCIONES UI
    // ===============================================
    function showAuthenticatedUI() {
        const authBtn = document.querySelector('#auth-section button');
        const userInfo = document.getElementById('user-info');
        const userEmail = document.getElementById('user-email');
        const mainContent = document.getElementById('main-content');
        
        if (authBtn) authBtn.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userEmail) userEmail.textContent = currentUser?.email || '';
        }
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

    // ===============================================
    // AUTENTICACIÓN
    // ===============================================
    async function checkAuth() {
        try {
            const { data: { user }, error } = await sbClient.auth.getUser();
            
            if (error) {
                console.log('⚠️ Error de autenticación:', error);
                showUnauthenticatedUI();
                return;
            }

            if (user) {
                currentUser = user;
                showAuthenticatedUI();
                await loadUserYAMLs();
            } else {
                showUnauthenticatedUI();
            }
        } catch (e) {
            console.error('❌ Error en checkAuth:', e);
            showUnauthenticatedUI();
        }
    }

    async function login() {
        await sbClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}${window.location.pathname}`
            }
        });
    }

    async function logout() {
        await sbClient.auth.signOut();
        currentUser = null;
        clearInterval(autoSaveInterval);
        showUnauthenticatedUI();
    }

    // ===============================================
    // OPERACIONES YAML
    // ===============================================
    async function saveYAML(silent = false) {
        if (!currentUser) return;

        const content = editor.getValue();
        const fileName = `docker-compose-${Date.now()}.yml`;

        try {
            await sbClient
                .from('user_yamls')
                .insert([
                    { 
                        user_id: currentUser.id,
                        name: fileName,
                        category: 'auto',
                        content: content
                    }
                ]);

            if (!silent) {
                updateStatus('✅ Guardado', 'success');
                await loadUserYAMLs();
            }
        } catch (e) {
            console.error('Error al guardar:', e);
            updateStatus('❌ Error al guardar', 'error');
        }
    }

    async function loadUserYAMLs() {
        if (!currentUser) return;

        try {
            const { data } = await sbClient
                .from('user_yamls')
                .select('*')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });

            const list = document.getElementById('my-yamls-list');
            if (!list) return;
            
            list.innerHTML = '';

            data?.forEach(yaml => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${yaml.name}</span>
                    <button onclick="window.loadYAML('${yaml.id}')">Cargar</button>
                `;
                list.appendChild(li);
            });
        } catch (e) {
            console.error('Error cargando YAMLs:', e);
        }
    }

    async function loadYAML(id) {
        try {
            const { data } = await sbClient
                .from('user_yamls')
                .select('*')
                .eq('id', id)
                .single();

            if (data && editor) {
                editor.setValue(data.content);
                updateStatus('✅ Cargado', 'success');
            }
        } catch (e) {
            console.error('Error cargando YAML:', e);
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
        updateStatus('📋 Copiado', 'success');
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

        autoSaveInterval = setInterval(async () => {
            if (currentUser) {
                await saveYAML(true);
            }
        }, 30000);
    }

    // ===============================================
    // EVENT LISTENERS
    // ===============================================
    function setupEventListeners() {
        document.getElementById('login-btn')?.addEventListener('click', login);
        document.getElementById('logout-btn')?.addEventListener('click', logout);
        document.getElementById('save-btn')?.addEventListener('click', () => saveYAML(false));
        document.getElementById('download-btn')?.addEventListener('click', downloadYAML);
        document.getElementById('copy-btn')?.addEventListener('click', copyYAML);

        sbClient.auth.onAuthStateChange((event) => {
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
    initializeCodeMirror();
    setupEventListeners();
    checkAuth();

    // Exponer función para cargar YAMLs
    window.loadYAML = loadYAML;
})();