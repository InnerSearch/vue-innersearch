<template>
    <div id="defaultForm">
    </div>
</template>

<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import InnerSearch from "../src/innerSearch.js";
    import '../src/style.css';

    Vue.use(Vuex);

    const store = new Vuex.Store();
    Vue.use(InnerSearch, { store : store});


    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',

            created : function () {
                // ES server configuration
                this.setHost('http://es.yinyan.fr');
                this.setIndex('bank');
                this.setType('account');
            },


            template : `
                <section>

                <h1 class='is-title'>Test - RefinementListFilter & Searchbox with hits</h1>

                <hr class='is-line' />
                <div class="columns">
                        <div class="column is-one-fifth">
                        <div>
                          <refinement-list-filter :field="'state'" :size="20" title="State : " operator="AND" :displayCount="true" orderKey="_count" orderDirection="desc" >
                          <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }">
                            <div  v-for="(item, index) in items" :key="index" class="is-item is-refinement-list" >
                                    <input
                                    type="checkbox"
                                    :name="item.key"
                                    :value="item.key"
                                    v-model="checkedItems"
                                    @change="clickOnItem(checkedItems)">
                                    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                                    <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
                            </div>
                          </template>
                          </refinement-list-filter>
                          <div class="gender_rlf">
                            <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="true" operator="OR"  orderKey="_count" orderDirection="desc"></refinement-list-filter>
                          </div>
                       </div>
                        </div>
                        <div class="column">
                            <searchbox :autofocus="true" :realtime="false" :timeout="200" :field="'firstname'" :placeholder="'Search by firstname'"></searchbox>
                            <hits>
                                <template slot="hits" slot-scope="{ hits }">
                                    <div class="is-score is-hits">
                                    <strong v-if="hits.score === 0">No result found</strong>
                                    <strong v-else-if="hits.score === 1">1 result found</strong>
                                    <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                                    </div>
                                    <div v-for="item in hits.items" class="hit">
                                        <div><strong>Identity (firstname, lastname) :</strong> <span class="firstname">{{ item._source.firstname }}</span> <span class="lastname">{{ item._source.lastname }}</span> (<span class="state">{{ item._source.state }}</span>, <span class="gender">{{ item._source.gender }}</span>)</div>
                                    </div>
                                </template>
                            </hits>
                            <div style="margin: 20px auto;width: 90%">
                                <search-button></search-button>
                                <reset-button></reset-button>
                            </div>
                        </div>
                </div>





                </section>
            `
        });
    });

    export default {};
</script>

<style>
    @import 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.1/css/bulma.min.css';
</style>
