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
$ npm install --save innersearch
```


## 3 Components list
- [SearchBox](components/searchbox.md)
- [RefinementListFilter](components/refinementListFilter.md)
- [SearchButton](components/searchButton.md)
- [Hits](components/hits.md)
- [Paginate](components/paginate.md)







