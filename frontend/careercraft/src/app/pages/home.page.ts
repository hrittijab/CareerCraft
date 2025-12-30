import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="card">
      <h2>Welcome to CareerCraft</h2>
      <p class="muted">
        Your AI-powered career assistant for resumes, ATS optimization,
        and interview preparation.
      </p>

      <div class="flex flex-gap-12 mt-16" style="flex-wrap:wrap;">
        <a class="btn primary" routerLink="/cover-letter">Cover Letter</a>
        <a class="btn primary" routerLink="/ats-score">ATS Score</a>
        <a class="btn primary" routerLink="/job-fit">Job Fit</a>
        <a class="btn primary" routerLink="/skill-gap">Skill Gap</a>
        <a class="btn primary" routerLink="/skill-recommendation">Skills</a>
        <a class="btn primary" routerLink="/career-advice">Advice</a>
        <a class="btn primary" routerLink="/history">History</a>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Core Tools</h3>

      <div class="row">
        <div class="card">
          <h4>Cover Letter Generator</h4>
          <p class="muted">
            Generate a tailored, professional cover letter using your resume
            and job description.
          </p>
          <a class="btn primary" routerLink="/cover-letter">Open</a>
        </div>

        <div class="card">
          <h4>ATS Score Checker</h4>
          <p class="muted">
            Analyze how well your resume matches a job posting.
          </p>
          <a class="btn primary" routerLink="/ats-score">Open</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">AI Analysis</h3>

      <div class="row">
        <div class="card">
          <h4>Job Fit Analysis</h4>
          <p class="muted">
            Measure semantic similarity between your resume and the job description.
          </p>
          <a class="btn primary" routerLink="/job-fit">Open</a>
        </div>

        <div class="card">
          <h4>Skill Gap Analysis</h4>
          <p class="muted">
            Identify skills you already have and skills you’re missing.
          </p>
          <a class="btn primary" routerLink="/skill-gap">Open</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Career Preparation</h3>

      <div class="row">
        <div class="card">
          <h4>Skill Recommendations</h4>
          <p class="muted">
            Get prioritized skill recommendations to boost your ATS score.
          </p>
          <a class="btn primary" routerLink="/skill-recommendation">Open</a>
        </div>

        <div class="card">
          <h4>Career Advice</h4>
          <p class="muted">
            Get personalized career guidance based on your resume and target role.
          </p>
          <a class="btn primary" routerLink="/career-advice">Open</a>
        </div>

        <div class="card">
          <h4>Interview Questions</h4>
          <p class="muted">
            Generate interview questions tailored to a specific job role.
          </p>
          <a class="btn primary" routerLink="/interview-questions">Open</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Resume Tools</h3>

      <div class="row">
        <div class="card">
          <h4>Improve Resume Bullet</h4>
          <p class="muted">
            Rewrite resume bullet points to be achievement-focused and quantified.
          </p>
          <a class="btn primary" routerLink="/improve-bullet">Open</a>
        </div>

        <div class="card">
          <h4>Resume Parser</h4>
          <p class="muted">
            Upload your resume (PDF/DOCX) and extract structured text.
          </p>
          <a class="btn primary" routerLink="/resume-parser">Open</a>
        </div>
      </div>
    </div>

    <div class="section">
      <h3 class="section-title">Management</h3>

      <div class="row">
        <div class="card">
          <h4>History</h4>
          <p class="muted">
            Review past analyses and generated content.
          </p>
          <a class="btn primary" routerLink="/history">Open</a>
        </div>
      </div>
    </div>
  `
})
export class HomePage {}
