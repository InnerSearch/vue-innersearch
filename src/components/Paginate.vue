<template>
	<section v-if="hits.score != undefined" class="is-component is-line">
		<slot name="buttons">
		<input class="is-button is-previous-button" type="button" :value='this.previousText' v-on:click='this.clickOnPrevious' />

		<input class="is-button is-next-button" type="button" :value='this.nextText' v-on:click='this.clickOnNext'/>

		<input class="is-field is-current-page" type="text" :value="this.page" ref="current" disabled="true" />
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

		methods : {
			clickOnNext : function() {
				if(this.hits.score >= this.size * (this.page+1)) {
					this.page++;
					this.$refs.current.value = this.page;

					this.mount();
					this.body.from = this.size * this.page;
					this.body.size = this.size;
					this.fetch();
					
				}
			},

			clickOnPrevious : function() {
				if(this.page > 0) {
					this.page--;
					this.$refs.current.value = this.page;

					this.mount();
					this.body.from = this.size * this.page;
					this.body.size = this.size;
					this.fetch();
				}
			}
		},

		created : function() {
			this.mount();
			this.body.from = this.page;
			this.body.size = this.size;
		}
	};
</script>

