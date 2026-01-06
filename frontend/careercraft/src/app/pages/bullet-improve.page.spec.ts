import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulletImprovePage } from './bullet-improve.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('BulletImprovePage', () => {
  let component: BulletImprovePage;
  let fixture: ComponentFixture<BulletImprovePage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['improveBullet']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [BulletImprovePage],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy },
        provideZoneChangeDetection()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BulletImprovePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create page', () => {
    expect(component).toBeTruthy();
  });

  it('should not call API if bullet is empty', () => {
    spyOn(window, 'alert');

    component.bullet = '';
    component.improve();

    expect(apiSpy.improveBullet).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please enter a bullet point.');
  });

  it('should call API and display improved bullet', () => {
    apiSpy.improveBullet.and.returnValue(
      of({ improved_bullet: 'Improved resume bullet' })
    );

    component.bullet = 'Worked on backend';
    component.improve();

    expect(apiSpy.improveBullet).toHaveBeenCalledWith({
      text: 'Worked on backend'
    });

    expect(component.improved).toBe('Improved resume bullet');
    expect(historySpy.add).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should save history entry on success', () => {
    apiSpy.improveBullet.and.returnValue(
      of({ improved_bullet: 'Better bullet' })
    );

    component.bullet = 'Did tasks';
    component.improve();

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Resume Bullet Improved',
        type: 'Bullet Improvement'
      })
    );
  });

  it('should handle API error', () => {
    spyOn(window, 'alert');
    apiSpy.improveBullet.and.returnValue(
      throwError(() => new Error('API failed'))
    );

    component.bullet = 'Something';
    component.improve();

    expect(window.alert).toHaveBeenCalledWith(
      'Failed to improve bullet point. Please try again.'
    );
    expect(component.loading).toBeFalse();
  });
});
