import json
import os
import sys

# Configuration
INPUT_FILE = r'public\Data\FoodData_Central_branded_food_json_2025-04-24.json'
OUTPUT_DIR = r'public\Data\chunks'
CHUNK_SIZE = 10000  # Items per file

def split_json_file():
    print("Starting to split large JSON file...")
    print(f"Input: {INPUT_FILE}")
    print(f"Output: {OUTPUT_DIR}")
    print("This may take 10-30 minutes for a 3.1GB file...\n")
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Count total items first
    print("Counting items...")
    total_items = 0
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        # Read character by character to count objects
        bracket_count = 0
        in_string = False
        escape_next = False
        
        for char in f.read():
            if escape_next:
                escape_next = False
                continue
            if char == '\\':
                escape_next = True
                continue
            if char == '"':
                in_string = not in_string
                continue
            if not in_string:
                if char == '{':
                    if bracket_count == 0:
                        total_items += 1
                    bracket_count += 1
                elif char == '}':
                    bracket_count -= 1
    
    print(f"Found {total_items:,} items\n")
    
    # Now split into chunks
    print("Splitting into chunks...")
    chunk_index = 0
    current_chunk = []
    items_processed = 0
    
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        # Read and parse JSON array
        # Since it's too big for json.load(), we need to stream it
        buffer = ''
        bracket_count = 0
        in_string = False
        escape_next = False
        current_object = ''
        
        for char in f.read():
            if escape_next:
                current_object += char
                escape_next = False
                continue
            if char == '\\':
                current_object += char
                escape_next = True
                continue
            if char == '"':
                in_string = not in_string
                current_object += char
                continue
            
            if not in_string:
                if char == '{':
                    if bracket_count == 0:
                        current_object = '{'
                    else:
                        current_object += char
                    bracket_count += 1
                elif char == '}':
                    bracket_count -= 1
                    current_object += char
                    
                    if bracket_count == 0 and current_object:
                        try:
                            obj = json.loads(current_object)
                            current_chunk.append(obj)
                            items_processed += 1
                            
                            if len(current_chunk) >= CHUNK_SIZE:
                                save_chunk(current_chunk, chunk_index)
                                chunk_index += 1
                                current_chunk = []
                                print(f"\rProcessed {items_processed:,} / {total_items:,} items ({items_processed/total_items*100:.1f}%)", end='', flush=True)
                        except json.JSONDecodeError:
                            pass
                        current_object = ''
                elif bracket_count > 0:
                    current_object += char
            else:
                if bracket_count > 0:
                    current_object += char
    
    # Save remaining items
    if current_chunk:
        save_chunk(current_chunk, chunk_index)
        chunk_index += 1
    
    # Create index file
    index = {
        "totalChunks": chunk_index,
        "totalItems": items_processed,
        "itemsPerChunk": CHUNK_SIZE,
        "chunks": [f"branded_foods_chunk_{str(i).zfill(3)}.json" for i in range(chunk_index)]
    }
    
    with open(os.path.join(OUTPUT_DIR, 'index.json'), 'w') as f:
        json.dump(index, f, indent=2)
    
    print(f"\n\n✅ Done!")
    print(f"Split {items_processed:,} items into {chunk_index} chunks")
    print(f"Saved to: {OUTPUT_DIR}")

def save_chunk(items, index):
    filename = f"branded_foods_chunk_{str(index).zfill(3)}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2)

if __name__ == "__main__":
    try:
        split_json_file()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
