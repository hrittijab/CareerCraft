describe('Skill Gap Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/skill-gap');
  });

  it('shows skill gap analysis for valid input', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', {
      statusCode: 200,
      body: {
        match_percent: 70,
        matched_skills: ['Python', 'FastAPI'],
        missing_skills: ['Docker', 'Kubernetes']
      }
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with FastAPI experience');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with Docker and Kubernetes');

    cy.contains('button', 'Analyze Skill Gap').click();

    cy.wait('@skillGapRequest');
    cy.contains('70%').should('be.visible');
    cy.contains('Python').should('be.visible');
    cy.contains('FastAPI').should('be.visible');
    cy.contains('Docker').should('be.visible');
    cy.contains('Kubernetes').should('be.visible');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Analyze Skill Gap').click();

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
      .type('Python developer with FastAPI experience');

    cy.contains('button', 'Analyze Skill Gap').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: { match_percent: 60, matched_skills: ['Python'], missing_skills: ['Docker'] }
        });
      });
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Analyze Skill Gap').click();

    cy.contains('Analyzing skill gap').should('be.visible');
    cy.contains('button', 'Analyzing').should('be.disabled');

    cy.wait('@skillGapRequest');
    cy.contains('button', 'Analyze Skill Gap').should('not.be.disabled');
    cy.contains('60%').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: { match_percent: 60, matched_skills: ['Python'], missing_skills: ['Docker'] }
        });
      });
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Analyze Skill Gap').click();

    cy.contains('button', 'Analyzing').should('be.disabled');
    cy.contains('Analyzing skill gap').should('be.visible');

    cy.wait('@skillGapRequest');

    cy.contains('button', 'Analyze Skill Gap').should('not.be.disabled');
  });

  it('clears inputs and result when Clear is clicked', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', {
      statusCode: 200,
      body: { match_percent: 70, matched_skills: ['Python'], missing_skills: ['Docker'] }
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Analyze Skill Gap').click();
    cy.wait('@skillGapRequest');
    cy.contains('70%').should('be.visible');

    cy.contains('button', 'Clear').click();

    cy.get('textarea[placeholder="Paste your resume here"]').should('have.value', '');
    cy.get('textarea[placeholder="Paste the job description here"]').should('have.value', '');
    cy.contains('70%').should('not.exist');
  });

  it('shows no major skill gaps message when missing skills is empty', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', {
      statusCode: 200,
      body: { match_percent: 95, matched_skills: ['Python', 'FastAPI'], missing_skills: [] }
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with FastAPI');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with FastAPI');

    cy.contains('button', 'Analyze Skill Gap').click();
    cy.wait('@skillGapRequest');

    cy.contains('No major skill gaps').should('be.visible');
  });

  it('does not show results before request completes', () => {
    cy.intercept('POST', '**/ai/smart-skill-gap', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: { match_percent: 60, matched_skills: ['Python'], missing_skills: ['Docker'] }
        });
      });
    }).as('skillGapRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste the job description here"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Analyze Skill Gap').click();

    cy.contains('Skill Match Overview').should('not.exist');

    cy.wait('@skillGapRequest');

    cy.contains('Skill Match Overview').should('be.visible');
  });
});