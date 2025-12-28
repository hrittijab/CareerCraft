import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Job Fit</h2>

      <label>Resume</label>
      <textarea rows="6" [(ngModel)]="resume"></textarea>

      <label>Job Description</label>
      <textarea rows="6" [(ngModel)]="jd"></textarea>

      <button class="primary mt-24" (click)="check()">
        Check Fit
      </button>

      <p *ngIf="result" class="tag mt-24">
        Similarity: {{ result.similarity_score }}%
      </p>
    </div>
  `
})
export class JobFitPage {
  resume = '';
  jd = '';
  result: any;

  constructor(private api: ApiService) {}

  check() {
    this.api.jobFit({
      resume: this.resume,
      job_description: this.jd
    })
    .subscribe(res => this.result = res);
  }
}
