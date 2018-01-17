<template>
	<div class="is-component is-refinement-list">
		<div v-for="item in items" class="is-item is-refinement-list" ref="input">
			<input
				type="checkbox"
				:name="item.key"
				:value="item.key"
				v-model="checkedItems"
				@change="clickOnItem()">
			<label :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
		</div>
	</div>
</template>

<script>
	import generics from './../lib/Generics';
	import Store from './../lib/Store';

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
			}
		},

		data : function() {
			return {
				checkedItems : [], // list of checked items
				localAggregations : [], // lcoal aggregation instructions
				localInstructions : [] // local request
			};
		},

		computed : {
			items : function() {
				return this.aggregations[this.field];
			}
		},

		methods : {
			updateLabels : function(value) {
				console.log("UPDATE : ", this.dynamic)
				this.setAggregations(this.field, value, this.dynamic);
			},

			addAggregationInstructions : function() {
				let _instruction = {
					fun : 'aggregation',
					args : ['terms', this.field, { order : { [this.orderKey] : this.orderDirection } , size : this.size }]
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
				this.localInstructions.forEach(instruction => {
					console.log(instruction);
					this.removeInstruction(instruction);
				});
				this.localInstructions = [];

				// Read all checked items and create appropriate instruction for each of them
				this.checkedItems.forEach(item => {
					let _instruction = {
						fun : 'filter',
						args : ['term', this.field, item]
					};

					this.localInstructions.push(_instruction);
					this.addInstruction(_instruction);
				});

				// Update the request
				this.mount();

				// Execute request
				this.fetch();

				// Debugg
				//console.log("[RefinementListFilter:clickOnItem] Instructions : ", this.localInstructions);
				//console.log('[RefinementListFilter:clickOnItem] Items : ', this.items);
			}
		},

		created : function () {
			// Add aggregation, no need to update it later
			let _aggsRequest = this.createRequestForAggs(this.field,this.size);   // TO FIX ; find an other way to create a new request

			console.log(_aggsRequest)

			// Search respective aggregations
			this.addAggregationInstructions();

			// Get respective items
			this.header.client.search(_aggsRequest).then(response => {
				let value = response.aggregations['agg_terms_' + this.field].buckets;
				console.log('[RefinementListFilter:created] Value of aggregations :', value);

				// Create aggregations items
				this.updateLabels(value);
			});
		}
	};
</script>
