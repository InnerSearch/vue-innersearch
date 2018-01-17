import searchbox_sample_1 from '../fixtures/searchbox_1.json';
import searchbox_sample_2 from '../fixtures/searchbox_2.json';
import searchbox_sample_3 from '../fixtures/searchbox_3.json';

const _URL = 'http://localhost:4000/#/test_searchbox',
	  _SEARCHBOX = '.is-field.is-searchbox',
	  _BUTTON = '.is-button.is-search-button',
	  _HITS = '.is-score.is-hits',
	  _ITEMS = 'div.hit',

	  _FIRSTNAME = '.firstname',
	  _LASTNAME = '.lastname',
	  _STATE = '.state',
	  _GENDER = '.gender';

function LoopForHits(sample) {
	cy.get(_ITEMS).each((item, index) => {
		let _currentHit = sample.hits.hits[index]._source;
		cy.wrap(item).find(_FIRSTNAME).contains(_currentHit.firstname);
		cy.wrap(item).find(_LASTNAME).contains(_currentHit.lastname);
		cy.wrap(item).find(_STATE).contains(_currentHit.state);
		cy.wrap(item).find(_GENDER).contains(_currentHit.gender);
	});
}

describe('Test SearchBox with basic submit button', () => {
	beforeEach(function() {
		cy.visit(_URL);
		cy.server();
	});

	it('Field is focused by default' , function() {
		cy.focused().should('have.class', 'is-searchbox').and('have.class', 'is-field');
	});

	it('Empty field returns 1002 hits' , function() {
		cy.get(_BUTTON).click();
		cy.get(_HITS).contains('1002 results found');
	});

	it('Hits results for : s', function() {
		cy.get(_SEARCHBOX).type('s');
		cy.wait(150).get(_HITS).contains('287 results found');
		LoopForHits(searchbox_sample_1);
	});

	it('Hits results for : mia', function() {
		cy.get(_SEARCHBOX).type('mia');
		cy.wait(150).get(_HITS).contains('1 result found');
		LoopForHits(searchbox_sample_2);
	});

	it('Hits results for : alford', function() {
		cy.get(_SEARCHBOX).type('alford');
		cy.wait(150).get(_HITS).contains('1 result found');
		LoopForHits(searchbox_sample_3);
	});

	it('No case sensitive', function() {
		cy.get(_SEARCHBOX).type('MiA');
		cy.wait(150).get(_HITS).contains('1 result found');
		LoopForHits(searchbox_sample_2);
	});
});
