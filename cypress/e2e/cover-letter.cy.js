describe('Cover Letter Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/cover-letter');
  });

  it('generates cover letter for valid input', () => {
    cy.intercept('POST', '**/llm/cover-letter', {
      statusCode: 200,
      body: { cover_letter: 'Dear Hiring Manager, I am excited to apply...' }
    }).as('coverLetterRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();

    cy.wait('@coverLetterRequest');
    cy.contains('Your Cover Letter').should('be.visible');
    cy.get('textarea[readonly]').should('have.value', 'Dear Hiring Manager, I am excited to apply...');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Generate Cover Letter').click();

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

    cy.contains('button', 'Generate Cover Letter').click();

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

    cy.contains('button', 'Generate Cover Letter').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/llm/cover-letter', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { cover_letter: 'Dear Hiring Manager...' } });
      });
    }).as('coverLetterRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();

    cy.contains('Generating cover letter').should('be.visible');
    cy.contains('button', 'Generating').should('be.disabled');

    cy.wait('@coverLetterRequest');
    cy.contains('button', 'Generate Cover Letter').should('not.be.disabled');
    cy.contains('Your Cover Letter').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/llm/cover-letter', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { cover_letter: 'Dear Hiring Manager...' } });
      });
    }).as('coverLetterRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();

    cy.contains('button', 'Generating').should('be.disabled');
    cy.contains('Generating cover letter').should('be.visible');

    cy.wait('@coverLetterRequest');

    cy.contains('button', 'Generate Cover Letter').should('not.be.disabled');
    cy.get('textarea[readonly]').should('have.value', 'Dear Hiring Manager...');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/llm/cover-letter', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('coverLetterRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();

    cy.wait('@coverLetterRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to generate cover letter. Please try again.'
    );
  });

  it('does not show result card before request completes', () => {
    cy.intercept('POST', '**/llm/cover-letter', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { cover_letter: 'Dear Hiring Manager...' } });
      });
    }).as('coverLetterRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Cover Letter').click();

    cy.get('textarea[readonly]').should('not.exist');

    cy.wait('@coverLetterRequest');

    cy.get('textarea[readonly]').should('be.visible');
  });
});