import cv2
import numpy as np
from PIL import Image

bg_path = r"C:\Users\Fernanda\Downloads\e4b2c213accd3fe12bcee4f1d44f1a60.jpg"
logo_black = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA BLACK NO BG.png"
logo_white = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE NO BG.png"

# Coordenadas exactas estimadas visualmente
board_x1, board_x2 = 70, 920
board_y1, board_y2 = 154, 790
sleeve_x1, sleeve_x2 = 508, 718
sleeve_y1, sleeve_y2 = board_y1, board_y2

# ====== TASK 1: Add black logo to bottom right OF THE BOARD ======
bg_img = Image.open(bg_path).convert("RGBA")
try:
    logo_blk = Image.open(logo_black).convert("RGBA")
    
    # Queremos que el logo sea un 25% del ancho de la tabla
    target_width = int((board_x2 - board_x1) * 0.25)
    aspect_ratio = logo_blk.height / logo_blk.width
    target_height = int(target_width * aspect_ratio)
    logo_blk = logo_blk.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # Posicionar abajo a la derecha DENTRO DE LA TABLA
    padding = 30
    pos_x = board_x2 - target_width - padding
    pos_y = board_y2 - target_height - padding

    mockup1 = Image.new("RGBA", bg_img.size)
    mockup1.paste(bg_img, (0, 0))
    mockup1.paste(logo_blk, (pos_x, pos_y), mask=logo_blk)
    
    mockup1_path = r"C:\Users\Fernanda\Downloads\mockup_1_logo_black.jpg"
    mockup1.convert("RGB").save(mockup1_path)
    print("Mockup 1 guardado correctamente.")
except Exception as e:
    print(f"Error Mockup 1: {e}")

# ====== TASK 2: Modify the craft sleeve (Burdeo / Rojo Vino) ======
cv_img = cv2.imread(bg_path)
h, w, c = cv_img.shape

# Región de la faja (sleeve)
# Llenamos toda la faja con un color sólido opaco (HEX 7E212A -> BGR: 42, 33, 126)
# Ya no necesitamos Inpainting ni HSV, porque el color sólido tapa todo
cv_img[sleeve_y1:sleeve_y2, sleeve_x1:sleeve_x2] = (42, 33, 126)

# Convertir a PIL para pegar el logo blanco
cv_img_rgb = cv2.cvtColor(cv_img, cv2.COLOR_BGR2RGB)
pil_bg2 = Image.fromarray(cv_img_rgb).convert("RGBA")

try:
    logo_wht = Image.open(logo_white).convert("RGBA")
    
    # Rotar el logo 90 grados (para que se lea de abajo hacia arriba en vertical)
    logo_wht = logo_wht.rotate(90, expand=True)
    
    sleeve_w = sleeve_x2 - sleeve_x1
    sleeve_h = sleeve_y2 - sleeve_y1
    
    # Queremos que el logo rotado sea aún más pequeño y elegante.
    # Tomamos el 35% del ancho de la faja.
    target_w_logo2 = int(sleeve_w * 0.35)
    aspect2 = logo_wht.height / logo_wht.width
    target_h_logo2 = int(target_w_logo2 * aspect2)
    
    # Si la altura calculada es más grande que la faja, la limitamos
    if target_h_logo2 > sleeve_h * 0.7:
        target_h_logo2 = int(sleeve_h * 0.7)
        target_w_logo2 = int(target_h_logo2 / aspect2)

    logo_wht = logo_wht.resize((target_w_logo2, target_h_logo2), Image.Resampling.LANCZOS)

    # Posicionar al centro de la faja
    pos_x2 = sleeve_x1 + (sleeve_w - target_w_logo2) // 2
    pos_y2 = sleeve_y1 + (sleeve_h - target_h_logo2) // 2

    mockup2 = Image.new("RGBA", pil_bg2.size)
    mockup2.paste(pil_bg2, (0, 0))
    # Asegurar 100% de opacidad para el logo
    mockup2.paste(logo_wht, (pos_x2, pos_y2), mask=logo_wht)

    mockup2_path = r"C:\Users\Fernanda\Downloads\mockup_2_red_sleeve.jpg"
    mockup2.convert("RGB").save(mockup2_path)
    print("Mockup 2 guardado correctamente.")
except Exception as e:
    print(f"Error Mockup 2: {e}")
