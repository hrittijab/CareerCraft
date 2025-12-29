import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Skill Recommendations</h2>

      <label>Resume</label>
      <textarea
        rows="6"
        [(ngModel)]="resume"
        placeholder="Paste your resume here"
      ></textarea>

      <label>Job Description</label>
      <textarea
        rows="6"
        [(ngModel)]="jd"
        placeholder="Paste a *technical* job description"
      ></textarea>

      <button class="primary mt-24" (click)="recommend()">
        Recommend Skills
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Analyzing skills… please wait ⏳
      </div>

      <!-- Results -->
      <div *ngIf="result && !loading" class="mt-24">

        <h3>Current Match</h3>
        <p>{{ result.current_match_percent ?? 0 }}%</p>

        <h3>Matched Skills</h3>
        <ng-container *ngIf="result.matched_skills?.length; else noMatched">
          <span *ngFor="let s of result.matched_skills" class="tag">
            {{ s }}
          </span>
        </ng-container>

        <ng-template #noMatched>
          <p class="muted">
            No technical skills from the job description were found in your resume.
          </p>
        </ng-template>

        <h3 class="mt-16">Recommended Skills</h3>
        <ng-container *ngIf="result.recommendations?.length; else noRecs">
          <ul>
            <li *ngFor="let r of result.recommendations">
              <strong>{{ r.skill }}</strong>
              — {{ r.priority }}
              (+{{ r.boost_percent }}%)
            </li>
          </ul>
        </ng-container>

        <ng-template #noRecs>
          <p class="muted">
            No skill recommendations available.
            Try pasting a more technical job description.
          </p>
        </ng-template>

      </div>
    </div>
  `,
})
export class SkillRecommendPage {
  resume = '';
  jd = '';
  result: any = null;
  loading = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  recommend() {
    this.loading = true;
    this.result = null;

    this.api.recommendSkills({
      resume: this.resume,
      job_description: this.jd
    }).subscribe(res => {
      this.result = res;
      this.loading = false;

      this.cdr.detectChanges();
    });
  }
}
