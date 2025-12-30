import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Interview Questions</h2>

        <label>Job Description</label>
        <textarea
          rows="8"
          [(ngModel)]="jd"
          placeholder="Paste the job description here"
        ></textarea>

        <button
          class="primary mt-24"
          (click)="generate()"
          [disabled]="loading"
        >
          {{ loading ? 'Generating…' : 'Generate Questions' }}
        </button>

        <!-- Loading -->
        <div *ngIf="loading" class="mt-16">
          Generating interview questions… please wait ⏳
        </div>

        <!-- Results -->
        <ul *ngIf="!loading && questions.length" class="mt-24">
          <li *ngFor="let q of questions">{{ q }}</li>
        </ul>

        <!-- Empty state -->
        <p *ngIf="!loading && generated && !questions.length" class="muted mt-16">
          No questions could be generated.
          Try using a more technical job description.
        </p>
      </div>
    </div>
  `
})
export class InterviewQuestionsPage {
  jd = '';
  questions: string[] = [];
  loading = false;
  generated = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  generate() {
    if (!this.jd.trim()) {
      alert('Please paste a job description.');
      return;
    }

    this.loading = true;
    this.generated = false;
    this.questions = [];

    this.api.interviewQuestions({
      job_description: this.jd
    }).subscribe({
      next: (res) => {
        this.questions = res.questions || [];
        this.generated = true;
        this.loading = false;

        this.history.add({
          title: 'Interview Questions Generated',
          type: 'Interview Prep',
          timestamp: Date.now()
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.generated = true;
        alert('Failed to generate interview questions.');
        this.cdr.detectChanges();
      }
    });
  }
}
