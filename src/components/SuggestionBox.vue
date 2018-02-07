<template>
    <div class="is-component is-suggestion-box">
        [SuggestionBox]
    </div>
</template>

<script>
    import Generics from './../lib/Generics';

    export default {
        name : 'suggestion-box',
        mixins : [Generics],

        props : {
            // hightlight : 
            // not a property : add a slot to <suggestionbox> looks like : <span slot="highlight" slot-scope="{ matched }"><strong><u>{{ matched }}</u></strong></slot>

            // see how to implemant clean requests

            // timeout : duration between two requests (in ms)
            'timeout' : {
                type : Number,
                default : 300
            }
        },

        data : function() {
            return {
                
            };
        },

        methods : {
        },
        
        created : function() {
            // WILL COMMUNICATE WITH : $parents.CID
            console.log("SuggestionBox : ", this);
            // $emit(...)
        }
    };
</script>
