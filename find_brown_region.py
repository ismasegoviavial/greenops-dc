from PIL import Image
import numpy as np

def find_brown_region(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Target brown color: R around 130-170, G around 100-130, B around 70-100
    # Let's find pixels matching this range
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    
    mask = (r >= 100) & (r <= 190) & (g >= 80) & (g <= 150) & (b >= 50) & (b <= 120)
    coords = np.argwhere(mask)
    
    if coords.size == 0:
        print("No brown region found!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    print(f"Brown region: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")
    
    # Save a cropped version of this region to check
    cropped = img.crop((x_min, y_min, x_max, y_max))
    cropped.save("brown_region.jpg")
    print("Saved brown_region.jpg")

if __name__ == "__main__":
    find_brown_region(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
