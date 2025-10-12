#!/bin/bash
set -e

echo "Pulling latest changes..."
git pull

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Restarting groceryList with pm2..."
pm2 restart groceryList

echo "Release complete."
