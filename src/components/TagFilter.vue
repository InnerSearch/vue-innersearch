<template>
    <ul class='is-component is-tag-filter' v-if='targetData !== undefined'>
        <li v-if='targetCategory === Component.SEARCHBOX' @click='reset()'>
            <slot :data='targetData'>
                Search : {{ targetData }}
            </slot>
        </li>

        <li v-else-if='targetCategory === Component.REFINEMENT_LIST_FILTER && (clearAll || (!clearAll && !Array.isArray(targetData)))' @click='reset()'>
            <slot :data='targetData'>
                Filters ({{ targetData }})
            </slot>
        </li>
        <li v-else-if='targetCategory === Component.REFINEMENT_LIST_FILTER' v-for='(item, index) in targetData' :key='index' @click='resetByValue(item)'>
            <slot :data='item'>
                Filter : {{ item }}
            </slot>
        </li>

        <li v-else-if='targetCategory === Component.NUMERIC_LIST_FILTER' @click='reset()'>
            <slot :data='targetData'>
                <span v-if='targetData.gte !== undefined && targetData.lte !== undefined'>From {{ targetData.gte }} to {{ targetData.lte }}</span>
                <span v-else-if='targetData.gte !== undefined'>From {{ targetData.gte }}</span>
                <span v-else-if='targetData.lte !== undefined'>To {{ targetData.lte }}</span>
            </slot>
        </li>

        <li v-else-if='targetCategory === Component.SEARCH_DATALIST && clearAll' @click='reset()'>
            <slot :data='targetData'>
                Clear {{ targetData.length }} filters
            </slot>
        </li>
        <li v-else-if='targetCategory === Component.SEARCH_DATALIST' v-for='(item, index) in targetData' :key='index' @click='resetByValue(index)'>
            <slot :data='item'>
                {{ item }}
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
                type : [Number, String]
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
                this.refresh();
            },

            resetByValue : function(value) {
                // Call the reset function in a specific component
                this.bus.$emit('resetByValue_' + this.targetCID, value);
                this.refresh();
            },

            refresh : function() {
                // Manually mount and fetch
                this.$nextTick(() => {
                    this.mount();
                    this.fetch();
                });
            }
        },

        created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.TAG_FILTER, this);
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

                case Component.SEARCH_DATALIST :
                    this.bus.$emit(_requestName, _responseName);
                    this.bus.$on(_responseName, value => {
                        console.log(value);
                        this.targetData = value.length > 0 ? value : undefined;
                    });
                break;

                case Component.REFINEMENT_LIST_FILTER :
                    this.bus.$emit(_requestName, _responseName);
                    this.bus.$on(_responseName, value => {
                        this.targetData = (value !== null && value.length !== 0) ? value : undefined;
                    });
                break;

                case Component.NUMERIC_LIST_FILTER :
                    this.bus.$emit(_requestName, _responseName);
                    this.bus.$on(_responseName, value => {
                        this.targetData = Object.keys(value).length > 0 ? value : undefined;
                    });
                break;
            }
        }
    };
</script>
