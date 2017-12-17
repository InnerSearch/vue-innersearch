# InnerSearch Documentation

## 1 Introduction
### 1.1 What is InnerSearch ?
InnerSearch is a suite of UI components built in Vue. The aim is to rapidly create beautiful faceted search applications using declarative components, and without being an ElasticSearch expert.



## 2 Installation

## 3 Your first component

## 4 Components list
- [SearchBox](###SearchBox)
- [RefinementListFilter](###RefinementListFilter)
- [SearchButton](###SearchButton)
- [Hits](###Hits)

### SearchBox

- **Tag name :** `<searchbox></searchbox>`
- **Properties :**
  - `autofocus` (_Boolean_, default : _false_) :  Cursor focusing on the input by default
  - `realtime` (_Boolean_, default : _false_) : Performing ES request on every input change 
  - `timeout` (_Number_, default : _300_) : Timeout between to ES request (available only if realtime is true)
  - `queries` (_Array_) :  An array of elasticsearch fields to search within
  - `placeholder` (_String_, default : _'Search'_):  Placeholder for the input box

### RefinementListFilter
- **Tag name :** `<refinement-list-filter></refinement-list-filter>`
- **Properties :**
  - `field` (_string_) : Name of the aggregation
  - `size` (_number_): Amount of bulks 

### SearchButton
- **Tag name :** `<search-button></search-button>`
- **Property :**
  - `text` (_string_, default : _'Search'_) : Text displayed into the input button
- **Description :**
Create a button that display the hits when the user clicks on.

### Hits
- **Tag name :** `<hits></hits>`
