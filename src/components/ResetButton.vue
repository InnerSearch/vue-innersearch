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
            }
        },

        data : function() {
            return {
                CID : undefined
            }
        },

        methods : {
            clickOn : function() {
                // Call reset function for each 'resetable' component
                for (let key in Component) {
                    this.getComponents(Component[key]).forEach(component => {
                        if (component.reset !== undefined && typeof component.reset === 'function')
                            component.reset();
                    });
                }
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.RESETBUTTON, this);
        }
    };
</script>