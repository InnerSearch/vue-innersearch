<template>
    <div class="is-component is-searchbox">
        <div class="is-icon is-searchbox" ref='icon' v-on:click='FocusOn("input")'></div>
        <input class='is-field is-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import Generics from './../lib/Generics';
    import debounce from 'debounce';

    export default {
        name : 'searchbox',
        mixins : [Generics],

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

            // queries : contains the query request; each properties are separeted by a comma
            // values of Array : [String|Object]
            "queries" : {
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
                mutableQueries : this.queries, // queries field editable value
                entry : null, // input value
                local : [], // local request
            };
        },
        
        computed : {
            Entry : function() {
                return this.entry;
            }
        },

        watch : {
            Entry : function(val) {
                // Set local argument for each queries
                this.local.forEach(obj => {
                    obj.args[2] = val;
                });

                // Update the request
                this.Mount();
            }
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            FocusOn : function(tag) {
                this.$refs[tag].focus();
            },

            // Execute the mixins Fetch method to update hits
            SearchOn : function() {
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
            var DisableWatcherFetch = this.$watch(function() {
                return this.entry;
            }, {
                handler : function(val) {
                    this.SearchOn.call(this);
                },
                deep : true
            });

            // Behavior when realtime is enabled or not
            if (this.realtime)
                this.SearchOn = debounce(this.SearchOn, this.timeout); // Apply debounce method with the timeout value on the current SeachOn function
            else
                DisableWatcherFetch(); // Disabled the watcher that disabled fetch event

            // Convert query string to query array
            if (!Array.isArray(this.mutableQueries))
                this.mutableQueries = [this.mutableQueries];

            // Local request data initialization for each queries value
            this.mutableQueries.forEach(attr => {
                var instruction = {
                    fun : "query",
                    args : ['prefix', attr, null]
                };
                this.local.push(instruction);
                this.AddInstruction(instruction);
            });
        }
    };
</script>
