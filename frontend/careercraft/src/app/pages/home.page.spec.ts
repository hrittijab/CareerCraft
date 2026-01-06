import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomePage,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Welcome to CareerCraft');
  });

  it('should display core navigation buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Cover Letter');
    expect(compiled.textContent).toContain('ATS Score');
    expect(compiled.textContent).toContain('Job Fit');
    expect(compiled.textContent).toContain('Skill Gap');
    expect(compiled.textContent).toContain('Skills');
    expect(compiled.textContent).toContain('Advice');
    expect(compiled.textContent).toContain('History');
  });

  it('should contain router links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a[routerLink]');

    expect(links.length).toBeGreaterThan(0);
  });
});
