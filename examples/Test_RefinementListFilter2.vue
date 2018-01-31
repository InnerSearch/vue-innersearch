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
  import PaginateAlt from "../src/components/PaginateAlt.vue";

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
        'RefinementListFilter' : RefinementListFilter,
        'hits' : Hits,
        'paginateAlt' : PaginateAlt,
      },

      template : `
                <section>

                <h1 class='is-title'>Test - RefinementListFilter with hits</h1>

                <hr class='is-line' />

                <div>
                  <refinement-list-filter :field="'state'" :size="15" title="State : " operator="OR" :displayCount="true" orderDirection="desc" orderKey="_count" :dynamic="false" ></refinement-list-filter>
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

                <paginate-alt :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate-alt>

                </section>
            `
    });
  });

  export default {};
</script>
