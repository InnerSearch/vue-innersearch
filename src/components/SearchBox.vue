<template>
    <input class='searchbox' type='text' v-model='entry' />
</template>

<script>
    import Store from '@/lib/Store';

    export default {
        name : 'searchbox',
        //mixins : [Generics],
        props : {
            // autofocus : if the input is focused when the user load the page
            "autofocus" : {
                type : Boolean,
                default : false
            },

            // realtime : if the Store object is updated for each change of the input
            "realtime" : {
                type : Boolean,
                default : false
            },

            // case-sensitive : if text is case sensitive
            "case-sensitive" : {
                type : Boolean,
                default : false
            },

            // queries : contains the query request; each properties are separeted by a comma
            // values of Array : [String|Object]
            "queries" : {
                type : Array,
                required: true
            },

            // placeholder : text which appears into the input
            "placeholder" : {
                type : String,
                default : "Search"
            }
        },

        data : function() {
            return {
                entry : null, // input value
                Generics : this.$parent
            };
        },

        computed : {
            Entry : function() {
                return this.entry;
            }
        },

        watch : {
            Entry : function(val) {
                // Convert an array of properties to an ES request
                var query = this.Generics.GetQuery(this.queries[0]);
                console.log(this.Generics.Elasticsearch.Client);
                // ElasticSearch request
              this.Generics.Elasticsearch.Client.search({
                    index : this.Generics.Elasticsearch.Index,
                    type : query.type,
                    body : {
                        from : 0,
                        size : 100,
                        query : {
                            bool : {
                              must : {
                                prefix: {
                                  [query.prop]: val
                                }
                              }
                              ,
                              filter : {
                                bool : {
                                  must: Store.getters.getFilters()
                                }
                              }
                            }
                        }
                    }
                }).then(function (resp) {
                    Store.commit("Reset");
                    var hits = resp.hits.hits;
                    console.log(resp);
                    if (hits.length === 0) {
                        Store.commit("Score", 0);
                    }
                    else {
                        var score = 0;
                        hits.forEach((obj) => {
                            score++;
                            Store.commit("Item", obj);
                        });
                        Store.commit("Score", resp.hits.total);
                    }
                }, function (err) {
                    Store.commit("Score", 0);
                });
            }
        },

        methods : {
            Prefix : function(property) {
                console.log("Hey");
            }
        },

        mounted : function() {
            // Add autofocus property to html tag
            this.$el.autofocus = this.autofocus || false;

            // Realtime property TODO
            /*if (this.realtime)
                this.previewEl = this.$el.parentNode.insertBefore(document.createElement("div"), this.$el.nextSibling);*/

            // Add placeholder property to the input html tag
            this.$el.setAttribute("placeholder", this.placeholder);
        },
        created : function () {
          console.log(this.Generics.Elasticsearch.Client.transport.connectionPool._config.host);
        }
    };
</script>
