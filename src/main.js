import "babel-polyfill";
// IE 11

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';



Vue.config.productionTip = false


/***
 * How to use InnerSearch with App.vue
 */
/*
import App from './App';
new Vue({
  el: '#InnerSearch',
  components : {
    App,
  },
  template: '<App/>',
});
*/

/***
 * simple way to use InnerSearch
 */
import '@/style.css';
import Searchbox from '@/components/SearchBox';
import Hits from '@/components/Hits';
import RefinementListFilter from '@/components/RefinementListFilter';
import SearchButton from '@/components/SearchButton';
import Generics from '@/lib/Generics';


/*
new Vue({
  el: '#InnerSearch',
  created : function () {
    this.SetHost("https://qlap.limics.fr/search");
    this.SetIndex("qlap");
    this.SetType("specialities");
  },

  components : {
    'refinement-list-filter' : RefinementListFilter,
    'searchbox' : Searchbox,
    'hits' : Hits
  },


  template : `
    <section>
    <h1 class='is-title'>InnerSearch.js</h1>
    <hr class='is-line' />
    <div>
      <searchbox :autofocus="true" :realtime="true" :queries="['label']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter :field="'administration_routes.label'" :size="20"></refinement-list-filter>
    </div>
    <hits>
        <template slot="hits" slot-scope="{ hits }">
          <div class="is-score is-hits">
            <strong v-if="hits.score === 0">No result found</strong>
            <strong v-else-if="hits.score === 1">1 result found</strong>
            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
          </div>
          <div v-for="item in hits.items" class="is-item is-hits">
            <div><strong>Label :</strong> {{ item._source.label }}</div>
            <div><strong>Route(s) :</strong>
              <ul><li v-for="voies in item._source.administration_routes">{{ voies.label }}</li></ul>
            </div>
            <div v-if="item._source.is_commercialized === 1" style="margin-top : 20px;">
              <strong style="color : #0F4166;">Commercialized</strong>
            </div>
          </div>
        </template>
    </hits>

    </section>
  `
});
*/


new Vue({
  el: '#InnerSearch',
  created : function () {

  this.SetHost("http://es.yinyan.fr");
  this.SetIndex("bank");
  this.SetType("account");
  },

  components : {
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
      <searchbox :autofocus="true" :realtime="true" :field="['firstname']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter :field="'state'" :size="20"></refinement-list-filter>
      <refinement-list-filter :field="'gender'" :size="20"></refinement-list-filter>
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