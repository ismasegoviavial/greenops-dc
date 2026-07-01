import cv2
import numpy as np

def enhance_image(img_path):
    img = cv2.imread(img_path)
    if img is None:
        print(f"No se pudo cargar {img_path}")
        return
    
    # 1. Aumentar saturación y contraste usando HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
    hsv[:, :, 1] = hsv[:, :, 1] * 1.15  # Saturation
    hsv[:, :, 2] = hsv[:, :, 2] * 1.05  # Value / Contrast
    hsv = np.clip(hsv, 0, 255).astype(np.uint8)
    enhanced = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    
    # 2. Sharpen (Unsharp mask) para que la madera se vea en alta resolución
    gaussian = cv2.GaussianBlur(enhanced, (0, 0), 2.0)
    sharpened = cv2.addWeighted(enhanced, 1.5, gaussian, -0.5, 0)
    
    cv2.imwrite(img_path, sharpened)
    print(f"Calidad mejorada para {img_path}")

# Mejorar ambos mockups de madera
enhance_image(r"C:\Users\Fernanda\Downloads\mockup_1_logo_black.jpg")
enhance_image(r"C:\Users\Fernanda\Downloads\mockup_2_red_sleeve.jpg")
