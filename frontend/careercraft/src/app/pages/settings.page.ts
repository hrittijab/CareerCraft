import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 style="margin-top:0;">Settings</h2>
      <p style="opacity:.75;">
        This is a placeholder for future settings like saved profiles, API keys, theme, etc.
      </p>

      <ul style="margin-top:12px;">
        <li>Saved resume profiles</li>
        <li>Default tone (formal / friendly)</li>
        <li>Export results (PDF/Docx)</li>
      </ul>
    </div>
  `,
})
export class SettingsPage {}
