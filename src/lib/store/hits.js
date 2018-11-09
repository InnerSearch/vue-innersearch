export default {
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