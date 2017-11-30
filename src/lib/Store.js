import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    modules : {
        /*
            Elasticsearch Header Store
                For API ES object
                For Request
        */
        Elasticsearch : {
            namespaced : true,

            state : {
                // ElasticSearch server informations
                Header : {
                    Client : {},
                    Index : "",
                    Type : ""
                },

                // Specific properties
                Properties : {
                    from : 0,
                    size : 100
                },

                // Request
                Query : {
                    bool : {
                        must : {
                            prefix: {}
                        },
                        filter : {
                            bool : {}
                        }
                    }
                },
            },

            mutations : {
                SetHost (state, value) {
                    state.Header.Client = value;
                },

                SetIndex (state, value) {
                    state.Header.Index = value;
                },

                SetType (state, value) {
                    state.Header.Type = value;
                },

                SetFrom (state, value) {
                    state.Properties.From = value;
                },

                SetSize (state, value) {
                    state.Properties.Size = value;
                },

                SetQuery (state, value) {
                    state.Query = value;
                }
            },

            getters : {
                GetHeader : state => {
                    return state.Header;
                },

                GetProperties : state => {
                    return state.Properties;
                },

                GetQuery : state => {
                    return state.Query;
                }
            }
        },


        /*
            Elasticsearch Request Store
        */
        Request : {
            state : {
                Hits : {
                    Items : [],
                    Score : null
                },
                Filters : []
            },

            getters : {
                GetHits : state => {
                    return state.Hits;
                }
            }


        }
    },



    state : {
        hits : {
            items : [],
            score : null
        },
        filters : [],

        query : {},
    },

    mutations : {
        Score (state, value) {
            state.hits.score = value;
        },

        Item (state, value) {
            state.hits.items.push(value);
        },

        Reset (state) {
            state.hits.items = [];
        },

        setFilter (state, value) {
            state.filters = value;
        },

        setQuery(state,value){
          state.query = value;
        }


    },

    getters : {
        getFilters : (state) => () => {
            return state.filters;
        },

        getQuery : (state) => () => {
          console.log(state.query);
            state.query.body.query.bool.filter.bool.must = state.filters; // update filters
        return state.query;
        }
    }
});
