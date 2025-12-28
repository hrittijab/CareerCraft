import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <div class="card">
      <h2 style="margin:0 0 8px;">Welcome to CareerCraft</h2>
      <p style="margin:0; opacity:.75;">
        Your AI-powered career assistant for resumes, ATS optimization, and interview prep.
      </p>

      <div style="display:flex; gap:12px; margin-top:16px; flex-wrap:wrap;">
        <a class="btn primary" routerLink="/cover-letter">Cover Letter</a>
        <a class="btn primary" routerLink="/ats-score">ATS Score</a>
        <a class="btn primary" routerLink="/job-fit">Job Fit</a>
        <a class="btn primary" routerLink="/skill-gap">Skill Gap</a>
        <a class="btn primary" routerLink="/skill-recommendation">Skill Recommendations</a>
        <a class="btn primary" routerLink="/history">History</a>
      </div>
    </div>

    <!-- CORE TOOLS -->
    <div class="row" style="margin-top:16px;">
      <div class="card">
        <h3>Cover Letter Generator</h3>
        <p style="opacity:.75;">
          Generate a tailored, professional cover letter using your resume and job description.
        </p>
        <a class="btn primary" routerLink="/cover-letter">Open</a>
      </div>

      <div class="card">
        <h3> ATS Score Checker</h3>
        <p style="opacity:.75;">
          Analyze how well your resume matches a job posting.
        </p>
        <a class="btn primary" routerLink="/ats-score">Open</a>
      </div>
    </div>

    <!-- AI ANALYSIS -->
    <div class="row" style="margin-top:16px;">
      <div class="card">
        <h3> Job Fit Analysis</h3>
        <p style="opacity:.75;">
          Measure similarity between your resume and the job description.
        </p>
        <a class="btn" routerLink="/job-fit">Open</a>
      </div>

      <div class="card">
        <h3> Skill Gap Analysis</h3>
        <p style="opacity:.75;">
          Identify skills you already have and skills you’re missing.
        </p>
        <a class="btn" routerLink="/skill-gap">Open</a>
      </div>
    </div>

    <!-- CAREER PREP -->
    <div class="row" style="margin-top:16px;">
      <div class="card">
        <h3> Skill Recommendations</h3>
        <p style="opacity:.75;">
          Get prioritized skill recommendations to boost your ATS score.
        </p>
        <a class="btn" routerLink="/skill-recommendation">Open</a>
      </div>

      <div class="card">
        <h3> Interview Questions</h3>
        <p style="opacity:.75;">
          Generate interview questions tailored to the job.
        </p>
        <a class="btn" routerLink="/interview-questions">Open</a>
      </div>
    </div>

    <!-- RESUME IMPROVEMENT -->
    <div class="row" style="margin-top:16px;">
      <div class="card">
        <h3> Improve Resume Bullet</h3>
        <p style="opacity:.75;">
          Rewrite resume bullet points to be achievement-focused.
        </p>
        <a class="btn" routerLink="/improve-bullet">Open</a>
      </div>

      <div class="card">
        <h3>Resume Parser</h3>
        <p style="opacity:.75;">
          Upload your resume (PDF/DOCX) and extract text.
        </p>
        <a class="btn" routerLink="/resume-parser">Open</a>
      </div>
    </div>

    <!-- MANAGEMENT -->
    <div class="row" style="margin-top:16px;">
      <div class="card">
        <h3> History</h3>
        <p style="opacity:.75;">
          Review past analyses.
        </p>
        <a class="btn" routerLink="/history">Open</a>
      </div>
    </div>
  `
})
export class HomePage {}
