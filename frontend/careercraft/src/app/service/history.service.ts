import { Injectable } from '@angular/core';

export interface HistoryItem {
  title: string;
  type: string;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private KEY = 'careercraft-history';

  get(): HistoryItem[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }

  add(item: HistoryItem) {
    const history = this.get();
    history.unshift(item);
    localStorage.setItem(this.KEY, JSON.stringify(history));
  }

  clear() {
    localStorage.removeItem(this.KEY);
  }
}
