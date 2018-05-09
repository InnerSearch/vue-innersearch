### ResetButton
- **Tag name :** `<reset-button></reset-button>`
- **Property :**
  - `text` (_String_, default : _'Search'_) : Text displayed into the input button
  - `emptyHits` (_Boolean_, default : _true_) : Hide every hits displayed in corresponding components
- **Description :**
Create a button that reset the entire form when the user clicks on.

```html
<reset-button></reset-button>

<reset-button text="Clean all" :emptyHits="false"></reset-button>
```
