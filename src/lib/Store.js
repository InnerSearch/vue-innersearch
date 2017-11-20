import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
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
        state.query.body.query.bool.filter.bool.must = state.filters; // update filters
        return state.query;
      }
    }
});
