import os
import yaml
from datetime import datetime
import json

def parse_markdown_metadata(file_path):
    """Parses the metadata from a Markdown file's front matter."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Extract front matter (metadata)
    front_matter = None
    if content.startswith('---'):
        end_of_front_matter = content.find('---', 3)  # Locate the ending '---'
        front_matter = content[3:end_of_front_matter].strip()  # Extract the front matter

    metadata = {}
    if front_matter:
        # Parse YAML metadata
        metadata = yaml.safe_load(front_matter)

        # Convert date to YYYY-MM-DD format
        if 'date' in metadata:
            try:
                metadata['date'] = datetime.strptime(metadata['date'], "%Y-%m-%d").strftime("%Y-%m-%d")
            except ValueError:
                metadata['date'] = None  # Set to None if the date format is invalid

        # Convert tags into a list
        if 'tags' in metadata and isinstance(metadata['tags'], str):
            metadata['tags'] = [tag.strip() for tag in metadata['tags'].split(',')]

        # Add file path (without extension)
        metadata['path'] = os.path.splitext(os.path.basename(file_path))[0]

    # Calculate estimated read time
    metadata['readTime'] = calculate_read_time(content)

    return metadata

import re

def calculate_read_time(content):
    """Estimates read time based on word count (200 WPM) for English 
    and character count (500 CPM) for Chinese."""
    
    words_per_minute = 200  # English: words per minute
    chars_per_minute = 600  # Chinese: characters per minute
    
    # Count English words
    english_words = re.findall(r'\b\w+\b', content)
    
    # Count Chinese characters (excluding punctuation)
    chinese_chars = re.findall(r'[\u4e00-\u9fff]', content)

    # Estimate read time separately for English and Chinese
    read_time_english = len(english_words) / words_per_minute
    read_time_chinese = len(chinese_chars) / chars_per_minute
    
    # Total read time (rounding up)
    total_read_time = max(1, round(read_time_english + read_time_chinese))
    
    return total_read_time


def save_metadata_to_json(metadata_list, output_path):
    """Saves metadata list to a JSON file."""
    with open(output_path, 'w', encoding='utf-8') as json_file:
        json.dump(metadata_list, json_file, indent=4, ensure_ascii=False)

def get_markdown_files(directory):
    """Retrieves all Markdown files from the specified directory."""
    markdown_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".md"):
                markdown_files.append(os.path.join(root, file))
    return markdown_files

def process_folder(folder_name, directory, output_folder):
    """Processes all Markdown files in a folder and generates metadata JSON."""
    # Get all markdown files in the directory
    markdown_files = get_markdown_files(directory)

    # Store metadata from all files
    all_metadata = []
    for markdown_file in markdown_files:
        metadata = parse_markdown_metadata(markdown_file)
        if metadata:  # Only add if metadata exists
            all_metadata.append(metadata)

    # Output metadata to a JSON file
    output_json = os.path.join(output_folder, f"{folder_name}_metadata.json")
    save_metadata_to_json(all_metadata, output_json)
    print(f"Metadata for {folder_name} saved to {output_json}")

if __name__ == "__main__":
    # Define input and output directories
    input_root_directory = "../public/article"  # Root directory path
    output_folder = "../public/metadata"  # Output folder for JSON files

    # Process folders: life, program, travel, leetcode
    for folder_name in ["life", "program", "travel", "leetcode"]:
        directory = os.path.join(input_root_directory, folder_name)
        process_folder(folder_name, directory, output_folder)

    print("All metadata has been processed.")
