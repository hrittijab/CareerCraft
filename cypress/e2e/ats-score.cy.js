describe('ATS Score Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/ats-score');
  });

  it('shows ATS score for valid input', () => {
    cy.intercept('POST', '**/ai/ats-score', {
      statusCode: 200,
      body: { ats_score: 78 }
    }).as('atsScoreRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with FastAPI and AWS');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a Python developer with FastAPI experience');

    cy.contains('button', 'Check ATS Score').click();

    cy.wait('@atsScoreRequest');
    cy.contains('ATS Match: 78%').should('be.visible');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Check ATS Score').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/ai/ats-score', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { ats_score: 85 } });
      });
    }).as('atsScoreRequest');

    cy.get('textarea[placeholder="Paste your resume here"]').type('Python developer');
    cy.get('textarea[placeholder="Paste the job description here"]').type('Python developer');

    cy.contains('button', 'Check ATS Score').click();

    cy.contains('Calculating ATS match').should('be.visible');
    cy.contains('button', 'Checking').should('be.disabled');

    cy.wait('@atsScoreRequest');
    cy.contains('button', 'Check ATS Score').should('not.be.disabled');
    cy.contains('ATS Match: 85%').should('be.visible');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/ai/ats-score', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('atsScoreRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste your resume here"]').type('Python developer');
    cy.get('textarea[placeholder="Paste the job description here"]').type('Python developer');

    cy.contains('button', 'Check ATS Score').click();

    cy.wait('@atsScoreRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to calculate ATS score. Please try again.'
    );
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/ai/ats-score', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { ats_score: 90 } });
      });
    }).as('atsScoreRequest');

    cy.get('textarea[placeholder="Paste your resume here"]').type('Python developer');
    cy.get('textarea[placeholder="Paste the job description here"]').type('Python developer');

    cy.contains('button', 'Check ATS Score').click();

    cy.contains('Calculating ATS match').should('be.visible');
    cy.contains('button', 'Checking').should('be.disabled');

    cy.wait('@atsScoreRequest');

    cy.contains('button', 'Check ATS Score').should('not.be.disabled');
    cy.contains('ATS Match: 90%').should('be.visible');
  });
});