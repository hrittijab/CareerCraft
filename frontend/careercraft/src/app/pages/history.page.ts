import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryService, HistoryItem } from '../service/history.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>History</h2>

      <p *ngIf="!history.length" class="muted">
        No history yet. Run an analysis to see results here.
      </p>

      <div class="row" *ngIf="history.length">
        <div class="card" *ngFor="let h of history">
          <h3>{{ h.title }}</h3>
          <span class="tag">{{ h.type }}</span>
          <p class="muted">
            {{ h.timestamp | date:'short' }}
          </p>
        </div>
      </div>
    </div>
  `
})
export class HistoryPage {
  history: HistoryItem[] = [];

  constructor(private historyService: HistoryService) {
    this.history = this.historyService.get();
  }
}
