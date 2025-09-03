# 🚀 Deployment Guide - Sweet Frozen E-commerce

## Quick Start

### 1. สร้าง GitHub Repository
```bash
# 1. ไปที่ https://github.com และสร้าง repository ใหม่
# 2. ตั้งชื่อ: sweet-frozen-ecommerce
# 3. เลือก Public
# 4. อย่าเลือก "Initialize with README"
```

### 2. Deploy ด้วยสคริปต์อัตโนมัติ
```bash
# แทนที่ YOUR_USERNAME ด้วย GitHub username ของคุณ
./setup-github.sh YOUR_USERNAME

# ตัวอย่าง:
./setup-github.sh ovenkung
```

### 3. ตั้งค่า GitHub Pages
1. ไปที่ repository ใน GitHub
2. คลิก **Settings** → **Pages**
3. ใน Source เลือก **GitHub Actions**
4. รอให้ workflow รันเสร็จ (ประมาณ 2-3 นาที)

## Manual Setup (ถ้าไม่ใช้สคริปต์)

### Step 1: เชื่อมต่อ Git Repository
```bash
# แทนที่ YOUR_USERNAME ด้วยชื่อจริง
git remote add origin https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce.git
git branch -M main
git push -u origin main
```

### Step 2: ตรวจสอบ Workflow
```bash
# ดู status ของ GitHub Actions
# ไปที่ GitHub → Actions tab
# ดูว่า workflow "🚀 Deploy Sweet Frozen E-commerce" รันสำเร็จ
```

### Step 3: เข้าถึงเว็บไซต์
```
https://YOUR_USERNAME.github.io/sweet-frozen-ecommerce
```

## 🔧 Troubleshooting

### ปัญหา: Push ไม่ได้
```bash
# ตรวจสอบ remote
git remote -v

# ลบ remote เก่า (ถ้ามี)
git remote remove origin

# เพิ่มใหม่
git remote add origin https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce.git
```

### ปัญหา: Workflow ล้มเหลว
1. ไปที่ **Actions** tab ใน GitHub
2. คลิกที่ workflow ที่ล้มเหลว
3. ดู error logs
4. แก้ไขปัญหาแล้ว push ใหม่

### ปัญหา: Pages ไม่แสดง
1. ตรวจสอบว่า Pages ตั้งค่าเป็น "GitHub Actions"
2. รอ 5-10 นาทีหลังจาก deploy เสร็จ
3. ลองเข้า URL: `https://YOUR_USERNAME.github.io/sweet-frozen-ecommerce`

## 🚀 CI/CD Pipeline Details

### GitHub Actions Workflows

#### 1. 🚀 Deploy Workflow (`.github/workflows/deploy.yml`)
- **Trigger**: Push to main branch
- **Jobs**:
  - Test & Validate files
  - Build project
  - Deploy to GitHub Pages

#### 2. 🔍 Quality Check (`.github/workflows/quality.yml`)
- **Trigger**: Push/PR to main/develop
- **Jobs**:
  - Code formatting check
  - Security scan
  - Code metrics analysis

### Build Process
```bash
npm install    # Install dependencies
npm run test   # Run tests
npm run validate  # Validate files
npm run build  # Build for production
```

## 📊 Monitoring

### Check Deployment Status
```bash
# GitHub Actions status badge
https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce/workflows/🚀%20Deploy%20Sweet%20Frozen%20E-commerce/badge.svg
```

### Website Analytics
- เข้าถึงผ่าน GitHub Insights
- ดู traffic ใน Settings → Insights → Traffic

## 🔄 Updates & Maintenance

### Deploy Changes
```bash
# แก้ไขไฟล์
git add .
git commit -m "✨ Add new feature"
git push origin main
# GitHub Actions จะ deploy อัตโนมัติ
```

### Environment Variables
สำหรับ production ควรตั้งค่า:
- `NODE_ENV=production`
- การตั้งค่า caching
- การปรับแต่ง performance

## 🌟 Advanced Features

### Custom Domain Setup
1. เพิ่มไฟล์ `CNAME` ใน root:
```
yourdomain.com
```

2. ตั้งค่า DNS ที่ domain provider:
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### SSL Certificate
- GitHub Pages มี SSL อัตโนมัติ
- สำหรับ custom domain ใช้ Let's Encrypt

## 📞 Support

### GitHub Repository
- **Issues**: Report bugs หรือ feature requests
- **Discussions**: ถาม-ตอบและแบ่งปันประสบการณ์
- **Wiki**: เอกสารเพิ่มเติม

### Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Sweet Frozen E-commerce README](README.md)

---

**Made with ❤️ and 🍦 by Sweet Frozen Team**
