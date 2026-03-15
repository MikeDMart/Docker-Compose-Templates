// ═══════════════════════════════════════════════════════════
// THE DOCKER LIBRARY V2 - MASSIVE LIBRARY + HORIZONTAL FILTERS
// ═══════════════════════════════════════════════════════════

// SUPABASE CONFIG
const SUPABASE_URL = 'https://jdjyvftusbnpyrdfmfvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkanl2ZnR1c2JucHlyZGZtZnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDM4ODksImV4cCI6MjA4OTE3OTg4OX0.pOUwRAOqANDRwaoAXg7VAMEGipzLa7coPuObihfcC0I';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
// MASSIVE TEMPLATES LIBRARY (50+)
// ═══════════════════════════════════════════════════════════

const TEMPLATES_LIBRARY = [
  // WEBSITES (1024-19999)
  {
    id: "wp-basic",
    name: "WordPress Basic",
    portRange: "2000-2999",
    category: "WordPress",
    technologies: ["WordPress", "MySQL"],
    description: "Simple WordPress with MySQL database",
    ports: { web: 2001, db: 20001 }
  },
  {
    id: "wp-redis",
    name: "WordPress + Redis",
    portRange: "2000-2999",
    category: "WordPress",
    technologies: ["WordPress", "MySQL", "Redis"],
    description: "WordPress with Redis caching for better performance",
    ports: { web: 2002, db: 20002, cache: 21001 }
  },
  {
    id: "wp-multisite",
    name: "WordPress Multisite",
    portRange: "1024-1999",
    category: "WordPress",
    technologies: ["WordPress MU", "MySQL", "Redis"],
    description: "Enterprise WordPress network with multi-tenancy",
    ports: { web: 1024, db: 20003, cache: 21002 }
  },
  {
    id: "ghost-basic",
    name: "Ghost Blog",
    portRange: "4000-4999",
    category: "Blog",
    technologies: ["Ghost", "MySQL"],
    description: "Modern publishing platform for professional blogs",
    ports: { web: 4001, db: 20004 }
  },
  {
    id: "ghost-postgres",
    name: "Ghost + PostgreSQL",
    portRange: "4000-4999",
    category: "Blog",
    technologies: ["Ghost", "PostgreSQL"],
    description: "Ghost with PostgreSQL for better scalability",
    ports: { web: 4002, db: 20005 }
  },
  {
    id: "nextjs-basic",
    name: "Next.js Static",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Next.js"],
    description: "Next.js static site with server-side rendering",
    ports: { web: 5001 }
  },
  {
    id: "nextjs-postgres",
    name: "Next.js + PostgreSQL",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Next.js", "PostgreSQL"],
    description: "Full-stack Next.js with PostgreSQL database",
    ports: { web: 5002, db: 20006 }
  },
  {
    id: "gatsby-basic",
    name: "Gatsby",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Gatsby"],
    description: "React-based static site generator",
    ports: { web: 5003 }
  },
  {
    id: "hugo-basic",
    name: "Hugo",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Hugo"],
    description: "Fast static site generator written in Go",
    ports: { web: 5004 }
  },
  {
    id: "jekyll-basic",
    name: "Jekyll",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Jekyll"],
    description: "Ruby-based static site generator",
    ports: { web: 5005 }
  },
  {
    id: "astro-basic",
    name: "Astro",
    portRange: "5000-5999",
    category: "Static Site",
    technologies: ["Astro"],
    description: "Modern static site builder with partial hydration",
    ports: { web: 5006 }
  },
  {
    id: "nextcloud-basic",
    name: "NextCloud",
    portRange: "3000-3999",
    category: "Cloud Storage",
    technologies: ["NextCloud", "PostgreSQL", "Redis"],
    description: "Self-hosted cloud storage and collaboration platform",
    ports: { web: 3001, db: 20007, cache: 21003 }
  },
  
  // APPLICATIONS (20000-29999)
  {
    id: "postgres-basic",
    name: "PostgreSQL",
    portRange: "20000-20999",
    category: "Database",
    technologies: ["PostgreSQL"],
    description: "Powerful open-source relational database",
    ports: { db: 20010 }
  },
  {
    id: "mysql-basic",
    name: "MySQL",
    portRange: "20000-20999",
    category: "Database",
    technologies: ["MySQL"],
    description: "Popular open-source relational database",
    ports: { db: 20011 }
  },
  {
    id: "mongodb-basic",
    name: "MongoDB",
    portRange: "20000-20999",
    category: "Database",
    technologies: ["MongoDB"],
    description: "NoSQL document database",
    ports: { db: 20012 }
  },
  {
    id: "mariadb-basic",
    name: "MariaDB",
    portRange: "20000-20999",
    category: "Database",
    technologies: ["MariaDB"],
    description: "MySQL fork with enhanced features",
    ports: { db: 20013 }
  },
  {
    id: "redis-basic",
    name: "Redis",
    portRange: "21000-21999",
    category: "Cache",
    technologies: ["Redis"],
    description: "In-memory data structure store",
    ports: { cache: 21010 }
  },
  {
    id: "memcached-basic",
    name: "Memcached",
    portRange: "21000-21999",
    category: "Cache",
    technologies: ["Memcached"],
    description: "High-performance distributed memory caching",
    ports: { cache: 21011 }
  },
  {
    id: "rabbitmq-basic",
    name: "RabbitMQ",
    portRange: "22000-22999",
    category: "Message Queue",
    technologies: ["RabbitMQ"],
    description: "Reliable message broker",
    ports: { mq: 22001, management: 22002 }
  },
  {
    id: "kafka-basic",
    name: "Apache Kafka",
    portRange: "22000-22999",
    category: "Message Queue",
    technologies: ["Kafka", "Zookeeper"],
    description: "Distributed streaming platform",
    ports: { kafka: 22003, zookeeper: 22004 }
  },
  {
    id: "express-api",
    name: "Express.js API",
    portRange: "23000-23999",
    category: "API",
    technologies: ["Express.js", "Node.js"],
    description: "Fast Node.js web framework for APIs",
    ports: { api: 23001 }
  },
  {
    id: "fastapi-basic",
    name: "FastAPI",
    portRange: "23000-23999",
    category: "API",
    technologies: ["FastAPI", "Python"],
    description: "Modern Python web framework",
    ports: { api: 23002 }
  },
  {
    id: "django-api",
    name: "Django REST",
    portRange: "23000-23999",
    category: "API",
    technologies: ["Django", "PostgreSQL"],
    description: "Powerful Python REST framework",
    ports: { api: 23003, db: 20014 }
  },
  {
    id: "flask-api",
    name: "Flask API",
    portRange: "23000-23999",
    category: "API",
    technologies: ["Flask", "Python"],
    description: "Lightweight Python micro-framework",
    ports: { api: 23004 }
  },
  {
    id: "graphql-apollo",
    name: "Apollo GraphQL",
    portRange: "24000-24999",
    category: "GraphQL",
    technologies: ["Apollo", "Node.js"],
    description: "Modern GraphQL server",
    ports: { api: 24001 }
  },
  {
    id: "hasura-graphql",
    name: "Hasura GraphQL",
    portRange: "24000-24999",
    category: "GraphQL",
    technologies: ["Hasura", "PostgreSQL"],
    description: "Instant GraphQL on PostgreSQL",
    ports: { api: 24002, db: 20015 }
  },
  
  // DEVOPS (30000-39999)
  {
    id: "prometheus-grafana",
    name: "Prometheus + Grafana",
    portRange: "30000-30999",
    category: "Monitoring",
    technologies: ["Prometheus", "Grafana"],
    description: "Complete monitoring and visualization stack",
    ports: { prometheus: 30001, grafana: 30002 }
  },
  {
    id: "elk-stack",
    name: "ELK Stack",
    portRange: "31000-31999",
    category: "Logging",
    technologies: ["Elasticsearch", "Logstash", "Kibana"],
    description: "Centralized logging and analysis",
    ports: { elasticsearch: 31001, logstash: 31002, kibana: 31003 }
  },
  {
    id: "graylog",
    name: "Graylog",
    portRange: "31000-31999",
    category: "Logging",
    technologies: ["Graylog", "MongoDB", "Elasticsearch"],
    description: "Log management platform",
    ports: { graylog: 31004, db: 20016, search: 31005 }
  },
  {
    id: "jenkins",
    name: "Jenkins",
    portRange: "33000-33999",
    category: "CI/CD",
    technologies: ["Jenkins"],
    description: "Automation server for CI/CD",
    ports: { web: 33001, agent: 33002 }
  },
  {
    id: "gitlab-ci",
    name: "GitLab CI",
    portRange: "33000-33999",
    category: "CI/CD",
    technologies: ["GitLab", "PostgreSQL", "Redis"],
    description: "Complete DevOps platform",
    ports: { web: 33003, db: 20017, cache: 21012 }
  },
  {
    id: "drone-ci",
    name: "Drone CI",
    portRange: "33000-33999",
    category: "CI/CD",
    technologies: ["Drone"],
    description: "Container-native CI/CD",
    ports: { web: 33004 }
  },
  {
    id: "sonarqube",
    name: "SonarQube",
    portRange: "37000-37999",
    category: "Code Quality",
    technologies: ["SonarQube", "PostgreSQL"],
    description: "Code quality and security analysis",
    ports: { web: 37001, db: 20018 }
  },
  {
    id: "nexus",
    name: "Nexus Repository",
    portRange: "38000-38999",
    category: "Artifact Management",
    technologies: ["Nexus"],
    description: "Universal artifact repository",
    ports: { web: 38001 }
  },
  
  // INFRASTRUCTURE (40000-49999)
  {
    id: "traefik",
    name: "Traefik",
    portRange: "40000-40999",
    category: "Reverse Proxy",
    technologies: ["Traefik"],
    description: "Cloud-native edge router",
    ports: { http: 80, https: 443, dashboard: 40001 }
  },
  {
    id: "nginx-proxy",
    name: "Nginx Proxy",
    portRange: "40000-40999",
    category: "Reverse Proxy",
    technologies: ["Nginx"],
    description: "High-performance web server and proxy",
    ports: { http: 80, https: 443 }
  },
  {
    id: "haproxy",
    name: "HAProxy",
    portRange: "40000-40999",
    category: "Load Balancer",
    technologies: ["HAProxy"],
    description: "Reliable load balancer",
    ports: { http: 80, stats: 40002 }
  },
  {
    id: "minio",
    name: "MinIO",
    portRange: "43000-43999",
    category: "Object Storage",
    technologies: ["MinIO"],
    description: "S3-compatible object storage",
    ports: { api: 43001, console: 43002 }
  },
  {
    id: "keycloak",
    name: "Keycloak",
    portRange: "41000-41999",
    category: "Authentication",
    technologies: ["Keycloak", "PostgreSQL"],
    description: "Identity and access management",
    ports: { web: 41001, db: 20019 }
  },
  {
    id: "vault",
    name: "HashiCorp Vault",
    portRange: "41000-41999",
    category: "Secrets Management",
    technologies: ["Vault"],
    description: "Secrets and encryption management",
    ports: { api: 41002 }
  },
  {
    id: "wireguard",
    name: "WireGuard VPN",
    portRange: "45000-45999",
    category: "VPN",
    technologies: ["WireGuard"],
    description: "Fast and secure VPN",
    ports: { vpn: 45001 }
  },
  {
    id: "openvpn",
    name: "OpenVPN",
    portRange: "45000-45999",
    category: "VPN",
    technologies: ["OpenVPN"],
    description: "Traditional VPN solution",
    ports: { vpn: 45002 }
  },
  
  // ECOMMERCE & CMS
  {
    id: "woocommerce",
    name: "WooCommerce",
    portRange: "8000-8999",
    category: "E-commerce",
    technologies: ["WordPress", "WooCommerce", "MySQL"],
    description: "WordPress-based online store",
    ports: { web: 8001, db: 20020 }
  },
  {
    id: "magento",
    name: "Magento",
    portRange: "8000-8999",
    category: "E-commerce",
    technologies: ["Magento", "MySQL", "Elasticsearch"],
    description: "Enterprise e-commerce platform",
    ports: { web: 8002, db: 20021, search: 31006 }
  },
  {
    id: "prestashop",
    name: "PrestaShop",
    portRange: "8000-8999",
    category: "E-commerce",
    technologies: ["PrestaShop", "MySQL"],
    description: "Open-source e-commerce solution",
    ports: { web: 8003, db: 20022 }
  },
  
  // DEVELOPMENT
  {
    id: "vscode-server",
    name: "VS Code Server",
    portRange: "6000-6999",
    category: "Development",
    technologies: ["VS Code"],
    description: "Browser-based VS Code editor",
    ports: { web: 6001 }
  },
  {
    id: "jupyter",
    name: "Jupyter Notebook",
    portRange: "6000-6999",
    category: "Development",
    technologies: ["Jupyter", "Python"],
    description: "Interactive computing environment",
    ports: { web: 6002 }
  },
  {
    id: "gitea",
    name: "Gitea",
    portRange: "6000-6999",
    category: "Development",
    technologies: ["Gitea", "PostgreSQL"],
    description: "Lightweight Git server",
    ports: { web: 6003, ssh: 6004, db: 20023 }
  }
];

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', async () => {
  allTemplates = TEMPLATES_LIBRARY;
  await checkAuth();
  initFilters();
  displayAllTemplates();
  setupEventListeners();
});

// ═══════════════════════════════════════════════════════════
// AUTH (igual que antes)
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
  // Populate port range filter
  const portRangeFilter = document.getElementById('port-range-filter');
  const ranges = [...new Set(allTemplates.map(t => t.portRange))].sort();
  
  ranges.forEach(range => {
    const option = document.createElement('option');
    option.value = range;
    option.textContent = range;
    portRangeFilter.appendChild(option);
  });
  
  // Populate category filter
  const categoryFilter = document.getElementById('category-filter');
  const categories = [...new Set(allTemplates.map(t => t.category))].sort();
  
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  
  // Populate technologies
  const techContainer = document.getElementById('tech-filters');
  const allTechs = [...new Set(allTemplates.flatMap(t => t.technologies))].sort();
  
  allTechs.forEach(tech => {
    const label = document.createElement('label');
    label.className = 'tech-filter-item';
    label.innerHTML = `
      <input type="checkbox" value="${tech}" onchange="applyFilters()">
      <span>${tech}</span>
    `;
    techContainer.appendChild(label);
  });
}

function applyFilters() {
  // Get filter values
  filters.search = document.getElementById('search-input').value.toLowerCase();
  filters.portRange = document.getElementById('port-range-filter').value;
  filters.category = document.getElementById('category-filter').value;
  filters.technologies = Array.from(document.querySelectorAll('#tech-filters input:checked'))
    .map(cb => cb.value);
  
  // Filter templates
  let filtered = allTemplates;
  
  // Search filter
  if (filters.search) {
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(filters.search) ||
      t.description.toLowerCase().includes(filters.search) ||
      t.technologies.some(tech => tech.toLowerCase().includes(filters.search))
    );
  }
  
  // Port range filter
  if (filters.portRange !== 'all') {
    filtered = filtered.filter(t => t.portRange === filters.portRange);
  }
  
  // Category filter
  if (filters.category !== 'all') {
    filtered = filtered.filter(t => t.category === filters.category);
  }
  
  // Technologies filter
  if (filters.technologies.length > 0) {
    filtered = filtered.filter(t => 
      filters.technologies.every(tech => t.technologies.includes(tech))
    );
  }
  
  displayTemplates(filtered);
}

function displayAllTemplates() {
  displayTemplates(allTemplates);
}

function displayTemplates(templates) {
  const container = document.getElementById('templates-grid');
  const count = document.getElementById('templates-count');
  
  count.textContent = `${templates.length} templates`;
  
  if (templates.length === 0) {
    container.innerHTML = '<div class="empty-state">No templates match your filters. Try adjusting your criteria.</div>';
    return;
  }
  
  container.innerHTML = templates.map(t => `
    <div class="template-card" onclick="selectTemplate('${t.id}')">
      <h3>${t.name}</h3>
      <p class="description">${t.description}</p>
      <div class="tech-badges">
        ${t.technologies.map(tech => `<span class="badge">${tech}</span>`).join('')}
      </div>
      <div class="port-info">
        <span class="port-range">${t.portRange}</span>
        <span class="category">${t.category}</span>
      </div>
    </div>
  `).join('');
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE SELECTION & PREVIEW
// ═══════════════════════════════════════════════════════════

function selectTemplate(templateId) {
  selectedTemplate = allTemplates.find(t => t.id === templateId);
  // TODO: Generate YAML and show modal
  alert(`Selected: ${selectedTemplate.name}\n\nYAML generation coming soon...`);
}

// ═══════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', login);
  document.getElementById('logout-btn').addEventListener('click', logout);
  
  document.getElementById('search-input').addEventListener('input', applyFilters);
  document.getElementById('port-range-filter').addEventListener('change', applyFilters);
  document.getElementById('category-filter').addEventListener('change', applyFilters);
  
  document.getElementById('clear-filters-btn').addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    document.getElementById('port-range-filter').value = 'all';
    document.getElementById('category-filter').value = 'all';
    document.querySelectorAll('#tech-filters input').forEach(cb => cb.checked = false);
    applyFilters();
  });
}

// Global functions
window.selectTemplate = selectTemplate;
window.applyFilters = applyFilters;
