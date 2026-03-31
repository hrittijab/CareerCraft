describe('Job Fit Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/job-fit');
  });

  it('shows similarity score for valid input', () => {
    cy.intercept('POST', '**/ai/job-fit', {
      statusCode: 200,
      body: { similarity_score: 82 }
    }).as('jobFitRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.wait('@jobFitRequest');
    cy.contains('Similarity: 82%').should('be.visible');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Check Fit').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('does not submit when only resume is provided', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.contains('button', 'Check Fit').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('does not submit when only job description is provided', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/ai/job-fit', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { similarity_score: 75 } });
      });
    }).as('jobFitRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.contains('Calculating job fit').should('be.visible');
    cy.contains('button', 'Checking').should('be.disabled');

    cy.wait('@jobFitRequest');
    cy.contains('button', 'Check Fit').should('not.be.disabled');
    cy.contains('Similarity: 75%').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/ai/job-fit', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { similarity_score: 75 } });
      });
    }).as('jobFitRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.contains('button', 'Checking').should('be.disabled');
    cy.contains('Calculating job fit').should('be.visible');

    cy.wait('@jobFitRequest');

    cy.contains('button', 'Check Fit').should('not.be.disabled');
    cy.contains('Similarity: 75%').should('be.visible');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/ai/job-fit', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('jobFitRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.wait('@jobFitRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to calculate job fit.'
    );
  });

  it('does not show result before request completes', () => {
    cy.intercept('POST', '**/ai/job-fit', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { similarity_score: 75 } });
      });
    }).as('jobFitRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Check Fit').click();

    cy.contains('Similarity:').should('not.exist');

    cy.wait('@jobFitRequest');

    cy.contains('Similarity: 75%').should('be.visible');
  });
});