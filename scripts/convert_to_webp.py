from PIL import Image
import os
from pathlib import Path

def convert_to_webp(source_dir):
    image_formats = ('.png', '.jpg', '.jpeg', '.tiff', '.bmp')
    source_path = Path(source_dir)
    
    if not source_path.exists():
        print(f"Directory '{source_dir}' does not exist!")
        return
    
    converted = 0
    original_size_total = 0
    webp_size_total = 0
    
    for image_path in source_path.glob('**/*'):
        if image_path.is_file() and image_path.suffix.lower() in image_formats:
            try:
                original_size = image_path.stat().st_size
                original_size_total += original_size
                
                img = Image.open(image_path)
                
                webp_path = image_path.with_suffix('.webp')
                
                img.save(webp_path, 'webp', quality=85)
                img.close()
                
                webp_size = webp_path.stat().st_size
                webp_size_total += webp_size
                
                # Calculate and show savings for this image
                size_diff = original_size - webp_size
                saving_percent = (size_diff / original_size) * 100 if original_size > 0 else 0
                
                # Delete the original file
                image_path.unlink()
                
                print(f"Converted: {image_path} -> {webp_path.name}")
                print(f"   Saved: {format_bytes(size_diff)} ({saving_percent:.1f}%)")
                converted += 1
                
            except Exception as e:
                print(f"Error converting {image_path}: {str(e)}")
    
    if converted == 0:
        print("\nNo images found that need conversion.")
    else:
        # Calculate total memory saved
        total_saved = original_size_total - webp_size_total
        saving_percent = (total_saved / original_size_total) * 100 if original_size_total > 0 else 0
        
        print(f"\nConversion complete! Converted {converted} images to WebP format.")
        print(f"Original size: {format_bytes(original_size_total)}")
        print(f"WebP size: {format_bytes(webp_size_total)}")
        print(f"Total saved: {format_bytes(total_saved)} ({saving_percent:.1f}%)")

def format_bytes(size):
    """Format bytes to human-readable format (KB, MB, etc.)"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024 or unit == 'GB':
            return f"{size:.2f} {unit}"
        size /= 1024

if __name__ == "__main__":
    project_root = os.getcwd()
    
    public_dir = os.path.join(project_root, "public")
    
    if os.path.exists(public_dir):
        print(f"Scanning for images in: {public_dir}")
        convert_to_webp(public_dir)
    else:
        print(f"The public directory '{public_dir}' does not exist!")