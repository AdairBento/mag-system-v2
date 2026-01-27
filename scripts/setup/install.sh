#!/bin/bash
set -e

echo "🚀 Installing MAG System v2..."

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup Prisma
echo "🗄️ Setting up database..."
cd packages/database
pnpm prisma generate
cd ../..

echo "✅ Installation complete!"
echo "Next steps:"
echo "  1. Copy .env.example to .env"
echo "  2. Configure your database"
echo "  3. Run: pnpm db:migrate"
echo "  4. Run: pnpm dev"
