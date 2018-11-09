import Vue from 'vue';

export default {
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
        debounce : {},

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

        setAggregations (state, { name, value, orderKey, orderDirection }) {
            Vue.set(state.aggregations, name, value);
        },

        addDebounce(state, value) {
            if (state.debounce[value.component] === undefined)
                state.debounce[value.component] = [];
            state.debounce[value.component].push(value.debounce);
        },

        resetDebounce(state, value) {
            if (value !== null) {
                let _obj = state.debounce[value];
                if (_obj !== undefined) {
                    _obj.forEach(debounce => {
                        debounce.clear();
                    });
                }
            }
            else {
                for (let key in state.debounce) {
                    if (!state.debounce.hasOwnProperty(key)) continue;

                    let _obj = state.debounce[key];
                    if (_obj !== undefined) {
                        _obj.forEach(debounce => {
                            debounce.clear();
                        });
                    }
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
}