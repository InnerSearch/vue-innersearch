const 
    _URL = 'http://localhost:4000/#/test_resetbutton',
    _ES_URL = '**/_search',
    _SEARCHBOX = '.is-field.is-searchbox',
    _SEARCH_DATALIST = '.is-field.is-search-datalist',
    _REFINEMENT_LIST_FILTER = '.is-component.is-refinement-list',
    _NUMBER_LIST_FILTER = '.is-range.is-field',
    _HITS = '.is-score.is-hits',
    _AGGS = '.is-item.is-refinement-list',
    _ITEMS = 'div.hit',
    _SEARCH = '.is-button.is-search-button',
    _RESET = '.is-button.is-reset-button',
    _PAGINATE = '.is-paginate.is-component',
    _FILTERS = '.filters',

    _FIRST_SUGGESTION = '.is-search-datalist-suggestions > ul > li:nth-child(2)',
    _SELECTED_SUGGESTIONS = '.is-search-datalist-items > ul';

describe('Default ResetButton bevahior' , () => {
	beforeEach(function() {
        cy.visit(_URL);
        cy.server();
        cy.route('POST', _ES_URL).as('ES');
        cy.wait('@ES');
    });
    
    it('Click on button should show all hits' , () => {
        cy.get(_RESET).click();
        cy.wait('@ES');
        cy.get(_HITS).contains('1002 results found');
    });
});

describe.only('Basic ResetButton behavior' , () => {
	beforeEach(function() {
        cy.visit(_URL);
        cy.server();
        cy.route('POST', _ES_URL).as('ES');
        cy.wait('@ES');
    });
    
    it('Dynamic searchbox reset' , () => {
        cy.get(_SEARCHBOX).type('f');
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_SEARCHBOX).should('be.empty');
        cy.get(_HITS).contains('1002 results found');
    });

    it('Dynamic searchdatalist reset' , () => {
        cy.get(_SEARCH_DATALIST).type('f');
        cy.wait('@ES');
        cy.get(_FIRST_SUGGESTION).click();
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_SEARCH_DATALIST).should('be.empty');
        cy.get(_SELECTED_SUGGESTIONS).should('be.empty');
        cy.get(_HITS).contains('1002 results found');
    });

    it('Balance reset', () => {
        let _from = _NUMBER_LIST_FILTER + '[placeholder="from"]',
            _to = _NUMBER_LIST_FILTER + '[placeholder="to"]';

        cy.get(_from).type('10');
        cy.get(_to).type('40');
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_from).should('be.empty');
        cy.get(_to).should('be.empty');
        cy.get(_HITS).contains('1002 results found');
    });

    it('RLF reset (select list)', () => {
        let _select = _REFINEMENT_LIST_FILTER + ' select';

        cy.get(_select).select('ar');
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_HITS).contains('1002 results found');
    });

    it('RLF reset (radio button)', () => {
        let _radio = _REFINEMENT_LIST_FILTER + ' input[type="radio"]';

        cy.get(_radio).first().check();
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_radio).first().should('not.be.checked');
        cy.get(_HITS).contains('1002 results found');
    });

    it('RLF reset (checkbox)', () => {
        let _checkbox = _REFINEMENT_LIST_FILTER + ' input[type="checkbox"]';

        cy.get(_checkbox).first().check();
        cy.wait('@ES');
        cy.get(_RESET).click();
        cy.wait('@ES').get(_checkbox).first().should('not.be.checked');
        cy.get(_HITS).contains('1002 results found');
    });

    it('Paginate reset', () => {
        let _page = _PAGINATE + ' li:nth-child(4) a';

        cy.get(_SEARCH).click();
        cy.wait('@ES');

        cy.get(_page).click();
        cy.wait('@ES');

        cy.get(_RESET).click();
        
        cy.wait('@ES').get(_page).should('not.have.class', 'is-active');
        cy.get(_HITS).contains('1002 results found');
    });
});

describe('Complete ResetButton behavior' , () => {
	beforeEach(function() {
        cy.visit(_URL);
        cy.server();
        cy.route('POST', _ES_URL).as('ES');
        cy.wait('@ES');
    });

    it('Reset full form and filter tags', () => {
        let _from = _NUMBER_LIST_FILTER + '[placeholder="from"]',
            _to = _NUMBER_LIST_FILTER + '[placeholder="to"]',
            _select = _REFINEMENT_LIST_FILTER + ' select',
            _radio = _REFINEMENT_LIST_FILTER + ' input[type="radio"]',
            _checkbox = _REFINEMENT_LIST_FILTER + ' input[type="checkbox"]';

        cy.get(_SEARCHBOX).type('d');
        cy.wait('@ES');

        cy.get(_SEARCH_DATALIST).type('f');
        cy.wait('@ES').wait(500);
        cy.get(_FIRST_SUGGESTION).click();
        cy.wait('@ES');

        cy.get(_from).type('10');
        cy.get(_to).type('50000');
        cy.wait('@ES');

        cy.get(_select).select('va');
        cy.wait('@ES');

        cy.get(_radio).first().check();
        cy.wait('@ES');

        cy.get(_checkbox).first().check();
        cy.wait('@ES');

        cy.get(_RESET).click();
        cy.wait('@ES');

        /*
        cy.get(_SEARCHBOX).should('be.empty');
        cy.get(_SEARCH_DATALIST).should('be.empty');
        cy.get(_SELECTED_SUGGESTIONS).should('be.empty');
        cy.get(_from).should('be.empty');
        cy.get(_to).should('be.empty');
        cy.get(_radio).first().should('not.be.checked');
        cy.get(_checkbox).first().should('not.be.checked');
        cy.get(_FILTERS).should('be.empty');
        */
       
        cy.get(_HITS).contains('1002 results found');
    });
});