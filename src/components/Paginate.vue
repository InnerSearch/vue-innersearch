<template>
	<section v-if='hits.score != undefined' class='is-component is-line'>
		<input class='is-button is-previous-button' type='button' :value='previousText' v-on:click='clickOnPrevious' />

		<input class='is-button is-next-button' type='button' :value='nextText' v-on:click='clickOnNext'/>

		<input class='is-field is-current-page' type='text' :value='(maxPage <= 0 ? 0 : nbPage + 1) + "/" + maxPage' ref='current' disabled='true' />
	</section>
</template>

<script>
	import Store from './../lib/Store';
	import generics from './../lib/Generics';
	import Bodybuilder from 'bodybuilder';

	export default {
		name : 'paginate',
		mixins : [generics],
		props : {

			size : {
				type : Number,
				default : 10
			},

			previousText : {
				type : String,
				default : 'Previous'
			},

			nextText : {
				type : String,
				default : 'Next'
			},

			page : {
				type : Number,
				default : 0
			}
		},

		computed : {
			hits : function() {
				return {
					items : this.items,
					score : this.score
				};
			},

			maxPage : function() {
				return Math.ceil(this.hits.score / this.size);
			}
		},

		data : function() {
			return {
				CID : undefined,
				nbPage : this.page
			}
    	},

		methods : {
			resetPagination : function() {
 				this.nbPage = this.page;
				this.body.from = this.nbPage;
				this.body.size = this.size;
			},

			updatePagination : function() {
				this.mount();
				this.body.from = this.size * this.nbPage;
				this.body.size = this.size;
			},

			fetchPagination : function() {
				// Disabled pagination reset for this fetch() call, and then reactive the listener
				this.bus.$off(this.CID);
				this.fetch();
				this.bus.$on(this.CID, this.resetPagination);
			},

			clickOnPrevious : function() {
				if (this.nbPage > 0) {
					this.nbPage--;

					// Update pagination
					this.updatePagination();

					// Execute ES request
					this.fetchPagination();
				}
			},

			clickOnNext : function() {
				if (this.hits.score > this.size * (this.nbPage + 1)) {
					this.nbPage++;

					// Update pagination
					this.updatePagination();

					// Execute ES request
					this.fetchPagination();
				}
			}
		},

		created : function() {
			// Interactive component declaration
			this.CID = this.addComponent('paginate');

			// Listening on self-component emissions
			this.bus.$on(this.CID, this.resetPagination);

			this.mount();
			this.body.from = this.nbPage;
			this.body.size = this.size;
		}
	};
</script>

