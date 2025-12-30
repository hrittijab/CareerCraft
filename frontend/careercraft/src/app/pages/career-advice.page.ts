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
      <h2>Career Advice</h2>

      <label>Resume</label>
      <textarea
        rows="5"
        [(ngModel)]="resume"
        placeholder="Paste your resume here"
      ></textarea>

      <label>Job Description</label>
      <textarea
        rows="5"
        [(ngModel)]="jd"
        placeholder="Paste the job description here"
      ></textarea>

      <button
        class="primary mt-24"
        (click)="advise()"
        [disabled]="loading"
      >
        {{ loading ? 'Generating…' : 'Get Career Advice' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Generating career advice… please wait ⏳
      </div>

      <!-- Result -->
      <div *ngIf="advice && !loading" class="card mt-24">
        <h3>Career Advice</h3>

        <textarea
          [value]="advice"
          rows="8"
          readonly
        ></textarea>
      </div>
    </div>
  `
})
export class CareerAdvicePage {
  resume = '';
  jd = '';
  advice = '';
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  advise() {
    if (!this.resume.trim() || !this.jd.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.advice = '';

    this.api.careerAdvice({
      resume: this.resume,
      job_description: this.jd
    }).subscribe({
      next: (res) => {
        this.advice = res.advice;

        this.history.add({
          title: 'Career Advice Generated',
          type: 'Career Advice',
          timestamp: Date.now()
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('Failed to generate career advice. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}
