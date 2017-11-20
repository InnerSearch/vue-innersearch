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
import "@/style.css";
import searchbox from '@/components/SearchBox';
import hits from '@/components/Hits';
import refinementListFilter from '@/components/RefinementListFilter';
import Generics from '@/lib/Generics';

new Vue({
  el: '#InnerSearch',
  created : function () {
    this.setHost("https://qlap.limics.fr/search");
    this.setIndex("qlap");
    this.setType("specialities");
  },

  components : {
    'refinement-list-filter' : refinementListFilter,
    'searchbox' : searchbox,
    'hits' : hits
  },
  template: `
  <section>
    <div>
      <searchbox style="display:inline-block;" :autofocus="true" :realtime="true" :queries="['label']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter style="display:inline-block;" :field="'administration_routes.label'" :size="20"></refinement-list-filter>
    </div>
    <hits>
        <template slot="hits" slot-scope="{ hits }">
          <strong v-if="hits.score === 0">No result found</strong>
          <strong v-else-if="hits.score === 1">1 result found</strong>
          <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>

          <div v-for="item in hits.items" :item="item">
            <div><strong>Name (label) :</strong> {{ item._source.label }}</div>
            <div><strong>voie :</strong><li v-for="voies in item._source.administration_routes">{{ voies.label }}</li></div>
          </div>
        </template>
    </hits>
      
  </section>`,
});



/***
 * simple way to use InnerSearch
 *
 *
 * {
    "account_number": 0,
    "balance": 16623,
    "firstname": "Bradshaw",
    "lastname": "Mckenzie",
    "age": 29,
    "gender": "F",
    "address": "244 Columbus Place",
    "employer": "Euron",
    "email": "bradshawmckenzie@euron.com",
    "city": "Hobucken",
    "state": "CO"
}

 */

/*
import searchbox from '@/components/SearchBox';
import hits from '@/components/Hits';
import refinementListFilter from '@/components/RefinementListFilter';
import Generics from '@/lib/Generics';
new Vue({
  el: '#InnerSearch',
  created : function () {
    this.setHost("http://es.yinyan.fr/");
    this.setIndex("bank");
    this.setType("");
  },

  components : {
    'refinement-list-filter' : refinementListFilter,
    'searchbox' : searchbox,
    'hits' : hits
  },
  template: `
  <section>
    <div>
      <searchbox style="display:inline-block;" :autofocus="true" :realtime="true" :queries="['firstname']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter style="display:inline-block;" :field="'city'" :size="20"></refinement-list-filter>
    </div>
    <hits>
        <template slot-scope="{ item }">
          <p>{{item._source.firstname}}</p>
      </template>
    </hits>

  </section>`,
});*/
