# Operations Runbook

## 🔧 Common Operations

### 1. System Start/Stop

```bash
# Start Services
#!/bin/bash

# 1. Start Database
docker-compose up -d postgresql

# 2. Start Redis
docker-compose up -d redis

# 3. Start Application
npm run start:prod

# Stop Services
#!/bin/bash
docker-compose down
pm2 stop all
```

### 2. Health Checks

```typescript
const healthChecks = {
  // API Health Check
  async checkAPI() {
    const response = await fetch('/api/health');
    const data = await response.json();
    
    return {
      status: data.status === 'healthy' ? 'up' : 'down',
      latency: data.latency,
      dependencies: data.dependencies
    };
  },

  // Database Health Check
  async checkDatabase() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (error) {
      return { status: 'down', error };
    }
  }
};
```

## 🔄 Routine Tasks

### 1. Backup Management

```bash
# Database Backup
#!/bin/bash

# Variables
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/db"

# Create backup
pg_dump -Fc nextleveltraders > $BACKUP_DIR/db_$DATE.dump

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.dump s3://backups/db/

# Cleanup old backups
find $BACKUP_DIR -type f -mtime +30 -delete
```

### 2. Log Rotation

```yaml
# logrotate.conf
/var/log/nextleveltraders/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        /usr/bin/systemctl reload nextleveltraders
    endscript
}
```

## 🚨 Incident Response

### 1. High CPU Usage

```bash
# CPU Usage Analysis
#!/bin/bash

# Check system load
uptime

# Find top CPU processes
top -b -n 1 | head -n 20

# Node.js specific analysis
node --prof-process isolate-*.log > process-profile.txt
```

### 2. Memory Issues

```typescript
// Memory Leak Investigation
const memoryCheck = {
  async analyzeMemory() {
    const usage = process.memoryUsage();
    
    if (usage.heapUsed > 1.5 * 1024 * 1024 * 1024) { // 1.5GB
      // Take heap snapshot
      const snapshot = await takeHeapSnapshot();
      
      // Upload for analysis
      await uploadHeapSnapshot(snapshot);
      
      // Notify team
      await notifyTeam('High Memory Usage Detected');
    }
  }
};
```

## 📊 Monitoring

### 1. Metrics Collection

```typescript
const metrics = {
  // System Metrics
  async collectSystemMetrics() {
    return {
      cpu: await getCPUMetrics(),
      memory: await getMemoryMetrics(),
      disk: await getDiskMetrics(),
      network: await getNetworkMetrics()
    };
  },

  // Application Metrics
  async collectAppMetrics() {
    return {
      requests: await getRequestMetrics(),
      errors: await getErrorMetrics(),
      latency: await getLatencyMetrics(),
      users: await getUserMetrics()
    };
  }
};
```

### 2. Alert Management

```typescript
const alerts = {
  levels: {
    critical: {
      pagerduty: true,
      slack: true,
      email: true
    },
    warning: {
      slack: true,
      email: true
    },
    info: {
      slack: true
    }
  },

  async handleAlert(alert: Alert) {
    const level = this.levels[alert.severity];
    
    if (level.pagerduty) {
      await pagerduty.createIncident(alert);
    }
    
    if (level.slack) {
      await slack.sendAlert(alert);
    }
    
    if (level.email) {
      await email.sendAlert(alert);
    }
  }
};
```

## 🔒 Security Operations

### 1. Access Management

```typescript
const access = {
  // User Access Review
  async reviewAccess() {
    const users = await getActiveUsers();
    
    for (const user of users) {
      const lastLogin = await getLastLogin(user);
      const permissions = await getPermissions(user);
      
      if (daysSince(lastLogin) > 90) {
        await disableUser(user);
        await notifyAdmin(`User ${user.email} disabled due to inactivity`);
      }
    }
  },

  // Permission Updates
  async updatePermissions(userId: string, role: string) {
    await audit.log('permission_change', {
      user: userId,
      role,
      changedBy: currentUser.id
    });
    
    await updateUserRole(userId, role);
  }
};
```

### 2. Security Scanning

```bash
# Security Scan Script
#!/bin/bash

# OWASP ZAP Scan
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-baseline.py -t https://nextleveltraders.com -r scan-report.html

# Dependency Check
npm audit

# Container Scan
trivy image nextleveltraders:latest
```

## 📦 Deployment

### 1. Deployment Verification

```typescript
const deployment = {
  async verifyDeployment() {
    const checks = [
      // Health Checks
      await checkApplicationHealth(),
      await checkDatabaseHealth(),
      await checkCacheHealth(),
      
      // Smoke Tests
      await runSmokeTests(),
      
      // Performance Tests
      await checkResponseTimes(),
      await checkErrorRates(),
      
      // Integration Tests
      await verifyIntegrations()
    ];
    
    return checks.every(check => check.status === 'passed');
  }
};
```

### 2. Rollback Procedure

```typescript
const rollback = {
  async performRollback(version: string) {
    // 1. Stop Current Version
    await stopApplication();
    
    // 2. Deploy Previous Version
    await deployVersion(version);
    
    // 3. Run Migrations
    await runDownMigrations();
    
    // 4. Start Application
    await startApplication();
    
    // 5. Verify
    await verifyDeployment();
  }
};
```

## 🔧 Maintenance

### 1. Database Maintenance

```sql
-- Database Maintenance Tasks
-- 1. Analyze Tables
ANALYZE VERBOSE;

-- 2. Vacuum Database
VACUUM ANALYZE;

-- 3. Reindex
REINDEX DATABASE nextleveltraders;

-- 4. Update Statistics
ANALYZE VERBOSE;
```

### 2. Cache Management

```typescript
const cacheOps = {
  async manageCaches() {
    // 1. Clear Expired Items
    await redis.clearExpired();
    
    // 2. Update Cache Stats
    const stats = await redis.info();
    
    // 3. Optimize Memory
    if (stats.used_memory > MAX_MEMORY) {
      await redis.flushLeastUsed();
    }
  }
};
```

## 📚 Reference

### 1. Important Commands

```bash
# System Commands
pm2 list                    # List processes
pm2 logs                    # View logs
pm2 monit                   # Monitor processes

# Database Commands
psql -U postgres            # Connect to PostgreSQL
redis-cli                   # Connect to Redis
mongosh                     # Connect to MongoDB

# Docker Commands
docker ps                   # List containers
docker logs                 # View container logs
docker-compose up           # Start services
```

### 2. Contact Information

```typescript
const contacts = {
  emergency: {
    primary: 'oncall@nextleveltraders.com',
    phone: '+49 123 456789',
    pagerduty: 'PD12345'
  },
  
  teams: {
    devops: 'devops@nextleveltraders.com',
    security: 'security@nextleveltraders.com',
    development: 'dev@nextleveltraders.com'
  },
  
  external: {
    aws: 'https://console.aws.amazon.com/support/home',
    stripe: 'https://dashboard.stripe.com/support',
    cloudflare: 'https://dash.cloudflare.com/support'
  }
};