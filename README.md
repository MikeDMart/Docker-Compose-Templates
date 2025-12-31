# 🎯 Sistema de Rangos de Puertos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/yourusername/port-ranges/graphs/commit-activity)

Sistema organizado de asignación de puertos para infraestructura de servicios web, aplicaciones y herramientas DevOps.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Rangos de Puertos](#rangos-de-puertos)
  - [Websites (1024-19999)](#-websites-1024-19999)
  - [Aplicaciones (20000-29999)](#-aplicaciones-20000-29999)
  - [Herramientas Dev/Ops (30000-39999)](#️-herramientas-devops-30000-39999)
  - [Servicios Internos (40000-49999)](#-servicios-internos-40000-49999)
  - [Reservado Clientes (50000-65535)](#-reservado-clientes-50000-65535)
- [Convenciones](#convenciones)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Descripción

Este documento define un sistema estructurado de asignación de puertos TCP/UDP para facilitar la gestión y organización de servicios en entornos de desarrollo, staging y producción. Cada rango está diseñado para agrupar servicios relacionados, simplificando la administración, el firewall y la documentación de la infraestructura.

## Rangos de Puertos

### 🌐 WEBSITES (1024-19999)

Servicios web orientados al usuario final y gestión de contenido.

| Rango | Categoría | Descripción |
|-------|-----------|-------------|
| `1024-1999` | WordPress Multisitio | Instalaciones WordPress con múltiples sitios |
| `2000-2999` | WordPress Individual | Sitios WordPress independientes |
| `3000-3999` | NextCloud | Instancias de almacenamiento y colaboración |
| `4000-4999` | Ghost Blogs | Plataforma de blogging Ghost |
| `5000-5999` | Sitios Estáticos | HTML/CSS/JS, Gatsby, Hugo, Jekyll |
| `6000-6999` | Desarrollo/Staging | Entornos de prueba y desarrollo |
| `7000-7999` | Landing Pages | Páginas de aterrizaje y marketing |
| `8000-8999` | E-commerce | WooCommerce, Shopify, Magento |
| `9000-9999` | Portfolios | Sitios de portafolio personal/empresarial |

### 🚀 APLICACIONES (20000-29999)

Backend, APIs y servicios de aplicaciones.

| Rango | Categoría | Descripción |
|-------|-----------|-------------|
| `20000-20999` | Bases de Datos | PostgreSQL, MySQL, MongoDB |
| `21000-21999` | Caché | Redis, Memcached, Varnish |
| `22000-22999` | Colas | RabbitMQ, Celery, Bull |
| `23000-23999` | APIs REST | Servicios REST JSON/XML |
| `24000-24999` | GraphQL APIs | Servidores GraphQL |
| `25000-25999` | Microservicios | Arquitectura de microservicios |
| `26000-26999` | WebSockets | Comunicación bidireccional en tiempo real |
| `27000-27999` | RTC | WebRTC, servicios de streaming |
| `28000-28999` | Bots/Automatización | Bots de Discord, Telegram, automatización |

### ⚙️ HERRAMIENTAS DEV/OPS (30000-39999)

Herramientas de desarrollo, testing y operaciones.

| Rango | Categoría | Descripción |
|-------|-----------|-------------|
| `30000-30999` | Monitoreo | Prometheus, Grafana, Zabbix |
| `31000-31999` | Logs Centralizados | ELK Stack, Graylog, Loki |
| `32000-32999` | Backup Automático | Sistemas de respaldo automatizado |
| `33000-33999` | CI/CD Pipelines | Jenkins, GitLab CI, GitHub Actions |
| `34000-34999` | Testing | Selenium, Cypress, testing environments |
| `35000-35999` | Documentación | Wikis, Docusaurus, MkDocs |
| `36000-36999` | Analytics | Matomo, Plausible, herramientas analíticas |
| `37000-37999` | Security Scanning | SonarQube, OWASP ZAP, scanners |
| `38000-38999` | Performance Testing | JMeter, k6, Gatling |

### 🔒 SERVICIOS INTERNOS (40000-49999)

Infraestructura y servicios de soporte interno.

| Rango | Categoría | Descripción |
|-------|-----------|-------------|
| `40000-40999` | Reverse Proxy | Nginx, Traefik, HAProxy |
| `41000-41999` | Autenticación SSO | Keycloak, Auth0, LDAP |
| `42000-42999` | Email Services | Mailservers, SMTP, webmail |
| `43000-43999` | Almacenamiento | MinIO, S3-compatible, NAS |
| `44000-44999` | DNS Interno | Bind9, PowerDNS, CoreDNS |
| `45000-45999` | VPN Services | OpenVPN, WireGuard, IPSec |
| `46000-46999` | Firewall Management | Gestión de firewalls y reglas |
| `47000-47999` | Load Balancers | Balanceadores de carga |
| `48000-48999` | Service Mesh | Istio, Linkerd, Consul |

### 👥 RESERVADO CLIENTES (50000-65535)

Espacio reservado para proyectos específicos de clientes y testing.

| Rango | Categoría | Descripción |
|-------|-----------|-------------|
| `50000-50999` | Cliente A | Servicios dedicados Cliente A |
| `51000-51999` | Cliente B | Servicios dedicados Cliente B |
| `52000-52999` | Cliente C | Servicios dedicados Cliente C |
| `53000-53999` | Cliente D | Servicios dedicados Cliente D |
| `54000-54999` | Cliente E | Servicios dedicados Cliente E |
| `55000-59999` | Reservado | Espacio para futuros clientes |
| `60000-65535` | Emergencias/Testing | Pruebas temporales y emergencias |

## Convenciones

### Nomenclatura de Servicios

Se recomienda seguir este patrón para nombrar servicios:

```
[categoria]-[nombre]-[puerto]
```

**Ejemplos:**
- `wordpress-empresa-2001`
- `api-rest-usuarios-23001`
- `grafana-monitoring-30001`

### Documentación de Puertos

Mantener un registro actualizado en un archivo `ports.yml` o similar:

```yaml
services:
  - name: "Blog Corporativo"
    port: 4001
    category: "Ghost Blogs"
    status: "production"
    owner: "Marketing Team"
```

### Reglas de Firewall

Configurar reglas de firewall basadas en rangos para simplificar gestión:

```bash
# Permitir tráfico web (websites)
iptables -A INPUT -p tcp --dport 1024:19999 -j ACCEPT

# Permitir aplicaciones internas
iptables -A INPUT -p tcp --dport 20000:29999 -s 10.0.0.0/8 -j ACCEPT
```

## Ejemplos de Uso

### Docker Compose

```yaml
version: '3.8'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "2001:80"  # WordPress Individual
    
  mysql:
    image: mysql:8.0
    ports:
      - "20001:3306"  # Base de Datos
    
  redis:
    image: redis:alpine
    ports:
      - "21001:6379"  # Caché
```

### Nginx Reverse Proxy

```nginx
# Sitio en Ghost (puerto 4001)
server {
    listen 80;
    server_name blog.example.com;
    location / {
        proxy_pass http://localhost:4001;
    }
}

# API REST (puerto 23001)
server {
    listen 80;
    server_name api.example.com;
    location / {
        proxy_pass http://localhost:23001;
    }
}
```

## Contribución

Si necesitas añadir nuevas categorías o modificar rangos existentes:

1. Fork este repositorio
2. Crea una rama con tu feature (`git checkout -b feature/nueva-categoria`)
3. Commit tus cambios (`git commit -am 'Añadir nueva categoría'`)
4. Push a la rama (`git push origin feature/nueva-categoria`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Nota:** Los puertos 0-1023 son puertos privilegiados del sistema y requieren permisos de root. Este sistema comienza en 1024 para evitar conflictos con servicios del sistema operativo.

**Última actualización:** Diciembre 2025
