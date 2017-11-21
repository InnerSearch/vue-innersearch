import search from "./../../src/lib/search";

const urlApp = "http://localhost:4000/"

const getInfoList = (data, label) => {
    return data.hits.hits.map(e => e["_source"][label])
}

const testPair = {
    label: "label",
    str: "ta"
}

describe("Search by query (function)", () => {
    it("should return results corresponding the query string", () => {
        const {label, str} = testPair;
        search(label, str).then(response => {
            const arr = getInfoList(response, label);
            const regex = new RegExp(str);
            arr.forEach(e => {
                expect(regex.test(e.toLowerCase())).to.equal(true)
            })
        })
    })
})

const retriveInfoList = (cy, DOMQuery) => {
    const results = cy.get(DOMQuery);
    var tmp = results.get("div").text();
    console.log(tmp)
}

describe("Search by query (website)", () => {
    it("should show results corresponding the query string", () => {
        const {label, str} = testPair;
        cy.visit(urlApp);
        
        cy.get(".id-searchbox")
          .type(str)
          .should("have.value", str);

        //retriveInfoList(cy, "section")
    })
})
    
// describe('Test number one', () => {
//   beforeEach(function() {
//     cy.visit('http://localhost:4000');
//     cy.server();
//   })
//   it('testing search and hits result score' , function () {
//       cy.get('.searchbox')
//           .type('aurelia')
//           .should('have.value', 'aurelia')
//       cy.get('.score').contains('1 result found');
//   })

//   it('searchbox is autofocus' , function () {
//     cy.focused().should('have.class','searchbox');
//   });

