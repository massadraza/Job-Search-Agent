# OpenAI Model Selection Guide

## How to Change the AI Model

Your AI Job Agent uses OpenAI's API to analyze jobs. You can easily switch between different models based on your needs.

## Quick Change Instructions

### Method 1: Edit in n8n UI (Recommended)

1. Open n8n at `http://localhost:5678`
2. Open **"Job Search AI Agent (Enhanced)"** workflow
3. Click on the **"AI Agent (Autonomous)"** node
4. Find this line in the code:
   ```javascript
   const SELECTED_MODEL = 'gpt-4o';
   ```
5. Change to your preferred model:
   ```javascript
   const SELECTED_MODEL = 'gpt-4o-mini';  // Example: cheaper model
   ```
6. Click **Save** and you're done!

### Method 2: Edit JSON File

Edit [job-search-agent-enhanced.json](workflows/job-search-agent-enhanced.json) and change line 95:
```javascript
const SELECTED_MODEL = 'your-model-here';
```

## Available Models Comparison

### 🥇 gpt-4o (CURRENT - RECOMMENDED)
- **Speed**: Medium (3-5 sec/job)
- **Cost**: ~$0.003 per job
- **Quality**: Excellent autonomous reasoning
- **Best For**: Default choice - great balance
- **Monthly Cost**: ~$9 for 3000 jobs

**Pros:**
- Best reasoning capabilities
- Excellent skill extraction
- Great at company insights
- Good value for quality

**Cons:**
- 3x more expensive than gpt-4o-mini
- Slightly slower than mini

---

### 💰 gpt-4o-mini (BUDGET OPTION)
- **Speed**: Fast (1-2 sec/job)
- **Cost**: ~$0.001 per job
- **Quality**: Good, but simpler reasoning
- **Best For**: High-volume searches on a budget
- **Monthly Cost**: ~$3 for 3000 jobs

**Pros:**
- Cheapest option
- Very fast responses
- Still provides decent analysis
- 3x cheaper than gpt-4o

**Cons:**
- Less sophisticated reasoning
- May miss subtle job details
- Simpler company insights

---

### 🧠 o1-preview (PREMIUM)
- **Speed**: Slow (10-15 sec/job)
- **Cost**: ~$0.015 per job
- **Quality**: Best reasoning available
- **Best For**: Critical job decisions only
- **Monthly Cost**: ~$45 for 3000 jobs

**Pros:**
- Deepest reasoning
- Most thorough analysis
- Best at complex decision-making

**Cons:**
- 5x more expensive than gpt-4o
- Much slower
- Overkill for job matching
- No JSON mode support

---

### ⚖️ o1-mini (ALTERNATIVE)
- **Speed**: Medium (4-6 sec/job)
- **Cost**: ~$0.003 per job
- **Quality**: Very good reasoning
- **Best For**: Alternative to gpt-4o
- **Monthly Cost**: ~$9 for 3000 jobs

**Pros:**
- Similar cost to gpt-4o
- Advanced reasoning
- Good balance

**Cons:**
- No JSON mode support
- May require prompt adjustments

---

## Cost Comparison Table

| Model | Per Job | 100 jobs/day | 3000 jobs/month |
|-------|---------|--------------|-----------------|
| gpt-4o-mini | $0.001 | $0.10 | $3 |
| **gpt-4o** ✅ | **$0.003** | **$0.30** | **$9** |
| o1-mini | $0.003 | $0.30 | $9 |
| o1-preview | $0.015 | $1.50 | $45 |

## Recommendations by Use Case

### 🎯 Default: Stay with gpt-4o
**Who**: Most users
**Why**: Best balance of quality and cost
```javascript
const SELECTED_MODEL = 'gpt-4o';
```

### 💸 Budget: Switch to gpt-4o-mini
**Who**: Analyzing 100+ jobs daily, tight budget
**Why**: 3x cheaper, still decent quality
```javascript
const SELECTED_MODEL = 'gpt-4o-mini';
```

### 🚀 High Volume: Use gpt-4o-mini
**Who**: Running searches every hour
**Why**: Fast and cheap for frequent analysis
```javascript
const SELECTED_MODEL = 'gpt-4o-mini';
```

### 💎 Premium: Try o1-mini
**Who**: Want best reasoning without extreme cost
**Why**: Advanced reasoning at gpt-4o pricing
```javascript
const SELECTED_MODEL = 'o1-mini';
```
**Note**: May need to remove `response_format: { type: "json_object" }` line

### 🔬 Experimental: o1-preview (Not Recommended)
**Who**: Research/testing only
**Why**: Overkill and expensive for this use case
```javascript
const SELECTED_MODEL = 'o1-preview';
```
**Note**: Requires prompt modifications

## Testing Different Models

1. **Change the model** using instructions above
2. **Run the workflow manually** on a few jobs
3. **Compare the quality** of analysis in your email
4. **Check costs** in your OpenAI dashboard
5. **Decide** if the quality difference is worth the cost

## Real-World Performance

### Sample Analysis Quality

**Job**: "Software Engineering Intern - Google"

**gpt-4o-mini output:**
```
Match Score: 85%
Reasoning: Good match, has required skills
Pros: Prestigious, good learning
Cons: Competitive
```

**gpt-4o output:**
```
Match Score: 88%
Reasoning: Strong technical match with Python/Java. Google's prestige
           valuable for resume despite competitive nature for freshmen.
Pros:
- Top-tier company reputation
- Excellent mentorship programs
- Matches core technical skills (Python, Java)
- Strong engineering culture
Cons:
- Highly competitive for freshman level
- May require advanced algorithm prep
Company Insight: Large tech company, 4.5★ rating, known for excellent
                 internship programs with high conversion to full-time.
```

## Support for Newer Models

As OpenAI releases new models, you can try them:
```javascript
const SELECTED_MODEL = 'gpt-5';  // When available
```

Just make sure the model supports:
- Chat completions API
- JSON response mode (or modify the code)
- System/user message format

---

## Quick Reference

**Current model location**: Line 95 in "AI Agent (Autonomous)" node

**To switch models**: Change this one line
```javascript
const SELECTED_MODEL = 'your-choice-here';
```

**Available choices**:
- `gpt-4o` ← Recommended default
- `gpt-4o-mini` ← Budget option
- `o1-mini` ← Premium reasoning
- `o1-preview` ← Experimental (requires changes)

---

**Last Updated**: 2026-01-02
**Current Default**: gpt-4o
