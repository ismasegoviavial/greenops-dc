from PIL import Image
import numpy as np

def detect_colored_regions(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Calculate colorfulness for each pixel
    # Colorfulness can be defined as the standard deviation of R, G, B channels
    # Or simply: max(R,G,B) - min(R,G,B)
    r, g, b = data[:,:,0].astype(float), data[:,:,1].astype(float), data[:,:,2].astype(float)
    colorfulness = np.max(data, axis=2).astype(float) - np.min(data, axis=2).astype(float)
    
    # Let's find pixels where colorfulness > 20
    colorful_mask = colorfulness > 20
    coords = np.argwhere(colorful_mask)
    
    if coords.size == 0:
        print("No colorful regions found (the image is entirely grayscale or very desaturated)!")
        return
        
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    print(f"Colorful pixels bounding box: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Total colorful pixels: {np.sum(colorful_mask)} out of {w*h} ({np.sum(colorful_mask)/(w*h)*100:.2f}%)")
    
    # Let's find the average color of these colorful pixels
    avg_color = data[colorful_mask].mean(axis=0)
    print(f"Average color of colorful region: {avg_color}")
    print(f"Hex: #{int(avg_color[0]):02x}{int(avg_color[1]):02x}{int(avg_color[2]):02x}")

if __name__ == "__main__":
    detect_colored_regions(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
