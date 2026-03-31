describe('History Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/history');
  });

  it('shows empty state when no history', () => {
    cy.contains('No history yet').should('be.visible');
  });

  it('shows history items after an analysis is run', () => {
    cy.intercept('POST', '**/llm/cover-letter', {
      statusCode: 200,
      body: { cover_letter: 'Dear Hiring Manager...' }
    }).as('coverLetterRequest');

    cy.visit('http://localhost:4200/cover-letter');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();
    cy.wait('@coverLetterRequest');

    cy.visit('http://localhost:4200/history');

    cy.contains('Cover Letter Generated').should('be.visible');
    cy.contains('Cover Letter').should('be.visible');
  });
});