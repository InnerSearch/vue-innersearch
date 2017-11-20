# InnerSearch Documentation

## 1 Introduction
### 1.1 What is InnerSearch ?
InnerSearch is a suite of UI components built in Vue. The aim is to rapidly create beautiful faceted search applications using declarative components, and without being an ElasticSearch expert.



## 2 Installation

## 3 Your first component

## 4 Components list
- [SearchBox](###SearchBox)
- [Hits](###Hits)
- [RefinementListFilter](###RefinementListFilter)

###SearchBox

- **Tag name :** `<searchbox></searchbox>`
- **Properties :**
  - `autofocus` (_Boolean_) :  Cursor focusing on the input by default
  - `realtime` (_Boolean_) : Performing ES request on every input change 
  - `queries` (_Array_) :  An array of elasticsearch fields to search within
  - `placeholder` (_String_):  Placeholder for the input box

###Hits
- **Tag name :** `<hits></hits>`

###RefinementListFilter
- **Tag name :** `<refinement-list-filter></refinement-list-filter>`
- **Properties :**
  - `field` (_string_) : Name of the aggregation
  - `size` (_number_): Amount of bulks 

