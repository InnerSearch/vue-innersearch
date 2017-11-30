import Vue from 'vue';
import Vuex from 'vuex';
import Bodybuilder from 'bodybuilder';
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

                // Request
                Bodybuilder : Bodybuilder().from(0).size(10),

                // Filters
                Filters : []
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
            },

            getters : {
                GetHeader : state => {
                    return state.Header;
                },

                GetProperties : state => {
                    return state.Properties;
                },

                GetBodybuilder : state => {
                    return state.Bodybuilder;
                }
            }
        },


        /*
            Elasticsearch Request Store
        */
        Result : {
            state : {
                Hits : {
                    Items : [],
                    Score : null
                }
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
