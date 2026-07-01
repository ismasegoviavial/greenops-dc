import numpy as np
from PIL import Image

def find_main_tag(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Target brown color range
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    # Let's use a tighter brown mask to avoid noise:
    # A typical leather tag is brown, let's say R: 120-160, G: 95-135, B: 70-110
    mask = (r >= 120) & (r <= 165) & (g >= 95) & (g <= 135) & (b >= 70) & (b <= 110)
    
    # We want to find the largest contiguous region of True pixels in the mask.
    # We can do a simple labeling algorithm or find the dense region.
    # Let's count how many True pixels are in each row and col.
    row_counts = np.sum(mask, axis=1)
    col_counts = np.sum(mask, axis=0)
    
    # Find the bounds where density is high
    dense_rows = np.where(row_counts > 10)[0]
    dense_cols = np.where(col_counts > 10)[0]
    
    if len(dense_rows) == 0 or len(dense_cols) == 0:
        print("No dense brown region found!")
        return
        
    y_min, y_max = dense_rows[0], dense_rows[-1]
    x_min, x_max = dense_cols[0], dense_cols[-1]
    
    print(f"Dense brown region: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")
    
    # Let's write a debug image highlighting this region
    debug_img = img.copy()
    from PIL import ImageDraw
    draw = ImageDraw.Draw(debug_img)
    draw.rectangle([x_min, y_min, x_max, y_max], outline="red", width=3)
    debug_img.save("debug_main_tag.jpg")
    print("Saved debug_main_tag.jpg")

if __name__ == "__main__":
    find_main_tag(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
