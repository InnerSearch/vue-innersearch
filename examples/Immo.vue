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
                this.setHost('http://77.158.35.141:9200');
                this.setIndex('opf');
                this.setType('programs');
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
                    <searchbox :autofocus="true" :realtime="true" :field="['PROMOTEUR', 'DESCRIPTION']" :placeholder="'Search by keywords'"></searchbox>
                </div>

                <hits>
                    <template slot="hits" slot-scope="{ hits }">
                        <div class="is-score is-hits">
                            <strong v-if="hits.score === 0">No result found</strong>
                            <strong v-else-if="hits.score === 1">1 result found</strong>
                            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                        </div>
                        <div v-for="item in hits.items" :item="item">
                            <div>
                                <p><strong>URL :</strong> {{ item._source.URL }}</p>
                                <p>{{ item._source.DESCRIPTION }}</p>
                            </div>
                        </div>
                    </template>
                </hits>

                </section>
            `
        });
    });

    export default {};
</script>