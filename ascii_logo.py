from PIL import Image

def to_ascii(image_path, width=120):
    img = Image.open(image_path)
    # Convert to grayscale
    img_gray = img.convert('L')
    
    # Calculate height based on width and character aspect ratio (approx 0.5)
    aspect_ratio = img_gray.height / img_gray.width
    height = int(width * aspect_ratio * 0.5)
    img_resized = img_gray.resize((width, height))
    
    # Define ascii characters from dark to light
    chars = "@%#*+=-:. "
    
    # Get pixel data
    pixels = img_resized.getdata()
    
    # Build ascii string
    ascii_str = ""
    for i, pixel in enumerate(pixels):
        if i > 0 and i % width == 0:
            ascii_str += "\n"
        # Map pixel value (0-255) to character index (0-9)
        idx = int((pixel / 255) * (len(chars) - 1))
        ascii_str += chars[idx]
        
    print(ascii_str)

if __name__ == "__main__":
    to_ascii("logo_cropped.png")
