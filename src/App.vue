<template>
  <section>
    <div>
      <searchbox style="display:inline-block;" :autofocus="true" :realtime="true" :queries="['specialities.label']" :placeholder="'Search by ID'"></searchbox>
      <refinement-list-filter style="display:inline-block;" :field="'administration_routes.label'" :size="20"></refinement-list-filter>
    </div>
    <hits></hits>
  </section>
</template>

<script>
  import searchbox from '@/components/SearchBox';
  import hits from '@/components/Hits';
  import refinementListFilter from '@/components/RefinementListFilter';
  export default {
    components : {
      'refinement-list-filter' : refinementListFilter,
      searchbox,
      hits,
    }
  }
</script>

<style>
#UserView {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
