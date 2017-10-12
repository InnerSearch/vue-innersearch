# Auth701

**Crypto et Authentification**

### 1 Dependencies

- crypto

```bash
$ npm i --save crypto-js jsonwebtoken validator bcryptjs
```

- db

```bash
$ npm i --save mongodb mongoose
```

- server

```bash
$ npm i --save express body-parser
```

### 2 Hash avec salt

```javascript
const {SHA256} = require("crypto-js");

const salt = "somesalt";
var id = "yan";
var idHashed = SHA256(id + salt).toString();

var token = {id, idHashed};

const {isHash} = require("validator");
console.log(isHash(token.idHashed, "SHA256")); // true

var tokenNotModified = token => 
	return SHA256(token.id + salt).toString() === token.idHashed;
```

### 3 jwt

### 4 bcrypt

### 5 Utiliser crypto en db 

### 6 Utiliser authentification pour contrôler login

