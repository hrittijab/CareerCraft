import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Resume Parser</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        (change)="onFile($event)"
        [disabled]="loading"
      />

      <!-- Loading -->
      <div *ngIf="loading" class="mt-16">
        Parsing resume… please wait ⏳
      </div>

      <!-- Result -->
      <div *ngIf="text && !loading" class="card mt-24">
        <h3>Extracted Resume Text</h3>

        <textarea
          [value]="text"
          rows="12"
          readonly
        ></textarea>
      </div>

      <!-- Error -->
      <p *ngIf="error && !loading" class="muted mt-16">
        {{ error }}
      </p>
    </div>
  `
})
export class ResumeParserPage {
  text = '';
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private history: HistoryService,
    private cdr: ChangeDetectorRef
  ) {}

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.name.match(/\.(pdf|doc|docx)$/i)) {
      this.error = 'Unsupported file type.';
      return;
    }

    this.loading = true;
    this.text = '';
    this.error = '';

    this.api.parseResume(file).subscribe({
      next: res => {
        this.text = res.raw_text || '';
        this.loading = false;

        this.history.add({
          title: 'Resume Parsed',
          type: 'Resume Parser',
          timestamp: Date.now()
        });

        
        input.value = '';

        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to parse resume.';
        this.loading = false;
        input.value = '';
        this.cdr.detectChanges();
      }
    });
  }
}
