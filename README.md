# 🎯 Enterprise Port Range Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/port-ranges/graphs/commit-activity)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Documentation](https://img.shields.io/badge/docs-latest-blue.svg)](https://github.com/yourusername/port-ranges/wiki)

> A comprehensive, enterprise-grade port allocation system for modern infrastructure management across development, staging, and production environments.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/port-ranges.git
cd port-ranges

# Install the CLI tool (optional)
npm install -g port-ranger

# Check available ports in a range
port-ranger check --range 2000-2999

# Reserve a port
port-ranger reserve --port 2001 --service "Company Blog" --owner "Marketing Team"
```

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Port Ranges](#-port-ranges)
  - [Websites (1024-19999)](#-websites-1024-19999)
  - [Applications (20000-29999)](#-applications-20000-29999)
  - [DevOps Tools (30000-39999)](#️-devops-tools-30000-39999)
  - [Internal Services (40000-49999)](#-internal-services-40000-49999)
  - [Client Reserved (50000-65535)](#-client-reserved-50000-65535)
- [Best Practices](#-best-practices)
- [Usage Examples](#-usage-examples)
- [Security Considerations](#-security-considerations)
- [Monitoring & Observability](#-monitoring--observability)
- [Troubleshooting](#-troubleshooting)
- [Migration Guide](#-migration-guide)
- [Tools & Automation](#-tools--automation)
- [FAQ](#-faq)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

### Why Port Range Management?

In modern microservices architectures and containerized environments, managing port allocations becomes critical for:

- **🔍 Discoverability**: Quickly identify service types by port number
- **🛡️ Security**: Implement granular firewall rules based on service categories
- **📊 Monitoring**: Streamline observability by grouping related services
- **🚀 Scalability**: Plan capacity and avoid port conflicts across environments
- **📝 Documentation**: Self-documenting infrastructure through structured allocation
- **🔄 DevOps**: Simplify CI/CD pipelines with predictable port assignments

### Key Features

- ✅ Hierarchical organization of 64,511 usable ports
- ✅ Clear separation between service types
- ✅ Scalable from single servers to distributed systems
- ✅ Compatible with Docker, Kubernetes, and bare metal
- ✅ Automated tooling for port management
- ✅ Built-in conflict detection
- ✅ Comprehensive documentation and examples

### System Requirements

- **Minimum**: Linux/Unix-based OS, root/sudo access for privileged ports
- **Recommended**: Infrastructure as Code tools (Terraform, Ansible)
- **Optional**: Container orchestration (Docker Compose, Kubernetes)

## 🏗️ Architecture

### Port Allocation Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                    PORT RANGE HIERARCHY                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  0-1023        │ System Reserved (OS Services)              │
│  1024-19999    │ User-Facing Services (Websites)           │
│  20000-29999   │ Application Layer (APIs, Databases)       │
│  30000-39999   │ Operations & Development Tools            │
│  40000-49999   │ Infrastructure Services                   │
│  50000-65535   │ Client-Specific & Testing                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Port Range Design Principles

1. **Logical Grouping**: Services of similar types share ranges
2. **Growth Capacity**: 1000 ports per category allows for scaling
3. **Firewall Friendly**: Range-based rules simplify security
4. **Environment Separation**: Different ports for dev/staging/prod
5. **Collision Avoidance**: Structured allocation prevents conflicts

## 📊 Port Ranges

### 🌐 WEBSITES (1024-19999)
*Public-facing web services and content management systems*

| Port Range | Category | Use Cases | Common Technologies |
|------------|----------|-----------|-------------------|
| `1024-1999` | **WordPress Multisite** | Enterprise WordPress networks, multi-tenant blogs | WordPress MU, Bedrock |
| `2000-2999` | **WordPress Single** | Individual WordPress installations | WordPress, WP Engine, Local |
| `3000-3999` | **NextCloud** | Self-hosted cloud storage and collaboration | NextCloud, ownCloud |
| `4000-4999` | **Ghost Blogs** | Modern publishing platforms | Ghost, Ghost Pro |
| `5000-5999` | **Static Sites** | JAMstack sites, documentation | Gatsby, Hugo, Jekyll, Docusaurus, VitePress |
| `6000-6999` | **Development/Staging** | Testing and QA environments | Webpack Dev Server, Vite, Live Server |
| `7000-7999` | **Landing Pages** | Marketing campaigns, product launches | Unbounce, Next.js, Astro |
| `8000-8999` | **E-commerce** | Online stores and shopping platforms | WooCommerce, Shopify, Magento, PrestaShop |
| `9000-9999` | **Portfolios** | Personal/corporate portfolios | React, Vue, Webflow exports |
| `10000-19999` | **Reserved** | Future website categories | TBD |

**Example Port Assignment:**
- `2001`: Production WordPress site
- `2002`: Staging WordPress site
- `2003`: Development WordPress site

### 🚀 APPLICATIONS (20000-29999)
*Backend services, APIs, and data processing*

| Port Range | Category | Use Cases | Common Technologies |
|------------|----------|-----------|-------------------|
| `20000-20999` | **Databases** | Relational and NoSQL databases | PostgreSQL, MySQL, MongoDB, MariaDB, CockroachDB |
| `21000-21999` | **Cache Systems** | In-memory data stores | Redis, Memcached, Varnish, KeyDB |
| `22000-22999` | **Message Queues** | Async processing and job queues | RabbitMQ, Celery, Bull, BullMQ, Kafka |
| `23000-23999` | **REST APIs** | RESTful web services | Express.js, FastAPI, Django REST, Flask, Spring Boot |
| `24000-24999` | **GraphQL APIs** | Modern API layer | Apollo Server, Hasura, GraphQL Yoga, Postgraphile |
| `25000-25999` | **Microservices** | Distributed service architecture | gRPC, Node.js services, Go services, .NET services |
| `26000-26999` | **WebSockets** | Real-time bidirectional communication | Socket.io, WS, uWebSockets, Phoenix Channels |
| `27000-27999` | **RTC Services** | Real-time communications | WebRTC, Jitsi, Janus, MediaSoup, Kurento |
| `28000-28999` | **Bots/Automation** | Chatbots and automation services | Discord bots, Telegram bots, Slack bots, n8n, Zapier |

**Example Microservices Stack:**
```
25001: User Service
25002: Auth Service
25003: Payment Service
25004: Notification Service
25005: Analytics Service
```

### ⚙️ DEVOPS TOOLS (30000-39999)
*Development, testing, and operational tooling*

| Port Range | Category | Use Cases | Common Technologies |
|------------|----------|-----------|-------------------|
| `30000-30999` | **Monitoring** | System and application monitoring | Prometheus, Grafana, Zabbix, Netdata, Datadog Agent |
| `31000-31999` | **Log Aggregation** | Centralized logging | ELK Stack, Graylog, Loki, Fluentd, Vector |
| `32000-32999` | **Backup Services** | Automated backup systems | Restic, Duplicati, Bacula, Bareos |
| `33000-33999` | **CI/CD Pipelines** | Continuous integration/deployment | Jenkins, GitLab CI, DroneCI, TeamCity, CircleCI |
| `34000-34999` | **Testing** | Automated testing frameworks | Selenium Grid, Cypress Dashboard, Playwright, TestCafe |
| `35000-35999` | **Documentation** | Technical documentation platforms | Docusaurus, MkDocs, Docz, Slate, GitBook |
| `36000-36999` | **Analytics** | Privacy-focused analytics | Matomo, Plausible, Umami, PostHog, Ackee |
| `37000-37999` | **Security Scanning** | Vulnerability and code analysis | SonarQube, OWASP ZAP, Trivy, Snyk, Clair |
| `38000-38999` | **Performance Testing** | Load and stress testing | JMeter, k6, Gatling, Locust, Artillery |

**DevOps Stack Example:**
```
30001: Prometheus (metrics)
30002: Grafana (dashboards)
31001: Elasticsearch (logs)
31002: Kibana (log viewer)
33001: Jenkins (CI/CD)
```

### 🔒 INTERNAL SERVICES (40000-49999)
*Infrastructure and platform services*

| Port Range | Category | Use Cases | Common Technologies |
|------------|----------|-----------|-------------------|
| `40000-40999` | **Reverse Proxy** | Load balancing and routing | Nginx, Traefik, HAProxy, Envoy, Caddy |
| `41000-41999` | **Authentication** | SSO and identity management | Keycloak, Auth0, Authentik, FusionAuth, Ory |
| `42000-42999` | **Email Services** | Mail servers and webmail | Postfix, Dovecot, Roundcube, MailCow, Mailu |
| `43000-43999` | **Object Storage** | S3-compatible storage | MinIO, SeaweedFS, Ceph, Rook |
| `44000-44999` | **Internal DNS** | Service discovery and DNS | Bind9, PowerDNS, CoreDNS, Pi-hole, AdGuard |
| `45000-45999` | **VPN Services** | Secure network access | OpenVPN, WireGuard, IPSec, Tailscale, ZeroTier |
| `46000-46999` | **Firewall Management** | Network security | pfSense API, OPNsense API, iptables manager |
| `47000-47999` | **Load Balancers** | Traffic distribution | HAProxy Stats, IPVS, MetalLB |
| `48000-48999` | **Service Mesh** | Microservices networking | Istio, Linkerd, Consul Connect, Kuma |

**Infrastructure Example:**
```
40001: Traefik Dashboard
41001: Keycloak (SSO)
43001: MinIO (S3 storage)
45001: WireGuard (VPN)
```

### 👥 CLIENT RESERVED (50000-65535)
*Client-specific deployments and emergency use*

| Port Range | Category | Use Cases | Notes |
|------------|----------|-----------|-------|
| `50000-50999` | **Client A** | Dedicated client infrastructure | Isolated environment |
| `51000-51999` | **Client B** | Dedicated client infrastructure | Isolated environment |
| `52000-52999` | **Client C** | Dedicated client infrastructure | Isolated environment |
| `53000-53999` | **Client D** | Dedicated client infrastructure | Isolated environment |
| `54000-54999` | **Client E** | Dedicated client infrastructure | Isolated environment |
| `55000-59999` | **Reserved Pool** | Future client allocations | Pre-allocated blocks |
| `60000-65535` | **Emergency/Testing** | Temporary services, POCs, hotfixes | Short-lived services |

## 🎯 Best Practices

### 1. Service Naming Convention

Follow this standardized pattern for service identification:

```
[environment]-[category]-[service-name]-[instance]
```

**Examples:**
```
prod-wordpress-company-blog-01        → Port 2001
stg-api-user-service-01               → Port 23101
dev-grafana-monitoring-dashboard-01   → Port 30101
```

### 2. Port Documentation Template

Maintain a structured registry using YAML, JSON, or a database:

```yaml
services:
  - name: "Corporate Blog"
    port: 2001
    category: "WordPress Single"
    environment: "production"
    owner: "Marketing Team"
    contact: "marketing@company.com"
    status: "active"
    created: "2025-01-15"
    dependencies: 
      - port: 20001
        service: "MySQL Database"
      - port: 21001
        service: "Redis Cache"
    health_check: "https://blog.company.com/health"
    documentation: "https://wiki.company.com/services/blog"
    
  - name: "User API"
    port: 23001
    category: "REST APIs"
    environment: "production"
    owner: "Backend Team"
    contact: "backend@company.com"
    status: "active"
    replicas: 3
    ports: [23001, 23002, 23003]
    repository: "github.com/company/user-api"
```

### 3. Environment Segmentation Strategy

Allocate ports systematically across environments:

```
Base Port: 2000 (WordPress category)

Production:    2001, 2011, 2021... (increment by 10)
Staging:       2002, 2012, 2022... (base + 1)
Development:   2003, 2013, 2023... (base + 2)
Testing:       2004, 2014, 2024... (base + 3)
```

### 4. Firewall Configuration

Implement defense-in-depth with range-based rules:

#### iptables Example
```bash
#!/bin/bash
# Website services - public access
iptables -A INPUT -p tcp --dport 1024:19999 -m state --state NEW,ESTABLISHED -j ACCEPT

# Application services - internal only
iptables -A INPUT -p tcp --dport 20000:29999 -s 10.0.0.0/8 -m state --state NEW,ESTABLISHED -j ACCEPT

# DevOps tools - admin network only
iptables -A INPUT -p tcp --dport 30000:39999 -s 10.10.10.0/24 -m state --state NEW,ESTABLISHED -j ACCEPT

# Internal services - localhost only
iptables -A INPUT -p tcp --dport 40000:49999 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 40000:49999 -s 10.0.0.0/8 -j ACCEPT

# Client services - per-client rules
iptables -A INPUT -p tcp --dport 50000:50999 -s 192.168.1.0/24 -j ACCEPT

# Log dropped packets
iptables -A INPUT -p tcp --dport 1024:65535 -j LOG --log-prefix "BLOCKED-PORT: "
iptables -A INPUT -p tcp --dport 1024:65535 -j DROP
```

#### UFW Example
```bash
# Website services
ufw allow 1024:19999/tcp

# Applications (internal network)
ufw allow from 10.0.0.0/8 to any port 20000:29999 proto tcp

# DevOps tools (admin network)
ufw allow from 10.10.10.0/24 to any port 30000:39999 proto tcp
```

#### firewalld Example
```bash
# Create custom zones
firewall-cmd --permanent --new-zone=websites
firewall-cmd --permanent --new-zone=applications
firewall-cmd --permanent --new-zone=devops

# Configure zones
firewall-cmd --permanent --zone=websites --add-port=1024-19999/tcp
firewall-cmd --permanent --zone=applications --add-port=20000-29999/tcp --add-source=10.0.0.0/8
firewall-cmd --permanent --zone=devops --add-port=30000-39999/tcp --add-source=10.10.10.0/24

# Reload
firewall-cmd --reload
```

### 5. Docker & Container Best Practices

#### Docker Compose Multi-Service Stack
```yaml
version: '3.8'

x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  # Website Layer
  wordpress:
    image: wordpress:latest
    ports:
      - "2001:80"
    environment:
      WORDPRESS_DB_HOST: mysql:3306
    depends_on:
      - mysql
      - redis
    logging: *default-logging
    restart: unless-stopped
    
  # Application Layer
  mysql:
    image: mysql:8.0
    ports:
      - "20001:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: wordpress
    volumes:
      - mysql-data:/var/lib/mysql
    logging: *default-logging
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    ports:
      - "21001:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    logging: *default-logging
    restart: unless-stopped
    
  # API Layer
  api:
    image: company/user-api:latest
    ports:
      - "23001:3000"
    environment:
      DATABASE_URL: postgresql://postgres:5432/api
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    logging: *default-logging
    restart: unless-stopped
    
  postgres:
    image: postgres:15-alpine
    ports:
      - "20002:5432"
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: api
    volumes:
      - postgres-data:/var/lib/postgresql/data
    logging: *default-logging
    restart: unless-stopped
    
  # DevOps Layer
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "30001:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    logging: *default-logging
    restart: unless-stopped
    
  grafana:
    image: grafana/grafana:latest
    ports:
      - "30002:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
    logging: *default-logging
    restart: unless-stopped
    
  # Infrastructure Layer
  traefik:
    image: traefik:latest
    ports:
      - "80:80"
      - "443:443"
      - "40001:8080"  # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./acme.json:/acme.json
    logging: *default-logging
    restart: unless-stopped

volumes:
  mysql-data:
  redis-data:
  postgres-data:
  prometheus-data:
  grafana-data:
```

#### Kubernetes Service Configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: wordpress-service
  namespace: websites
  labels:
    app: wordpress
    tier: frontend
    port-range: "2000-2999"
spec:
  type: NodePort
  ports:
    - port: 80
      targetPort: 80
      nodePort: 2001
      name: http
  selector:
    app: wordpress
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: applications
  labels:
    app: user-api
    tier: backend
    port-range: "23000-23999"
spec:
  type: ClusterIP
  ports:
    - port: 3000
      targetPort: 3000
      name: api
  selector:
    app: user-api
```

### 6. Nginx Reverse Proxy Configuration

```nginx
# /etc/nginx/sites-available/port-ranges

# Websites Range (1024-19999)
upstream wordpress_backend {
    least_conn;
    server 127.0.0.1:2001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:2002 backup;
}

server {
    listen 80;
    listen [::]:80;
    server_name blog.company.com;
    
    location / {
        proxy_pass http://wordpress_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Application APIs (20000-29999)
upstream user_api {
    least_conn;
    server 127.0.0.1:23001;
    server 127.0.0.1:23002;
    server 127.0.0.1:23003;
}

server {
    listen 443 ssl http2;
    server_name api.company.com;
    
    ssl_certificate /etc/letsencrypt/live/api.company.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.company.com/privkey.pem;
    
    location /api/users {
        proxy_pass http://user_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;
    }
}

# DevOps Tools (30000-39999) - Restricted Access
server {
    listen 443 ssl http2;
    server_name monitoring.company.internal;
    
    # IP whitelist
    allow 10.10.10.0/24;
    deny all;
    
    location /grafana/ {
        proxy_pass http://127.0.0.1:30002/;
    }
    
    location /prometheus/ {
        proxy_pass http://127.0.0.1:30001/;
    }
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
```

### 7. Monitoring Service Health

```bash
#!/bin/bash
# health-check.sh - Monitor all registered services

PORT_REGISTRY="/etc/port-ranges/services.yml"

check_port() {
    local port=$1
    local service=$2
    
    if timeout 2 bash -c "echo > /dev/tcp/localhost/$port" 2>/dev/null; then
        echo "✓ $service (port $port) is UP"
        return 0
    else
        echo "✗ $service (port $port) is DOWN"
        # Send alert
        /usr/local/bin/alert.sh "$service on port $port is down"
        return 1
    fi
}

# Parse YAML and check each service
# (requires yq: https://github.com/mikefarah/yq)
yq e '.services[] | .port + " " + .name' "$PORT_REGISTRY" | while read -r port service; do
    check_port "$port" "$service"
done
```

## 💻 Usage Examples

### Complete Production Stack

This example demonstrates a full production environment with multiple tiers:

```yaml
# docker-compose.prod.yml
version: '3.8'

networks:
  frontend:
  backend:
  monitoring:

services:
  # === WEBSITE TIER (1024-19999) ===
  
  main-website:
    image: nginx:alpine
    ports:
      - "5001:80"  # Static site
    volumes:
      - ./website:/usr/share/nginx/html:ro
    networks:
      - frontend
    labels:
      - "traefik.enable=true"
      - "port-range=5000-5999"
      
  company-blog:
    image: ghost:latest
    ports:
      - "4001:2368"  # Ghost blog
    environment:
      url: https://blog.company.com
      database__client: mysql
      database__connection__host: mysql
      database__connection__database: ghost
    networks:
      - frontend
      - backend
    depends_on:
      - mysql
      
  # === APPLICATION TIER (20000-29999) ===
  
  mysql:
    image: mysql:8.0
    ports:
      - "20001:3306"
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - backend
      
  redis:
    image: redis:alpine
    ports:
      - "21001:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    networks:
      - backend
      
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "22001:5672"   # AMQP
      - "22002:15672"  # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD}
    networks:
      - backend
      
  api-gateway:
    image: company/api-gateway:latest
    ports:
      - "23001:8080"
    environment:
      SERVICES_USER: http://user-service:8080
      SERVICES_AUTH: http://auth-service:8080
    networks:
      - frontend
      - backend
      
  user-service:
    image: company/user-service:latest
    deploy:
      replicas: 3
    ports:
      - "25001-25003:8080"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    networks:
      - backend
      
  auth-service:
    image: company/auth-service:latest
    ports:
      - "25004:8080"
    environment:
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - backend
      
  websocket-server:
    image: company/ws-server:latest
    ports:
      - "26001:8080"
    networks:
      - frontend
      - backend
      
  # === DEVOPS TIER (30000-39999) ===
  
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "30001:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - monitoring
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.retention.time=30d'
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "30002:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
      GF_INSTALL_PLUGINS: grafana-piechart-panel
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
    networks:
      - monitoring
      
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    ports:
      - "31001:9200"
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elastic-data:/usr/share/elasticsearch/data
    networks:
      - monitoring
      
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    ports:
      - "31002:5601"
    environment:
      ELASTICSEARCH_HOSTS: http://elasticsearch:9200
    networks:
      - monitoring
    depends_on:
      - elasticsearch
      
  jenkins:
    image: jenkins/jenkins:lts
    ports:
      - "33001:8080"
      - "33002:50000"
    volumes:
      - jenkins-data:/var/jenkins_home
    networks:
      - monitoring
      
  # === INFRASTRUCTURE TIER (40000-49999) ===
  
  traefik:
    image: traefik:v2.10
    ports:
      - "80:80"
      - "443:443"
      - "40001:8080"  # Dashboard
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/traefik.yml
      - ./traefik/acme.json:/acme.json
    networks:
      - frontend
      
  minio:
    image: minio/minio:latest
    ports:
      - "43001:9000"  # API
      - "43002:9001"  # Console
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data
    networks:
      - backend

volumes:
  mysql-data:
  prometheus-data:
  grafana-data:
  elastic-data:
  jenkins-data:
  minio-data:
```

### Ansible Playbook for Port Management

```yaml
---
# playbooks/configure-ports.yml
- name: Configure Port Ranges
  hosts: all
  become: yes
  vars:
    port_ranges:
      websites: "1024:19999"
      applications: "20000:29999"
      devops: "30000:39999"
      infrastructure: "40000:49999"
      
  tasks:
    - name: Install required packages
      apt:
        name:
          - iptables-persistent
          - netfilter-persistent
        state: present
        
    - name: Configure firewall rules for port ranges
      iptables:
        chain: INPUT
        protocol: tcp
        destination_port: "{{ item.range }}"
        source: "{{ item.source | default('0.0.0.0/0') }}"
        jump: ACCEPT
        comment: "{{ item.comment }}"
      loop:
        - { range: "{{ port_ranges.websites }}", comment: "Website services" }
        - { range: "{{ port_ranges.applications }}", source: "10.0.0.0/8", comment: "Application services" }
        - { range: "{{ port_ranges.devops }}", source: "10.10.10.0/24", comment: "DevOps tools" }
        - { range: "{{ port_ranges.infrastructure }}", source: "127.0.0.1", comment: "Infrastructure" }
        
    - name: Save firewall rules
      command: netfilter-persistent save
      
    - name: Deploy port registry
      template:
        src: templates/port-registry.yml.j2
        dest: /etc/port-ranges/services.yml
        mode: '0644'
        
    - name: Install monitoring script
      copy:
        src: files/health-check.sh
        dest: /usr/local/bin/health-check.sh
        mode: '0755'
        
    - name: Setup health check cron
      cron:
        name: "Port health check"
        minute: "*/5"
        job: "/usr/local/bin/health-check.sh"
```

### Terraform Infrastructure

```hcl
# main.tf
# AWS Security Groups based on port ranges

resource "aws_security_group" "websites" {
  name        = "websites-sg"
  description = "Security group for website services"
  vpc_id      = var.vpc_id

  ingress {
    description = "Website port range"
    from_port   = 1024
    to_port     = 19999
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name       = "websites-sg"
    PortRange  = "1024-19999"
    Category   = "Websites"
  }
}

resource "aws_security_group" "applications" {
  name        = "applications-sg"
  description = "Security group for application services"
  vpc_id      = var.vpc_id

  ingress {
    description = "Application port range"
    from_port   = 20000
    to_port     = 29999
    protocol    = "tcp"
    cidr_blocks = [var.internal_network]
  }

  tags = {
    Name       = "applications-sg"
    PortRange  = "20000-29999"
    Category   = "Applications"
  }
}

resource "aws_security_group" "devops" {
  name        = "devops-sg"
  description = "Security group for DevOps tools"
  vpc_id      = var.vpc_id

  ingress {
    description = "DevOps port range"
    from_port   = 30000
    to_port     = 39999
    protocol    = "tcp"
    cidr_blocks = [var.admin_network]
  }

  tags = {
    Name       = "devops-sg"
    PortRange  = "30000-39999"
    Category   = "DevOps"
  }
}

# EC2 instances with port-based tagging
resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = "t3.medium"
  
  vpc_security_group_ids = [
    aws_security_group.websites.id
  ]

  tags = {
    Name      = "web-server"
    Service   = "wordpress"
    Port      = "2001"
    PortRange = "2000-2999"
  }
}
```

## 🔒 Security Considerations

### 1. Defense in Depth Strategy

```
┌─────────────────────────────────────────┐
│         External Firewall               │
│     (Cloud Provider Security Groups)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Network Firewall                │
│     (iptables/nftables/firewalld)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Application Firewall               │
│   (WAF, rate limiting, IP filtering)    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│     Service-Level Security              │
│  (Authentication, authorization, TLS)   │
└─────────────────────────────────────────┘
```

### 2. Port Scanning Detection

```bash
#!/bin/bash
# /usr/local/bin/detect-port-scan.sh

# Monitor for port scanning attempts
iptables -N PORT_SCAN
iptables -A PORT_SCAN -m recent --set --name portscan
iptables -A PORT_SCAN -m recent --update --seconds 60 --hitcount 10 --name portscan -j LOG --log-prefix "PORT SCAN DETECTED: "
iptables -A PORT_SCAN -m recent --update --seconds 60 --hitcount 10 --name portscan -j DROP

# Apply to all port ranges
iptables -A INPUT -p tcp --dport 1024:65535 -m state --state NEW -j PORT_SCAN
```

### 3. TLS/SSL Termination

```nginx
# SSL best practices for reverse proxy
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### 4. Audit Logging

```python
# port-audit.py - Log all port access attempts
import socket
import datetime
import json

class PortAuditLogger:
    def __init__(self, log_file='/var/log/port-audit.json'):
        self.log_file = log_file
    
    def log_access(self, port, source_ip, service_name, action):
        entry = {
            'timestamp': datetime.datetime.now().isoformat(),
            'port': port,
            'source_ip': source_ip,
            'service': service_name,
            'action': action,
            'category': self.get_category(port)
        }
        
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(entry) + '\n')
    
    def get_category(self, port):
        if 1024 <= port <= 19999:
            return 'websites'
        elif 20000 <= port <= 29999:
            return 'applications'
        elif 30000 <= port <= 39999:
            return 'devops'
        elif 40000 <= port <= 49999:
            return 'infrastructure'
        elif 50000 <= port <= 65535:
            return 'client-reserved'
        return 'unknown'
```

## 📊 Monitoring & Observability

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

# Port range monitoring rules
rule_files:
  - 'port_alerts.yml'

scrape_configs:
  # Monitor all services by port range
  - job_name: 'websites'
    static_configs:
      - targets:
        - 'localhost:2001'  # WordPress
        - 'localhost:4001'  # Ghost
        - 'localhost:5001'  # Static site
    relabel_configs:
      - source_labels: [__address__]
        target_label: port_range
        replacement: 'websites'
  
  - job_name: 'applications'
    static_configs:
      - targets:
        - 'localhost:20001'  # MySQL exporter
        - 'localhost:21001'  # Redis exporter
        - 'localhost:23001'  # API metrics
    relabel_configs:
      - source_labels: [__address__]
        target_label: port_range
        replacement: 'applications'
  
  - job_name: 'devops'
    static_configs:
      - targets:
        - 'localhost:30001'  # Prometheus itself
        - 'localhost:31001'  # Elasticsearch
        - 'localhost:33001'  # Jenkins
    relabel_configs:
      - source_labels: [__address__]
        target_label: port_range
        replacement: 'devops'
```

### Alert Rules

```yaml
# port_alerts.yml
groups:
  - name: port_availability
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up{port_range="websites"} == 0
        for: 2m
        labels:
          severity: critical
          category: websites
        annotations:
          summary: "Website service is down (port {{ $labels.instance }})"
          description: "Service on {{ $labels.instance }} has been down for more than 2 minutes."
      
      - alert: HighPortUsage
        expr: |
          (count(up{port_range="applications"} == 1) / 1000) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Application port range usage above 80%"
          description: "Consider expanding the port range or cleaning up unused services."
      
      - alert: UnauthorizedPortAccess
        expr: rate(iptables_drops_total{port_range!=""}[5m]) > 10
        labels:
          severity: warning
          category: security
        annotations:
          summary: "Possible port scan detected"
          description: "Unusual number of blocked connection attempts to {{ $labels.port_range }} range."
```

### Grafana Dashboard JSON

```json
{
  "dashboard": {
    "title": "Port Range Overview",
    "panels": [
      {
        "title": "Services by Port Range",
        "type": "piechart",
        "targets": [
          {
            "expr": "count by (port_range) (up == 1)"
          }
        ]
      },
      {
        "title": "Port Range Utilization",
        "type": "gauge",
        "targets": [
          {
            "expr": "(count(up{port_range='websites'} == 1) / 19000) * 100",
            "legendFormat": "Websites"
          },
          {
            "expr": "(count(up{port_range='applications'} == 1) / 10000) * 100",
            "legendFormat": "Applications"
          }
        ]
      },
      {
        "title": "Response Time by Port Range",
        "type": "graph",
        "targets": [
          {
            "expr": "avg by (port_range) (http_request_duration_seconds)"
          }
        ]
      }
    ]
  }
}
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

**Problem**: `Error: Port 2001 is already in use`

**Diagnosis**:
```bash
# Find what's using the port
sudo lsof -i :2001
sudo netstat -tulpn | grep :2001
sudo ss -tulpn | grep :2001

# Check if it's a zombie process
ps aux | grep <PID>
```

**Solutions**:
```bash
# Kill the process
sudo kill -9 <PID>

# Or use fuser
sudo fuser -k 2001/tcp

# Verify port is free
nc -zv localhost 2001
```

#### 2. Firewall Blocking Connections

**Problem**: Service running but not accessible

**Diagnosis**:
```bash
# Check firewall status
sudo iptables -L -n -v | grep 2001
sudo firewall-cmd --list-all
sudo ufw status numbered

# Test connectivity
telnet localhost 2001
curl -v http://localhost:2001
```

**Solutions**:
```bash
# iptables
sudo iptables -I INPUT -p tcp --dport 2001 -j ACCEPT

# UFW
sudo ufw allow 2001/tcp

# firewalld
sudo firewall-cmd --add-port=2001/tcp --permanent
sudo firewall-cmd --reload
```

#### 3. SELinux Preventing Port Binding

**Problem**: `Permission denied` on non-standard ports

**Diagnosis**:
```bash
# Check SELinux status
sestatus
sudo ausearch -m avc -ts recent | grep 2001
```

**Solutions**:
```bash
# Add port to SELinux policy
sudo semanage port -a -t http_port_t -p tcp 2001

# Or modify the policy
sudo semanage port -m -t http_port_t -p tcp 2001

# Verify
sudo semanage port -l | grep http_port_t
```

#### 4. Docker Port Mapping Issues

**Problem**: Container not accessible via mapped port

**Diagnosis**:
```bash
# Check container status
docker ps -a
docker port <container_name>

# Check Docker networks
docker network inspect bridge

# Check logs
docker logs <container_name>
```

**Solutions**:
```bash
# Verify port mapping in compose file
docker-compose config

# Restart with explicit mapping
docker run -p 2001:80 ...

# Check host binding
docker run -p 0.0.0.0:2001:80 ...
```

#### 5. Rate Limiting or Connection Limits

**Problem**: Intermittent connectivity issues

**Diagnosis**:
```bash
# Check connection limits
ulimit -n
cat /proc/sys/net/ipv4/ip_local_port_range

# Monitor connections
watch -n1 'ss -s'
netstat -an | grep :2001 | wc -l
```

**Solutions**:
```bash
# Increase file descriptor limit
ulimit -n 65535

# Make permanent
echo "* soft nofile 65535" >> /etc/security/limits.conf
echo "* hard nofile 65535" >> /etc/security/limits.conf

# Adjust port range
echo "net.ipv4.ip_local_port_range = 1024 65535" >> /etc/sysctl.conf
sysctl -p
```

### Debug Script

```bash
#!/bin/bash
# debug-port.sh - Comprehensive port debugging

PORT=$1
if [ -z "$PORT" ]; then
    echo "Usage: $0 <port>"
    exit 1
fi

echo "=== Port $PORT Debug Information ==="
echo

echo "1. Port Listening Status:"
sudo lsof -i :$PORT
echo

echo "2. Network Statistics:"
sudo netstat -tulpn | grep :$PORT
echo

echo "3. Socket Statistics:"
sudo ss -tulpn | grep :$PORT
echo

echo "4. Firewall Rules:"
sudo iptables -L -n | grep $PORT
echo

echo "5. SELinux Context (if applicable):"
if command -v semanage &> /dev/null; then
    sudo semanage port -l | grep $PORT
fi
echo

echo "6. Process Tree:"
PID=$(sudo lsof -ti :$PORT)
if [ -n "$PID" ]; then
    ps -f --forest -g $PID
fi
echo

echo "7. Port Category:"
if [ $PORT -ge 1024 ] && [ $PORT -le 19999 ]; then
    echo "Category: Websites"
elif [ $PORT -ge 20000 ] && [ $PORT -le 29999 ]; then
    echo "Category: Applications"
elif [ $PORT -ge 30000 ] && [ $PORT -le 39999 ]; then
    echo "Category: DevOps Tools"
elif [ $PORT -ge 40000 ] && [ $PORT -le 49999 ]; then
    echo "Category: Internal Services"
elif [ $PORT -ge 50000 ] && [ $PORT -le 65535 ]; then
    echo "Category: Client Reserved"
fi
echo

echo "8. Connectivity Test:"
timeout 2 bash -c "echo > /dev/tcp/localhost/$PORT" && echo "✓ Port is reachable" || echo "✗ Port is not reachable"
```

## 🚀 Migration Guide

### Migrating from Random Port Allocation

#### Phase 1: Audit Current Ports
```bash
#!/bin/bash
# audit-current-ports.sh

echo "Current Port Usage Audit"
echo "========================"

# Export all listening ports
sudo netstat -tulpn | awk '{print $4}' | grep -o '[0-9]*$' | sort -n | uniq > current-ports.txt

# Categorize ports
echo "Ports to migrate:"
cat current-ports.txt | while read port; do
    if [ $port -ge 1024 ]; then
        echo "Port $port needs categorization"
    fi
done
```

#### Phase 2: Create Migration Plan
```yaml
# migration-plan.yml
migrations:
  - service: "Old WordPress"
    current_port: 8080
    new_port: 2001
    category: "WordPress Single"
    downtime: "5 minutes"
    
  - service: "MySQL"
    current_port: 3306
    new_port: 20001
    category: "Databases"
    downtime: "10 minutes"
    
  - service: "Redis"
    current_port: 6379
    new_port: 21001
    category: "Cache"
    downtime: "2 minutes"
```

#### Phase 3: Execute Migration
```bash
#!/bin/bash
# migrate-service.sh

SERVICE=$1
OLD_PORT=$2
NEW_PORT=$3

echo "Migrating $SERVICE from port $
