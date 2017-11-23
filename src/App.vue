<template>
  <section>
    <div>
      <searchbox style="display:inline-block;" :autofocus="true" :realtime="true" :queries="['specialities.label']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter style="display:inline-block;" :field="'administration_routes.label'" :size="20"></refinement-list-filter>
    </div>
    <hits></hits>
  </section>
</template>

<script>
  // import searchbox from './components/SearchBox';
  // import hits from './components/Hits';
  // import refinementListFilter from './components/RefinementListFilter';
  // import Generics from './lib/Generics';
  import InnerSearch, {
  searchbox,
  hits,
  refinementListFilter,
  Generics
} from "./../innersearch";

  export default {
    created : function () {
      this.setHost("https://qlap.limics.fr/search");
      this.setIndex("qlap");
    },

    components : {
      'refinement-list-filter' : refinementListFilter,
      'searchbox' : searchbox,
      'hits' : hits
    }
  }
</script>
