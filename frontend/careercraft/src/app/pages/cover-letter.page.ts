import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>Generate Cover Letter</h2>

      <label>Resume</label>
      <textarea [(ngModel)]="resume" rows="6"></textarea>

      <label>Job Description</label>
      <textarea [(ngModel)]="job" rows="6"></textarea>

      <button class="primary mt-24" (click)="generate()">
        Generate
      </button>

      <div *ngIf="result" class="card mt-24">
        {{ result }}
      </div>
    </div>
  `
})
export class CoverLetterPage {
  resume = '';
  job = '';
  result = '';

  constructor(private api: ApiService) {}

  generate() {
    this.api.generateCoverLetter({
      resume: this.resume,
      job_description: this.job
    }).subscribe(res => {
      // backend returns { cover_letter: string }
      this.result = res.cover_letter;
    });
  }
}
