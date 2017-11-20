# What is InnerSearch ?
InnerSearch is a suite of UI components built in Vue. The aim is to rapidly create beautiful faceted search applications using declarative components, and without being an ElasticSearch expert.

See full [Documentation](https://yinyanfr.github.io/InnerSearch.js/)

## Quick Intro
```js
/***
 * simple way to use InnerSearch
 */
import searchbox from '@/components/SearchBox';
import hits from '@/components/Hits';
import refinementListFilter from '@/components/RefinementListFilter';
import Generics from '@/lib/Generics';
new Vue({
  el: '#InnerSearch',
  created : function () {
    this.setHost("https://qlap.limics.fr/search");
    this.setIndex("qlap");
  },

  components : {
    'refinement-list-filter' : refinementListFilter,
    'searchbox' : searchbox,
    'hits' : hits
  },
  template: `
  <section>
    <div>
      <searchbox style="display:inline-block;" :autofocus="true" :realtime="true" :queries="['specialities.label']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter style="display:inline-block;" :field="'administration_routes.label'" :size="20"></refinement-list-filter>
    </div>
    <hits></hits>
  </section>
  
  
  `,
});
```
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
