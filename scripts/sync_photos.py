#!/usr/bin/env python3

import json
import re
from pathlib import Path


def sync_photos():
    """Detect deleted photos and clean up references"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    photos_dir = project_root / 'public' / 'img' / 'photos'
    photos_ts = project_root / 'src' / 'content' / 'photos' / 'photos.ts'
    index_ts = project_root / 'public' / 'img' / 'index.ts'

    # Get current files in directory
    current_files = set()
    if photos_dir.exists():
        for file_path in photos_dir.iterdir():
            if file_path.is_file() and file_path.suffix.lower() in {'.webp', '.jpg', '.jpeg', '.png', '.tiff', '.bmp'}:
                current_files.add(file_path.name)

    if not photos_ts.exists():
        print("❌ photos.ts not found. Run 'python3 scripts/process_photos.py' first.")
        return False

    # Read photos.ts
    try:
        with open(photos_ts, 'r') as f:
            photos_content = f.read()
    except Exception as e:
        print(f"❌ Error reading photos.ts: {e}")
        return False

    # Extract the array from photos.ts
    array_match = re.search(
        r'export const photosData: PhotoData\[\] = (\[[\s\S]*?\]);', photos_content)
    if not array_match:
        print("❌ Could not parse photos.ts")
        return False

    array_content = array_match.group(1)

    # Parse JSON - handle both quoted and unquoted keys
    try:
        photos_data = json.loads(array_content)
    except json.JSONDecodeError:
        # Convert unquoted keys to quoted
        array_content_fixed = re.sub(
            r'^\s*(\w+):', r'  "\1":', array_content, flags=re.MULTILINE)
        # Remove trailing commas (JSON doesn't allow them)
        array_content_fixed = re.sub(
            r',(\s*[}\]])', r'\1', array_content_fixed)
        try:
            photos_data = json.loads(array_content_fixed)
        except json.JSONDecodeError as e:
            print(f"❌ Could not parse photos.ts: {e}")
            return False

    # Find deleted photos
    deleted_photos = [
        photo for photo in photos_data if photo['filename'] not in current_files]

    if not deleted_photos:
        print("✅ No deleted photos found - everything is in sync!")
        return True

    # Show what will be removed
    print(f"🗑️  Found {len(deleted_photos)} deleted photo(s):")
    for photo in deleted_photos:
        print(f"   - {photo['filename']} (export: {photo['exportName']})")

    # Ask for confirmation
    confirm = input(
        f"\n🗑️  Remove {len(deleted_photos)} deleted photo entry/entries? (Y/n): ").strip().lower()
    if confirm not in ('', 'y', 'yes'):
        print("❌ Sync cancelled.")
        return False

    # Remove deleted entries from photos_data
    photos_data = [
        photo for photo in photos_data if photo['filename'] in current_files]

    # Rebuild photos.ts with remaining entries
    # Preserve formatting style (quoted vs unquoted keys)
    has_quoted_keys = '"filename"' in array_content

    if has_quoted_keys:
        photos_json = json.dumps(photos_data, indent=2)
    else:
        photos_json = json.dumps(photos_data, indent=2)
        # Convert quoted keys back to unquoted
        photos_json = re.sub(r'"(\w+)":', r'\1:', photos_json)

    # Reconstruct photos.ts
    before_array = photos_content[:array_match.start(1)]
    after_array = photos_content[array_match.end(1):]
    new_photos_content = before_array + photos_json + after_array

    # Write photos.ts
    try:
        with open(photos_ts, 'w') as f:
            f.write(new_photos_content)
        print(f"✅ Removed {len(deleted_photos)} entries from photos.ts")
    except Exception as e:
        print(f"❌ Error writing photos.ts: {e}")
        return False

    # Update index.ts to remove exports
    if index_ts.exists():
        try:
            with open(index_ts, 'r') as f:
                index_content = f.read()

            # Remove export lines for deleted photos
            for photo in deleted_photos:
                export_name = photo['exportName']
                filename = photo['filename']
                # Match export line (handles various whitespace)
                pattern = rf'export\s*{{\s*default\s+as\s+{re.escape(export_name)}\s*}}\s+from\s+"\./photos/{re.escape(filename)}";\s*\n?'
                index_content = re.sub(pattern, '', index_content)

            with open(index_ts, 'w') as f:
                f.write(index_content)
            print(f"✅ Removed {len(deleted_photos)} exports from index.ts")
        except Exception as e:
            print(f"⚠️  Could not update index.ts: {e}")

    print(f"📊 Remaining photos: {len(photos_data)}")
    return True


def quick_check():
    """Quick check without making changes"""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    photos_dir = project_root / 'public' / 'img' / 'photos'
    photos_ts = project_root / 'src' / 'content' / 'photos' / 'photos.ts'

    # Count current files
    current_count = 0
    if photos_dir.exists():
        current_count = len([f for f in photos_dir.iterdir()
                             if f.is_file() and f.suffix.lower() in {'.webp', '.jpg', '.jpeg', '.png', '.tiff', '.bmp'}])

    # Count indexed files
    indexed_count = 0
    if photos_ts.exists():
        try:
            with open(photos_ts, 'r') as f:
                content = f.read()
            array_match = re.search(
                r'export const photosData: PhotoData\[\] = (\[[\s\S]*?\]);', content)
            if array_match:
                array_content = array_match.group(1)
                # Try to parse as JSON - handle both quoted and unquoted keys
                # Use same logic as main sync_photos function
                try:
                    photos_data = json.loads(array_content)
                    indexed_count = len(photos_data)
                except json.JSONDecodeError:
                    # Convert unquoted keys to quoted
                    array_content_fixed = re.sub(
                        r'^\s*(\w+):', r'  "\1":', array_content, flags=re.MULTILINE)
                    # Remove trailing commas (JSON doesn't allow them)
                    array_content_fixed = re.sub(
                        r',(\s*[}\]])', r'\1', array_content_fixed)
                    try:
                        photos_data = json.loads(array_content_fixed)
                        indexed_count = len(photos_data)
                    except json.JSONDecodeError as e:
                        # Parsing failed - set to 0
                        indexed_count = 0
        except Exception as e:
            # Show error for debugging
            print(f"⚠️  Error reading photos.ts: {e}")

    print(f"📊 Quick Status:")
    print(f"   Photos in directory: {current_count}")
    print(f"   Photos in index: {indexed_count}")

    if current_count == indexed_count:
        print("✅ In sync!")
    else:
        diff = current_count - indexed_count
        if diff > 0:
            print(f"⚠️  Out of sync (+{diff} - new photos need processing)")
        else:
            print(f"⚠️  Out of sync ({diff} - deleted photos need cleanup)")
        print("   Run 'python3 scripts/sync_photos.py' to fix")


def main():
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == 'check':
        quick_check()
    else:
        sync_photos()


if __name__ == "__main__":
    main()
