import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    modules : {
        /*
            Elasticsearch header Store
                For API ES object
                For Request
        */
        Elasticsearch : {
            namespaced : true,

            state : {
                // ElasticSearch server informations
                header : {
                    client : {},
                    index : "",
                    type : ""
                },

                // Request
                body : undefined,

                // Composants d'une requête:
                instructions : [],

                // Aggragations
                aggregations : {
                    'gender' : [] // TO FIX
                },

            },

            mutations : {
                setHost (state, value) {
                    state.header.client = value;
                },

                setIndex (state, value) {
                    state.header.index = value;
                },

                setType (state, value) {
                    state.header.type = value;
                },

                setBody (state, value) {
                    state.body = value;
                },

                addInstruction (state, value) {
                    state.instructions.push(value);
                },

                removeInstruction (state, value) {
                    state.instructions = state.instructions.filter(function(object) {
                        return object !== value;
                    });
                },

                setAggregations (state, { name, value }) {
                    state.aggregations[name] = value;
                }
            },

            getters : {
                getHeader : state => {
                    return state.header;
                },

                getProperties : state => {
                    return state.properties;
                },

                getBody : state => {
                    return state.body;
                },

                getInstructions : state => {
                    return state.instructions;
                },

                getAggregations : state => {
                  return state.aggregations;
                }
            }
        },


        /*
            Results Store
        */
        result : {
            state : {
                hits : {
                    items : [],
                    score : null
                },
            },

            getters : {
                getHits : state => {
                    return state.hits;
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
        aggs : {}, // [{ key : 69 }, { key : 69 }],

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

        createAgg (state, name) {
            state.aggs[name] = [69, 69];
        },

        setAggs (state, obj) {
          //console.log("[Store:setAggs] Aggregations object :", obj);
          //console.log("[Store:setAggs] Aggregations key :", obj.key);
          state.aggs[obj.key] = obj.value;
          console.log("[Store:setAggs] items :", state.aggs);
        },

/*         setAggsDebug(state, value) {
            state.aggs[0].key += value;
            //state.aggs[0] += value;
        } */
    },

    getters : {
        getAggs : state => {
        return state.aggs;
        }
    },

/*     actions : {
        setAggss ({ commit }) {
            commit('setAggs')
        }
    } */
});
