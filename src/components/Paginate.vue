<template>
    <nav class="is-paginate is-component" v-if='hits.score != undefined'>
        <a class="is-previous is-button" v-show="nbPage > 0" :value="previousText"  @click="clickOnPrevious" v-html="previousText"></a>

        <a class="is-next is-button" v-show="nbPage < maxPage - 1" :value="nextText" @click="clickOnNext" v-html="nextText"></a>

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
    import Store from './../lib/Store'
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
			this.bus.$on(this.CID, this.resetPagination);

			this.mount();
			this.body.from = this.nbPage;
            this.body.size = this.size;
        }
	};
</script>

<style>
    .is-component.is-paginate {
        display : flex;
        width : 90%;
        margin : 20px auto;
        align-items : center;
        justify-content : center;
        text-align : center;
        border : 1px solid transparent;
    }

    .is-previous {
        order: 1;
    }

    .is-list {
        display : flex;
        flex-grow : 1;
        align-items : center;
        justify-content : center;
        text-align : center;
        list-style : none;
        list-style-type : none;
        list-style-position : initial;
        list-style-image : initial;
        order : 2;
    }

    .is-next {
        order: 3;
    }

    .is-next, .is-previous {
        padding-left : .75em;
        padding-right : .75em;
        white-space : nowrap;
    }

    .is-page, .is-next, .is-previous {
        min-width : 2.25em;
        border-color : #dbdbdb;
        color : #363636;
        cursor : pointer;
    }

    .is-page.is-active {
        background-color: #3273dc;
        border-color: #3273dc;
        color: #fff;
    }

    .is-page:active:not(.is-active), .is-next:active, .is-previous:active {
        box-shadow : inset 0 1px 2px rgba(10,10,10,.2);
    }

    .is-page:hover:not(.is-active), .is-next:hover, .is-previous:hover {
        border-color : #b5b5b5;
    }

    .is-page, .is-next, .is-previous, .is-ellipsis {
        margin : .25rem;
        justify-content : center;
        text-align : center;
    }

    .is-page, .is-next, .is-previous, .is-ellipsis {
        display : inline-flex;
        align-items : center;
        border : 1px solid transparent;
        border-radius : 4px;
        font-size : 1rem;
        height : 2.25em;
        padding-bottom : calc(.175em - 1px);
        padding-left : calc(.325em - 1px);
        padding-right : calc(.325em - 1px);
        padding-top : calc(.175em - 1px);
    }
</style>
