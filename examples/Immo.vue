<template>
    <div id='defaultForm'>
    </div>
</template>

<script>
    /*
        Simple way to use InnerSearch
    */

    import Vue from 'vue';
    import InnerSearch from "../src/innerSearch.js";
    import MapHits from "./extended-components/Hits-Map";
    import '../src/style.css';
    
    

    Vue.use(InnerSearch);

    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',
            components : {
                'map-hits' : MapHits
            },

            created : function () {
                // ES server configuration
                this.setHost('http://77.158.35.141:9200');
                this.setIndex('opf');
                this.setType('programs');
            },

            template : `
                <section>

                <h1 class='is-title'>innerSearch.js</h1>

                <hr class='is-line' />

                <div class="columns">
                    <div class="column is-one-fifth">
                        <div>
                            <refinement-list-filter :field="'PROMOTEUR.keyword'" :title="'Promoteur : '" orderKey="_count" orderDirection="desc">
                                <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }">
                                    <select name="" id="test" v-model="checkedItems"  @change="clickOnItem(checkedItems)">
                                        <option selected="selected"></option>
                                        <option v-for="(item, index) in items" :value="item.key">
                                                <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                                        </option>
                                    </select>
                                </template>
                            </refinement-list-filter>
                            <refinement-list-filter :field="'VILLE.keyword'" :title="'Ville : '" :size="30" :search="true" orderKey="_count" orderDirection="desc">
                            </refinement-list-filter>
                            <refinement-list-filter :field="'CODE_POSTAL'" :size="10" :title="'Code postal : '"  orderKey="_count" orderDirection="desc" operator="OR"></refinement-list-filter>
                        </div>
                    </div>
                    <div class="column">
                                <div>
                                    <searchbox :autofocus="true" :realtime="true" :field="['NOM']" :placeholder="'Search by name'">
                                        <template slot="suggestions" slot-scope="{ suggestion }">
                                            <div>{{ suggestion.DESCRIPTION.substr(0, 100) }}...</div>
                                        </template>
                                    </searchbox>
                                    <div style="margin: 20px auto;width: 90%">
                                        <search-button></search-button>
                                        <reset-button></reset-button>
                                    </div>
                                    <map-hits :mapKey="'AIzaSyAp_EihOav2B7_oaZ1DGuo9CrU6ZcuQKqY'">
                                        <template slot="hits" slot-scope="{ hits }">
                                            <div class="is-score is-hits">
                                                <strong v-if="hits.score === 0">No result found</strong>
                                                <strong v-else-if="hits.score === 1">1 result found</strong>
                                                <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                                            </div>
                                            <div v-for="item in hits.items" :item="item">
                                                <div style="margin : 10px;">
                                                    <p><strong>NOM :</strong> {{ item._source.NOM }}</p>
                                                    <p><strong>URL :</strong> <a target="_blank" :href="item._source.URL">{{ item._source.PROMOTEUR }}</a></p>
                                                    <p><strong>PROMOTEUR :</strong> {{ item._source.PROMOTEUR }}</p>
                                                    <p><strong>LATITUDE :</strong> {{ item._source.LATITUDE }}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </map-hits>
                                    
                                    <paginate :previousText="'&#x2B9C; Previous page'" :nextText="'Next page &#x2B9E;'" :size="100"></paginate>
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
