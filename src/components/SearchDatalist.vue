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
            <input class='is-field is-search-datalist' type='text' ref='input' v-model='entry' @keydown.down='next()' @keydown.up='previous()' @keydown.esc='hideSuggestions()' @keydown.enter='submit()' />
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
            // placeholder : text which appears into the input
            'placeholder' : {
                type : String,
                default : 'Search'
            }
        },

        data : function() {
            return {
                entry : '', // input value
                showSuggestions : false, // show suggestions list
                selections : [], // selected items
                suggestions : [], // suggestions list
                highlightedSuggestion : undefined // current selected suggestion
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(value) {
                if (value !== '')
                    this.updateItems(value);
                else
                    this.hideSuggestions();
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
                this.showSuggestions = true;
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
                let el = this.$refs.suggestions[index];
                if (el !== undefined) {
                    let i = this.highlightedSuggestion;
                    if (i !== undefined)
                        this.unselect();

                    this.highlightedSuggestion = index;
                    el.classList.add('selected');
                }
            },

            // Unselect a suggested item
            unselect : function() {
                let index = this.highlightedSuggestion,
                    el = this.$refs.suggestions[index];
                if (el !== undefined) {
                    this.highlightedSuggestion = undefined;
                    el.classList.remove('selected');
                }
            },

            // Select the next suggestion from highlighted item
            next : function() {
                let index = this.highlightedSuggestion;
                if (index === undefined)
                    this.selectAndScroll(0);
                else
                    this.selectAndScroll((index + 1) % this.suggestions.length);
            },

            // Select the previous suggestion from highlighted item
            previous : function() {
                let index = this.highlightedSuggestion,
                    size = this.suggestions.length;
                if (index === undefined)
                    this.selectAndScroll(size - 1)
                else
                    this.selectAndScroll((((index - 1) % size) + size) % size)
            },
            
            // Scroll function
            selectAndScroll : function(index) {
                let itemHeight = this.$refs.suggestions[index].offsetHeight;
                this.select(index);
                this.$refs.suggestionBox.scrollTo(0, index * itemHeight);
            },

            // Submit the search
            submit : function(domain) {
                let open = false;
                if (this.showSuggestions) {
                    // Si un élément est sélectionné
                    let index = this.highlightedSuggestion;
                    if (index !== undefined && this.$refs.suggestions[index] !== undefined)
                        this.add(index);
                    else
                        open = true;

                    this.hideSuggestions();
                }
                else
                    open = true;

                if (open && this.highlightedSuggestion.length > 0) {
                    // do some stuff
                    this.entry = '';
                    this.highlightedSuggestion = [];
                }
            }
        },

        mounted : function() {
            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        },

        created : function() {
            this.suggestions = ['li', 'li', 'li', 'li']
            this.selections = ['li', 'li']
        }
    };
</script>
