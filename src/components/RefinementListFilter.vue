<template>
  <div class="is-component is-refinement-list">
    <slot name="title">
      <h3 class="is-refinement-menu-title">{{title}}</h3>
    </slot>

    <div v-for="(item, index) in items" :key="index" class="is-item is-refinement-list" ref="input">
      <input
        type="checkbox"
        :name="item.key"
        :value="item.key"
        v-model="checkedItems"
        @change="clickOnItem()">
      <slot name="label" v-bind:item="item"
            v-bind:displayCount="displayCount"
            v-bind:clickOnItem="clickOnItem"
            v-bind:clickOnLabel="clickOnLabel">
        <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
        <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
      </slot>
    </div>

    <slot name="footer">
      <a href="#"  v-on:click='updateAggsSize()'>view more</a>
    </slot>
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

      orderKey : {
        type : String,
        default : '_term'
      },

      orderDirection : {
        type : String,
        default : 'asc'
      },

      dynamic : {
        type : Boolean,
        default : false
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
      }
    },

    data : function() {
      return {
        CID : undefined,
        checkedItems : [], // list of checked items
        localAggregations : [], // lcoal aggregation instructions
        localInstructions : [], // local request
        aggsSize : this.size,
      };
    },

    computed : {
      items : function() {
        return this.aggregations[this.field];
      }
    },

    methods : {
      updateLabels : function(value) {
        this.setAggregations(this.field, value, this.dynamic, this.orderKey, this.orderDirection);
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
      clickOnLabel : function(name) {
        // Find input check with the right name
        let _tag = this.$refs.input.map(div => {
          return div.getElementsByTagName("input")[0];
        }).filter((input) => {
          return input.getAttribute("name") === name;
        });

        // Trigger click event on checkbox
        if (_tag[0])
          _tag[0].click();
      },

      // Triggered when user select or unselect an item
      clickOnItem : function() {
        // Reset all deep instructions of local request
        this.removeInstructions();

        // Read all checked items and create appropriate instruction for each of them
        // OR operator case
        if (this.operator.toLowerCase() === 'or') {
          let _instruction = {
            fun : 'filter',
            args : ['bool', arg => {
              this.checkedItems.forEach(item => {
                arg.orFilter('term', this.field, item);
              });
              return arg;
            }]
          };

          this.localInstructions.push(_instruction);
          this.addInstruction(_instruction);
        }

        // AND operator case
        else {

          this.checkedItems.forEach(item => {
            let _instruction = {
              fun : 'andFilter',
              args : ['term', this.field, item]
            };

            this.localInstructions.push(_instruction);
            this.addInstruction(_instruction);
          });
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
        this.aggsSize += 50;

        let _aggsRequest = this.createRequestForAggs(this.field, this.aggsSize, this.orderKey, this.orderDirection);

        this.addAggregationInstructions();

        // Get respective items
        this.header.client.search(_aggsRequest).then(response => {
          let value = response.aggregations['agg_terms_' + this.field].buckets;

          // Create aggregations items
          this.updateLabels(value);
        });
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

        // Create aggregations items
        this.updateLabels(value);
      });

      this.bus.$on('updateAggs', e => {
        //console.log(e)
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
              this.setAggregations(this.field, aggs['agg_terms_' + this.field].buckets, this.dynamic, this.orderKey, this.orderDirection);
            } else {
              this.setAggregations(this.field, resp.aggregations['agg_terms_' + this.field].buckets, this.dynamic, this.orderKey, this.orderDirection);
            }
          });
        }
      });
    }
  };
</script>
