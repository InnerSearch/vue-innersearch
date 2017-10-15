# Use Babel et Webpack, et uglify-js

**Cette methode est hyper importante. Lisez jusqu'a la fin.**

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

### 5 Utiliser webpack avec babel
`$ npm i --save webpack babel-core babel-loader babel-preset-env`
webpack.config.js
```javascript
module.exports = {
    entry: './index.js',
    output: {
        filename: 'index.es5.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
}
```
`$ webpack`

### 6 Creer un live compilateur pendant le developpement
`$ webpack --watch`

permet de lancer webpack dans le mode "watch", i.e. quand le fichier js change est sauvegarde, il fait la compilation.

`$ live-server`

live-server va refresh le page html quand il y a un changement dans la repertoire de serveur

**Congratulation! Maintenant vous n'avez plus besoin de toucher le F5**
