<template>
    <ul class='is-component is-tag-filter' v-if='targetData !== undefined'>
        <li v-if='targetCategory === Component.SEARCHBOX' @click='reset()'>
            <slot :data='targetData'>
                Search : {{ targetData }}
            </slot>
        </li>
    </ul>
</template>

<script>
    import Generics from './../lib/Generics';
    import { Component } from '../lib/Enums.js';

    export default {
        name : 'reset-button',
        mixins : [Generics],

        props : {
            // for : targeted component by the tag(s)
            'for' : {
                type : [Number, String],
                default : 'all'
            },

            // clearAll : if enabled, show only one tag wich resets the entire component on click
            'clearAll' : {
                type : Boolean,
                default : false
            }
        },

        data : function() {
            return {
                CID : undefined,
                Component : Component,
                targetCID : undefined,
                targetCategory : undefined,
                targetData : undefined
            }
        },

        methods : {
            reset : function() {
                // Call the reset function in a specific component
                this.bus.$emit('reset_' + this.targetCID);
                
                // Manually mount and fetch
                this.$nextTick(() => {
                    this.mount();
                    this.fetch();
                });
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.TAGFILTER, this);
        },

        mounted : function() {
            let _found = false;

            // Retrieve the 'for' component
            for (let key in Component) {
                for (let component of this.getComponents(Component[key])) {
                    if (component.$data.name !== undefined && component.$data.name === this.for) {
                        this.targetCategory = Component[key];
                        this.targetCID = component.$data.CID;
                            
                        _found = true;
                        break;
                    }
                }
                if (_found) break;
            }

            // Define the component behavior depending on the 'for' category
            let _requestName = 'tagFilter_' + this.targetCID,
                _responseName = 'tagFilter_' + this.CID;

            switch (this.targetCategory) {
                case Component.SEARCHBOX :
                    this.bus.$emit(_requestName, _responseName);
                    this.bus.$on(_responseName, value => {
                        this.targetData = value.length > 0 ? value : undefined;
                    });
                break;
            }
        }
    };
</script>
