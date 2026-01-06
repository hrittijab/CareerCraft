import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillGapPage } from './skill-gap.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('SkillGapPage', () => {
  let component: SkillGapPage;
  let fixture: ComponentFixture<SkillGapPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['smartSkillGap']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [SkillGapPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillGapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if resume or job description is empty', () => {
    spyOn(window, 'alert');

    component.resume = '';
    component.jobDescription = '';
    component.analyze();

    expect(apiSpy.smartSkillGap).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please provide both resume and job description.'
    );
  });

  it('should analyze skill gap successfully', () => {
    component.resume = 'Java, Spring Boot';
    component.jobDescription = 'Java, Spring Boot, Docker';

    const mockResult = {
      match_percent: 66,
      matched_skills: ['Java', 'Spring Boot'],
      missing_skills: ['Docker']
    };

    apiSpy.smartSkillGap.and.returnValue(of(mockResult));

    component.analyze();

    expect(component.loading).toBeFalse();
    expect(component.result).toEqual(mockResult);

    expect(apiSpy.smartSkillGap).toHaveBeenCalledWith({
      resume: 'Java, Spring Boot',
      job_description: 'Java, Spring Boot, Docker'
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Skill Gap Analysis',
        type: 'Skill Gap'
      })
    );
  });

  it('should clear inputs and result when clear is clicked', () => {
    component.resume = 'Something';
    component.jobDescription = 'Something else';
    component.result = { dummy: true };

    component.clear();

    expect(component.resume).toBe('');
    expect(component.jobDescription).toBe('');
    expect(component.result).toBeNull();
  });

  it('should not clear while loading', () => {
    component.loading = true;
    component.resume = 'Data';
    component.jobDescription = 'JD';

    component.clear();

    expect(component.resume).toBe('Data');
    expect(component.jobDescription).toBe('JD');
  });

  it('should return correct match color', () => {
    expect(component.matchColor(80)).toBe('#22c55e');
    expect(component.matchColor(60)).toBe('#eab308');
    expect(component.matchColor(30)).toBe('#ef4444');
  });

  it('should return correct match label', () => {
    expect(component.matchLabel(80)).toBe('Strong alignment');
    expect(component.matchLabel(60)).toBe('Partial alignment');
    expect(component.matchLabel(30)).toBe('Significant skill gap');
  });

  it('should handle API error ', () => {
    component.resume = 'Java';
    component.jobDescription = 'Java';

    apiSpy.smartSkillGap.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.analyze();

    expect(component.loading).toBeFalse();
    expect(component.result).toBeNull();
  });
});
