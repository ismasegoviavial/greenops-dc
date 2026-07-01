from PIL import Image
import numpy as np

def segment_tag(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Apply our rule: R > 110 and R - B > 15 and G - B > 10
    r, g, b = data[:,:,0].astype(float), data[:,:,1].astype(float), data[:,:,2].astype(float)
    mask = (r > 110) & (r - b > 15) & (g - b > 10)
    
    # Save the mask as an image to verify
    mask_img = Image.fromarray((mask * 255).astype(np.uint8))
    mask_img.save("tag_mask.png")
    
    # Let's find the bounding box of the mask
    coords = np.argwhere(mask)
    if coords.size == 0:
        print("Mask is empty!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    print(f"Tag Bounding Box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")
    
    # Let's save a cropped version of the original image using this bounding box
    cropped = img.crop((x_min, y_min, x_max, y_max))
    cropped.save("tag_cropped.png")
    print("Saved tag_cropped.png")

if __name__ == "__main__":
    segment_tag(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
