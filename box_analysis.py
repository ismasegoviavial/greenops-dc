from PIL import Image
import numpy as np

def analyze(path):
    img = Image.open(path)
    data = np.array(img)
    h, w, c = data.shape
    
    # We want to find pixels that are opaque (alpha > 200) and NOT white (R < 250 or G < 250 or B < 250)
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    if c == 4:
        a = data[:,:,3]
        mask = (a > 200) & ((r < 250) | (g < 250) | (b < 250))
    else:
        mask = (r < 250) | (g < 250) | (b < 250)
        
    coords = np.argwhere(mask)
    if coords.size == 0:
        print("No box found with this threshold!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    print(f"Opaque non-white box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")

if __name__ == "__main__":
    analyze(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\original_box.png")
