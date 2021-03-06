![Bower](https://img.shields.io/bower/v/selectlist-model.svg) [![NPM](https://img.shields.io/npm/v/selectlist-model.svg)](https://www.npmjs.com/package/selectlist-model) ![License](https://img.shields.io/npm/l/selectlist-model.svg)

# selectlist-model
AngularJS directive for list of checkboxes

## Why this is needed?  
In Angular one checkbox `<input type="checkbox" ng-model="...">` is linked 
with one model.  
But in practice we usually want one model to store array of checked values 
from several checkboxes.  
**selectlist-model** solves that task without additional code in controller.   

## Usage
You should play with attributes of `<input>` tag:
  
| Attribute          | Mandatory | Description                                   |
| :----------------: | :-------: | --------------------------------------------- |
| `selectlist-model`  | Yes       | Use instead of `ng-model`                     |
| `selectlist-value`  | No        | What should be picked as array item           |
| `value`            | No        | What should be picked as item, but unlike `selectlist-value`, this does not evaluate as an angular expression, but rather a static value |
| `ng-model`         | No        | Every checkbok will span a new scope and define a variable named `checked` to hold its state. You can modify this name by using this attribute. |
| `selectlist-comparator` | No   | A custom comparator. If it starts with dot(`.`) then it will be an expression applied to the array item. Otherwise it should evaluate to a function as an angular expression. The function return true if the first two arguments are equal and false otherwise. |
| `selectlist-change` | No       | An angular expression evaluated each time the `selectlist-model` has changed. |

* If you modify directly the value of the `selectlist-model`, it is possible that the UI won't be updated. This is because this directive looks for the model in the parent, not in the current scope. Instead of doing `selectlistModelList = []` it is better to do `selectlistModelList.splice(0, selectlistModelList.length)` or wrap it in another object.
* If you're using `track by` you must specify the same thing for `selectlist-value` too. See [#46](https://github.com/vitalets/selectlist-model/issues/46).

Please, try out
* live demo: http://vitalets.github.io/selectlist-model
* Jsfiddle: http://jsfiddle.net/Ebv3p/2/  
* Plunkr example (more advanced): http://plnkr.co/edit/pZLF0KesMDnIap0eCfSG?p=preview
* Plunkr example for [tree list](http://plnkr.co/edit/QPLk98pCljp8dFtptSYz?p=preview)

## Installation
1. Download [latest release](https://github.com/vitalets/selectlist-model/releases) or use bower `bower install selectlist-model` or install from npm `npm install selectlist-model`
2. Add to app dependencies:
````js
var app = angular.module("app", ["selectlist-model"]);
````

## How to get support
* Ask a question on StackOverflow and tag it with [selectlist-model](http://stackoverflow.com/questions/tagged/selectlist-model).
* [Fill in](https://github.com/vitalets/selectlist-model/issues/new) an issue.

Please keep in mind to also create a Plunkr or JSFiddle example. This will greatly help us in assisting you and you can use one of the existing examples and fork it.

## Development
We're using grunt as the build system. `grunt jade` generates the demo file and `grunt server` starts the demo server that can be access at `http://localhost:8000`. Tests can be ran by accessing `http://localhost:8000/test`.

The best way to involve is to report an issue/enhancement and then provide a pull request for it using Github usual features.

### How to add a new test case
1. Create a new folder under `docs/blocks` named `your-test`.
2. Create under that folder `ctrl.js` to describe the test Angular controller, `view.html` to describe the view part in HTML and `test.js` for the Angular scenario test. You can use an existing test as an example.
3. Add a line like `- items.push({id: 'your-test', text: 'Your test, ctrlName: 'CtrlTestName', testValue: 'selectedItems'})` to `docs/index.jade`
4. Add a line like `<script src="../docs/blocks/your-test/test.js"></script>` to `test\index.html`
5. Run `grunt jade` to generate `index.html` from `docs/index.jade`
6. Run `grunt server`
7. Access `http://localhost:8000` for samples and `http://localhost:8000/test` for running the tests.

### How to make a new release
1. Change the version number in `bower.json` and `package.json`
2. Create a new [release](https://github.com/vitalets/selectlist-model/releases) in github with the same name for tag and title as the version number (e.g. `1.0.0`). Do not forget to include the changelog in the release description.
3. Run `npm publish` to publish the new version to npm

## License
MIT 
