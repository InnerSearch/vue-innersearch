### TagFilter
- **Tag name :** `<tag-filter></tag-filter>`
- **Property :**
  - `for` (_String_ or _Number_) : Targeted component
  - `clearAll` (_boolean_, default : _false_) : An optional value to specify if you want to link each item of the component to one tag filter, or if you to reset all items by clicking on the tag filter 
- **Description :**
By adding an 'id' property on any dynamic component, you can link a reactive tag filter that allow you to reset entirely or partially the component.


```html
<tag-filter for='searchbox'></tag-filter>
<searchbox id='searchbox' [...]></searchbox>

<tag-filter for='rlf-checkbox' :clearAll='true'></tag-filter>
<refinement-list-filter id='rlf-checkbox' [...]></refinement-list-filter>
```
