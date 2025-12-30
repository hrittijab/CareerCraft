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
        placeholder="Paste a technical job description"
      ></textarea>

      <button
        class="primary mt-24"
        (click)="recommend()"
        [disabled]="loading"
      >
        {{ loading ? 'Analyzing…' : 'Recommend Skills' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Analyzing skills… please wait ⏳
      </div>
    </div>

    <!-- RESULTS -->
    <div *ngIf="result && !loading" class="card mt-24">

      <h3>Current Match</h3>
      <p style="font-size:32px; font-weight:800;">
        {{ result.current_match_percent ?? 0 }}%
      </p>

      <h3 class="mt-16">Matched Skills</h3>
      <div class="flex flex-gap-12" style="flex-wrap:wrap;">
        <span *ngFor="let s of result.matched_skills" class="tag">
          {{ s }}
        </span>

        <p *ngIf="!result.matched_skills?.length" class="muted">
          No technical skills from the job description were found in your resume.
        </p>
      </div>

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
  `,
})
export class SkillRecommendPage {
  resume = '';
  jd = '';
  result: any = null;
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  recommend() {
    if (!this.resume.trim() || !this.jd.trim()) {
      alert('Please provide both resume and job description.');
      return;
    }

    this.loading = true;
    this.result = null;

    this.api.recommendSkills({
      resume: this.resume,
      job_description: this.jd
    }).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;

        this.history.add({
          title: 'Skill Recommendations',
          type: 'Skill Recommendation',
          timestamp: Date.now()
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
