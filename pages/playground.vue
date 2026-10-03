<template>
  <div>
    <section class="pg-hero">
      <div class="page-wrap">
        <div class="eyebrow pg-hero__eyebrow">Playground</div>
        <h1 class="pg-hero__title">สนามทดลองเขียน Java 🧪</h1>
        <p class="pg-hero__text">เขียนโค้ดอะไรก็ได้ กด "รัน" แล้วดูผลลัพธ์ทันที ไม่นับคะแนน ไม่ต้องกลัวพัง</p>
      </div>
    </section>

    <div class="page-wrap pg">
      <!-- limitations: intentionally always visible -->
      <div class="notice">
        <div class="notice__title">ℹ️ ข้อจำกัดของระบบรันโค้ด</div>
        <ul class="notice__list">
          <li>รองรับเฉพาะ<strong>ภาษาอังกฤษ</strong>ในโค้ดและ input เท่านั้น (ยังไม่รองรับภาษาไทยหรืออักขระพิเศษ ยกเว้นใน comment)</li>
          <li>ถ้าโค้ดอ่านค่าด้วย <code>Scanner</code> ต้องใส่ค่าใน <strong>Standard Input</strong> ล่วงหน้า <strong>บรรทัดละค่า</strong> ตามลำดับที่โปรแกรมอ่าน ไม่งั้นจะ error</li>
          <li>เขียนได้ไฟล์เดียว และชื่อคลาสหลักต้องเป็น <code>Main</code> ใช้ได้เฉพาะ Java SE มาตรฐาน (import library ภายนอกไม่ได้)</li>
          <li>เป็นบริการฟรีสาธารณะ ไม่มี SLA — โค้ดที่หนักหรือวนลูปไม่จบจะถูกตัดการทำงาน</li>
        </ul>
      </div>

      <div class="examples">
        <span class="examples__label">ลองตัวอย่าง:</span>
        <button v-for="example in examples" :key="example.title" type="button" class="example-chip" @click="loadExample(example)">
          {{ example.icon }} {{ example.title }}
        </button>
      </div>

      <v-row>
        <v-col cols="12" md="7">
          <div class="code-window">
            <div class="code-window__bar">
              <span class="code-window__dots"><i /><i /><i /></span>
              <span class="code-window__title">Main.java</span>
              <button type="button" class="code-window__btn" @click="clearCode">ล้างโค้ด</button>
            </div>
            <CodeEditor v-model="code" height="440px" />
          </div>
        </v-col>

        <v-col cols="12" md="5">
          <div class="panel-label">Standard Input <span class="panel-label__hint">(ถ้ามี — บรรทัดละค่า)</span></div>
          <v-textarea
            v-model="stdin"
            outlined
            rows="4"
            background-color="white"
            hide-details
            placeholder="ค่าที่จะป้อนให้โปรแกรมผ่าน Scanner"
            class="mb-4"
          />

          <v-btn color="primary" block large depressed :loading="running" @click="run">▶ รันโค้ด</v-btn>

          <div class="panel-label mt-5">ผลลัพธ์</div>
          <div class="console">
            <template v-if="result">
              <span class="console__status" :class="isOk ? 'console__status--ok' : 'console__status--bad'">{{ statusText }}</span>
              <div v-if="outputText">{{ outputText }}</div>
              <div v-else class="console__muted">(ไม่มีข้อความแสดงผลทางหน้าจอ)</div>
            </template>
            <div v-else class="console__muted">ยังไม่มีผลลัพธ์ — กด "รันโค้ด" เพื่อดูผลลัพธ์</div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`

const EXAMPLES = [
  {
    icon: '👋',
    title: 'Hello World',
    stdin: '',
    code: DEFAULT_CODE
  },
  {
    icon: '📦',
    title: 'Scanner',
    stdin: 'Ploy\n19',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        int age = sc.nextInt();
        System.out.println(name + " will be " + (age + 1) + " next year");
    }
}
`
  },
  {
    icon: '🔁',
    title: 'ลูป',
    stdin: '',
    code: `public class Main {
    public static void main(String[] args) {
        for (int row = 1; row <= 4; row++) {
            for (int col = 1; col <= row; col++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
`
  },
  {
    icon: '🗂️',
    title: 'Array',
    stdin: '',
    code: `public class Main {
    public static void main(String[] args) {
        int[] scores = {80, 65, 90, 72, 55};
        int max = scores[0];
        for (int s : scores) {
            if (s > max) {
                max = s;
            }
        }
        System.out.println("Max = " + max);
    }
}
`
  },
  {
    icon: '🏗️',
    title: 'Class',
    stdin: '',
    code: `class Student {
    String name;
    int score;

    Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    void printInfo() {
        System.out.println(name + ": " + score);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Ploy", 85);
        s.printInfo();
    }
}
`
  },
  {
    icon: '📚',
    title: 'ArrayList',
    stdin: '',
    code: `import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> nums = new ArrayList<>();
        nums.add(5);
        nums.add(2);
        nums.add(9);
        Collections.sort(nums);
        System.out.println(nums);
    }
}
`
  }
]

export default {
  name: 'PlaygroundPage',
  data () {
    return {
      code: DEFAULT_CODE,
      stdin: '',
      running: false,
      result: null,
      examples: EXAMPLES
    }
  },
  computed: {
    isOk () {
      return this.result && this.result.statusId === 3
    },
    statusText () {
      if (!this.result) return ''
      if (this.result.statusId === 3) return 'รันสำเร็จ ✓'
      if (this.result.statusId === 7) return 'เกิดข้อผิดพลาดตอนรัน (Runtime Error)'
      return this.result.statusDescription
    },
    outputText () {
      if (!this.result) return ''
      return this.result.compileOutput || this.result.stderr || this.result.stdout || ''
    }
  },
  mounted () {
    const draft = this.$store.state.playgroundDraft
    if (draft) {
      this.code = draft.code
      this.stdin = draft.stdin || ''
      this.$store.commit('clearPlaygroundDraft')
    }
  },
  methods: {
    loadExample (example) {
      this.code = example.code
      this.stdin = example.stdin
      this.result = null
    },
    clearCode () {
      this.code = DEFAULT_CODE
      this.stdin = ''
      this.result = null
    },
    async run () {
      this.running = true
      this.result = null
      try {
        const response = await this.$axios.$post('/execute', { code: this.code, stdin: this.stdin })
        this.result = response.result
      } catch (error) {
        await this.$swal({
          icon: 'error',
          title: 'รันโค้ดไม่สำเร็จ',
          text: error.response?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
          confirmButtonText: 'ปิด',
          confirmButtonColor: '#B85400'
        })
      }
      this.running = false
    }
  }
}
</script>

<style scoped>
.pg-hero {
  padding: 34px 16px;
  color: #fff4e4;
  background:
    radial-gradient(circle at 90% 0%, rgba(248, 152, 32, 0.2), transparent 45%),
    linear-gradient(135deg, #2a1b13 0%, #3b2418 65%, #5a3320 100%);
}

.pg-hero__eyebrow {
  color: var(--c-amber);
}

.pg-hero__title {
  margin: 4px 0 6px;
  font-family: var(--font-head);
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  font-weight: 700;
}

.pg-hero__text {
  margin: 0;
  color: #e8d3bc;
}

.pg {
  padding: 24px 16px 0;
}

.notice {
  margin-bottom: 18px;
  padding: 14px 18px;
  font-size: 0.93rem;
  line-height: 1.75;
  color: #2c4a60;
  background: #e9f1f7;
  border-left: 5px solid var(--c-blue);
  border-radius: 0 12px 12px 0;
}

.notice__title {
  margin-bottom: 4px;
  font-family: var(--font-head);
  font-weight: 700;
}

.notice__list {
  margin: 0;
  padding-left: 1.3rem;
}

.notice code {
  padding: 0.1em 0.4em;
  font-family: var(--font-mono);
  font-size: 0.88em;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 5px;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 14px;
}

.examples__label {
  margin-right: 4px;
  font-family: var(--font-head);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-roast);
}

.example-chip {
  padding: 6px 14px;
  font-family: var(--font-head);
  font-size: 0.88rem;
  color: var(--c-roast);
  background: var(--c-paper);
  border: 1px solid var(--c-line);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.example-chip:hover {
  color: #fff;
  background: var(--c-orange);
  border-color: var(--c-orange);
}

.panel-label {
  margin-bottom: 6px;
  font-family: var(--font-head);
  font-weight: 600;
  color: var(--c-espresso);
}

.panel-label__hint {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--c-muted);
}

.console {
  min-height: 190px;
}
</style>
