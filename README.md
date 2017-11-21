# What is InnerSearch ?
InnerSearch is a suite of UI components for Vue.js 

The aim is to rapidly create beautiful specified search applications using declarative components without being an ElasticSearch expert.

See full [Documentation](https://yinyanfr.github.io/InnerSearch.js/)

## Quick Start
```bash
$ npm install --save innersearch
```
```js
/***
 * simple way to use InnerSearch
 */
import InnerSearch, {
    searchbox,
    hits,
    refinementListFilter,
    Generics
} from "innersearch";

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

# test
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
