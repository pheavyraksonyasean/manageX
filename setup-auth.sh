#!/bin/bash

echo "🚀 ManageX Authentication Setup Script"
echo "======================================"
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Skipping creation..."
else
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    
    # Generate secret
    SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    # Update secret in .env.local
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_secret_key_here/$SECRET/" .env.local
    else
        # Linux
        sed -i "s/your_secret_key_here/$SECRET/" .env.local
    fi
    
    echo "✅ .env.local created with generated secret key"
    echo ""
    echo "⚠️  IMPORTANT: Please update these values in .env.local:"
    echo "   - MONGODB_URI"
    echo "   - EMAIL_USER"
    echo "   - EMAIL_PASSWORD"
    echo "   - EMAIL_FROM_ADDRESS"
fi

echo ""
echo "📦 Checking dependencies..."

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Dependencies already installed"
else
    echo "📥 Installing dependencies..."
    npm install
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your MongoDB URI and email credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000/auth/signup to create an account"
echo ""
echo "📖 See AUTH_README.md for detailed documentation"
