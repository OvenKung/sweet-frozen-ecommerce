# 🍦 Sweet Frozen E-commerce

> ร้านไอศกรีมออนไลน์ชั้นนำ ส่งไอศกรีมคุณภาพสูง สดใหม่ อร่อย ถึงบ้านคุณทุกวัน

[![Deploy Status](https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce/workflows/🚀%20Deploy%20Sweet%20Frozen%20E-commerce/badge.svg)](https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce/actions)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue.svg)](https://YOUR_USERNAME.github.io/sweet-frozen-ecommerce)

## ✨ Features

### 🛒 Core E-commerce Features
- **Product Catalog** - แสดงสินค้าไอศกรีมทุกรสชาติ
- **Shopping Cart** - ระบบตะกร้าสินค้าที่ใช้งานง่าย
- **User Authentication** - ระบบสมาชิกและการเข้าสู่ระบบ
- **Order Management** - ระบบจัดการคำสั่งซื้อ
- **Payment Integration** - ระบบการชำระเงิน

### 🎯 Advanced Features
- **Product Reviews** - ระบบรีวิวและให้คะแนนสินค้า
- **Coupon System** - ระบบคูปองส่วนลด
- **Order Tracking** - ติดตามสถานะการสั่งซื้อ
- **Newsletter** - สมัครรับข่าวสารและโปรโมชัน
- **Advanced Search** - ค้นหาและกรองสินค้า
- **Contact Form** - ติดต่อสอบถามข้อมูล

### 🎨 UI/UX Features
- **Responsive Design** - รองรับทุกอุปกรณ์
- **Pastel Theme** - ธีมสีพาสเทลสวยงาม
- **Smooth Animations** - แอนิเมชันนุ่มนวล
- **Toast Notifications** - การแจ้งเตือนแบบ popup
- **Loading States** - สถานะการโหลดที่สวยงาม

## 🚀 Live Demo

เยี่ยมชมเว็บไซต์ได้ที่: [Sweet Frozen E-commerce](https://OvenKung.github.io/sweet-frozen-ecommerce)

### 🔑 Demo Accounts
```
Admin Account:
Email: admin@sweetfrozen.com
Password: admin123

Customer Account:
Email: customer@example.com  
Password: customer123
```

## 💻 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Data**: JSON-based local storage
- **Build**: Node.js scripts
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🛠️ Installation & Development

### Prerequisites
- Node.js (v18 or higher)
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/sweet-frozen-ecommerce.git
cd sweet-frozen-ecommerce

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
npm run validate # Validate files
```

## 📁 Project Structure

```
sweet-frozen-ecommerce/
├── 📄 HTML Pages
│   ├── index.html          # หน้าแรก - แสดงสินค้า
│   ├── cart.html           # ตะกร้าสินค้า
│   ├── checkout.html       # หน้าชำระเงิน
│   ├── login.html          # เข้าสู่ระบบ
│   ├── register.html       # สมัครสมาชิก
│   ├── account.html        # บัญชีผู้ใช้
│   ├── product.html        # รายละเอียดสินค้า
│   └── contact.html        # ติดต่อเรา
│
├── 🎨 Assets
│   ├── css/
│   │   └── styles.css      # สไตล์หลัก + Tailwind
│   ├── js/
│   │   ├── app.js          # แอปหลัก
│   │   ├── auth.js         # ระบบสมาชิก
│   │   ├── cart.js         # ตะกร้าสินค้า
│   │   ├── ui.js           # UI components
│   │   ├── products.js     # จัดการสินค้า
│   │   ├── storage.js      # จัดเก็บข้อมูล
│   │   ├── validation.js   # ตรวจสอบข้อมูล
│   │   └── payment.js      # ระบบชำระเงิน
│   └── data/
│       ├── ice-creams.json # ข้อมูลสินค้า
│       ├── users.json      # ข้อมูลผู้ใช้
│       ├── orders.json     # ข้อมูลคำสั่งซื้อ
│       ├── reviews.json    # ข้อมูลรีวิว
│       ├── coupons.json    # ข้อมูลคูปอง
│       └── categories.json # หมวดหมู่สินค้า
│
├── 🚀 CI/CD
│   ├── .github/workflows/
│   │   └── deploy.yml      # GitHub Actions
│   └── scripts/
│       ├── validate.js     # ตรวจสอบไฟล์
│       └── test.js         # ทดสอบระบบ
│
└── 📋 Config Files
    ├── package.json        # NPM configuration
    └── README.md          # เอกสารนี้
```

## 🔄 CI/CD Pipeline

โปรเจกต์นี้ใช้ GitHub Actions สำหรับ CI/CD pipeline:

### Workflow Steps:
1. **🧪 Test & Validate**
   - ตรวจสอบ syntax ไฟล์ทั้งหมด
   - ทดสอบข้อมูล JSON
   - ตรวจสอบความครบถ้วนของไฟล์

2. **🏗️ Build & Deploy**
   - Build โปรเจกต์
   - Deploy ไปยัง GitHub Pages
   - อัพเดต live demo

### Auto Deployment
- ✅ Deploy อัตโนมัติเมื่อ push ไป `main` branch
- ✅ ทดสอบทุก pull request
- ✅ สร้าง artifact สำหรับการตรวจสอบ

## 🎯 Features Overview

### 🛍️ Shopping Experience
- แสดงสินค้าไอศกรีมพร้อมรูปภาพ
- ระบบค้นหาและกรองสินค้า
- เพิ่มสินค้าลงตะกร้า
- คำนวณราคารวมอัตโนมัติ
- ระบบสมาชิกและล็อกอิน

### 💳 Checkout Process
- กรอกข้อมูลการจัดส่ง
- เลือกวิธีการชำระเงิน
- ยืนยันคำสั่งซื้อ
- ติดตามสถานะการสั่งซื้อ

### 👤 User Management
- สมัครสมาชิกใหม่
- เข้าสู่ระบบ/ออกจากระบบ
- จัดการข้อมูลส่วนตัว
- ประวัติการสั่งซื้อ

## 🎨 Design System

### Color Palette
```css
/* Pastel Theme */
--primary: #a855f7        /* Purple */
--primary-hover: #9333ea  /* Purple Hover */
--accent: #ec4899         /* Pink */
--pastel-pink: #f8bbd9    /* Soft Pink */
--pastel-blue: #bfdbfe    /* Soft Blue */
--pastel-yellow: #fef3c7  /* Soft Yellow */
--pastel-peach: #fed7aa   /* Soft Peach */
```

### Typography
- **Font**: System fonts (San Francisco, Segoe UI, etc.)
- **Weights**: Regular (400), Medium (500), Bold (700), Black (900)
- **Scale**: Tailwind CSS typography scale

## 🔧 Development Guidelines

### Code Style
- ใช้ ES6+ JavaScript features
- ใช้ const/let แทน var
- ใช้ arrow functions
- ใช้ template literals
- มี comments อธิบายฟังก์ชันสำคัญ

### File Organization
- แยกไฟล์ตาม functionality
- ใช้ module pattern สำหรับ JavaScript
- ระบบการตั้งชื่อที่ชัดเจน

### Data Management
- ใช้ localStorage สำหรับ client-side storage
- JSON format สำหรับข้อมูล
- Validation สำหรับ input ทุกตัว

## 🚀 Deployment Guide

### GitHub Pages Setup
1. Fork repository นี้
2. ไปที่ Settings > Pages
3. เลือก Source: GitHub Actions
4. Push code ไป main branch
5. รอ deployment เสร็จ

### Custom Domain (Optional)
1. เพิ่มไฟล์ `CNAME` ใน root directory
2. ใส่ domain name ในไฟล์
3. ตั้งค่า DNS ที่ domain provider

## 📈 Performance

- **Fast Loading**: Minimal dependencies
- **Responsive**: Mobile-first design  
- **SEO Friendly**: Semantic HTML
- **Accessible**: ARIA labels and keyboard navigation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: OvenKung
- **Design**: OvenKung
- **Maintainer**: OvenKung (https://github.com/OvenKung)

## 📞 Contact

- 📧 Email: support@sweetfrozen.com
- 🌐 Website: [Sweet Frozen E-commerce](https://OvenKung.github.io/sweet-frozen-ecommerce)
- 💬 Issues: [GitHub Issues](https://github.com/OvenKung/sweet-frozen-ecommerce/issues)

---

<div align="center">
  <p>Made with ❤️ and 🍦 by OvenKung</p>
  <p>© 2025 Sweet Frozen. สงวนสิทธิ์ทุกประการ</p>
</div>
