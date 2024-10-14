import os

# Define the directory to search in
docs_dir = os.path.join(os.getcwd(), 'docs')

# Define the output file
output_file = 'combined_mdx_content.txt'

# Create a list to hold the content of all .mdx files
mdx_content = []

# Walk through the docs directory and its subdirectories
for root, dirs, files in os.walk(docs_dir):
    for file in files:
        if file.endswith('.mdx'):
            # Get the full path of the .mdx file
            file_path = os.path.join(root, file)
            # Open and read the content of the .mdx file
            with open(file_path, 'r', encoding='utf-8') as f:
                mdx_content.append(f.read())

# Combine all the content into a single string
combined_content = "\n\n".join(mdx_content)

# Write the combined content to the output file
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(combined_content)

print(f"Combined content of all .mdx files has been written to {output_file}")
