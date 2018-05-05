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
                from : null,
                to : null,
                localInstructions : [], // local request
            }
        },
        created : function () {
            this.CID = this.addComponent(Component.NUMERIC_LIST_FILTER, this);
        },
        methods : {
            performRequest : function () {
                let regex = new RegExp(/^[0-9][0-9]*$/);
                if(regex.test(this.from) && regex.test(this.to) ){
                    this.removeInstructions();

                    let _instruction = {
                        fun : 'query',
                        args : ['range', this.field, {
                            "gte" : this.from,
                            "lte" : this.to
                        }]
                    };

                    this.localInstructions.push(_instruction);
                    this.addInstruction(_instruction);

                    // Update the request
                    this.mount();

                    // Execute request
                    this.fetch(this);
                }
            },
            reset : function() {
                this.from = null;
                this.to = null;
                if (this.localInstructions.length !== 0)
                    this.removeInstructions();
            },
        },
    }
</script>