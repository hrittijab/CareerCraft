import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>Improve Resume Bullet</h2>

      <label>Original Bullet</label>
      <textarea
        [(ngModel)]="bullet"
        rows="4"
        placeholder="Paste a resume bullet point here"
      ></textarea>

      <button
        type="button"
        class="primary mt-24"
        (click)="improve()"
        [disabled]="loading"
      >
        {{ loading ? 'Improving…' : 'Improve Bullet' }}
      </button>

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Improving bullet point… please wait ⏳
      </div>

      <!-- Result -->
      <div *ngIf="improved && !loading" class="card mt-24">
        <h3>Improved Bullet</h3>

        <textarea
          [value]="improved"
          rows="4"
          readonly
        ></textarea>
      </div>
    </div>
  `
})
export class BulletImprovePage {
  bullet = '';
  improved = '';
  loading = false;

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  improve() {
    if (!this.bullet.trim()) {
      alert('Please enter a bullet point.');
      return;
    }

    this.loading = true;
    this.improved = '';

    this.api.improveBullet({ text: this.bullet }).subscribe({
      next: (res) => {
        this.improved = res.improved_bullet;

        this.history.add({
          title: 'Resume Bullet Improved',
          type: 'Bullet Improvement',
          timestamp: Date.now()
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        alert('Failed to improve bullet point. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}
