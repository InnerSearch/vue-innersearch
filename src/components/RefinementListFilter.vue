<template>
    <div class="is-component is-refinement-list">
        <slot name="title" :title="title">
            <h3 class="is-refinement-menu-title">{{title}}</h3>
        </slot>
        <slot name="uncheck_all" :uncheckAll="uncheckAll"></slot> 
        <input v-if="search" type="text" placeholder="search..." v-model="test_">
        <slot name="label" :items="items"
        :displayCount="displayCount"
        :checkedItems="checkedItems"
        :clickOnItem="clickOnItem"
        :clickOnLabel="clickOnLabel" :ref="input">
            <div  v-for="(item, index) in items" :key="index" class="is-item is-refinement-list" >
                    <input
                    type="checkbox"
                    :name="item.key"
                    :value="item.key"
                    v-model="checkedItems"
                    @change="clickOnItem(checkedItems)">
                    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                    <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
            </div>
        </slot>
        <slot name="viewmore">
            <a href="#" :style="{ display : viewMoreDisplay}"  v-on:click='updateAggsSize()'>view more</a>
        </slot>        
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import generics from './../lib/Generics';
    import Store from './../lib/Store';
    import { Component } from '../lib/Enums.js';


    export default {
        name : "refinement-list-filter",
        mixins : [generics],

        props : {
            field : {
                type : String,
                default : null
            },

            size : {
                type : Number,
                default : 10000
                /*
                            buckets counts are approximate
                            https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-terms-aggregation.html#search-aggregations-bucket-terms-aggregation-approximate-counts
                        */
            },

            sizeMore : {
                type : Number,
                default : 50
            },

            orderKey : {
                type : String,
                default : '_term'
            },

            orderDirection : {
                type : String,
                default : 'asc'
            },

            displayCount : {
                type : Boolean,
                default : true
            },

            title : {
                type : String,
                default : ''
            },

            operator : {
                type : String,
                default : 'AND'
            },
            
            type : {
                type : String,
                default : 'checkbox_list'
            },
            search : {
                type: Boolean,
                default : false
            }
        },

        data : function() {
            return {
                CID : undefined,
                checkedItems : [], // list of checked items
                localAggregations : [], // lcoal aggregation instructions
                localInstructions : [], // local request
                aggsSize : this.size,
                test_ : null,
                aggsCardinality : null,
                viewMoreDisplay : "inherit"
            };
        },

        computed : {
            items : function() {
                if(this.test_ !== null && this.test_.length !== 0){
                    let aggs = this.aggregations[this.field];
                    return aggs.filter(e => (e.key.toString().startsWith(this.test_)));
                } else {
                    return this.aggregations[this.field];
                }
            }
        },

        methods : {
            uncheckAll : function () {
                
                Array.from( document.querySelectorAll('input[name="'+ this.field +'"]:checked'), input => input.checked = false );

                this.removeInstructions();
                    // Update the request
                this.mount();

                // Execute request
                this.fetch(this);

                this.checkedItems = null;
            },

            updateLabels : function(value) {
                this.setAggregations(this.field, value, this.orderKey, this.orderDirection);
            },

            addAggregationInstructions : function() {
                let _instruction = {
                    fun : 'aggregation',
                    args : ['terms', this.field, { order : { [this.orderKey] : this.orderDirection } , size : this.aggsSize }]
                };


                this.localAggregations.push(_instruction);
                this.addInstruction(_instruction);
            },

            // Check or uncheck an item for the input corresponding to the name
            clickOnLabel : function(key) {
                console.log(document.querySelector('.is-refinement-list > input[value="' + key + '"]'));
                document.querySelector('.is-refinement-list > input[value="' + key + '"]').click();
            },

            // Triggered when user select or unselect an item
            clickOnItem : function(checkedItems) {

                /// For the dropdownlist
                if(checkedItems === '' || checkedItems[0] === "" || checkedItems.length === 0){
                    this.checkedItems = checkedItems;

                    this.removeInstructions();
                        // Update the request
                    this.mount();

                    // Execute request
                    this.fetch(this);
                    return;
                }

                this.checkedItems = checkedItems;

                // Reset all deep instructions of local request
                this.removeInstructions();

                // Read all checked items and create appropriate instruction for each of them
                // OR operator case
                var _instruction = undefined;
                if (this.operator.toLowerCase() === 'or') {
                    if(typeof checkedItems === 'string' || typeof checkedItems === 'number'){
                        _instruction = {
                            fun : 'orFilter',
                            args : ['term', this.field, checkedItems],
                        };
                    } else {
                        _instruction = {
                            fun : 'filter',
                            args : ['bool', arg => {
                                this.checkedItems.forEach(item => {
                                    arg.orFilter('term', this.field, item);
                                });
                                return arg;
                            }]
                        };
                    }


                    this.localInstructions.push(_instruction);
                    this.addInstruction(_instruction);
                }

                // AND operator case
                else {
                    if(typeof checkedItems === 'string' || typeof checkedItems === 'number'){
                        _instruction = {
                            fun : 'andFilter',
                            args : ['term', this.field, checkedItems],
                        };

                        this.localInstructions.push(_instruction);
                        this.addInstruction(_instruction);
                    } else {
                        this.checkedItems.forEach(item => {
                            _instruction = {
                                fun : 'andFilter',
                                args : ['term', this.field, item]
                            };

                            this.localInstructions.push(_instruction);
                            this.addInstruction(_instruction);
                            
                        });
                    }
                    

                }
                // Update the request
                this.mount();

                // Execute request
                this.fetch(this);

                // Debugg
                //console.log("[RefinementListFilter:clickOnItem] Instructions : ", this.localInstructions);
                //console.log('[RefinementListFilter:clickOnItem] Items : ', this.items);

            },

            updateAggsSize : function () {
                if(this.aggsSize < this.aggsCardinality){
                    this.aggsSize += this.sizeMore;

                    this.addAggregationInstructions();

                    this.mount();
                    this.fetch();
                    if(this.aggsCardinality < this.aggsSize)
                        this.viewMoreDisplay = "none";
                } else {
                    this.viewMoreDisplay = "none";
                }
            },

            // Reset refinementlistfilter items
            reset : function() {
                this.checkedItems = [];
                if (this.localInstructions.length !== 0)
                    this.removeInstructions();
            },
        },

        created : function () {
            // Interactive component declaration
            this.CID = this.addComponent(Component.REFINEMENT_LIST_FILTER, this);

            // Add aggregation, no need to update it later
            let _aggsRequest = this.createRequestForAggs(this.field, this.size, this.orderKey, this.orderDirection);

            // Search respective aggregations
            this.addAggregationInstructions();

            // Get respective items
            this.header.client.search(_aggsRequest).then(response => {
                let value = response.aggregations['agg_terms_' + this.field].buckets;
                // get count of aggs distinct values
                this.aggsCardinality = response.aggregations['agg_cardinality_' + this.field ].value;

                if(this.aggsCardinality < this.aggsSize ){
                    this.viewMoreDisplay = "none";
                }

                // Create aggregations items
                this.updateLabels(value);
            });

            this.bus.$on('updateAggs', e => {
                
                let isMe = (e.base !== undefined) ? this.CID !== e.base : true;
                if(this.operator.toLowerCase() !== 'or' || isMe) {
                    let aggs = e.aggs;

                    let _instr = [];
                    this.instructions.forEach( instr => {
                        this.localInstructions.forEach( localInstr => {
                            if (instr !== localInstr)
                                _instr.push(instr);
                        });
                    });
                    let query = this.mountInstructions(_instr);

                    let _fullQuery = Object.assign({
                        index : this.header.index,
                        type : this.header.type
                    }, {
                        body : query
                    });

                    this.header.client.search(_fullQuery).then((resp) => {
                        if(resp.aggregations === undefined){
                            this.setAggregations(this.field, aggs['agg_terms_' + this.field].buckets, this.orderKey, this.orderDirection);
                        } else {
                            this.setAggregations(this.field, resp.aggregations['agg_terms_' + this.field].buckets, this.orderKey, this.orderDirection);
                        }
                    });
                }
            });
        }
    };
</script>
