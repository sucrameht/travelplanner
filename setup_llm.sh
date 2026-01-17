#!/bin/bash

# Quick Setup Script for LLM Integration
# Run this after getting your API key

echo "🚀 Travel Planner LLM Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✓ .env file already exists"
else
    echo "Creating .env file..."
    touch .env
fi

echo ""
echo "Choose your LLM provider:"
echo "1) Anthropic Claude (Recommended - ✅ Currently Active)"
echo "2) Ollama (100% Free - runs locally)"
echo "3) Skip LLM setup (use smart fallback)"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "📝 Setting up Anthropic Claude (Primary LLM)..."
        echo ""
        echo "Steps to get your API key:"
        echo "1. Go to: https://console.anthropic.com/"
        echo "2. Sign up (free trial available)"
        echo "3. Go to: https://console.anthropic.com/settings/keys"
        echo "4. Click 'Create Key'"
        echo "5. Copy the key (starts with sk-ant-)"
        echo ""
        read -p "Paste your Anthropic API key: " api_key
        
        if grep -q "ANTHROPIC_API_KEY" .env; then
            sed -i '' "s/ANTHROPIC_API_KEY=.*/ANTHROPIC_API_KEY=$api_key/" .env
        else
            echo "ANTHROPIC_API_KEY=$api_key" >> .env
        fi
        
        pip install anthropic python-dotenv
        
        echo ""
        echo "✅ Claude setup complete!"
        echo "🎉 Using Claude 3 Sonnet model"
        echo "💡 Restart your backend server to activate"
        ;;
    2)
        echo ""
        echo "📝 Setting up Ollama (Local LLM - 100% Free)..."
        echo ""
        echo "Steps:"
        echo "1. Download: https://ollama.ai/download"
        echo "2. Install Ollama"
        echo "3. Run: ollama pull llama3.2"
        echo ""
        echo "After installation, Ollama runs in the background."
        echo "No API key needed - everything runs locally!"
        echo "The app will automatically detect and use it."
        echo ""
        echo "✅ Ollama instructions provided!"
        echo "Run 'ollama pull llama3.2' after installing."
        ;;
    3)
        echo ""
        echo "✅ Using smart fallback system (no LLM needed)"
        echo "💡 Context-aware suggestions based on destination type"
        ;;
esac

echo ""
echo "=============================="
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Start backend: python manage.py runserver"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Click the refresh icon in Suggested Events to test!"
echo ""
