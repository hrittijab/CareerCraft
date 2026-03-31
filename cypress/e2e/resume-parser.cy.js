describe('Resume Parser Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/resume-parser');
  });

  it('parses a PDF resume successfully', () => {
    cy.intercept('POST', '**/ai/parse-resume-advanced', {
      statusCode: 200,
      body: { raw_text: 'John Doe\nPython Developer\n3 years experience' }
    }).as('parseResumeRequest');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake pdf content'),
      fileName: 'resume.pdf',
      mimeType: 'application/pdf'
    }, { force: true });

    cy.wait('@parseResumeRequest');
    cy.contains('Extracted Resume Text').should('be.visible');
    cy.get('textarea[readonly]').should('have.value', 'John Doe\nPython Developer\n3 years experience');
  });

  it('parses a DOCX resume successfully', () => {
    cy.intercept('POST', '**/ai/parse-resume-advanced', {
      statusCode: 200,
      body: { raw_text: 'Jane Smith\nSoftware Engineer' }
    }).as('parseResumeRequest');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake docx content'),
      fileName: 'resume.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }, { force: true });

    cy.wait('@parseResumeRequest');
    cy.get('textarea[readonly]').should('have.value', 'Jane Smith\nSoftware Engineer');
  });

  it('shows error for unsupported file type', () => {
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake content'),
      fileName: 'resume.txt',
      mimeType: 'text/plain'
    }, { force: true });

    cy.contains('Unsupported file type').should('be.visible');
  });

  it('shows loading message while request is in progress', () => {
    cy.intercept('POST', '**/ai/parse-resume-advanced', {
      delay: 3000,
      statusCode: 200,
      body: { raw_text: 'Parsed resume text' }
    }).as('parseResumeRequest');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake pdf content'),
      fileName: 'resume.pdf',
      mimeType: 'application/pdf'
    }, { force: true });

    cy.contains('Parsing resume').should('be.visible');
    cy.wait('@parseResumeRequest');
    cy.get('textarea[readonly]').should('be.visible').and('have.value', 'Parsed resume text');
  });

  it('shows error message when API request fails', () => {
    cy.intercept('POST', '**/ai/parse-resume-advanced', {
      statusCode: 500,
      body: { detail: 'Server error' }
    }).as('parseResumeRequest');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake pdf content'),
      fileName: 'resume.pdf',
      mimeType: 'application/pdf'
    }, { force: true });

    cy.wait('@parseResumeRequest');
    cy.contains('Failed to parse resume').should('be.visible');
  });

  it('does not show result before request completes', () => {
    cy.intercept('POST', '**/ai/parse-resume-advanced', {
      delay: 3000,
      statusCode: 200,
      body: { raw_text: 'Parsed resume text' }
    }).as('parseResumeRequest');

    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake pdf content'),
      fileName: 'resume.pdf',
      mimeType: 'application/pdf'
    }, { force: true });

    cy.get('textarea[readonly]').should('not.exist');

    cy.wait('@parseResumeRequest');
    cy.get('textarea[readonly]').should('be.visible').and('have.value', 'Parsed resume text');
  });
});