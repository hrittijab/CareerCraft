describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
  });

  it('displays the welcome heading', () => {
    cy.contains('Welcome to CareerCraft').should('be.visible');
  });

  it('displays all navigation buttons', () => {
    cy.contains('a', 'Cover Letter').should('be.visible');
    cy.contains('a', 'ATS Score').should('be.visible');
    cy.contains('a', 'Job Fit').should('be.visible');
    cy.contains('a', 'Skill Gap').should('be.visible');
    cy.contains('a', 'Skills').should('be.visible');
    cy.contains('a', 'Advice').should('be.visible');
    cy.contains('a', 'History').should('be.visible');
  });

  it('navigates to cover letter page', () => {
    cy.contains('a', 'Cover Letter').first().click();
    cy.url().should('include', '/cover-letter');
  });

  it('navigates to ATS score page', () => {
    cy.contains('a', 'ATS Score').first().click();
    cy.url().should('include', '/ats-score');
  });

  it('navigates to job fit page', () => {
    cy.contains('a', 'Job Fit').first().click();
    cy.url().should('include', '/job-fit');
  });

  it('navigates to skill gap page', () => {
    cy.contains('a', 'Skill Gap').first().click();
    cy.url().should('include', '/skill-gap');
  });

  it('navigates to career advice page', () => {
    cy.contains('a', 'Advice').first().click();
    cy.url().should('include', '/career-advice');
  });

  it('navigates to history page', () => {
    cy.contains('a', 'History').first().click();
    cy.url().should('include', '/history');
  });

  it('displays all section headings', () => {
    cy.contains('Core Tools').should('be.visible');
    cy.contains('AI Analysis').should('be.visible');
    cy.contains('Career Preparation').should('be.visible');
    cy.contains('Resume Tools').should('be.visible');
    cy.contains('Management').should('be.visible');
  });

  it('displays all tool cards', () => {
    cy.contains('Cover Letter Generator').should('be.visible');
    cy.contains('ATS Score Checker').should('be.visible');
    cy.contains('Job Fit Analysis').should('be.visible');
    cy.contains('Skill Gap Analysis').should('be.visible');
    cy.contains('Skill Recommendations').should('be.visible');
    cy.contains('Career Advice').should('be.visible');
    cy.contains('Interview Questions').should('be.visible');
    cy.contains('Improve Resume Bullet').should('be.visible');
    cy.contains('Resume Parser').should('be.visible');
    cy.contains('History').should('be.visible');
  });
});