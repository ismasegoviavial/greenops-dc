from PIL import Image
import numpy as np

def map_mask(mask_path, width=80):
    img = Image.open(mask_path)
    # Resize to width x height
    aspect_ratio = img.height / img.width
    height = int(width * aspect_ratio * 0.5)
    img_resized = img.resize((width, height))
    
    pixels = np.array(img_resized)
    
    ascii_str = ""
    for y in range(height):
        row_str = ""
        for x in range(width):
            val = pixels[y, x]
            # If color is white (255) print # else print .
            if isinstance(val, np.ndarray):
                # If RGB/RGBA
                val = val[0]
            if val > 127:
                row_str += "#"
            else:
                row_str += "."
        ascii_str += row_str + "\n"
    print(ascii_str)

if __name__ == "__main__":
    map_mask("tag_mask.png")
