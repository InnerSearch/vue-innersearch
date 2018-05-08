<template>
    <section>
        <div class="is-nlf">
            <slot name="header"></slot>
                <div class="is-nlf-inputs">
                    <input class="is-range is-field" v-model="from" type="text" placeholder="from" @change="performRequest()" />
                    <input class="is-range is-field"  v-model="to" type="text" placeholder="to" @change="performRequest()" />
                </div>
        </div>
    </section>
</template>

<script>
    import Generics from '../lib/Generics';

    import { Component } from '../lib/Enums.js';




    export default {
        name: "numeric-list-filter",
        mixins: [Generics],
        props: {
            field : {
                type : String,
                default : null
            },
        },

        data : function() {
            return {
                from : undefined,
                to : undefined,
                localInstructions : [] // local request
            }
        },

        /*
            Not used ATM
        */
        computed : {
            floatFrom : function() {
                return parseFloat(this.from);
            },

            floatTo : function() {
                return parseFloat(this.to);
            }
        },

        methods : {
            performRequest : function () {
                this.removeInstructions();

                let regex = new RegExp(/^[0-9][0-9]*$/),
                    _rangeObj = {};
                
                if (regex.test(this.from))
                    _rangeObj.gte = this.from;
                
                if (regex.test(this.to))
                    _rangeObj.lte = this.to;

                if (Object.keys(_rangeObj).length > 0) {
                    let _instruction = {
                        fun : 'query',
                        args : ['range', this.field, _rangeObj]
                    };

                    this.localInstructions.push(_instruction);
                    this.addInstruction(_instruction);
                }

                // Update the request
                this.mount();

                // Execute request
                this.fetch(this);
            },

            reset : function() {
                this.from = undefined;
                this.to = undefined;
                if (this.localInstructions.length !== 0)
                    this.removeInstructions();
            },
        },

        created : function () {
            this.CID = this.addComponent(Component.NUMERIC_LIST_FILTER, this);

            // Triggered by ResetButton component
            this.bus.$on('reset', () => this.reset());
        }
    }
</script>