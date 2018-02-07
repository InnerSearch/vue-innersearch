### RefinementListFilter
- **Tag name :** `<refinement-list-filter></refinement-list-filter>`
- **Properties :**
  - `field` (_String_) : Name of the aggregation
  - `size` (_Number_): Amount of facets
  - `orderKey` (_String_) : Possible value (`_term`  |`_count` ) to order by count number or by name term
  - `orderDirection` (_String_) : Possible value ( `asc` | `desc ` )
  - `dymanic` (_Boolean_) : Updating aggregations dynamically 
  - `displayCount` (_Boolean_) : Display or not numbers of aggregations
  - `title` (_String_) : Title of the menu. Shown as a header and within selected filters
  - `operator` (_'AND'|'OR'_) : If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.
  
- **Description :**
A component to add facet refinements in the form of a list of checkboxes.
  
```html
<refinement-list-filter :field="'state'" :size="100" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
```

You can also customize the title and the aggregations display using : 
```<template slot="slotName"></template>```

```html
<refinement-list-filter :field="'state'" :size="100" :title="'State : '" :dynamic="false" orderKey="_count" orderDirection="asc" operator="OR">
  <template slot="title">
    <h2>US State : </h2>
  </template>
  <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,item }">
    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} : {{ item.doc_count }} </label>
    <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
  </template>
</refinement-list-filter>
```
