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
      <h2>Job Fit</h2>

      <label>Resume</label>
      <textarea
        rows="6"
        [(ngModel)]="resume"
        placeholder="Paste your resume here"
      ></textarea>

      <label>Job Description</label>
      <textarea
        rows="6"
        [(ngModel)]="jd"
        placeholder="Paste the job description here"
      ></textarea>

      <button
        class="primary mt-24"
        (click)="check()"
        [disabled]="loading"
      >
        {{ loading ? 'Checking…' : 'Check Fit' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Calculating job fit… please wait ⏳
      </div>

      <!-- Result -->
      <p *ngIf="result && !loading" class="tag mt-24">
        Similarity: {{ result.similarity_score ?? 0 }}%
      </p>
    </div>
  `
})
export class JobFitPage {
  resume = '';
  jd = '';
  result: any = null;
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  check() {
    if (!this.resume.trim() || !this.jd.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.result = null;

    this.api.jobFit({
      resume: this.resume,
      job_description: this.jd
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;

        this.history.add({
          title: `Job Fit: ${res.similarity_score}%`,
          type: 'Job Fit',
          timestamp: Date.now()
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('Failed to calculate job fit.');
        this.cdr.detectChanges();
      }
    });
  }
}
