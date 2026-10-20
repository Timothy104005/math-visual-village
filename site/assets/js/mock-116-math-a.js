/* 116 學測數學 A 全真模擬卷
   題目與解法來源：C:\GAST\output\116_學測數學A_全真模擬卷 */
(function () {
  var A = "../assets/exams/116/";
  var questions = [
    {
      n: 1, part: "單選題", pts: 5,
      q: "設 $p<q$ 為兩個奇質數，且 $pq-p-q=95$，則 $p+q$ 的值為何？",
      opts: ["$18$", "$20$", "$22$", "$24$", "$26$"],
      see: "式子差一個常數就能完整因式分解：在兩邊同時加 $1$。",
      steps: ["$pq-p-q+1=96$，所以 $(p-1)(q-1)=96$。", "因 $p,q$ 是奇質數，$p-1,q-1$ 都是正偶數。檢查 $96$ 的因數配對，只有 $(6,16)$ 加一後同為質數。", "因此 $(p,q)=(7,17)$，所以 $p+q=24$。"],
      trap: "不要直接寫成 $(p-1)(q-1)=95$；展開後會多出 $+1$。候選也必須再檢查是否為質數。",
      ans: "<b>(4)</b>　$24$"
    },
    {
      n: 2, part: "單選題", pts: 5,
      q: "若實數 $x$ 滿足 $(4^x)^3=8^{x+2}$，則 $x$ 為何？",
      opts: ["$-2$", "$-1$", "$0$", "$1$", "$2$"],
      see: "左右兩邊都能化成以 $2$ 為底；同底數相等，就比較指數。",
      steps: ["$(4^x)^3=(2^{2x})^3=2^{6x}$。", "$8^{x+2}=(2^3)^{x+2}=2^{3x+6}$。", "$6x=3x+6$，所以 $x=2$。"],
      trap: "$(4^x)^3=4^{3x}$，不是 $4^{x+3}$。外面的三次方要乘進指數。",
      ans: "<b>(5)</b>　$x=2$"
    },
    {
      n: 3, part: "單選題", pts: 5,
      q: "將數字 $1,2,3,4,5$ 各使用一次排成五位數，再把所得的 $120$ 個五位數由小到大排列。嚴格介於 $24153$ 與 $31524$ 之間的五位數共有多少個？",
      opts: ["$12$", "$13$", "$14$", "$15$", "$16$"],
      see: "這是字典順序排名。先求兩端各排第幾名，再把兩個端點扣掉。",
      steps: ["逐位固定前綴計數，可得 $24153$ 是第 $38$ 個。", "同理，$31524$ 是第 $53$ 個。", "嚴格介於兩者之間共有 $53-38-1=14$ 個。"],
      trap: "兩個名次直接相減會把一個端點算進去；題目說『嚴格介於』，還要再減 $1$。",
      ans: "<b>(3)</b>　$14$"
    },
    {
      n: 4, part: "單選題", pts: 5,
      q: "如圖，直角三角形 $ABC$ 中，$\\angle C=90^\\circ$，$AC=6$，$BC=8$，且 $CD\\perp AB$。求 $\\tan\\angle DCA$。",
      img: A + "q04_triangle.png", alt: "直角三角形 ABC 從 C 向斜邊 AB 作高 CD",
      opts: ["$\\frac12$", "$\\frac34$", "$1$", "$\\frac43$", "$2$"],
      see: "斜邊上的高會切出兩個與原三角形相似的小三角形。先找出 $\\angle DCA$ 對應原圖的哪個角。",
      steps: ["由 $CD\\perp AB$ 與 $\\angle C=90^\\circ$，可得 $\\triangle ACD\\sim\\triangle ABC$。", "所以 $\\angle DCA=\\angle CBA$。", "$\\tan\\angle DCA=\\tan\\angle CBA=AC/BC=6/8=3/4$。"],
      trap: "最常見的是把 $\\angle DCA$ 認成 $\\angle CAB$，導致正切取倒數。",
      ans: "<b>(2)</b>　$\\dfrac34$"
    },
    {
      n: 5, part: "單選題", pts: 5,
      q: "點 $P=(x,y)$ 位於第一象限且滿足 $x+y=6$。將 $P$ 繞原點逆時針旋轉 $90^\\circ$ 得 $P^{\\prime}$。若 $PP^{\\prime}=2\\sqrt{10}$，則 $xy$ 為何？",
      opts: ["$4$", "$6$", "$8$", "$10$", "$12$"],
      see: "逆時針轉 $90^\\circ$：$(x,y)\\mapsto(-y,x)$。把旋轉後兩點的距離平方展開。",
      steps: ["$P'=(-y,x)$，所以 $PP'^2=(-y-x)^2+(x-y)^2=2(x^2+y^2)$。", "由 $PP'=2\\sqrt{10}$ 得 $x^2+y^2=20$。", "$(x+y)^2=x^2+y^2+2xy$，故 $36=20+2xy$，得到 $xy=8$。"],
      trap: "逆時針旋轉像是 $(-y,x)$，不是 $(y,-x)$；而且 $PP'$ 不等於 $OP$。",
      ans: "<b>(3)</b>　$8$"
    },
    {
      n: 6, part: "單選題", pts: 5,
      q: "某批晶片含 A 型 $3$ 枚、B 型 $2$ 枚及 C 型 $1$ 枚，六枚晶片重量相同；檢測每枚需 $20$ 秒。現隨機不放回抽取 $2$ 枚，已知其中至少有 $1$ 枚為 B 型，則所抽兩枚屬於不同型號的機率為何？",
      opts: ["$\\frac59$", "$\\frac23$", "$\\frac79$", "$\\frac89$", "$1$"],
      see: "條件已經把樣本空間縮小到『至少一枚 B』。分母不能再用全部 $\\binom62$。",
      steps: ["含至少一枚 B 的無序抽法有 $\\binom62-\\binom42=9$ 種。", "不同型號可為 AB，共 $3\\cdot2=6$ 種；或 BC，共 $2\\cdot1=2$ 種。", "條件機率為 $(6+2)/9=8/9$。"],
      trap: "若用 $15$ 當分母，就是忽略了『已知至少一枚 B』；BB 也不能算成不同型號。",
      ans: "<b>(4)</b>　$\\dfrac89$"
    },
    {
      n: 7, part: "多選題", pts: 5,
      q: "已知實數 $a>1$ 且 $a+\\frac1a=3$。定義 $u_0=3$，且對所有非負整數 $n$，$u_{n+1}=u_n^2-2$。請選出正確的選項。",
      opts: ["$a^2+\\frac1{a^2}=7$", "$u_2=47$", "數列 $\\{u_n\\}$ 嚴格遞增", "對每個非負整數 $n$，方程 $x+\\frac1x=u_n$ 恰有一個正實數解", "對每個非負整數 $n$，皆有 $u_{n+1}<u_n^2$"],
      see: "先算前兩項，再研究 $u_{n+1}-u_n$；第 (4) 要把分式方程改寫成二次方程。",
      steps: ["$(a+a^{-1})^2-2=a^2+a^{-2}=7$，所以 (1) 對；$u_1=7,u_2=47$，所以 (2) 對。", "當 $u_n>2$，$u_{n+1}-u_n=(u_n-2)(u_n+1)>0$，所以 (3) 對。", "$x+x^{-1}=u_n$ 有兩個互為倒數的相異正根，故 (4) 錯；定義直接給 $u_{n+1}=u_n^2-2<u_n^2$，故 (5) 對。"],
      trap: "只算前幾項不能代替單調性的證明；$x$ 與 $1/x$ 是兩個相異正解。",
      ans: "<b>(1)(2)(3)(5)</b>"
    },
    {
      n: 8, part: "多選題", pts: 5,
      q: "定義 $\\alpha_n=\\log_2(3\\cdot4^n)$，其中 $1\\le n\\le12$；另定義 $\\beta_m=\\log_2(12\\cdot8^m)$，其中 $0\\le m\\le8$，且索引皆為整數。請選出正確的選項。",
      opts: ["$\\{\\alpha_n\\}$ 為公差 $2$ 的等差數列", "$\\{\\beta_m\\}$ 為公比 $3$ 的等比數列", "兩數列共有 $4$ 個共同數值", "最小共同數值為 $\\log_2 12$", "最大共同數值為 $\\log_2(3\\cdot2^{20})$"],
      see: "先用對數律把兩個數列線性化；共同值會變成一條二元整數方程。",
      steps: ["$\\alpha_n=\\log_2 3+2n$，$\\beta_m=\\log_2 3+2+3m$。", "共同值滿足 $2n=2+3m$；範圍內有 $(1,0),(4,2),(7,4),(10,6)$。", "因此共有 $4$ 個，最小是 $\\alpha_1=\\log_2 12$，最大是 $\\alpha_{10}=\\log_2(3\\cdot2^{20})$。"],
      trap: "取對數後是等差，不是等比；形式解 $(13,8)$ 超出 $n\\le12$，不能算。",
      ans: "<b>(1)(3)(4)(5)</b>"
    },
    {
      n: 9, part: "多選題", pts: 5,
      q: "某車速感測器原始讀值為 $x$，校正值為 $y=ax+b$。表中兩筆資料為 $(20,32)$、$(50,68)$。車輛行駛兩段各 $60$ 公里的路程，原始速率分別固定為每小時 $30$ 公里與 $60$ 公里；感測器每隔相同時間記錄一次。請選出正確的選項。",
      img: A + "q09_calibration_table.png", alt: "原始讀值與校正值表格",
      opts: ["$a=\\frac65$", "$b=8$", "全程原始讀值的時間平均為 $45$", "全程校正值的時間平均為 $56$", "若原始讀值標準差為 $\\sigma$，校正值標準差為 $\\frac65\\sigma$"],
      see: "兩段距離相同，但花的時間不同。感測器等時間取樣，所以平均必須用時間加權。",
      steps: ["由兩點得 $a=(68-32)/(50-20)=6/5$，再代回得 $b=8$。", "兩段所需時間為 $2$ 小時與 $1$ 小時；原始時間平均是 $(30\\cdot2+60\\cdot1)/3=40$。", "校正平均為 $6/5\\cdot40+8=56$；標準差只乘 $|a|=6/5$，不受 $b$ 影響。"],
      trap: "直接算 $(30+60)/2=45$ 忽略了時間權重；平移常數 $b$ 不會改變標準差。",
      ans: "<b>(1)(2)(4)(5)</b>"
    },
    {
      n: 10, part: "多選題", pts: 5,
      q: "設 $A=\\begin{bmatrix}0&-1\\\\1&0\\end{bmatrix}$，$\\boldsymbol v_0=(2,1)$，並定義 $\\boldsymbol v_n=A^n\\boldsymbol v_0$。請選出正確的選項。",
      opts: ["$A^2=-I$", "$A^4=I$", "$\\boldsymbol v_{2026}=(-2,-1)$", "以 $\\boldsymbol v_0,\\boldsymbol v_1,\\boldsymbol v_2,\\boldsymbol v_3$ 為頂點的四邊形面積為 $10$", "$\\boldsymbol v_0+\\cdots+\\boldsymbol v_{2025}=(3,1)$"],
      see: "$A$ 是逆時針旋轉 $90^\\circ$；四次回到原位，所以所有遠期問題都只看除以 $4$ 的餘數。",
      steps: ["直接相乘得 $A^2=-I,A^4=I$。", "$2026\\equiv2\\pmod4$，所以 $\\boldsymbol v_{2026}=-\\boldsymbol v_0=(-2,-1)$。四個端點依序形成邊長平方 $10$ 的正方形，面積 $10$。", "前 $2024$ 項是完整四項循環且每組和為 $0$；剩下兩項和為 $(1,3)$，不是 $(3,1)$。"],
      trap: "注意總和從 $v_0$ 到 $v_{2025}$，一共有 $2026$ 項。",
      ans: "<b>(1)(2)(3)(4)</b>"
    },
    {
      n: 11, part: "多選題", pts: 5,
      q: "如圖，$\\overrightarrow{OA}=\\boldsymbol u$、$\\overrightarrow{OB}=\\boldsymbol v$，且 $|\\boldsymbol u|=5$。$\\boldsymbol v$ 在 $\\boldsymbol u$ 方向的正射影長為 $3$，$\\triangle OAB$ 面積為 $10$。將 $\\boldsymbol v$ 逆時針旋轉 $90^\\circ$ 得 $\\overrightarrow{OB'}$。請選出正確的選項。",
      img: A + "q11_vectors.png", alt: "向量投影與旋轉示意圖",
      opts: ["$\\boldsymbol u\\cdot\\boldsymbol v=15$", "$|\\boldsymbol v|=5$", "$\\cos\\angle AOB=\\frac35$", "$BB'=5\\sqrt2$", "$\\triangle OAB'$ 面積為 $10$"],
      see: "把 $u$ 放在 $x$ 軸：投影長直接給 $v$ 的水平分量；面積再給垂直分量。",
      steps: ["取 $u=(5,0)$。投影長為 $3$，故 $v_x=3$；由 $\\frac12\\cdot5\\cdot|v_y|=10$ 得指定側 $v_y=4$，所以 $v=(3,4)$。", "因此內積 $15$、長度 $5$、夾角餘弦 $3/5$。", "旋轉像為 $(-4,3)$，故 $BB'=\\sqrt{7^2+1^2}=5\\sqrt2$；新三角形面積為 $15/2$。"],
      trap: "投影長 $3$ 不是內積；旋轉後的三角形高度已經改變。",
      ans: "<b>(1)(2)(3)(4)</b>"
    },
    {
      n: 12, part: "多選題", pts: 5,
      q: "在立方體 $0\\le x,y,z\\le2$ 中，考慮平面 $\\pi_t:x+y+z=t$。請選出正確的選項。",
      opts: ["$\\pi_3$ 通過立方體中心", "$\\pi_3$ 將立方體分成兩個等體積部分", "原點到 $\\pi_3$ 的距離為 $\\sqrt3$", "$\\pi_3$ 與立方體的截面為正六邊形", "八個頂點到 $\\pi_3$ 的距離皆相等"],
      see: "中心是 $(1,1,1)$；截面頂點可直接找坐標和等於 $3$ 且落在稜上的點。",
      steps: ["中心坐標和為 $3$，且中心對稱會互換平面兩側，所以 (1)(2) 對。", "原點到平面距離為 $3/\\sqrt3=\\sqrt3$。", "截面六頂點是 $(0,1,2)$ 的六個排列，形成正六邊形；立方體頂點的坐標和可能為 $0,2,4,6$，距離不全相等。"],
      trap: "『通過中心』只保證兩側等體積，不代表八個頂點到平面的距離都相同。",
      ans: "<b>(1)(2)(3)(4)</b>"
    },
    {
      n: 13, part: "選填題", pts: 5,
      q: "一隻蟲從正方體的一個頂點出發，每一步都在目前頂點相連的三條稜中等機率選一條，走到相鄰頂點，共走 $5$ 步。若第 $k$ 步與第 $k-1$ 步走的是同一條稜但方向相反，稱第 $k$ 步為一次「立即折返」。設五步中立即折返的次數為 $X$，求 $E(X)$。",
      see: "把總次數拆成四個『第 $k$ 步是否折返』的 0-1 指示變數。期望值相加不要求事件獨立。",
      steps: ["對 $k=2,3,4,5$，令 $I_k$ 表示第 $k$ 步是否立即折返。", "每一步走完後，下一個頂點的三條稜中恰有一條是原路返回，所以 $P(I_k=1)=1/3$。", "$E(X)=E(I_2+I_3+I_4+I_5)=4\\cdot1/3=4/3$。"],
      trap: "第一步沒有前一步可比較；也不需要先證明四個折返事件彼此獨立。",
      ans: "$\\dfrac43$"
    },
    {
      n: 14, part: "選填題", pts: 5,
      q: "圓心為 $O$、半徑為 $5$ 的圓上有兩點 $B,C$，且弦 $BC=6$。在 $BC$ 與 $O$ 的異側作正三角形 $ABC$。若 $\\theta=\\angle AOB$，求 $\\cos\\theta$。",
      see: "連圓心到弦中點。半弦長是 $3$，半徑是 $5$，會出現 $3$-$4$-$5$ 直角三角形。",
      steps: ["設 $M$ 為 $BC$ 中點，則 $BM=3$ 且 $OM\\perp BC$。", "$OM=\\sqrt{5^2-3^2}=4$。正三角形頂點 $A$ 也在 $BC$ 的中垂線上；由異側條件，射線 $OA$ 經過 $M$。", "$\\theta=\\angle MOB$，所以 $\\cos\\theta=OM/OB=4/5$。"],
      trap: "弦長是 $6$，直角三角形裡用的是半弦 $3$；異側條件也排除了補角。",
      ans: "$\\dfrac45$"
    },
    {
      n: 15, part: "選填題", pts: 5,
      q: "如圖，正方形 $ABCD$ 邊長為 $10$。點 $E,F,G,H$ 依序在 $AB,BC,CD,DA$ 上，且 $AE=CG=x$、$BF=DH=10-x$，其中 $0\\le x\\le10$。求四邊形 $EFGH$ 面積的最大值。",
      img: A + "q15_square.png", alt: "正方形四邊取點形成內四邊形",
      see: "把正方形放到坐標平面，內四邊形相鄰兩邊就是兩個簡單向量；用行列式直接算面積。",
      steps: ["取 $A=(0,0),B=(10,0),C=(10,10),D=(0,10)$，則 $E=(x,0),F=(10,10-x),H=(0,x)$。", "$\\overrightarrow{EF}=(10-x,10-x)$、$\\overrightarrow{EH}=(-x,x)$，面積為行列式絕對值 $2x(10-x)$。", "$2x(10-x)=50-2(x-5)^2\\le50$，在 $x=5$ 取等號。"],
      trap: "若用大正方形減四個角，要注意角落三角形的兩股是交替的 $x$ 與 $10-x$。",
      ans: "$50$"
    },
    {
      n: 16, part: "選填題", pts: 5,
      q: "平面向量 $\\vec u,\\vec v$ 所張成的平行四邊形面積為 $12$。若 $\\vec a=2\\vec u-\\vec v$、$\\vec b=\\vec u+3\\vec v$，求 $\\vec a,\\vec b$ 所張成的平行四邊形面積。",
      see: "新向量是舊基底的線性組合；面積倍率就是係數矩陣行列式的絕對值。",
      steps: ["係數矩陣是 $\\begin{bmatrix}2&-1\\\\1&3\\end{bmatrix}$。", "行列式為 $2\\cdot3-(-1)\\cdot1=7$。", "新平行四邊形面積為 $|7|\\cdot12=84$。"],
      trap: "行列式 $7$ 只是面積倍率，還要乘原面積 $12$。",
      ans: "$84$"
    },
    {
      n: 17, part: "選填題", pts: 5,
      q: "半徑為 $3\\sqrt3$ 的扇形可捲成一直圓錐。在母線 $AB$ 上取點 $P$，使 $AP:PB=1:2$，並以過 $P$ 且平行底面的平面截去上方小圓錐。當扇形圓心角改變時，求剩餘圓臺體積除以 $\\pi$ 的最大值。",
      img: A + "q17_cone.png", alt: "圓錐平行底面截出圓臺",
      see: "扇形半徑就是圓錐母線，固定為 $3\\sqrt3$；小圓錐與大圓錐的線性比為 $1:3$。",
      steps: ["設完整圓錐底半徑 $r$、高 $h$，則 $r^2+h^2=27$。小圓錐體積是完整圓錐的 $1/27$，圓臺是 $26/27$。", "令 $x=r^2$，完整圓錐體積除以 $\\pi$ 為 $\\frac13x\\sqrt{27-x}$。最大化其平方 $x^2(27-x)$。", "在 $x=18$ 時取最大，完整圓錐最大體積為 $18\\pi$；圓臺為 $\\frac{26}{27}\\cdot18\\pi=\\frac{52}{3}\\pi$。"],
      trap: "相似立體的體積比是線性比的三次方；扇形半徑是母線，不是底圓半徑。",
      ans: "$\\dfrac{52}{3}$"
    },
    {
      n: 18, part: "混合題組", pts: 3,
      q: "在坐標平面上，$R$ 是邊長為 $1$、邊平行坐標軸的正方形。給定 $t>0$，先沿 $x$ 軸伸長為 $t$ 倍、沿 $y$ 軸伸長為 $\\frac2t$ 倍，再繞原點逆時針旋轉 $45^\\circ$，所得圖形記為 $R_t$。以 $R_t$ 為底面建立高為 $h$ 的直角柱，且體積固定為 $8$。上述平面變換的矩陣為何？",
      opts: ["$\\frac1{\\sqrt2}\\begin{bmatrix}t&\\frac2t\\\\-t&\\frac2t\\end{bmatrix}$", "$\\frac1{\\sqrt2}\\begin{bmatrix}t&-\\frac2t\\\\t&\\frac2t\\end{bmatrix}$", "$\\frac1{\\sqrt2}\\begin{bmatrix}t&-t\\\\\\frac2t&\\frac2t\\end{bmatrix}$", "$\\frac1{\\sqrt2}\\begin{bmatrix}\\frac2t&-t\\\\\\frac2t&t\\end{bmatrix}$", "$\\begin{bmatrix}t&0\\\\0&\\frac2t\\end{bmatrix}$"],
      see: "矩陣乘法順序要從右往左讀：先伸縮，再旋轉，所以是『旋轉矩陣 × 伸縮矩陣』。",
      steps: ["伸縮矩陣 $D=\\begin{bmatrix}t&0\\\\0&2/t\\end{bmatrix}$。", "逆時針 $45^\\circ$ 旋轉矩陣 $Q=\\frac1{\\sqrt2}\\begin{bmatrix}1&-1\\\\1&1\\end{bmatrix}$。", "$QD=\\frac1{\\sqrt2}\\begin{bmatrix}t&-2/t\\\\t&2/t\\end{bmatrix}$。"],
      trap: "寫成 $DQ$ 就會選到把先後順序顛倒的矩陣；題目是先伸縮、後旋轉。",
      ans: "<b>(2)</b>"
    },
    {
      n: 19, part: "混合題組", pts: 5,
      q: "承第 18 題，證明 $R_t$ 的面積與 $t$ 無關，並求柱高 $h$。",
      see: "線性變換的面積倍率是行列式絕對值。旋轉不改面積，伸縮倍率的乘積是 $t\\cdot2/t$。",
      steps: ["旋轉矩陣行列式為 $1$，伸縮矩陣行列式為 $t\\cdot2/t=2$。", "原正方形面積為 $1$，所以 $R_t$ 面積恆為 $2$，與 $t$ 無關。", "柱體積 $2h=8$，因此 $h=4$。"],
      trap: "旋轉 $45^\\circ$ 不會再讓面積乘 $\\cos45^\\circ$；旋轉保面積。",
      ans: "$R_t$ 面積恆為 $2$，$h=4$"
    },
    {
      n: 20, part: "混合題組", pts: 7,
      q: "承前兩題，設此直角柱的總表面積為 $S(t)$。求出 $S(t)$，並證明其最小值為 $4+16\\sqrt2$，同時指出等號成立時的 $t$。",
      see: "旋轉保持長度，所以底面相鄰邊仍是 $t$ 與 $2/t$；第 19 題已知底面積 $2$、柱高 $4$。",
      steps: ["兩個底面面積共 $2\\cdot2=4$。四個側面總面積是底面周長乘高：$2(t+2/t)\\cdot4=8t+16/t$。", "所以 $S(t)=4+8t+16/t$。", "由 AM-GM，$8t+16/t\\ge2\\sqrt{128}=16\\sqrt2$；等號條件 $8t=16/t$，故 $t=\\sqrt2$。"],
      trap: "別漏掉第二個底面，也別忘了底面周長有兩條 $t$ 和兩條 $2/t$。",
      ans: "$S(t)=4+8t+\\dfrac{16}{t}$；最小值 $4+16\\sqrt2$，於 $t=\\sqrt2$ 成立"
    }
  ];

  function md(x) { return SK.md(x || ""); }
  function renderQuestion(item) {
    var sec = SK.h("article", { class: "exam-question sk-frame", id: "q" + item.n });
    var options = item.opts ? '<ol class="exam-options">' + item.opts.map(function (o, i) {
      return '<li><b>(' + (i + 1) + ')</b>　' + md(o) + '</li>';
    }).join("") + "</ol>" : "";
    var figure = item.img ? '<img class="exam-figure" src="' + item.img + '" alt="' + item.alt + '">' : "";
    sec.innerHTML =
      '<div class="exam-qhead"><span class="exam-qnum">' + item.n + '</span><span class="points">' + item.part + ' · ' + item.pts + ' 分</span></div>' +
      '<div class="exam-stem">' + md(item.q) + "</div>" + figure + options +
      '<details class="observe"><summary>先別動筆：你看到什麼？</summary><div>' + md(item.see) + "</div></details>" +
      '<details class="algorithm"><summary>算法：一步一步拆開</summary><div><ol>' + item.steps.map(function (x) { return "<li>" + md(x) + "</li>"; }).join("") + "</ol></div></details>" +
      '<details class="pitfall"><summary>最多人卡在這裡</summary><div>' + md(item.trap) + "</div></details>" +
      '<details class="answer"><summary>◆ 答案</summary><div>' + md(item.ans) + "</div></details>";
    return sec;
  }

  document.body.appendChild(SK.topbar("../", false));
  var main = SK.h("main", { class: "wrap", id: "main" });
  var hero = SK.h("section", { class: "exam-hero sk-frame" });
  hero.innerHTML =
    '<p class="eyebrow">116 GSAT Math A · Full-length mock</p>' +
    '<h1>116 學測數學 A<br>全真模擬卷</h1>' +
    '<p class="lead">先完整計時作答，再回來逐題打開算法。每題都先提示「看到什麼」，接著拆成短步驟，最後才揭曉答案。</p>' +
    '<p class="exam-warning"><span>本試卷題目由網路公開題目改編。</span></p>' +
    '<div class="exam-actions">' +
      '<a class="btn" href="' + A + '116-math-a-student.pdf" target="_blank">下載學生題本</a>' +
      '<a class="btn ghost" href="' + A + '116-math-a-teacher.pdf" target="_blank">下載教師詳解</a>' +
      '<a class="btn sky" href="index.html">回模擬卷專區</a>' +
    "</div>";
  main.appendChild(hero);

  var jump = SK.h("nav", { class: "exam-jump", "aria-label": "跳到題號" });
  questions.forEach(function (item) { jump.insertAdjacentHTML("beforeend", '<a href="#q' + item.n + '">' + item.n + "</a>"); });
  main.appendChild(jump);

  var lastPart = "";
  questions.forEach(function (item) {
    if (item.part !== lastPart) {
      var titles = { "單選題": "第壹部分 · 單選題", "多選題": "第壹部分 · 多選題", "選填題": "第壹部分 · 選填題", "混合題組": "第貳部分 · 混合題組" };
      var meta = { "單選題": "第 1–6 題", "多選題": "第 7–12 題", "選填題": "第 13–17 題", "混合題組": "第 18–20 題" };
      var head = SK.h("div", { class: "exam-part" }, "<h2>" + titles[item.part] + "</h2><span>" + meta[item.part] + "</span>");
      main.appendChild(head);
      lastPart = item.part;
    }
    main.appendChild(renderQuestion(item));
  });

  document.body.appendChild(main);
  document.body.appendChild(SK.footer());
})();
