from PIL import Image
import numpy as np
import collections

def analyze_logo_details(image_path):
    img = Image.open(image_path)
    img_rgb = img.convert('RGB')
    pixels = np.array(img_rgb).reshape(-1, 3)
    
    # Exclude dark background pixels (where R < 50, G < 50, B < 50)
    non_bg_pixels = [tuple(p) for p in pixels if not (p[0] < 50 and p[1] < 50 and p[2] < 50)]
    
    counter = collections.Counter(non_bg_pixels)
    print(f"Total non-bg pixels: {len(non_bg_pixels)} out of {len(pixels)}")
    print("Most common non-background colors:")
    for color, count in counter.most_common(20):
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        print(f"  {color} - {hex_color} - {count} pixels ({count/len(pixels)*100:.2f}%)")

if __name__ == "__main__":
    analyze_logo_details("logo.png")
