### Paginate

- **Tag name :** `<paginate></paginate>`
- **Properties :**
  - `size` (_Number_, default : _10_) :  Number of results that will be returned from ElasticSearch
  - `page` (_Number_, default : _0_) : Number of the page currently displayed
  - `previousText` (_String_, default : _Previous_) : Text displayed on the "previous" button
  - `nextText` (_String_, default : _Next_) :  Text displayed on the "next" button

- **Examples :**

- **Description :**
A component to navigate between results pages.



```html
<paginate :previousText="'Previous page'" :nextText="'Next page'" :size="10"></paginate>
```
