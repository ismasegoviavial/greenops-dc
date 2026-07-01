from PIL import Image, ImageOps, ImageFilter
import numpy as np

def tint_pixel(pixel, target_color):
    """Tints a single RGB pixel to target_color while preserving luminance."""
    r, g, b = pixel
    # Calculate luminance (ITU-R BT.601)
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    
    # Target color components
    tr, tg, tb = target_color
    t_lum = 0.299 * tr + 0.587 * tg + 0.114 * tb
    
    # Scale target color to match source luminance
    if t_lum > 0:
        factor = lum / t_lum
        nr = min(255, int(tr * factor))
        ng = min(255, int(tg * factor))
        nb = min(255, int(tb * factor))
        return (nr, ng, nb)
    else:
        return (0, 0, 0)

def process_label():
    label_path = r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497.jpg"
    logo_path = r"C:\Users\Fernanda\Downloads\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE RED BG.png"
    
    label_img = Image.open(label_path).convert("RGB")
    logo_img = Image.open(logo_path).convert("RGBA")
    
    # Target color: HEX #7E212A -> RGB (126, 33, 42)
    target_color = (126, 33, 42)
    
    # 1. Segment the tag body to apply tint
    data = np.array(label_img)
    h, w, c = data.shape
    
    # Create mask for brown/tan colors (leather tag body, including texture)
    r, g, b = data[:,:,0].astype(float), data[:,:,1].astype(float), data[:,:,2].astype(float)
    # Tighter mask to include dark brown/black details/stitching in the tag but exclude the background
    # Background is grey-green (#666962).
    # Leather tag is warm (R > B + 8 and G > B).
    tag_mask = (r > 70) & (r - b > 5) & (g - b > 0)
    
    # Let's apply tint to the tag mask
    tinted_data = data.copy()
    for y in range(h):
        for x in range(w):
            if tag_mask[y, x]:
                tinted_data[y, x] = tint_pixel(data[y, x], target_color)
                
    tinted_img = Image.fromarray(tinted_data)
    
    # 2. Extract and prepare the logo
    # MARCA WHITE RED BG.png has white logo (#ffffff) on red background (#7e212a)
    logo_np = np.array(logo_img)
    lr, lg, lb, la = logo_np[:,:,0], logo_np[:,:,1], logo_np[:,:,2], logo_np[:,:,3]
    
    # White pixels are logo
    logo_mask = (lr > 200) & (lg > 200) & (lb > 200)
    
    # Create a new transparent image for the logo
    extracted_logo = np.zeros_like(logo_np)
    extracted_logo[logo_mask] = [255, 255, 255, 255] # White logo with full opacity
    
    logo_extracted_img = Image.fromarray(extracted_logo, "RGBA")
    
    # 3. Paste the logo on the tag
    # Let's find the bounding box of the tag to center the logo in it
    coords = np.argwhere(tag_mask)
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)
    
    tag_center_x = (x_min + x_max) // 2
    tag_center_y = (y_min + y_max) // 2
    tag_width = x_max - x_min
    tag_height = y_max - y_min
    
    # We want the logo to be centered on the tag and sized appropriately
    # Let's make the logo width about 50% of the tag width
    logo_target_w = int(tag_width * 0.45)
    logo_target_h = int(logo_target_w * (logo_extracted_img.height / logo_extracted_img.width))
    
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_extracted_img.resize((logo_target_w, logo_target_h), resample_filter)
    
    # Position to paste (centered)
    paste_x = tag_center_x - logo_target_w // 2
    paste_y = tag_center_y - logo_target_h // 2
    
    # Paste logo onto the tinted image
    final_img = tinted_img.copy()
    final_img.paste(logo_resized, (paste_x, paste_y), logo_resized)
    
    # Save the result in the Downloads folder and artifact folder
    output_downloads = r"C:\Users\Fernanda\Downloads\0eba0dd8b8f5749f694bcf61b3001497_mod.jpg"
    output_artifact = r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\0eba0dd8b8f5749f694bcf61b3001497_mod.jpg"
    
    final_img.save(output_downloads, "JPEG", quality=95)
    final_img.save(output_artifact, "JPEG", quality=95)
    
    print(f"Successfully processed label and saved to {output_downloads} and artifact folder.")

if __name__ == "__main__":
    process_label()
