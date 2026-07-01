from PIL import Image
import numpy as np

def find_actual_box(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Check alpha channel for non-transparent pixels
    if c == 4:
        alpha = data[:, :, 3]
        mask = alpha > 5  # pixels with some opacity
    else:
        # Check for non-white pixels
        r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
        mask = (r < 250) | (g < 250) | (b < 250)
        
    coords = np.argwhere(mask)
    if coords.size == 0:
        print("Image is empty!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    print(f"Actual Box bounding box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")

if __name__ == "__main__":
    find_actual_box(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\original_box.png")
