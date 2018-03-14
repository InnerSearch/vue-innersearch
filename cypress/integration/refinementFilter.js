const _URL = 'http://localhost:4000/#/test_refinementListFilter',
      _URL2 = 'http://localhost:4000/#/test_refinementListFilter2',
      _REFINEMENT_LIST_FILTER = '.is-component.is-refinement-list',
      _HITS = '.is-score.is-hits',
      _ITEMS = 'div.hit',
      _TITLE = '.is-refinement-menu-title',

      _FIRSTNAME = '.firstname',
      _LASTNAME = '.lastname',
      _STATE = '.state',
      _GENDER = '.gender';

import refinementFilterList_sample_1 from '../fixtures/refinementFilterList_1.json';

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
  it('should display the correct title' , function () {
    cy.get(_TITLE).contains("State : ");
  });
  context('Filtered research', function () {
    const valCheck = {
      name : 'tx',
      count : 30
    };
    beforeEach(function () {
      cy.get(_REFINEMENT_LIST_FILTER + ' input').check(valCheck.name);
      cy.wait(250);
    });
    it('should be filtering as expected' , function () {
      cy.get(_REFINEMENT_LIST_FILTER + ' label[for="'+valCheck.name+'"]').contains(valCheck.name+' ( '+valCheck.count+' )');
    });
    it('Hits results for filtering by md state', function() {
      cy.get(_ITEMS).each((item, index) => {
        let _currentHit = refinementFilterList_sample_1.hits.hits[index]._source;
        cy.wrap(item).find(_FIRSTNAME).contains(_currentHit.firstname);
        cy.wrap(item).find(_LASTNAME).contains(_currentHit.lastname);
        cy.wrap(item).find(_STATE).contains(_currentHit.state);
        cy.wrap(item).find(_GENDER).contains(_currentHit.gender);
      });
    });
    it('should display aggregations ordered by _count ascending', function () {
      cy.get(_REFINEMENT_LIST_FILTER + ' label[for="'+valCheck.name+'"]').invoke('text').then((text1) => {
        cy.get(_REFINEMENT_LIST_FILTER + ' label:last').invoke('text').should((text2) => {
          expect(text1).to.equal(text2);
        });
      });
    });
  });

});

describe('Test RefinementListFilter2', () => {
  const valCheck = {
    name : 'tx',
    name2 : 'id'
  };
  beforeEach(function() {
    cy.visit(_URL2);
    cy.server();
  });

  it('should display at least 23 aggs state', function () {
    cy.get('.is-item .is-refinement-list').should('have.length.lte',23);
  });

  it('should display 57 hits when filtering Texas (tx) or Idaho (id) states' , function () {


    cy.get(_REFINEMENT_LIST_FILTER + ' input').check(valCheck.name);
    cy.get(_REFINEMENT_LIST_FILTER + ' input').check(valCheck.name2);
    cy.wait(250);

    cy.wait(150).get(_HITS).contains('57 results found');


  });
  it('title slot should replace the default title', function (){
    cy.get(_REFINEMENT_LIST_FILTER + ' > h2').contains('US State : ');
  });

  it('label slot should replace the default display using template', function () {
    cy.get(_REFINEMENT_LIST_FILTER + ' label[for="'+valCheck.name+'"]').contains('tx : 30');
  });
});
