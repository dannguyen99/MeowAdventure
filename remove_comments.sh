#!/bin/bash

# Script to remove comments from HTML, CSS, and JavaScript files.
# WARNING: Modifies files in-place. Backup your repository first!

# Ensure Perl is installed
if ! command -v perl &> /dev/null; then
    echo "Error: perl is not installed. This script requires perl." >&2
    exit 1
fi

echo "Starting comment removal process..."
echo "IMPORTANT: This script modifies files in-place."
echo "Please ensure your repository is backed up or committed before proceeding."
# Add a small pause for the user to read the warning, or ask for confirmation.
# read -p "Press Enter to continue or Ctrl+C to abort..."

# Directories to exclude from processing
EXCLUDE_DIRS=(".git" "node_modules" "vendor" "dist" "build") # Add any other dirs like 'dist', 'build'

FIND_EXCLUDES_ARGS=()
for dir in "${EXCLUDE_DIRS[@]}"; do
  FIND_EXCLUDES_ARGS+=(-name "$dir" -prune -o)
done

# --- Process HTML files ---
echo "Processing HTML files (.html, .htm)..."
find . "${FIND_EXCLUDES_ARGS[@]}" \( -name "*.html" -o -name "*.htm" \) -type f -print0 | while IFS= read -r -d $'\0' file; do
  echo "  Removing HTML comments from: $file"
  # Remove <!-- ... --> comments.
  # -0777 slurps the whole file.
  # s/<!--.*?-->//sg: non-greedy (?), dot matches newline (s), global (g).
  perl -0777 -i -pe 's/<!--.*?-->//sg' "$file"
done

# --- Process CSS files ---
echo "Processing CSS files (.css)..."
find . "${FIND_EXCLUDES_ARGS[@]}" -name "*.css" -type f -print0 | while IFS= read -r -d $'\0' file; do
  echo "  Removing CSS comments from: $file"
  # Remove /* ... */ comments.
  # s#/\*.*?\*/##sg: non-greedy (?), dot matches newline (s), global (g). Using # as delimiter.
  perl -0777 -i -pe 's#/\*.*?\*/##sg' "$file"
done

# --- Process JavaScript files ---
echo "Processing JavaScript files (.js)..."
find . "${FIND_EXCLUDES_ARGS[@]}" -name "*.js" -type f -print0 | while IFS= read -r -d $'\0' file; do
  echo "  Removing JS comments from: $file"
  # First, remove /* ... */ block comments (handles multi-line).
  perl -0777 -i -pe 's#/\*.*?\*/##sg' "$file"
  # Then, remove // single-line comments.
  # The (?<!:) lookbehind attempts to prevent matching // in URLs like http://
  # This is processed line by line by default with `perl -i -pe`.
  perl -i -pe 's#(?<!:)//.*##g' "$file"
done

echo ""
echo "Comment removal process finished."
echo "--------------------------------------------------------------------"
echo "IMPORTANT: Review all changes carefully using 'git diff' or similar."
echo "Verify that no code or string literals were unintentionally altered."
echo "--------------------------------------------------------------------"