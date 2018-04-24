<template>
    <div class='is-component is-reset-button'>
        <button v-if='category === undefined' class='is-button is-reset-button' type='button' @click='this.resetAll'>
            <slot>Reset</slot>
        </button>
        <ul v-else-if="data !== undefined">
            <li v-if='category === Component.SEARCHBOX' @click='this.resetSearchbox'>
                <slot :value="data">
                    Search : {{ data }}
                </slot>
            </li>
        </ul>
    </div>
</template>

<script>
    import Generics from './../lib/Generics';
    import { Component } from '../lib/Enums.js';

    export default {
        name : 'reset-button',
        mixins : [Generics],

        props : {
            "for" : {
                type : [Number, String],
                default : "all"
            }
        },

        data : function() {
            return {
                CID : undefined,
                Component : Component,
                category : undefined,
                instance : undefined,
                data : undefined,
                fun : undefined
            }
        },

        methods : {
            reset : function() {
                this.fun();
                this.fetch();
            },

            resetSearchbox : function() {
                this.data = undefined;
                this.reset();
            },

            resetAll : function() {
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
        },

        mounted : function() {
            // Find the component reference corresponding to 'for'attribute
            if (this.for !== 'all') {
                let _found = false;
                for (let key in Component) {
                    for (let component of this.getComponents(Component[key])) {
                        if (component.$data.name !== undefined && component.$data.name === this.for) {
                            this.category = Component[key];
                            this.instance = component;

                            if (component.$props !== undefined
                                && component.$props.realtime !== undefined && !component.$props.realtime
                                && component.forceReset !== undefined && typeof component.forceReset === 'function')
                                this.fun = component.forceReset;
                            else if (component.reset !== undefined && typeof component.reset === 'function')
                                this.fun = component.reset;
                                
                            _found = true;
                            break;
                        }
                    }
                    if (_found) break;
                }

                // Specific behavior depending on component category
                if (_found) {
                    let _requestName = 'reset_' + this.instance.$data.CID,
                        _responseName = 'reset_' + this.CID + '_' + this.instance.$data.CID;
                    switch (this.category) {
                        case Component.SEARCHBOX :
                            this.bus.$emit(_requestName, _responseName);
                            this.bus.$on(_responseName, value => {
                                this.data = value.length > 0 ? value : undefined;
                            });
                        break;
                    }
                }
            }
        }
    };
</script>
