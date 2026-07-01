import cv2
import numpy as np
from PIL import Image, ImageEnhance

# Usaremos la imagen sin el "_mod" asumiendo que es la caja limpia original
bg_path = r"C:\Users\Fernanda\Downloads\Caja-de-carton-auto-armable-medidas-25x15x15-2.png"
logo_path = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE NO BG.png"

bg_img = Image.open(bg_path).convert("RGBA")

try:
    logo_img = Image.open(logo_path).convert("RGBA")
    
    # Ancho de la cara frontal es ~ 590px
    box_w = 590
    target_w = int(box_w * 0.25)
    aspect = logo_img.height / logo_img.width
    target_h = int(target_w * aspect)
    
    logo_img = logo_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    # Para que parezca "impreso", reduciremos su opacidad al 85% para que se fusione
    # un poco con la textura del cartón, y lo rotaremos ligeramente (ej: 1 grado) 
    # para emparejar la perspectiva natural de la foto.
    logo_img = logo_img.rotate(1, expand=True, resample=Image.Resampling.BICUBIC)
    
    # Reducir opacidad
    alpha = logo_img.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(0.85)
    logo_img.putalpha(alpha)
    
    # Posición inferior derecha de la cara de la caja
    # Borde derecho en x=770, Borde inferior en y=580
    pos_x = 760 - target_w
    pos_y = 570 - target_h
    
    mockup = Image.new("RGBA", bg_img.size)
    mockup.paste(bg_img, (0, 0))
    mockup.paste(logo_img, (pos_x, pos_y), mask=logo_img)
    
    out_path = r"C:\Users\Fernanda\Downloads\mockup_3_caja_carton.png"
    mockup.save(out_path)
    print("Mockup de la caja de cartón guardado correctamente.")
except Exception as e:
    print(f"Error: {e}")
