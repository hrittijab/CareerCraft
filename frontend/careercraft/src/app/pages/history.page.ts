import { Component } from '@angular/core';
import { HistoryService } from '../service/history.service';

@Component({
  standalone: true,
  template: `
  <h2>History</h2>

  <div class="row">
    <div class="card" *ngFor="let h of history">
      <h3>{{ h.title }}</h3>
      <span class="tag">{{ h.type }}</span>
    </div>
  </div>
  `
})
export class HistoryPage {
  history = [];

  constructor(private hs: HistoryService) {
    this.history = hs.get();
  }
}
