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

                // Request instructions
                instructions : [],

                // Aggregations
                aggregations : {},

                // Hanged debounce list
                debounce : {
                    searchbox : [],
                    searchdatalist : []
                },

                // Components identification for interactions
                components : {
                    CID : 0, // Static component counter
                    bus : new Vue(), // communication bus
                    refs : {}
                }
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

                setAggregations (state, { name, value, isDynamic, orderKey, orderDirection }) {
                    if (isDynamic)
                        Vue.set(state.aggregations, name, value);
                    else {
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

                                if (_found === undefined){
                                  /***
                                   * Fix for issue #4
                                   * just command the line under
                                   * we dont update doc_count to 0
                                   * maybe not....
                                   */
                                  agg.doc_count = 0;
                                }

                                else
                                    agg.doc_count = _found.doc_count;
                            });

                            // Sorting aggs in terms of orderKey and orderDirection
                            if(orderKey==="_count"){
                                _aggs.sort((e,e2) => {
                                    if(orderDirection==="asc"){

                                        return e.doc_count - e2.doc_count;
                                    }else {
                                        return e2.doc_count - e.doc_count;
                                    }
                                });
                            }
                        }
                        // Save the new agg object
                        Vue.set(state.aggregations, name, _aggs);
                    }
                },

                addDebounce(state, value) {
                    state.debounce[value.component].push(value.debounce);
                },

                resetDebounce(state, value) {
                    if (value !== null) {
                        let _obj = state.debounce[value];
                        _obj.forEach(debounce => {
                            debounce.clear();
                        });
                    }
                    else {
                        for (let key in state.debounce) {
                            if (!state.debounce.hasOwnProperty(key)) continue;

                            let _obj = state.debounce[key];
                            _obj.forEach(debounce => {
                                debounce.clear();
                            });
                        }
                    }
                },

                addComponent(state, value) {
                    if (state.components.refs[value.type] === undefined)
                        state.components.refs[value.type] = [];

                    state.components.refs[value.type].push(value.self);
                    ++state.components.CID;
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
                },

                getCid : state => {
                    return state.components.CID;
                },

                getBus : state => {
                    return state.components.bus;
                },

                getComponents : state => {
                    return state.components.refs;
                }
            }
        },


        /*
            Hits Store
        */
        Hits : {
            namespaced : true,

            state : {
                // Hits list
                items : [],

                // Hits count
                score : undefined
            },

            mutations : {
                addItem (state, value) {
                    state.items.push(value);
                },

                clearItems (state) {
                    state.items = [];
                },

                setScore (state, value) {
                    state.score = value;
                },
            },

            getters : {
                getItems : state => {
                    return state.items;
                },

                getScore : state => {
                    return state.score;
                }
            }
        }
    }
});
