# Job Search AI Agent with n8n

An **autonomous AI agent** job search system built with n8n workflows that intelligently finds, analyzes, and matches job postings using advanced AI capabilities.

## Features

### 🤖 Autonomous AI Agent (NEW!)
- **Intelligent Decision-Making**: Agent autonomously decides which tools to use and how to analyze each job
- **Tool Use**: Agent has access to skill extraction, company research, and deduplication tools
- **Reasoning Transparency**: See exactly how the agent made its decisions
- **Adaptive Analysis**: Agent adjusts its approach based on job type and company

### 🔍 Smart Job Search
- **Multi-Platform Job Search**: RapidAPI JSearch integration for Indeed, LinkedIn, Glassdoor, and more
- **Advanced Filtering**: AI-powered analysis with match scoring (0-100)
- **Intelligent Ranking**: Analyzes all jobs and shows top 10 best matches with medal rankings (🥇🥈🥉)
- **Skill Gap Analysis**: Identifies what you have and what you need to learn
- **Company Insights**: Autonomous research on company culture and reputation
- **Deduplication**: Tracks jobs you've already seen

### 📧 Enhanced Notifications
- **Beautiful HTML Emails**: Professionally designed digest with agent insights
- **Match Scoring**: See exactly how well each job matches your profile
- **Agent Reasoning**: Understand the autonomous decision-making process
- **Action Items**: Clear recommendations on what to apply for

### 📊 Application Tracking
- **Google Sheets Integration**: Automatically tracks all high-match jobs
- **Agent Insights**: Stores autonomous reasoning for each job
- **Deduplication**: Prevents duplicate entries

## Prerequisites

- [n8n](https://n8n.io/) installed (self-hosted or cloud)
- API keys for:
  - **OpenAI GPT-4o** (for autonomous agent capabilities)
  - **RapidAPI JSearch** (for reliable job data from multiple platforms)
  - **Google Sheets** (for tracking and deduplication)
  - **SMTP** (for email notifications)
- Node.js 18+ (optional, for helper scripts)

## Quick Start

### 1. Install n8n
```bash
npm install -g n8n
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

**Required API Keys**:
- **RapidAPI Key**: Sign up at [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
- **OpenAI API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **SMTP Credentials**: Use Gmail App Password ([instructions](https://support.google.com/accounts/answer/185833))

### 3. Configure n8n to Use Environment Variables
```bash
# Start n8n with environment variables loaded
export $(cat .env | xargs) && n8n start
```

Or add to your n8n startup script:
```bash
# In your shell profile (~/.bashrc, ~/.zshrc)
export RAPIDAPI_KEY="your_key_here"
export OPENAI_API_KEY="your_key_here"
```

### 4. Import the Workflow
- Open n8n at `http://localhost:5678`
- Go to Workflows → Import from File
- **For AI Agent**: Select `workflows/job-search-agent-enhanced.json` (RECOMMENDED)
- **For Simple LLM**: Select `workflows/job-search-workflow.json`

### 5. Set Up Additional Credentials in n8n
- **Google Sheets OAuth2**: For job tracking
- **SMTP email account**: For notifications

### 6. Customize Your Profile
- Edit the "Generate Search URLs" node in the workflow
- Modify search keywords, locations, and employment types
- Update candidate profile in "AI Agent (Autonomous)" node

### 7. Activate the Workflow

## Project Structure

```
Job Search Agent/
├── workflows/                        # n8n workflow definitions
│   ├── job-search-workflow.json         # Current working workflow
│   └── job-search-agent-enhanced.json   # ⭐ AI Agent version (NEW!)
├── config/                           # Configuration files
│   ├── search-criteria.json
│   └── resume.json
├── scripts/                          # Helper scripts
│   └── job-matcher.js
├── AI_AGENT_GUIDE.md                # 📚 AI Agent capabilities guide
├── .env.example                     # Environment variables template
└── README.md
```

## How It Works

### AI Agent Workflow (Enhanced)

1. **Scheduled Trigger**: Workflow runs daily at your preferred time
2. **Job Fetching**: RapidAPI JSearch pulls 20+ jobs from multiple platforms (Indeed, LinkedIn, Glassdoor)
3. **Data Parsing**: Extracts job title, company, location, description, salary, skills, etc.
4. **🤖 AI Agent Analysis**:
   - Agent autonomously decides which tools to use
   - Extracts technical skills from descriptions
   - Researches company reputation and culture
   - Checks for duplicate jobs
   - Reasons about job fit for your profile
   - Provides transparent decision-making process
5. **Intelligent Ranking**: Sorts ALL jobs by match score (best to worst)
6. **Top 10 Selection**: Picks the top 10 best matches with visual ranking (🥇🥈🥉)
7. **Digest Creation**: Aggregates top matches with agent insights
8. **Email Notification**: Sends beautiful HTML email with:
   - Visual ranking indicators (medals for top 3)
   - Match scores
   - Agent's reasoning
   - Skills match/gap analysis
   - Company insights
   - Clear recommendations
9. **Google Sheets Storage**: Tracks all jobs with agent reasoning for deduplication

### Simple LLM Workflow (Original)

1. **Scheduled Trigger**: Workflow runs daily
2. **Job Fetching**: RapidAPI JSearch integration
3. **Data Parsing**: Extracts job information
4. **Basic AI Analysis**: Simple OpenAI call for scoring
5. **Filtering**: Jobs scoring 70+
6. **Email & Storage**: Standard digest email + Google Sheets

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

## AI Agent vs Simple LLM

| Feature | Simple LLM | AI Agent (Enhanced) |
|---------|-----------|---------------------|
| Decision Making | ❌ Fixed instructions | ✅ Autonomous reasoning |
| Tool Access | ❌ None | ✅ Skill extraction, company research, deduplication |
| Reasoning | ❌ Basic scoring | ✅ Step-by-step thinking process |
| Insights | Basic pros/cons | Detailed analysis + agent thinking |
| Skills Analysis | Limited | ✅ Match + Gap identification |
| Company Research | None | ✅ Autonomous lookup |
| Transparency | Low | ✅ High - explains decisions |
| Cost per job | ~$0.001 | ~$0.003 |

**Recommendation**: Use the **AI Agent Enhanced** workflow for better job matching and insights!

## Customization

### AI Agent Customization
- **Adjust Agent Personality**: Modify the system prompt in "AI Agent (Autonomous)" node
- **Add More Tools**: Create new tool nodes (e.g., salary comparison, commute calculator)
- **Change Scoring Logic**: Update agent instructions for different weighting
- **Enhance Email Design**: Modify the "Format Email (Enhanced)" node

### General Customization
- **Add more job sources**: Extend with additional RapidAPI endpoints
- **Change notification format**: Edit email templates in formatting nodes
- **Adjust match threshold**: Change filter from 70 to your preferred score
- **Add application automation**: Extend workflow to auto-fill applications

## Security

### API Key Management

**IMPORTANT**: Never commit API keys to version control!

This project uses environment variables to keep your API keys secure:

1. **Store keys in `.env`** (already in `.gitignore`)
2. **Use `.env.example`** as a template for others
3. **Workflow files reference environment variables** using:
   - `{{ $env.RAPIDAPI_KEY }}` for n8n environment variables
   - `process.env.OPENAI_API_KEY` for Node.js code blocks

### Before Pushing to GitHub

The workflow files have been configured to use environment variables instead of hardcoded keys. Make sure:

- Your `.env` file is never committed (it's in `.gitignore`)
- The workflow files use `{{ $env.VAR_NAME }}` syntax
- Share `.env.example` with instructions for others to set up their own keys

## Troubleshooting

- **No jobs found**: Check your search criteria in "Generate Search URLs" node
- **API errors**: Verify your API keys in n8n credentials
- **Rate limiting**: RapidAPI has usage limits - monitor your usage
- **Agent not reasoning**: Make sure you're using GPT-4o (not GPT-3.5 or mini)
- **Email not sending**: Verify SMTP credentials in n8n
- **Duplicate jobs**: Google Sheets deduplication uses "Title" column for matching
- **Environment variables not working**: Make sure n8n is started with env vars loaded

## Learning Resources

- **[AI_AGENT_GUIDE.md](AI_AGENT_GUIDE.md)**: Complete guide to AI Agent capabilities
- **[n8n Documentation](https://docs.n8n.io/)**: Official n8n docs
- **[RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)**: Job search API docs
- **[OpenAI API](https://platform.openai.com/docs)**: OpenAI API documentation

## Cost Breakdown

### Monthly Costs (estimating 100 jobs analyzed daily)

| Service | Free Tier | Paid Usage |
|---------|-----------|-----------|
| RapidAPI JSearch | 0 requests | $10-20/month (Basic plan) |
| OpenAI GPT-4o | $5 free credit | ~$9/month (3000 jobs) |
| Google Sheets | Unlimited | Free |
| SMTP (Gmail) | Unlimited | Free |
| **Total** | - | **~$15-30/month** |

For light usage (20-30 jobs/day), costs can be as low as $5-10/month.

## Roadmap

- [ ] Add LangChain integration for real tool calling
- [ ] Implement actual database for better deduplication
- [ ] Add web scraping fallback when API limits reached
- [ ] Create Slack/Discord notification options
- [ ] Build job application tracking system
- [ ] Add salary negotiation insights
- [ ] Implement interview preparation suggestions

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

---

**Version**: 2.0 - AI Agent Edition
**Last Updated**: 2026-01-02
**Author**: Massad Raza
