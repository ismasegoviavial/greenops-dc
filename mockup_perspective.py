import cv2
import numpy as np

bg_path = r"C:\Users\Fernanda\Downloads\Gemini_Generated_Image_rdodzvrdodzvrdod.png"
logo_path = r"C:\Users\Fernanda\OneDrive\Desktop\La Treve\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA BLACK NO BG.png"
out_path = r"C:\Users\Fernanda\Downloads\mockup_4_caja_centro.png"

bg_img = cv2.imread(bg_path, cv2.IMREAD_UNCHANGED)
logo_img = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)

# Dimensiones del logo original
lh, lw = logo_img.shape[:2]
logo_src_pts = np.array([[0, 0], [lw, 0], [lw, lh], [0, lh]], dtype=np.float32)

# Esquinas de la cara frontal en la foto (aproximadas visualmente)
persp_face_pts = np.array([
    [245, 340], # Top-Left
    [830, 345], # Top-Right
    [825, 695], # Bottom-Right
    [245, 755]  # Bottom-Left
], dtype=np.float32)

# Cara plana hipotética (ancho 585, alto 415)
face_w = 585
face_h = 415
flat_face_pts = np.array([[0,0], [face_w,0], [face_w,face_h], [0,face_h]], dtype=np.float32)

# Transformación de cara plana a cara en perspectiva
M_face = cv2.getPerspectiveTransform(flat_face_pts, persp_face_pts)

# Posicionar el logo en la cara plana
target_lw = face_w * 0.28
target_lh = target_lw * (lh / lw)
cx = face_w / 2
cy = face_h / 2

# Esquinas del logo en la cara plana
flat_logo_pts = np.array([
    [cx - target_lw/2, cy - target_lh/2],
    [cx + target_lw/2, cy - target_lh/2],
    [cx + target_lw/2, cy + target_lh/2],
    [cx - target_lw/2, cy + target_lh/2]
], dtype=np.float32).reshape(-1, 1, 2)

# Esquinas del logo en perspectiva
persp_logo_pts = cv2.perspectiveTransform(flat_logo_pts, M_face).reshape(4, 2)

# Transformación final del logo original a la imagen en perspectiva
M_logo = cv2.getPerspectiveTransform(logo_src_pts, persp_logo_pts)

# Warp del logo completo al tamaño de la imagen de fondo
warped_logo = cv2.warpPerspective(logo_img, M_logo, (bg_img.shape[1], bg_img.shape[0]))

# Separar alpha y color
alpha = warped_logo[:, :, 3].astype(np.float32) / 255.0
color = warped_logo[:, :, :3].astype(np.float32)

# Simular desenfoque de tinta sangrada en el alpha
alpha_blur = cv2.GaussianBlur(alpha, (3, 3), 0)

# Tinta multiplicada (gris muy oscuro en lugar de negro total)
ink_color = np.array([40, 30, 30], dtype=np.float32)

bg_float = bg_img[:, :, :3].astype(np.float32)
multiplied = (bg_float * ink_color) / 255.0

alpha_3d = np.expand_dims(alpha_blur, axis=2)
blended = bg_float * (1 - alpha_3d) + multiplied * alpha_3d

bg_img[:, :, :3] = blended.astype(np.uint8)

cv2.imwrite(out_path, bg_img)
print("Mockup con perspectiva perfecta guardado.")
