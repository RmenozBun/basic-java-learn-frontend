# Java Learn — Frontend

An interactive Java learning site for first-year CS students, built as a single-page Nuxt 2 / Vue 2 application. Students enter their name and email (no signup, no password) to save their session locally, then work through lessons split into three difficulty levels (easy / medium / hard), write Java code directly in an in-browser CodeMirror editor, run it against a public code-execution service, and submit exercise solutions for automatic grading against the backend's test cases. Progress is tracked per level and shown on both the lessons list and a dedicated progress page. This frontend is a pure API client — all lesson content, code execution, and grading logic live in a separate backend service: [basic-java-learn-backend](https://github.com/RmenozBun/basic-java-learn-backend).

## Features

- **Guest-style onboarding** (`pages/start.vue`) — collects a name and email, stored in Vuex and mirrored to `localStorage` (`javaLearnStudent`) so the session survives page reloads, with no real authentication.
- **Lesson catalog** (`pages/lessons/index.vue`) — lists lessons fetched from the backend, filterable by level (all / easy / medium / hard), with an overall progress ring and a "continue" button that jumps to the next unfinished lesson.
- **Lesson detail pages** (`pages/lessons/_slug.vue`) — renders lesson content from Markdown (via `marked`) with highlighted code blocks (copy, or "try it" which opens the Playground pre-filled with the code and its input), a lesson sidebar, lists the lesson's exercises, and shows next/previous lesson navigation plus a completion banner once every exercise in the lesson is passed.
- **In-browser Java code editor** (`components/CodeEditor.vue`) — wraps CodeMirror 5 with Java syntax highlighting (custom "coffee" theme), lazily loaded client-side only (inside `<client-only>`) since Nuxt runs in SPA mode.
- **Exercises with run + submit** (`components/ExerciseCard.vue`) — "Run" executes the student's code against ad-hoc standard input for self-testing (not graded); "Submit" runs the code against the exercise's real test cases and records a pass/fail result via the backend. Each exercise has an on-demand hint, and the model solution with an explanation is revealed only after the student passes.
- **Free-form Playground** (`pages/playground.vue`) — write and run arbitrary single-file Java code with custom standard input, independent of any lesson; the page documents the execution service's real constraints (English/ASCII only, single file, standard Java SE library only, no SLA).
- **Progress tracking** (`pages/progress.vue`) — per-level breakdown of completed vs. total exercises with progress bars, shown once a student session exists.
- **Backend connectivity feedback** (`plugins/axios.js`) — shows an alert dialog whenever an API call fails with no response, prompting the user to check that the backend server is running.

## Tech Stack

- [Nuxt.js 2](https://nuxtjs.org/) (Vue 2, Options API), running in SPA mode (`ssr: false`, `target: 'static'`) since the app relies on `localStorage`-based sessions with no server-side rendering benefit
- [Vuetify 2](https://vuetifyjs.com/) for UI components and theming
- [CodeMirror 5](https://codemirror.net/5/) for the in-browser Java code editor
- [@nuxtjs/axios](https://axios.nuxtjs.org/) for API calls to the backend
- [marked](https://marked.js.org/) for rendering lesson content from Markdown
- [notiflix](https://notiflix.github.io/) for loading indicators
- [vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) for alert/confirmation dialogs
- Vuex (built into Nuxt) for storing the current student session

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend](https://github.com/RmenozBun/basic-java-learn-backend) running and reachable, since this frontend has no functionality of its own without it (default expected at `http://localhost:4000/api`)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The app runs at `http://localhost:3000` and calls the backend at `http://localhost:4000/api` by default (configurable via the `API_BASE_URL` environment variable, see `nuxt.config.js`).

### Other scripts

```bash
npm run build      # build for production (SSR-capable bundle, unused here since ssr is disabled)
npm run generate    # pre-render as a static site (used for deployment, see below)
npm run start       # run the built app
```

### Environment variables

| Variable | Description | Default |
|---|---|---|
| `API_BASE_URL` | Base URL of the backend API | `http://localhost:4000/api` |

## Project Structure

```text
pages/
  index.vue           # Landing page
  start.vue           # Name + email entry before learning starts
  lessons/index.vue    # Lesson list grouped by level, progress ring + "continue" button
  lessons/_slug.vue    # Lesson content + exercises + next/previous navigation
  playground.vue       # Free-form Java code playground
  progress.vue         # Student's per-level progress summary
components/
  CodeEditor.vue        # Wraps CodeMirror 5 (must stay inside <client-only>)
  ExerciseCard.vue       # Exercise box: editor + run/submit buttons
store/index.js          # Holds the student session (name + email) and the code handed from a lesson to the Playground
utils/markdown.js       # Renders lesson Markdown: code highlighting, copy / "try it" buttons, callouts
assets/css/             # main.css (coffee theme + code theme), lesson.css (lesson typography)
plugins/
  axios.js               # Alerts when the backend is unreachable
  notiflix.js             # Loading indicator plugin
  hydrate-session.js      # Restores the session from localStorage before the first page mounts
```

## Deployment

The app builds as a static site (`npm run generate`, output in `dist/`) and can be deployed for free to Vercel or Netlify:

- **Build command:** `npm run generate`
- **Output/publish directory:** `dist`
- **Environment variable:** `API_BASE_URL` set to the deployed backend's URL

## Author

**Theeranat Aiyarakhom**
GitHub: [https://github.com/RmenozBun](https://github.com/RmenozBun)

---

## ภาษาไทย

# Java Learn — Frontend

เว็บเรียนภาษา Java แบบ interactive สำหรับนักศึกษาสายวิทยาการคอมพิวเตอร์ชั้นปีที่ 1 พัฒนาเป็น Single Page Application ด้วย Nuxt 2 / Vue 2 ผู้เรียนกรอกชื่อและอีเมล (ไม่ต้องสมัครสมาชิก ไม่ต้องตั้งรหัสผ่าน) เพื่อเก็บ session ไว้ในเครื่อง จากนั้นเรียนบทเรียนที่แบ่งเป็น 3 ระดับ (ง่าย/กลาง/ยาก) เขียนโค้ด Java ได้โดยตรงในเครื่องมือแก้ไขโค้ด CodeMirror บนเบราว์เซอร์ รันโค้ดผ่านบริการรันโค้ดสาธารณะ และส่งคำตอบแบบฝึกหัดเพื่อให้ตรวจให้คะแนนอัตโนมัติโดยเทียบกับชุดทดสอบของ backend ความคืบหน้าจะถูกติดตามแยกตามระดับ และแสดงทั้งในหน้ารายการบทเรียนและหน้าความคืบหน้าโดยเฉพาะ frontend นี้ทำหน้าที่เป็นเพียงตัวเรียก API เท่านั้น เนื้อหาบทเรียน การรันโค้ด และการตรวจคำตอบทั้งหมดอยู่ใน backend คนละ repo: [basic-java-learn-backend](https://github.com/RmenozBun/basic-java-learn-backend)

## ฟีเจอร์

- **หน้าเริ่มต้นแบบไม่ต้องสมัครสมาชิก** (`pages/start.vue`) — กรอกชื่อและอีเมล เก็บไว้ใน Vuex และสำรองไว้ใน `localStorage` (`javaLearnStudent`) เพื่อให้ session อยู่รอดแม้รีเฟรชหน้า โดยไม่มีการยืนยันตัวตนจริง
- **รายการบทเรียน** (`pages/lessons/index.vue`) — แสดงบทเรียนที่ดึงมาจาก backend กรองตามระดับได้ (ทั้งหมด/ง่าย/กลาง/ยาก) พร้อมวงแหวนความคืบหน้ารวมและปุ่ม "เรียนต่อ" ที่พาไปบทที่ยังไม่จบบทถัดไป
- **หน้ารายละเอียดบทเรียน** (`pages/lessons/_slug.vue`) — แสดงเนื้อหาบทเรียนที่เขียนด้วย Markdown (ผ่าน `marked`) พร้อมโค้ดไฮไลต์สี ปุ่มคัดลอก/"ลองรัน" (เปิด Playground พร้อมโค้ดและ input ที่เตรียมไว้) สารบัญบทเรียนด้านข้าง รายการแบบฝึกหัดของบทนั้น และปุ่มไปบทถัดไป/ก่อนหน้า พร้อมข้อความแสดงความยินดีเมื่อผ่านทุกแบบฝึกหัดในบทแล้ว
- **เครื่องมือแก้ไขโค้ด Java บนเบราว์เซอร์** (`components/CodeEditor.vue`) — ครอบ CodeMirror 5 พร้อม syntax highlighting ภาษา Java (ธีม "coffee" ที่ออกแบบเอง) โหลดเฉพาะฝั่ง client เท่านั้น (อยู่ใน `<client-only>`) เนื่องจากแอปนี้รันแบบ SPA
- **แบบฝึกหัดพร้อมปุ่มรัน/ส่งคำตอบ** (`components/ExerciseCard.vue`) — ปุ่ม "รัน" ใช้ทดสอบโค้ดกับ Standard Input ที่พิมพ์เอง (ไม่นับคะแนน) ส่วนปุ่ม "ส่งคำตอบ" จะรันโค้ดกับชุดทดสอบจริงของโจทย์และบันทึกผลผ่าน/ไม่ผ่านผ่าน backend แต่ละข้อมีคำใบ้ให้กดขอได้ และจะแสดงเฉลยพร้อมคำอธิบายหลังทำผ่านเท่านั้น
- **Playground เขียนโค้ดอิสระ** (`pages/playground.vue`) — เขียนและรันโค้ด Java ไฟล์เดียวพร้อม standard input ที่กำหนดเอง โดยไม่ผูกกับบทเรียนใด หน้านี้ระบุข้อจำกัดจริงของบริการรันโค้ดไว้ให้เห็นชัดเจน (รองรับเฉพาะภาษาอังกฤษ/ASCII, ไฟล์เดียว, ใช้ได้เฉพาะ Java SE มาตรฐาน, ไม่มี SLA)
- **หน้าความคืบหน้า** (`pages/progress.vue`) — สรุปจำนวนแบบฝึกหัดที่ผ่านแล้วเทียบกับทั้งหมดแยกตามระดับ พร้อม progress bar แสดงเมื่อมี session ผู้เรียนแล้วเท่านั้น
- **แจ้งเตือนเมื่อเชื่อมต่อ backend ไม่ได้** (`plugins/axios.js`) — แสดงกล่องแจ้งเตือนทุกครั้งที่เรียก API แล้วไม่ได้รับ response กลับมา เพื่อให้ผู้ใช้ตรวจสอบว่าเปิด backend server ไว้แล้วหรือยัง

## Tech Stack

- [Nuxt.js 2](https://nuxtjs.org/) (Vue 2, Options API) รันในโหมด SPA (`ssr: false`, `target: 'static'`) เนื่องจากแอปพึ่งพา session ที่เก็บใน `localStorage` และไม่ได้ประโยชน์จาก Server-Side Rendering
- [Vuetify 2](https://vuetifyjs.com/) สำหรับ UI component และธีม
- [CodeMirror 5](https://codemirror.net/5/) สำหรับเครื่องมือแก้ไขโค้ด Java บนเบราว์เซอร์
- [@nuxtjs/axios](https://axios.nuxtjs.org/) สำหรับเรียก API ของ backend
- [marked](https://marked.js.org/) สำหรับแปลงเนื้อหาบทเรียนจาก Markdown
- [notiflix](https://notiflix.github.io/) สำหรับตัวแสดงสถานะกำลังโหลด
- [vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) สำหรับกล่องแจ้งเตือน/ยืนยัน
- Vuex (มาพร้อม Nuxt) สำหรับเก็บ session ผู้เรียนปัจจุบัน

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมีก่อน

- Node.js 18 ขึ้นไป
- [backend](https://github.com/RmenozBun/basic-java-learn-backend) ต้องรันอยู่และเชื่อมต่อได้ เพราะ frontend นี้ไม่มีฟังก์ชันใดทำงานได้เองเลยถ้าไม่มี backend (ค่าเริ่มต้นคือ `http://localhost:4000/api`)

### ติดตั้ง

```bash
npm install
```

### รันในโหมดพัฒนา

```bash
npm run dev
```

แอปจะรันที่ `http://localhost:3000` และเรียก backend ที่ `http://localhost:4000/api` โดยดีฟอลต์ (ปรับได้ผ่านตัวแปรแวดล้อม `API_BASE_URL` ดูใน `nuxt.config.js`)

### คำสั่งอื่นๆ

```bash
npm run build      # build สำหรับ production (bundle ที่รองรับ SSR แต่ไม่ได้ใช้เพราะปิด ssr ไว้)
npm run generate    # สร้างเป็น static site ล่วงหน้า (ใช้สำหรับ deploy ด้านล่าง)
npm run start       # รันแอปที่ build แล้ว
```

### ตัวแปรแวดล้อม

| ตัวแปร | คำอธิบาย | ค่าเริ่มต้น |
|---|---|---|
| `API_BASE_URL` | URL หลักของ backend API | `http://localhost:4000/api` |

## โครงสร้างโปรเจกต์

```text
pages/
  index.vue            # หน้าแรก
  start.vue            # กรอกชื่อ+อีเมลก่อนเริ่มเรียน
  lessons/index.vue     # รายการบทเรียนจัดกลุ่มตามระดับ วงแหวนความคืบหน้า และปุ่มเรียนต่อ
  lessons/_slug.vue     # เนื้อหาบทเรียน + แบบฝึกหัด + ปุ่มไปต่อ/กลับ
  playground.vue        # เขียน/รันโค้ด Java อิสระ
  progress.vue          # สรุปความคืบหน้าของผู้เรียนแยกตามระดับ
components/
  CodeEditor.vue         # ครอบ CodeMirror 5 (ต้องอยู่ใน <client-only>)
  ExerciseCard.vue        # กล่องแบบฝึกหัด: editor + ปุ่มรัน/ส่งคำตอบ
store/index.js            # เก็บ session ผู้เรียน (ชื่อ+อีเมล) และโค้ดที่ส่งจากบทเรียนไป Playground
utils/markdown.js         # แปลง Markdown ของบทเรียน: ไฮไลต์โค้ด ปุ่มคัดลอก/ลองรัน กล่อง callout
assets/css/               # main.css (ธีมกาแฟ + ธีมโค้ด), lesson.css (สไตล์เนื้อหาบทเรียน)
plugins/
  axios.js                 # แจ้งเตือนเมื่อเชื่อมต่อ backend ไม่ได้
  notiflix.js               # ปลั๊กอินตัวแสดงสถานะกำลังโหลด
  hydrate-session.js         # โหลด session จาก localStorage ก่อน mount หน้าแรก
```

## การ Deploy

แอปนี้ build เป็น static site ได้ (`npm run generate` ผลลัพธ์อยู่ใน `dist/`) และ deploy ขึ้น Vercel หรือ Netlify ได้ฟรี:

- **Build command:** `npm run generate`
- **Output/publish directory:** `dist`
- **ตัวแปรแวดล้อม:** `API_BASE_URL` ตั้งเป็น URL ของ backend ที่ deploy ไว้แล้ว

## ผู้พัฒนา

**ธีรนาถ อัยราคม**
GitHub: [https://github.com/RmenozBun](https://github.com/RmenozBun)
