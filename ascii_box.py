from PIL import Image

def to_ascii(image_path, width=80):
    img = Image.open(image_path)
    img_gray = img.convert('L')
    
    aspect_ratio = img_gray.height / img_gray.width
    height = int(width * aspect_ratio * 0.5)
    img_resized = img_gray.resize((width, height))
    
    chars = "@%#*+=-:. "
    pixels = img_resized.getdata()
    
    ascii_str = ""
    for i, pixel in enumerate(pixels):
        if i > 0 and i % width == 0:
            ascii_str += "\n"
        idx = int((pixel / 255) * (len(chars) - 1))
        ascii_str += chars[idx]
        
    print(ascii_str)

if __name__ == "__main__":
    to_ascii(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\original_box.png")
