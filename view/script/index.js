/*
 * Doc : https://www.elastic.co/guide/en/elasticsearch/reference/current/_introducing_the_query_language.html
 */

/*
 *  Global functions
 */
const generics = {
    methods: {
        GetQuery : function(query) {
            let vals = query.split(".");
            return {
                type : vals[0],
                prop : vals[1]
            };
        }
    }
};

/*
 * Search components
 */

 /* Output store */
const output = new Vuex.Store({
    state: {
        hits : {
            items : [],
            score : null
        }
    },

    mutations: {
        Score (state, value) {
            state.hits.score = value;
        },

        Item (state, value) {
            state.hits.items.push(value);
        },

        Reset (state) {
            state.hits.items = [];
        }
    }
})

/* Hits component */
const hits = Vue.component("hits", {
    mixins : [generics],

    data : function() {
        return {
            hits : output.state.hits
        };
    },

    template : `
        <section>
            <strong v-if="hits.score === 0">No result found</strong>
            <strong v-else-if="hits.score === 1">1 result found</strong>
            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>

            <div style="margin : 20px 0;" v-for="item in hits.items">
                <div><strong>Name :</strong> {{ item._source.nom }}</div>
                <div><strong>Adr :</strong> {{ item._source.adresse_texte }}</div>
            </div>
        </section>
    `
});

/* Textbox component */
const searchBox = Vue.component("searchbox", {
    mixins : [generics, hits],

    props : {
        "autofocus" : {
            type : Boolean,
            default : false
        },
        "realtime" : {
            type : Boolean,
            default : false
        },
        "queries" : {
            type : Array
        },
        "placeholder" : {
            type : String,
            default : "Search"
        }
    },

    data : function() {
        return {
            entry : null,
            previewEl : null
        };
    },

    computed : {
        Entry : function() {
            return this.entry;
        }
    },

    watch : {
        Entry : function(val) {
            var query = this.GetQuery(this.queries[0]);

            // HTML result tag
            var elt = this.previewEl;
            elt.innerHTML = "";

            // ElasticSearch request
            CaloSearch.Client.search({
                index : CaloSearch.Index,
                type : query.type,
                body : {
                    query : {
                        match : {
                            [query.prop] : val
                        }
                    }
                }
            }).then(function (resp) {
                output.commit("Reset");
                var hits = resp.hits.hits;
                if (hits.length === 0) {
                    //elt.innerHTML = "<p>Aucun résultat</p>";
                    output.commit("Score", 0);
                }
                else {
                    var score = 0;
                    hits.forEach((obj) => {
                        score++;
/*                         elt.innerHTML += "<p>";
                        for (var prop in obj._source)
                            elt.innerHTML += "<div><strong>" + prop + "</strong> : " + obj._source[prop] + "</div>";
                        elt.innerHTML += "</p>"; */
                        output.commit("Item", obj);
                    });
                    output.commit("Score", score);
                }
            }, function (err) {
                //elt.innerHTML = "<p>Aucun résultat</p>";
                output.commit("Score", 0);
            });
        }
    },

    template : "<input type='text' v-model='entry' />",

    mounted : function() {
        // Autofocus property
        this.$el.autofocus = this.autofocus || false;

        // Realtime property
        if (this.realtime)
            this.previewEl = this.$el.parentNode.insertBefore(document.createElement("div"), this.$el.nextSibling);

        // Placeholder property
        this.$el.setAttribute("placeholder", this.placeholder);
    }
});