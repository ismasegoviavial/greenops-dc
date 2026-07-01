from PIL import Image, ImageDraw, ImageFilter
import os
import glob
import shutil

def find_latest_bg():
    files = glob.glob(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\banner_bg_ps4_wave_*.png")
    if not files:
        print("No PS4 wave background image found!")
        return None
    latest_file = max(files, key=os.path.getctime)
    return latest_file

def draw_gradient_right(img, start_x, end_x, max_alpha=160):
    """Draws a smooth horizontal dark gradient on the right side of the image."""
    width, height = img.size
    gradient = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    
    for x in range(start_x, end_x):
        # Calculate alpha (0 at start_x, max_alpha at end_x)
        t = (x - start_x) / (end_x - start_x)
        alpha = int(t * max_alpha)
        draw.line([(x, 0), (x, height)], fill=(10, 12, 15, alpha))
        
    return Image.alpha_composite(img.convert("RGBA"), gradient)

def draw_gradient_center(img, center_x, radius_x, max_alpha=160):
    """Draws a smooth radial dark gradient in the center of the image."""
    width, height = img.size
    gradient = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(gradient)
    
    for x in range(width):
        dist = abs(x - center_x)
        if dist < radius_x:
            t = 1.0 - (dist / radius_x)
            alpha = int(t * max_alpha)
            draw.line([(x, 0), (x, height)], fill=(10, 12, 15, alpha))
            
    return Image.alpha_composite(img.convert("RGBA"), gradient)

def create_banners():
    bg_path = find_latest_bg()
    if not bg_path:
        return
        
    bg_img = Image.open(bg_path)
    logo_img = Image.open("logo_transparent.png")
    
    banner_w, banner_h = 1584, 396
    
    crops = {
        "center": (0, 384, 1024, 640),
        "upper": (0, 256, 1024, 512),
        "lower": (0, 512, 1024, 768)
    }
    
    # Scale Logo: make it a bit larger since there's no tagline text
    logo_target_h = 125
    logo_aspect = logo_img.width / logo_img.height
    logo_target_w = int(logo_target_h * logo_aspect)
    
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_img.resize((logo_target_w, logo_target_h), resample_filter)
    
    downloads_dir = "c:\\Users\\Fernanda\\Downloads"
    artifact_dir = "C:\\Users\\Fernanda\\.gemini\\antigravity-ide\\brain\\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd"
    
    for crop_name, box in crops.items():
        bg_cropped = bg_img.crop(box)
        bg_resized = bg_cropped.resize((banner_w, banner_h), resample_filter)
        
        # 1. Right-aligned layout
        banner_right = bg_resized.copy().convert("RGBA")
        
        # Apply a subtle dark gradient on the right side to ensure the logo is perfectly readable
        banner_right = draw_gradient_right(banner_right, 950, 1584, max_alpha=160)
        
        logo_x = banner_w - logo_target_w - 120
        logo_y = (banner_h - logo_target_h) // 2
        banner_right.paste(logo_resized, (logo_x, logo_y), logo_resized)
        
        out_name_right = f"linkedin_banner_final_{crop_name}_right.png"
        banner_right.convert("RGB").save(out_name_right)
        
        # 2. Centered layout
        banner_center = bg_resized.copy().convert("RGBA")
        
        # Apply a subtle dark gradient in the center to make the logo pop
        banner_center = draw_gradient_center(banner_center, banner_w // 2, 350, max_alpha=160)
        
        logo_x_c = (banner_w - logo_target_w) // 2
        logo_y_c = (banner_h - logo_target_h) // 2
        banner_center.paste(logo_resized, (logo_x_c, logo_y_c), logo_resized)
        
        out_name_center = f"linkedin_banner_final_{crop_name}_center.png"
        banner_center.convert("RGB").save(out_name_center)
        
        # Copy to Downloads and Artifacts
        shutil.copy(out_name_right, os.path.join(downloads_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(downloads_dir, out_name_center))
        shutil.copy(out_name_right, os.path.join(artifact_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(artifact_dir, out_name_center))
        
        print(f"Processed and copied {out_name_right} and {out_name_center}")

if __name__ == "__main__":
    create_banners()
