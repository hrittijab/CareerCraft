describe('Improve Resume Bullet Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/improve-bullet');
  });

  it('shows improved bullet for valid input', () => {
    cy.intercept('POST', '**/llm/improve-bullet', {
      statusCode: 200,
      body: { improved_bullet: 'Increased revenue by 30% through strategic partnerships' }
    }).as('improveBulletRequest');

    cy.get('textarea[placeholder="Paste a resume bullet point here"]')
      .type('helped with revenue');

    cy.contains('button', 'Improve Bullet').click();

    cy.wait('@improveBulletRequest');
    cy.contains('Improved Bullet').should('be.visible');
    cy.get('textarea[readonly]').should('have.value', 'Increased revenue by 30% through strategic partnerships');
  });

  it('does not submit when input is empty', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.contains('button', 'Improve Bullet').click();

    cy.get('@alert').should(
      'have.been.calledWith',
      'Please enter a bullet point.'
    );
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/llm/improve-bullet', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { improved_bullet: 'Improved bullet text' } });
      });
    }).as('improveBulletRequest');

    cy.get('textarea[placeholder="Paste a resume bullet point here"]')
      .type('helped with revenue');

    cy.contains('button', 'Improve Bullet').click();

    cy.contains('Improving bullet point').should('be.visible');
    cy.contains('button', 'Improving').should('be.disabled');

    cy.wait('@improveBulletRequest');
    cy.contains('button', 'Improve Bullet').should('not.be.disabled');
    cy.contains('Improved Bullet').should('be.visible');
  });

  it('disables button while loading', () => {
    cy.intercept('POST', '**/llm/improve-bullet', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { improved_bullet: 'Improved bullet text' } });
      });
    }).as('improveBulletRequest');

    cy.get('textarea[placeholder="Paste a resume bullet point here"]')
      .type('helped with revenue');

    cy.contains('button', 'Improve Bullet').click();

    cy.contains('button', 'Improving').should('be.disabled');
    cy.contains('Improving bullet point').should('be.visible');

    cy.wait('@improveBulletRequest');

    cy.contains('button', 'Improve Bullet').should('not.be.disabled');
    cy.get('textarea[readonly]').should('have.value', 'Improved bullet text');
  });

  it('shows alert when API request fails', () => {
    cy.intercept('POST', '**/llm/improve-bullet', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('improveBulletRequest');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('textarea[placeholder="Paste a resume bullet point here"]')
      .type('helped with revenue');

    cy.contains('button', 'Improve Bullet').click();

    cy.wait('@improveBulletRequest');

    cy.get('@alert').should(
      'have.been.calledWith',
      'Failed to improve bullet point. Please try again.'
    );
  });

  it('does not show result card before request completes', () => {
    cy.intercept('POST', '**/llm/improve-bullet', (req) => {
      req.reply((res) => {
        res.setDelay(3000);
        res.send({ statusCode: 200, body: { improved_bullet: 'Improved bullet text' } });
      });
    }).as('improveBulletRequest');

    cy.get('textarea[placeholder="Paste a resume bullet point here"]')
      .type('helped with revenue');

    cy.contains('button', 'Improve Bullet').click();

    cy.contains('Improved Bullet').should('not.exist');

    cy.wait('@improveBulletRequest');

    cy.contains('Improved Bullet').should('be.visible');
  });
});