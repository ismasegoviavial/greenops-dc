from PIL import Image
import numpy as np

def simple_cluster(image_path):
    img = Image.open(image_path)
    data = np.array(img).astype(float)
    h, w, c = data.shape
    pixels = data.reshape(-1, 3)
    
    # Initialize 3 centroids manually (light, medium, dark)
    centroids = np.array([
        [200.0, 200.0, 200.0], # Light
        [120.0, 100.0, 80.0],  # Medium (brown-ish)
        [50.0, 50.0, 50.0]     # Dark
    ])
    
    # Run 5 iterations of K-means
    for _ in range(5):
        # Compute distances
        dists = np.linalg.norm(pixels[:, np.newaxis, :] - centroids, axis=2)
        labels = np.argmin(dists, axis=1)
        # Update centroids
        for i in range(3):
            mask = labels == i
            if np.any(mask):
                centroids[i] = pixels[mask].mean(axis=0)
                
    print("Centroids:")
    for i, c in enumerate(centroids):
        hex_c = '#{:02x}{:02x}{:02x}'.format(int(c[0]), int(c[1]), int(c[2]))
        count = np.sum(labels == i)
        print(f"  Cluster {i}: {hex_c} - {count} pixels ({count/len(pixels)*100:.2f}%)")
        
    # Print the 10x10 grid
    grid_h = h // 10
    grid_w = w // 10
    labels_grid = labels.reshape(h, w)
    print("\nCluster map (10x10 grid):")
    for y in range(10):
        row_str = ""
        for x in range(10):
            block = labels_grid[y*grid_h:(y+1)*grid_h, x*grid_w:(x+1)*grid_w]
            most_common = np.bincount(block.flatten()).argmax()
            row_str += f" {most_common}"
        print(row_str)

if __name__ == "__main__":
    simple_cluster(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
