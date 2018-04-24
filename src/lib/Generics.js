import Vue from 'vue';
import elasticsearch from 'elasticsearch';
import Bodybuilder from 'bodybuilder';
import Store from './Store';
import { Component } from './Enums.js';

export default {
	computed : {
		// Full Elasticsearch request
		request : function() {
			return Object.assign({
				index : this.header.index,
				type : this.header.type
			}, {
				body : this.body
			});
		},

		// Request header (index, type, client)
		header : () => {
			return Store.getters["Elasticsearch/getHeader"];
		},

		// Request query (generated bodybuilder json request)
		body : () => {
			return Store.getters["Elasticsearch/getBody"];
		},

		// Instructions (contains bodybuilder functions)
		instructions : () => {
			return Store.getters["Elasticsearch/getInstructions"];
		},

		// Aggregations (contains all components aggregations objects)
		aggregations : () => {
			return Store.getters["Elasticsearch/getAggregations"];
		},

		// Communication bus
		bus : () => {
			return Store.getters["Elasticsearch/getBus"];
		},

		// Interactive components (for $emit events)
		components : () => {
			return Store.getters["Elasticsearch/getComponents"]
		},

		// Output items
		items : () => {
			return Store.getters["Hits/getItems"];
		},

		// Items count
		score : () => {
			return Store.getters["Hits/getScore"];
		},
	},

	methods : {
		/*
			Store Elasticsearch Header Setters
		*/
		setHost : (host) => {
			Store.commit("Elasticsearch/setHost", new elasticsearch.Client({ host }));
		},
		setIndex : (index) => {
			Store.commit("Elasticsearch/setIndex", index);
		},
		setType : (type) => {
			Store.commit("Elasticsearch/setType", type);
		},


		/*
			Store Elasticsearch Body Setter
		*/
		setBody : (body) => {
			Store.commit("Elasticsearch/setBody", body);
		},


		/*
			Store Elasticsearch Instructions Add
		*/
		addInstruction : (instruction) => {
			Store.commit("Elasticsearch/addInstruction", instruction);
		},

		/*
			Store Elasticsearch Instructions Remove
		*/
		removeInstruction : (instruction) => {
			Store.commit("Elasticsearch/removeInstruction", instruction);
		},


		/*
			Store Elasticsearch Aggregations Settings
		*/
		setAggregations : (name, value, isDynamic, orderKey, orderDirection) => {
			Store.commit("Elasticsearch/setAggregations", { name, value, isDynamic, orderKey, orderDirection });
		},


		/*
			Add a debounce event to ES store
			That permits to clear (reset) all listed hanged debounces when an user is triggered fetch()
		*/
		addDebounce : (component, debounce) => {
			Store.commit("Elasticsearch/addDebounce", { component, debounce });
		},


		/*
			Reset all the listed debounces
			Called by fetch()
		*/
		resetDebounce : (component = null) => {
			Store.commit("Elasticsearch/resetDebounce", component);
		},


		/*
			Add an interactive component to the store
			Returns the component ID (CID)
		*/
		addComponent : function(type, self) {
			let _CID = Store.getters["Elasticsearch/getCid"],
				_name = type + '_' + _CID;

			Store.commit('Elasticsearch/addComponent', { type, self });
			
			return _name;
		},

		/*
			Get a specific component list by their enum type
			Returns a list of components or an empty list if any component is found
		*/
		getComponents : function(type) {
			let _components = this.components;
			if (_components[type] !== undefined)
				return _components[type];
			
			return [];
		},


		/*
			Add item into the Store
		*/
		addItem : (item) => {
			Store.commit("Hits/addItem", item);
		},


		/*
			Empty the store items list
		*/
		clearItems : () => {
			Store.commit("Hits/clearItems");
		},


		/*
			Set the score of items
		*/
		setScore : (score) => {
			Store.commit("Hits/setScore", score);
		},


		/*
			Mount global function
		*/
		mountInstructions : function(instructions) {
			// Bodybuilder object
			let _BD = Bodybuilder();

			// Execute all instructions to create request
			instructions.forEach(instr => {
				_BD[instr.fun](...instr.args);
			});

			// Return the built request
			return _BD.build();
		},

		/*
			Mount full request
		*/
		mount : function() {
			// Bodybuilder object
			let _BD = Bodybuilder().from(0).size(10);

			// Execute all instructions to create request
			this.instructions.forEach(instr => {
				_BD[instr.fun](...instr.args);
			});

			// Store the JSON request into the body
			this.setBody(_BD.build());

			// Debug
			console.log("[Generics:Mount] Request : ", this.request);
		},


		/*
			Execute ES request
		*/
		fetch : function(self = undefined) {
			console.log("[Generics:Fetch] Request : ", this.request);

			// Diffuse the data from static components
			this.forceDiffuse();

			// Reset debounce events
			this.resetDebounce();

			// Fetch the hits
			this.header.client.search(this.request).then((resp) => {

				// Remove all hits
				this.clearItems();

				var hits = resp.hits.hits;
				//console.log("[Generics:Fetch] Response : ", resp);
				//console.log("[Generics:Fetch] Aggs : ", resp.aggregations);

				/***
				 * Update aggregations after each ES request
				 */
				let _params = {
					'aggs' : resp.aggregations
				};
				if (self !== undefined)
					_params.base = self.$data.CID;
				this.bus.$emit('updateAggs', _params);

				if (hits.length === 0)
					this.setScore(0);
				else {
					hits.forEach((hit) => {
						this.addItem(hit);
					});

					this.setScore(resp.hits.total)
				}
			}, function (err) {
				this.setScore(0);
			});


			// Events emission for appropriate components
			this.getComponents(Component.PAGINATE).forEach(component => {
				if (component.CID !== undefined)
					this.bus.$emit(component.CID);
			});
		},


		/*
			Remove instructions of the component
		*/
		removeInstructions : function() {
			this.localInstructions.forEach(instruction => {
				this.removeInstruction(instruction);
			});
			this.localInstructions = [];
		},


		/*
			Create independent request for autocomplete component
			Fetch the hits which match with the value
		*/
		createRequestForSuggs : function(value, fields, selections, fun, size) {
			// Bodybuilder object
			let _request = this.clone(this.request);

			// Feed the request
			let _body = Bodybuilder().size(size);
			fields.forEach(field => {
				_body[fun]('prefix', field, value);
			});

			// Don't fetch items already selected
			selections.forEach(selection => {
				_body.notFilter('term', '_id', selection._id);
			});

			// Convert the object to json
			_request.body = _body.build();

			// Highlighter
			_request.body["highlight"] = {
				"fields" : {}
			};

			fields.forEach(field => {
				_request.body.highlight.fields[field] = {};
			});

			return _request;
		},


		/*
			Create independent request for RefinementListFilter component
			Get the value of each aggs to init items count
		*/
		createRequestForAggs : function (field, size, orderKey, orderDirection) {
			// Bodybuilder object
			let _request = this.clone(this.request);

			// Store the JSON request into the body
			_request.body = Bodybuilder()
				.size(0)
				.aggregation("terms", field, {
					order : {
						[orderKey] : orderDirection
					},
					size : size
				})
				.build();

			return _request;
		},

		forceDiffuse : function() {
			for (let key in Component) {
				this.getComponents(Component[key]).forEach(component => {
					if (component.$props !== undefined
							&& component.$props.realtime !== undefined && !component.$props.realtime
							&& component.diffuse !== undefined && typeof component.diffuse === 'function')
						component.diffuse();
				});
			}
		},

		clone : (object) => {
			return JSON.parse(JSON.stringify(object));
		},

		remove : (object) => {
			object.fun = null;
			object.args = null;
		}
	}
};
