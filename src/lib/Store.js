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
                aggregations : {},

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
                    let _aggs = state.aggregations[name];

                    // Initialization : the agg object doesn't still exist
                    if (_aggs === undefined)
                        _aggs = value;

                    // Update : the agg object still exists, we just update it
                    else {
                        _aggs.forEach(agg => {
                            let _found = value.filter(obj => {
                                return obj.key === agg.key;
                            })[0];

                            if (_found === undefined)
                                agg.doc_count = 0;
                            else
                                agg.doc_count = _found.doc_count;
                        });
                    }

                    // Save the new agg object
                    Vue.set(state.aggregations, name, _aggs);
                    //state.aggregations = {...state.aggregations , [name] : _aggs};
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
