<template>
    <section>
        <div class='is-search-datalist-items'>
            <ul>
                <li v-for='(selection, index) in selections' :key='index' @click='remove(index)'>
                    {{ selection }}
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
            // fields on which the search is done
            'field' : {
                type : [String, Array]
            },

            // fields on which the autcomplete box is filled up
            'suggestion' : {
                type : [String, Array]
            },

            // operator : logical operator applied when there are several field
            'operator' : {
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
                console.log("Do some stuff");
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
                let _suggsRequest = this.createRequestForSuggs(value, this.mutableSuggestion, this.size);
                this.header.client.search(_suggsRequest).then(response => {
                    console.log("Request", _suggsRequest, "Response", response.hits.hits);
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
        }
    };
</script>
