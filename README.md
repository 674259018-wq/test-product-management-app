# Journal Management System

ระบบจัดการวารสารสำหรับสร้าง ดู ค้นหา กรอง แก้ไข และลบรายการวารสาร พัฒนาด้วย React + Vite, Express, Sequelize และ PostgreSQL

## ความสามารถ

- แสดงรายการวารสารเป็นการ์ด พร้อมหมวดหมู่ สถานะ ผู้รับผิดชอบ และวันที่
- ค้นหาจากชื่อวารสารหรือผู้รับผิดชอบ และกรองตามหมวด `วิชาการ`, `วิจัย` หรือ `ทั่วไป`
- เพิ่ม ดูรายละเอียด แก้ไข และลบวารสาร
- หลังเพิ่ม ระบบกลับไปหน้ารายการและแสดงรายการใหม่ไว้ด้านบน
- แสดงสถานะโหลด ข้อผิดพลาด และกรณีไม่มีผลลัพธ์

ระบบนี้ไม่มีระบบสมาชิก ไม่มีการอัปโหลดไฟล์ และไม่มีตารางความสัมพันธ์กับ entity อื่น

## เทคโนโลยีและสิ่งที่ต้องเตรียม

- Node.js 22 ขึ้นไป
- npm
- Docker Desktop พร้อม Docker Compose plugin สำหรับวิธีรันด้วย Docker
- PostgreSQL หากเลือกติดตั้งและรัน Backend โดยไม่ใช้ Docker

## โครงสร้างโปรเจกต์

```text
.
├── backend/
│   ├── config/       # การเชื่อมต่อและ sync ฐานข้อมูล
│   ├── controller/   # validation และการทำงานของ API
│   ├── model/        # Sequelize Journal model
│   ├── router/       # API routes
│   └── index.js      # Express server
├── frontend/
│   └── src/          # React pages, components และ services
├── docker-compose.yml
└── README.md
```

## ตั้งค่า Environment

มี environment file สองตำแหน่งและใช้คนละหน้าที่:

- `.env` ที่ root ใช้ให้ Docker Compose กำหนด port และตั้งค่า PostgreSQL container
- `backend/.env` ใช้กำหนด port ของ API และค่าที่ Backend ใช้เชื่อมฐานข้อมูล

ห้าม commit password หรือ secret จริงขึ้น Git และห้ามเผยแพร่ไฟล์ `.env` ที่มี credentials

### Root `.env` สำหรับ Docker Compose

สร้างหรือแก้ `.env` ที่ root ให้มีตัวแปรต่อไปนี้ ตัวอย่างนี้ใช้ค่าทดสอบในเครื่องเท่านั้น:

```dotenv
NODE_ENV=development
POSTGRES_USER=journal_user
POSTGRES_PASSWORD=change_this_password
POSTGRES_DB=journal_db
POSTGRES_PORT=5432
BACKEND_PORT=5000
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:5000
```

### `backend/.env`

ตั้งค่าฐานข้อมูลให้ตรงกับ `POSTGRES_USER`, `POSTGRES_PASSWORD` และ `POSTGRES_DB` ใน root `.env`:

```dotenv
BACKEND_PORT=5000
DB_HOST=postgres-db
DB_PORT=5432
DB_NAME=journal_db
DB_USER=journal_user
DB_PASSWORD=change_this_password
```

Backend รองรับการเชื่อมต่อด้วย `DATABASE_URL_UNPOOLED` หรือ `DATABASE_URL` ด้วย หากกำหนด URL ตัวแปร URL จะถูกใช้ก่อนค่าชุด `DB_*` ส่วน URL สำหรับฐานข้อมูลภายนอกควรใช้ secret ที่เหมาะสมและเปิด SSL ตามผู้ให้บริการกำหนด

### `frontend/.env` สำหรับรัน Frontend บนเครื่อง

```dotenv
VITE_API_URL=http://localhost:5000
```

ค่า `VITE_API_URL` ไม่ต้องมี `/api/journals` ต่อท้าย เพราะ Frontend จะประกอบ path นี้ให้อัตโนมัติ

## เริ่มระบบด้วย Docker

1. ตั้งค่า `.env` และ `backend/.env` ตามตัวอย่างด้านบน
2. เปิด terminal ที่โฟลเดอร์ root ซึ่งมี `docker-compose.yml`
3. เริ่ม PostgreSQL, Backend และ Frontend:

```bash
docker compose up -d
```

4. ตรวจสอบสถานะ container:

```bash
docker compose ps
```

5. เปิดเว็บที่ `http://localhost:5173` และ API ที่ `http://localhost:5000`

Compose จะรอให้ PostgreSQL ผ่าน health check ก่อนเริ่ม Backend และเก็บข้อมูลฐานข้อมูลไว้ใน named volume `pgdata` การแก้ `.env` หรือ Compose configuration ให้สร้าง Backend container ใหม่:

```bash
docker compose up -d --force-recreate backend
```

ดู log ระหว่างพัฒนา:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres-db
```

หยุด container โดยเก็บข้อมูลฐานข้อมูลไว้:

```bash
docker compose down
```

หลีกเลี่ยง `docker compose down -v` หากต้องการเก็บข้อมูล เพราะคำสั่งนี้ลบ volume `pgdata` ด้วย

## รันแยกโดยไม่ใช้ Docker

1. เตรียม PostgreSQL ให้ทำงาน และสร้าง database สำหรับระบบ
2. ตั้งค่า `backend/.env` โดยใช้ `DB_HOST=localhost` เมื่อ PostgreSQL เปิด port บนเครื่องเดียวกัน:

```dotenv
BACKEND_PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=journal_db
DB_USER=journal_user
DB_PASSWORD=change_this_password
```

3. ติดตั้งและเริ่ม Backend:

```bash
cd backend
npm ci
npm run dev
```

4. เปิด terminal อีกหน้าต่าง ติดตั้งและเริ่ม Frontend:

```bash
cd frontend
npm ci
npm run dev
```

5. เปิด URL ที่ Vite แสดงใน terminal โดยค่าปกติคือ `http://localhost:5173`

สำหรับ Frontend ให้กำหนด `VITE_API_URL=http://localhost:5000` ใน `frontend/.env` หาก Backend ใช้ port อื่น ต้องปรับ URL ให้ตรงกันด้วย

## วิธีใช้งาน

1. เปิดหน้า `/journals` เพื่อดูรายการวารสาร
2. ค้นหาด้วยชื่อวารสารหรือผู้รับผิดชอบ หรือเลือกหมวดเพื่อกรองทันที; สามารถใช้คำค้นและหมวดพร้อมกันได้
3. เลือก **เพิ่มวารสาร** แล้วกรอกชื่อ ผู้รับผิดชอบ หมวด วันที่ คำอธิบาย (ไม่บังคับ) และสถานะ
4. เมื่อบันทึกสำเร็จ ระบบกลับไปหน้ารายการและแสดงรายการที่เพิ่มไว้บนสุด
5. ใช้ปุ่มในการ์ดเพื่อดูรายละเอียด แก้ไข หรือลบ; การลบต้องยืนยันก่อน

## API

Base URL สำหรับการพัฒนา: `http://localhost:5000/api/journals`

| Method | Path | รายละเอียด |
| --- | --- | --- |
| `GET` | `/api/journals` | ดูรายการทั้งหมด เรียงรายการใหม่ก่อน |
| `GET` | `/api/journals/:id` | ดูรายละเอียดรายการเดียว |
| `POST` | `/api/journals` | เพิ่มวารสาร |
| `PUT` | `/api/journals/:id` | แก้ไขข้อมูลวารสาร |
| `DELETE` | `/api/journals/:id` | ลบวารสาร |

รองรับ query parameters สำหรับค้นหาและกรองพร้อมกัน เช่น `GET /api/journals?search=วิจัย&category=วิจัย` โดย `search` ค้นในชื่อและผู้รับผิดชอบ และ `category` รับค่า `วิชาการ`, `วิจัย` หรือ `ทั่วไป` ค่า query ต้อง URL-encode ตามปกติ

ตัวอย่าง JSON สำหรับเพิ่มหรือแก้ไข:

```json
{
  "title": "วารสารวิจัยประยุกต์",
  "responsible": "กองบรรณาธิการ",
  "category": "วิจัย",
  "date": "2026-10-19",
  "description": "รายละเอียดวารสาร",
  "status": true
}
```

## โครงสร้างข้อมูล

| ฟิลด์ | ชนิดข้อมูล | ข้อกำหนด |
| --- | --- | --- |
| `id` | INTEGER | Primary key, auto increment |
| `title` | STRING(150) | บังคับกรอก 1–150 ตัวอักษร |
| `responsible` | STRING(100) | บังคับกรอก 1–100 ตัวอักษร |
| `category` | STRING(50) | บังคับเลือก `วิชาการ`, `วิจัย` หรือ `ทั่วไป` |
| `date` | DATEONLY | บังคับกรอก รูปแบบ `YYYY-MM-DD` |
| `description` | TEXT | ไม่บังคับ สูงสุด 2,000 ตัวอักษร |
| `status` | BOOLEAN | ค่าเริ่มต้น `true`; `true` คือเผยแพร่, `false` คือฉบับร่าง |
| `createdAt`, `updatedAt` | DATE | Sequelize สร้างและดูแลให้อัตโนมัติ |

Backend จะเปลี่ยนชื่อคอลัมน์เดิม `publisher` เป็น `responsible` และ `publishedDate` เป็น `date` ในตาราง `Journals` เมื่อเริ่มเชื่อมต่อ เพื่อรักษาข้อมูลเดิมไว้

## ตรวจสอบคุณภาพโค้ด

รันคำสั่งจากโฟลเดอร์ที่กำหนด:

```bash
cd frontend
npm run lint
npm run build
```

Backend ยังไม่มีชุด automated tests ที่กำหนดไว้ใน `package.json`; การเริ่ม Backend จะตรวจการเชื่อมต่อ PostgreSQL และ sync model ตาม environment

## แก้ปัญหาเบื้องต้น

- **Sequelize แจ้งว่า URL เป็น `undefined`**: ตรวจว่า `backend/.env` ถูก mount/โหลดแล้ว และมี `DATABASE_URL_UNPOOLED`/`DATABASE_URL` หรือค่าครบชุด `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **Backend เชื่อม PostgreSQL ไม่ได้ใน Docker**: ใช้ `DB_HOST=postgres-db` ไม่ใช่ `localhost`; ตรวจให้ credentials ใน root `.env` และ `backend/.env` ตรงกัน
- **Backend เชื่อม PostgreSQL ไม่ได้เมื่อรันบนเครื่อง**: ใช้ `DB_HOST=localhost` และตรวจว่า PostgreSQL เปิด port ตาม `DB_PORT`
- **Frontend เรียก API ไม่ได้**: ตรวจ `VITE_API_URL`, port ของ Backend และดู log ด้วย `docker compose logs -f backend`
- **port ถูกใช้งานแล้ว**: เปลี่ยน `FRONTEND_PORT` หรือ `BACKEND_PORT` ใน root `.env`; ถ้าเปลี่ยน Backend port ให้ปรับ `VITE_API_URL` และค่า port ที่ Backend รับให้ตรงกัน
- **เพิ่งแก้ environment แต่ container ยังใช้ค่าเดิม**: รัน `docker compose up -d --force-recreate backend frontend`
