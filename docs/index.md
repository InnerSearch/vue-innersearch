# InnerSearch Documentation

## 1 Introduction
### 1.1 What is InnerSearch ?
InnerSearch is a suite of UI components built in Vue. The aim is to rapidly create beautiful faceted search applications using declarative components, and without being an ElasticSearch expert.



## 2 Installation

## 3 Your first component

## 4 Components list
- [SearchBox](###SearchBox)
- [RefinementListFilter](###RefinementListFilter)
- [SearchButton](/components/seachbox.md)
- [Hits](###Hits)



### RefinementListFilter
- **Tag name :** `<refinement-list-filter></refinement-list-filter>`
- **Properties :**
  - `field` (_String_) : Name of the aggregation
  - `size` (_Number_): Amount of bulks
  - `orderKey` (_String_) : Possible value (`_term`  |`_count` ) to order by count number or by name term
  - `orderDirection` (_String_) : Possible value (`asc` | `desc ` )
  - `dymanic` (_Boolean_) : Updating aggregations dynamicly 
### SearchButton
- **Tag name :** `<search-button></search-button>`
- **Property :**
  - `text` (_string_, default : _'Search'_) : Text displayed into the input button
- **Description :**
Create a button that display the hits when the user clicks on.

### Hits
- **Tag name :** `<hits></hits>`
- **Overriding template:** You can override the display like this : 
```html
<hits>
  <template slot="hits" slot-scope="{ hits }">
  ...
  </template>
</hits>
```
