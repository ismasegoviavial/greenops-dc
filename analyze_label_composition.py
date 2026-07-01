from PIL import Image
import numpy as np
import collections

def analyze_composition(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    print("Image Dimensions:", img.size)
    
    # Let's count unique colors
    img_rgb = img.convert('RGB')
    pixels = np.array(img_rgb).reshape(-1, 3)
    pixel_tuples = [tuple(p) for p in pixels]
    counter = collections.Counter(pixel_tuples)
    
    print("\nMost common colors:")
    for color, count in counter.most_common(10):
        hex_color = '#{:02x}{:02x}{:02x}'.format(*color)
        print(f"  {hex_color} - {count} pixels ({count/len(pixels)*100:.2f}%)")

if __name__ == "__main__":
    analyze_composition(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
