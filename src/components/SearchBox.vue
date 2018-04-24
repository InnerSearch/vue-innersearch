<template>
    <div class='is-component is-searchbox'>
        <div class='is-icon is-searchbox' v-on:click='focusOnField("input")'></div>
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
                type : [Number, String]
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
                name : undefined, // for named component
                mutableField : this.field, // mutable field allowing to update it
                entry : '', // input value
                fun : undefined, // function applied
                localInstructions : [], // local request
                channels : [] // communicate the value (entry) to another component on specific channels
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(val) {
                this.update(val);
            }
        },

        methods : {
            // Update instructions
            update : function(val) {
				// Reset all deep instructions of local request
				this.removeInstructions();

                // Case where val is not empty : we add instructions
                if (val.length > 0) {
                    // Local request data initialization for each field value
                    let _instruction = {
                        fun : 'filter',
                        args : ['bool', arg => {
                            this.mutableField.forEach(attr => {
                                arg[this.fun]('prefix', attr, val);
                            });
                            return arg;
                        }]
                    };

                    this.localInstructions.push(_instruction);
					this.addInstruction(_instruction);
                }

                // Update the request
                this.mount();
            },

            // Set the focus on "tag" DOM element when the function is called
            focusOnField : function(tag) {
                this.$refs[tag].focus();
            },

            // Execute the mixins Fetch method to update hits
            executeSearch : function() {
                // Send the value to reset components
                this.diffuse();

                // Fetch the results
                this.fetch();
            },

            // Reset the input field
            reset : function() {
                this.entry = '';
            },

            // Force reset with instructions update
            forceReset : function() {
                this.reset();
                this.update(this.entry);
            },

            // Diffuse the entry value
            diffuse : function() {
                this.channels.forEach(channel => {
                    this.bus.$emit(channel, this.computedEntry);
                });
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.SEARCHBOX, this);

            // Assign the name to the component if needed
            if (this.id !== undefined)
                this.name = this.id;

            // ResetButton listening for entry value diffusion
            this.bus.$on('reset_' + this.CID, destination => {
                this.channels.push(destination);
            });

            // Create a dynamic watcher on the input which calls the mixins Fetch function
            let _disableWatcherFetch = this.$watch(function() {
                return this.entry;
            }, {
                handler : function(val) {
                    this.executeSearch.call(this);
                },
                deep : true
            });

            // Behavior when realtime is enabled or not
            if (this.realtime) {
                let _debounce = debounce(this.executeSearch, this.timeout); // Debounce method with the timeout value on the current SeachOn function
                this.addDebounce('searchbox', _debounce); // Add debounce event to listed debounce into the Store
                this.executeSearch = _debounce; // Apply debounce
            }
            else
                _disableWatcherFetch(); // Disable the watcher that disable fetch event

            // Convert field string to field array
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];

            // Function calculation depending on operator property
            this.fun = (this.operator.toUpperCase() === 'AND') ? 'filter' : 'orFilter';
        },

        mounted : function() {
            // Autofocus event for the html tag
            if (this.autofocus)
                this.$refs.input.focus();

            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        }
    };
</script>
