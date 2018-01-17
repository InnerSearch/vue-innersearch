<template>
    <div id='defaultForm'>
    </div>
</template>

<script>
    /*
        Simple way to use InnerSearch
    */

    import Vue from 'vue';
    import '../src/style.css';
    import Generics from '../src/lib/Generics';
    import Searchbox from '../src/components/SearchBox';
    import Hits from '../src/components/Hits';
    import RefinementListFilter from '../src/components/RefinementListFilter';
    import SearchButton from '../src/components/SearchButton';

    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',

            created : function () {
                // ES server configuration
                this.setHost('http://es.yinyan.fr');
                this.setIndex('bank');
                this.setType('account');
            },

            components : {
                // Components you need to use
                'refinement-list-filter' : RefinementListFilter,
                'searchbox' : Searchbox,
                'search-button' : SearchButton,
                'hits' : Hits
            },

            template : `
                <section>

                <h1 class='is-title'>InnerSearch.js</h1>

                <hr class='is-line' />

                <div>
                    <searchbox :autofocus="true" :realtime="true" :timeout="2000" :field="['firstname']" :placeholder="'Search by firstname'"></searchbox>
                    <searchbox :autofocus="true" :realtime="true" :field="['lastname']" :placeholder="'Search by lastname'"></searchbox>
                    <refinement-list-filter :field="'state'" :size="100" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
                    <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="false"></refinement-list-filter>
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

                </section>
            `
        });
    });

    export default {};
</script>
