describe('Test number one', () => {
  beforeEach(function() {
    cy.visit('http://localhost:4000');
    cy.server();
  })
  it('testing search and hits result score' , function () {
      cy.get('.searchbox')
          .type('aurelia')
          .should('have.value', 'aurelia')
      cy.get('.score').contains('1 result found');
  })

  it('searchbox is autofocus' , function () {
    cy.focused().should('have.class','searchbox');
  });

})
