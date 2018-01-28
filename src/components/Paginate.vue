npm<template>
	<section v-if="hits.score != undefined" class="is-component is-line">
		<slot name="buttons">
		<input class="is-button is-previous-button" type="button" :value='previousText' v-on:click='clickOnPrevious' />

		<input class="is-button is-next-button" type="button" :value='nextText' v-on:click='clickOnNext'/>

		<input class="is-field is-current-page" type="text" :value="nbPage" ref="current" disabled="true" />
		</slot>
	</section>
</template>

<script>
	import Store from './../lib/Store';
	import generics from './../lib/Generics';
	import Bodybuilder from 'bodybuilder';

	export default {
		name : "paginate",
		mixins : [generics],
		props : {

			size : {
				type : Number,
				default : 10
			},

			previousText : {
				type : String,
				default : "Previous"
			},

			nextText : {
				type : String,
				default : "Next"
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
			}
		},
    data : function () {
		  return {
		    nbPage : this.page,
      }
    },

		methods : {
			clickOnNext : function() {
				if(this.hits.score >= this.size * (this.nbPage+1)) {
					this.nbPage++;

					this.mount();
					this.body.from = this.size * this.nbPage;
					this.body.size = this.size;
					this.fetch();

				}
			},

			clickOnPrevious : function() {
				if(this.nbPage > 0) {
					this.nbPage--;

					this.mount();
					this.body.from = this.size * this.nbPage;
					this.body.size = this.size;
					this.fetch();
				}
			}
		},

		created : function() {
			this.mount();
			this.body.from = this.nbPage;
			this.body.size = this.size;
		}
	};
</script>

