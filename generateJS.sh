#!/bin/bash
cd views/
for file in *.mustache; do hulkster -m -t -o "${file%.*}.js" $file; done
echo "Views done";
cd partials
for file in *.mustache; do hulkster -m -t -o "${file%.*}.js" $file; done
echo "Partials done";