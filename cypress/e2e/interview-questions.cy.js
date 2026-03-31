describe('Interview Questions Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/interview-questions');
  });

  it('generates interview questions for valid input', () => {
    cy.intercept('POST', '**/llm/interview-questions', {
      statusCode: 200,
      body: { questions: ['Tell me about yourself.', 'What are your strengths?', 'Why do you want this role?'] }
    }).as('interviewQuestionsRequest');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer with FastAPI experience');

    cy.contains('button', 'Generate Questions').click();

    cy.wait('@interviewQuestionsRequest');
    cy.contains('Tell me about yourself.').should('be.visible');
    cy.contains('What are your strengths?').should('be.visible');
    cy.contains('Why do you want this role?').should('be.visible');
  });

  it('does not submit when input is empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Generate Questions').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please paste a job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/llm/interview-questions', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { questions: ['Question 1', 'Question 2'] } });
      });
    }).as('interviewQuestionsRequest');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Questions').click();

    cy.contains('Generating interview questions').should('be.visible');
    cy.contains('button', 'Generating').should('be.disabled');

    cy.wait('@interviewQuestionsRequest');
    cy.contains('button', 'Generate Questions').should('not.be.disabled');
    cy.contains('Question 1').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/llm/interview-questions', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { questions: ['Question 1', 'Question 2'] } });
      });
    }).as('interviewQuestionsRequest');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Questions').click();

    cy.contains('button', 'Generating').should('be.disabled');
    cy.contains('Generating interview questions').should('be.visible');

    cy.wait('@interviewQuestionsRequest');

    cy.contains('button', 'Generate Questions').should('not.be.disabled');
    cy.contains('Question 1').should('be.visible');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/llm/interview-questions', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('interviewQuestionsRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Questions').click();

    cy.wait('@interviewQuestionsRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to generate interview questions.'
    );
  });

  it('shows empty state when API returns no questions', () => {
    cy.intercept('POST', '**/llm/interview-questions', {
      statusCode: 200,
      body: { questions: [] }
    }).as('interviewQuestionsRequest');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Questions').click();

    cy.wait('@interviewQuestionsRequest');

    cy.contains('No questions could be generated').should('be.visible');
  });

  it('does not show questions before request completes', () => {
    cy.intercept('POST', '**/llm/interview-questions', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { questions: ['Question 1'] } });
      });
    }).as('interviewQuestionsRequest');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for a senior Python developer');

    cy.contains('button', 'Generate Questions').click();

    cy.get('ul').should('not.exist');

    cy.wait('@interviewQuestionsRequest');

    cy.get('ul').should('be.visible');
  });
});