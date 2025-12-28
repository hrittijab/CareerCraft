import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Career Advice</h2>

      <label>Resume</label>
      <textarea rows="5" [(ngModel)]="resume"></textarea>

      <label>Job Description</label>
      <textarea rows="5" [(ngModel)]="jd"></textarea>

      <button class="primary mt-24" (click)="advise()">
        Get Advice
      </button>

      <pre *ngIf="advice" class="card mt-24">
{{ advice }}
      </pre>
    </div>
  `
})
export class CareerAdvicePage {
  resume = '';
  jd = '';
  advice = '';

  constructor(private api: ApiService) {}

  advise() {
    this.api.careerAdvice({
      resume: this.resume,
      job_description: this.jd
    })
    .subscribe(res => this.advice = res.advice);
  }
}
