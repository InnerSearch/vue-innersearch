<template>
    <div id='defaultForm'>
    </div>
</template>

<script>
    /*
        Simple way to use InnerSearch
    */

    import Vue from 'vue';
    import InnerSearch from "../innerSearch.js";
    import '../src/style.css';

    Vue.use(InnerSearch);

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
                    <h1 class='is-title'>innerSearch.js</h1>

                    <hr class='is-line' />

                    <div class="columns">
                        <div class="column is-one-fifth">
                            <div>
                                <refinement-list-filter :field="'state'" :title="'State : '" :size="10" :dynamic="true" orderKey="_count" orderDirection="desc" operator="OR"></refinement-list-filter>
                                <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="true" operator="OR"></refinement-list-filter>
                            </div>
                        </div>
                        <div class="column">
                            <div>
                                <searchbox :autofocus="true" :realtime="true" :timeout="200" :field="'firstname'" :placeholder="'Search by firstname'"></searchbox>
                                <div style="margin: 20px auto;width: 90%">
                                    <search-button></search-button>
                                    <reset-button></reset-button>
                                </div>
                                <hits>
                                    <template slot="hits" slot-scope="{ hits }">
                                        <div class="is-score is-hits">
                                            <strong v-if="hits.score === 0">No result found</strong>
                                            <strong v-else-if="hits.score === 1">1 result found</strong>
                                            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                                        </div>
                                        <div v-for="item in hits.items" :item="item">
                                            <div><strong>Identity (firstname, lastname) :</strong> {{ item._source.firstname }} {{ item._source.lastname }} ({{ item._source.state }}, {{ item._source.gender }})</div>
                                        </div>
                                    </template>
                                </hits>

                                <paginate :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate>
                            </div>
                         </div>
                    </div>
                </section>
            `
        });
    });

    export default {};
</script>
