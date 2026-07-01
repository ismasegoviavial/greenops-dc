from PIL import Image
import numpy as np

def find_box_bounds(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # If the image has an alpha channel, use it, otherwise use color thresholding
    if c == 4:
        alpha = data[:, :, 3]
        mask = alpha > 10
    else:
        # Check for non-white/non-light pixels
        r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
        mask = (r < 245) | (g < 245) | (b < 245)
        
    coords = np.argwhere(mask)
    if coords.size == 0:
        print("Image is entirely white/empty!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    print(f"Box Bounding Box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")
    print(f"Centroid: x={int((x_min+x_max)/2)}, y={int((y_min+y_max)/2)}")

if __name__ == "__main__":
    find_box_bounds(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\original_box.png")
