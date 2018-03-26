import Ember from 'ember';

import {
  getContext
} from 'ember-test-helpers';

export default function findComponentByConstructor(constructor, parent) {
  //
  const registry = getContext().container.lookup('-view-registry:main');

  for (let [viewId, viewInstance] of Object.entries(registry)) {
    if (viewInstance instanceof constructor) {
      return viewInstance;
    }
  }

}
