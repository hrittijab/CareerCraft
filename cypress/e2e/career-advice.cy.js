describe('Career Advice Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/career-advice');
  });

  it('shows career advice for valid input', () => {
    cy.intercept('POST', '**/llm/career-advice', {
      statusCode: 200,
      body: { advice: 'Focus on building cloud skills and networking in your target industry.' }
    }).as('careerAdviceRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Get Career Advice').click();

    cy.wait('@careerAdviceRequest');
    cy.contains('Career Advice').should('be.visible');
    cy.get('textarea[readonly]').should('have.value', 'Focus on building cloud skills and networking in your target industry.');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Get Career Advice').click();

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

    cy.contains('button', 'Get Career Advice').click();

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

    cy.contains('button', 'Get Career Advice').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/llm/career-advice', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { advice: 'Some career advice here.' } });
      });
    }).as('careerAdviceRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Get Career Advice').click();

    cy.contains('Generating career advice').should('be.visible');
    cy.contains('button', 'Generating').should('be.disabled');

    cy.wait('@careerAdviceRequest');
    cy.contains('button', 'Get Career Advice').should('not.be.disabled');
    cy.contains('Career Advice').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/llm/career-advice', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { advice: 'Some career advice here.' } });
      });
    }).as('careerAdviceRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Get Career Advice').click();

    cy.contains('button', 'Generating').should('be.disabled');
    cy.contains('Generating career advice').should('be.visible');

    cy.wait('@careerAdviceRequest');

    cy.contains('button', 'Get Career Advice').should('not.be.disabled');
    cy.get('textarea[readonly]').should('have.value', 'Some career advice here.');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/llm/career-advice', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('careerAdviceRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Get Career Advice').click();

    cy.wait('@careerAdviceRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to generate career advice. Please try again.'
    );
  });

  it('does not show result card before request completes', () => {
    cy.intercept('POST', '**/llm/career-advice', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { advice: 'Some career advice here.' } });
      });
    }).as('careerAdviceRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with 3 years experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Get Career Advice').click();

    cy.get('textarea[readonly]').should('not.exist');

    cy.wait('@careerAdviceRequest');

    cy.get('textarea[readonly]').should('be.visible');
  });
});