# InnerSearch
[![npm](https://img.shields.io/npm/v/innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![npm](https://img.shields.io/npm/dm/innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![coverage](https://img.shields.io/badge/coverage-90%25-green.svg)]()
[![Build Status](https://travis-ci.org/InnerSearch/InnerSearch.js.svg?branch=master)](https://travis-ci.org/InnerSearch/InnerSearch)
[![npm](https://img.shields.io/npm/l/innersearch.svg)]()

## What is InnerSearch ?
InnerSearch is a suite of UI components for Vue.js 

The aim is to rapidly create beautiful specified search applications using declarative components without being an ElasticSearch expert.

See full [Documentation](https://yinyanfr.gitbooks.io/innersearch-doc/content/)

## Quick Start
```bash
$ npm install --save innersearch
```
```js
  /*
      Simple way to use InnerSearch
  */

  import Vue from 'vue';
  import InnerSearch from "../../InnerSearch.js";
  import '../src/style.css';

  Vue.use(InnerSearch);

  window.addEventListener('load', function () {
    new Vue({
      el: '#defaultForm',

      created : function () {
        // ES server configuration
        this.setHost('http://es.yinyan.fr');
        this.setIndex('bank');
        this.setType('account');
      },

      template : `
                <section>
                    <h1 class='is-title'>InnerSearch.js</h1>

                    <hr class='is-line' />

                    <div>
                        <searchbox :autofocus="true" :realtime="true" :timeout="2000" :field="['firstname']" :placeholder="'Search by firstname'"></searchbox>
                        <searchbox :field="['firstname', 'lastname']" :pattern="'{v}.*'" :operator="'AND'" :placeholder="'Search by firstname and lastname (prefix)'" :suggestionbox="true"></searchbox>
                        <refinement-list-filter :field="'state'" :size="100" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
                        <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="true"></refinement-list-filter>
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

                    <paginate :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate>
                    <paginate-alt :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate-alt>
                </section>
            `
    });
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
