<template>
    <nav class="is-paginate is-component" v-if='hits.score != undefined'>
        <a class="is-previous is-button" v-show="nbPage > 0" :value="previousText"  @click="clickOnPrevious()" v-html="previousText"></a>

        <a class="is-next is-button" v-show="nbPage < maxPage - 1" :value="nextText" @click="clickOnNext()" v-html="nextText"></a>

        <ul class="is-list">
            <li>
                <a v-if="nbPage == 0" class="is-page is-active">
                    1
                </a>
                <a v-else class="is-page" @click="jumpToPage(1)">
                    1
                </a>
            </li>

            <li v-if="nbPage > (unpiled + 1)">
                <span class="is-ellipsis">&hellip;</span>
            </li>

            <li v-for="(e, i) in maxPage" :key="i" v-if="e > 1 && e < maxPage">
                <a v-if="e == nbPage + 1" class="is-page is-active">
                    {{e}}
                </a>
                <a v-else-if="(e > nbPage - unpiled && e <= nbPage + (unpiled + 1))" class="is-page" @click="jumpToPage(e)">
                    {{e}}
                </a>
            </li>

            <li v-if="nbPage < maxPage - unpiled">
                <span class="is-ellipsis">&hellip;</span>
            </li>

            <li v-if="maxPage > 1">
                <a v-if="nbPage == maxPage - 1" class="is-page is-active">
                    {{ maxPage }}
                </a>
                <a v-else class="is-page" @click="jumpToPage(maxPage)">
                    {{ maxPage }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
	import generics from './../lib/Generics'
    import Bodybuilder from 'bodybuilder'
    import { Component } from './../lib/Enums.js';

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
			},

            unpiled : {
                type: Number,
                default: 5
            }
		},

		data : function() {
			return {
				CID : undefined,
                nbPage : this.page,
                nbPage1: this.page + 1
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
				this.bus.$off('resetPagination');
				this.fetch();
				this.bus.$on('resetPagination', this.resetPagination);
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
            },

            jumpToPage: function(nb) {

                this.nbPage = nb-1;

                // Update pagination
                this.updatePagination();

                // Execute ES request
                this.fetchPagination();

            }
		},

		created : function() {
			// Interactive component declaration
            this.CID = this.addComponent(Component.PAGINATE, this);

			// Listening on self-component emissions
			this.bus.$on('resetPagination', this.resetPagination);

			this.mount();
			this.body.from = this.nbPage;
            this.body.size = this.size;
        }
	};
</script>