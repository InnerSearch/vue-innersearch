# Use Babel et Webpack

Babel compile ton es6, jsx ver es5

Webpack compile ton modules ver es5

### 1 Installer babel et webpack

- babel

`$ npm i —g babel-cli`

`$ npm i —save babel-preset-env babel-preset-react`

env pour es6, react pour jsx

- webpack

`npm i --save webpack`

### 2 Setup babel et webpack

- babel

dans `package.json`:

```json
{
    ...,
   "babel":{
    	"presets": ["babel-preset-env"]
	},
	...
}
```

- webpack

creer `webpack.config.js`

```javascript
module.exports = {
    "entry": "./app.js",
    "output": {
        "filename": "compiled.js"
    }
}
```

### 3 Utilisation de babel et webpack

- babel

`$ babel app.js --out-file compiled.js`

- webpack

`$ webpack`

### 4 Exemple: Utiliser jQuery

`$ npm i --save webpack jquery`

app.js

```javascript
const $ = require("jquery");

$(document).ready(() => {
    ...
})
```

webpack.config.js

```javascript
module.exports = {
    "entry": "./app.js",
    "output": {
        "filename": "compiled.js"
    }
}
```

`$ webpack`