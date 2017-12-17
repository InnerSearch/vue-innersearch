<template>
    <div class="is-component is-search-button">
        <input class="is-button is-search-button" type="button" :value='this.text' v-on:click='this.ClickOn' />
    </div>
</template>

<script>
    import Generics from './../lib/Generics';

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
            ClickOn : function() {
                this.Fetch();
            }
        }
    };
</script>
