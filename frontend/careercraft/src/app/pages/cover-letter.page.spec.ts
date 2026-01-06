import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoverLetterPage } from './cover-letter.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('CoverLetterPage', () => {
  let component: CoverLetterPage;
  let fixture: ComponentFixture<CoverLetterPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['generateCoverLetter']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [CoverLetterPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoverLetterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if resume or job description is empty', () => {
    spyOn(window, 'alert');

    component.resume = '';
    component.job = '';
    component.generate();

    expect(apiSpy.generateCoverLetter).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please provide both resume and job description.'
    );
  });

  it('should generate cover letter successfully', () => {
    component.resume = 'My resume';
    component.job = 'Job description';

    apiSpy.generateCoverLetter.and.returnValue(
      of({ cover_letter: 'Generated cover letter text' })
    );

    component.generate();

    expect(component.loading).toBeFalse();
    expect(component.result).toBe('Generated cover letter text');

    expect(apiSpy.generateCoverLetter).toHaveBeenCalledWith({
      resume: 'My resume',
      job_description: 'Job description'
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Cover Letter Generated',
        type: 'Cover Letter'
      })
    );
  });

  it('should handle API error', () => {
    spyOn(window, 'alert');

    component.resume = 'My resume';
    component.job = 'Job description';

    apiSpy.generateCoverLetter.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.generate();

    expect(component.loading).toBeFalse();
    expect(component.result).toBe('');
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to generate cover letter. Please try again.'
    );
  });
});
