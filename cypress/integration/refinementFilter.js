const _URL = 'http://localhost:4000/#/test_refinementListFilter',
  _REFINEMENT_LIST_FILTER = '.is-component.is-refinement-list',
  _HITS = '.is-score.is-hits';

describe('Test RefinementListFilter', () => {
  beforeEach(function() {
    cy.visit(_URL);
    cy.server();
  });

  it('should check the input when the label is clicked' , function() {
    cy.get('label').then(($el) => {
      $el.get(0).click();
    });
    cy.get('input').then(($el) => {
      expect($el.get(0)).to.have.prop("checked",true);
    })
  });
  it('should be filtering as expected' , function () {
    cy.get(_REFINEMENT_LIST_FILTER + ' input:first').check();
    cy.get(_REFINEMENT_LIST_FILTER + ' label:first').contains('tx ( 30 )');
  });
});
