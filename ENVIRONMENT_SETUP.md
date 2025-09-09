# Environment Setup Guide

## Email Credentials Issue Fix

The application is failing to send emails because the `.env` file is missing. Follow these steps to fix it:

### Step 1: Create .env file
Create a file named `.env` in the project root directory with the following content:

```env
# AutoHire AI - Environment Variables

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration (for sending reports)
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_16_digit_app_password_here

# Optional: Other API Keys
OPENAI_API_KEY=your_openai_api_key_here
LINKEDIN_API_KEY=your_linkedin_api_key_here
INDEED_API_KEY=your_indeed_api_key_here

# Application Configuration
FLASK_ENV=development
SECRET_KEY=autohire_ai_secret_key_2025
DEBUG=True
LOG_LEVEL=INFO
```

### Step 2: Set up Gmail App Password
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings > Security > App Passwords
3. Generate a 16-digit app password for "Mail"
4. Use this app password (not your regular Gmail password) in the `.env` file

### Step 3: Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to the `.env` file

## Job Scraping Issue Fix

The job scraping issue has been fixed by adding the missing `search_google_jobs` function to `src/web_scraper.py`. The function now includes:

- Multiple fallback methods for scraping Google Jobs
- Better error handling and logging
- Structured data extraction (JSON-LD)
- Robust CSS selector handling

## Testing the Fixes

After setting up the `.env` file, run the application:

```bash
python main.py
```

The job scraping should now work, and email sending should function properly with valid credentials.
