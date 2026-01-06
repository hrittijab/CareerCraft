import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumeParserPage } from './resume-parser.page';
import { ApiService } from '../service/api.service';
import { HistoryService } from '../service/history.service';
import { of, throwError } from 'rxjs';
import { provideZoneChangeDetection } from '@angular/core';

describe('ResumeParserPage', () => {
  let component: ResumeParserPage;
  let fixture: ComponentFixture<ResumeParserPage>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let historySpy: jasmine.SpyObj<HistoryService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['parseResume']);
    historySpy = jasmine.createSpyObj('HistoryService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ResumeParserPage],
      providers: [
        provideZoneChangeDetection(),
        { provide: ApiService, useValue: apiSpy },
        { provide: HistoryService, useValue: historySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeParserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should reject unsupported file type', () => {
    const fakeFile = new File(['dummy'], 'resume.txt', {
      type: 'text/plain'
    });

    const event = {
      target: {
        files: [fakeFile]
      }
    } as unknown as Event;

    component.onFile(event);

    expect(component.error).toBe('Unsupported file type.');
    expect(apiSpy.parseResume).not.toHaveBeenCalled();
  });

  it('should parse resume successfully', () => {
    const fakeFile = new File(['dummy'], 'resume.pdf', {
      type: 'application/pdf'
    });

    apiSpy.parseResume.and.returnValue(
      of({ raw_text: 'Extracted resume text' })
    );

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', {
      value: [fakeFile]
    });

    const event = { target: input } as unknown as Event;

    component.onFile(event);

    expect(component.loading).toBeFalse();
    expect(component.text).toBe('Extracted resume text');
    expect(component.error).toBe('');

    expect(apiSpy.parseResume).toHaveBeenCalledWith(fakeFile);

    expect(historySpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Resume Parsed',
        type: 'Resume Parser'
      })
    );
  });

  it('should handle API error', () => {
    const fakeFile = new File(['dummy'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });

    apiSpy.parseResume.and.returnValue(
      throwError(() => new Error('API error'))
    );

    const input = document.createElement('input');
    Object.defineProperty(input, 'files', {
      value: [fakeFile]
    });

    const event = { target: input } as unknown as Event;

    component.onFile(event);

    expect(component.loading).toBeFalse();
    expect(component.text).toBe('');
    expect(component.error).toBe('Failed to parse resume.');
  });
});
