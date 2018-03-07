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
            // get back the input value from the parent component
            'entry' : {
                type : String
            },

            // get back the fields from the parent component
            'field' : {
                type : [String, Array]
            },

            // get back the pattern from the parent component
            'pattern' : {
                type : String
            },

            // timeout : duration between two requests (in ms)
            'timeout' : {
                type : Number,
                default : 300
            },

            // htmlPattern : formate the output
            'htmlPattern' : {
                type : String,
                default : null
                // default : '<strong>{v}</strong>'
                // default : '<strong>{r}</strong>'
                // default : ['<strong>{v}</strong>', '<u>{r}</u>']
            },

            // size : count of elements to show in the box
            'size' : {
                type : Number,
                default : 10
            }
        },

        data : function() {
            return {
                suggestions : [],
                itemWasClicked : false,
                mutableField : this.field
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
                // Reset suggestions
                this.suggestions = [];

                // Check if value is not empty,  if it is, the component is hidden
                if (value.trim().length > 0) {

                    // Update suggestions
                    let _suggsRequest = this.createRequestForAutocomplete(value, this.field, this.pattern, this.size);
                    this.header.client.search(_suggsRequest).then(response => {
                        response.hits.hits.forEach(hit => {
                            this.suggestions.push(hit._source);
                        });
                    });

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
            // Convert field to array if it's not the case
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];
        }
    };
</script>
