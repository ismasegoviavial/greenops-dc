from PIL import Image
import numpy as np
from sklearn.cluster import KMeans

def cluster_colors(image_path):
    img = Image.open(image_path)
    data = np.array(img)
    h, w, c = data.shape
    
    # Reshape pixels
    pixels = data.reshape(-1, 3)
    
    # Run KMeans with 3 clusters
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(pixels)
    
    colors = kmeans.cluster_centers_
    labels = kmeans.labels_
    
    print("Dominant Colors (R, G, B) and their percentage:")
    total_pixels = len(labels)
    for i, color in enumerate(colors):
        count = np.sum(labels == i)
        hex_color = '#{:02x}{:02x}{:02x}'.format(int(color[0]), int(color[1]), int(color[2]))
        print(f"  Cluster {i}: {hex_color} - {count} pixels ({count/total_pixels*100:.2f}%)")
        
    # Let's print a 10x10 map of the clusters
    labels_grid = labels.reshape(h, w)
    grid_h = h // 10
    grid_w = w // 10
    print("\nCluster map (10x10 grid):")
    for y in range(10):
        row_str = ""
        for x in range(10):
            block = labels_grid[y*grid_h:(y+1)*grid_h, x*grid_w:(x+1)*grid_w]
            most_common = np.bincount(block.flatten()).argmax()
            row_str += f" {most_common}"
        print(row_str)

if __name__ == "__main__":
    cluster_colors(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
