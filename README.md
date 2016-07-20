# getComponent test helper

## Purpose
Simplify the process of selecting components within integration tests.

We do this by providing a simple API for getting component elements, instances and jQuery selectors. 

This works by reopening `Component` to add a couple of `data-test-*` attributes to every component within the testing environment.

## Motivation
We often need to target components within tests. So far we've done this by either manually adding a special `.test-*` class name or `data-test-*` attribute to the component. However, these are hard to manage and pollute production markup with unnecessary attributes or classes. By providing a simple API for accessing components by name or, optionally, a testAttr, we can simplify our tests.

## Usage 

##### Initialize the helper
```js
// in test-helper.js
import getComponent from 'ember-get-component';
getComponent.init()
```

##### Add it to your test
```js
import getComponent from 'ember-get-component';
```

##### Get all components by their name
```js
getComponent.elementByName('card-details/question')
```

##### Get all components elements by their testAttr
```hbs
{{widget-item testAttr="specialWidget"}}
```
```js
getComponent.elementByTestAttr('specialWidget');
```

##### Get a component instance from the Ember registry by name or testAttr
Note, these return only the instance for the first matching element.
```js
getComponent.instanceByName('widget-item');
getComponent.instanceByTestAttr('specialWidget');
```

##### Get all component instances in this context from the Ember registry by the constructor
```js
import CardDetailsQuestions from 'wherever'
getComponent.instancesByConstructor(CardDetailsQuestions)
```

##### Super Deluxe Debugging
The debugger provides a list of components by name and testAttr as well as cut-and-paste-ready mocha assertions for testing visibility. Use it as a starting point in your tests.
```js
getComponent.debug();
```
![Deluxe Debug](http://g.recordit.co/Gu2ghbHCuT.gif)

##### Future improvements
- [ ] Consider adding a second param to `elementsByName` and `elementsByAttr` to provide jQuery scope.
- [ ] Have debug group the output by component name and testId while providing a count.

How can this be better? Leave us feeback in an [issue](https://github.com/AltSchool/get-component/issues/new) or, better yet, send us a Pull Request.
