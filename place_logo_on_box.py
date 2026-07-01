from PIL import Image
import os
import shutil

def place_logo_on_box():
    box_path = r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\original_box.png"
    logo_path = r"C:\Users\Fernanda\Downloads\LA TREVE\LA TREVE\APLICACIONES\MARCA 1\MARCA WHITE RED BG.png"
    
    box_img = Image.open(box_path).convert("RGBA")
    logo_img = Image.open(logo_path).convert("RGBA")
    
    # Bounding box of the box is: x_min=108, y_min=265, x_max=664, y_max=597
    x_max = 664
    y_max = 597
    
    # Logo target size
    logo_size = 100
    try:
        resample_filter = Image.Resampling.LANCZOS
    except AttributeError:
        resample_filter = Image.LANCZOS
        
    logo_resized = logo_img.resize((logo_size, logo_size), resample_filter)
    
    # Paste position (bottom right of the box face, leaving some margin)
    # Let's align it near the bottom right corner of the box
    # x = x_max - logo_size - 40
    # y = y_max - logo_size - 35
    paste_x = x_max - logo_size - 40
    paste_y = y_max - logo_size - 35
    
    # Create copy and paste the logo
    final_img = box_img.copy()
    final_img.alpha_composite(logo_resized, (paste_x, paste_y))
    
    # Save the output to Downloads and Artifact folder
    output_downloads = r"C:\Users\Fernanda\Downloads\Caja-de-carton-auto-armable-medidas-25x15x15-2_mod.png"
    output_artifact = r"C:\Users\Fernanda\.gemini\antigravity-ide\brain\5cdb5fe8-ecf2-4295-aa26-00ec80f166fd\Caja-de-carton-auto-armable-medidas-25x15x15-2_mod.png"
    
    final_img.save(output_downloads, "PNG")
    final_img.save(output_artifact, "PNG")
    
    print(f"Successfully pasted logo on box and saved to {output_downloads} and artifact folder.")

if __name__ == "__main__":
    place_logo_on_box()
