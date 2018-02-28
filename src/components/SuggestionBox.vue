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
            // get back the input parent value
            'entry' : {
                type : String
            },

            // timeout : duration between two requests (in ms)
            'timeout' : {
                type : Number,
                default : 300
            },

            // pattern : formate the output
            'pattern' : {
                type : String,
                default : null
                // default : '<strong>{v}</strong>'
            }
        },

        data : function() {
            return {
                itemWasClicked : false,
                suggestions : []
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            },
        },

        watch : {
            computedEntry : function(value) {
                this.updateSuggestion(value);
            }
         },

        methods : {
            show : function() {
                this.$emit('changeState', true);
            },

            hide : function() {
                this.$emit('changeState', false);
            },

            updateSuggestion : function(value) {
                console.log(value);

                // Check if value is not empty,  if it is, the component is hidden
                if (value.trim().length > 0) {

                    // Check if the component should be hidden or not (not triggered when an item is selected)
                    if (!this.itemWasClicked)
                        this.show();
                    else
                        this.itemWasClicked = !this.itemWasClicked;

                }
                else
                    this.hide();
            },

            clickOnItem : function(item) {
                this.$emit('selectItem', item);
                this.itemWasClicked = true; // avoid conflit when the clicked item changes the input that triggers once again updateSuggestion()
                this.hide();
            }
        },
        
        created : function() {
            this.suggestions.push("choix 1");
            this.suggestions.push("choix 2");
        }
    };
</script>
