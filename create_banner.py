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

def create_banner():
    bg_path = find_latest_bg()
    if not bg_path:
        return
        
    # Load background and logo
    bg_img = Image.open(bg_path)
    logo_img = Image.open("logo_transparent.png")
    
    # Target banner dimensions
    banner_w, banner_h = 1584, 396
    
    # 1. Prepare Background
    # We crop a 4:1 strip from the 1024x1024 background.
    # Let's try 3 different crops to see what looks best:
    # Crop 1: Center (y: 384 to 640)
    # Crop 2: Upper middle (y: 256 to 512)
    # Crop 3: Lower middle (y: 512 to 768)
    
    crops = {
        "center": (0, 384, 1024, 640),
        "upper": (0, 256, 1024, 512),
        "lower": (0, 512, 1024, 768)
    }
    
    # 2. Scale Logo
    # Logo target height = 130
    logo_target_h = 130
    logo_aspect = logo_img.width / logo_img.height
    logo_target_w = int(logo_target_h * logo_aspect)
    
    # Resize logo with high-quality resampling
    # Use Image.Resampling.LANCZOS if available, fallback to LANCZOS
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_img.resize((logo_target_w, logo_target_h), resample_filter)
    
    # Calculate position for right alignment
    # Vertical center: (banner_h - logo_target_h) // 2
    # Horizontal right with padding: banner_w - logo_target_w - 120
    pos_y = (banner_h - logo_target_h) // 2
    pos_x = banner_w - logo_target_w - 120
    
    # Let's also create a centered version
    pos_x_center = (banner_w - logo_target_w) // 2
    
    for crop_name, box in crops.items():
        bg_cropped = bg_img.crop(box)
        bg_resized = bg_cropped.resize((banner_w, banner_h), resample_filter)
        
        # A. Right-aligned logo banner
        banner_right = bg_resized.copy()
        banner_right.paste(logo_resized, (pos_x, pos_y), logo_resized)
        output_right = f"linkedin_banner_{crop_name}_right.png"
        banner_right.save(output_right)
        print(f"Saved {output_right}")
        
        # B. Centered logo banner
        banner_center = bg_resized.copy()
        banner_center.paste(logo_resized, (pos_x_center, pos_y), logo_resized)
        output_center = f"linkedin_banner_{crop_name}_center.png"
        banner_center.save(output_center)
        print(f"Saved {output_center}")

if __name__ == "__main__":
    create_banner()
