#!/bin/bash
set -euo pipefail 
read -p "Enter commit message: " message

rm -rf node_modules
rm -rf package-lock.json
npm install

echo "Committing new changes"
USER_NAME="natalio-f-gomes"
USER_EMAIL="natalio.f.gomes@proton.me"

# Get current git config values
current_name=$(git config --global user.name)
current_email=$(git config --global user.email)

# Only set if different from desired values
if [ "$current_name" != "$USER_NAME" ]; then
    git config --global user.name "$USER_NAME"
    echo "Updated git user.name to: $USER_EMAIL"
fi

if [ "$current_email" != "$USER_EMAIL" ]; then
    git config --global user.email "$USER_EMAIL"
    echo "Updated git user.email to: $USER_EMAIL"
fi

if [ ! -d .git ]; then
  git init -b main
  echo "Initialized new repo — remember: git remote add origin <url>"
fi
dupes=$(git ls-files | sort -f | uniq -di || true)
if [ -n "$dupes" ]; then
  echo "WARNING: case-conflicting tracked files detected:"
  echo "$dupes"
fi
git config core.ignorecase false
git add .
git status --short        
git commit -m "$message"
git push -u origin artisan
