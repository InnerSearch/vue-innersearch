<template>
    <div class="is-component is-search-button">
        <input class="is-button is-search-button" type="button" :value='this.text' v-on:click='this.clickOn' />
    </div>
</template>

<script>
    import Generics from './../lib/Generics';
    import { Component } from '../lib/Enums.js';

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

        data : function() {
            return {
                CID : undefined
            }
        },

        methods : {
            clickOn : function() {
                // Execute request
                this.fetch();
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.SEARCH_BUTTON, this);
        }
    };
</script>