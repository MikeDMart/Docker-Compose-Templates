# 🐳 The Docker Library

> Enterprise Port Range Management System - Find your perfect Docker stack in seconds

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://yourusername.github.io/TheDockerLibrary/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 What is this?

The Docker Library is an interactive wizard that helps you build production-ready `docker-compose.yml` files using industry-standard port allocation practices.

### Why Port Ranges?

In modern infrastructure, **structured port allocation** provides:

- 🔍 **Discoverability**: Know what a service does by its port number
- 🛡️ **Security**: Implement granular firewall rules
- 📊 **Monitoring**: Group related services easily
- 🚀 **Scalability**: Plan capacity and avoid conflicts
- 📝 **Documentation**: Self-documenting infrastructure

## ✨ Features

- **Smart Filtering**: Cascade filters (Port Range → Category → Use Case → Technology)
- **4+ Ready Templates**: WordPress, Next.js, Monitoring stacks, and more
- **Interactive Preview**: See your YAML before customizing
- **Dynamic Forms**: Only fill fields your stack needs
- **Community Library**: Save and share templates (Supabase)
- **One-Click Download**: Get your `docker-compose.yml` instantly

## 🚀 Quick Start

### Option 1: Use Online

Just visit: [https://yourusername.github.io/TheDockerLibrary/](https://yourusername.github.io/TheDockerLibrary/)

### Option 2: Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/TheDockerLibrary.git
cd TheDockerLibrary

# Serve locally (Python)
python3 -m http.server 8000

# Or use Live Server in VS Code
# Then open: http://localhost:8000
```

## 📖 Usage

### 1. Filter Your Stack

Choose filters to narrow down templates:
- **Port Range**: Websites (1024-19999), Applications (20000-29999), etc.
- **Category**: WordPress, Static Sites, Databases, Monitoring
- **Use Case**: What problem you're solving
- **Technologies**: Specific tools you need

### 2. Preview Template

See the technical YAML without any personal data:
- Review service configuration
- Check port allocations
- Understand the stack architecture

### 3. Save to Community (Optional)

Logged-in users can save templates to the community library for others to use.

### 4. Personalize

Fill in your specific configuration:
- Port numbers
- Database credentials
- Service names
- Passwords

### 5. Download

Get your ready-to-use `docker-compose.yml`:
```bash
docker-compose up -d
```

## 📊 Port Range Reference

| Range | Category | Example Services |
|-------|----------|------------------|
| 1024-19999 | **Websites** | WordPress, Ghost, Static Sites |
| 20000-29999 | **Applications** | Databases, APIs, Message Queues |
| 30000-39999 | **DevOps** | Monitoring, CI/CD, Logging |
| 40000-49999 | **Infrastructure** | Reverse Proxy, VPN, DNS |
| 50000-65535 | **Client Reserved** | Custom deployments |

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3
- **Backend**: Supabase (Auth + Database)
- **Deployment**: GitHub Pages
- **Design**: Editorial / Coffee Shop aesthetic

## 🔐 Authentication

Login with Google to:
- Save templates to the community
- Access saved configurations
- Contribute to the template library

## 🤝 Contributing

We welcome community templates!

### Adding a Template

1. Fork this repo
2. Add your template to `app.js` in the `TEMPLATES` array
3. Follow the existing structure:
   ```javascript
   {
     id: "unique-id",
     name: "Display Name",
     portRange: "start-end",
     category: "Category",
     technologies: ["Tech1", "Tech2"],
     description: "What it does",
     yamlTemplate: `...`,
     requiredFields: [...]
   }
   ```
4. Submit a Pull Request

### Template Guidelines

- Follow port range conventions
- Use descriptive field hints
- Include sensible defaults
- Test your YAML works
- Add comprehensive descriptions

## 📜 License

MIT License - feel free to use this for your own projects!

## 🙏 Credits

Built with ☕ by **Mike D. Martinez**

Port range system inspired by enterprise DevOps practices and modern microservices architecture patterns.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/TheDockerLibrary/issues)
- **Email**: mike.d.martinez93@gmail.com
- **LinkedIn**: [douglasm-517037386](https://linkedin.com/in/douglasm-517037386)

---

Made with dedication to making Docker deployment accessible to everyone 🐳
