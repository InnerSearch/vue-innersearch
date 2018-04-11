# InnerSearch : Vue.js components for ElasticSearch
[![npm](https://img.shields.io/npm/v/vue-innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![npm](https://img.shields.io/npm/dm/vue-innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![coverage](https://img.shields.io/badge/coverage-90%25-green.svg)]()
[![Build Status](https://travis-ci.org/InnerSearch/vue-innersearch.svg?branch=master)](https://travis-ci.org/InnerSearch/vue-innersearch)
[![npm](https://img.shields.io/npm/l/vue-innersearch.svg)]()

## What is InnerSearch ?
An Open Source project created to help developers working with vue.js and Elastic, give them the possibility to create search UIs within the hour.

InnerSearch is a suite of UI components like SearchBox, RefinementListFilter, Paginator and many others to come built with Vue.js.

The aim is to rapidly create beautiful specified search interfaces using declarative components without being an ElasticSearch and Vue.js expert.

Thanks too component props and slot features from Vue.js, the components are easily customizable

An UI example buit with InnerSearch : 
[![Exemple UI](https://raw.githubusercontent.com/InnerSearch/vue-innersearch/master/docs/images/exemple-ui.png)]()

Corresponding code : 
```html
<div class="columns">
    <div class="column is-one-fifth">
        <div>
            <refinement-list-filter :field="'state'"></refinement-list-filter>
            <refinement-list-filter :field="'gender'"></refinement-list-filter>
        </div>
    </div>
    <div class="column">
        <div>
            <searchbox :field="'firstname'"></searchbox>
            <div style="margin: 20px auto;width: 90%">
                <search-button></search-button>
                <reset-button></reset-button>
            </div>
            <hits></hits>

            <paginate :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate>
        </div>
     </div>
</div>
```

## Quick Start
Checkout innersearch starter app [starter app](https://github.com/TrimA74/innerSearch-starter-app)

See full [Documentation](https://yinyanfr.gitbooks.io/innersearch-doc/content/)
### Installing via NPM
```bash
$ npm install --save innersearch
```

## Quick Intro
[Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)

:warning: **CORS need to be enable on your browser in order to make the demo work**

[Live demo](http://vue-innersearch.surge.sh/)
```html
<div class="columns">
    <div class="column is-one-fifth">
        <div>
            <refinement-list-filter :field="'state'" :title="'State : '" :size="10" :dynamic="true" orderKey="_count" orderDirection="desc" operator="OR"></refinement-list-filter>
            <refinement-list-filter :field="'gender'" :size="100" :title="'Gender : '" :displayCount="true" operator="OR"></refinement-list-filter>
        </div>
    </div>
    <div class="column">
        <div>
            <searchbox :autofocus="true" :realtime="true" :timeout="200" :field="'firstname'" :placeholder="'Search by firstname'"></searchbox>
            <div style="margin: 20px auto;width: 90%">
                <search-button></search-button>
                <reset-button></reset-button>
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
        </div>
     </div>
</div>
```


