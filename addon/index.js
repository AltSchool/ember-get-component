import Ember from 'ember';
import findComponentBySelector from './find-component-by-selector';
import findComponentByConstructor from './find-component-by-constructor';
import  _ from 'lodash';
import { getContext } from 'ember-test-helpers';

const DEBUG_HEADER_STYLE = 'background-color: #46b2de; color: rgba(0,0,0,0.7); padding: 5px; line-height: 18px';
const DEBUG_HELPFUL_STYLE = 'background-color: #F2D15C; color: rgba(0,0,0,0.7); padding: 5px; line-height: 18px';
const DEBUG_NULL_STATE_STYLE = 'background-color: #f09648; color: rgba(0,0,0,0.7); padding: 5px; line-height: 18px';
const DOCUMENTATION_URL = 'https://github.com/AltSchool/ember-get-component';

/**
 * elementsByName
 * @description Provides a jQuery result set of components with the
 *              provided name.
 * @param  {String} name The component's name like: "card-details/questions"
 * @return {jQuery} a jQuery result set
 */
const elementsByName = function(name) {
  return $(selectorByName(name));
};

/**
 * elementsByTestAttr
 * @description Provides a jQuery result set of components with the
 *              given testAttr. Add testAttrs to your components like this:
 *              {{myComponent testAttr="mySpecialComponent"}}
 * @param {String} testAttr The testAttr you've provided.
 * @return {jQuery} a jQuery result set
 */
const elementsByTestAttr = function(testAttr) {
  return $(selectorByTestAttr(testAttr));
};

/**
 * instanceByName
 * @description Provides the first component instance with the provided name.
 * @param  {String} name The component's name like: "card-details/questions"
 * @return {Component} The first matched component
 */
const instanceByName = function(name) {
  return findComponentBySelector(elementsByName(name));
};

/**
 * instanceByTestAttr
 * @description Provides the first component instance with the given testAttr.
 *              Add testAttrs to your components like this:
 *              {{myComponent testAttr="mySpecialComponent"}}
 * @param {String} testAttr The testAttr you've provided.
 * @return {Component}
 */
const instanceByTestAttr = function(testAttr) {
  return findComponentBySelector(elementsByTestAttr(testAttr));
};

/**
 * instanceByConstructor
 * @description Provides the first component instance with the given constructor.
 * @param {Constructor} constrcutor The component constructor you have imported.
 * @return {Component}
 */
const instanceByConstructor = function(constructor) {
  const parent = findComponentBySelector($());
  return findComponentByConstructor(constructor, parent);
};

/**
 * Super Deluxe Debugging
 *
 * @description Use this whenever you can't find a testAttr or component name
 *              you expect. It lists all the testAttrs and components in a context
 *              and provides cut and paste commands for selecting them.
 * @example
 *   getComponent.debug();
 *
 */
const debug = function() {
  const $testAttrs = $('[data-test-attr]');
  const $components = $('[data-test-component-name]');
  if ($components.length) {
    _logElements({
      '$items': $components,
      collectionName: 'components',
      targetAttr: 'data-test-component-name',
      getElementMethodName: 'elementsByName'
    });
  } else {
    _logEmptyState('components', 'Please ensure that getComponent.init() was called in a beforeEach block.');
  }
  if ($testAttrs.length) {
    _logElements({
      '$items': $testAttrs,
      collectionName: 'testAttrs',
      targetAttr: 'data-test-attr',
      getElementMethodName: 'elementsByTestAttr'
    });
  } else {
    _logEmptyState('test-attrs', 'Add testAttrs to components like this: {{myComponent testAttr="specialComponent"}}');
  }
  if ($testAttrs.length || $components.length) {
    console.groupCollapsed('%cHelpful testing code:', DEBUG_HELPFUL_STYLE);
    _logExampleCode({
      '$items': $testAttrs,
      headerText: '// Test visibility by testAttr:\n',
      targetAttr: 'data-test-attr',
      getElementMethodName: 'elementsByTestAttr'
    });
    _logExampleCode({
      '$items': $components,
      headerText: '// Test visibility by component:\n',
      targetAttr: 'data-test-component-name',
      getElementMethodName: 'elementsByName'
    });
    console.groupEnd();
  }
};

function _logElements({ $items, collectionName, targetAttr, getElementMethodName }) {
  console.groupCollapsed(`%cI found the following ${collectionName} in this context:`, DEBUG_HEADER_STYLE);
  const groups = _.groupBy($items, (el) => $(el).attr(targetAttr));
  _.each(groups, (elements, attrValue) => {
    console.groupCollapsed(`${attrValue} (${elements.length})`);
    console.log(`Use this to select: getComponent.${getElementMethodName}('${attrValue}')`);
    elements.forEach(el => console.log(el));
    console.groupEnd();
  });
  console.groupEnd();
}

function _logEmptyState(collectionName, recommendationText) {
  console.group(`%cI found no ${collectionName} in this context`, DEBUG_NULL_STATE_STYLE);
  console.log(recommendationText);
  console.log(`Here's some documentation for you: ${DOCUMENTATION_URL}`);
  console.groupEnd();
}

function _logExampleCode({ $items, headerText, targetAttr, getElementMethodName }) {
  const items = $items.map((i, el) => {
    return $(el).attr(targetAttr);
  });
  const groups = _.groupBy(items);
  const code = _.reduce(groups, (acc, items, attrValue) => {
    return `${acc}\nexpect(getComponent.${getElementMethodName}('${attrValue}')).to.have.length(${items.length});`;
  }, headerText);
  console.log(code);
}

function selectorByName(name) {
  return `[data-test-component-name="${name}"]`;
}

function selectorByTestAttr(testAttr) {
  return `[data-test-attr="${testAttr}"]`;
}

function $() {
  const context = getContext();
  const jq = context && context.$ || Ember.$;
  return jq(...arguments);
}

/**
 * init
 * @description Reopen Ember Component to add two attributes. One for matching
 *              the component by name. One for matching components by a
 *              testAttr added to any component that needs it.
 */
const init = function() {
  Ember.Component.reopen({
    init() {
      this._super.apply(this, arguments);
      const name = this.constructor.toString();

      // Do nothing if it's a tagless component
      if (this.get('tagName') === '') {
        return;
      }

      // if it's not tagless, add the attrs to existing ones
      const attrBindings = this.getWithDefault('attributeBindings', []);
      this.set('attributeBindings', [...attrBindings, 'data-test-component-name', 'testAttr:data-test-attr']);
      this.set('data-test-component-name', this.getWithDefault('data-test-component-name', null));

      // TODO: For now, this check is required to skip over generic components
      // that don't have a .js file. Follow-up task: figure out how to get the
      // template name from these types of components
      if (name !== 'Ember.Component') {
        this.set('data-test-component-name', name.replace(/^.+@component:(.*):/, '$1'));
      }
    }
  });
};

export default {
  init,
  elementsByName,
  elementsByTestAttr,
  instanceByName,
  instanceByTestAttr,
  instanceByConstructor,
  selectorByName,
  selectorByTestAttr,
  findComponentBySelector,
  findComponentByConstructor,
  debug
};
