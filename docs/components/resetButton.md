### ResetButton

- **Tag name :** `<reset-button></reset-button>`
- **Property :**
  - `for` (_Number_ or _String_, default : _'all'_, _case sensitive_) :  component on which the ResetButton depends on
  
- **Examples :**

_Reset all components :_
```html
<!-- Default 'Reset' button -->
<reset-button></reset-button>

<!-- You can change the button text using a template -->
<reset-button for="all">
  <template>Reset all</template>
</reset-button>
```

_Reset Searchbox component :_
```html
<!-- Reset button (relative on searchbox realtime property) -->
<reset-button for="mySearchbox">
    <template slot-scope="{ value }">
        <strong>Search :</strong> <em>{{ value }}</em>
    </template>
</reset-button>

<!-- Searchbox component -->
<searchbox id="mySearchbox" :realtime="true" [...]></searchbox>