import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Resume Parser</h2>

      <input type="file" accept=".pdf,.doc,.docx" (change)="onFile($event)" />

      <pre *ngIf="text" class="card mt-24">
{{ text }}
      </pre>
    </div>
  `
})
export class ResumeParserPage {
  text = '';

  constructor(private api: ApiService) {}

  onFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    this.api.parseResume(file)
      .subscribe(res => this.text = res.raw_text);
  }
}
