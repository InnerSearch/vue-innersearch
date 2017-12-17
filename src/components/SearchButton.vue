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
            // autofocus : if the input is focused when the user load the page
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
