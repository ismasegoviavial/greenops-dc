from PIL import Image
import os

def check_file(path):
    exists = os.path.exists(path)
    print(f"Path: {path}")
    print(f"Exists: {exists}")
    if exists:
        img = Image.open(path)
        print(f"Format: {img.format}")
        print(f"Size: {img.size}")
        print(f"Mode: {img.mode}")

if __name__ == "__main__":
    check_file(r"C:\Users\Fernanda\Downloads\Caja-de-carton-auto-armable-medidas-25x15x15-2.png")
