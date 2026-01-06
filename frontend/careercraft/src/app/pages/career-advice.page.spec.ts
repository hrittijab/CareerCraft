import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CareerAdvicePage } from './career-advice.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('CareerAdvicePage', () => {
  let component: CareerAdvicePage;
  let fixture: ComponentFixture<CareerAdvicePage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['careerAdvice']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [CareerAdvicePage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CareerAdvicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if resume or JD is empty', () => {
    spyOn(window, 'alert');

    component.resume = '';
    component.jd = '';
    component.advise();

    expect(apiSpy.careerAdvice).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please provide both resume and job description.'
    );
  });

  it('should generate career advice successfully', () => {
    component.resume = 'My resume';
    component.jd = 'Job description';

    apiSpy.careerAdvice.and.returnValue(
      of({ advice: 'Helpful career advice' })
    );

    component.advise();

    expect(component.loading).toBeFalse();
    expect(component.advice).toBe('Helpful career advice');

    expect(apiSpy.careerAdvice).toHaveBeenCalledWith({
      resume: 'My resume',
      job_description: 'Job description'
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Career Advice Generated',
        type: 'Career Advice'
      })
    );
  });

  it('should handle API error', () => {
    spyOn(window, 'alert');

    component.resume = 'My resume';
    component.jd = 'Job description';

    apiSpy.careerAdvice.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.advise();

    expect(component.loading).toBeFalse();
    expect(component.advice).toBe('');
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to generate career advice. Please try again.'
    );
  });
});
