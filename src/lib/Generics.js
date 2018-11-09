import elasticsearch from 'elasticsearch';
import Bodybuilder from 'bodybuilder';

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
		header : function () {
			return this.$store.getters["Elasticsearch/getHeader"];
		},

		// Request query (generated bodybuilder json request)
		body : function () {
			return this.$store.getters["Elasticsearch/getBody"];
		},

		// Instructions (contains bodybuilder functions)
		instructions : function () {
			return this.$store.getters["Elasticsearch/getInstructions"];
		},

		// Aggregations (contains all components aggregations objects)
		aggregations : function () {
			return this.$store.getters["Elasticsearch/getAggregations"];
		},

		// Communication bus
		bus : function () {
			return this.$store.getters["Elasticsearch/getBus"];
		},

		// Interactive components (for $emit events)
		components : function () {
			return this.$store.getters["Elasticsearch/getComponents"]
		},

		// Output items
		items : function () {
			return this.$store.getters["Hits/getItems"];
		},

		// Items count
		score : function () {
			return this.$store.getters["Hits/getScore"];
		},
	},

	methods : {
		/*
			Store Elasticsearch Header Setters
		*/
		setHost : function (host){
			this.$store.commit("Elasticsearch/setHost", new elasticsearch.Client({ host }));
		},
		setIndex : function(index){
			this.$store.commit("Elasticsearch/setIndex", index);
		},
		setType : function(type){
			this.$store.commit("Elasticsearch/setType", type);
		},


		/*
			Store Elasticsearch Body Setter
		*/
		setBody : function (body) {
			this.$store.commit("Elasticsearch/setBody", body);
		},


		/*
			Store Elasticsearch Instructions Add
		*/
		addInstruction : function (instruction) {
			this.$store.commit("Elasticsearch/addInstruction", instruction);
		},

		/*
			Store Elasticsearch Instructions Remove
		*/
		removeInstruction : function (instruction) {
			this.$store.commit("Elasticsearch/removeInstruction", instruction);
		},


		/*
			Store Elasticsearch Aggregations Settings
		*/
		setAggregations : function (name, value, isDynamic, orderKey, orderDirection) {
			this.$store.commit("Elasticsearch/setAggregations", { name, value, isDynamic, orderKey, orderDirection });
		},


		/*
			Add a debounce event to ES store
			That permits to clear (reset) all listed hanged debounces when an user is triggered fetch()
		*/
		addDebounce : function (component, debounce) {
			this.$store.commit("Elasticsearch/addDebounce", { component, debounce });
		},


		/*
			Reset all the listed debounces
			Called by fetch()
		*/
		resetDebounce : function (component = null) {
			this.$store.commit("Elasticsearch/resetDebounce", component);
		},


		/*
			Add an interactive component to the store
			Returns the component ID (CID)
		*/
		addComponent : function(type, self) {
			let _CID = this.$store.getters["Elasticsearch/getCid"],
				_name = type + '_' + _CID;

			this.$store.commit('Elasticsearch/addComponent', { type, self });
			
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
		addItem : function(item) {
			this.$store.commit("Hits/addItem", item);
		},


		/*
			Empty the store items list
		*/
		clearItems : function () {
			this.$store.commit("Hits/clearItems");
		},


		/*
			Set the score of items
		*/
		setScore : function(score) {
			this.$store.commit("Hits/setScore", score);
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
			// Reset debounce events
			this.resetDebounce();

			// Reset the pagination by emitting to appropriate components
			this.bus.$emit('resetPagination');

			// Fetch the hits
			return this.header.client.search(this.request).then((resp) => {

				// Remove all hits
				this.clearItems();

				var hits = resp.hits.hits;
				//console.log("[Generics:Fetch] Response : ", resp);
				//console.log("[Generics:Fetch] Aggs : ", resp.aggregations);

				// Update aggregations after each ES request
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
				}).aggregation("cardinality",field)
				.build();

			return _request;
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
