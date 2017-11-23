# InnerSearch
[![npm](https://img.shields.io/npm/v/innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![npm](https://img.shields.io/npm/dm/innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![coverage](https://img.shields.io/badge/coverage-90%25-green.svg)]()
[![Build Status](https://travis-ci.org/yinyanfr/InnerSearch.js.svg?branch=master)](https://travis-ci.org/yinyanfr/InnerSearch)
[![npm](https://img.shields.io/npm/l/innersearch.svg)]()

## What is InnerSearch ?
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
  created: function () {
    this.SetHost("http://es.yinyan.fr");
    this.SetIndex("bank");
    this.SetType("account");
  },

  components: {
    'refinement-list-filter': refinementListFilter,
    'searchbox': searchbox,
    'hits': hits
  },


  template: `
    <section>
    <h1 class='is-title'>InnerSearch.js</h1>
    <hr class='is-line' />
    <div>
      <searchbox :autofocus="true" :realtime="true" :queries="['firstname']" :placeholder="'Search by Label'"></searchbox>
      <refinement-list-filter :field="'state'" :size="20"></refinement-list-filter>
    </div>
    <hits>
        <template slot="hits" slot-scope="{ hits }">
          <div class="is-score is-hits">
            <strong v-if="hits.score === 0">No result found</strong>
            <strong v-else-if="hits.score === 1">1 result found</strong>
            <strong v-else-if="hits.score > 1">{{ hits.score }} results found</strong>
          </div>

          <div v-for="item in hits.items" class="is-item is-hits">
            <div><strong>Firstname :</strong> {{ item._source.firstname }}</div>
          </div>
        </template>
    </hits>
      
    </section>
  `
});

```

See also [starter app](https://github.com/TrimA74/innerSearch-starter-app)
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
