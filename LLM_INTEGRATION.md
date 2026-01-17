# LLM Integration for Event Suggestions - Setup Guide

## Option 1: Anthropic Claude (Recommended - ✅ Currently Active)

Anthropic Claude is the **primary LLM provider** for this application. It generates intelligent, context-aware travel suggestions.

### Setup Steps:

1. **Get API Key**:
   - Go to https://console.anthropic.com/
   - Sign up (free credits available)
   - Go to https://console.anthropic.com/settings/keys
   - Click "Create Key"
   - Copy your key (starts with `sk-ant-`)

2. **Install the package** (already installed):
```bash
pip install anthropic python-dotenv
```

3. **Set your API key** (choose one method):

**Method A - .env file (recommended):**
```bash
# Create/edit .env file in project root
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env
```

**Method B - Terminal (temporary, for testing):**
```bash
export ANTHROPIC_API_KEY='sk-ant-your-key-here'
python manage.py runserver
```

4. **Restart your backend server** and you're done! 🎉

### Model Used:
- **claude-sonnet-4-5** (Claude 4-5 Sonnet)
- Optimized for speed and quality
- Great for generating creative travel suggestions

---

## Option 2: OpenAI GPT (Alternative)

OpenAI gives new accounts **$5 in free credits**.

1. **Sign up**: https://platform.openai.com/signup
2. **Get API key**: https://platform.openai.com/api-keys
3. **Install**: `pip install openai`
4. **Set key**: Add `OPENAI_API_KEY=sk-...` to .env

**Note**: OpenAI support has been removed in favor of Claude.

---

3. **It works automatically!** No configuration needed - the code will detect Ollama running locally

---

## Quick Start (Using Claude)

1. Get your Claude API key from https://console.anthropic.com/settings/keys
2. Add it to your `.env` file: `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart backend: `python manage.py runserver`
4. Test it! Click the refresh icon in "Suggested Activities" on any trip

---

## Cost Estimate

**Claude Pricing:**
- Each event generation: ~$0.003-0.005 (less than 1 cent)
- Free trial credits: Perfect for development!
- Production: Very affordable for typical usage

**Smart Fallback:**
The app includes an intelligent fallback system that works **without any API key**. It detects destination types (beach, mountain, city) and provides relevant suggestions automatically.
