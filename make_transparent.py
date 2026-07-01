from PIL import Image
import numpy as np

def make_logo_transparent(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    data = np.array(img)
    
    # Extract channels
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Identify background: pixels that are dark (R < 50 and G < 50 and B < 50)
    bg_mask = (r < 50) & (g < 50) & (b < 50)
    
    # Set alpha of background to 0
    data[bg_mask, 3] = 0
    
    # Save the transparent image
    out_img = Image.fromarray(data)
    out_img.save(output_path)
    print(f"Saved transparent logo to {output_path}")

if __name__ == "__main__":
    make_logo_transparent("logo_cropped.png", "logo_transparent.png")
