### RefinementListFilter
- **Tag name :** `<refinement-list-filter></refinement-list-filter>`
- **Properties :**
  - `field` (_String_) : Name of the aggregation
  - `size` (_Number_): Amount of facets
  - `orderKey` (_String_) : Possible value (`_term`  |`_count` ) to order by count number or by name term
  - `orderDirection` (_String_) : Possible value ( `asc` | `desc ` )
  - `displayCount` (_Boolean_) : Display or not numbers of aggregations
  - `title` (_String_) : Title of the menu. Shown as a header and within selected filters
  - `operator` (_'AND'|'OR'_) : If you filter on a and b with OR, results with either the value a or b will match. If you select a and b, results will show which have both a and b.
  - `search` (_Boolean_) : Add a input text filter above the component
  
- **Description :**
A component to add facet refinements in the form of a list of checkboxes.
  
```html
<refinement-list-filter :field="'state'" :size="100" :title="'State : '" orderKey="_count" orderDirection="asc" operator="OR"></refinement-list-filter>
```

You can also customize the title and the aggregations display using : 
```<template slot="slotName"></template>```

Refinment List with checkbox
```html
<refinement-list-filter :type="'checkbox_list'" :field="'state'" :title="'State : '" :size="10"  orderKey="_count" orderDirection="desc" operator="OR">
    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
        <div  v-for="(item, index) in items" :key="index" class="is-item is-refinement-list">
            <input
            type="checkbox"
            :name="item.key"
            :value="item.key"
            v-model="checkedItems"
            @change="clickOnItem(checkedItems)">
            <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
            <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
        </div>
    </template>
</refinement-list-filter>
```

Refinement List with radio button

````html
<refinement-list-filter :field="'state'" :size="100" title="State : " operator="AND" :displayCount="true" orderKey="_count" orderDirection="asc"  >
    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
        <div  v-for="(item, index) in items" :key="index" class="is-item is-refinement-list">
            <input
            type="radio"
            :name="item.key"
            :value="item.key"
            v-model="checkedItems"
            @change="clickOnItem(checkedItems)">
            <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
            <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
        </div>
    </template>
</refinement-list-filter>
````

Refinement List with simple dropdownlist
```html
<refinement-list-filter :field="'state'" :title="'State : '" :size="100"  orderKey="_count" orderDirection="desc" operator="OR">
    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
        <select name="" id="" v-model="checkedItems"  @change="clickOnItem(checkedItems)">
            <option v-for="(item, index) in items" :value="item.key">

                    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                    <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
            </option>
        </select>
    </template>
    <template slot="viewmore"></template>
</refinement-list-filter>
```

Refinement List with dropdownlist (multiple)
```html
<refinement-list-filter :field="'state'" :title="'State : '" :size="100"  orderKey="_count" orderDirection="desc" operator="OR">
    <template slot="label" slot-scope="{ displayCount,clickOnLabel,clickOnItem,items,checkedItems }"> 
        <select name="" id="" v-model="checkedItems"  @change="clickOnItem(checkedItems)">
            <option v-for="(item, index) in items" :value="item.key">

                    <label v-if="displayCount" :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }} ( {{ item.doc_count }} )</label>
                    <label v-else :for="item.key" v-on:click='clickOnLabel(item.key)'>{{ item.key }}</label>
            </option>
        </select>
    </template>
    <template slot="viewmore"></template>
</refinement-list-filter>
```
