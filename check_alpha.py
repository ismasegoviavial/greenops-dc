from PIL import Image
import numpy as np

def check_alpha(image_path):
    img = Image.open(image_path)
    if img.mode != 'RGBA':
        print("Image is not RGBA!")
        return
    data = np.array(img)
    alpha = data[:, :, 3]
    unique_alpha = np.unique(alpha)
    print(f"Unique alpha values: {unique_alpha}")
    print(f"Number of transparent pixels (alpha < 50): {np.sum(alpha < 50)}")
    print(f"Number of opaque pixels (alpha >= 200): {np.sum(alpha >= 200)}")

if __name__ == "__main__":
    check_alpha("logo_cropped.png")
