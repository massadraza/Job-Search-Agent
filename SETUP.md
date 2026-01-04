# Setup Guide

## For New Users Cloning This Repository

### Step 1: Get Your API Keys

You'll need to sign up for these services and get API keys:

1. **RapidAPI (JSearch API)**
   - Go to [https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
   - Sign up for a free account
   - Subscribe to the JSearch API (free tier available)
   - Copy your RapidAPI key

2. **OpenAI API**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Sign up or log in
   - Create a new API key
   - Copy your OpenAI API key

3. **Gmail App Password** (for email notifications)
   - Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### Step 2: Create Your .env File

```bash
# Copy the example file
cp .env.example .env

# Edit the file and add your keys
nano .env  # or use any text editor
```

Replace the placeholder values with your actual API keys:

```env
RAPIDAPI_KEY=your_actual_rapidapi_key
OPENAI_API_KEY=your_actual_openai_key
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
```

### Step 3: Install n8n

```bash
npm install -g n8n
```

### Step 4: Start n8n with Environment Variables

```bash
# Export environment variables and start n8n
export $(cat .env | xargs) && n8n start
```

Or, for a more permanent solution, add to your shell profile:

```bash
# Add to ~/.bashrc or ~/.zshrc
export RAPIDAPI_KEY="your_key"
export OPENAI_API_KEY="your_key"
```

### Step 5: Import the Workflow

1. Open n8n at `http://localhost:5678`
2. Go to **Workflows** → **Import from File**
3. Select `workflows/job-search-agent-enhanced.json` (recommended) or `workflows/job-search-workflow.json`
4. The workflow will import with environment variable references already configured

### Step 6: Set Up Google Sheets (Optional)

1. In n8n, go to **Credentials** → **Add Credential**
2. Select **Google Sheets OAuth2 API**
3. Follow the authentication flow
4. Create a new Google Sheet for job tracking
5. Update the Google Sheet ID in the workflow

### Step 7: Customize Your Profile

Edit these nodes in the workflow:
- **Generate Search URLs**: Update search criteria (keywords, locations)
- **AI Agent (Autonomous)**: Update your skills, experience, and preferences

### Step 8: Test the Workflow

1. Click **Execute Workflow** to run manually
2. Check for any errors
3. Verify email delivery
4. Check Google Sheets for job tracking

### Step 9: Activate for Daily Runs

1. Toggle the workflow to **Active**
2. The workflow will run automatically every 24 hours

## Troubleshooting

### Environment Variables Not Working

If the workflow can't access environment variables:

```bash
# Verify environment variables are set
echo $RAPIDAPI_KEY
echo $OPENAI_API_KEY

# Restart n8n with env vars
export $(cat .env | xargs) && n8n start
```

### API Key Errors

- Verify keys are correctly copied (no extra spaces)
- Check API quotas haven't been exceeded
- Ensure billing is set up for OpenAI

### No Jobs Found

- Check search criteria aren't too restrictive
- Verify RapidAPI subscription is active
- Try broader keywords or locations

## Security Reminders

- **NEVER commit your .env file** (it's already in .gitignore)
- **NEVER share your API keys publicly**
- **Rotate keys** if accidentally exposed
- **Monitor API usage** to avoid unexpected charges

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md) for agent capabilities
- Open an issue on GitHub for bugs or questions
