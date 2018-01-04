<template>
    <div class="is-component is-searchbox">
        <div class="is-icon is-searchbox" ref='icon' v-on:click='focusOnField("input")'></div>
        <input class='is-field is-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import generics from './../lib/generics';
    import debounce from 'debounce';

    export default {
        name : 'searchbox',
        mixins : [generics],

        props : {
            // autofocus : if the input is focused when the user load the page
            "autofocus" : {
                type : Boolean,
                default : false
            },

            // realtime : if the Store object is updated for each change of the input
            "realtime" : {
                type : Boolean,
                default : false
            },

            // timeout : if realtime is enabled, duration between two requests (in ms)
            "timeout" : {
                type : Number,
                default : 300
            },

            // field : contains the fields on which ones request is applied
            // values of Array : [String]
            "field" : {
                type : [String, Array],
                required: true
            },

            // placeholder : text which appears into the input
            "placeholder" : {
                type : String,
                default : "Search"
            }
        },
        
        data : function() {
            return {
                mutableField : this.field, // mutable field allowing to update it
                entry : null, // input value
                local : [], // local request
            };
        },
        
        computed : {
            computedEntry : function() {
                return this.entry;
            }
        },

        watch : {
            computedEntry : function(val) {
                // Set local argument for each field
                this.local.forEach(obj => {
                    obj.args[2] = val;
                });

                // Update the request
                this.Mount();
            }
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            focusOnField : function(tag) {
                this.$refs[tag].focus();
            },

            // Execute the mixins Fetch method to update hits
            executeSearch : function() {
                this.Fetch();
            }
        },

        mounted : function() {
            // Add autofocus property to html tag
            this.$refs.input.autofocus = this.autofocus || false;

            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute("placeholder", this.placeholder);
        },

        created : function() {
            // Create a dynamic watcher on the input which call the mixins Fetch function
            var disableWatcherFetch = this.$watch(function() {
                return this.entry;
            }, {
                handler : function(val) {
                    this.executeSearch.call(this);
                },
                deep : true
            });

            // Behavior when realtime is enabled or not
            if (this.realtime)
                this.executeSearch = debounce(this.executeSearch, this.timeout); // Apply debounce method with the timeout value on the current SeachOn function
            else
                disableWatcherFetch(); // Disabled the watcher that disabled fetch event

            // Convert field string to field array
            if (!Array.isArray(this.mutableField))
                this.mutableField = [this.mutableField];

            // Local request data initialization for each field value
            this.mutableField.forEach(attr => {
                let _instruction = {
                    fun : 'filter',
                    args : ['prefix', attr, ""]
                };
                this.local.push(_instruction);
                this.AddInstruction(_instruction);
            });
        }
    };
</script>
