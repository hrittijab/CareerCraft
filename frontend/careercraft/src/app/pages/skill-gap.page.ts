import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Skill Gap Analysis</h2>
      <p>
        Compare your resume against a job description and identify missing skills
        that recruiters and ATS systems care about.
      </p>

      <div class="row">
        <div>
          <label>Resume</label>
          <textarea [(ngModel)]="resume"></textarea>
        </div>

        <div>
          <label>Job Description</label>
          <textarea [(ngModel)]="jobDescription"></textarea>
        </div>
      </div>

      <div class="flex flex-gap-12 mt-24">
        <button class="primary" (click)="analyze()" [disabled]="loading">
          {{ loading ? 'Analyzing…' : 'Analyze Skill Gap' }}
        </button>
        <button class="secondary" (click)="clear()">Clear</button>
      </div>
    </div>

    <!-- RESULTS -->
    <div *ngIf="result" class="card mt-24">
      <h3>Skill Match Overview</h3>

      <div style="display:flex; align-items:center; gap:24px; margin:20px 0;">
        <div style="font-size:56px; font-weight:900;">
          {{ result.match_percent }}%
        </div>

        <div style="flex:1;">
          <div class="progress">
            <div
              [style.width.%]="result.match_percent"
              [style.background]="matchColor(result.match_percent)">
            </div>
          </div>
          <p style="margin-top:8px;">
            {{ matchLabel(result.match_percent) }}
          </p>
        </div>
      </div>

      <div class="row">
        <div>
          <h4>Matched Skills</h4>
          <div class="flex flex-gap-12" style="flex-wrap:wrap;">
            <span class="tag" *ngFor="let s of result.matched_skills">
              {{ s }}
            </span>
            <p *ngIf="!result.matched_skills.length" style="opacity:.6;">
              No matched skills detected
            </p>
          </div>
        </div>

        <div>
          <h4>Missing Skills</h4>
          <div class="flex flex-gap-12" style="flex-wrap:wrap;">
            <span
              class="tag"
              style="background:#fee2e2; color:#b91c1c;"
              *ngFor="let s of result.missing_skills">
              {{ s }}
            </span>
            <p *ngIf="!result.missing_skills.length" style="opacity:.6;">
              No major skill gaps 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SkillGapPage {
  resume = '';
  jobDescription = '';
  loading = false;
  result: any = null;

  constructor(private api: ApiService) {}

  analyze() {
    this.loading = true;
    this.result = null;

    this.api.smartSkillGap({
      resume: this.resume,
      job_description: this.jobDescription,
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  clear() {
    this.resume = '';
    this.jobDescription = '';
    this.result = null;
  }

  matchColor(p: number) {
    if (p >= 75) return '#22c55e';
    if (p >= 50) return '#eab308';
    return '#ef4444';
  }

  matchLabel(p: number) {
    if (p >= 75) return 'Strong alignment';
    if (p >= 50) return 'Partial alignment';
    return 'Significant skill gap';
  }
}
