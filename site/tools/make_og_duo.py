# -*- coding: utf-8 -*-
"""產生雙人解題室的連結預覽圖（Open Graph，1200×630）：python tools/make_og_duo.py

連結貼到 LINE、FB、Discord 時顯示的卡片。風格對齊網站：奶油白紙、點陣、蜜桃與薄荷圓、深棕細框。
字型用 Windows 內建的標楷體（標題）與微軟正黑體（內文）。
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "img" / "og-duo.png"
FONTS = Path("C:/Windows/Fonts")
W, H = 1200, 630
S = 2  # 先畫兩倍大再縮小，邊緣比較平滑

INK, SOFT, LINE = (58, 48, 42), (111, 100, 90), (74, 63, 55)
PAPER, CARD = (247, 243, 234), (253, 251, 246)
PEACH, MINT, GOLD, GOLD_LINE, MINT_INK = (250, 232, 221), (234, 242, 236), (226, 180, 75), (156, 122, 42), (79, 130, 112)


def font(name, size, index=0):
    return ImageFont.truetype(str(FONTS / name), size * S, index=index)


def star(d, cx, cy, r, on):
    import math
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=GOLD if on else CARD, outline=GOLD_LINE if on else (184, 172, 156), width=4 * S // 2)


def main():
    import sys
    sys.stdout.reconfigure(encoding="utf-8")
    img = Image.new("RGB", (W * S, H * S), PAPER)
    d = ImageDraw.Draw(img)
    for x in range(18 * S, W * S, 36 * S):
        for y in range(18 * S, H * S, 36 * S):
            d.ellipse([x - 2 * S, y - 2 * S, x + 2 * S, y + 2 * S], fill=(225, 219, 207))
    d.ellipse([(1010 - 220) * S, (90 - 220) * S, (1010 + 220) * S, (90 + 220) * S], fill=PEACH)
    d.ellipse([(120 - 200) * S, (600 - 200) * S, (120 + 200) * S, (600 + 200) * S], fill=MINT)
    d.rounded_rectangle([60 * S, 60 * S, (W - 60) * S, (H - 60) * S], radius=40 * S, fill=CARD, outline=LINE, width=3 * S)

    def text(xy, s, f, fill, anchor="mm"):
        d.text((xy[0] * S, xy[1] * S), s, font=f, fill=fill, anchor=anchor)

    text((600, 130), "圖解數學小鎮・解題練習場", font("msjh.ttc", 30), SOFT)
    text((600, 230), "雙人合作挑戰", font("kaiu.ttf", 96), INK)
    text((600, 320), "找一位同學，即時一起解題、一起拿星星", font("msjh.ttc", 34), INK)
    for i in range(5):
        star(d, (600 - 2 * 80 + i * 80) * S, 415 * S, 30 * S, i < 4)
    text((600, 495), "每週一換一組題目・看法拼圖・團隊闖關・接力解題", font("msjh.ttc", 26), MINT_INK)
    text((600, 535), "不計時、不排名，先寫下你看到什麼", font("msjh.ttc", 24), SOFT)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.resize((W, H), Image.LANCZOS).save(OUT, optimize=True)
    print("寫出", OUT.relative_to(ROOT), OUT.stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main()
