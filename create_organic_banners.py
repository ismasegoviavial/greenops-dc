from PIL import Image
import os
import glob
import shutil

def find_latest_bg():
    files = glob.glob(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\banner_bg_organic_*.png")
    if not files:
        print("No organic background image found!")
        return None
    latest_file = max(files, key=os.path.getctime)
    return latest_file

def create_organic_banners():
    bg_path = find_latest_bg()
    if not bg_path:
        return
        
    bg_img = Image.open(bg_path)
    logo_img = Image.open("logo_transparent.png")
    
    banner_w, banner_h = 1584, 396
    
    # Define crops
    crops = {
        "center": (0, 384, 1024, 640),
        "upper": (0, 256, 1024, 512),
        "lower": (0, 512, 1024, 768)
    }
    
    # Scale Logo
    logo_target_h = 130
    logo_aspect = logo_img.width / logo_img.height
    logo_target_w = int(logo_target_h * logo_aspect)
    
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_img.resize((logo_target_w, logo_target_h), resample_filter)
    
    # Right alignment positions
    pos_y = (banner_h - logo_target_h) // 2
    pos_x = banner_w - logo_target_w - 120
    
    # Centered positions
    pos_x_center = (banner_w - logo_target_w) // 2
    
    downloads_dir = "c:\\Users\\Fernanda\\Downloads"
    artifact_dir = "C:\\Users\\Fernanda\\.gemini\\antigravity-ide\\brain\\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd"
    
    for crop_name, box in crops.items():
        bg_cropped = bg_img.crop(box)
        bg_resized = bg_cropped.resize((banner_w, banner_h), resample_filter)
        
        # Right aligned
        banner_right = bg_resized.copy()
        banner_right.paste(logo_resized, (pos_x, pos_y), logo_resized)
        out_name_right = f"linkedin_banner_organic_{crop_name}_right.png"
        banner_right.save(out_name_right)
        
        # Center aligned
        banner_center = bg_resized.copy()
        banner_center.paste(logo_resized, (pos_x_center, pos_y), logo_resized)
        out_name_center = f"linkedin_banner_organic_{crop_name}_center.png"
        banner_center.save(out_name_center)
        
        # Copy to downloads and artifact dir
        shutil.copy(out_name_right, os.path.join(downloads_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(downloads_dir, out_name_center))
        shutil.copy(out_name_right, os.path.join(artifact_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(artifact_dir, out_name_center))
        
        print(f"Processed and copied {out_name_right} and {out_name_center}")

if __name__ == "__main__":
    create_organic_banners()
