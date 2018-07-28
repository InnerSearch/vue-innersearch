<template>
    <section>
        <h1 class='is-title'>innerSearch.js</h1>

        <searchbox :field="'Dba'" :realtime="true"></searchbox>

        <map-hits :mapKey="GOOGLE_MAP_KEY">
            <template slot="hits" slot-scope="{ hits }">
                <div class="is-score is-hits">
                    <strong v-if="hits.score === 0">No result found</strong>
                    <strong v-else-if="hits.score === 1">1 result found</strong>
                    <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
                </div>
                <div v-for="(item,key) in hits.items" :key="key">
                    <div  style="margin : 10px;">
                        <p><strong>NOM :</strong> {{ item._source.Dba }}</p>
                        <p><strong>Action :</strong> {{ item._source.Action }}</p>
                        <p><strong>Zipcode :</strong> {{ item._source.Zipcode }}</p>
                    </div>
                </div>
            </template>
        </map-hits>

        <hr class='is-line' />
    </section>
</template>

<script>

    import Vue from 'vue';
    import InnerSearch from "../src/innerSearch.js";
    import MapHits from "./extended-components/Hits-Map";
    import '../src/style.css';

    Vue.use(InnerSearch);

    export default {
        
        components : {
            'map-hits' : MapHits
        },

        created : function () {
            // ES server configuration
            this.setHost('http://innersearch:' + process.env.ELASTIC_INNERSEARCH_PASSWORD + '@elastic.innersearch.tk/');
            this.setIndex('nyc_restaurants');
            this.GOOGLE_MAP_KEY = process.env.GOOGLE_MAP_KEY;
        },
    }

</script>