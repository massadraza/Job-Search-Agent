# Workflow Guide

This document explains how the n8n workflow works and how to customize it.

## Workflow Overview

The Job Search AI Agent workflow consists of several connected nodes that work together to automate job searching:

```
Schedule Trigger → Generate URLs → Fetch Jobs → Parse Data → AI Analysis →
Filter Matches → Create Digest → Send Email
                                  ↓
                          Save to Google Sheets
```

## Node Breakdown

### 1. Schedule Trigger
**Purpose**: Automatically runs the workflow on a schedule

**Configuration**:
- Default: Every 24 hours
- Customizable to any interval (hourly, daily, weekly)

**To Modify**:
1. Click on the "Schedule Trigger" node
2. Adjust the interval settings
3. Save

### 2. Generate Search URLs
**Purpose**: Creates search URLs for multiple job boards based on your criteria

**How it works**:
- Reads search criteria from workflow static data
- Generates URLs for LinkedIn, Indeed, etc.
- Creates combinations of keywords and locations

**To Customize**:
```javascript
// Edit the search criteria in the workflow static data
{
  "keywords": ["your", "job", "titles"],
  "locations": ["your", "preferred", "locations"]
}
```

### 3. Fetch Job Listings
**Purpose**: Retrieves job listings from each URL

**Configuration**:
- HTTP Request node
- Timeout: 10 seconds
- Method: GET

**Note**: Some sites may block scraping. Consider using:
- Official APIs (LinkedIn, Indeed)
- Job aggregator APIs (Adzuna, The Muse)
- RSS feeds

### 4. Parse Job Data
**Purpose**: Extracts structured data from job listings

**Current Implementation**:
- Basic HTML parsing (placeholder)
- Returns sample data structure

**To Improve**:
Replace with actual parsing logic:
```javascript
// Use cheerio or similar library for HTML parsing
const cheerio = require('cheerio');
const $ = cheerio.load(html);

const jobs = [];
$('.job-card').each((i, elem) => {
  jobs.push({
    title: $(elem).find('.job-title').text(),
    company: $(elem).find('.company-name').text(),
    location: $(elem).find('.location').text(),
    description: $(elem).find('.description').text(),
    url: $(elem).find('a').attr('href')
  });
});
```

### 5. AI Job Analysis
**Purpose**: Uses Claude AI to analyze each job against your profile

**Key Features**:
- Analyzes job fit based on your resume
- Provides match score (0-100)
- Lists pros and cons
- Gives recommendation (apply/maybe/skip)

**Prompt Customization**:
Edit the message in the node to focus on specific aspects:
- Technical skills alignment
- Company culture indicators
- Growth opportunities
- Work-life balance

**Example Custom Prompt**:
```
Focus your analysis on:
1. Technical stack match (weight: 40%)
2. Remote work options (weight: 30%)
3. Learning opportunities (weight: 20%)
4. Compensation competitiveness (weight: 10%)
```

### 6. Process AI Response
**Purpose**: Parses AI output and adds it to job data

**Features**:
- Handles JSON parsing
- Fallback for invalid responses
- Merges analysis with job data

### 7. Filter High Matches
**Purpose**: Only passes through jobs meeting your minimum score

**Configuration**:
- Default threshold: 70% match
- Can be adjusted higher or lower

**To Modify**:
1. Click the "Filter High Matches" node
2. Change the comparison value
3. For multiple conditions, add more rules

### 8. Create Job Digest
**Purpose**: Aggregates all matched jobs into a single digest

**Features**:
- Sorts jobs by match score
- Counts total matches
- Prepares data for email

### 9. Format Email
**Purpose**: Creates HTML email with job matches

**Email Template Features**:
- Professional styling
- Color-coded match scores
- Clickable job links
- Pros/cons lists
- Recommendation badges

**To Customize Email**:
Edit the HTML template in the node:
```javascript
// Change colors
.high-score { color: #00aa00; }  // Green for high scores

// Add company logos
<img src="${job.companyLogo}" alt="${job.company}">

// Add more details
<p><strong>Skills Required:</strong> ${job.skills.join(', ')}</p>
```

### 10. Send Email Notification
**Purpose**: Sends the digest to your email

**Configuration**:
- From: Your configured email
- To: Your email
- Subject: Auto-generated with date and count

**Alternative Notification Methods**:
- Slack: Add a Slack node
- Discord: Add a Webhook node
- SMS: Add Twilio node

### 11. Save to Google Sheets (Optional)
**Purpose**: Tracks all job matches in a spreadsheet

**Spreadsheet Columns**:
- Date
- Title
- Company
- Location
- Match Score
- Recommendation
- URL
- Platform

**Benefits**:
- Historical tracking
- Manual review
- Application tracking
- Trend analysis

## Customization Examples

### Example 1: Add More Job Sources

Add a node to fetch from another job board:

1. Duplicate the "Fetch Job Listings" node
2. Update the URL to the new source
3. Connect it to "Parse Job Data"

### Example 2: Add Salary Filtering

Add a filter node after parsing:

1. Add an "IF" node
2. Condition: `{{ $json.salary >= 100000 }}`
3. Only pass jobs meeting salary requirement

### Example 3: Company Blacklist

Add filtering for unwanted companies:

```javascript
const blacklist = ['Company A', 'Company B'];
const company = $json.company;

if (blacklist.includes(company)) {
  return []; // Skip this job
}
return [$json];
```

### Example 4: Skills Extraction

Enhance parsing to extract required skills:

```javascript
const description = $json.description.toLowerCase();
const skills = [];

const skillKeywords = ['python', 'javascript', 'react', 'aws', 'docker'];

skillKeywords.forEach(skill => {
  if (description.includes(skill)) {
    skills.push(skill);
  }
});

$json.requiredSkills = skills;
return $json;
```

### Example 5: Auto-Apply (Advanced)

Add nodes to automatically apply to jobs:

1. Add "HTTP Request" node
2. Configure to submit application
3. Attach resume and cover letter
4. Only for jobs with 90+ match score

**Warning**: Use carefully and ensure compliance with job board terms.

## Best Practices

### 1. Rate Limiting
Add delays between requests to avoid being blocked:

```javascript
// Add in Code node
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
```

### 2. Error Handling
Wrap operations in try-catch:

```javascript
try {
  // Your code
} catch (error) {
  console.error('Error:', error);
  return []; // Return empty to continue workflow
}
```

### 3. Logging
Add logging for debugging:

```javascript
console.log('Processing job:', $json.title);
console.log('Match score:', $json.matchScore);
```

### 4. Testing
Test each node individually:
1. Click "Execute Node" (not "Execute Workflow")
2. Verify the output
3. Fix any issues before running the full workflow

### 5. Data Quality
Validate data before processing:

```javascript
if (!$json.title || !$json.company) {
  return []; // Skip invalid jobs
}
```

## Monitoring and Maintenance

### Daily Checks
- Review email digest
- Check for workflow errors in n8n
- Verify job quality

### Weekly Maintenance
- Review match accuracy
- Adjust criteria if needed
- Update resume profile
- Clear old data from sheets

### Monthly Review
- Analyze job trends
- Refine AI prompts
- Update blacklisted companies
- Check API usage and costs

## Troubleshooting Workflow Issues

### Workflow Not Running
1. Check if it's activated (toggle switch)
2. Verify schedule trigger settings
3. Check n8n logs

### No Jobs Returned
1. Test URLs manually in browser
2. Check if sites changed their HTML
3. Verify parsing logic

### Low Match Scores
1. Review AI prompts
2. Check resume completeness
3. Adjust scoring weights

### Email Not Received
1. Check spam folder
2. Verify SMTP credentials
3. Test email node individually

## Advanced Workflow Patterns

### Parallel Processing
Process multiple job boards simultaneously:
1. Split after "Generate URLs"
2. Merge before "AI Analysis"

### Conditional Branching
Different handling based on job source:
```javascript
if ($json.platform === 'LinkedIn') {
  // LinkedIn-specific processing
} else if ($json.platform === 'Indeed') {
  // Indeed-specific processing
}
```

### Data Enrichment
Add company information from external APIs:
1. Extract company name
2. Query company data API (Clearbit, Crunchbase)
3. Add funding, size, culture info
4. Use in AI analysis

## Integration Ideas

1. **Applicant Tracking System**: Connect to your ATS
2. **Calendar**: Auto-schedule application reminders
3. **CRM**: Track companies and contacts
4. **Analytics**: Dashboard for job market trends
5. **Notion/Airtable**: Alternative to Google Sheets

## Resources

- [n8n Node Documentation](https://docs.n8n.io/integrations/)
- [Claude API Docs](https://docs.anthropic.com/)
- [Regular Expressions](https://regex101.com/) for parsing
- [Job Board APIs](https://github.com/tramcar/awesome-job-boards)
