// ═══════════════════════════════════════════════════════════
// THE DOCKER LIBRARY - COMPLETE LOGIC
// ═══════════════════════════════════════════════════════════

// SUPABASE CONFIG
const SUPABASE_URL = 'https://jdjyvftusbnpyrdfmfvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkanl2ZnR1c2JucHlyZGZtZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDM4ODksImV4cCI6MjA4OTE3OTg4OX0.pOUwRAOqANDRwaoAXg7VAMEGipzLa7coPuObihfcC0I';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// STATE
let currentUser = null;
let selectedTemplate = null;
let filteredTemplates = [];

// ═══════════════════════════════════════════════════════════
// PORT RANGES DATABASE
// ═══════════════════════════════════════════════════════════

const PORT_RANGES = {
  "1024-19999": {
    name: "Websites",
    icon: "🌐",
    categories: {
      "WordPress Multisite": {
        useCase: "Enterprise WordPress networks, multi-tenant blogs",
        technologies: ["WordPress MU", "Bedrock"]
      },
      "WordPress Single": {
        useCase: "Individual WordPress installations",
        technologies: ["WordPress", "MySQL", "Redis", "WP Engine"]
      },
      "Static Sites": {
        useCase: "JAMstack sites, documentation",
        technologies: ["Next.js", "Gatsby", "Hugo", "Jekyll"]
      },
      "Ghost Blogs": {
        useCase: "Modern publishing platforms",
        technologies: ["Ghost", "MySQL"]
      }
    }
  },
  "20000-29999": {
    name: "Applications",
    icon: "🚀",
    categories: {
      "Databases": {
        useCase: "Relational and NoSQL databases",
        technologies: ["PostgreSQL", "MySQL", "MongoDB", "MariaDB"]
      },
      "Cache Systems": {
        useCase: "In-memory data stores",
        technologies: ["Redis", "Memcached"]
      },
      "REST APIs": {
        useCase: "RESTful web services",
        technologies: ["Express.js", "FastAPI", "Django REST", "Flask"]
      },
      "Message Queues": {
        useCase: "Async processing and job queues",
        technologies: ["RabbitMQ", "Celery", "Kafka"]
      }
    }
  },
  "30000-39999": {
    name: "DevOps Tools",
    icon: "⚙️",
    categories: {
      "Monitoring": {
        useCase: "System and application monitoring",
        technologies: ["Prometheus", "Grafana", "Zabbix"]
      },
      "CI/CD Pipelines": {
        useCase: "Continuous integration/deployment",
        technologies: ["Jenkins", "GitLab CI", "DroneCI"]
      },
      "Log Aggregation": {
        useCase: "Centralized logging",
        technologies: ["ELK Stack", "Graylog", "Loki"]
      }
    }
  }
};

// TEMPLATES DATABASE
const TEMPLATES = [
  {
    id: "wp-mysql-redis",
    name: "WordPress + MySQL + Redis",
    portRange: "2000-2999",
    category: "WordPress Single",
    technologies: ["WordPress", "MySQL", "Redis"],
    description: "Complete WordPress stack with MySQL database and Redis caching for optimal performance",
    yamlTemplate: `version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - "{{WP_PORT}}:80"
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_NAME: {{DB_NAME}}
      WORDPRESS_DB_USER: {{DB_USER}}
      WORDPRESS_DB_PASSWORD: {{DB_PASSWORD}}
    restart: unless-stopped
    depends_on:
      - mysql
      - redis
    volumes:
      - wordpress_data:/var/www/html
      
  mysql:
    image: mysql:8.0
    ports:
      - "{{MYSQL_PORT}}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: {{MYSQL_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
      
  redis:
    image: redis:alpine
    ports:
      - "{{REDIS_PORT}}:6379"
    command: redis-server --requirepass {{REDIS_PASSWORD}}
    restart: unless-stopped
    
volumes:
  wordpress_data:
  mysql_data:
`,
    requiredFields: [
      { key: "WP_PORT", label: "WordPress Port", type: "number", default: 2001, min: 2000, max: 2999, hint: "Public port for WordPress" },
      { key: "MYSQL_PORT", label: "MySQL Port", type: "number", default: 20001, min: 20000, max: 20999, hint: "Internal database port" },
      { key: "REDIS_PORT", label: "Redis Port", type: "number", default: 21001, min: 21000, max: 21999, hint: "Cache system port" },
      { key: "DB_NAME", label: "Database Name", type: "text", placeholder: "wordpress_db", hint: "Name for your WordPress database" },
      { key: "DB_USER", label: "MySQL User", type: "text", placeholder: "wp_user", hint: "Database username" },
      { key: "DB_PASSWORD", label: "MySQL Password", type: "password", placeholder: "********", hint: "Strong password for database" },
      { key: "MYSQL_ROOT_PASSWORD", label: "MySQL Root Password", type: "password", placeholder: "********", hint: "Root database password" },
      { key: "REDIS_PASSWORD", label: "Redis Password", type: "password", placeholder: "********", hint: "Cache authentication password" }
    ]
  },
  
  {
    id: "nextjs-postgres",
    name: "Next.js + PostgreSQL",
    portRange: "5000-5999",
    category: "Static Sites",
    technologies: ["Next.js", "PostgreSQL"],
    description: "Modern React framework with PostgreSQL database for full-stack applications",
    yamlTemplate: `version: '3.8'

services:
  nextjs:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "{{NEXTJS_PORT}}:3000"
    environment:
      DATABASE_URL: postgresql://{{DB_USER}}:{{DB_PASSWORD}}@postgres:5432/{{DB_NAME}}
      NODE_ENV: production
    volumes:
      - ./app:/app
      - /app/node_modules
    command: sh -c "npm install && npm run build && npm start"
    depends_on:
      - postgres
    restart: unless-stopped
      
  postgres:
    image: postgres:15-alpine
    ports:
      - "{{POSTGRES_PORT}}:5432"
    environment:
      POSTGRES_USER: {{DB_USER}}
      POSTGRES_PASSWORD: {{DB_PASSWORD}}
      POSTGRES_DB: {{DB_NAME}}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
volumes:
  postgres_data:
`,
    requiredFields: [
      { key: "NEXTJS_PORT", label: "Next.js Port", type: "number", default: 5001, min: 5000, max: 5999, hint: "Public web server port" },
      { key: "POSTGRES_PORT", label: "PostgreSQL Port", type: "number", default: 20002, min: 20000, max: 20999, hint: "Database port" },
      { key: "DB_NAME", label: "Database Name", type: "text", placeholder: "nextjs_db", hint: "Application database name" },
      { key: "DB_USER", label: "PostgreSQL User", type: "text", placeholder: "nextjs_user", hint: "Database username" },
      { key: "DB_PASSWORD", label: "PostgreSQL Password", type: "password", placeholder: "********", hint: "Secure database password" }
    ]
  },
  
  {
    id: "prometheus-grafana",
    name: "Prometheus + Grafana",
    portRange: "30000-30999",
    category: "Monitoring",
    technologies: ["Prometheus", "Grafana"],
    description: "Complete monitoring stack with metrics collection and visualization dashboards",
    yamlTemplate: `version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "{{PROMETHEUS_PORT}}:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
    restart: unless-stopped
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "{{GRAFANA_PORT}}:3000"
    environment:
      GF_SECURITY_ADMIN_USER: {{GRAFANA_USER}}
      GF_SECURITY_ADMIN_PASSWORD: {{GRAFANA_PASSWORD}}
      GF_INSTALL_PLUGINS: grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    restart: unless-stopped
    
volumes:
  prometheus_data:
  grafana_data:
`,
    requiredFields: [
      { key: "PROMETHEUS_PORT", label: "Prometheus Port", type: "number", default: 30001, min: 30000, max: 30999, hint: "Metrics collection port" },
      { key: "GRAFANA_PORT", label: "Grafana Port", type: "number", default: 30002, min: 30000, max: 30999, hint: "Dashboard interface port" },
      { key: "GRAFANA_USER", label: "Grafana Admin User", type: "text", default: "admin", hint: "Dashboard admin username" },
      { key: "GRAFANA_PASSWORD", label: "Grafana Admin Password", type: "password", placeholder: "********", hint: "Strong admin password" }
    ]
  },

  {
    id: "ghost-mysql",
    name: "Ghost + MySQL",
    portRange: "4000-4999",
    category: "Ghost Blogs",
    technologies: ["Ghost", "MySQL"],
    description: "Modern publishing platform for professional blogs and content sites",
    yamlTemplate: `version: '3.8'

services:
  ghost:
    image: ghost:latest
    ports:
      - "{{GHOST_PORT}}:2368"
    environment:
      url: http://{{SITE_URL}}
      database__client: mysql
      database__connection__host: mysql
      database__connection__user: {{DB_USER}}
      database__connection__password: {{DB_PASSWORD}}
      database__connection__database: {{DB_NAME}}
    volumes:
      - ghost_data:/var/lib/ghost/content
    depends_on:
      - mysql
    restart: unless-stopped
      
  mysql:
    image: mysql:8.0
    ports:
      - "{{MYSQL_PORT}}:3306"
    environment:
      MYSQL_ROOT_PASSWORD: {{MYSQL_ROOT_PASSWORD}}
      MYSQL_DATABASE: {{DB_NAME}}
      MYSQL_USER: {{DB_USER}}
      MYSQL_PASSWORD: {{DB_PASSWORD}}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped
    
volumes:
  ghost_data:
  mysql_data:
`,
    requiredFields: [
      { key: "GHOST_PORT", label: "Ghost Port", type: "number", default: 4001, min: 4000, max: 4999, hint: "Blog web server port" },
      { key: "SITE_URL", label: "Site URL", type: "text", placeholder: "localhost:4001", hint: "Your blog's URL" },
      { key: "MYSQL_PORT", label: "MySQL Port", type: "number", default: 20003, min: 20000, max: 20999, hint: "Database port" },
      { key: "DB_NAME", label: "Database Name", type: "text", placeholder: "ghost_db", hint: "Ghost database name" },
      { key: "DB_USER", label: "MySQL User", type: "text", placeholder: "ghost_user", hint: "Database username" },
      { key: "DB_PASSWORD", label: "MySQL Password", type: "password", placeholder: "********", hint: "Database password" },
      { key: "MYSQL_ROOT_PASSWORD", label: "MySQL Root Password", type: "password", placeholder: "********", hint: "Root password" }
    ]
  }
];

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  initFilters();
  setupEventListeners();
  await checkAuth();
});

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════

async function checkAuth() {
  try {
    const { data: { session } } = await sb.auth.getSession();
    
    if (session) {
      currentUser = session.user;
      showAuthenticatedUI();
    } else {
      showUnauthenticatedUI();
    }
  } catch (error) {
    console.log('No active session');
    showUnauthenticatedUI();
  }

  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      showAuthenticatedUI();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      showUnauthenticatedUI();
    }
  });
}

function showAuthenticatedUI() {
  document.getElementById('login-btn').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('user-email').textContent = currentUser.email;
}

function showUnauthenticatedUI() {
  document.getElementById('login-btn').style.display = 'block';
  document.getElementById('user-info').style.display = 'none';
}

async function login() {
  try {
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });
    if (error) throw error;
  } catch (error) {
    console.error('Login error:', error);
    alert('Error al iniciar sesión: ' + error.message);
  }
}

async function logout() {
  try {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ═══════════════════════════════════════════════════════════
// FILTERS
// ═══════════════════════════════════════════════════════════

function initFilters() {
  const portRangeSelect = document.getElementById('port-range-filter');
  
  Object.keys(PORT_RANGES).forEach(range => {
    const option = document.createElement('option');
    option.value = range;
    option.textContent = `${PORT_RANGES[range].icon} ${PORT_RANGES[range].name} (${range})`;
    portRangeSelect.appendChild(option);
  });
}

function handlePortRangeChange(range) {
  const categorySelect = document.getElementById('category-filter');
  const useCaseSelect = document.getElementById('usecase-filter');
  const techCheckboxes = document.getElementById('tech-checkboxes');
  
  // Reset downstream filters
  categorySelect.innerHTML = '<option value="">-- Select a category --</option>';
  useCaseSelect.innerHTML = '<option value="">-- Select a use case --</option>';
  techCheckboxes.innerHTML = '<p class="empty-state">Select a category to see available technologies</p>';
  
  categorySelect.disabled = !range;
  useCaseSelect.disabled = true;
  techCheckboxes.classList.add('disabled');
  document.getElementById('find-templates-btn').disabled = true;
  
  if (!range) return;
  
  const categories = PORT_RANGES[range].categories;
  Object.keys(categories).forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

function handleCategoryChange(portRange, category) {
  const useCaseSelect = document.getElementById('usecase-filter');
  const techCheckboxes = document.getElementById('tech-checkboxes');
  
  useCaseSelect.innerHTML = '<option value="">-- Select a use case --</option>';
  techCheckboxes.innerHTML = '<p class="empty-state">Select a category to see available technologies</p>';
  
  useCaseSelect.disabled = !category;
  techCheckboxes.classList.add('disabled');
  document.getElementById('find-templates-btn').disabled = !category;
  
  if (!category) return;
  
  const categoryData = PORT_RANGES[portRange].categories[category];
  
  // Use Case
  const option = document.createElement('option');
  option.value = categoryData.useCase;
  option.textContent = categoryData.useCase;
  useCaseSelect.appendChild(option);
  useCaseSelect.value = categoryData.useCase;
  
  // Technologies
  techCheckboxes.innerHTML = '';
  techCheckboxes.classList.remove('disabled');
  
  categoryData.technologies.forEach(tech => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${tech}">
      ${tech}
    `;
    techCheckboxes.appendChild(label);
  });
}

function findTemplates() {
  const portRange = document.getElementById('port-range-filter').value;
  const category = document.getElementById('category-filter').value;
  const selectedTechs = Array.from(document.querySelectorAll('#tech-checkboxes input:checked'))
    .map(cb => cb.value);
  
  filteredTemplates = TEMPLATES.filter(template => {
    const [rangeStart, rangeEnd] = portRange.split('-').map(Number);
    const [templateStart] = template.portRange.split('-').map(Number);
    
    const matchesRange = templateStart >= rangeStart && templateStart <= rangeEnd;
    const matchesCategory = template.category === category;
    const matchesTech = selectedTechs.length === 0 || 
                       selectedTechs.every(tech => template.technologies.includes(tech));
    
    return matchesRange && matchesCategory && matchesTech;
  });
  
  displayResults();
}

function displayResults() {
  const resultsSection = document.getElementById('results-section');
  const templateCards = document.getElementById('template-cards');
  const resultsCount = document.getElementById('results-count');
  
  templateCards.innerHTML = '';
  resultsCount.textContent = `${filteredTemplates.length} template(s) found`;
  
  if (filteredTemplates.length === 0) {
    templateCards.innerHTML = '<p class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 3rem;">No templates match your criteria. Try adjusting your filters.</p>';
  } else {
    filteredTemplates.forEach(template => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <h3>${template.name}</h3>
        <p>${template.description}</p>
        <div class="tech-badges">
          ${template.technologies.map(tech => `<span class="badge">${tech}</span>`).join('')}
        </div>
        <button class="btn btn-primary" onclick="selectTemplate('${template.id}')">
          View Template
        </button>
      `;
      templateCards.appendChild(card);
    });
  }
  
  resultsSection.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════════════════
// PREVIEW
// ═══════════════════════════════════════════════════════════

function selectTemplate(templateId) {
  selectedTemplate = TEMPLATES.find(t => t.id === templateId);
  showPreviewModal();
}

function showPreviewModal() {
  const modal = document.getElementById('preview-modal');
  const previewCode = document.getElementById('yaml-preview');
  const templateName = document.getElementById('preview-template-name');
  const technologies = document.getElementById('preview-technologies');
  
  templateName.textContent = selectedTemplate.name;
  technologies.textContent = selectedTemplate.technologies.join(', ');
  previewCode.textContent = selectedTemplate.yamlTemplate;
  
  modal.classList.add('active');
}

function closePreviewModal() {
  document.getElementById('preview-modal').classList.remove('active');
}

async function saveTemplateToSupabase() {
  if (!currentUser) {
    alert('⚠️ You must be logged in to save templates to the community');
    return;
  }
  
  try {
    const { data, error } = await sb
      .from('community_templates')
      .insert({
        template_id: selectedTemplate.id,
        yaml_content: selectedTemplate.yamlTemplate,
        user_id: currentUser.id,
        is_community: false
      });
    
    if (error) throw error;
    
    alert('✅ Template saved! It will be added to the community library after review.');
  } catch (error) {
    console.error('Error saving template:', error);
    alert('❌ Error: ' + error.message);
  }
}

function startCustomization() {
  closePreviewModal();
  showPersonalizationForm();
}

// ═══════════════════════════════════════════════════════════
// PERSONALIZATION
// ═══════════════════════════════════════════════════════════

function showPersonalizationForm() {
  const section = document.getElementById('personalization-section');
  const dynamicFields = document.getElementById('dynamic-fields');
  
  dynamicFields.innerHTML = '';
  
  selectedTemplate.requiredFields.forEach(field => {
    const fieldGroup = document.createElement('div');
    fieldGroup.className = 'field-group';
    
    fieldGroup.innerHTML = `
      <label for="${field.key}">
        ${field.label}
        ${field.hint ? `<span style="color: var(--caramel); font-weight: 400; font-size: 0.85rem;"> — ${field.hint}</span>` : ''}
      </label>
      <input 
        type="${field.type}" 
        id="${field.key}"
        name="${field.key}"
        placeholder="${field.placeholder || ''}"
        ${field.min ? `min="${field.min}"` : ''}
        ${field.max ? `max="${field.max}"` : ''}
        ${field.default ? `value="${field.default}"` : ''}
        required
      >
    `;
    
    dynamicFields.appendChild(fieldGroup);
  });
  
  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  document.getElementById('yaml-form').addEventListener('input', validateForm);
}

function validateForm() {
  const form = document.getElementById('yaml-form');
  const isValid = form.checkValidity();
  document.getElementById('generate-yaml-btn').disabled = !isValid;
}

function generateFinalYAML(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  let finalYAML = selectedTemplate.yamlTemplate;
  
  formData.forEach((value, key) => {
    finalYAML = finalYAML.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  document.getElementById('final-yaml-code').textContent = finalYAML;
  document.getElementById('final-yaml-section').style.display = 'block';
  document.getElementById('final-yaml-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function copyFinalYAML() {
  const yaml = document.getElementById('final-yaml-code').textContent;
  navigator.clipboard.writeText(yaml);
  
  const btn = document.getElementById('copy-final-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ Copied!';
  setTimeout(() => {
    btn.innerHTML = originalText;
  }, 2000);
}

function downloadFinalYAML() {
  const yaml = document.getElementById('final-yaml-code').textContent;
  const blob = new Blob([yaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'docker-compose.yml';
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  document.getElementById('port-range-filter').addEventListener('change', (e) => {
    handlePortRangeChange(e.target.value);
  });
  
  document.getElementById('category-filter').addEventListener('change', (e) => {
    const portRange = document.getElementById('port-range-filter').value;
    handleCategoryChange(portRange, e.target.value);
  });
  
  document.getElementById('find-templates-btn').addEventListener('click', findTemplates);
  document.getElementById('save-template-btn').addEventListener('click', saveTemplateToSupabase);
  document.getElementById('customize-btn').addEventListener('click', startCustomization);
  
  document.getElementById('yaml-form').addEventListener('submit', generateFinalYAML);
  document.getElementById('copy-final-btn').addEventListener('click', copyFinalYAML);
  document.getElementById('download-final-btn').addEventListener('click', downloadFinalYAML);
}

// Global functions
window.selectTemplate = selectTemplate;
window.closePreviewModal = closePreviewModal;