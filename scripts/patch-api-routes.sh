#!/bin/bash

# Script to add dynamic exports to all API route files

DYNAMIC_EXPORTS='// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

'

cd /home/user/Porchest-Multiportal

# Find all route.ts files in app/api
find app/api -name "route.ts" -type f | while read -r file; do
  # Check if file already has the dynamic export
  if grep -q 'export const dynamic = "force-dynamic"' "$file"; then
    echo "✓ Skipped (already patched): $file"
  else
    # Create a temporary file with the dynamic exports prepended
    echo "$DYNAMIC_EXPORTS" | cat - "$file" > temp_file && mv temp_file "$file"
    echo "✓ Patched: $file"
  fi
done

echo ""
echo "✅ All API routes have been patched!"
