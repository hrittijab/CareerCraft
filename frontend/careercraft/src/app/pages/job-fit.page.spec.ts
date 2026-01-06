import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobFitPage } from './job-fit.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('JobFitPage', () => {
  let component: JobFitPage;
  let fixture: ComponentFixture<JobFitPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['jobFit']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [JobFitPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JobFitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if resume or job description is empty', () => {
    spyOn(window, 'alert');

    component.resume = '';
    component.jd = '';
    component.check();

    expect(apiSpy.jobFit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please provide both resume and job description.'
    );
  });

  it('should calculate job fit successfully', () => {
    component.resume = 'My resume';
    component.jd = 'Job description';

    apiSpy.jobFit.and.returnValue(
      of({ similarity_score: 82 })
    );

    component.check();

    expect(component.loading).toBeFalse();
    expect(component.result).toEqual(
      jasmine.objectContaining({ similarity_score: 82 })
    );

    expect(apiSpy.jobFit).toHaveBeenCalledWith({
      resume: 'My resume',
      job_description: 'Job description'
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Job Fit: 82%',
        type: 'Job Fit'
      })
    );
  });

  it('should handle API error', () => {
    spyOn(window, 'alert');

    component.resume = 'My resume';
    component.jd = 'Job description';

    apiSpy.jobFit.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.check();

    expect(component.loading).toBeFalse();
    expect(component.result).toBeNull();
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to calculate job fit.'
    );
  });
});
