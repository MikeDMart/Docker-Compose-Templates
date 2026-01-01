# 🌐 Websites Configuration (Ports 1024-19999)

> Configuration files and deployment manifests for all website services

## 📋 Overview

This directory contains YAML configuration files for all website deployments across the `1024-19999` port range. Each website has its own configuration file that defines ports, dependencies, environments, and deployment settings.

## 🎯 Port Allocation

| Port Range | Category | Examples |
|------------|----------|----------|
| `1024-1999` | WordPress Multisite | Networks, multi-tenant installations |
| `2000-2999` | WordPress Single | Individual WordPress sites |
| `3000-3999` | NextCloud | Cloud storage and collaboration |
| `4000-4999` | Ghost Blogs | Publishing platforms |
| `5000-5999` | Static Sites | Hugo, Jekyll, Gatsby, plain HTML |
| `6000-6999` | Development/Staging | Testing environments |
| `7000-7999` | Landing Pages | Marketing sites, product pages |
| `8000-8999` | E-commerce | WooCommerce, Shopify, Magento |
| `9000-9999` | Portfolios | Personal/corporate portfolios |
| `10000-19999` | Reserved | Future expansion |

## 📁 Directory Structure

```
websites/
├── README.md                          # This file
├── wordpress-single/                  # Ports 2000-2999
│   ├── company-blog-2001.yml
│   ├── client-site-2002.yml
│   └── personal-site-2003.yml
├── wordpress-multisite/               # Ports 1024-1999
│   └── agency-network-1024.yml
├── ghost/                             # Ports 4000-4999
│   ├── tech-blog-4001.yml
│   └── news-site-4002.yml
├── static/                            # Ports 5000-5999
│   ├── landing-page-5001.yml
│   └── docs-site-5002.yml
├── ecommerce/                         # Ports 8000-8999
│   └── online-store-8001.yml
├── development/                       # Ports 6000-6999
│   ├── staging-2001-dev-6001.yml
│   └── testing-environment-6002.yml
├── templates/                         # Configuration templates
│   ├── wordpress-template.yml
│   ├── ghost-template.yml
│   └── static-template.yml
└── scripts/                           # Management scripts
    ├── deploy-website.sh
    ├── backup-website.sh
    └── check-health.sh
```

## 📝 Configuration File Format

### Standard YAML Structure

```yaml
# company-blog-2001.yml
version: "1.0"

metadata:
  name: "Company Blog"
  slug: "company-blog"
  description: "Main corporate blog for company.com"
  owner: "Marketing Team"
  contact: "marketing@company.com"
  created: "2025-01-15"
  updated: "2025-01-20"
  
service:
  type: "wordpress-single"
  port: 2001
  category: "WordPress Single"
  port_range: "2000-2999"
  
environment:
  production:
    domain: "blog.company.com"
    port: 2001
    ssl: true
    status: "active"
  staging:
    domain: "staging-blog.company.com"
    port: 6001
    ssl: true
    status: "active"
  development:
    domain: "dev-blog.company.local"
    port: 6002
    ssl: false
    status: "active"

docker:
  image: "wordpress:6.4-php8.2-apache"
  container_name: "company-blog-2001"
  restart_policy: "unless-stopped"
  
dependencies:
  database:
    type: "mysql"
    port: 20001
    name: "company_blog_db"
    user: "wp_user"
    host: "mysql"
  cache:
    type: "redis"
    port: 21001
    host: "redis"
  storage:
    type: "minio"
    port: 43001
    bucket: "company-blog-media"

resources:
  memory: "512M"
  cpu: "1.0"
  disk: "20GB"
  
backup:
  enabled: true
  schedule: "0 2 * * *"  # Daily at 2 AM
  retention_days: 30
  destination: "s3://backups/company-blog/"
  
monitoring:
  health_check: "/wp-admin/admin-ajax.php?action=health-check"
  uptime_check: true
  alert_email: "ops@company.com"
  
security:
  firewall_rules:
    - "allow from 0.0.0.0/0"
  rate_limit: "100/minute"
  fail2ban: true
  ssl_redirect: true
  
performance:
  cache_enabled: true
  cdn_enabled: false
  compression: true
  lazy_loading: true

plugins:
  - "wp-super-cache"
  - "wordfence"
  - "contact-form-7"
  - "yoast-seo"
  
theme:
  name: "twentytwentyfour"
  child_theme: "company-custom"

notes: |
  Main company blog. Receives moderate traffic (~10k visits/day).
  Content updated 2-3 times per week by marketing team.
  Integrated with company newsletter system.
```

## 🚀 Quick Start

### 1. Create New Website Configuration

```bash
# Copy template
cp templates/wordpress-template.yml wordpress-single/my-site-2010.yml

# Edit configuration
nano wordpress-single/my-site-2010.yml

# Validate configuration
./scripts/validate-config.sh my-site-2010.yml
```

### 2. Deploy Website

```bash
# Deploy using the configuration
./scripts/deploy-website.sh wordpress-single/my-site-2010.yml

# Check status
./scripts/check-health.sh 2010
```

### 3. Access Website

```bash
# Local access
curl http://localhost:2010

# With domain (after DNS setup)
curl https://my-site.company.com
```

## 📦 Configuration Templates

### WordPress Single Site Template

```yaml
# templates/wordpress-template.yml
version: "1.0"

metadata:
  name: "SITE_NAME"
  slug: "SITE_SLUG"
  description: "SITE_DESCRIPTION"
  owner: "OWNER_NAME"
  contact: "OWNER_EMAIL"
  created: "YYYY-MM-DD"
  
service:
  type: "wordpress-single"
  port: PORT_NUMBER  # 2000-2999
  category: "WordPress Single"
  
environment:
  production:
    domain: "DOMAIN.com"
    port: PORT_NUMBER
    ssl: true
    
docker:
  image: "wordpress:latest"
  container_name: "SLUG-PORT"
  
dependencies:
  database:
    type: "mysql"
    port: 20001
    name: "DB_NAME"
    user: "DB_USER"
```

### Ghost Blog Template

```yaml
# templates/ghost-template.yml
version: "1.0"

metadata:
  name: "BLOG_NAME"
  slug: "BLOG_SLUG"
  owner: "OWNER_NAME"
  
service:
  type: "ghost"
  port: PORT_NUMBER  # 4000-4999
  category: "Ghost Blogs"
  
environment:
  production:
    url: "https://DOMAIN.com"
    port: PORT_NUMBER
    
docker:
  image: "ghost:5-alpine"
  container_name: "SLUG-PORT"
  
dependencies:
  database:
    type: "mysql"
    port: 20002
    name: "ghost_DB_NAME"
```

### Static Site Template

```yaml
# templates/static-template.yml
version: "1.0"

metadata:
  name: "SITE_NAME"
  slug: "SITE_SLUG"
  type: "static"
  
service:
  type: "static"
  port: PORT_NUMBER  # 5000-5999
  category: "Static Sites"
  
docker:
  image: "nginx:alpine"
  container_name: "SLUG-PORT"
  
build:
  framework: "hugo"  # hugo, jekyll, gatsby, next, etc.
  build_command: "hugo"
  output_dir: "public"
```

## 🛠️ Management Scripts

### Deploy Script

```bash
#!/bin/bash
# scripts/deploy-website.sh

CONFIG_FILE=$1

if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: Configuration file not found"
    exit 1
fi

# Parse YAML and deploy
echo "Deploying website from $CONFIG_FILE..."

# Extract values using yq
NAME=$(yq e '.metadata.name' $CONFIG_FILE)
PORT=$(yq e '.service.port' $CONFIG_FILE)
TYPE=$(yq e '.service.type' $CONFIG_FILE)

echo "Deploying: $NAME on port $PORT"

# Generate docker-compose.yml
cat > "/tmp/docker-compose-$PORT.yml" <<EOF
version: '3.8'
services:
  website:
    image: $(yq e '.docker.image' $CONFIG_FILE)
    container_name: $(yq e '.docker.container_name' $CONFIG_FILE)
    ports:
      - "$PORT:80"
    restart: $(yq e '.docker.restart_policy' $CONFIG_FILE)
    environment:
      WORDPRESS_DB_HOST: $(yq e '.dependencies.database.host' $CONFIG_FILE):$(yq e '.dependencies.database.port' $CONFIG_FILE)
      WORDPRESS_DB_NAME: $(yq e '.dependencies.database.name' $CONFIG_FILE)
      WORDPRESS_DB_USER: $(yq e '.dependencies.database.user' $CONFIG_FILE)
      WORDPRESS_DB_PASSWORD: \${DB_PASSWORD}
EOF

# Deploy
docker-compose -f "/tmp/docker-compose-$PORT.yml" up -d

echo "✓ Deployed successfully on port $PORT"
```

### Health Check Script

```bash
#!/bin/bash
# scripts/check-health.sh

PORT=$1

if [ -z "$PORT" ]; then
    echo "Usage: $0 <port>"
    exit 1
fi

# Find config file
CONFIG=$(find . -name "*-$PORT.yml" | head -1)

if [ -z "$CONFIG" ]; then
    echo "No configuration found for port $PORT"
    exit 1
fi

NAME=$(yq e '.metadata.name' $CONFIG)
HEALTH_CHECK=$(yq e '.monitoring.health_check' $CONFIG)

echo "Checking health of $NAME on port $PORT..."

# Check if port is listening
if ! nc -z localhost $PORT; then
    echo "✗ Port $PORT is not responding"
    exit 1
fi

# Check HTTP response
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ $NAME is healthy (HTTP $HTTP_CODE)"
    exit 0
else
    echo "✗ $NAME returned HTTP $HTTP_CODE"
    exit 1
fi
```

### Backup Script

```bash
#!/bin/bash
# scripts/backup-website.sh

PORT=$1
DATE=$(date +%Y%m%d_%H%M%S)

CONFIG=$(find . -name "*-$PORT.yml" | head -1)
NAME=$(yq e '.metadata.slug' $CONFIG)
BACKUP_DEST=$(yq e '.backup.destination' $CONFIG)

echo "Backing up $NAME (port $PORT)..."

# Backup database
DB_PORT=$(yq e '.dependencies.database.port' $CONFIG)
DB_NAME=$(yq e '.dependencies.database.name' $CONFIG)
DB_USER=$(yq e '.dependencies.database.user' $CONFIG)

docker exec mysql-$DB_PORT mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > "/tmp/${NAME}_db_${DATE}.sql"

# Backup files
docker exec $NAME-$PORT tar czf /tmp/files.tar.gz /var/www/html
docker cp $NAME-$PORT:/tmp/files.tar.gz "/tmp/${NAME}_files_${DATE}.tar.gz"

# Upload to S3 or destination
aws s3 cp "/tmp/${NAME}_db_${DATE}.sql" "$BACKUP_DEST"
aws s3 cp "/tmp/${NAME}_files_${DATE}.tar.gz" "$BACKUP_DEST"

echo "✓ Backup completed: ${NAME}_${DATE}"
```

## 🔐 Security Best Practices

### 1. Environment Variables

Never store credentials in YAML files. Use `.env` files:

```bash
# .env
DB_PASSWORD=secure_password_here
REDIS_PASSWORD=redis_secure_pass
MINIO_SECRET_KEY=minio_secret_key
```

### 2. Firewall Configuration

```bash
# Allow website ports (1024-19999)
sudo ufw allow 1024:19999/tcp comment "Website Services"

# Or specific ports only
sudo ufw allow 2001/tcp comment "Company Blog"
sudo ufw allow 4001/tcp comment "Tech Blog"
```

### 3. SSL/TLS Certificates

Use Let's Encrypt with automatic renewal:

```yaml
# In your configuration
security:
  ssl_enabled: true
  ssl_provider: "letsencrypt"
  ssl_email: "admin@company.com"
  auto_renew: true
```

## 📊 Monitoring Dashboard

### Grafana Query Examples

```promql
# Website uptime by port range
up{port_range="2000-2999"}

# Response time for WordPress sites
http_request_duration_seconds{service_type="wordpress"}

# Traffic by website
rate(http_requests_total{port=~"2.*"}[5m])
```

## 🔄 Common Operations

### Add New WordPress Site

```bash
# 1. Find available port
./scripts/find-available-port.sh 2000 2999

# 2. Create configuration
cp templates/wordpress-template.yml wordpress-single/new-site-2015.yml

# 3. Edit configuration
nano wordpress-single/new-site-2015.yml

# 4. Deploy
./scripts/deploy-website.sh wordpress-single/new-site-2015.yml

# 5. Configure DNS
# Point new-site.company.com -> YOUR_SERVER_IP

# 6. Setup SSL
certbot --nginx -d new-site.company.com
```

### Migrate Existing Site

```bash
# 1. Backup old site
./scripts/backup-website.sh 8080  # Old port

# 2. Create new config with proper port (e.g., 2020)
cp templates/wordpress-template.yml wordpress-single/migrated-site-2020.yml

# 3. Deploy new instance
./scripts/deploy-website.sh wordpress-single/migrated-site-2020.yml

# 4. Import backup
./scripts/restore-backup.sh 2020 /path/to/backup.sql

# 5. Update DNS
# Point domain -> new port

# 6. Stop old instance
docker stop old-site-8080
```

### Scale WordPress Site

```yaml
# For high-traffic sites, deploy multiple instances

environment:
  production:
    instances:
      - port: 2001
        primary: true
      - port: 2011
        replica: true
      - port: 2021
        replica: true
    load_balancer:
      port: 40001
      algorithm: "least_conn"
```

## 📈 Capacity Planning

### Port Usage Tracking

```bash
#!/bin/bash
# Track port usage per category

echo "WordPress Single (2000-2999): $(ls wordpress-single/*.yml | wc -l)/1000"
echo "Ghost Blogs (4000-4999): $(ls ghost/*.yml | wc -l)/1000"
echo "Static Sites (5000-5999): $(ls static/*.yml | wc -l)/1000"
echo "E-commerce (8000-8999): $(ls ecommerce/*.yml | wc -l)/1000"
```

### Alert When Capacity Reaches 80%

```yaml
# prometheus alert rule
- alert: PortRangeCapacity
  expr: (count(website_active{port_range="2000-2999"}) / 1000) > 0.8
  annotations:
    summary: "WordPress port range is 80% full"
    action: "Consider expanding range or cleanup"
```

## 🧹 Maintenance

### Weekly Tasks

```bash
# Check all websites health
for config in **/*.yml; do
    port=$(yq e '.service.port' $config)
    ./scripts/check-health.sh $port
done

# Update all WordPress cores
./scripts/update-wordpress.sh --all

# Clean up old backups
./scripts/cleanup-backups.sh --older-than 30
```

### Monthly Tasks

```bash
# Audit port usage
./scripts/audit-ports.sh

# Review and remove unused sites
./scripts/list-inactive.sh

# Update documentation
./scripts/generate-inventory.sh > INVENTORY.md
```

## 📚 Additional Resources

- [Main Port Ranges Documentation](../README.md)
- [WordPress Configuration Best Practices](./docs/wordpress-best-practices.md)
- [Ghost Blog Setup Guide](./docs/ghost-setup.md)
- [Static Site Deployment](./docs/static-deployment.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

## 🤝 Contributing

When adding new website configurations:

1. Use the appropriate template from `templates/`
2. Follow the naming convention: `[category]/[slug]-[port].yml`
3. Validate your configuration: `./scripts/validate-config.sh`
4. Document special requirements in the `notes` field
5. Submit a PR with your changes

## 📝 Notes

- Always use HTTPS in production
- Keep staging and production ports separated
- Document all custom configurations
- Regular backups are automated but verify them monthly
- Monitor disk usage as WordPress sites grow over time

---

**Last Updated:** December 2025  
**Total Sites:** Run `./scripts/count-sites.sh` for current count  
**Port Capacity:** 19,000 available ports (1024-19999)
