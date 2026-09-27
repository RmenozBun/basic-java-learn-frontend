# Java Learn — Frontend

หน้าบ้านของเว็บเรียนภาษา Java แบบ interactive สำหรับนักศึกษา comsci ปี 1 — เรียนบทเรียน 3 ระดับ เขียนโค้ดในเบราว์เซอร์ แล้วรันดูผลลัพธ์ได้จริง
Frontend for an interactive Java learning site for first-year CS students — 3 difficulty levels, an in-browser code editor, and real code execution.

หลังบ้าน (backend) อยู่คนละ repo: https://github.com/RmenozBun/basic-java-learn-backend
The backend lives in a separate repo: https://github.com/RmenozBun/basic-java-learn-backend

## Stack

- Nuxt.js 2 (Vue 2, Options API)
- Vuetify 2
- CodeMirror 5 (in-browser Java code editor)
- SPA mode (`ssr: false`) — pure client-side rendering, generated as a static site

## โครงสร้างโปรเจกต์ | Project structure

```text
pages/
  index.vue           # หน้าแรก | landing page
  start.vue           # กรอกชื่อ+อีเมลก่อนเริ่มเรียน | name+email entry before learning
  lessons/index.vue   # รายการบทเรียนทั้งหมด + progress bar | lesson list + progress bar
  lessons/_slug.vue   # เนื้อหาบทเรียน + แบบฝึกหัด + ปุ่มไปต่อ/กลับ | lesson content + exercises + next/back nav
  playground.vue      # เขียน/รันโค้ด Java อิสระ | free-form Java code playground
  progress.vue        # สรุปความคืบหน้าของผู้เรียน | student progress summary
components/
  CodeEditor.vue       # ครอบ CodeMirror 5 (ต้องอยู่ใน <client-only>) | wraps CodeMirror 5 (must stay <client-only>)
  ExerciseCard.vue      # กล่องแบบฝึกหัด: editor + ปุ่มรัน/ส่งคำตอบ | exercise box: editor + run/submit buttons
store/index.js         # เก็บ session ผู้เรียน (ชื่อ+อีเมล) | holds the student session (name+email)
plugins/
  axios.js             # แจ้งเตือนเมื่อเชื่อมต่อ backend ไม่ได้ | alerts when the backend is unreachable
  notiflix.js           # loading indicator shim
  hydrate-session.js    # โหลด session จาก localStorage ก่อน mount หน้าแรก | hydrates session from localStorage before first page mounts
```

## เริ่มรันในเครื่อง | Local development

ต้องมี Node.js 18+ และ backend รันอยู่แล้ว (ดู [backend repo](https://github.com/RmenozBun/basic-java-learn-backend))
Requires Node.js 18+ and the backend already running (see the [backend repo](https://github.com/RmenozBun/basic-java-learn-backend)).

```bash
npm install
npm run dev     # http://localhost:3000, เรียก backend ที่ http://localhost:4000/api โดยดีฟอลต์
                 # calls the backend at http://localhost:4000/api by default
```

## Environment variables

| Variable | คำอธิบาย | Description | Default (production build) |
|---|---|---|---|
| `API_BASE_URL` | URL ของ backend API | Backend API URL | `http://localhost:4000/api` |

ตั้งค่านี้ใน `nuxt.config.js` ผ่าน `environment.production.api` | Configured in `nuxt.config.js` via `environment.production.api`.

## ⚠️ ข้อจำกัดของ Playground | Playground limitations

หน้า Playground แสดงข้อความแจ้งข้อจำกัดเหล่านี้ให้ผู้ใช้เห็นอยู่แล้วในตัวเว็บ:
The Playground page itself always shows these limitations to users:

- รองรับเฉพาะภาษาอังกฤษในโค้ด/input | English (ASCII) only in code/input
- โค้ดที่ใช้ `Scanner` ต้องใส่ค่าใน Standard Input ก่อนกดรัน | code using `Scanner` needs its input provided in Standard Input before running
- ไฟล์เดียว ใช้ได้เฉพาะ Java SE มาตรฐาน | single file, standard Java SE library only
- บริการรันโค้ดฟรีสาธารณะ (Wandbox) ไม่มี SLA | runs on the free public Wandbox service — no SLA

## Deploy ฟรี | Free deployment

Build เป็น static site (`nuxt generate`, ทดสอบผ่านแล้ว) แล้ว deploy ขึ้น **Vercel** หรือ **Netlify** ได้ฟรี
Builds as a static site (`nuxt generate`, verified working) and deploys free to **Vercel** or **Netlify**.

### ขั้นตอน Deploy บน Vercel | Deploying to Vercel

1. Push repo นี้ขึ้น GitHub (ทำไปแล้ว) | Push this repo to GitHub (already done)
2. ไปที่ | Go to https://vercel.com → "Add New" → "Project" → เชื่อม repo นี้ | connect this repo
3. ตั้งค่า | Configure:
   - **Framework Preset:** Nuxt.js
   - **Build Command:** `npm run generate`
   - **Output Directory:** `dist`
4. เพิ่ม Environment Variable | Add environment variable:
   ```env
   API_BASE_URL=https://your-backend.onrender.com/api
   NODE_ENV=production
   ```
   (ใส่ URL ของ backend ที่ deploy ไว้แล้ว — ดู [backend repo](https://github.com/RmenozBun/basic-java-learn-backend))
   (use the backend URL you already deployed — see the [backend repo](https://github.com/RmenozBun/basic-java-learn-backend))
5. Deploy — ได้ URL แบบ `https://your-app.vercel.app` ใช้งานได้ทันที
   Deploy — you'll get a URL like `https://your-app.vercel.app`, ready to use immediately.

### Netlify (ทางเลือก | alternative)

ตั้งค่าเหมือนกัน: Build command `npm run generate`, Publish directory `dist`, และ environment variable `API_BASE_URL` เหมือนข้างบน
Same settings: build command `npm run generate`, publish directory `dist`, and the same `API_BASE_URL` environment variable as above.
