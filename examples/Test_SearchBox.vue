<template>
    <div id="defaultForm">
    </div>
</template>

<script>
    import Vue from 'vue';
    import '../src/style.css';
    import Generics from '../src/lib/generics';
    import SearchBox from '../src/components/searchBox';
    import SearchButton from '../src/components/searchButton';
    import Hits from '../src/components/hits';

    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',

            created : function () {
                // ES server configuration
                this.setHost("http://es.yinyan.fr");
                this.setIndex("bank");
                this.setType("account");
            },

            components : {
                // Components you need to use
                'searchbox' : SearchBox,
                'search-button' : SearchButton,
                'hits' : Hits
            },

            template : `
                <section>

                <h1 class='is-title'>Test - Searchbox with hits</h1>

                <hr class='is-line' />

                <div>
                    <searchbox :autofocus="true" :realtime="true" :timeout="250" :field="['firstname']" :placeholder="'Search by firstname'"></searchbox>
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
