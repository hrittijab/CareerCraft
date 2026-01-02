import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AtsScorePage } from './ats-score.page';
import { ApiService } from '../service/api.service';
import { of } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('AtsScorePage', () => {
  let component: AtsScorePage;
  let fixture: ComponentFixture<AtsScorePage>;
  let apiSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['atsScore']);

    await TestBed.configureTestingModule({
      imports: [AtsScorePage],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        provideZoneChangeDetection() 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AtsScorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call API and display ATS score', () => {
    apiSpy.atsScore.and.returnValue(of({ ats_score: 78 }));

    component.resume = 'Python developer';
    component.job = 'Python developer';
    component.check();

    expect(apiSpy.atsScore).toHaveBeenCalled();
    expect(component.score).toBe(78);
  });

  it('should not call API when inputs are empty', () => {
    spyOn(window, 'alert');

    component.resume = '';
    component.job = '';
    component.check();

    expect(apiSpy.atsScore).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });
});
