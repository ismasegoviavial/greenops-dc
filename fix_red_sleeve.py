import cv2
import numpy as np
from PIL import Image

bad_mockup_path = r"C:\Users\Fernanda\Downloads\mockup_2_red_sleeve_.jpg"
orig_path = r"C:\Users\Fernanda\Downloads\e4b2c213accd3fe12bcee4f1d44f1a60.jpg"
logo_path = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE NO BG.png"
out_path = r"C:\Users\Fernanda\Downloads\mockup_2_red_sleeve_fixed.png"

# 1. Cargar imágenes
bad_mockup = cv2.imread(bad_mockup_path)
orig_img = cv2.imread(orig_path)

# 2. Encontrar la máscara del parche burdeo (aproximadamente [42, 33, 126] en BGR)
# Como es un JPEG, el color puede variar ligeramente, así que usamos un rango estrecho
lower_burgundy = np.array([20, 15, 100])
upper_burgundy = np.array([60, 50, 150])
mask = cv2.inRange(bad_mockup, lower_burgundy, upper_burgundy)

# Refinar la máscara (abrir/cerrar) para eliminar ruido
kernel = np.ones((5,5), np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

# 3. Inpaint el texto negro en la imagen original dentro de la máscara
gray_orig = cv2.cvtColor(orig_img, cv2.COLOR_BGR2GRAY)
# Texto es oscuro, fondo cartón es claro
_, text_mask = cv2.threshold(gray_orig, 90, 255, cv2.THRESH_BINARY_INV)
text_mask = cv2.bitwise_and(text_mask, mask)

# Dilatar el texto un poco para que el inpaint lo cubra bien
text_mask = cv2.dilate(text_mask, np.ones((3,3), np.uint8), iterations=1)

clean_sleeve = cv2.inpaint(orig_img, text_mask, 5, cv2.INPAINT_TELEA)

# 4. Colorizar la cinta manteniendo la textura
target_bgr = np.array([42.0, 33.0, 126.0]) # Burdeo La Treve

# Calcular el color promedio del cartón limpio
mean_bgr = cv2.mean(clean_sleeve, mask=mask)[:3]

# Factor de escala para cada canal
factor = target_bgr / np.array(mean_bgr)

# Aplicar el factor a la imagen limpia (convertida a float32 para evitar overflow)
colored_sleeve = (clean_sleeve.astype(np.float32) * factor)
colored_sleeve = np.clip(colored_sleeve, 0, 255).astype(np.uint8)

# 5. Fusionar la cinta colorizada con la imagen original
final_img = orig_img.copy()
final_img[mask > 0] = colored_sleeve[mask > 0]

# 6. Añadir el logo blanco
# Encontrar el bounding box de la máscara para centrar el logo
y_indices, x_indices = np.where(mask > 0)
x_min, x_max = np.min(x_indices), np.max(x_indices)
y_min, y_max = np.min(y_indices), np.max(y_indices)

sleeve_w = x_max - x_min
sleeve_h = y_max - y_min

# Convertir a PIL para pegar el logo
final_pil = Image.fromarray(cv2.cvtColor(final_img, cv2.COLOR_BGR2RGB)).convert("RGBA")
logo_pil = Image.open(logo_path).convert("RGBA")

# El logo debe ocupar un ~65% del ancho de la cinta
target_lw = int(sleeve_w * 0.65)
aspect = logo_pil.height / logo_pil.width
target_lh = int(target_lw * aspect)

logo_pil = logo_pil.resize((target_lw, target_lh), Image.Resampling.LANCZOS)
# Rotarlo 90 grados para que quede vertical
logo_pil = logo_pil.rotate(90, expand=True, resample=Image.Resampling.BICUBIC)

# Centrarlo en la cinta
pos_x = x_min + (sleeve_w - logo_pil.width) // 2
pos_y = y_min + (sleeve_h - logo_pil.height) // 2

final_pil.paste(logo_pil, (pos_x, pos_y), mask=logo_pil)

# Guardar
final_pil.convert("RGB").save(out_path)
print("Cinta de cartón burdeo realista guardada con éxito.")
