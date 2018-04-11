# InnerSearch : Vue.js components for ElasticSearch

## 1 Introduction
### 1.1 What is InnerSearch ?

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

## 2 Installation
### Installing via NPM
```bash
$ npm install --save vue-innersearch
```

## 3 Getting Started
### Setup a new Vue project using vue-innersearch
You can use the innersearch-starter-app 
- `git clone https://github.com/TrimA74/innerSearch-starter-app.git`
- `cd innerSearch-starter-app`
- `npm i`
### Run the dev server
- `npm run dev`

This should open a new tab in your browser at [http://localhost:8080](http://localhost:8080) 

### Use the vue-innersearch plugin

You need to tell Vue to use the Vue InnerSearch plugin so that all components are available

```javascript
import InnerSearch from 'vue-innersearch';

Vue.use(InnerSearch);
```

If you only want specific components like SearchBox and Hits components, you can do the following.

:warning: Don't forget to import the Generics mixin component.

```javascript
import {Searchbox, Hits, Generics} from 'vue-innersearch';

Vue.component('searchbox', Searchbox);
Vue.component('hits', Hits);
Vue.mixin(Generics);
```

### Your first search UI
You need first to set ElasticSearch host, index and type. 

```javascript
// ES server configuration
this.setHost('http://es.yinyan.fr');
this.setIndex('bank');
this.setType('account');
```





## 4 Components list
- [SearchBox](components/searchbox.md)
- [RefinementListFilter](components/refinementListFilter.md)
- [SearchButton](components/searchButton.md)
- [Hits](components/hits.md)
- [Paginate](components/paginate.md)
- [SearchDataList](components/searchDataList.md)
- [NumericListFilter](components/numericListFilter.md)







