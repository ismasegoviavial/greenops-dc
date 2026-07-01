import cv2
import numpy as np

img_path = r"C:\Users\Fernanda\Downloads\e4b2c213accd3fe12bcee4f1d44f1a60.jpg"
img = cv2.imread(img_path)
h, w, _ = img.shape

# Edge detection
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
blurred = cv2.GaussianBlur(gray, (5, 5), 0)
edges = cv2.Canny(blurred, 50, 150)

# Find contours
contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Find the largest contour (should be the board)
largest_contour = max(contours, key=cv2.contourArea)
x, y, bw, bh = cv2.boundingRect(largest_contour)

print(f"Image Size: {w}x{h}")
print(f"Board Bounding Box: x={x}, y={y}, w={bw}, h={bh}")

# The sleeve is a vertical band inside the board. 
# Let's crop to the board and do a color threshold for the craft paper,
# or just estimate it visually based on the board's width.
# Visually it's on the right half.
sleeve_x_start = x + int(bw * 0.50)
sleeve_x_end = x + int(bw * 0.74)
sleeve_y_start = y
sleeve_y_end = y + bh

print(f"Estimated Sleeve Box: x1={sleeve_x_start}, x2={sleeve_x_end}, y1={sleeve_y_start}, y2={sleeve_y_end}")
