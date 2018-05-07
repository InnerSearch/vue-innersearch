<template>
    <div class="is-component is-reset-button">
        <input class="is-button is-reset-button" type="button" :value='this.text' v-on:click='this.clickOn' />
    </div>
</template>

<script>
    import Generics from './../lib/Generics';
    import { Component } from '../lib/Enums.js';

    export default {
        name : 'reset-button',
        mixins : [Generics],

        props : {
            // text : set the text into the input button
            "text" : {
                type : String,
                default : "Reset"
            },

            // empty : clean all hit component displays
            "empty" : {
                type : Boolean,
                default : true
            }
        },

        data : function() {
            return {
                CID : undefined
            }
        },

        methods : {
            clickOn : function() {
                /*
                    Call reset function for each 'resetable' component
                    We use a function call instead of $emit way of communication
                    because of the asynchronous behaviour of bus. We need to call
                    a 'reset()' function for intended components, and THEN, manually
                    call mount() and fetch() methods from this component (to make
                    only one request to the server by clicking on the reset button)
                */
                for (let key in Component) {
                    this.getComponents(Component[key]).forEach(component => {
                        if (component.reset !== undefined && typeof component.reset === 'function')
                            component.reset();
                    });
                }

                this.$nextTick(() => {
                    this.mount();
                    this.fetch().then(() => {
                        // Empty all hits components if the property 'empty' is set to true
                        if (this.empty)
                            this.bus.$emit('emptyHits');
                    });
                });
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.RESETBUTTON, this);
        }
    };
</script>