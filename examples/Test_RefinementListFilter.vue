<template>
  <div id="defaultForm">
  </div>
</template>

<script>
  import Vue from 'vue';
  import '../src/style.css';
  import Generics from '../src/lib/Generics';
  import RefinementListFilter from '../src/components/RefinementListFilter.vue';
  import Hits from '../src/components/Hits';

  window.addEventListener('load', function () {
    new Vue({
      el: '#defaultForm',
      mixins : [Generics],

      created : function () {
        // ES server configuration
        this.setHost("http://es.yinyan.fr");
        this.setIndex("bank");
        this.setType("account");
      },

      components : {
        // Components you need to use
        'RefinementListFilter' : RefinementListFilter,
        'hits' : Hits
      },

      template : `
                <section>

                <h1 class='is-title'>Test - RefinementListFilter with hits</h1>

                <hr class='is-line' />

                <div>
                  <refinement-list-filter :field="'state'" :size="100" title="State : " operator="AND" :displayCount="true" orderKey="_count" orderDirection="asc" :dynamic="true" >
                  <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,item }">
                      <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                      <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
                  </template>
                  </refinement-list-filter>
               </div>

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

                </section>
            `
    });
  });

  export default {};
</script>
