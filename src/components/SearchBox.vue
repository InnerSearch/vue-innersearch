<template>
    <div class="is-component is-searchbox">
        <div class="is-icon is-searchbox" ref='icon' v-on:click='FocusOn("input")'></div>
        <input class='is-field is-searchbox id-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import Store from './../lib/Store';
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

            // case-sensitive : if text is case sensitive
            "case-sensitive" : {
                type : Boolean,
                default : false
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
                entry : null, // input value
                local : null, // local request
            };
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            FocusOn : function(tag) {
                this.$refs[tag].focus();
            },

            SearchOn : function(val) {
                // Set local argument
                this.local.args[2] = val;

                // Fetch the results
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
            // Create a watcher on the input which calls the SearchOn function
            var EntryWatcher = this.$watch(function() {
                return this.entry;
            }, {
                handler : function(val) {
                    this.SearchOn.call(this, val);
                },
                deep : true
            });

            // Behavior when realtime is enabled or not
            if (this.realtime)
                this.SearchOn = debounce(this.SearchOn, this.timeout); // Apply debounce method with the timeout value on the current SeachOn function
            else
                EntryWatcher(); // Disabled the watcher

            // Local request data initialization
            this.local = {
                fun : "query",
                args : ['prefix', this.queries, null]
            };
            this.AddInstruction(this.local);
        }
    };
</script>
