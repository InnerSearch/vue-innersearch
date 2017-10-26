import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state : {
        hits : {
            items : [],
            score : null
        }
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
        }
    }
});