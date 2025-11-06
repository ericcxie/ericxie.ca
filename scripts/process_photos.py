#!/usr/bin/env python3

import os
import json
from PIL import Image
from PIL.ExifTags import TAGS
from pathlib import Path
from datetime import datetime
import re


def extract_date_from_exif(image_path):
    """Extract date from EXIF data (actual photo date from camera)"""
    try:
        with Image.open(image_path) as image:
            exifdata = image.getexif()

            # Try different date fields in order of preference
            date_fields = ['DateTimeOriginal', 'DateTime', 'DateTimeDigitized']

            for field in date_fields:
                for tag_id in exifdata:
                    tag = TAGS.get(tag_id, tag_id)
                    if tag == field:
                        date_str = exifdata.get(tag_id)
                        if date_str:
                            try:
                                # Parse EXIF date format: "YYYY:MM:DD HH:MM:SS"
                                return datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
                            except ValueError:
                                continue

        return None
    except Exception as e:
        print(f"⚠️  Error reading EXIF from {image_path.name}: {e}")
        return None


def extract_date_from_filename(filename):
    """Extract date from filename patterns"""
    # Common patterns: YYYY-MM-DD, YYYYMMDD, IMG_YYYYMMDD, etc.
    patterns = [
        r'(\d{4})-(\d{2})-(\d{2})',  # 2024-03-15
        r'(\d{4})(\d{2})(\d{2})',    # 20240315
        r'IMG_(\d{4})(\d{2})(\d{2})',  # IMG_20240315
        r'(\d{4})_(\d{2})_(\d{2})',  # 2024_03_15
    ]

    for pattern in patterns:
        match = re.search(pattern, filename)
        if match:
            try:
                if len(match.groups()) == 3:
                    year, month, day = match.groups()
                    return datetime(int(year), int(month), int(day))
            except ValueError:
                continue

    return None


def get_file_creation_date(file_path):
    """Get file creation/modification date as fallback"""
    try:
        stat = os.stat(file_path)
        # Use the earlier of creation time or modification time
        timestamp = min(stat.st_ctime, stat.st_mtime)
        return datetime.fromtimestamp(timestamp)
    except:
        return datetime.now()


def convert_to_webp(source_path, target_path, quality=85):
    """Convert image to WebP format with optimization and proper orientation"""
    try:
        with Image.open(source_path) as img:
            # Handle EXIF orientation to prevent rotation issues
            try:
                # Get EXIF data
                exif = img.getexif()
                # Check for orientation tag (274)
                if 274 in exif:
                    orientation = exif[274]
                    # Apply rotation based on EXIF orientation
                    if orientation == 3:
                        img = img.rotate(180, expand=True)
                    elif orientation == 6:
                        img = img.rotate(270, expand=True)
                    elif orientation == 8:
                        img = img.rotate(90, expand=True)
            except Exception:
                # If EXIF handling fails, continue without rotation correction
                pass

            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()
                                 [-1] if img.mode == 'RGBA' else None)
                img = background

            # Save with optimization
            img.save(target_path, 'webp', quality=quality,
                     optimize=True, method=6)
            return True
    except Exception as e:
        print(f"❌ Error converting {source_path.name}: {e}")
        return False


def to_pascal_case(filename):
    """Convert filename to PascalCase for exports"""
    base = Path(filename).stem
    # Remove common prefixes and clean up
    base = re.sub(r'^(IMG_|DSC_|P|img)', '', base, flags=re.IGNORECASE)
    # Split on various separators and convert to PascalCase
    parts = re.split(r'[-_\s]+', base)

    if not parts or all(part.isdigit() for part in parts):
        # Fallback for numeric or empty names
        return f"Photo{base.replace('-', '').replace('_', '')}"

    return ''.join(word.capitalize() for word in parts if word)


def format_bytes(bytes_size):
    """Format bytes to human readable string"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f}{unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f}TB"


def process_photos():
    """Main processing function"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    photos_dir = project_root / 'public' / 'img' / 'photos'

    # Ensure directories exist
    photos_dir.mkdir(parents=True, exist_ok=True)

    # Supported input formats
    input_formats = {'.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'}

    photos_data = []
    converted_count = 0
    total_original_size = 0
    total_webp_size = 0

    print("🔍 Scanning for photos...")

    # Get all image files
    image_files = [f for f in photos_dir.iterdir()
                   if f.is_file() and f.suffix.lower() in input_formats]

    print(f"📸 Found {len(image_files)} photos")

    for file_path in image_files:
        original_size = file_path.stat().st_size
        total_original_size += original_size

        # Extract date BEFORE conversion (from original file) to preserve EXIF data
        photo_date = extract_date_from_exif(file_path)
        date_source = "EXIF"

        if not photo_date:
            photo_date = extract_date_from_filename(file_path.name)
            date_source = "filename"

        if not photo_date:
            photo_date = get_file_creation_date(file_path)
            date_source = "file"

        # Handle WebP conversion
        if file_path.suffix.lower() == '.webp':
            webp_path = file_path
            webp_size = original_size
            total_webp_size += webp_size
        else:
            # Convert to WebP
            webp_path = file_path.with_suffix('.webp')

            print(f"📦 Converting {file_path.name} to WebP...")

            if convert_to_webp(file_path, webp_path):
                webp_size = webp_path.stat().st_size
                total_webp_size += webp_size
                savings = ((original_size - webp_size) / original_size) * 100
                print(
                    f"   ✅ Saved {format_bytes(original_size - webp_size)} ({savings:.1f}%)")
                print(
                    f"   📅 Date: {photo_date.strftime('%Y-%m-%d %H:%M')} (from {date_source})")

                # Remove original file
                file_path.unlink()
                converted_count += 1
            else:
                # Keep original if conversion failed
                webp_path = file_path
                webp_size = original_size
                total_webp_size += webp_size

        # Generate export name
        export_name = to_pascal_case(webp_path.name)

        photos_data.append({
            'filename': webp_path.name,
            'exportName': export_name,
            'date': photo_date.isoformat(),
            'timestamp': photo_date.timestamp()
        })

    # Sort by date (newest first)
    photos_data.sort(key=lambda x: x['timestamp'], reverse=True)

    # Generate output files
    generate_index_file(photos_data, project_root)
    generate_photos_data(photos_data, project_root)

    # Summary
    print(f"\n✅ Processed {len(photos_data)} photos")
    if converted_count > 0:
        total_savings = total_original_size - total_webp_size
        savings_percent = (total_savings / total_original_size) * 100
        print(f"📦 Converted {converted_count} images to WebP")
        print(
            f"💾 Total savings: {format_bytes(total_savings)} ({savings_percent:.1f}%)")
    print("🎯 Photos sorted by date (newest first)")

    # Show import statement
    import_names = [photo['exportName'] for photo in photos_data]
    print(f"\n📋 Import statement for photos page:")
    print(f"import {{\n  {',\\n  '.join(import_names)}\n}} from \"../../../public/img\";")


def generate_index_file(photos_data, project_root):
    """Generate the index.ts file with exports"""
    index_path = project_root / 'public' / 'img' / 'index.ts'

    # Generate exports
    exports = []
    for photo in photos_data:
        exports.append(
            f'export {{ default as {photo["exportName"]} }} from "./photos/{photo["filename"]}";')

    content = '\n'.join(exports) + '\n'

    with open(index_path, 'w') as f:
        f.write(content)

    print(f"✅ Generated index.ts with {len(exports)} exports")


def generate_photos_data(photos_data, project_root):
    """Generate photos data TypeScript file"""
    data_dir = project_root / 'src' / 'content' / 'photos'
    data_dir.mkdir(parents=True, exist_ok=True)
    data_path = data_dir / 'photos.ts'

    # Load existing location data to preserve manual edits
    existing_locations = {}
    if data_path.exists():
        try:
            with open(data_path, 'r') as f:
                content = f.read()
            
            # Extract existing data - handle both quoted and unquoted JSON
            import re
            array_match = re.search(r'export const photosData: PhotoData\[\] = (\[[\s\S]*?\]);', content)
            if array_match:
                array_content = array_match.group(1)
                
                # Convert unquoted keys to quoted keys for valid JSON
                # Only match property names at the start of lines (with optional whitespace)
                array_content = re.sub(r'^\s*(\w+):', r'  "\1":', array_content, flags=re.MULTILINE)
                
                try:
                    import json
                    existing_data = json.loads(array_content)
                    existing_locations = {photo['filename']: photo.get('location', '') for photo in existing_data}
                    
                    # Show what's being preserved vs removed
                    current_filenames = {photo['filename'] for photo in photos_data}
                    preserved_locations = {k: v for k, v in existing_locations.items() if k in current_filenames and v}
                    removed_records = {k: v for k, v in existing_locations.items() if k not in current_filenames}
                    
                    print(f"🔍 Found {len(existing_locations)} existing records")
                    if preserved_locations:
                        print(f"📍 Preserved {len(preserved_locations)} existing locations")
                        # Show a few examples
                        for filename, location in list(preserved_locations.items())[:3]:
                            print(f"   • {filename} → {location}")
                    if removed_records:
                        print(f"🗑️  Removed {len(removed_records)} records for deleted photos")
                        
                except json.JSONDecodeError as je:
                    print(f"⚠️  JSON parsing error: {je}")
                    print(f"   First 200 chars: {array_content[:200]}")
                    
        except Exception as e:
            print(f"⚠️  Could not load existing locations: {e}")

    # Remove timestamp from exported data and preserve locations for existing files only
    clean_data = []
    for photo in photos_data:
        clean_photo = {k: v for k, v in photo.items() if k != 'timestamp'}
        # Preserve existing location if it exists, otherwise use empty string
        existing_location = existing_locations.get(photo['filename'], '')
        clean_photo['location'] = existing_location
        
        # Debug: show what we're doing for first few photos
        if len(clean_data) < 3 and existing_location:
            print(f"   🔄 {photo['filename']} → keeping location: '{existing_location}'")
        
        clean_data.append(clean_photo)

    # Create TypeScript content
    content = f'''// Auto-generated photos data - DO NOT EDIT MANUALLY
// Run 'python3 scripts/process_photos.py' to regenerate

export interface PhotoData {{
  filename: string;
  exportName: string;
  date: string;
  location: string;
}}

export const photosData: PhotoData[] = {json.dumps(clean_data, indent=2)};

// Get photos sorted by date (newest first) - already sorted in data
export function getPhotosSortedByDate(): PhotoData[] {{
  return [...photosData];
}}

// Get photos from a specific year
export function getPhotosByYear(year: number): PhotoData[] {{
  return photosData.filter(photo => new Date(photo.date).getFullYear() === year);
}}

// Get available years
export function getAvailableYears(): number[] {{
  const years = new Set(photosData.map(photo => new Date(photo.date).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}}

// Get photos from a specific month
export function getPhotosByMonth(year: number, month: number): PhotoData[] {{
  return photosData.filter(photo => {{
    const date = new Date(photo.date);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  }});
}}
'''

    with open(data_path, 'w') as f:
        f.write(content)

    print(f"✅ Generated photos.ts with {len(clean_data)} photos")


if __name__ == "__main__":
    process_photos()
