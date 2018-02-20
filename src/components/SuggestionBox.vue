<template>
    <div class='is-component is-suggestion-box'>
        <ul>
            <li v-for="(item, index) in suggestions" :key="index" :item="item" v-on:click='clickOnItem(item)'>
                <slot name="suggestions" v-bind:suggestion="item"></slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import Generics from './../lib/Generics';

    export default {
        name : 'suggestion-box',
        mixins : [Generics],

        props : {
            'entry' : {
                type : String
            },

            // hightlight : 
            // not a property : add a slot to <suggestionbox> looks like : <span slot="highlight" slot-scope="{ matched }"><strong><u>{{ matched }}</u></strong></slot>

            // see how to implemant clean requests


            // timeout : duration between two requests (in ms)
            'timeout' : {
                type : Number,
                default : 300
            }
        },

        data : function() {
            return {
                suggestions : []
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(val) {
                // Do job
            }
         },

        methods : {
            updateSuggestion : () => {
                
            },

            clickOnItem : function(item) {
                this.$emit('selectItem', item);
            }
        },
        
        created : function() {
            this.suggestions.push({
                key : "choix 1",
                value : "truc bidulemiche"
            }, {
                key : "choix 2",
                value : "truc bidulemiche"
            });
        }
    };
</script>
