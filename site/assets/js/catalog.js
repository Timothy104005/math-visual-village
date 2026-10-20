/* 全站課程目錄：首頁地圖、單元頁麵包屑／上下篇／連結小路都讀這裡。
   新增單元時：在 UNITS 加一筆（ready:false 會顯示成「施工中的小房子」）。 */
window.CATALOG = {
  tracks: {
    "10": { name: "高一", en: "Grade 10", cls: "t-10" },
    "A": { name: "數 A", en: "Math A", cls: "t-A" },
    "B": { name: "數 B", en: "Math B", cls: "t-B" },
    "J": { name: "數甲", en: "Math Jia", cls: "t-J" },
    "Y": { name: "數乙", en: "Math Yi", cls: "t-Y" },
    "X": { name: "補充", en: "Beyond", cls: "t-X" }
  },

  regions: [
    { id: "algebra", name: "數與式", en: "Numbers & Algebra", color: "#F3D5C3", deep: "#B8674A" },
    { id: "series", name: "數列與級數", en: "Sequences & Series", color: "#F1E6C6", deep: "#9C8038" },
    { id: "function", name: "函數與圖形", en: "Functions & Graphs", color: "#DCE4D2", deep: "#647A58" },
    { id: "trig", name: "三角的世界", en: "Trigonometry", color: "#D3E0DE", deep: "#4F7479" },
    { id: "space", name: "坐標與空間", en: "Coordinates & Space", color: "#E6E1D3", deep: "#7D6E4F" },
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
    { slug: "poly-roots", ready: true, region: "algebra", title: "多項式的根與因式", sub: "為什麼 x−a 特別重要", tracks: ["10"], codes: ["A-10-2"], links: ["cubic-shape", "complex-equations", "rational-root"],
      tex: "f(a)=0\\iff (x-a)\\mid f(x)" },

    { slug: "complex-plane", ready: true, region: "algebra", title: "複數平面", sub: "乘法就是旋轉加縮放",
      tex: "z_1z_2=r_1r_2\\,[\\cos(\\theta_1+\\theta_2)+i\\sin(\\theta_1+\\theta_2)]", tracks: ["J", "Y"], codes: ["N-12甲-3", "N-12乙-1"], links: ["roots-of-unity"] },
    { slug: "complex-equations", ready: true, region: "algebra", title: "複數與方程式", sub: "每一個根都找得到位置",
      tex: "n\\ \\text{次方程式恰有}\\ n\\ \\text{個複數根}", tracks: ["J", "Y"], codes: ["A-12甲-1", "A-12乙-2"], links: ["complex-plane"] },
    { slug: "roots-of-unity", ready: true, region: "algebra", title: "複數的 n 次方根", sub: "根在圓上等分排列",
      tex: "z^n=1\\Rightarrow z=\\cos\\tfrac{2k\\pi}{n}+i\\sin\\tfrac{2k\\pi}{n}", tracks: ["J"], codes: ["N-12甲-3"], links: [] },
    { slug: "rational-root", ready: true, region: "algebra", title: "有理根候選", sub: "有限個候選人",
      tex: "\\tfrac pq\\ \\text{是根}\\Rightarrow p\\mid a_0,\\ q\\mid a_n", tracks: ["X"], codes: ["A-10-2"], links: ["complex-equations"] },

    { slug: "real-numbers", ready: true, region: "algebra", title: "實數與數線", sub: "數線上的每一點都是數",
      tex: "\\sqrt2\\ne\\tfrac pq", tracks: ["10"], codes: ["N-10-1"], links: ["abs-value", "numeric-error"] },
    { slug: "abs-value", ready: true, region: "algebra", title: "絕對值", sub: "到某一點的距離",
      tex: "|x-a|<b\\iff a-b<x<a+b", tracks: ["10"], codes: ["N-10-2"], links: ["triangle-inequality"] },
    { slug: "numeric-error", ready: true, region: "algebra", title: "數值計算的誤差", sub: "計算機也會算錯",
      tex: "\\sqrt{1001}-\\sqrt{1000}=\\tfrac{1}{\\sqrt{1001}+\\sqrt{1000}}", tracks: ["10"], codes: ["N-10-5"], links: [] },
    { slug: "logic", ready: true, region: "algebra", title: "邏輯與條件", sub: "充分、必要，就是誰包含誰",
      tex: "p\\Rightarrow q\\iff P\\subseteq Q", tracks: ["10"], codes: ["N-10-7"], links: ["sets"] },
    { slug: "log-laws", ready: true, region: "algebra", title: "對數律", sub: "把乘法變成加法的尺",
      tex: "\\log(ab)=\\log a+\\log b", tracks: ["A"], codes: ["A-11A-4"], links: ["exp-log-graphs"] },

    { slug: "radicals", ready: true, region: "algebra", title: "根式與分式運算", sub: "把根號搬到分母外面",
      tex: "\\frac{1}{\\sqrt a+\\sqrt b}=\\frac{\\sqrt a-\\sqrt b}{a-b}", tracks: ["10"], codes: ["A-10-1"], links: ["real-numbers", "numeric-error", "square-of-sum"] },

    // ---- 數列與級數 ----
    { slug: "arithmetic-series", ready: true, region: "series", title: "等差級數", sub: "兩個階梯拼成長方形",
      tex: "S_n=\\frac{n(a_1+a_n)}{2}", tracks: ["10"], codes: ["N-10-6"], links: ["infinite-geometric", "fundamental-theorem", "induction", "geometric-series"] },
    { slug: "geometric-series", ready: true, region: "series", title: "等比數列與級數", sub: "一直乘，不是一直加",
      tex: "S_n=\\frac{a(1-r^n)}{1-r}", tracks: ["10"], codes: ["N-10-6"], links: ["infinite-geometric", "exp-growth", "recurrence"] },
    { slug: "recurrence", ready: true, region: "series", title: "遞迴關係式", sub: "只說下一步怎麼走",
      tex: "a_{n+1}=p\\,a_n+q", tracks: ["10"], codes: ["N-10-6"], links: ["induction", "exp-growth"] },
    { slug: "infinite-geometric", ready: true, region: "series", title: "無窮等比級數", sub: "一直切一半，剛好填滿",
      tex: "\\sum_{k=1}^{\\infty}ar^{k-1}=\\frac{a}{1-r}", tracks: ["J", "Y"], codes: ["N-12甲-2", "N-12乙-2"], links: ["fundamental-theorem", "geometric-dist"] },
    { slug: "induction", ready: true, region: "series", title: "數學歸納法", sub: "推倒第一張骨牌", tracks: ["10"], codes: ["N-10-6"], links: [],
      tex: "P(1)\\ \\wedge\\ \\big(P(k)\\Rightarrow P(k+1)\\big)" },

    // ---- 函數與圖形 ----
    { slug: "completing-square", ready: true, region: "function", title: "配方法與頂點式", sub: "剪一條、補一角",
      tex: "x^2+bx=\\left(x+\\tfrac b2\\right)^2-\\left(\\tfrac b2\\right)^2", tracks: ["10"], codes: ["F-10-1"], links: [] },
    { slug: "cubic-shape", ready: true, region: "function", title: "三次函數的樣子", sub: "局部看起來像直線", tracks: ["10"], codes: ["F-10-2"], links: ["derivative"],
      tex: "y=a(x-h)^3+p(x-h)+k" },
    { slug: "exp-growth", ready: true, region: "function", title: "按比例成長與 e", sub: "連續複利長出的常數", tracks: ["B", "J"], codes: ["F-11B-2", "N-12甲-1"], links: ["limit"],
      tex: "\\left(1+\\tfrac1n\\right)^n\\to e" },

    { slug: "parabola", ready: true, region: "function", title: "拋物線", sub: "到點與到線一樣遠",
      tex: "y^2=4cx", tracks: ["J"], codes: ["G-12甲-1"], links: ["ellipse"] },
    { slug: "ellipse", ready: true, region: "function", title: "橢圓", sub: "兩根釘子一條繩",
      tex: "\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1", tracks: ["J"], codes: ["G-12甲-1"], links: ["hyperbola"] },
    { slug: "hyperbola", ready: true, region: "function", title: "雙曲線", sub: "距離差固定",
      tex: "\\frac{x^2}{a^2}-\\frac{y^2}{b^2}=1", tracks: ["J"], codes: ["G-12甲-1"], links: [] },
    { slug: "conic-reflection", ready: true, region: "function", title: "二次曲線的反射", sub: "焦點名字的由來",
      tex: "\\text{平行光}\\to\\text{焦點}", tracks: ["X"], codes: ["G-12甲-1"], links: ["parabola"] },

    { slug: "poly-inequality", ready: true, region: "function", title: "多項式不等式", sub: "圖形在 x 軸上方的部分",
      tex: "(x-r_1)(x-r_2)>0", tracks: ["10"], codes: ["F-10-3"], links: ["completing-square", "cubic-shape", "poly-roots", "linear-programming"] },

    { slug: "exp-log-graphs", ready: true, region: "function", title: "指數與對數函數", sub: "對 y=x 翻過去的兩條曲線",
      tex: "y=a^x\\ \\leftrightarrow\\ y=\\log_a x", tracks: ["A"], codes: ["F-11A-4"], links: ["exp-growth"] },
    { slug: "conic-sections", ready: true, region: "function", title: "平面截圓錐", sub: "一刀切出四種曲線",
      tex: "\\text{圓、橢圓、拋物線、雙曲線}", tracks: ["B"], codes: ["S-11B-2"], links: ["parabola", "ellipse", "hyperbola"] },

    { slug: "functions-basics", ready: true, region: "function", title: "函數的基本性質", sub: "對應、奇偶、反函數、合成",
      tex: "(f\\circ g)(x)=f(g(x))", tracks: ["J", "Y"], codes: ["F-12甲-1", "F-12乙-1"], links: ["exp-log-graphs", "coord-symmetry", "function-limit"] },

    // ---- 三角 ----
    { slug: "unit-circle", ready: true, region: "trig", title: "三角比與單位圓", sub: "sin、cos 是影子的長度",
      tex: "\\sin^2\\theta+\\cos^2\\theta=1", tracks: ["10"], codes: ["G-10-5", "G-10-6"], links: ["law-of-cosines", "angle-sum", "radian"] },
    { slug: "law-of-cosines", ready: true, region: "trig", title: "餘弦定理", sub: "畢氏定理多了一個修正項",
      tex: "c^2=a^2+b^2-2ab\\cos C", tracks: ["10"], codes: ["G-10-7"], links: ["dot-product"] },
    { slug: "triangle-area", ready: true, region: "trig", title: "三角形面積", sub: "夾角把邊折算成高",
      tex: "K=\\tfrac12ab\\sin C", tracks: ["10"], codes: ["G-10-7"], links: ["law-of-sines", "heron", "determinant"] },
    { slug: "angle-sum", ready: true, region: "trig", title: "和角公式", sub: "兩個直角三角形疊成長方形",
      tex: "\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta", tracks: ["A"], codes: ["G-11A-5"], links: ["waves", "linear-map", "complex-plane", "double-angle"] },
    { slug: "double-angle", ready: true, region: "trig", title: "二倍角與半角", sub: "角度加倍，值不會加倍",
      tex: "\\sin2\\theta=2\\sin\\theta\\cos\\theta", tracks: ["A"], codes: ["G-11A-5"], links: ["unit-circle", "waves"] },
    { slug: "radian", ready: true, region: "trig", title: "弧度量", sub: "用半徑去量角", tracks: ["A", "B"], codes: ["N-11A-1", "N-11B-1"], links: ["waves"],
      tex: "s=r\\theta" },
    { slug: "waves", ready: true, region: "trig", title: "波的疊合", sub: "同頻的波加起來還是波", tracks: ["A"], codes: ["F-11A-2"], links: [],
      tex: "a\\sin x+b\\cos x=r\\sin(x+\\varphi)" },

    { slug: "heron", ready: true, region: "trig", title: "海龍公式", sub: "只用三邊求面積",
      tex: "K=\\sqrt{s(s-a)(s-b)(s-c)}", tracks: ["X"], codes: ["G-10-7"], links: ["law-of-cosines"] },
    { slug: "median-theorem", ready: true, region: "trig", title: "中線定理", sub: "把角度消掉的技巧",
      tex: "\\overline{AB}^2+\\overline{AC}^2=2(\\overline{AM}^2+\\overline{BM}^2)", tracks: ["X"], codes: ["G-10-7"], links: ["law-of-cosines", "plane-vector"] },
    { slug: "polar-equation", ready: true, region: "trig", title: "極坐標方程式", sub: "方程式在挑選點",
      tex: "r=3\\ \\text{是圓},\\ \\theta=\\tfrac\\pi4\\ \\text{是射線}", tracks: ["X"], codes: ["G-10-5"], links: ["unit-circle"] },

    { slug: "trig-graphs", ready: true, region: "trig", title: "三角函數的圖形", sub: "把單位圓攤開",
      tex: "y=\\sin x,\\ \\cos x,\\ \\tan x", tracks: ["A"], codes: ["F-11A-1"], links: ["waves", "periodic-model"] },
    { slug: "periodic-model", ready: true, region: "trig", title: "週期性數學模型", sub: "摩天輪的高度",
      tex: "y=k+A\\sin\\big(\\tfrac{2\\pi}{T}(t-h)\\big)", tracks: ["B"], codes: ["F-11B-1"], links: [] },

    { slug: "law-of-sines", ready: true, region: "trig", title: "正弦定理與測量", sub: "外接圓的直徑藏在比值裡",
      tex: "\\frac{a}{\\sin A}=\\frac{b}{\\sin B}=\\frac{c}{\\sin C}=2R", tracks: ["10"], codes: ["G-10-7"], links: ["law-of-cosines", "unit-circle"] },

    // ---- 坐標與空間 ----
    { slug: "coord-symmetry", ready: true, region: "space", title: "坐標圖形的對稱", sub: "摺一摺，坐標就換位子",
      tex: "(x,y)\\mapsto(y,x)", tracks: ["10"], codes: ["G-10-1"], links: ["line-equation", "exp-log-graphs"] },
    { slug: "line-equation", ready: true, region: "space", title: "直線方程式", sub: "斜率是一路上的坡度",
      tex: "y-y_0=m(x-x_0)", tracks: ["10"], codes: ["G-10-2"], links: ["circle-equation", "line-circle"] },
    { slug: "circle-equation", ready: true, region: "space", title: "圓方程式", sub: "畢氏定理繞一圈",
      tex: "(x-h)^2+(y-k)^2=r^2", tracks: ["10"], codes: ["G-10-3"], links: ["line-circle"] },
    { slug: "line-circle", ready: true, region: "space", title: "直線與圓", sub: "比一比 d 和 r",
      tex: "d<r,\\ d=r,\\ d>r", tracks: ["10"], codes: ["G-10-4"], links: [] },
    { slug: "space-concept", ready: true, region: "space", title: "空間中的線與面", sub: "歪斜線與三垂線",
      tex: "\\overline{PA}\\perp E,\\ \\overline{AB}\\perp L\\Rightarrow\\overline{PB}\\perp L", tracks: ["A", "B"], codes: ["S-11A-1", "S-11B-1"], links: ["space-coords"] },
    { slug: "space-coords", ready: true, region: "space", title: "空間坐標與經緯度", sub: "三個數字定位一點",
      tex: "\\sqrt{x^2+y^2+z^2}", tracks: ["A", "B"], codes: ["G-11A-2", "G-11B-4"], links: ["space-vector"] },
    { slug: "perspective", ready: true, region: "space", title: "比例與透視", sub: "遠的東西為什麼變小",
      tex: "y'=\\frac{f}{d}\\,y", tracks: ["B"], codes: ["G-11B-3"], links: [] },

    { slug: "linear-programming", ready: true, region: "space", title: "線性規劃", sub: "把平行線推到最遠的角落",
      tex: "\\max\\ (ax+by)\\ \\text{在可行區域的頂點}", tracks: ["Y"], codes: ["A-12乙-1"], links: ["line-equation"] },

    // ---- 向量與矩陣 ----
    { slug: "dot-product", ready: true, region: "vector", title: "內積與正射影", sub: "影子長 × 長度",
      tex: "\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta", tracks: ["A", "B"], codes: ["G-11A-6", "G-11B-2"], links: ["determinant"] },
    { slug: "determinant", ready: true, region: "vector", title: "行列式與面積", sub: "兩個向量張出的平行四邊形", tracks: ["A"], codes: ["G-11A-6", "G-11A-8"], links: ["linear-map"],
      tex: "\\begin{vmatrix}a_1&b_1\\\\a_2&b_2\\end{vmatrix}=a_1b_2-a_2b_1" },
    { slug: "linear-map", ready: true, region: "vector", title: "線性變換", sub: "矩陣其實在做動作", tracks: ["A"], codes: ["F-11A-3"], links: ["ellipse"],
      tex: "A\\binom{x}{y}=x\\binom{a}{c}+y\\binom{b}{d}" },

    { slug: "eigen-preview", ready: true, region: "vector", title: "特徵向量預告", sub: "只被拉長的方向",
      tex: "A\\vec v=\\lambda\\vec v", tracks: ["X"], codes: ["F-11A-3"], links: ["linear-map"] },

    { slug: "plane-vector", ready: true, region: "vector", title: "平面向量", sub: "位移可以相加、可以伸縮",
      tex: "\\vec w=s\\vec u+t\\vec v", tracks: ["A", "B"], codes: ["G-11A-1", "G-11B-1"], links: ["dot-product", "triangle-inequality", "space-vector"] },
    { slug: "cauchy", ready: true, region: "vector", title: "柯西不等式", sub: "影子不會比本人長",
      tex: "(a_1b_1+a_2b_2)^2\\le(a_1^2+a_2^2)(b_1^2+b_2^2)", tracks: ["A"], codes: ["G-11A-6", "G-11A-7"], links: ["dot-product", "space-vector", "am-gm", "triangle-inequality"] },
    { slug: "triangle-inequality", ready: true, region: "vector", title: "三角不等式", sub: "繞路不會比較近",
      tex: "|\\vec u+\\vec v|\\le|\\vec u|+|\\vec v|", tracks: ["A"], codes: ["G-11A-4"], links: [] },
    { slug: "space-vector", ready: true, region: "vector", title: "空間向量與內積", sub: "多一個分量，想法不變",
      tex: "\\vec a\\cdot\\vec b=a_1b_1+a_2b_2+a_3b_3", tracks: ["A"], codes: ["G-11A-3", "G-11A-7"], links: ["cross-product"] },
    { slug: "cross-product", ready: true, region: "vector", title: "外積", sub: "同時垂直兩個向量",
      tex: "|\\vec a\\times\\vec b|=|\\vec a||\\vec b|\\sin\\theta", tracks: ["A"], codes: ["G-11A-7"], links: ["plane-equation"] },
    { slug: "plane-equation", ready: true, region: "vector", title: "平面方程式", sub: "一個法向量決定方向",
      tex: "ax+by+cz=d", tracks: ["A"], codes: ["G-11A-9"], links: ["space-line", "linear-system-3"] },
    { slug: "space-line", ready: true, region: "vector", title: "空間中的直線", sub: "起點加上 t 倍方向",
      tex: "P=A+t\\,\\vec d", tracks: ["A"], codes: ["G-11A-10"], links: [] },
    { slug: "linear-system-3", ready: true, region: "vector", title: "三元一次聯立方程式", sub: "三個平面交在哪裡",
      tex: "\\left[\\begin{smallmatrix}1&1&1\\\\0&1&2\\\\0&0&1\\end{smallmatrix}\\right]", tracks: ["A"], codes: ["A-11A-2"], links: [] },
    { slug: "matrix-table", ready: true, region: "vector", title: "矩陣與資料表格", sub: "表格乘表格",
      tex: "A\\vec x=x_1\\vec a_1+x_2\\vec a_2", tracks: ["A", "B"], codes: ["A-11B-1", "A-11A-1", "A-11A-3"], links: ["linear-map", "determinant"] },

    // ---- 機率與資料 ----
    { slug: "conditional", ready: true, region: "prob", title: "條件機率與貝氏", sub: "資訊來了，判斷要更新", tracks: ["A", "B"], codes: ["D-11A-2", "D-11A-3", "D-11B-2"], links: ["hypothesis-test"],
      tex: "P(A\\mid B)=\\frac{P(A\\cap B)}{P(B)}" },
    { slug: "expectation", ready: true, region: "prob", title: "期望值", sub: "長期平均會落在哪裡", tracks: ["10"], codes: ["D-10-4"], links: ["conditional", "random-variable"],
      tex: "E=\\sum x_i\\,p_i" },
    { slug: "data-spread", ready: true, region: "prob", title: "一維數據分析", sub: "平均藏起來的東西", tracks: ["10"], codes: ["D-10-2"], links: ["standardize", "best-fit-line"],
      tex: "Q_1\\ Q_2\\ Q_3,\\quad \\text{IQR}=Q_3-Q_1" },
    { slug: "standardize", ready: true, region: "prob", title: "標準化與相關", sub: "不同尺度怎麼比較", tracks: ["10"], codes: ["D-10-2"], links: ["normal-dist", "best-fit-line"],
      tex: "z=\\frac{x-\\mu}{\\sigma}" },
    { slug: "best-fit-line", ready: true, region: "prob", title: "最適直線", sub: "錯得最少的那一條", tracks: ["10"], codes: ["D-10-2"], links: ["standardize"],
      tex: "y-\\bar y=r\\,\\frac{s_y}{s_x}(x-\\bar x)" },

    { slug: "random-variable", ready: true, region: "prob", title: "隨機變數", sub: "中心與分散",
      tex: "\\sigma^2=\\sum(x_i-\\mu)^2p_i", tracks: ["J", "Y"], codes: ["D-12甲-1", "D-12乙-1"], links: ["binomial"] },
    { slug: "binomial", ready: true, region: "prob", title: "二項分布", sub: "高爾頓板上的小球",
      tex: "P(X=k)=C^n_kp^k(1-p)^{n-k}", tracks: ["J", "Y"], codes: ["D-12甲-2", "D-12乙-2"], links: ["hypothesis-test", "normal-dist"] },
    { slug: "geometric-dist", ready: true, region: "prob", title: "幾何分布", sub: "第一次成功要等多久",
      tex: "P(X=k)=(1-p)^{k-1}p", tracks: ["J"], codes: ["D-12甲-2"], links: [] },
    { slug: "hypothesis-test", ready: true, region: "prob", title: "合理性檢定", sub: "結果罕見到該懷疑嗎",
      tex: "P(X\\ge x_{\\text{觀察}})\\ \\text{很小}\\Rightarrow\\text{懷疑}", tracks: ["J", "Y"], codes: ["D-12甲-2", "D-12乙-2"], links: [] },
    { slug: "perm-repeat", ready: true, region: "prob", title: "同物排列", sub: "扣掉看不出的重複",
      tex: "\\frac{n!}{n_1!\\,n_2!\\cdots}", tracks: ["X"], codes: ["D-10-3"], links: ["binomial"] },
    { slug: "normal-dist", ready: true, region: "prob", title: "常態分布（直觀）", sub: "為什麼那麼多鐘形",
      tex: "\\mu\\pm2\\sigma\\approx95\\%", tracks: ["X"], codes: ["D-12甲-2"], links: [] },

    { slug: "sets", ready: true, region: "prob", title: "集合與文氏圖", sub: "把條件畫成圈圈",
      tex: "A\\cap B,\\ A\\cup B,\\ A'", tracks: ["10"], codes: ["D-10-1"], links: ["counting"] },
    { slug: "counting", ready: true, region: "prob", title: "有系統的計數", sub: "樹狀圖與取捨原理",
      tex: "|A\\cup B|=|A|+|B|-|A\\cap B|", tracks: ["10"], codes: ["D-10-3"], links: ["combinations"] },
    { slug: "combinations", ready: true, region: "prob", title: "排列與組合", sub: "有沒有順序差多少",
      tex: "C^n_k=\\frac{P^n_k}{k!}", tracks: ["10"], codes: ["D-10-3"], links: ["binomial", "perm-repeat", "expectation", "repeat-arrange", "grouping"] },
    { slug: "repeat-arrange", ready: true, region: "prob", title: "重複排列", sub: "用過的還可以再用",
      tex: "n^k", tracks: ["10"], codes: ["D-10-3"], links: ["counting", "sets"] },
    { slug: "grouping", ready: true, region: "prob", title: "分組分堆", sub: "堆沒有名字的時候",
      tex: "\\frac{C^6_2C^4_2C^2_2}{3!}=15", tracks: ["10"], codes: ["D-10-3"], links: ["perm-repeat"] },
    { slug: "subjective-prob", ready: true, region: "prob", title: "主觀與客觀機率", sub: "信念與頻率",
      tex: "\\frac{\\text{發生次數}}{\\text{試驗次數}}\\to p", tracks: ["A", "B"], codes: ["D-11A-1", "D-11B-1"], links: ["conditional"] },

    { slug: "classical-probability", ready: true, region: "prob", title: "古典機率", sub: "數樣本空間裡的點",
      tex: "P(A)=\\frac{n(A)}{n(S)}", tracks: ["10"], codes: ["D-10-4"], links: ["counting", "combinations", "expectation", "conditional"] },

    // ---- 微積分 ----
    { slug: "fundamental-theorem", ready: true, region: "calc", title: "微積分基本定理", sub: "面積的變化率就是高度",
      tex: "\\frac{d}{dx}\\int_a^x f(t)\\,dt=f(x)", tracks: ["J", "Y"], codes: ["F-12甲-5", "F-12甲-6", "F-12乙-5"], links: ["volume"] },
    { slug: "derivative", ready: true, region: "calc", title: "導數", sub: "割線變成切線", tracks: ["J", "Y"], codes: ["F-12甲-3", "F-12乙-3"], links: ["fundamental-theorem", "extrema"],
      tex: "f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}" },
    { slug: "limit", ready: true, region: "calc", title: "數列的極限", sub: "無限過程有沒有終點", tracks: ["J"], codes: ["N-12甲-1"], links: ["derivative", "infinite-geometric"],
      tex: "\\lim_{n\\to\\infty}a_n=L" },
    { slug: "extrema", ready: true, region: "calc", title: "導函數的應用", sub: "斜率說出形狀",
      tex: "f'>0\\ \\text{遞增},\\ f''>0\\ \\text{凹向上}", tracks: ["J", "Y"], codes: ["F-12甲-4", "F-12乙-4"], links: [] },
    { slug: "volume", ready: true, region: "calc", title: "積分求體積", sub: "切成薄片再加回來",
      tex: "V=\\int_a^b\\pi f(x)^2\\,dx", tracks: ["J"], codes: ["F-12甲-7"], links: [] },

    { slug: "function-limit", ready: true, region: "calc", title: "函數的極限與連續", sub: "圖形接不接得起來",
      tex: "\\lim_{x\\to a}f(x)=f(a)", tracks: ["J", "Y"], codes: ["F-12甲-2", "F-12乙-2"], links: ["derivative", "limit"] },
    { slug: "integral-average", ready: true, region: "calc", title: "積分的應用：平均與總量", sub: "把高低起伏抹平",
      tex: "\\bar f=\\frac{1}{b-a}\\int_a^b f(x)\\,dx", tracks: ["Y"], codes: ["F-12乙-6"], links: ["fundamental-theorem"] }
  ],

  /* 建議閱讀順序（上一篇／下一篇、首頁卡片）：高一 → 11 年級 → 數甲 */
  order: ["real-numbers", "abs-value", "numeric-error", "square-of-sum", "radicals", "am-gm", "exp-log", "poly-roots",
          "logic", "sets", "arithmetic-series", "geometric-series", "recurrence", "induction",
          "coord-symmetry", "line-equation", "circle-equation", "line-circle", "completing-square", "cubic-shape", "poly-inequality",
          "unit-circle", "law-of-cosines", "triangle-area", "law-of-sines", "counting", "combinations", "repeat-arrange", "grouping",
          "classical-probability", "expectation", "data-spread", "standardize", "best-fit-line",
          "radian", "trig-graphs", "periodic-model", "angle-sum", "double-angle", "waves", "log-laws", "exp-log-graphs", "exp-growth",
          "plane-vector", "triangle-inequality", "dot-product", "cauchy", "determinant", "matrix-table", "linear-map",
          "space-concept", "space-coords", "space-vector", "cross-product", "plane-equation", "space-line", "linear-system-3",
          "perspective", "conic-sections", "linear-programming", "subjective-prob", "conditional",
          "functions-basics", "limit", "function-limit", "infinite-geometric", "derivative", "extrema", "fundamental-theorem", "integral-average", "volume",
          "random-variable", "binomial", "geometric-dist", "hypothesis-test",
          "complex-equations", "complex-plane", "roots-of-unity", "parabola", "ellipse", "hyperbola",
          "heron", "median-theorem", "polar-equation", "rational-root", "perm-repeat", "conic-reflection", "normal-dist", "eigen-preview"]
};

window.CATALOG.get = function (slug) {
  return window.CATALOG.units.find(function (u) { return u.slug === slug; });
};
window.CATALOG.region = function (id) {
  return window.CATALOG.regions.find(function (r) { return r.id === id; });
};
