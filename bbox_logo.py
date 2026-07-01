from PIL import Image
import numpy as np

def find_bbox(image_path):
    img = Image.open(image_path)
    img_rgb = img.convert('RGB')
    data = np.array(img_rgb)
    
    # We want to find the bounding box of pixels that are NOT dark background.
    # Dark background is roughly R < 50, G < 50, B < 50
    mask = (data[:, :, 0] >= 50) | (data[:, :, 1] >= 50) | (data[:, :, 2] >= 50)
    
    # Get the coordinates
    coords = np.argwhere(mask)
    
    if coords.size == 0:
        print("No logo content found (everything is dark background)!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    print(f"Bounding Box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Content width: {x_max - x_min}, height: {y_max - y_min}")
    
    # Let's crop it and save as logo_cropped.png
    cropped = img.crop((x_min, y_min, x_max, y_max))
    cropped.save("logo_cropped.png")
    print("Saved logo_cropped.png")

if __name__ == "__main__":
    find_bbox("logo.png")
