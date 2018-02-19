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
                debounce : [],

                // Components identification for interactions
                components : {
                    CID : 0, // Static component counter
                    bus : new Vue(), // communication bus
                    list : {
                        refinementListFilter : [],
                        paginate : []
                    }
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
                  console.log(orderDirection,orderKey,isDynamic);
                    if (isDynamic) {
                        Vue.set(state.aggregations, name, value);
                        console.log(state.aggregations);
                    }
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

                                if (_found === undefined)
                                    agg.doc_count = 0;
                                else
                                    agg.doc_count = _found.doc_count;
                            });

                            // Wtf are you doing here ???

                            //console.log(_aggs);
                            // Sorting aggs in terms of orderKey and orderDirection
/*                             _aggs.sort((e,e2) => {
                              if(orderDirection==="asc"){
                                if(orderKey==="_term"){
                                  return e.key - e2.key;
                                }else {
                                  return e.doc_count - e2.doc_count;
                                }
                              }else {
                                if(orderKey==="_term"){
                                  return e2.key - e.key;
                                } else {
                                  return e2.doc_count - e.doc_count;
                                }
                              }
                            });
                            console.log(_aggs); */
                        }

                        // Save the new agg object
                        Vue.set(state.aggregations, name, _aggs);
                        //state.aggregations = {...state.aggregations , [name] : _aggs};
                    }
                },

                addDebounce(state, value) {
                    state.debounce.push(value);
                },

                resetDebounce(state) {
                    state.debounce.forEach(debounce => {
                        debounce.clear();
                    });
                },

                addComponent(state, value) {
                    let ID = value + '_C' + state.components.CID++;
                    state.components.list[value].push(ID);
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
                    return state.components.list;
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
