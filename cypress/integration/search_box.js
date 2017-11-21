describe('Test number one', () => {
  beforeEach(function() {
    cy.visit('');
  })
  it('is yinyan a chinese' , function () {
      expect(true).to.equal(true);
  })
  it('is yinyan a chinese' , function () {
      var searchbox = cy.get('.searchbox');
      cy.get('.searchbox')
          .type('a')
          .should('have.value', 'a')
  })

  it('searchbox is autofocus' , function () {
    cy.focused().should('have.class','searchbox');
  });
})
