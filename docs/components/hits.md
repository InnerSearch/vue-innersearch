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

Examples : 

```html
<hits>
  <template slot="hits" slot-scope="{ hits }">
  <div v-for="item in hits.items" :item="item">
        <div>
            <strong>Identity (firstname, lastname) :</strong>
                {{ item._source.firstname }} 
                {{ item._source.lastname }} 
                ({{ item._source.state }}, {{ item._source.gender }})
        </div>
  </div>
  </template>
</hits>
```


