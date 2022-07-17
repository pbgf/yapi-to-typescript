module.exports =  {
  "extends": [
      "eslint:recommended"
  ],
  "parser": "@babel/eslint-parser",
  "env": {
      "browser": true,
      "node": true,
      "es6": true,
      "commonjs": true
  },
  "parserOptions": {
      "ecmaVersion": 6,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true
      },
      "sourceType": "module",
      "allowSyntheticDefaultImports": true
  },
  "rules": {
      "semi": 2,
      "no-dupe-args": 2,
      "no-const-assign": 2,
      "no-duplicate-case": 2
  }
}
