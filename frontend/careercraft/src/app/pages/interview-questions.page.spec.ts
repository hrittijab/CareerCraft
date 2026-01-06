import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewQuestionsPage } from './interview-questions.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('InterviewQuestionsPage', () => {
  let component: InterviewQuestionsPage;
  let fixture: ComponentFixture<InterviewQuestionsPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['interviewQuestions']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [InterviewQuestionsPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewQuestionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if job description is empty', () => {
    spyOn(window, 'alert');

    component.jd = '';
    component.generate();

    expect(apiSpy.interviewQuestions).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please paste a job description.'
    );
  });

  it('should generate interview questions successfully', () => {
    component.jd = 'Backend developer with Java and Spring Boot experience';

    apiSpy.interviewQuestions.and.returnValue(
      of({ questions: ['What is dependency injection?', 'Explain REST APIs.'] })
    );

    component.generate();

    expect(component.loading).toBeFalse();
    expect(component.generated).toBeTrue();
    expect(component.questions.length).toBe(2);

    expect(apiSpy.interviewQuestions).toHaveBeenCalledWith({
      job_description: component.jd
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Interview Questions Generated',
        type: 'Interview Prep'
      })
    );
  });

  it('should handle empty questions response', () => {
    component.jd = 'Very vague job description';

    apiSpy.interviewQuestions.and.returnValue(
      of({ questions: [] })
    );

    component.generate();

    expect(component.generated).toBeTrue();
    expect(component.questions.length).toBe(0);
    expect(component.loading).toBeFalse();
  });

  it('should handle API error', () => {
    spyOn(window, 'alert');

    component.jd = 'Backend developer';

    apiSpy.interviewQuestions.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.generate();

    expect(component.loading).toBeFalse();
    expect(component.generated).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith(
      'Failed to generate interview questions.'
    );
  });
});
