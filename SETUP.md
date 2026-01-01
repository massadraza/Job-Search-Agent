# Setup Guide

This guide will help you set up your Job Search AI Agent with n8n.

## Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **Anthropic Claude API Key** or **OpenAI API Key**
   - Sign up at [Anthropic](https://console.anthropic.com/) or [OpenAI](https://platform.openai.com/)
   - Generate an API key

## Step-by-Step Setup

### 1. Install n8n

```bash
# Install n8n globally
npm install -g n8n

# Or install locally in the project
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Required variables:
- `ANTHROPIC_API_KEY`: Your Claude API key
- `SMTP_USER` and `SMTP_PASSWORD`: For email notifications
- `EMAIL_TO`: Your email address

### 3. Customize Your Profile

#### Edit Resume (`config/resume.json`)
1. Update your personal information
2. Add your skills and experience
3. Set your career goals
4. Define work preferences

#### Edit Search Criteria (`config/search-criteria.json`)
1. Add job titles you're looking for
2. Set your preferred locations
3. Define must-have and nice-to-have skills
4. Set salary expectations
5. Add any deal breakers

### 4. Start n8n

```bash
# Start n8n
n8n start

# Or if installed locally
npm start
```

n8n will be available at `http://localhost:5678`

### 5. Import the Workflow

1. Open n8n in your browser: `http://localhost:5678`
2. Click on **"Workflows"** in the left sidebar
3. Click **"Import from File"**
4. Select `workflows/job-search-workflow.json`
5. The workflow will be imported

### 6. Configure Credentials in n8n

#### Anthropic Claude API
1. In the workflow, click on the "AI Job Analysis" node
2. Click "Create New Credential"
3. Enter your Anthropic API key
4. Save

#### Email (SMTP)
1. Click on the "Send Email Notification" node
2. Click "Create New Credential"
3. Enter your SMTP settings:
   - **Host**: smtp.gmail.com (for Gmail)
   - **Port**: 587
   - **User**: Your email
   - **Password**: App password (not your regular password)
4. Save

**Gmail App Password Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate a new app password
5. Use this password in n8n

#### Google Sheets (Optional)
1. Click on the "Save to Google Sheets" node
2. Follow n8n's OAuth flow to connect your Google account
3. Create a new spreadsheet or use an existing one
4. Copy the Sheet ID from the URL
5. Update the node configuration

### 7. Test the Workflow

1. Click the "Execute Workflow" button in n8n
2. Watch the workflow run through each node
3. Check for any errors
4. Verify you receive an email with job matches

### 8. Activate the Workflow

1. Toggle the "Active" switch at the top of the workflow
2. The workflow will now run automatically every 24 hours

## Troubleshooting

### Common Issues

#### 1. No Jobs Found
- **Solution**: Make your search criteria less restrictive
- Check if the job board websites are accessible
- Verify your keywords are not too specific

#### 2. API Key Errors
- **Solution**: Verify your API keys are correct in n8n credentials
- Check if you have sufficient API credits
- Ensure there are no extra spaces in the API key

#### 3. Email Not Sending
- **Solution**:
  - For Gmail, use an App Password, not your regular password
  - Enable "Less secure app access" (not recommended)
  - Check SMTP settings are correct
  - Verify port 587 is not blocked by firewall

#### 4. Workflow Execution Errors
- **Solution**:
  - Check n8n logs: `~/.n8n/logs/`
  - Verify all nodes are properly configured
  - Test each node individually
  - Check for rate limiting on APIs

#### 5. HTML Parsing Issues
- **Solution**:
  - Job board websites frequently change their HTML structure
  - You may need to update the parsing logic in the "Parse Job Data" node
  - Consider using official APIs instead of web scraping

### Performance Optimization

1. **Reduce API Calls**:
   - Limit the number of search queries
   - Use caching for repeated searches
   - Increase the schedule interval

2. **Improve Matching Accuracy**:
   - Refine your AI prompts
   - Adjust the match score threshold
   - Add more specific criteria

3. **Handle Rate Limiting**:
   - Add delays between requests
   - Use official APIs when available
   - Batch process jobs

## Advanced Configuration

### Using Alternative Job Sources

#### 1. Add LinkedIn API
```javascript
// In the "Generate Search URLs" node
const linkedInApiUrl = `https://api.linkedin.com/v2/jobSearch?keywords=${keyword}`;
```

#### 2. Add Indeed API
```javascript
const indeedApiUrl = `https://api.indeed.com/ads/apisearch?q=${keyword}&l=${location}`;
```

### Custom AI Prompts

Edit the AI Job Analysis node prompt to focus on specific criteria:
- Technical skill matching
- Company culture fit
- Career growth opportunities
- Work-life balance indicators

### Multiple Notification Channels

#### Add Slack Notifications
1. Create a Slack webhook URL
2. Add a Slack node after the "Filter High Matches" node
3. Configure the message format

#### Add Discord Notifications
1. Create a Discord webhook
2. Add an HTTP Request node
3. Send formatted job matches to Discord

### Database Storage

Instead of Google Sheets, use a database:
1. Add a Postgres/MySQL node
2. Create a jobs table
3. Store all matched jobs for tracking

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Use app passwords** for email, not account passwords
5. **Limit workflow execution** to prevent excessive API usage

## Next Steps

1. Run the workflow daily for a week
2. Adjust criteria based on results
3. Fine-tune the AI prompts
4. Add more job sources
5. Track your applications

## Getting Help

- n8n Documentation: https://docs.n8n.io/
- n8n Community: https://community.n8n.io/
- Anthropic Documentation: https://docs.anthropic.com/

## Tips for Best Results

1. **Start broad**: Begin with less restrictive criteria
2. **Iterate**: Adjust based on the quality of matches
3. **Be specific in resume**: The AI uses your resume for matching
4. **Update regularly**: Keep your resume and criteria current
5. **Review false positives**: Use them to refine criteria
