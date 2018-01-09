<template>
    <div class="is-component is-search-button">
        <input class="is-button is-search-button" type="button" :value='this.text' v-on:click='this.clickOn' />
    </div>
</template>

<script>
    import Generics from './../lib/generics';

    export default {
        name : 'search-button',
        mixins : [Generics],

        props : {
            // text : set the text into the input button
            "text" : {
                type : String,
                default : "Search"
            }
        },

        methods : {
            clickOn : function() {
                // Clear debounce actions
                //this.executeSearch.clear(); ON SEARCHBOX COMPONENT

                // Execute request
                this.fetch();
            }
        }
    };
</script>
