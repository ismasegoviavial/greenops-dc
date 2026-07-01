from PIL import Image

def inspect_image(path):
    img = Image.open(path)
    print(f"Path: {path}")
    print(f"Format: {img.format}")
    print(f"Size: {img.size}")
    print(f"Mode: {img.mode}")

if __name__ == "__main__":
    inspect_image(r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg")
    inspect_image(r"C:\Users\Fernanda\Downloads\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE RED BG.png")
