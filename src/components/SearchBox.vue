<template>
    <div class="is-component is-searchbox">
        <div class="is-icon is-searchbox" ref='icon' v-on:click='FocusOn("input")'></div>
        <input class='is-field is-searchbox id-searchbox' type='text' ref='input' v-model='entry' />
    </div>
</template>

<script>
    import Store from './../lib/Store';
    import Generics from './../lib/Generics';

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

            // case-sensitive : if text is case sensitive
            "case-sensitive" : {
                type : Boolean,
                default : false
            },

            // queries : contains the query request; each properties are separeted by a comma
            // values of Array : [String|Object]
            "queries" : {
                type : Array,
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
                Generics : this.$parent
            };
        },

        computed : {
            Entry : function() {
                return this.entry;
            }
        },

        watch : {
            Entry : function(val) {
                // Convert an array of properties to an ES request
                // ElasticSearch request
                this.Generics.SearchOnBox({
                  query : this.queries,
                  val : val
                });
            }
        },

        methods : {
            // Set the focus on "tag" DOM element when the function is called
            FocusOn : function(tag) {
                this.$refs[tag].focus();
            }
        },

        mounted : function() {
            // Add autofocus property to html tag
            this.$refs.input.autofocus = this.autofocus || false;

            // Realtime property TODO
            /*if (this.realtime)
                this.previewEl = this.$el.parentNode.insertBefore(document.createElement("div"), this.$el.nextSibling);*/

            // Add placeholder property to the input html tag
            this.$refs.input.setAttribute("placeholder", this.placeholder);
        },

        created : function() {
            console.log("Debug Store : ", this.Elasticsearch);
        }
    };
</script>
