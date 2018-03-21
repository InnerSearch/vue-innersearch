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
                //default : null
                default : '<strong>{v}</strong>'
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
                mutableField : this.field,
                mutablePatternHtml : this.htmlPattern
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
                    let _suggsRequest = this.createRequestForAutocomplete(value, this.mutableField, this.pattern, this.size);
                    this.header.client.search(_suggsRequest).then(response => {
                        console.log("Response", response.hits.hits);
                        this.suggestions = response.hits.hits;
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

            AddPatternStyle : function(hit, value) {
                this.mutableField.forEach(field => {
                    let _fieldValue = hit[field];
                    this.mutablePatternHtml.forEach(pattern => {
                        let _regex = new RegExp(this.pattern.replace(/{v}/, "(" + value + ")"), 'ig');
                        let _match;
                        while ((_match = _regex.exec(_fieldValue)) !== null) {
                            let _in = pattern.replace(/{v}/, _match[1]);
                            let _out = _fieldValue.split(_match[1]);
                            let _outText = '';
                            _out.forEach(out => {
                                if (out.length > 0)
                                    _outText += pattern.replace(/{u}/, out)
                            });

                            //console.log(_in, _outText);
                            // split by something
                        }
                            

                        //console.log(this.pattern.replace(/{v}/, "(" + value + ")"));
                        //console.log(pattern.replace(/{v}/, value), _fieldValue);
                    });
                });
            },

            clickOnItem : function(item) {
                this.$emit('selectItem', item._source);
                this.itemWasClicked = true; // avoid conflit when the clicked item changes the input that triggers once again updateSuggestion()
                this.hide();
            }
        },
        
        created : function() {
            // Convert field to array if it's not the case
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];

            if (!Array.isArray(this.mutablePatternHtml) && this.mutablePatternHtml !== null)
                this.mutablePatternHtml = [this.mutablePatternHtml];
        }
    };
</script>
