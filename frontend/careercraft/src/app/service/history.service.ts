import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private key = 'career-history';

  save(item: any) {
    const data = this.get();
    data.push(item);
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  get() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }
}
