import Ember from 'ember';

import {
  getContext
} from 'ember-test-helpers';

export default function findComponentBySelector($component) {
  const id = $component.prop('id');
  const context = getContext();
  const registry = context.container.lookup('-view-registry:main');
  return registry ? registry[id] : Ember.View.views[id];
}
