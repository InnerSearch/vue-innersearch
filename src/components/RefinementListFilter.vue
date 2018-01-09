<template>
<div class="is-component is-refinement-list">
  <div v-for="item in items" class="is-item is-refinement-list" ref="input">
    <input
        type="checkbox"
        :name="item.key"
        :value="item.key"
        v-model="checkedItems"
        @change="clickOnItem()">
    <label v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} ) </label>
  </div>
</div>

</template>
<script>
	import generics from './../lib/generics';

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
				default : 20
			}
		},

		data : function() {
			return {
				items : null, // list of all items
				checkedItems : [], // list of checked items
				local : [] // local request
			};
		},

		methods : {
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
				this.local.forEach(instruction => {
					this.removeInstruction(instruction);
				});
				this.local = [];

				// Read all checked items and create appropriate instruction for each of them
				this.checkedItems.forEach(item => {
					let _instruction = {
						fun : 'filter',
						args : ['term', this.field, item]
					};

					this.local.push(_instruction);
					this.addInstruction(_instruction);
				});

				// Update the request
				this.mount();

				// Execute request
				this.fetch();

				// Debugg
				//console.log("[RefinementListFilter:clickOnItem] Instructions : ", this.local);
			}
		},

		created : function () {
			// Add aggregation, no need to update it later
			let _aggsRequest = this.createRequestForAggs(this.field);

			// Get respective items
			this.header.client.search(_aggsRequest).then(response => {
				this.items = response.aggregations["agg_terms_" + this.field].buckets;
			});
		},
	};
</script>
