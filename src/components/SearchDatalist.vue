<template>
    <section>
        <div class='is-search-datalist-items'>
            <ul>
                <li v-for='(selection, index) in selections' :key='index' @click='remove(index)'>
                    <slot name='items' v-bind:item='selection'>
                        {{ selection }}
                    </slot>
                </li>
            </ul>
        </div>
        <div class='is-component is-search-datalist'>
            <div class='is-icon is-search-datalist' v-on:click='focus()'></div>
            <input class='is-field is-search-datalist' type='text' ref='input' v-model='entry' @keydown.down='next()' @keydown.up='previous()' @keydown.esc='hideSuggestions()' @keydown.enter='enter()' />
        </div>
        <div class='is-search-datalist-suggestions' v-if='showSuggestions'>
            <ul ref="suggestionBox">
                <li class='noresult' v-show='suggestions.length === 0'>
                    <slot name='nosuggestion' v-bind:value='entry'>
                        No result for "{{ entry }}"
                    </slot>
                </li>
                <li v-for='(suggestion, index) in suggestions' :key='index' @click='add(index)' @mouseenter='select(index)' @mouseleave='unselect()' ref='suggestions'>
                    <slot name='suggestions' v-bind:suggestion='suggestion'>
                        {{ suggestion }}
                    </slot>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import generics from './../lib/Generics';
    import debounce from 'debounce';

    export default {
        name : 'datalist',
        mixins : [generics],

        props : {
            // realtime : it defines if the Store object is updated for each change of the input
            'realtime' : {
                type : Boolean,
                default : false
            },
            
            // fields on which the search is done
            'field' : {
                type : [String, Array]
            },

            // fields on which the autcomplete box is filled up
            'suggestion' : {
                type : [String, Array]
            },

            // itemOperator : logical operator applied betwen each item
            'itemOperator' : {
                type : String,
                default : 'OR'
            },

            // propertyOperator : logical operator applied for each property of a specific item
            'propertyOperator' : {
                type : String,
                default : 'OR'
            },

            // suggestionOperator : logical operator applied for suggestions
            'suggestionOperator' : {
                type : String,
                default : 'OR'
            },

            // size : count of elements to show in the box
            'size' : {
                type : Number,
                default : 10
            },

            // placeholder : text which appears into the input
            'placeholder' : {
                type : String,
                default : 'Search'
            }
        },

        data : function() {
            return {
                entry : '', // input value
                mutableField : this.field, // editable fields param
                mutableSuggestion : this.suggestion, // editable suggestion fields param
                itemFun : undefined, // function applied for items
                propertyFun : undefined, // function applied for propertie(s) of an item
                suggestionFun : undefined, // function applied for suggestion search
                localInstructions : [], // local request
                showSuggestions : false, // show suggestions list
                selections : [], // selected items
                suggestions : [], // suggestions list
                highlightedSuggestion : undefined // current selected suggestion
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            },

            computedSelections : function() {
                return this.selections;
            }
        },

        watch : {
            computedEntry : function(value) {
                if (value.trim() !== '')
                    this.updateItems(value);
                else
                    this.hideSuggestions();
            },

            computedSelections : function(selections) {
 				// Reset all deep instructions of local request
				this.localInstructions.forEach(instruction => {
					this.removeInstruction(instruction);
				});
				this.localInstructions = [];

                // Case where the selection array is not empty : we add instructions
                if (selections.length > 0) {
                    // Local request data initialization for each field selection
                    let _instruction = {
                        fun : 'filter',
                        args : ['bool', arg => {
                            this.selections.forEach(selection => {
                                arg[this.itemFun]('bool', sub => {
                                    this.mutableField.forEach(attr => {
                                        sub[this.propertyFun]('prefix', attr, selection._source[attr].toLowerCase());
                                    });

                                    return sub;
                                })
                            });

                            return arg;
                        }]
                    };

                    this.localInstructions.push(_instruction);
					this.addInstruction(_instruction);
                }

                // Update the request
                this.mount();
            }
        },

        methods : {
            // Focus on input
            focus : function() {
                this.$nextTick(function () {
                    this.$refs.input.focus();
                });
            },

            // Triggered when the input changes
            updateItems : function(value) {
                // Reset suggestions
                this.suggestions = [];

                // Update suggestions
                let _suggsRequest = this.createRequestForSuggs(value, this.mutableSuggestion, this.selections, this.suggestionFun, this.size);
                this.header.client.search(_suggsRequest).then(response => {
                    //console.log("Request", _suggsRequest, "Response", response.hits.hits);
                    this.suggestions = response.hits.hits;

                    // Show the box
                    this.showSuggestions = true;
                });
            },

            // Hide the autosuggestion box
            hideSuggestions : function() {
                this.showSuggestions = false;
                this.unselect();
            },

            // Add a suggested item
            add : function(index) {
                this.selections.push(this.suggestions[index]);
                this.entry = '';
                this.hideSuggestions();
                this.focus();
            },

            // Remove a suggested item
            remove : function(index) {
                this.selections.splice(index, 1);
            },

            // Select (highlight) a suggested item
            select : function(index) {
                let _el = this.$refs.suggestions[index];
                if (_el !== undefined) {
                    if (this.highlightedSuggestion !== undefined)
                        this.unselect();

                    this.highlightedSuggestion = index;
                    _el.classList.add('selected');
                }
            },

            // Unselect a suggested item
            unselect : function() {
                let _index = this.highlightedSuggestion,
                    _el = this.$refs.suggestions;
                if (_el !== undefined && _el[_index] !== undefined) {
                    this.highlightedSuggestion = undefined;
                    _el[_index].classList.remove('selected');
                }
            },

            // Select the next suggestion from highlighted item
            next : function() {
                let _index = this.highlightedSuggestion;
                if (_index === undefined)
                    this.selectAndScroll(0);
                else
                    this.selectAndScroll((_index + 1) % this.suggestions.length);
            },

            // Select the previous suggestion from highlighted item
            previous : function() {
                let _index = this.highlightedSuggestion,
                    _size = this.suggestions.length;
                if (_index === undefined)
                    this.selectAndScroll(_size - 1)
                else
                    this.selectAndScroll((((_index - 1) % _size) + _size) % _size)
            },

            // When 'enter' is pushed, add the highlighted item to the selections array
            enter : function() {
                if (this.showSuggestions) {
                    // If an item is selected
                    let _index = this.highlightedSuggestion;
                    if (_index !== undefined && this.$refs.suggestions[_index] !== undefined)
                        this.add(_index);

                    this.hideSuggestions();
                }
            },
            
            // Scroll function
            selectAndScroll : function(index) {
                let _itemHeight = this.$refs.suggestions[index].offsetHeight;
                this.select(index);
                this.$refs.suggestionBox.scrollTo(0, index * _itemHeight);
            }
        },

        mounted : function() {
            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        },

        created : function() {
            // Convert field string to field array
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];

            // Convert suggestion string to suggestion array
            if (!Array.isArray(this.mutableSuggestion))
                this.mutableSuggestion = [this.mutableSuggestion];

            // Functions calculation depending on operator
            this.itemFun = (this.itemOperator.toUpperCase() === 'AND') ? 'filter' : 'orFilter';
            this.propertyFun = (this.propertyOperator.toUpperCase() === 'AND') ? 'filter' : 'orFilter';
            this.suggestionFun = (this.suggestionOperator.toUpperCase() === 'AND') ? 'filter' : 'orFilter';
        }
    };
</script>
