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

                // Object containing the full ES request
                Request : {},

                // Specific request for queries (equivalent to "query" object in Request)
                Query : {
                    test : "blblbl"
                }
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
                }
            },

            getters : {
                GetHeader : state => {
                    return state.Header;
                }
            }
        },


        /*
            Elasticsearch Request  Store
        */
        Request : {
            state : {
                hits : {
                    items : [],
                    score : null
                },
                filters : [],
        
                query : {},
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
