# 🚀 WordPress Docker - Usage Guide

Complete guide for managing your WordPress Docker installation.

## 📋 Table of Contents

- [Initial Setup](#initial-setup)
- [Daily Operations](#daily-operations)
- [WP-CLI Commands](#wp-cli-commands)
- [Database Management](#database-management)
- [Backups & Restore](#backups--restore)
- [Performance Tuning](#performance-tuning)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

## 🏁 Initial Setup

### 1. First Time Installation

```bash
# Run the setup script
./setup.sh

# This will:
# - Create directory structure
# - Copy .env.example to .env
# - Set proper permissions
# - Validate configuration
```

### 2. Edit Environment Variables

```bash
nano .env
```

**Required changes:**
- `PORT` - Your port number (2000-2999)
- `SITE_NAME` - Unique identifier
- `DOMAIN` - Your domain name
- `DB_PASSWORD` - Strong database password
- `DB_ROOT_PASSWORD` - Strong root password

### 3. Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access WordPress

```bash
# Open in browser
http://localhost:2001

# Complete WordPress installation wizard:
# 1. Select language
# 2. Create admin account
# 3. Done!
```

## 🔧 Daily Operations

### Starting & Stopping

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Restart specific service
docker-compose restart wordpress
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f wordpress
docker-compose logs -f mysql
docker-compose logs -f redis

# Last 100 lines
docker-compose logs --tail=100

# Since specific time
docker-compose logs --since 2024-01-01T00:00:00
```

### Checking Status

```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Detailed info
docker inspect company-blog-2001
```

### Updating Images

```bash
# Pull latest images
docker-compose pull

# Recreate containers with new images
docker-compose up -d --force-recreate

# Remove old images
docker image prune -a
```

## 🛠️ WP-CLI Commands

WP-CLI is included for command-line WordPress management.

### Accessing WP-CLI

```bash
# Run with docker-compose profiles
docker-compose --profile tools run --rm wpcli <command>

# Or directly
docker-compose exec wordpress wp <command> --allow-root
```

### Common WP-CLI Commands

```bash
# Get WordPress info
docker-compose exec wordpress wp core version --allow-root

# Update WordPress
docker-compose exec wordpress wp core update --allow-root

# List plugins
docker-compose exec wordpress wp plugin list --allow-root

# Install plugin
docker-compose exec wordpress wp plugin install redis-cache --activate --allow-root

# Update all plugins
docker-compose exec wordpress wp plugin update --all --allow-root

# List users
docker-compose exec wordpress wp user list --allow-root

# Create admin user
docker-compose exec wordpress wp user create admin admin@example.com \
    --role=administrator --user_pass=password --allow-root

# Search and replace (useful for domain changes)
docker-compose exec wordpress wp search-replace 'http://old-domain.com' 'https://new-domain.com' \
    --all-tables --allow-root

# Clear cache
docker-compose exec wordpress wp cache flush --allow-root

# Database optimization
docker-compose exec wordpress wp db optimize --allow-root

# Export database
docker-compose exec wordpress wp db export - --allow-root > backup.sql

# Check site health
docker-compose exec wordpress wp site health --allow-root
```

### Install Redis Object Cache

```bash
# Install plugin
docker-compose exec wordpress wp plugin install redis-cache --activate --allow-root

# Enable Redis
docker-compose exec wordpress wp redis enable --allow-root

# Check Redis status
docker-compose exec wordpress wp redis status --allow-root
```

## 💾 Database Management

### Using phpMyAdmin

```bash
# Start phpMyAdmin (if not running)
docker-compose --profile tools up -d phpmyadmin

# Access at: http://localhost:8001
# Login: root / [DB_ROOT_PASSWORD from .env]
```

### Direct MySQL Access

```bash
# Open MySQL shell
docker-compose exec mysql mysql -u root -p

# Or with password from env
source .env
docker-compose exec mysql mysql -u root -p${DB_ROOT_PASSWORD} ${DB_NAME}
```

### Database Operations

```bash
# Export database
docker-compose exec mysql mysqldump \
    -u root -p${DB_ROOT_PASSWORD} \
    ${DB_NAME} > backup-$(date +%Y%m%d).sql

# Import database
docker-compose exec -T mysql mysql \
    -u root -p${DB_ROOT_PASSWORD} \
    ${DB_NAME} < backup.sql

# Optimize database
docker-compose exec mysql mysqlcheck \
    -u root -p${DB_ROOT_PASSWORD} \
    --optimize ${DB_NAME}

# Repair database
docker-compose exec mysql mysqlcheck \
    -u root -p${DB_ROOT_PASSWORD} \
    --repair ${DB_NAME}
```

## 💾 Backups & Restore

### Automatic Backups

```bash
# Start backup service
docker-compose --profile backup up -d backup

# Backups run automatically at 2 AM daily
# Location: ./backups/
```

### Manual Backup

```bash
# Run backup script
./backup.sh

# Backup location: ./backups/[TIMESTAMP]/
# Contains:
#   - database.sql
#   - wordpress-files.tar.gz
#   - .env
#   - docker-compose.yml
```

### Restore from Backup

```bash
# List available backups
ls -lh backups/

# Restore from specific backup
./restore.sh backups/20250101_020000

# Warning: This will overwrite current data!
```

### Offsite Backup to S3

```bash
# Install AWS CLI
apt-get install awscli

# Configure AWS credentials
aws configure

# Upload backup
aws s3 sync ./backups/ s3://my-bucket/wordpress-backups/

# Automated with cron
cat > /etc/cron.daily/wordpress-backup << 'EOF'
#!/bin/bash
cd /path/to/wordpress
./backup.sh
aws s3 sync ./backups/ s3://my-bucket/wordpress-backups/
find ./backups/ -mtime +30 -delete
EOF
chmod +x /etc/cron.daily/wordpress-backup
```

## ⚡ Performance Tuning

### Enable Redis Cache

```bash
# Install and activate plugin
docker-compose exec wordpress wp plugin install redis-cache --activate --allow-root

# Enable Redis
docker-compose exec wordpress wp redis enable --allow-root

# Verify it's working
docker-compose exec wordpress wp redis status --allow-root

# Check Redis stats
docker-compose exec redis redis-cli INFO stats
```

### Monitor Redis

```bash
# Real-time monitoring
docker-compose exec redis redis-cli MONITOR

# Check memory usage
docker-compose exec redis redis-cli INFO memory

# Check connected clients
docker-compose exec redis redis-cli CLIENT LIST

# Flush cache if needed
docker-compose exec redis redis-cli FLUSHALL
```

### MySQL Optimization

```bash
# Check MySQL variables
docker-compose exec mysql mysql -u root -p${DB_ROOT_PASSWORD} \
    -e "SHOW VARIABLES LIKE 'innodb_buffer_pool_size';"

# Analyze slow queries
docker-compose exec mysql cat /var/log/mysql/slow-query.log

# Check table sizes
docker-compose exec mysql mysql -u root -p${DB_ROOT_PASSWORD} -e "
    SELECT table_name, 
           ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
    FROM information_schema.TABLES 
    WHERE table_schema = '${DB_NAME}'
    ORDER BY (data_length + index_length) DESC;"
```

### Monitor Resource Usage

```bash
# Real-time stats
docker stats

# Resource limits
docker-compose exec wordpress free -h
docker-compose exec wordpress df -h

# Apache status (if mod_status enabled)
curl http://localhost:2001/server-status
```

## 🐛 Troubleshooting

### Site Not Loading

```bash
# 1. Check if containers are running
docker-compose ps

# 2. Check logs for errors
docker-compose logs --tail=50

# 3. Check if port is accessible
curl -I http://localhost:2001

# 4. Check database connection
docker-compose exec wordpress wp db check --allow-root

# 5. Restart services
docker-compose restart
```

### Database Connection Errors

```bash
# Check MySQL is running
docker-compose ps mysql

# Check MySQL logs
docker-compose logs mysql

# Test database connection
docker-compose exec wordpress wp db check --allow-root

# Verify environment variables
docker-compose exec wordpress env | grep WORDPRESS_DB
```

### Permission Issues

```bash
# Fix WordPress file permissions
docker-compose exec wordpress chown -R www-data:www-data /var/www/html

# Fix upload directory
docker-compose exec wordpress chmod -R 755 /var/www/html/wp-content/uploads
```

### Redis Not Working

```bash
# Check Redis is running
docker-compose ps redis

# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli PING
# Should return: PONG

# Check WordPress Redis plugin status
docker-compose exec wordpress wp redis status --allow-root
```

### High CPU/Memory Usage

```bash
# Check resource usage
docker stats

# Check slow queries
docker-compose exec mysql cat /var/log/mysql/slow-query.log

# Identify problematic plugins
docker-compose exec wordpress wp plugin list --allow-root

# Disable all plugins
docker-compose exec wordpress wp plugin deactivate --all --allow-root

# Enable one by one to find culprit
docker-compose exec wordpress wp plugin activate [plugin-name] --allow-root
```

### Site Running Slow

```bash
# 1. Enable query monitor plugin
docker-compose exec wordpress wp plugin install query-monitor --activate --allow-root

# 2. Check Redis cache hit rate
docker-compose exec redis redis-cli INFO stats | grep keyspace

# 3. Optimize database
docker-compose exec wordpress wp db optimize --allow-root

# 4. Clear all caches
docker-compose exec wordpress wp cache flush --allow-root
docker-compose exec redis redis-cli FLUSHALL

# 5. Check Apache/PHP-FPM workers
docker-compose exec wordpress ps aux | grep apache
```

### Clean Up Docker

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Nuclear option (removes everything unused)
docker system prune -a --volumes
```

## 🔒 Security

### Update WordPress Core

```bash
# Check for updates
docker-compose exec wordpress wp core check-update --allow-root

# Update to latest
docker-compose exec wordpress wp core update --allow-root

# Update database
docker-compose exec wordpress wp core update-db --allow-root
```

### Update Plugins

```bash
# List outdated plugins
docker-compose exec wordpress wp plugin list --update=available --allow-root

# Update all plugins
docker-compose exec wordpress wp plugin update --all --allow-root

# Update specific plugin
docker-compose exec wordpress wp plugin update [plugin-name] --allow-root
```

### Security Hardening

```bash
# Change admin username (never use 'admin')
docker-compose exec wordpress wp user create newadmin admin@example.com \
    --role=administrator --allow-root
docker-compose exec wordpress wp user delete admin --reassign=newadmin --allow-root

# Change table prefix if still using wp_
docker-compose exec wordpress wp db prefix --allow-root

# Install security plugin
docker-compose exec wordpress wp plugin install wordfence --activate --allow-root

# Disable file editing
# (Already configured in docker-compose.yml via WORDPRESS_CONFIG_EXTRA)

# Check for vulnerable plugins
docker-compose exec wordpress wp plugin list --allow-root
```

### SSL/HTTPS Configuration

```bash
# Force HTTPS (after SSL certificate is installed)
docker-compose exec wordpress wp search-replace 'http://yoursite.com' 'https://yoursite.com' \
    --all-tables --allow-root

# Or use Really Simple SSL plugin
docker-compose exec wordpress wp plugin install really-simple-ssl --activate --allow-root
```

### Regular Security Checks

```bash
# Check file integrity
docker-compose exec wordpress wp core verify-checksums --allow-root

# Scan for malware (with Wordfence)
docker-compose exec wordpress wp wordfence scan --allow-root

# Check user permissions
docker-compose exec wordpress wp user list --allow-root

# Review installed plugins
docker-compose exec wordpress wp plugin list --allow-root
```

## 📊 Monitoring

### Setup Prometheus Monitoring

```yaml
# Add to docker-compose.yml
  wordpress-exporter:
    image: prometheuscommunity/wordpress-exporter
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_USER: ${DB_USER}
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
      WORDPRESS_DB_NAME: ${DB_NAME}
    ports:
      - "9117:9117"
```

### Health Checks

```bash
# Site health check
curl -I http://localhost:2001

# WordPress API health
curl http://localhost:2001/wp-json/

# Database health
docker-compose exec mysql mysqladmin ping -u root -p${DB_ROOT_PASSWORD}

# Redis health
docker-compose exec redis redis-cli PING
```

## 🔄 Migration

### Migrate to Another Server

```bash
# 1. Backup on old server
./backup.sh

# 2. Copy backup to new server
scp -r backups/[TIMESTAMP] user@newserver:/path/

# 3. Setup on new server
./setup.sh

# 4. Restore backup
./restore.sh backups/[TIMESTAMP]

# 5. Update site URL
docker-compose exec wordpress wp search-replace \
    'http://oldserver.com' 'http://newserver.com' \
    --all-tables --allow-root
```

### Change Domain

```bash
# Update site URL in database
docker-compose exec wordpress wp search-replace \
    'https://old-domain.com' 'https://new-domain.com' \
    --all-tables --allow-root

# Clear cache
docker-compose exec wordpress wp cache flush --allow-root
docker-compose exec redis redis-cli FLUSHALL

# Update .env file
nano .env
# Change DOMAIN and SITE_URL

# Restart containers
docker-compose restart
```

---

## 📚 Additional Resources

- [Official WordPress Documentation](https://wordpress.org/support/)
- [WP-CLI Handbook](https://make.wordpress.org/cli/handbook/)
- [Docker Documentation](https://docs.docker.com/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)
- [Redis Documentation](https://redis.io/documentation)

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify configuration: `docker-compose config`
3. Check container status: `docker-compose ps`
4. Review this guide's troubleshooting section
5. Check Docker and WordPress forums

---

**Remember:** Always backup before making changes!
