import {
  getContext
} from 'ember-test-helpers';

export default function register() {
  let context = getContext();
  let thing = context.registry || context.container;
  return thing.register.apply(thing, arguments);
}
