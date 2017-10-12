# Use Babel et Webpack, et uglify-js

Babel compile ton es6, jsx vers es5

Webpack compile ton modules vers es5

Uglify-js compresser ton js vers min.js

### 1 Installer

- babel

`$ npm i —g babel-cli`

`$ npm i —save babel-preset-env babel-preset-react`

env pour es6, react pour jsx

- webpack

`npm i --save webpack`

- uglify

`$ npm i -g uglify-js`

### 2 Setup

- babel

dans `package.json`:

```json
{
    //...,
   "babel":{
    	"presets": ["babel-preset-env"]
	},
	//...
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

### 3 Utilisation

- babel

`$ babel app.js --out-file compiled.js`

- webpack

`$ webpack`

- uglify-js

`$ uglifyjs -c -m -- app.js -o app.min.js`

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

### 5 Exemple: modern web compilation

file1.js

```javascript
// ...

module.exports = file1
```

app.js

```javascript
const file1 = require("./file1");
// ...
const fileN = require("./fileN");
// ...
```

webpack.config.js

```javascript
module.exports = {
    "entry": "./app.js",
    "output": {
        "filename": "app.bundled.js"
    }
}
```

terminal

```bash
$ webpack
$ babel app.bundled.js --out-file app.bundled.es5.js
$ uglifyjs -c -m -- app.bundled.es5.js -o app.bundled.es5.min.js
```

index.html

```html
<script src="app.bundled.es5.min.js"></script>
```

### 6 Exemple: modern web compilation ver. React

```bash
$ yarn build
```

- P.S. creer un nouveau project avec react

```bash
$ npm i -g create-react-app
$ create-react-app monApp
$ cd monApp
$ yarn build
$ yarn start
```



