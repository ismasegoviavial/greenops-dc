from PIL import Image
import numpy as np

def analyze_pixels(path):
    img = Image.open(path)
    data = np.array(img)
    
    # Print the average colors of 10x10 blocks to understand the layout
    print("Color layout grid (10x10 blocks avg R,G,B):")
    h, w, c = data.shape
    grid_h = h // 10
    grid_w = w // 10
    for y in range(10):
        row_str = ""
        for x in range(10):
            block = data[y*grid_h:(y+1)*grid_h, x*grid_w:(x+1)*grid_w]
            avg_color = block.mean(axis=(0,1))
            # Represent as hex
            hex_color = '{:02x}{:02x}{:02x}'.format(int(avg_color[0]), int(avg_color[1]), int(avg_color[2]))
            row_str += f" {hex_color}"
        print(row_str)

if __name__ == "__main__":
    analyze_pixels(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
