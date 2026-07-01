from PIL import Image
import numpy as np
import collections

def analyze_logo(image_path):
    img = Image.open(image_path)
    print(f"Format: {img.format}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")
    
    # Convert to RGB and find dominant colors
    img_rgb = img.convert('RGB')
    pixels = np.array(img_rgb).reshape(-1, 3)
    
    # Exclude white or very light background if needed, but let's just get the most common ones
    pixel_tuples = [tuple(p) for p in pixels]
    counter = collections.Counter(pixel_tuples)
    
    # Print 10 most common colors
    print("Most common colors (R, G, B) and count:")
    for color, count in counter.most_common(20):
        # Convert to hex
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        print(f"  {color} - {hex_color} - {count} pixels ({count/len(pixels)*100:.2f}%)")

if __name__ == "__main__":
    analyze_logo("logo.png")
