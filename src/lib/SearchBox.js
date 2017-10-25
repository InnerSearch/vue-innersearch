export default {
    name : 'searchbox',

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
                        prefix : {
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

    mounted : function() {
        // Autofocus property
        this.$el.autofocus = this.autofocus || false;

        // Realtime property
        if (this.realtime)
            this.previewEl = this.$el.parentNode.insertBefore(document.createElement("div"), this.$el.nextSibling);

        // Placeholder property
        this.$el.setAttribute("placeholder", this.placeholder);
    }
};