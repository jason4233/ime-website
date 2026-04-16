export interface QuizOption {
  id: string;
  text: string;
  type: "A" | "B" | "C" | "D"; // 對應人格傾向
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "上一次，妳在鏡子前停下來，是因為驚艷還是閃避？",
    options: [
      { id: "1A", text: "驚艷，我最近狀態真的不錯", type: "C" },
      { id: "1B", text: "閃避，我已經習慣不正眼看自己", type: "A" },
      { id: "1C", text: "看了兩秒就走開，不想想太多", type: "A" },
      { id: "1D", text: "只看眼妝有沒有花，其他略過", type: "B" },
    ],
  },
  {
    id: 2,
    question: "過去一年，妳花在保養上的錢，換算成「妳有多滿意」，打幾分？",
    options: [
      { id: "2A", text: "花很多，但滿意度不到 60 分", type: "B" },
      { id: "2B", text: "花中等，看天氣決定有沒有效", type: "B" },
      { id: "2C", text: "幾乎沒花，但其實很想認真對自己", type: "A" },
      { id: "2D", text: "花得不手軟，但總覺得少一個關鍵", type: "C" },
    ],
  },
  {
    id: 3,
    question: "如果今天不用想價格，妳第一個想處理的是？",
    options: [
      { id: "3A", text: "細紋、鬆弛、輪廓往下掉", type: "C" },
      { id: "3B", text: "暗沉、斑、一照相就顯老", type: "A" },
      { id: "3C", text: "毛孔、粗糙、上妝卡粉", type: "B" },
      { id: "3D", text: "整體的「累感」—— 就是看起來沒睡飽的那種", type: "A" },
    ],
  },
  {
    id: 4,
    question: "5 年後那個妳最滿意的自己，是什麼模樣？",
    options: [
      { id: "4A", text: "比現在年輕的自己還要發光", type: "C" },
      { id: "4B", text: "不靠濾鏡也敢直接出門", type: "A" },
      { id: "4C", text: "走進任何場合都有底氣", type: "C" },
      { id: "4D", text: "被問「妳怎麼保養的」，笑笑不講", type: "D" },
    ],
  },
  {
    id: 5,
    question:
      "如果有一個選項——由台中榮總專利技術轉移、全球獨家 3A-GTP 製程、每 1mL 含 2,000 億顆臍帶間質幹細胞外泌體——妳會⋯",
    options: [
      { id: "5A", text: "先看別人用過的反應", type: "B" },
      { id: "5B", text: "想知道價格合不合理", type: "B" },
      { id: "5C", text: "我現在就想了解體驗課", type: "C" },
      { id: "5D", text: "我想要，順便了解能不能一起經營", type: "D" },
    ],
  },
];

export type ResultType = "selfDoubt" | "rational" | "actionTaker";

export interface QuizResult {
  type: ResultType;
  title: string;
  cta1: { text: string; href: string };
  cta2: { text: string; href: string };
}

export const quizResults: Record<ResultType, QuizResult> = {
  selfDoubt: {
    type: "selfDoubt",
    title: "妳不是不夠好，是還沒遇到夠好的選擇。",
    cta1: { text: "預約一次泌容術體驗", href: "/contact" },
    cta2: { text: "了解我們的修復原理", href: "/about" },
  },
  rational: {
    type: "rational",
    title: "妳的每一個疑問，我們都用第三方檢驗報告回答。",
    cta1: { text: "查看檢驗與認證", href: "/products" },
    cta2: { text: "預約諮詢", href: "/contact" },
  },
  actionTaker: {
    type: "actionTaker",
    title: "妳已經知道答案了。剩下的只是，誰陪妳一起。",
    cta1: { text: "立即預約體驗", href: "/contact" },
    cta2: { text: "了解經銷美容師計畫", href: "/training" },
  },
};

export function calculateResult(
  answers: Record<number, string>
): ResultType {
  const typeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };

  Object.values(answers).forEach((optionId) => {
    for (const q of quizQuestions) {
      const opt = q.options.find((o) => o.id === optionId);
      if (opt) {
        typeCounts[opt.type]++;
        break;
      }
    }
  });

  // A 多 → 自我懷疑型
  // B 多 → 理性評估型
  // C, D 多 → 行動派
  if (typeCounts.A >= typeCounts.B && typeCounts.A >= typeCounts.C + typeCounts.D) {
    return "selfDoubt";
  }
  if (typeCounts.B >= typeCounts.A && typeCounts.B >= typeCounts.C + typeCounts.D) {
    return "rational";
  }
  return "actionTaker";
}
