import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>ATS Score</h2>

      <label>Resume</label>
      <textarea
        [(ngModel)]="resume"
        rows="6"
        placeholder="Paste your resume here"
      ></textarea>

      <label>Job Description</label>
      <textarea
        [(ngModel)]="job"
        rows="6"
        placeholder="Paste the job description here"
      ></textarea>

      <button
        class="primary mt-24"
        (click)="check()"
        [disabled]="loading"
      >
        {{ loading ? 'Checking…' : 'Check ATS Score' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Calculating ATS match… please wait ⏳
      </div>

      <!-- Result -->
      <div *ngIf="score !== null && !loading" class="tag mt-24">
        ATS Match: {{ score }}%
      </div>
    </div>
  `
})
export class AtsScorePage {
  resume = '';
  job = '';
  score: number | null = null;
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  check() {
    if (!this.resume.trim() || !this.job.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.score = null;

    this.api.atsScore({
      resume: this.resume,
      job_description: this.job
    }).subscribe({
      next: (res) => {
        this.score = res.ats_score;

        this.history.add({
          title: `ATS Match: ${res.ats_score}%`,
          type: 'ATS Score',
          timestamp: Date.now()
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('Failed to calculate ATS score. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}
