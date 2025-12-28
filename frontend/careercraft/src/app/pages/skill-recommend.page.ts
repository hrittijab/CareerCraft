import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Skill Recommendations</h2>

      <textarea rows="6" [(ngModel)]="resume"></textarea>
      <textarea rows="6" [(ngModel)]="jd"></textarea>

      <button (click)="recommend()">Recommend</button>

      <pre *ngIf="result">{{ result | json }}</pre>
    </div>
  `,
})
export class SkillRecommendPage {
  resume = '';
  jd = '';
  result: any;

  constructor(private api: ApiService) {}

  recommend() {
    this.api.recommendSkills({ resume: this.resume, job_description: this.jd })
      .subscribe(res => this.result = res);
  }
}
