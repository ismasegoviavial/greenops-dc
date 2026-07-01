from PIL import Image, ImageDraw, ImageFont
import os
import glob
import shutil

def find_latest_bg():
    files = glob.glob(r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\banner_bg_data_ai_*.png")
    if not files:
        print("No data/AI background image found!")
        return None
    latest_file = max(files, key=os.path.getctime)
    return latest_file

def create_banners():
    bg_path = find_latest_bg()
    if not bg_path:
        return
        
    bg_img = Image.open(bg_path)
    logo_img = Image.open("logo_transparent.png")
    
    banner_w, banner_h = 1584, 396
    
    # Crop central area (y: 312 to 708) to get a 1584x396 aspect ratio after resizing
    # Wait, the source is 1024x1024. 4:1 aspect ratio means height = 1024 // 4 = 256.
    # Let's crop from y = 384 to 640.
    crops = {
        "center": (0, 384, 1024, 640),
        "upper": (0, 256, 1024, 512),
        "lower": (0, 512, 1024, 768)
    }
    
    # Scale Logo: height = 100
    logo_target_h = 100
    logo_aspect = logo_img.width / logo_img.height
    logo_target_w = int(logo_target_h * logo_aspect)
    
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_img.resize((logo_target_w, logo_target_h), resample_filter)
    
    # Load Font
    # Segoe UI is a clean professional modern sans-serif font
    font_path_bold = r"C:\Windows\Fonts\segoeui.ttf" # Fallback to default if not found
    font_path_reg = r"C:\Windows\Fonts\segoeuil.ttf" # Segoe UI Light
    if not os.path.exists(font_path_bold):
        font_path_bold = "arial.ttf"
        font_path_reg = "arial.ttf"
        
    try:
        # Standard sizes
        font_tagline = ImageFont.truetype(font_path_bold, 36)
        font_sub = ImageFont.truetype(font_path_reg, 28)
    except IOError:
        font_tagline = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    tagline_text = "Consultoría de Datos & Inteligencia Artificial"
    
    downloads_dir = "c:\\Users\\Fernanda\\Downloads"
    artifact_dir = "C:\\Users\\Fernanda\\.gemini\\antigravity-ide\\brain\\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd"
    
    for crop_name, box in crops.items():
        bg_cropped = bg_img.crop(box)
        bg_resized = bg_cropped.resize((banner_w, banner_h), resample_filter)
        
        # ----------------------------------------------------
        # Layout 1: Right-aligned (Highly Recommended for LinkedIn)
        # ----------------------------------------------------
        banner_right = bg_resized.copy()
        draw_r = ImageDraw.Draw(banner_right)
        
        # We place the logo on the right
        # Padding from right = 100
        logo_x = banner_w - logo_target_w - 100
        logo_y = 110
        banner_right.paste(logo_resized, (logo_x, logo_y), logo_resized)
        
        # We place the tagline underneath the logo, right-aligned to the same edge
        # Get width of tagline text to align it properly
        text_bbox = draw_r.textbbox((0, 0), tagline_text, font=font_tagline)
        text_w = text_bbox[2] - text_bbox[0]
        text_h = text_bbox[3] - text_bbox[1]
        
        text_x = banner_w - text_w - 100
        text_y = logo_y + logo_target_h + 25
        
        # Draw a semi-transparent subtle backing block under the text & logo for readability if needed,
        # but the background is dark and clean, so let's draw text with a soft drop shadow first
        shadow_offset = 2
        draw_r.text((text_x + shadow_offset, text_y + shadow_offset), tagline_text, font=font_tagline, fill=(0, 0, 0, 150))
        draw_r.text((text_x, text_y), tagline_text, font=font_tagline, fill=(255, 255, 255, 255))
        
        out_name_right = f"linkedin_banner_data_ai_{crop_name}_right.png"
        banner_right.save(out_name_right)
        
        # ----------------------------------------------------
        # Layout 2: Centered
        # ----------------------------------------------------
        banner_center = bg_resized.copy()
        draw_c = ImageDraw.Draw(banner_center)
        
        logo_x_c = (banner_w - logo_target_w) // 2
        logo_y_c = 110
        banner_center.paste(logo_resized, (logo_x_c, logo_y_c), logo_resized)
        
        text_bbox_c = draw_c.textbbox((0, 0), tagline_text, font=font_tagline)
        text_w_c = text_bbox_c[2] - text_bbox_c[0]
        text_x_c = (banner_w - text_w_c) // 2
        text_y_c = logo_y_c + logo_target_h + 25
        
        draw_c.text((text_x_c + shadow_offset, text_y_c + shadow_offset), tagline_text, font=font_tagline, fill=(0, 0, 0, 150))
        draw_c.text((text_x_c, text_y_c), tagline_text, font=font_tagline, fill=(255, 255, 255, 255))
        
        out_name_center = f"linkedin_banner_data_ai_{crop_name}_center.png"
        banner_center.save(out_name_center)
        
        # Copy files to Downloads and Artifact folder
        shutil.copy(out_name_right, os.path.join(downloads_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(downloads_dir, out_name_center))
        shutil.copy(out_name_right, os.path.join(artifact_dir, out_name_right))
        shutil.copy(out_name_center, os.path.join(artifact_dir, out_name_center))
        
        print(f"Processed and copied {out_name_right} and {out_name_center}")

if __name__ == "__main__":
    create_banners()
