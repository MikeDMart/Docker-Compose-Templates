// ═══════════════════════════════════════════════════════════
// THE DOCKER LIBRARY V3 - COMPLETE
// ═══════════════════════════════════════════════════════════

// SUPABASE CONFIG - REEMPLAZA CON TUS KEYS
const SUPABASE_URL = 'https://jdjyvftusbnpyrdfmfvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkanl2ZnR1c2JucHlyZGZtZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDM4ODksImV4cCI6MjA4OTE3OTg4OX0.pOUwRAOqANDRwaoAXg7VAMEGipzLa7coPuObihfcC0I';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Supabase client initialized');

// STATE
let currentUser = null;
let selectedTemplate = null;
let allTemplates = [];
let filters = {
  search: '',
  portRange: 'all',
  category: 'all',
  technologies: []
};

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App starting...');
  await checkAuth();
  loadTemplatesLibrary();
  setupEventListeners();
  buildFilters();
  renderTemplates();
});

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

async function checkAuth() {
  const { data: { session }, error } = await sb.auth.getSession();
  
  if (error) {
    console.error('⚠️ Auth error:', error);
    showLogin();
    return;
  }
  
  if (session) {
    currentUser = session.user;
    showLoggedIn();
    console.log('✅ User logged in:', currentUser.email);
  } else {
    showLogin();
  }

  sb.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth event:', event);
    
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      showLoggedIn();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      showLogin();
    }
  });
}

function showLogin() {
  document.getElementById('login-btn').style.display = 'inline-flex';
  document.getElementById('user-info').style.display = 'none';
}

function showLoggedIn() {
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-email').textContent = currentUser.email;
}

async function login() {
  console.log('🔐 Login with Google...');
  
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });

  if (error) {
    console.error('❌ Login error:', error);
    alert('Login failed: ' + error.message);
  }
}

async function logout() {
  console.log('👋 Logging out...');
  const { error } = await sb.auth.signOut();
  if (error) console.error('❌ Logout error:', error);
}

// ═══════════════════════════════════════════════════════════
// TEMPLATES LIBRARY
// ═══════════════════════════════════════════════════════════

function loadTemplatesLibrary() {
  allTemplates = [
    // WORDPRESS (3 variants)
    {
      id: "wp-basic",
      name: "WordPress Basic",
      portRange: "2000-2999",
      category: "WordPress",
      technologies: ["WordPress", "MySQL"],
      description: "Simple WordPress with MySQL",
      yamlTemplate: `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "{{WP_PORT}}:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: {{DB_USER}}
      WORDPRESS_DB_PASSWORD: {{DB_PASSWORD}}
      WORDPRESS_DB_NAME: {{DB_NAME}}
    volumes:
      - wp_data:/var/www/html
    restart: unless-stopped
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: {{DB_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped
volumes:
  wp_data:
  db_data:`,
      requiredFields: [
        { name: 'WP_PORT', label: 'WordPress Port', default: '2001', type: 'number' },
        { name: 'DB_NAME', label: 'Database Name', default: 'wordpress', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'wpuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true },
        { name: 'DB_ROOT_PASSWORD', label: 'Root Password', default: '', type: 'password', required: true }
      ]
    },
    
    {
      id: "wp-redis",
      name: "WordPress + Redis",
      portRange: "2000-2999",
      category: "WordPress",
      technologies: ["WordPress", "MySQL", "Redis"],
      description: "WordPress with Redis caching",
      yamlTemplate: `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "{{WP_PORT}}:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: {{DB_USER}}
      WORDPRESS_DB_PASSWORD: {{DB_PASSWORD}}
      WORDPRESS_DB_NAME: {{DB_NAME}}
      WORDPRESS_REDIS_HOST: redis
    volumes:
      - wp_data:/var/www/html
    restart: unless-stopped
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: {{DB_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped
  redis:
    image: redis:alpine
    restart: unless-stopped
volumes:
  wp_data:
  db_data:`,
      requiredFields: [
        { name: 'WP_PORT', label: 'WordPress Port', default: '2002', type: 'number' },
        { name: 'DB_NAME', label: 'Database Name', default: 'wordpress', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'wpuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true },
        { name: 'DB_ROOT_PASSWORD', label: 'Root Password', default: '', type: 'password', required: true }
      ]
    },

    {
      id: "wp-multisite",
      name: "WordPress Multisite",
      portRange: "1024-1999",
      category: "WordPress",
      technologies: ["WordPress", "MySQL", "Redis"],
      description: "Enterprise WordPress network",
      yamlTemplate: `version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "{{WP_PORT}}:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: {{DB_USER}}
      WORDPRESS_DB_PASSWORD: {{DB_PASSWORD}}
      WORDPRESS_DB_NAME: {{DB_NAME}}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_ALLOW_MULTISITE', true);
        define('MULTISITE', true);
        define('SUBDOMAIN_INSTALL', false);
        define('DOMAIN_CURRENT_SITE', '{{DOMAIN}}');
        define('PATH_CURRENT_SITE', '/');
        define('SITE_ID_CURRENT_SITE', 1);
        define('BLOG_ID_CURRENT_SITE', 1);
    volumes:
      - wp_data:/var/www/html
    restart: unless-stopped
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: {{DB_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped
  redis:
    image: redis:alpine
    restart: unless-stopped
volumes:
  wp_data:
  db_data:`,
      requiredFields: [
        { name: 'WP_PORT', label: 'WordPress Port', default: '1024', type: 'number' },
        { name: 'DOMAIN', label: 'Domain', default: 'localhost', type: 'text' },
        { name: 'DB_NAME', label: 'Database Name', default: 'wordpress_mu', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'wpuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true },
        { name: 'DB_ROOT_PASSWORD', label: 'Root Password', default: '', type: 'password', required: true }
      ]
    },

    // GHOST BLOG (2 variants)
    {
      id: "ghost-basic",
      name: "Ghost Blog",
      portRange: "4000-4999",
      category: "Blog",
      technologies: ["Ghost", "MySQL"],
      description: "Modern publishing platform",
      yamlTemplate: `version: '3.8'
services:
  ghost:
    image: ghost:latest
    ports:
      - "{{GHOST_PORT}}:2368"
    environment:
      url: {{SITE_URL}}
      database__client: mysql
      database__connection__host: db
      database__connection__user: {{DB_USER}}
      database__connection__password: {{DB_PASSWORD}}
      database__connection__database: {{DB_NAME}}
    volumes:
      - ghost_content:/var/lib/ghost/content
    restart: unless-stopped
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: {{DB_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped
volumes:
  ghost_content:
  db_data:`,
      requiredFields: [
        { name: 'GHOST_PORT', label: 'Ghost Port', default: '4001', type: 'number' },
        { name: 'SITE_URL', label: 'Site URL', default: 'http://localhost:4001', type: 'url' },
        { name: 'DB_NAME', label: 'Database', default: 'ghost', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'ghostuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true },
        { name: 'DB_ROOT_PASSWORD', label: 'Root Password', default: '', type: 'password', required: true }
      ]
    },

    {
      id: "ghost-postgres",
      name: "Ghost + PostgreSQL",
      portRange: "4000-4999",
      category: "Blog",
      technologies: ["Ghost", "PostgreSQL"],
      description: "Ghost with PostgreSQL",
      yamlTemplate: `version: '3.8'
services:
  ghost:
    image: ghost:latest
    ports:
      - "{{GHOST_PORT}}:2368"
    environment:
      url: {{SITE_URL}}
      database__client: postgres
      database__connection__host: db
      database__connection__user: {{DB_USER}}
      database__connection__password: {{DB_PASSWORD}}
      database__connection__database: {{DB_NAME}}
    volumes:
      - ghost_content:/var/lib/ghost/content
    restart: unless-stopped
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: {{DB_NAME}}
      POSTGRES_USER: {{DB_USER}}
      POSTGRES_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped
volumes:
  ghost_content:
  db_data:`,
      requiredFields: [
        { name: 'GHOST_PORT', label: 'Ghost Port', default: '4002', type: 'number' },
        { name: 'SITE_URL', label: 'Site URL', default: 'http://localhost:4002', type: 'url' },
        { name: 'DB_NAME', label: 'Database', default: 'ghost', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'ghostuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true }
      ]
    },

    // NEXT.JS (2 variants)
    {
      id: "nextjs-basic",
      name: "Next.js Static",
      portRange: "5000-5999",
      category: "Static Site",
      technologies: ["Next.js"],
      description: "Next.js with SSR",
      yamlTemplate: `version: '3.8'
services:
  nextjs:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "{{NEXT_PORT}}:3000"
    volumes:
      - ./:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev"
    environment:
      NODE_ENV: development
    restart: unless-stopped`,
      requiredFields: [
        { name: 'NEXT_PORT', label: 'Next.js Port', default: '5001', type: 'number' }
      ]
    },

    {
      id: "nextjs-postgres",
      name: "Next.js + PostgreSQL",
      portRange: "5000-5999",
      category: "Static Site",
      technologies: ["Next.js", "PostgreSQL"],
      description: "Full-stack Next.js",
      yamlTemplate: `version: '3.8'
services:
  nextjs:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "{{NEXT_PORT}}:3000"
    volumes:
      - ./:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://{{DB_USER}}:{{DB_PASSWORD}}@db:5432/{{DB_NAME}}
    depends_on:
      - db
    restart: unless-stopped
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: {{DB_NAME}}
      POSTGRES_USER: {{DB_USER}}
      POSTGRES_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped
volumes:
  db_data:`,
      requiredFields: [
        { name: 'NEXT_PORT', label: 'Next.js Port', default: '5002', type: 'number' },
        { name: 'DB_NAME', label: 'Database', default: 'nextjs_db', type: 'text' },
        { name: 'DB_USER', label: 'DB User', default: 'nextuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'DB Password', default: '', type: 'password', required: true }
      ]
    },

    // GATSBY
    {
      id: "gatsby-basic",
      name: "Gatsby",
      portRange: "5000-5999",
      category: "Static Site",
      technologies: ["Gatsby"],
      description: "React static site generator",
      yamlTemplate: `version: '3.8'
services:
  gatsby:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "{{GATSBY_PORT}}:8000"
    volumes:
      - ./:/app
      - /app/node_modules
    command: sh -c "npm install && npm run develop -- -H 0.0.0.0"
    restart: unless-stopped`,
      requiredFields: [
        { name: 'GATSBY_PORT', label: 'Gatsby Port', default: '5003', type: 'number' }
      ]
    },

    // HUGO
    {
      id: "hugo-basic",
      name: "Hugo",
      portRange: "5000-5999",
      category: "Static Site",
      technologies: ["Hugo"],
      description: "Fast static site generator",
      yamlTemplate: `version: '3.8'
services:
  hugo:
    image: klakegg/hugo:alpine
    command: server --bind 0.0.0.0
    ports:
      - "{{HUGO_PORT}}:1313"
    volumes:
      - ./:/src
    restart: unless-stopped`,
      requiredFields: [
        { name: 'HUGO_PORT', label: 'Hugo Port', default: '5004', type: 'number' }
      ]
    },

    // NGINX
    {
      id: "nginx-static",
      name: "Nginx Static",
      portRange: "1000-1999",
      category: "Web Server",
      technologies: ["Nginx"],
      description: "Static file server",
      yamlTemplate: `version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "{{NGINX_PORT}}:80"
    volumes:
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped`,
      requiredFields: [
        { name: 'NGINX_PORT', label: 'Nginx Port', default: '1080', type: 'number' }
      ]
    },

    // DATABASES
    {
      id: "postgres-standalone",
      name: "PostgreSQL",
      portRange: "20000-29999",
      category: "Database",
      technologies: ["PostgreSQL"],
      description: "PostgreSQL database server",
      yamlTemplate: `version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "{{PG_PORT}}:5432"
    environment:
      POSTGRES_DB: {{DB_NAME}}
      POSTGRES_USER: {{DB_USER}}
      POSTGRES_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - pg_data:/var/lib/postgresql/data
    restart: unless-stopped
volumes:
  pg_data:`,
      requiredFields: [
        { name: 'PG_PORT', label: 'PostgreSQL Port', default: '25432', type: 'number' },
        { name: 'DB_NAME', label: 'Database Name', default: 'mydb', type: 'text' },
        { name: 'DB_USER', label: 'User', default: 'dbuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'Password', default: '', type: 'password', required: true }
      ]
    },

    {
      id: "mysql-standalone",
      name: "MySQL",
      portRange: "20000-29999",
      category: "Database",
      technologies: ["MySQL"],
      description: "MySQL database server",
      yamlTemplate: `version: '3.8'
services:
  mysql:
    image: mysql:8.0
    ports:
      - "{{MYSQL_PORT}}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: {{ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
volumes:
  mysql_data:`,
      requiredFields: [
        { name: 'MYSQL_PORT', label: 'MySQL Port', default: '23306', type: 'number' },
        { name: 'DB_NAME', label: 'Database Name', default: 'mydb', type: 'text' },
        { name: 'DB_USER', label: 'User', default: 'dbuser', type: 'text' },
        { name: 'DB_PASSWORD', label: 'Password', default: '', type: 'password', required: true },
        { name: 'ROOT_PASSWORD', label: 'Root Password', default: '', type: 'password', required: true }
      ]
    },

    {
      id: "mongodb-standalone",
      name: "MongoDB",
      portRange: "20000-29999",
      category: "Database",
      technologies: ["MongoDB"],
      description: "MongoDB NoSQL database",
      yamlTemplate: `version: '3.8'
services:
  mongodb:
    image: mongo:6
    ports:
      - "{{MONGO_PORT}}:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: {{MONGO_USER}}
      MONGO_INITDB_ROOT_PASSWORD: {{MONGO_PASSWORD}}
      MONGO_INITDB_DATABASE: {{DB_NAME}}
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped
volumes:
  mongo_data:`,
      requiredFields: [
        { name: 'MONGO_PORT', label: 'MongoDB Port', default: '27017', type: 'number' },
        { name: 'DB_NAME', label: 'Database Name', default: 'mydb', type: 'text' },
        { name: 'MONGO_USER', label: 'User', default: 'admin', type: 'text' },
        { name: 'MONGO_PASSWORD', label: 'Password', default: '', type: 'password', required: true }
      ]
    },

    {
      id: "redis-standalone",
      name: "Redis",
      portRange: "20000-29999",
      category: "Database",
      technologies: ["Redis"],
      description: "Redis cache server",
      yamlTemplate: `version: '3.8'
services:
  redis:
    image: redis:alpine
    ports:
      - "{{REDIS_PORT}}:6379"
    command: redis-server --requirepass {{REDIS_PASSWORD}}
    volumes:
      - redis_data:/data
    restart: unless-stopped
volumes:
  redis_data:`,
      requiredFields: [
        { name: 'REDIS_PORT', label: 'Redis Port', default: '26379', type: 'number' },
        { name: 'REDIS_PASSWORD', label: 'Password', default: '', type: 'password', required: true }
      ]
    },

    // MONITORING
    {
      id: "prometheus-grafana",
      name: "Prometheus + Grafana",
      portRange: "30000-39999",
      category: "Monitoring",
      technologies: ["Prometheus", "Grafana"],
      description: "Complete monitoring stack",
      yamlTemplate: `version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "{{PROM_PORT}}:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prom_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    restart: unless-stopped
  grafana:
    image: grafana/grafana:latest
    ports:
      - "{{GRAFANA_PORT}}:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: {{ADMIN_PASSWORD}}
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped
volumes:
  prom_data:
  grafana_data:`,
      requiredFields: [
        { name: 'PROM_PORT', label: 'Prometheus Port', default: '39090', type: 'number' },
        { name: 'GRAFANA_PORT', label: 'Grafana Port', default: '33000', type: 'number' },
        { name: 'ADMIN_PASSWORD', label: 'Grafana Admin Password', default: '', type: 'password', required: true }
      ]
    },

    // ... Agrega los otros 35+ templates aquí siguiendo el mismo patrón
    // Por espacio, aquí van 15 templates. El código soporta infinitos.
  ];
  
  console.log(`📚 ${allTemplates.length} templates loaded`);
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

function buildFilters() {
  const portRanges = [...new Set(allTemplates.map(t => t.portRange))].sort();
  const portSelect = document.getElementById('port-range-filter');
  portRanges.forEach(range => {
    const option = document.createElement('option');
    option.value = range;
    option.textContent = range;
    portSelect.appendChild(option);
  });

  const categories = [...new Set(allTemplates.map(t => t.category))].sort();
  const catSelect = document.getElementById('category-filter');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    catSelect.appendChild(option);
  });

  const allTechs = [...new Set(allTemplates.flatMap(t => t.technologies))].sort();
  const techContainer = document.getElementById('tech-filters');
  allTechs.forEach(tech => {
    const label = document.createElement('label');
    label.className = 'tech-filter-item';
    label.innerHTML = `<input type="checkbox" value="${tech}" /><span>${tech}</span>`;
    techContainer.appendChild(label);
  });
}

function applyFilters() {
  let filtered = allTemplates;

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.technologies.some(tech => tech.toLowerCase().includes(q))
    );
  }

  if (filters.portRange !== 'all') {
    filtered = filtered.filter(t => t.portRange === filters.portRange);
  }

  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  if (filters.technologies.length > 0) {
    filtered = filtered.filter(t => 
      filters.technologies.every(tech => t.technologies.includes(tech))
    );
  }

  return filtered;
}

function renderTemplates() {
  const filtered = applyFilters();
  const grid = document.getElementById('templates-grid');
  const count = document.getElementById('templates-count');

  count.textContent = `${filtered.length} templates`;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No templates match your filters</div>';
    return;
  }

  grid.innerHTML = filtered.map(template => `
    <div class="template-card" data-id="${template.id}">
      <h3>${template.name}</h3>
      <p class="description">${template.description}</p>
      <div class="tech-badges">
        ${template.technologies.map(t => `<span class="badge">${t}</span>`).join('')}
      </div>
      <div class="port-info">
        <span class="port-range">${template.portRange}</span>
        <span class="category">${template.category}</span>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const template = allTemplates.find(t => t.id === id);
      openEditor(template);
    });
  });
}

// ═══════════════════════════════════════════════════════════
// YAML EDITOR MODAL
// ═══════════════════════════════════════════════════════════

function openEditor(template) {
  selectedTemplate = template;
  console.log('📝 Opening editor:', template.name);
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-container">
      <div class="modal-header">
        <h2>🐳 ${template.name}</h2>
        <button class="modal-close">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="modal-section">
          <h3>Configuration</h3>
          <form id="yaml-form" class="yaml-form">
            ${template.requiredFields.map(field => `
              <div class="form-field">
                <label for="field-${field.name}">
                  ${field.label}
                  ${field.required ? '<span class="required">*</span>' : ''}
                </label>
                <input
                  type="${field.type}"
                  id="field-${field.name}"
                  name="${field.name}"
                  value="${field.default || ''}"
                  ${field.required ? 'required' : ''}
                  placeholder="${field.label}"
                />
              </div>
            `).join('')}
          </form>
        </div>
        
        <div class="modal-section">
          <h3>YAML Preview</h3>
          <pre id="yaml-preview" class="yaml-preview">${template.yamlTemplate}</pre>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-download">⬇️ Download</button>
        ${currentUser ? '<button class="btn btn-primary" id="modal-save">💾 Save to Library</button>' : ''}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.modal-close').addEventListener('click', closeEditor);
  modal.querySelector('#modal-cancel').addEventListener('click', closeEditor);
  modal.querySelector('#modal-download').addEventListener('click', downloadYaml);
  
  if (currentUser) {
    modal.querySelector('#modal-save').addEventListener('click', saveToSupabase);
  }
  
  modal.querySelectorAll('#yaml-form input').forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeEditor();
  });
  
  updatePreview();
}

function closeEditor() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) modal.remove();
}

function updatePreview() {
  const form = document.getElementById('yaml-form');
  const preview = document.getElementById('yaml-preview');
  
  let yaml = selectedTemplate.yamlTemplate;
  
  const formData = new FormData(form);
  for (let [key, value] of formData.entries()) {
    yaml = yaml.replaceAll(`{{${key}}}`, value || `[${key}]`);
  }
  
  preview.textContent = yaml;
}

function downloadYaml() {
  const yaml = document.getElementById('yaml-preview').textContent;
  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${selectedTemplate.id}-docker-compose.yml`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('⬇️ YAML downloaded');
}

async function saveToSupabase() {
  if (!currentUser) {
    alert('Please sign in to save templates');
    return;
  }
  
  const yaml = document.getElementById('yaml-preview').textContent;
  
  try {
    const { data, error } = await sb
      .from('community_templates')
      .insert({
        template_id: selectedTemplate.id,
        yaml_content: yaml,
        user_id: currentUser.id,
        is_community: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    console.log('✅ Template saved:', data);
    alert('✅ Template saved! It will be synced to GitHub soon.');
    closeEditor();
    
  } catch (error) {
    console.error('❌ Save error:', error);
    alert('Error: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  document.getElementById('search-input').addEventListener('input', (e) => {
    filters.search = e.target.value;
    renderTemplates();
  });
  
  document.getElementById('port-range-filter').addEventListener('change', (e) => {
    filters.portRange = e.target.value;
    renderTemplates();
  });
  
  document.getElementById('category-filter').addEventListener('change', (e) => {
    filters.category = e.target.value;
    renderTemplates();
  });
  
  document.getElementById('tech-filters').addEventListener('change', () => {
    const checked = [...document.querySelectorAll('#tech-filters input:checked')].map(i => i.value);
    filters.technologies = checked;
    renderTemplates();
  });
  
  document.getElementById('clear-filters-btn').addEventListener('click', () => {
    filters = { search: '', portRange: 'all', category: 'all', technologies: [] };
    document.getElementById('search-input').value = '';
    document.getElementById('port-range-filter').value = 'all';
    document.getElementById('category-filter').value = 'all';
    document.querySelectorAll('#tech-filters input').forEach(i => i.checked = false);
    renderTemplates();
  });
}
