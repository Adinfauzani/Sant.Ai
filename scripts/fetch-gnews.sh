#!/bin/bash
set -e
API_KEY="${GNEWS_API_KEY:-99ff3aaefae1cb4d0dc5afb5b3d3b8cb}"
DIR="/tmp/santet-gnews"
mkdir -p "$DIR"

echo "=== Fetching GNews data for all keywords ==="

# Get keywords from database via a small query
KEYWORDS=$(node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(\"SELECT keyword FROM \\\"Keyword\\\" WHERE active = true LIMIT 10\")
  .then(r => { r.rows.forEach(row => console.log(row.keyword)); pool.end(); })
  .catch(e => { console.error(e); process.exit(1); });
")

echo "$KEYWORDS" | while read -r KW; do
  [ -z "$KW" ] && continue
  SAFE=$(echo "$KW" | tr ' ' '_' | tr '/' '_')
  echo ""
  echo "--- Fetching: $KW ---"
  curl -s --connect-timeout 10 --max-time 20 \
    "https://gnews.io/api/v4/search?q=$(echo "$KW" | sed 's/ /%20/g')&lang=en&max=10&apikey=$API_KEY" \
    -o "$DIR/${SAFE}.json"
  echo "  Saved to $DIR/${SAFE}.json ($(wc -c < "$DIR/${SAFE}.json") bytes)"
done

echo ""
echo "=== Processing all fetched data ==="

for f in "$DIR"/*.json; do
  [ -f "$f" ] || continue
  echo ""
  echo "Processing: $(basename "$f")"
  pnpm tsx scripts/process-gnews.ts "$f"
done

echo ""
echo "=== Done ==="
