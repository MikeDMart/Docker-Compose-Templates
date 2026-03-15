// app.js - COMPLETO Y FUNCIONAL

// ═══════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://jimbsityxbidiyqhbutk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppbWJzaXR5eGJpZGl5cWhidXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODcwMDQsImV4cCI6MjA4OTE2MzAwNH0.a5CMHp28vqvxh84ZiXM46xdKEELuscYOQaEBLZ3qgUI';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════

let editor;
let currentUser = null;
let currentYamlId = null;
let autoSaveTimer = null;

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  initEditor();
  await checkSession();
  setupEventListeners();
});

// ═══════════════════════════════════════════════════════════
// EDITOR
// ═══════════════════════════════════════════════════════════

function initEditor() {
  const textarea = document.getElementById('yaml-editor');
  
  editor = CodeMirror.fromTextArea(textarea, {
    mode: 'yaml',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 2,
    tabSize: 2,
    lineWrapping: true
  });

  // Placeholder YAML
  editor.setValue(`version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: changeme
      POSTGRES_DB: myapp
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  db_data:
`);

  // Auto-save cada 3 segundos
  editor.on('change', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      if (currentUser && currentYamlId) {
        saveYaml();
      }
    }, 3000);
  });
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

async function checkSession() {
  const { data: { session } } = await sb.auth.getSession();
  
  if (session) {
    currentUser = session.user;
    showApp();
    await loadUserYamls();
  } else {
    showLogin();
  }

  // Listen to auth changes
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      currentUser = session.user;
      showApp();
      loadUserYamls();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      currentYamlId = null;
      showLogin();
    }
  });
}

async function login() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) {
    console.error('Login error:', error);
    alert('Error al iniciar sesión: ' + error.message);
  }
}

async function logout() {
  const { error } = await sb.auth.signOut();
  if (error) {
    console.error('Logout error:', error);
  }
}

function showLogin() {
  document.getElementById('login-btn').style.display = 'block';
  document.getElementById('user-info').style.display = 'none';
  document.getElementById('main-content').style.display = 'none';
}

function showApp() {
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('main-content').style.display = 'flex';
}

// ═══════════════════════════════════════════════════════════
// YAML CRUD
// ═══════════════════════════════════════════════════════════

async function saveYaml() {
  if (!currentUser) return;

  const content = editor.getValue();
  const status = document.getElementById('save-status');

  try {
    if (currentYamlId) {
      // Update existing
      const { error } = await sb
        .from('yamls')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentYamlId);

      if (error) throw error;
      
      status.textContent = '✅ Guardado ' + new Date().toLocaleTimeString();
      status.style.color = '#4ade80';
    } else {
      // Create new
      const { data, error } = await sb
        .from('yamls')
        .insert({
          user_id: currentUser.id,
          name: 'Nuevo YAML ' + new Date().toLocaleDateString(),
          content
        })
        .select()
        .single();

      if (error) throw error;

      currentYamlId = data.id;
      status.textContent = '✅ Creado ' + new Date().toLocaleTimeString();
      status.style.color = '#4ade80';
      
      await loadUserYamls();
    }

    setTimeout(() => {
      status.textContent = '';
    }, 3000);

  } catch (error) {
    console.error('Save error:', error);
    status.textContent = '❌ Error: ' + error.message;
    status.style.color = '#f87171';
  }
}

async function loadUserYamls() {
  if (!currentUser) return;

  const { data, error } = await sb
    .from('yamls')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Load error:', error);
    return;
  }

  const list = document.getElementById('my-yamls-list');
  list.innerHTML = '';

  if (data.length === 0) {
    list.innerHTML = '<li class="empty">No tienes YAMLs guardados</li>';
    return;
  }

  data.forEach(yaml => {
    const li = document.createElement('li');
    li.className = yaml.id === currentYamlId ? 'active' : '';
    
    li.innerHTML = `
      <div class="yaml-item">
        <div class="yaml-info">
          <strong>${yaml.name}</strong>
          <small>${new Date(yaml.updated_at).toLocaleString()}</small>
        </div>
        <div class="yaml-actions">
          <button class="icon-btn" onclick="loadYaml('${yaml.id}')">📂</button>
          <button class="icon-btn" onclick="deleteYaml('${yaml.id}')">🗑️</button>
        </div>
      </div>
    `;
    
    list.appendChild(li);
  });
}

async function loadYaml(id) {
  const { data, error } = await sb
    .from('yamls')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Load error:', error);
    return;
  }

  currentYamlId = id;
  editor.setValue(data.content);
  
  // Update active state
  document.querySelectorAll('#my-yamls-list li').forEach(li => {
    li.classList.remove('active');
  });
  event.target.closest('li').classList.add('active');
}

async function deleteYaml(id) {
  if (!confirm('¿Seguro que querés eliminar este YAML?')) return;

  const { error } = await sb
    .from('yamls')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error);
    alert('Error al eliminar: ' + error.message);
    return;
  }

  if (currentYamlId === id) {
    currentYamlId = null;
    editor.setValue('');
  }

  await loadUserYamls();
}

// ═══════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════

function downloadYaml() {
  const content = editor.getValue();
  const blob = new Blob([content], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'docker-compose.yml';
  a.click();
  URL.revokeObjectURL(url);
}

function copyYaml() {
  const content = editor.getValue();
  navigator.clipboard.writeText(content).then(() => {
    const status = document.getElementById('save-status');
    status.textContent = '📋 Copiado al portapapeles';
    status.style.color = '#60a5fa';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('save-btn').addEventListener('click', saveYaml);
  document.getElementById('download-btn').addEventListener('click', downloadYaml);
  document.getElementById('copy-btn').addEventListener('click', copyYaml);
}

// Make functions global for onclick handlers
window.loadYaml = loadYaml;
window.deleteYaml = deleteYaml;