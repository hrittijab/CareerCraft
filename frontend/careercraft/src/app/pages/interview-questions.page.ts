import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="card">
        <h2>Interview Questions</h2>

        <label>Job Description</label>
        <textarea rows="8" [(ngModel)]="jd"></textarea>

        <button class="primary mt-24" (click)="generate()">
          Generate
        </button>

        <ul *ngIf="questions.length">
          <li *ngFor="let q of questions">{{ q }}</li>
        </ul>
      </div>
    </div>
  `
})
export class InterviewQuestionsPage {
  jd = '';
  questions: string[] = [];

  constructor(private api: ApiService) {}

  generate() {
    this.api.interviewQuestions({
      job_description: this.jd
    })
    .subscribe(res => this.questions = res.questions);
  }
}
