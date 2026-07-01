from PIL import Image
import numpy as np
from scipy.ndimage import label

def find_main_component(mask_path):
    img = Image.open(mask_path).convert('L')
    mask = np.array(img) > 127
    
    # Label connected components
    labeled_mask, num_features = label(mask)
    print("Number of components found:", num_features)
    
    # Find the size of each component
    sizes = [np.sum(labeled_mask == i) for i in range(1, num_features + 1)]
    if not sizes:
        print("No components found!")
        return
        
    largest_idx = np.argmax(sizes) + 1
    largest_size = sizes[largest_idx - 1]
    print(f"Largest component index: {largest_idx}, size: {largest_size} pixels ({largest_size/mask.size*100:.2f}%)")
    
    # Bounding box of the largest component
    coords = np.argwhere(labeled_mask == largest_idx)
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    print(f"Largest component bounds: x_min={x_min}, y_min={y_min}, x_max={x_max}, y_max={y_max}")
    print(f"Width={x_max - x_min}, Height={y_max - y_min}")
    print(f"Centroid: x={int(coords[:,1].mean())}, y={int(coords[:,0].mean())}")
    
    # Save an image containing ONLY the largest component
    out_mask = (labeled_mask == largest_idx) * 255
    Image.fromarray(out_mask.astype(np.uint8)).save("largest_component.png")
    print("Saved largest_component.png")

if __name__ == "__main__":
    find_main_component("tag_mask.png")
