import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="card">
      <h2>Improve Resume Bullet</h2>

      <label>Original Bullet</label>
      <textarea [(ngModel)]="bullet" rows="4"></textarea>

      <button
        type="button"
        class="primary mt-24"
        (click)="improve()">
        Improve
      </button>

      <div *ngIf="improved" class="card mt-24">
        {{ improved }}
      </div>
    </div>
  `
})
export class BulletImprovePage {
  bullet = '';
  improved = '';

  constructor(private api: ApiService) {}

  improve() {
    this.api.improveBullet({ text: this.bullet })
      .subscribe(res => {
        this.improved = res.improved_bullet;
      });
  }
}
