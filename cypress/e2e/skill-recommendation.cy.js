describe('Skill Recommendations Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/skill-recommendation');
  });

  it('shows skill recommendations for valid input', () => {
    cy.intercept('POST', '**/ai/recommend-skills', {
      statusCode: 200,
      body: {
        current_match_percent: 60,
        matched_skills: ['Python', 'FastAPI'],
        recommendations: [
          { skill: 'Docker', priority: 'High', boost_percent: 15 },
          { skill: 'Kubernetes', priority: 'Medium', boost_percent: 10 }
        ]
      }
    }).as('recommendSkillsRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with FastAPI experience');

    cy.get('textarea[placeholder="Paste a technical job description"]')
      .type('Looking for Python developer with Docker and Kubernetes');

    cy.contains('button', 'Recommend Skills').click();

    cy.wait('@recommendSkillsRequest');
    cy.contains('60%').should('be.visible');
    cy.contains('Python').should('be.visible');
    cy.contains('Docker').should('be.visible');
    cy.contains('Kubernetes').should('be.visible');
    cy.contains('+15%').should('be.visible');
  });

  it('does not submit when both inputs are empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Recommend Skills').click();

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

    cy.contains('button', 'Recommend Skills').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please provide both resume and job description.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/ai/recommend-skills', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: {
            current_match_percent: 60,
            matched_skills: ['Python'],
            recommendations: [{ skill: 'Docker', priority: 'High', boost_percent: 15 }]
          }
        });
      });
    }).as('recommendSkillsRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste a technical job description"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Recommend Skills').click();

    cy.contains('Analyzing skills').should('be.visible');
    cy.contains('button', 'Analyzing').should('be.disabled');

    cy.wait('@recommendSkillsRequest');
    cy.contains('button', 'Recommend Skills').should('not.be.disabled');
    cy.contains('60%').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/ai/recommend-skills', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: {
            current_match_percent: 60,
            matched_skills: ['Python'],
            recommendations: []
          }
        });
      });
    }).as('recommendSkillsRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste a technical job description"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Recommend Skills').click();

    cy.contains('button', 'Analyzing').should('be.disabled');
    cy.contains('Analyzing skills').should('be.visible');

    cy.wait('@recommendSkillsRequest');

    cy.contains('button', 'Recommend Skills').should('not.be.disabled');
  });

  it('shows no recommendations message when list is empty', () => {
    cy.intercept('POST', '**/ai/recommend-skills', {
      statusCode: 200,
      body: {
        current_match_percent: 95,
        matched_skills: ['Python', 'FastAPI', 'Docker'],
        recommendations: []
      }
    }).as('recommendSkillsRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer with FastAPI and Docker');

    cy.get('textarea[placeholder="Paste a technical job description"]')
      .type('Looking for Python developer with FastAPI and Docker');

    cy.contains('button', 'Recommend Skills').click();
    cy.wait('@recommendSkillsRequest');

    cy.contains('No skill recommendations available').should('be.visible');
  });

  it('does not show results before request completes', () => {
    cy.intercept('POST', '**/ai/recommend-skills', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({
          statusCode: 200,
          body: {
            current_match_percent: 60,
            matched_skills: ['Python'],
            recommendations: [{ skill: 'Docker', priority: 'High', boost_percent: 15 }]
          }
        });
      });
    }).as('recommendSkillsRequest');

    cy.get('textarea[placeholder="Paste your resume here"]')
      .type('Python developer');

    cy.get('textarea[placeholder="Paste a technical job description"]')
      .type('Looking for Python developer with Docker');

    cy.contains('button', 'Recommend Skills').click();

    cy.contains('Current Match').should('not.exist');

    cy.wait('@recommendSkillsRequest');

    cy.contains('Current Match').should('be.visible');
  });
});