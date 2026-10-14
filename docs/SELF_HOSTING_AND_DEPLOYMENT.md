# OmniInvoice UAE — Self-Hosting & Deployment Guide

This document details procedures for deploying OmniInvoice UAE on private clouds, dedicated Linux virtual machines (Ubuntu 22.04 / 24.04 LTS), or containerized environments within the UAE (e.g. AWS Middle East `me-central-1` Dubai/Abu Dhabi).

---

## 1. Containerized Docker Deployment (Recommended)

### Prerequisites
- Docker Engine 24+ and Docker Compose v2+
- Valid domain name with DNS pointing to server IP
- Port 80 and 443 open for web traffic

### Deployment Steps
```bash
# 1. Clone repository
git clone <repo-url> /opt/omni-invoice
cd /opt/omni-invoice

# 2. Configure production secrets
cp .env.example .env.production
nano .env.production
# Ensure strong random strings for APP_SECRET and ENCRYPTION_KEY_AES256

# 3. Build and launch services
docker compose -f docker-compose.yml up -d --build

# 4. Run database migrations
docker compose exec app npx prisma migrate deploy
```

---

## 2. Nginx Reverse Proxy with Let's Encrypt SSL

```nginx
server {
    listen 80;
    server_name invoice.yourcompany.ae;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name invoice.yourcompany.ae;

    ssl_certificate /etc/letsencrypt/live/invoice.yourcompany.ae/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/invoice.yourcompany.ae/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }
}
```

---

## 3. Database Backup & Disaster Recovery Procedures

### Automated Daily Backup Script (`/opt/scripts/backup-db.sh`)
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/omni-postgres"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Perform compressed pg_dump
docker exec -t omni_invoice_postgres pg_dump -U omni_user omni_invoicing_db | gzip > "$BACKUP_DIR/omni_backup_$TIMESTAMP.sql.gz"

# Retain backups for 30 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -delete
```

### Point-in-Time Recovery Procedure
```bash
# 1. Stop application container to prevent incoming writes
docker stop omni_invoice_app

# 2. Restore database from backup
gunzip -c /var/backups/omni-postgres/omni_backup_YYYYMMDD_HHMMSS.sql.gz | docker exec -i omni_invoice_postgres psql -U omni_user -d omni_invoicing_db

# 3. Restart application
docker start omni_invoice_app
```

---

## 4. Self-Hosting Compliance Notice

Self-hosting the OmniInvoice software on your private servers enables complete data sovereignty. However, connecting to the UAE e-invoicing network requires transmitting documents through an **Accredited Service Provider (ASP)** or completing direct accreditation with the UAE Ministry of Finance.
