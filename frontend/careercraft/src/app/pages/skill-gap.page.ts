import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Skill Gap Analysis</h2>
      <p class="muted">
        Compare your resume against a job description and identify missing skills
        that recruiters and ATS systems care about.
      </p>

      <div class="row">
        <div>
          <label>Resume</label>
          <textarea
            [(ngModel)]="resume"
            placeholder="Paste your resume here"
          ></textarea>
        </div>

        <div>
          <label>Job Description</label>
          <textarea
            [(ngModel)]="jobDescription"
            placeholder="Paste the job description here"
          ></textarea>
        </div>
      </div>

      <div class="flex flex-gap-12 mt-24">
        <button
          class="primary"
          (click)="analyze()"
          [disabled]="loading"
        >
          {{ loading ? 'Analyzing…' : 'Analyze Skill Gap' }}
        </button>

        <button
          class="secondary"
          (click)="clear()"
          [disabled]="loading"
        >
          Clear
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Analyzing skill gap… please wait ⏳
      </div>
    </div>

    <!-- RESULTS -->
    <div *ngIf="result && !loading" class="card mt-24">
      <h3>Skill Match Overview</h3>

      <div class="flex flex-gap-24 mt-16" style="align-items:center;">
        <div style="font-size:56px; font-weight:900;">
          {{ result.match_percent ?? 0 }}%
        </div>

        <div style="flex:1;">
          <div class="progress">
            <div
              [style.width.%]="result.match_percent ?? 0"
              [style.background]="matchColor(result.match_percent ?? 0)">
            </div>
          </div>
          <p class="muted mt-8">
            {{ matchLabel(result.match_percent ?? 0) }}
          </p>
        </div>
      </div>

      <div class="row mt-24">
        <div>
          <h4>Matched Skills</h4>
          <div class="flex flex-gap-12" style="flex-wrap:wrap;">
            <span class="tag" *ngFor="let s of result.matched_skills">
              {{ s }}
            </span>
            <p *ngIf="!result.matched_skills?.length" class="muted">
              No technical skills from the job description were found.
            </p>
          </div>
        </div>

        <div>
          <h4>Missing Skills</h4>
          <div class="flex flex-gap-12" style="flex-wrap:wrap;">
            <span
              class="tag danger"
              *ngFor="let s of result.missing_skills">
              {{ s }}
            </span>
            <p *ngIf="!result.missing_skills?.length" class="muted">
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

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  analyze() {
    if (!this.resume.trim() || !this.jobDescription.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.result = null;

    this.api.smartSkillGap({
      resume: this.resume,
      job_description: this.jobDescription,
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;

        this.history.add({
          title: 'Skill Gap Analysis',
          type: 'Skill Gap',
          timestamp: Date.now()
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  clear() {
    if (this.loading) return;
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
