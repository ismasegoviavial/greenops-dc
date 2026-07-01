import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os

bg_path = r"C:\Users\Fernanda\Downloads\Gemini_Generated_Image_rdodzvrdodzvrdod.png"
logo_path = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA BLACK NO BG.png"
out_path = r"C:\Users\Fernanda\Downloads\mockup_4_caja_centro.png"

bg_img = cv2.imread(bg_path, cv2.IMREAD_UNCHANGED)
H, W = bg_img.shape[:2]

face_x_min = int(W * 0.25)
face_x_max = int(W * 0.82)
face_y_min = int(H * 0.33)
face_y_max = int(H * 0.74)

face_w = face_x_max - face_x_min
face_h = face_y_max - face_y_min

try:
    # Usar PIL para redimensionar y rotar
    logo_pil = Image.open(logo_path).convert("RGBA")
    
    target_w = int(face_w * 0.45)
    aspect = logo_pil.height / logo_pil.width
    target_h = int(target_w * aspect)
    
    logo_pil = logo_pil.resize((target_w, target_h), Image.Resampling.LANCZOS)
    # Rotación para perspectiva
    logo_pil = logo_pil.rotate(2, expand=True, resample=Image.Resampling.BICUBIC)
    
    # Simular "sangrado" de tinta
    logo_pil = logo_pil.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    # Convertir a array de numpy
    logo_np = np.array(logo_pil)
    
    # Extraer alpha
    alpha = logo_np[:, :, 3].astype(np.float32) / 255.0
    
    # Para que parezca tinta real y no un bloque negro que tapa la textura,
    # cambiamos los pixeles negros a un gris oscuro/marrón (ej: 40, 30, 30)
    # y usamos modo MULTIPLICAR.
    ink_color = np.array([40, 30, 30], dtype=np.float32) # BGR
    
    pos_x = face_x_min + (face_w - logo_np.shape[1]) // 2
    pos_y = face_y_min + (face_h - logo_np.shape[0]) // 2
    
    # Región de fondo
    roi = bg_img[pos_y:pos_y+logo_np.shape[0], pos_x:pos_x+logo_np.shape[1], :3].astype(np.float32)
    
    # Blend MULTIPLICAR: (Fondo * Tinta) / 255
    # Como ink_color está en escala 0-255, normalizamos
    multiplied = (roi * ink_color) / 255.0
    
    # Mezclar usando el canal alpha del logo
    alpha_3d = np.expand_dims(alpha, axis=2)
    blended = roi * (1 - alpha_3d) + multiplied * alpha_3d
    
    bg_img[pos_y:pos_y+logo_np.shape[0], pos_x:pos_x+logo_np.shape[1], :3] = blended.astype(np.uint8)
    
    cv2.imwrite(out_path, bg_img)
    print("Mockup de la caja al centro guardado con efecto MULTIPLICAR correctamente.")
except Exception as e:
    print(f"Error: {e}")
