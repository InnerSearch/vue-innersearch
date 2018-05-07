# InnerSearch : Vue.js components for ElasticSearch
[![npm](https://img.shields.io/npm/v/vue-innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![npm](https://img.shields.io/npm/dm/vue-innersearch.svg)](https://www.npmjs.com/package/innersearch)
[![coverage](https://img.shields.io/badge/coverage-90%25-green.svg)]()
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FInnerSearch%2Fvue-innersearch.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FInnerSearch%2Fvue-innersearch?ref=badge_shield)
[![Build Status](https://travis-ci.org/InnerSearch/vue-innersearch.svg?branch=master)](https://travis-ci.org/InnerSearch/vue-innersearch)
[![npm](https://img.shields.io/npm/l/vue-innersearch.svg)]()

[![Exemple UI](https://raw.githubusercontent.com/InnerSearch/vue-innersearch/develop/docs/images/banner.png)]()

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

See full [Documentation](https://innersearch.github.io/vue-innersearch)
### Installing via NPM
```bash
$ npm install --save vue-innersearch
```

### Using as `<script>` tag
vue-innersearch needs Vue and Vuex to work

````html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js"></script>
  <script src="https://unpkg.com/vue-innersearch@0.0.9/vue-innersearch.min.js"></script>
````

Have a look at how to use the standalone UMD build in our [Jsbin example](http://jsbin.com/jazezahevi/edit?html,output)

## Quick Intro

[Live demo](http://jsbin.com/jazezahevi/edit?html,output)





## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FInnerSearch%2Fvue-innersearch.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FInnerSearch%2Fvue-innersearch?ref=badge_large)
