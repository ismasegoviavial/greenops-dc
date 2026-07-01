from PIL import Image
import os
import glob

def find_latest_bg():
    files = glob.glob(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\banner_bg_*.png")
    if not files:
        print("No background image found!")
        return None
    latest_file = max(files, key=os.path.getctime)
    return latest_file

def inspect_bg():
    bg_path = find_latest_bg()
    if bg_path:
        img = Image.open(bg_path)
        print(f"Path: {bg_path}")
        print(f"Format: {img.format}")
        print(f"Size: {img.size}")
        print(f"Mode: {img.mode}")

if __name__ == "__main__":
    inspect_bg()
