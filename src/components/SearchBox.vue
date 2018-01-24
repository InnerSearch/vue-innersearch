<template>
    <div class='is-component is-searchbox'>
        <div class='is-icon is-searchbox' ref='icon' v-on:click='focusOnField("input")'></div>
        <input class='is-field is-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import generics from './../lib/Generics';
    import debounce from 'debounce';

    export default {
        name : 'searchbox',
        mixins : [generics],

        props : {
            // autofocus : if the input is focused when the user load the page
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

            // operator : logical operator applied when the is several field
            'operator' : {
                type : String,
                default : 'OR'
            },

            // pattern : regexp pattern
            'pattern' : {
                type : String,
                default : '.*{v}.*'
            },

            // placeholder : text which appears into the input
            'placeholder' : {
                type : String,
                default : 'Search'
            }
        },

        data : function() {
            return {
                mutableField : this.field, // mutable field allowing to update it
                entry : '', // input value
                fun : undefined, // function applied
                localInstructions : [], // local request
            };
        },

        computed : {
            computedEntry : function() {
                return this.entry.toLowerCase();
            }
        },

        watch : {
            computedEntry : function(val) {
                // Case where val is not empty : we add instructions
                if (val.length > 0) {
                    // Local request data initialization for each field value
                    if (this.localInstructions.length === 0) {
                        this.mutableField.forEach(attr => {
                            let _instruction = {
                                fun : this.fun,
                                args : ['regexp', attr, this.pattern.replace('{v}', val)]
                            };

                            this.localInstructions.push(_instruction);
                            this.addInstruction(_instruction);
                        });
                    }

                    // Set local argument for each field
                    else {
                        this.localInstructions.forEach(obj => {
                            obj.args[2] = this.pattern.replace('{v}', val);
                        });
                    }
                }
            
                // Case where val is empty : we remove all instructions about this component to match with everything (by default thanks to ES behavior)
                else {
                    // Reset all deep instructions of local request
                    this.localInstructions.forEach(instruction => {
                        this.removeInstruction(instruction);
                    });

                    this.localInstructions = [];
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
            }
        },

        mounted : function() {
            // Add autofocus property to html tag
            this.$refs.input.autofocus = this.autofocus || false;

            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute('placeholder', this.placeholder);
        },

        created : function() {
            // Create a dynamic watcher on the input which call the mixins Fetch function
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
                this.addDebounce(_debounce); // Add debounce event to listed debounce into the Store
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
