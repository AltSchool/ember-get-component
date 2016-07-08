import Ember from 'ember';

import {
  getContext
} from 'ember-test-helpers';

/**
 * Finds the first instance of a particular component, given some constructor
 * and parent.
 *
 * Note that this is technically a depth-first search, but it will search each
 * level before proceeding to the next.  In other words, given:
 *
 * a
 *  b1
 *   c1
 *    d1
 *    d2
 *   c2
 *    d3
 *    d4
 *  b2
 *   c3
 *   c4
 *  b3
 *   c5
 *
 * This will search in the following order:
 *
 * b1, b2, b3, c1, c2, d1, d2, d3, d4, c3, c4, c5
 */
export default function findComponentByConstructor(constructor, parent) {
  const children = parent.childViews || [];
  return children.find((child) => child instanceof constructor) ||
    children.reduce((instance, child) => {
      return instance || findComponentByConstructor(constructor, child);
    }, undefined);
}
