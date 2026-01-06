import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryPage } from './history.page';
import { HistoryService, HistoryItem } from '../service/history.service';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;
  let historyServiceSpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    historyServiceSpy = jasmine.createSpyObj('HistoryService', ['get']);

    await TestBed.configureTestingModule({
      imports: [HistoryPage],
      providers: [
        { provide: HistoryService, useValue: historyServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the page', () => {
    historyServiceSpy.get.and.returnValue([]);

    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show empty message when no history exists', () => {
    historyServiceSpy.get.and.returnValue([]);

    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(
      'No history yet. Run an analysis to see results here.'
    );
  });

  it('should render history items when history exists', () => {
    const mockHistory: HistoryItem[] = [
      {
        title: 'Cover Letter Generated',
        type: 'Cover Letter',
        timestamp: Date.now()
      },
      {
        title: 'Career Advice Generated',
        type: 'Career Advice',
        timestamp: Date.now()
      }
    ];

    historyServiceSpy.get.and.returnValue(mockHistory);

    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Cover Letter Generated');
    expect(compiled.textContent).toContain('Career Advice Generated');
    expect(compiled.textContent).toContain('Cover Letter');
    expect(compiled.textContent).toContain('Career Advice');
  });
});
