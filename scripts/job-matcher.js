/**
 * Job Matching Helper Script
 * Provides utilities for matching jobs to candidate criteria
 */

const fs = require('fs');
const path = require('path');

class JobMatcher {
  constructor(resumePath, criteriaPath) {
    this.resume = this.loadJSON(resumePath);
    this.criteria = this.loadJSON(criteriaPath);
  }

  loadJSON(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error.message);
      return {};
    }
  }

  /**
   * Calculate skill match percentage
   */
  calculateSkillMatch(jobSkills) {
    if (!jobSkills || jobSkills.length === 0) return 0;

    const allCandidateSkills = [
      ...(this.resume.skills.programming || []),
      ...(this.resume.skills.frontend || []),
      ...(this.resume.skills.backend || []),
      ...(this.resume.skills.databases || []),
      ...(this.resume.skills.cloud || []),
      ...(this.resume.skills.tools || []),
      ...(this.resume.skills.other || [])
    ].map(s => s.toLowerCase());

    const matchedSkills = jobSkills.filter(skill =>
      allCandidateSkills.some(cs =>
        cs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(cs)
      )
    );

    return (matchedSkills.length / jobSkills.length) * 100;
  }

  /**
   * Check if job meets must-have requirements
   */
  checkMustHaves(jobDescription) {
    const mustHaves = this.criteria.mustHaveSkills || [];
    const description = jobDescription.toLowerCase();

    const matches = mustHaves.filter(skill =>
      description.includes(skill.toLowerCase())
    );

    return {
      passed: matches.length >= mustHaves.length * 0.75, // 75% threshold
      matchedCount: matches.length,
      totalCount: mustHaves.length,
      matched: matches,
      missing: mustHaves.filter(s => !matches.includes(s))
    };
  }

  /**
   * Check for deal breakers
   */
  checkDealBreakers(jobDescription, jobData) {
    const dealBreakers = this.criteria.dealBreakers || [];
    const description = jobDescription.toLowerCase();

    const found = dealBreakers.filter(dealBreaker => {
      const normalized = dealBreaker.toLowerCase();

      // Check for remote requirement
      if (normalized.includes('no remote') && this.criteria.preferences.remote) {
        return !description.includes('remote') &&
               !jobData.location?.toLowerCase().includes('remote');
      }

      return description.includes(normalized);
    });

    return {
      hasDealBreakers: found.length > 0,
      dealBreakers: found
    };
  }

  /**
   * Calculate salary match
   */
  checkSalaryMatch(jobSalary) {
    if (!jobSalary) return { match: true, score: 50 }; // Neutral if no salary info

    const minSalary = this.criteria.salaryRange?.minimum || 0;

    // Parse salary from string (e.g., "$100k - $150k" or "$120,000")
    const salaryNumbers = jobSalary.match(/\d+[,\d]*/g);
    if (!salaryNumbers) return { match: true, score: 50 };

    const salaryValue = parseInt(salaryNumbers[0].replace(/,/g, '')) *
                       (jobSalary.includes('k') ? 1000 : 1);

    if (salaryValue >= minSalary) {
      return { match: true, score: 100 };
    } else {
      const percentage = (salaryValue / minSalary) * 100;
      return { match: percentage >= 80, score: percentage };
    }
  }

  /**
   * Calculate experience level match
   */
  checkExperienceMatch(jobDescription) {
    const yearsExp = this.resume.personal.yearsOfExperience || 0;
    const description = jobDescription.toLowerCase();

    // Extract experience requirements
    const experiencePatterns = [
      /(\d+)\+?\s*years/gi,
      /(\d+)-(\d+)\s*years/gi
    ];

    let requiredYears = 0;
    for (const pattern of experiencePatterns) {
      const match = description.match(pattern);
      if (match) {
        const numbers = match[0].match(/\d+/g);
        requiredYears = parseInt(numbers[0]);
        break;
      }
    }

    if (requiredYears === 0) return { match: true, score: 75 }; // No requirement found

    const difference = yearsExp - requiredYears;
    if (difference >= 0) {
      return { match: true, score: 100 };
    } else if (difference >= -1) {
      return { match: true, score: 80 }; // Close enough
    } else {
      return { match: false, score: 50 };
    }
  }

  /**
   * Main matching function
   */
  matchJob(job) {
    const skillMatch = this.calculateSkillMatch(job.requiredSkills || []);
    const mustHaves = this.checkMustHaves(job.description);
    const dealBreakers = this.checkDealBreakers(job.description, job);
    const salaryMatch = this.checkSalaryMatch(job.salary);
    const experienceMatch = this.checkExperienceMatch(job.description);

    // Calculate overall score
    let score = 0;
    score += skillMatch * 0.35; // 35% weight
    score += (mustHaves.passed ? 100 : (mustHaves.matchedCount / mustHaves.totalCount) * 100) * 0.25; // 25% weight
    score += salaryMatch.score * 0.15; // 15% weight
    score += experienceMatch.score * 0.15; // 15% weight
    score += (dealBreakers.hasDealBreakers ? 0 : 100) * 0.10; // 10% weight

    // Determine recommendation
    let recommendation = 'skip';
    if (score >= 85 && !dealBreakers.hasDealBreakers) {
      recommendation = 'apply';
    } else if (score >= 70 && !dealBreakers.hasDealBreakers) {
      recommendation = 'maybe';
    }

    return {
      score: Math.round(score),
      recommendation,
      details: {
        skillMatch: Math.round(skillMatch),
        mustHaves,
        dealBreakers,
        salaryMatch,
        experienceMatch
      }
    };
  }

  /**
   * Generate AI prompt for job analysis
   */
  generatePrompt(job) {
    const resumeSummary = {
      skills: Object.values(this.resume.skills || {}).flat(),
      experience: this.resume.experience,
      yearsOfExperience: this.resume.personal.yearsOfExperience,
      careerGoals: this.resume.careerGoals
    };

    return `You are a job matching assistant. Analyze the following job posting and determine if it's a good match for the candidate.

Candidate Profile:
${JSON.stringify(resumeSummary, null, 2)}

Search Criteria:
${JSON.stringify(this.criteria, null, 2)}

Job Posting:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Salary: ${job.salary || 'Not specified'}
Description: ${job.description}

Provide a response in JSON format with:
1. matchScore (0-100): Overall match percentage
2. reasoning: Brief explanation of the score (2-3 sentences)
3. pros: Array of 3-5 positive aspects about this job
4. cons: Array of 2-4 concerns or gaps
5. recommendation: 'apply', 'maybe', or 'skip'

Consider:
- Skills alignment
- Experience level fit
- Career goals alignment
- Company culture fit
- Compensation expectations
- Location/remote preferences

Respond only with valid JSON.`;
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JobMatcher;
}

// CLI usage
if (require.main === module) {
  const resumePath = path.join(__dirname, '../config/resume.json');
  const criteriaPath = path.join(__dirname, '../config/search-criteria.json');

  const matcher = new JobMatcher(resumePath, criteriaPath);

  // Example job for testing
  const exampleJob = {
    title: 'Senior Full Stack Engineer',
    company: 'Tech Startup Inc',
    location: 'Remote',
    salary: '$120k - $160k',
    description: 'We are looking for a senior full stack engineer with 5+ years of experience in JavaScript, React, Node.js, and AWS. You will be building scalable microservices and leading technical projects.',
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'AWS', 'PostgreSQL']
  };

  console.log('Job Matcher Test\n');
  console.log('Job:', exampleJob.title);
  console.log('\nMatch Result:');
  console.log(JSON.stringify(matcher.matchJob(exampleJob), null, 2));

  console.log('\n\nAI Prompt:');
  console.log(matcher.generatePrompt(exampleJob));
}
