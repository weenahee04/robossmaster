# Roboss — คู่มือ Deploy Production

## สิ่งที่ต้องเตรียม

| รายการ | ลิงก์ |
|--------|-------|
| Supabase account | https://supabase.com |
| Vercel account | https://vercel.com |
| GitHub repo (push code ขึ้นก่อน) | https://github.com |

---

## ขั้นตอนที่ 1: สร้าง Supabase Project

1. ไปที่ https://supabase.com → **New Project**
2. ตั้งชื่อ project เช่น `roboss-prod`
3. เลือก Region: **Southeast Asia (Singapore)**
4. ตั้ง Database Password → **จดไว้**
5. รอสร้างเสร็จ → ไปที่ **Settings → Database**
6. Copy connection strings:
   - **Connection pooling** (port 6543): ใช้เป็น `DATABASE_URL`
   - **Direct connection** (port 5432): ใช้เป็น `DIRECT_URL`

---

## ขั้นตอนที่ 2: Push Code ขึ้น GitHub

```bash
git init
git add .
git commit -m "Production ready"
git remote add origin https://github.com/YOUR_USER/roboss.git
git push -u origin main
```

---

## ขั้นตอนที่ 3: Deploy บน Vercel

1. ไปที่ https://vercel.com → **Add New Project**
2. Import GitHub repo ที่เพิ่ง push
3. ตั้ง **Environment Variables** ดังนี้:

| Variable | ค่า |
|----------|-----|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres` |
| `NEXTAUTH_SECRET` | สร้างด้วย `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (หรือ custom domain) |

4. กด **Deploy** → รอ build เสร็จ

---

## ขั้นตอนที่ 4: สร้าง Database Tables

รันจากเครื่อง local (ต้องตั้ง `.env` ให้ชี้ไป Supabase ก่อน):

```bash
# ตั้ง .env ให้ชี้ไป Supabase
# DATABASE_URL="postgresql://postgres.[REF]:[PASS]@...6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[REF]:[PASS]@...5432/postgres"

# สร้าง tables
npx prisma migrate dev --name init

# หรือถ้า deploy ครั้งแรก
npx prisma db push
```

---

## ขั้นตอนที่ 5: Seed ข้อมูลพื้นฐาน

```bash
# ตั้ง password จริงของ Super Admin
ADMIN_PASSWORD="รหัสผ่านจริง" ADMIN_EMAIL="admin@roboss.com" npx tsx prisma/seed.ts
```

**Windows PowerShell:**
```powershell
$env:ADMIN_PASSWORD="รหัสผ่านจริง"
$env:ADMIN_EMAIL="admin@roboss.com"
npx tsx prisma/seed.ts
```

Seed จะสร้าง:
- ✅ Super Admin account
- ✅ หมวดหมู่รายรับ/รายจ่าย
- ✅ แพ็กเกจล้างรถ (Global)
- ✅ ROI Config
- ✅ SOP Documents
- ✅ Machine Manuals
- ✅ Site Config

---

## ขั้นตอนที่ 6: เริ่มใช้งาน

1. เข้า `https://your-project.vercel.app/admin/login`
2. ล็อกอินด้วย Super Admin
3. สร้างสาขาจริงผ่าน **จัดการสาขา**
4. สร้าง Branch Admin / Investor ผ่าน **จัดการผู้ใช้**
5. แจก URL ให้แต่ละสาขา: `https://your-domain/branch/[slug]/login`

---

## Custom Domain (ถ้ามี)

1. Vercel → Project Settings → Domains → Add Domain
2. ตั้ง DNS record ตามที่ Vercel แนะนำ
3. อัปเดต `NEXTAUTH_URL` ใน Vercel env vars ให้ตรงกับ domain ใหม่
4. Redeploy

---

## คำสั่งที่ใช้บ่อย

```bash
# ดู database ผ่าน UI
npx prisma studio

# รัน migration ใหม่
npx prisma migrate dev --name <ชื่อ>

# Deploy migration ขึ้น production
npx prisma migrate deploy

# Regenerate Prisma client
npx prisma generate
```
