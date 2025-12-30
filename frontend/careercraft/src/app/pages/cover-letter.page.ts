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
      <h2>Generate Cover Letter</h2>

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
        (click)="generate()"
        [disabled]="loading"
      >
        {{ loading ? 'Generating…' : 'Generate Cover Letter' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Generating cover letter… please wait ⏳
      </div>

      <!-- Result -->
      <div *ngIf="result && !loading" class="card mt-24">
        <h3>Your Cover Letter</h3>

        <textarea
          [value]="result"
          rows="10"
          readonly
        ></textarea>
      </div>
    </div>
  `
})
export class CoverLetterPage {
  resume = '';
  job = '';
  result = '';
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  generate() {
    if (!this.resume.trim() || !this.job.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.result = '';

    this.api.generateCoverLetter({
      resume: this.resume,
      job_description: this.job
    }).subscribe({
      next: (res) => {
        this.result = res.cover_letter;

        this.history.add({
          title: 'Cover Letter Generated',
          type: 'Cover Letter',
          timestamp: Date.now()
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('Failed to generate cover letter. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}
