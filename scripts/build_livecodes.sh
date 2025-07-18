#!/bin/bash

set -euo pipefail

# get the path to the root of the repository
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# create a temporary directory
TEMP_DIR="$ROOT_DIR/.temp_livecodes"
mkdir -p "$TEMP_DIR"
rm -rf "$TEMP_DIR/*"

# fetch and build livecodes
cd "$TEMP_DIR"
curl -L "https://github.com/live-codes/livecodes/archive/refs/tags/v46.tar.gz" | tar xz --strip-components=1
npm install
BASE_URL="/playground/livecodes/" SELF_HOSTED="true" npm run build

# copy the built files to the root directory
mv build "$ROOT_DIR/docs/livecodes"

# clean up the temporary directory
cd "$ROOT_DIR"
rm -rf "$TEMP_DIR"
