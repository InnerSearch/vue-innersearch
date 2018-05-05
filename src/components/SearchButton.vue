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
            this.CID = this.addComponent(Component.SEARCHBUTTON, this);
        }
    };
</script>
<style>
    .is-component.is-search-button {
        display : inline-block;
        margin : 5px 10px 5px 0;
        border : 0;
    }

    .is-button.is-search-button {
        color : #fff;
        background-color : #337ab7;
        border-color : #2e6da4;
    }

    .is-button.is-search-button:hover {
        color : #fff;
        background-color : #286090;
        border-color : #204d74;
    }

    .is-button.is-search-button:active {
        color : #fff;
        background-color : #286090;
        border-color : #204d74;
    }

    .is-button.is-search-button:focus {
        color : #fff;
        background-color : #286090;
        border-color : #122b40;
    }
</style>