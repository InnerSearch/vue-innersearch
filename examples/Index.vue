<template>
    <div id='defaultForm'>
    </div>
</template>

<script>
    /*
        Simple way to use InnerSearch
    */

    import Vue from 'vue';
    import InnerSearch from "../../InnerSearch.js";
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
                    <h1 class='is-title'>InnerSearch.js</h1>

                    <hr class='is-line' />

                    <div>
                        <!--<searchbox :autofocus="true" :realtime="true" :timeout="2000" :field="['firstname']" :placeholder="'Search by firstname'"></searchbox>-->
                        <searchbox :realtime="true" :field="['firstname', 'lastname']" :pattern="'{v}.*'" :operator="'AND'" :placeholder="'Search by firstname and lastname (prefix)'" :suggestionbox="true">
                            <template slot="suggestions" slot-scope="{ suggestion }">
                                <div>{{ suggestion.key }}</div>
                            </template>
                        </searchbox>
                        <refinement-list-filter :field="'state'" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
                        <!--<refinement-list-filter :field="'state'" :size="100" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
                        <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="true"></refinement-list-filter>-->
                        <search-button></search-button>
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
                    <paginate-alt :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate-alt>
                </section>
            `
        });
    });

    export default {};
</script>
