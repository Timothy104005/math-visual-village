/* 全站課程目錄：首頁地圖、單元頁麵包屑／上下篇／連結小路都讀這裡。
   新增單元時：在 UNITS 加一筆（ready:false 會顯示成「施工中的小房子」）。 */
window.CATALOG = {
  tracks: {
    "10": { name: "高一", en: "Grade 10", cls: "t-10" },
    "A": { name: "數 A", en: "Math A", cls: "t-A" },
    "B": { name: "數 B", en: "Math B", cls: "t-B" },
    "J": { name: "數甲", en: "Math Jia", cls: "t-J" }
  },

  regions: [
    { id: "algebra", name: "數與式", en: "Numbers & Algebra", color: "#F3D5C3", deep: "#B8674A" },
    { id: "series", name: "數列與級數", en: "Sequences & Series", color: "#F1E6C6", deep: "#9C8038" },
    { id: "function", name: "函數與圖形", en: "Functions & Graphs", color: "#DCE4D2", deep: "#647A58" },
    { id: "trig", name: "三角的世界", en: "Trigonometry", color: "#D3E0DE", deep: "#4F7479" },
    { id: "vector", name: "向量與矩陣", en: "Vectors & Matrices", color: "#E2DAE6", deep: "#7A6889" },
    { id: "prob", name: "機率與資料", en: "Chance & Data", color: "#EFD9D6", deep: "#A85E66" },
    { id: "calc", name: "微積分", en: "Calculus", color: "#D6E6DA", deep: "#4F8270" }
  ],

  units: [
    // ---- 數與式 ----
    { slug: "square-of-sum", ready: true, region: "algebra", title: "乘法公式", sub: "切一刀，正方形就說出答案",
      tex: "(a+b)^2=a^2+2ab+b^2", tracks: ["10"], codes: ["A-10-1"], links: ["completing-square", "am-gm", "poly-roots"] },
    { slug: "am-gm", ready: true, region: "algebra", title: "算幾不等式", sub: "半圓裡，半徑永遠最高",
      tex: "\\frac{a+b}{2}\\ge\\sqrt{ab}", tracks: ["10"], codes: ["N-10-3"], links: [] },
    { slug: "exp-log", ready: true, region: "algebra", title: "指數與對數", sub: "同一個問題的正反方向", tracks: ["10", "A", "B"], codes: ["N-10-3", "N-10-4"], links: ["exp-growth"],
      tex: "a^x=b\\iff x=\\log_a b" },
    { slug: "poly-roots", ready: true, region: "algebra", title: "多項式的根與因式", sub: "為什麼 x−a 特別重要", tracks: ["10"], codes: ["A-10-2"], links: ["cubic-shape"],
      tex: "f(a)=0\\iff (x-a)\\mid f(x)" },

    // ---- 數列與級數 ----
    { slug: "arithmetic-series", ready: true, region: "series", title: "等差級數", sub: "兩個階梯拼成長方形",
      tex: "S_n=\\frac{n(a_1+a_n)}{2}", tracks: ["10"], codes: ["N-10-6"], links: ["infinite-geometric", "fundamental-theorem", "induction"] },
    { slug: "infinite-geometric", ready: true, region: "series", title: "無窮等比級數", sub: "一直切一半，剛好填滿",
      tex: "\\sum_{k=1}^{\\infty}ar^{k-1}=\\frac{a}{1-r}", tracks: ["J"], codes: ["N-12甲-2"], links: ["fundamental-theorem"] },
    { slug: "induction", ready: true, region: "series", title: "數學歸納法", sub: "推倒第一張骨牌", tracks: ["10"], codes: ["N-10-6"], links: [],
      tex: "P(1)\\ \\wedge\\ \\big(P(k)\\Rightarrow P(k+1)\\big)" },

    // ---- 函數與圖形 ----
    { slug: "completing-square", ready: true, region: "function", title: "配方法與頂點式", sub: "剪一條、補一角",
      tex: "x^2+bx=\\left(x+\\tfrac b2\\right)^2-\\left(\\tfrac b2\\right)^2", tracks: ["10"], codes: ["F-10-1"], links: [] },
    { slug: "cubic-shape", ready: true, region: "function", title: "三次函數的樣子", sub: "局部看起來像直線", tracks: ["10"], codes: ["F-10-2"], links: ["derivative"],
      tex: "y=a(x-h)^3+p(x-h)+k" },
    { slug: "exp-growth", ready: true, region: "function", title: "按比例成長與 e", sub: "連續複利長出的常數", tracks: ["B", "J"], codes: ["F-11B-2", "N-12甲-1"], links: ["limit"],
      tex: "\\left(1+\\tfrac1n\\right)^n\\to e" },

    // ---- 三角 ----
    { slug: "unit-circle", ready: true, region: "trig", title: "三角比與單位圓", sub: "sin、cos 是影子的長度",
      tex: "\\sin^2\\theta+\\cos^2\\theta=1", tracks: ["10"], codes: ["G-10-5", "G-10-6"], links: ["law-of-cosines", "angle-sum", "radian"] },
    { slug: "law-of-cosines", ready: true, region: "trig", title: "餘弦定理", sub: "畢氏定理多了一個修正項",
      tex: "c^2=a^2+b^2-2ab\\cos C", tracks: ["10"], codes: ["G-10-7"], links: ["dot-product"] },
    { slug: "angle-sum", ready: true, region: "trig", title: "和角公式", sub: "兩個直角三角形疊成長方形",
      tex: "\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta", tracks: ["A"], codes: ["G-11A-5"], links: ["waves", "linear-map"] },
    { slug: "radian", ready: true, region: "trig", title: "弧度量", sub: "用半徑去量角", tracks: ["A", "B"], codes: ["N-11A-1", "N-11B-1"], links: ["waves"],
      tex: "s=r\\theta" },
    { slug: "waves", ready: true, region: "trig", title: "波的疊合", sub: "同頻的波加起來還是波", tracks: ["A"], codes: ["F-11A-2"], links: [],
      tex: "a\\sin x+b\\cos x=r\\sin(x+\\varphi)" },

    // ---- 向量與矩陣 ----
    { slug: "dot-product", ready: true, region: "vector", title: "內積與正射影", sub: "影子長 × 長度",
      tex: "\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta", tracks: ["A", "B"], codes: ["G-11A-6", "G-11B-2"], links: ["determinant"] },
    { slug: "determinant", ready: true, region: "vector", title: "行列式與面積", sub: "兩個向量張出的平行四邊形", tracks: ["A"], codes: ["G-11A-6", "G-11A-8"], links: ["linear-map"],
      tex: "\\begin{vmatrix}a_1&b_1\\\\a_2&b_2\\end{vmatrix}=a_1b_2-a_2b_1" },
    { slug: "linear-map", ready: true, region: "vector", title: "線性變換", sub: "矩陣其實在做動作", tracks: ["A"], codes: ["F-11A-3"], links: [],
      tex: "A\\binom{x}{y}=x\\binom{a}{c}+y\\binom{b}{d}" },

    // ---- 機率與資料 ----
    { slug: "conditional", ready: true, region: "prob", title: "條件機率與貝氏", sub: "資訊來了，判斷要更新", tracks: ["A", "B"], codes: ["D-11A-2", "D-11A-3", "D-11B-2"], links: [],
      tex: "P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}" },
    { slug: "expectation", ready: true, region: "prob", title: "期望值", sub: "長期平均會落在哪裡", tracks: ["10"], codes: ["D-10-4"], links: ["conditional"],
      tex: "E=\\sum x_i\\,p_i" },
    { slug: "standardize", ready: true, region: "prob", title: "標準化與相關", sub: "不同尺度怎麼比較", tracks: ["10"], codes: ["D-10-2"], links: [],
      tex: "z=\\frac{x-\\mu}{\\sigma}" },

    // ---- 微積分 ----
    { slug: "fundamental-theorem", ready: true, region: "calc", title: "微積分基本定理", sub: "面積的變化率就是高度",
      tex: "\\frac{d}{dx}\\int_a^x f(t)\\,dt=f(x)", tracks: ["J"], codes: ["F-12甲-5", "F-12甲-6"], links: [] },
    { slug: "derivative", ready: true, region: "calc", title: "導數", sub: "割線變成切線", tracks: ["J"], codes: ["F-12甲-3"], links: ["fundamental-theorem"],
      tex: "f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}" },
    { slug: "limit", ready: true, region: "calc", title: "數列的極限", sub: "無限過程有沒有終點", tracks: ["J"], codes: ["N-12甲-1"], links: ["derivative", "infinite-geometric"],
      tex: "\\lim_{n\\to\\infty}a_n=L" }
  ],

  /* 建議閱讀順序（上一篇／下一篇、首頁卡片）：高一 → 11 年級 → 數甲 */
  order: ["square-of-sum", "am-gm", "exp-log", "poly-roots", "arithmetic-series", "induction",
          "completing-square", "cubic-shape", "unit-circle", "law-of-cosines", "standardize", "expectation",
          "radian", "angle-sum", "waves", "exp-growth", "dot-product", "determinant", "linear-map", "conditional",
          "limit", "infinite-geometric", "derivative", "fundamental-theorem"]
};

window.CATALOG.get = function (slug) {
  return window.CATALOG.units.find(function (u) { return u.slug === slug; });
};
window.CATALOG.region = function (id) {
  return window.CATALOG.regions.find(function (r) { return r.id === id; });
};
