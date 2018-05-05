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
                mutableField : this.field, // mutable field allowing to update it
                entry : '', // input value
                fun : undefined, // function applied
                localInstructions : [] // local request
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(val) {
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
            }
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            focusOnField : function(tag) {
                this.$refs[tag].focus();
            },

            // Execute the mixins Fetch method to update hits
            executeSearch : function() {
                this.fetch();
            },

            // Reset the input field
            reset : function() {
                this.entry = '';
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
        }
    };
</script>
<style>
    .is-component.is-searchbox {
        display : flex;
        width : 90%;
        margin : 20px auto;
    }

    .is-icon.is-searchbox {
        width : 50px;
        height : 50px;
        margin : 5px;
        background-image : url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KCgo8IS0tIFRoZSBpY29uIGNhbiBiZSB1c2VkIGZyZWVseSBpbiBib3RoIHBlcnNvbmFsIGFuZCBjb21tZXJjaWFsIHByb2plY3RzIHdpdGggbm8gYXR0cmlidXRpb24gcmVxdWlyZWQsIGJ1dCBhbHdheXMgYXBwcmVjaWF0ZWQuIApZb3UgbWF5IE5PVCBzdWItbGljZW5zZSwgcmVzZWxsLCByZW50LCByZWRpc3RyaWJ1dGUgb3Igb3RoZXJ3aXNlIHRyYW5zZmVyIHRoZSBpY29uIHdpdGhvdXQgZXhwcmVzcyB3cml0dGVuIHBlcm1pc3Npb24gZnJvbSBpY29ubW9uc3RyLmNvbSAtLT4KCgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgoKPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoKCSB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KCjxwYXRoIGlkPSJtYWduaWZpZXItMi1pY29uIiBkPSJNNDYwLjM1NSw0MjEuNTlMMzUzLjg0NCwzMTUuMDc4YzIwLjA0MS0yNy41NTMsMzEuODg1LTYxLjQzNywzMS44ODUtOTguMDM3CgoJQzM4NS43MjksMTI0LjkzNCwzMTAuNzkzLDUwLDIxOC42ODYsNTBDMTI2LjU4LDUwLDUxLjY0NSwxMjQuOTM0LDUxLjY0NSwyMTcuMDQxYzAsOTIuMTA2LDc0LjkzNiwxNjcuMDQxLDE2Ny4wNDEsMTY3LjA0MQoKCWMzNC45MTIsMCw2Ny4zNTItMTAuNzczLDk0LjE4NC0yOS4xNThMNDE5Ljk0NSw0NjJMNDYwLjM1NSw0MjEuNTl6IE0xMDAuNjMxLDIxNy4wNDFjMC02NS4wOTYsNTIuOTU5LTExOC4wNTYsMTE4LjA1NS0xMTguMDU2CgoJYzY1LjA5OCwwLDExOC4wNTcsNTIuOTU5LDExOC4wNTcsMTE4LjA1NmMwLDY1LjA5Ni01Mi45NTksMTE4LjA1Ni0xMTguMDU3LDExOC4wNTZDMTUzLjU5LDMzNS4wOTcsMTAwLjYzMSwyODIuMTM3LDEwMC42MzEsMjE3LjA0MQoKCXoiLz4KCjwvc3ZnPgoK');
        opacity : .4;
    }

    .is-field.is-searchbox {
        width : 100%;
        border : 0;
        color : #2C2C2C;
    }
</style>
