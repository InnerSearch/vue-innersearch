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
    import { Component } from '../lib/Enums.js';

    export default {
        name : 'search-datalist',
        mixins : [generics],

        props : {
            // realtime : it defines if the Store object is updated for each change of the input
            'realtime' : {
                type : Boolean,
                default : false
            },

            // timeout : independant of realtime, duration between two requests (in ms) for suggestion query
            'timeout' : {
                type : Number,
                default : 300
            },
            
            // fields on which the search is done
            'field' : {
                type : [String, Array]
            },

            // fields on which the autcomplete box is filled up
            'suggestion' : {
                type : [String, Array]
            },

            // ES function used for item search
            'function' : {
                type : String,
                default : 'match'
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
                CID : undefined,
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
                this.removeInstructions();
                
                // Case where the selection array is not empty : we add instructions
                if (selections.length > 0) {
                    // Local request data initialization for each field selection
                    let _instruction = {
                        fun : 'filter',
                        args : ['bool', arg => {
                            this.selections.forEach(selection => {
                                arg[this.itemFun]('bool', sub => {
                                    this.mutableField.forEach(attr => {
                                        sub[this.propertyFun](this.function, attr, selection._source[attr].toLowerCase());
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
            // Execute the mixins Fetch method to update hits
            executeSearch : function() {
                this.fetch();
            },

            // Focus on input
            focus : function() {
                this.$nextTick(function () {
                    this.$refs.input.focus();
                });
            },

            // Triggered when the input changes
            updateItems : function(value) {
                // Update suggestions
                let _suggsRequest = this.createRequestForSuggs(value, this.mutableSuggestion, this.selections, this.suggestionFun, this.size);
                this.header.client.search(_suggsRequest).then(response => {
                    // Reset suggestions
                    this.suggestions = [];

                    this.suggestions = response.hits.hits;

                    // Show the box
                    this.showSuggestions = true;
                });
            },

            // Hide the autosuggestion box
            hideSuggestions : function() {
                // Stop any debounced request only for searchdatalist components
                this.resetDebounce('searchdatalist');

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
                this.focus();
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
            },

            // Reset items and input
            reset : function() {
                this.entry = '';
                this.selections = [];
            }
        },

        mounted : function() {
            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.SEARCHDATALIST, this);

            // Create a dynamic watcher on the input which calls the mixins Fetch function
            let _disableWatcherFetch = this.$watch(function() {
                return this.selections;
            }, {
                handler : function(val) {
                    this.executeSearch.call(this);
                },
                deep : true
            });

            // Behavior when realtime is disabled
            if (!this.realtime)
                _disableWatcherFetch(); // Disable the watcher that disable fetch event
            
            // Debounce for suggestion list update
            let _debounce = debounce(this.updateItems, this.timeout); // Debounce method with the timeout value on the current SeachOn function
            this.addDebounce('searchdatalist', _debounce); // Add debounce event to listed debounce into the Store
            this.updateItems = _debounce; // Apply debounce

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
<style>
    .is-component.is-search-datalist {
        display : flex;
        width : 90%;
        margin : 0 auto;
    }

    .is-icon.is-search-datalist {
        width : 50px;
        height : 50px;
        margin : 5px;
        background-image : url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KCgo8IS0tIFRoZSBpY29uIGNhbiBiZSB1c2VkIGZyZWVseSBpbiBib3RoIHBlcnNvbmFsIGFuZCBjb21tZXJjaWFsIHByb2plY3RzIHdpdGggbm8gYXR0cmlidXRpb24gcmVxdWlyZWQsIGJ1dCBhbHdheXMgYXBwcmVjaWF0ZWQuIApZb3UgbWF5IE5PVCBzdWItbGljZW5zZSwgcmVzZWxsLCByZW50LCByZWRpc3RyaWJ1dGUgb3Igb3RoZXJ3aXNlIHRyYW5zZmVyIHRoZSBpY29uIHdpdGhvdXQgZXhwcmVzcyB3cml0dGVuIHBlcm1pc3Npb24gZnJvbSBpY29ubW9uc3RyLmNvbSAtLT4KCgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgoKPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoKCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KCjxwYXRoIGlkPSJtYWduaWZpZXItMi1pY29uIiBkPSJNNDYwLjM1NSw0MjEuNTlMMzUzLjg0NCwzMTUuMDc4YzIwLjA0MS0yNy41NTMsMzEuODg1LTYxLjQzNywzMS44ODUtOTguMDM3CgoJQzM4NS43MjksMTI0LjkzNCwzMTAuNzkzLDUwLDIxOC42ODYsNTBDMTI2LjU4LDUwLDUxLjY0NSwxMjQuOTM0LDUxLjY0NSwyMTcuMDQxYzAsOTIuMTA2LDc0LjkzNiwxNjcuMDQxLDE2Ny4wNDEsMTY3LjA0MQoKCWMzNC45MTIsMCw2Ny4zNTItMTAuNzczLDk0LjE4NC0yOS4xNThMNDE5Ljk0NSw0NjJMNDYwLjM1NSw0MjEuNTl6IE0xMDAuNjMxLDIxNy4wNDFjMC02NS4wOTYsNTIuOTU5LTExOC4wNTYsMTE4LjA1NS0xMTguMDU2CgoJYzY1LjA5OCwwLDExOC4wNTcsNTIuOTU5LDExOC4wNTcsMTE4LjA1NmMwLDY1LjA5Ni01Mi45NTksMTE4LjA1Ni0xMTguMDU3LDExOC4wNTZDMTUzLjU5LDMzNS4wOTcsMTAwLjYzMSwyODIuMTM3LDEwMC42MzEsMjE3LjA0MQoKCXoiLz4KCjwvc3ZnPgoK');
        opacity : .4;
    }

    .is-field.is-search-datalist {
        width : 100%;
        border : 0;
        color : #2C2C2C;
    }

    .is-search-datalist-items {
        width : 90%;
        margin : 0 auto;
    }

    .is-search-datalist-items li {
        display : inline-block;
        margin : 10px 5px;
        padding : 5px 10px;
        border-radius : 4px;
        background-color : rgba(209, 209, 209, 0.8);
        transition : all 0.3s ease;
        cursor : pointer;
    }

    .is-search-datalist-items li:hover {
        background-color : rgba(209, 209, 209, 1);
    }

    .is-search-datalist-items li:first-child {
        margin-left : 0 !important;
    }

    .is-search-datalist-items li:after {
        content : 'x';
        margin-left : 5px;
        color : rgba(129, 35, 35, 0.6);
        font-family : Calibri, sans-serif;
        font-weight : bolder;
        transition : all 0.3s ease;
    }

    .is-search-datalist-items li:hover:after {
        color : rgba(129, 35, 35, 0.8);
    }

    .is-search-datalist-suggestions {
        width : 90%;
        margin : 0 auto;
        border-right : 1px solid #A9A9A9;
        border-bottom : 1px solid #A9A9A9;
        border-left : 1px solid #A9A9A9;
    }

    .is-search-datalist-suggestions ul {
        max-height : 250px;
        overflow : auto;
    }

    .is-search-datalist-suggestions li {
        padding : 5px 10px;
        font-family : Calibri, sans-serif;
    }

    .is-search-datalist-suggestions li:not(.noresult) {
        cursor : pointer;
    }

    .is-search-datalist-suggestions li:not(.noresult):nth-child(odd) {
        background-color : #EAEAEA;
    }

    .is-search-datalist-suggestions li:not(.noresult):nth-child(even) {
        background-color : #F9F9F9;
    }

    .is-search-datalist-suggestions li.noresult {
        font-style : oblique;
        font-weight : bolder;
    }

    .is-search-datalist-suggestions li:not(.noresult).selected {
        background : #181818;
        color : #F0F0F0;
    }

    .is-search-datalist-suggestions li em {
        font-style : normal;
        font-weight : bold;
    }
</style>