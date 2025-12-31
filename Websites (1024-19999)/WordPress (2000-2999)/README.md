# 📝 WordPress Single Sites (2000-2999)

Individual WordPress installations - one site per instance.

## Port Range

**2000-2999** = 1,000 available ports for WordPress sites

## Quick Start

```bash
# Create new site
cp template.yml my-site-2001.yml

# Edit configuration
nano my-site-2001.yml

# Deploy
docker-compose -f my-site-2001.yml up -d
```

## File Naming

```
site-name-PORT.yml
```

**Examples:**
- `company-blog-2001.yml`
- `client-website-2050.yml`
- `personal-site-2100.yml`

## Basic Configuration Template

```yaml
# template.yml
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    container_name: wp-PORT
    ports:
      - "PORT:80"
    environment:
      WORDPRESS_DB_HOST: mysql:3306
      WORDPRESS_DB_NAME: wp_PORT
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./wp-content:/var/www/html/wp-content
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mysql-PORT
    environment:
      MYSQL_DATABASE: wp_PORT
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - ./db-data:/var/lib/mysql
    restart: unless-stopped
```

## Port Allocation Strategy

| Ports | Usage |
|-------|-------|
| 2000-2099 | Client sites |
| 2100-2199 | Internal projects |
| 2200-2299 | Personal sites |
| 2300-2399 | Testing/staging |
| 2400-2999 | Available |

## Common Commands

```bash
# Start site
docker-compose -f site-2001.yml up -d

# Stop site
docker-compose -f site-2001.yml down

# View logs
docker logs wp-2001

# Backup database
docker exec mysql-2001 mysqldump -u wordpress -p wp_2001 > backup.sql

# Restart
docker-compose -f site-2001.yml restart
```

## Environment Variables

Create `.env` file:

```bash
DB_PASSWORD=your_secure_password
DB_ROOT_PASSWORD=your_root_password
```

## Health Check

```bash
# Check if site is running
curl -I http://localhost:2001

# Expected response
HTTP/1.1 200 OK
```

## Notes

- Each WordPress site gets its own MySQL instance
- Default port mapping: `HOST_PORT:80`
- Always use `.env` for passwords
- Backup regularly: database + wp-content folder
- SSL configured via reverse proxy (Nginx/Traefik)

## Current Sites

<!-- Update this list when adding/removing sites -->

| Port | Site Name | Owner | Status |
|------|-----------|-------|--------|
| 2001 | Company Blog | Marketing | Active |
| 2002 | Client Site A | Sales | Active |
| 2050 | Personal Blog | John | Active |

## Quick Reference

```bash
# Find available port
for port in {2000..2999}; do
  ! nc -z localhost $port && echo "$port available" && break
done

# List all WordPress containers
docker ps | grep wp-

# Stop all WordPress sites
docker ps | grep wp- | awk '{print $1}' | xargs docker stop
```

---

**Capacity:** Check usage with `ls -1 *.yml | wc -l`  
**Available:** 1000 ports total
