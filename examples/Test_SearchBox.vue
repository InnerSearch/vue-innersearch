<template>
    <div id="defaultForm">
    </div>
</template>

<script>
    import Vue from 'vue';
    import '../src/style.css';
    import Generics from '../src/lib/generics';
    import Searchbox from '../src/components/searchBox';
    import Hits from '../src/components/hits';

    window.addEventListener('load', function () {
        new Vue({
            el: '#defaultForm',

            created : function () {
                // ES server configuration
                this.SetHost("http://es.yinyan.fr");
                this.SetIndex("bank");
                this.SetType("account");
            },

            components : {
                // Components you need to use
                'searchbox' : Searchbox,
                'hits' : Hits
            },

            template : `
                <section>

                <h1 class='is-title'>Test - Searchbox with hits</h1>

                <hr class='is-line' />

                <div>
                    <searchbox :autofocus="true" :realtime="true" :timeout="500" :field="['firstname']" :placeholder="'Search by firstname'"></searchbox>
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
