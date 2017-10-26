<template>
    <input class='searchbox' type='text' v-model='entry' />
</template>

<script>
    import ElasticSearch from '@/lib/ElasticSearch';
    import Store from '@/lib/Store';
    import Generics from '@/lib/Generics';

    export default {
        name : 'searchbox',
        mixins : [Generics],

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
                //var elt = this.previewEl;
                //elt.innerHTML = "";

                // ElasticSearch request
                ElasticSearch.Client.search({
                    index : ElasticSearch.Index,
                    type : query.type,
                    body : {
                        from : 0,
                        size : 100,
                        query : {
                            prefix : {
                                [query.prop] : val
                            }
                        }
                    }
                }).then(function (resp) {
                    Store.commit("Reset");
                    var hits = resp.hits.hits;
                    console.log(hits);
                    if (hits.length === 0) {
                        //elt.innerHTML = "<p>Aucun résultat</p>";
                        Store.commit("Score", 0);
                    }
                    else {
                        var score = 0;
                        hits.forEach((obj) => {
                            score++;
                            //elt.innerHTML += "<p>";
                            //for (var prop in obj._source)
                            //    elt.innerHTML += "<div><strong>" + prop + "</strong> : " + obj._source[prop] + "</div>";
                            //elt.innerHTML += "</p>"; 
                            //console.log(Store.state.hits);
                            Store.commit("Item", obj);
                        });
                        Store.commit("Score", score);
                    }
                }, function (err) {
                    //elt.innerHTML = "<p>Aucun résultat</p>";
                    Store.commit("Score", 0);
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
</script>