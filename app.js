// ===============================================
// CONFIGURACIÓN SUPABASE (SOLO UNA VEZ)
// ===============================================
const SUPABASE_URL = 'https://jimbsityxbidiyqhbutk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbWJzaXR5eGJpZGl5cWhidXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDY2MzksImV4cCI6MjA1NzcyMjYzOX0.L6q9x4N30T6jYIw_cPrirw_umuZDBoC';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================================
// ELEMENTOS DOM
// ===============================================
let editor;
let currentUser = null;
let autoSaveInterval;

// ===============================================
// INICIALIZACIÓN
// ===============================================
document.addEventListener('DOMContentLoaded', async () => {
    initializeCodeMirror();
    setupEventListeners();
    await checkAuth();
});

// ===============================================
// CODEMIRROR
// ===============================================
function initializeCodeMirror() {
    editor = CodeMirror.fromTextArea(document.getElementById('yaml-editor'), {
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
            await saveYAML(true); // true = silent save
        }
    }, 30000);
}

// ===============================================
// AUTENTICACIÓN
// ===============================================
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        currentUser = user;
        showAuthenticatedUI();
        await loadUserYAMLs();
    } else {
        showUnauthenticatedUI();
    }
}

function showAuthenticatedUI() {
    document.getElementById('auth-section').querySelector('button').style.display = 'none';
    document.getElementById('user-info').style.display = 'flex';
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('main-content').style.display = 'grid';
}

function showUnauthenticatedUI() {
    document.getElementById('auth-section').querySelector('button').style.display = 'block';
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
}

async function login() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}${window.location.pathname}`
        }
    });
    
    if (error) {
        alert('Error al iniciar sesión: ' + error.message);
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();
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

    const { data, error } = await supabase
        .from('yamls')
        .insert([
            { 
                user_id: currentUser.id,
                file_name: fileName,
                content: content
            }
        ])
        .select();

    if (error) {
        !silent && alert('Error al guardar: ' + error.message);
        updateStatus('❌ Error al guardar', 'error');
    } else {
        !silent && updateStatus('✅ Guardado exitosamente', 'success');
        await loadUserYAMLs();
    }
}

async function loadUserYAMLs() {
    const { data, error } = await supabase
        .from('yamls')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading YAMLs:', error);
        return;
    }

    const list = document.getElementById('my-yamls-list');
    list.innerHTML = '';

    data.forEach(yaml => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${yaml.file_name}</span>
            <button onclick="loadYAML('${yaml.id}')">Cargar</button>
        `;
        list.appendChild(li);
    });
}

async function loadYAML(id) {
    const { data, error } = await supabase
        .from('yamls')
        .select('*')
        .eq('id', id)
        .single();

    if (!error && data) {
        editor.setValue(data.content);
        updateStatus('✅ YAML cargado', 'success');
    }
}

function downloadYAML() {
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
    navigator.clipboard.writeText(editor.getValue());
    updateStatus('📋 Copiado al portapapeles', 'success');
}

function updateStatus(message, type) {
    const status = document.getElementById('save-status');
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
    document.getElementById('login-btn').addEventListener('click', login);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('save-btn').addEventListener('click', () => saveYAML(false));
    document.getElementById('download-btn').addEventListener('click', downloadYAML);
    document.getElementById('copy-btn').addEventListener('click', copyYAML);

    // Auth state change
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            checkAuth();
        } else if (event === 'SIGNED_OUT') {
            showUnauthenticatedUI();
        }
    });
}

// Exponer función global para cargar YAMLs
window.loadYAML = loadYAML;