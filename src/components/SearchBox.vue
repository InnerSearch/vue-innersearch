<template>
    <div class='is-component is-searchbox'>
        <div class='is-icon is-searchbox' v-on:click='focus()'></div>
        <input class='is-field is-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import generics from './../lib/Generics';
    import debounce from 'debounce';
    import { Component } from '../lib/Enums.js';

    export default {
        name : 'searchbox',
        mixins : [generics],

        props : {
            // id : specify an id (or a name) to identificate the component instance
            'id' : {
                type : [Number, String],
                default : undefined
            },

            // autofocus : it defines if the input is focused when the user load the page
            'autofocus' : {
                type : Boolean,
                default : false
            },

            // realtime : if the Store object is updated for each change of the input
            'realtime' : {
                type : Boolean,
                default : false
            },

            // timeout : if realtime is enabled, duration between two requests (in ms)
            'timeout' : {
                type : Number,
                default : 300
            },

            // field : contains the fields on which ones request is applied
            // values of Array : [String]
            'field' : {
                type : [String, Array],
                required: true
            },

            // operator : logical operator applied when there are several field
            'operator' : {
                type : String,
                default : 'OR'
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
                name : null,
                mutableField : this.field, // mutable field allowing to update it
                entry : '', // input value
                fun : undefined, // function applied
                localInstructions : [], // local request

                tagFilters : [],
                authorization : {
                    mount : true,
                    fetch : true
                }
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(value) {

				// Reset all deep instructions of local request
				this.removeInstructions();

                // Case where value is not empty : we add instructions
                if (value.length > 0) {
                    // Local request data initialization for each field value
                    let _instruction = {
                        fun : 'filter',
                        args : ['bool', arg => {
                            this.mutableField.forEach(attr => {
                                arg[this.fun]('prefix', attr, value);
                            });
                            return arg;
                        }]
                    };

                    this.localInstructions.push(_instruction);
					this.addInstruction(_instruction);
                }

                // Send the value to TagFilter component(s)
                this.tagFilters.forEach(tagFilter => {
                    this.bus.$emit(tagFilter, value);
                });

                // Update the request
                if (this.authorization.mount)
                    this.mount();
                else
                    this.authorization.mount = true; // consume the exception

                // Execute fetch() if realtime is enabled
                if (this.realtime) {
                    if (this.authorization.fetch)
                        this.executeSearch();
                    else
                        this.authorization.fetch = true; // consume the exception
                }
            }
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            focus : function() {
                this.$refs.input.focus();
            },

            // Execute the mixins Fetch method to update hits (used in the watcher when realtime is enabled)
            executeSearch : function() {
                this.fetch();
            },

            // Set authorizations of mount and fetch methods to false (for reset behavior)
            setAuthorizations : function() {
                this.authorization.mount = false;
                this.authorization.fetch = false;
            },

            // Reset the input field
            reset : function() {
                // If entry equals to an empty string, the watcher function will never be called
                // That brings the authorization to stay locked at 'false'
                if (this.computedEntry !== '') {
                    this.setAuthorizations();
                    this.entry = '';
                }
            }
        },

        mounted : function() {
            // Autofocus event for the html tag
            if (this.autofocus)
                this.$refs.input.focus();

            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.SEARCHBOX, this);

            // Assign the name to the component if needed
            if (this.id !== undefined)
                this.name = this.id;

            // Apply debounce on executeSearch() function
            if (this.realtime) {
                let _debounce = debounce(this.executeSearch, this.timeout); // Debounce method with the timeout value on the current SeachOn function
                this.addDebounce(Component.SEARCHBOX, _debounce); // Add debounce event to listed debounce into the Store
                this.executeSearch = _debounce; // Apply debounce
            }

            // Convert field string to field array
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];

            // Function calculation depending on operator property
            this.fun = (this.operator.toUpperCase() === 'AND') ? 'filter' : 'orFilter';

            // Triggered by ResetButton and TagFilter components
            this.bus.$on('reset', () => this.reset());
            this.bus.$on('reset_' + this.CID, () => { this.reset(); this.focus(); });

            // Save TagFilter channel(s)
            this.bus.$on('tagFilter_' + this.CID, (channel) => {
                this.tagFilters.push(channel);
            });
        }
    };
</script>
