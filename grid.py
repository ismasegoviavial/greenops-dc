import cv2
import numpy as np

img_path = r"C:\Users\Fernanda\Downloads\Gemini_Generated_Image_rdodzvrdodzvrdod.png"
img = cv2.imread(img_path)

# Draw grid
h, w = img.shape[:2]
for x in range(0, w, 50):
    color = (0, 255, 0) if x % 100 == 0 else (255, 0, 0)
    cv2.line(img, (x, 0), (x, h), color, 1)
    if x % 100 == 0:
        cv2.putText(img, str(x), (x, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0,0,255), 1)

for y in range(0, h, 50):
    color = (0, 255, 0) if y % 100 == 0 else (255, 0, 0)
    cv2.line(img, (0, y), (w, y), color, 1)
    if y % 100 == 0:
        cv2.putText(img, str(y), (5, y), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0,0,255), 1)

cv2.imwrite(r"C:\Users\Fernanda\.gemini\antigravity\scratch\grid.png", img)
