import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillRecommendPage } from './skill-recommend.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('SkillRecommendPage', () => {
  let component: SkillRecommendPage;
  let fixture: ComponentFixture<SkillRecommendPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['recommendSkills']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [SkillRecommendPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillRecommendPage);
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
    component.recommend();

    expect(apiSpy.recommendSkills).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Please provide both resume and job description.'
    );
  });

  it('should recommend skills successfully', () => {
    component.resume = 'Java, Spring Boot';
    component.jd = 'Java, Spring Boot, Docker, AWS';

    const mockResult = {
      current_match_percent: 60,
      matched_skills: ['Java', 'Spring Boot'],
      recommendations: [
        {
          skill: 'Docker',
          priority: 'High',
          boost_percent: 15
        },
        {
          skill: 'AWS',
          priority: 'Medium',
          boost_percent: 10
        }
      ]
    };

    apiSpy.recommendSkills.and.returnValue(of(mockResult));

    component.recommend();

    expect(component.loading).toBeFalse();
    expect(component.result).toEqual(mockResult);

    expect(apiSpy.recommendSkills).toHaveBeenCalledWith({
      resume: 'Java, Spring Boot',
      job_description: 'Java, Spring Boot, Docker, AWS'
    });

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Skill Recommendations',
        type: 'Skill Recommendation'
      })
    );
  });

  it('should handle empty recommendations', () => {
    component.resume = 'Java';
    component.jd = 'Java';

    apiSpy.recommendSkills.and.returnValue(
      of({
        current_match_percent: 100,
        matched_skills: ['Java'],
        recommendations: []
      })
    );

    component.recommend();

    expect(component.loading).toBeFalse();
    expect(component.result.recommendations.length).toBe(0);
  });

  it('should handle API error', () => {
    component.resume = 'Java';
    component.jd = 'Java';

    apiSpy.recommendSkills.and.returnValue(
      throwError(() => new Error('API error'))
    );

    component.recommend();

    expect(component.loading).toBeFalse();
    expect(component.result).toBeNull();
  });
});
