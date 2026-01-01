# Job Search AI Agent with n8n

An intelligent job search automation system built with n8n workflows that finds, filters, and analyzes job postings using AI.

## Features

- **Multi-Platform Job Search**: Scrape jobs from LinkedIn, Indeed, and other job boards
- **AI-Powered Filtering**: Use Claude/GPT to analyze job descriptions and match to your criteria
- **Smart Notifications**: Get notified only about relevant opportunities
- **Resume Matching**: Automatically score jobs based on your resume/skills
- **Application Tracking**: Keep track of jobs you've applied to

## Prerequisites

- [n8n](https://n8n.io/) installed (self-hosted or cloud)
- API keys for:
  - Anthropic Claude API (or OpenAI GPT)
  - Job board APIs (optional, for better data)
- Node.js 18+ (for helper scripts)

## Quick Start

1. **Install n8n** (if not already installed):
```bash
npm install -g n8n
```

2. **Configure environment variables**:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Import the workflow**:
   - Open n8n at `http://localhost:5678`
   - Go to Workflows → Import from File
   - Select `workflows/job-search-workflow.json`

4. **Customize your search criteria**:
   - Edit `config/search-criteria.json` with your preferences
   - Add your resume details to `config/resume.json`

5. **Activate the workflow** in n8n

## Project Structure

```
Job Search Agent/
├── workflows/              # n8n workflow definitions
│   └── job-search-workflow.json
├── config/                 # Configuration files
│   ├── search-criteria.json
│   └── resume.json
├── scripts/               # Helper scripts
│   └── job-matcher.js
├── .env.example          # Environment variables template
└── README.md
```

## How It Works

1. **Scheduled Trigger**: Workflow runs daily (configurable)
2. **Job Scraping**: Fetches job postings from configured sources
3. **AI Analysis**: Claude/GPT analyzes each job description
4. **Matching**: Scores jobs based on your criteria and resume
5. **Filtering**: Only high-scoring jobs pass through
6. **Notification**: Sends you a digest via email/Slack/Discord
7. **Storage**: Saves job data to a database or spreadsheet

## Configuration

### Search Criteria

Edit `config/search-criteria.json`:
- Job titles/keywords
- Locations (remote, hybrid, on-site)
- Salary range
- Experience level
- Must-have skills
- Nice-to-have skills

### Resume Profile

Edit `config/resume.json`:
- Your skills and experience
- Education
- Preferred technologies
- Career goals

## Usage

### Running Manually
Trigger the workflow manually from the n8n interface for testing.

### Scheduled Runs
The workflow is configured to run automatically every 24 hours.

### Viewing Results
Check your configured notification channel (email/Slack/Discord) for matched jobs.

## Customization

- **Add more job sources**: Extend the workflow with additional HTTP requests or APIs
- **Adjust AI prompts**: Modify the Claude/GPT node prompts for better matching
- **Change notification format**: Edit the notification templates
- **Add application automation**: Extend workflow to auto-fill applications

## Troubleshooting

- **No jobs found**: Check your search criteria aren't too restrictive
- **API errors**: Verify your API keys in the .env file
- **Rate limiting**: Add delays between requests or use official APIs

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
