import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>ATS Score</h2>

      <label>Resume</label>
      <textarea [(ngModel)]="resume" rows="6"></textarea>

      <label>Job Description</label>
      <textarea [(ngModel)]="job" rows="6"></textarea>

      <button class="primary mt-24" (click)="check()">
        Check
      </button>

      <div *ngIf="score !== null" class="tag mt-24">
        ATS Match: {{ score }}%
      </div>
    </div>
  `
})
export class AtsScorePage {
  resume = '';
  job = '';
  score: number | null = null;

  constructor(private api: ApiService) {}

  check() {
    this.api.atsScore({
      resume: this.resume,
      job_description: this.job
    }).subscribe(res => this.score = res.score);
  }
}
