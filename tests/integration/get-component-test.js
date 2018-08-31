/* jshint expr:true */
import Ember from 'ember';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  describeComponent,
  it
} from 'ember-mocha';
import {
  describe,
  beforeEach,
  afterEach
} from 'mocha';
const {
  Component
} = Ember;

import hbs from 'htmlbars-inline-precompile';

import register from '../helpers/register';
import getComponent from 'ember-get-component';

const FakeComponent = Component.extend({});
const FakeDataTestAttrComponent = Component.extend({
  attributeBindings: ['data-test-attr']
});

describeComponent(
  'get-component',
  'Integration: GetComponentTestHelper',
  {
    integration: true
  },
  function() {

    beforeEach(function() {
      register('component:fake-component', FakeComponent);
      register('component:fake-component-with-data-test-attr', FakeDataTestAttrComponent);
      getComponent.init();
    });

    it('renders', function() {
      this.render(hbs`{{fake-component class="fake"}}`);
      expect(this.$('.fake')).to.have.length(1);
    });

    it('throws an error if testAttr overlaps with existing data-test-attr binding', function() {
      const fn = () => {
        this.render(hbs`
          {{fake-component-with-data-test-attr testAttr="duck"}}
        `);
      }

      expect(fn).to.throw(/cannot use `testAttr`/);
    });

    it('respects preexisting `data-test-attr` binding', function() {
      this.render(hbs`
        {{fake-component-with-data-test-attr data-test-attr="foo"}}
      `);

      expect(this.$('[data-test-attr="foo"]')).to.have.length(1);
    });

    describe('elementsByName', function() {
      it('returns component elements by name', function() {
        this.render(hbs`
          {{fake-component}}
          {{fake-component}}
        `);
        expect(getComponent.elementsByName('fake-component'))
          .to.have.length(2);
      });
    });

    describe('elementsByTestAttr', function() {
      it('returns component elements by testAttr', function() {
        this.render(hbs`
          {{fake-component testAttr="duck"}}
          {{fake-component testAttr="duck"}}
          {{fake-component testAttr="goose"}}
        `);
        expect(getComponent.elementsByTestAttr('duck'))
          .to.have.length(2);
      });
    });

    describe('instanceByName', function() {
      it('returns a component instance by name', function() {
        this.render(hbs`
          {{fake-component}}
        `);
        expect(getComponent.instanceByName('fake-component'))
          .to.be.instanceOf(FakeComponent);
      });
    });

    describe('instanceByTestAttr', function() {
      it('returns a component instance by testAttr', function() {
        this.render(hbs`
          {{fake-component testAttr="beans"}}
        `);
        expect(getComponent.instanceByTestAttr('beans'))
          .to.be.instanceOf(FakeComponent);
      });
    });

    describe('instanceByConstructor', function() {
      it('returns a component instance by constructor', function() {
        this.render(hbs`
          {{fake-component}}
        `);
        expect(getComponent.instanceByConstructor(FakeComponent))
          .to.be.instanceOf(FakeComponent);
      });

      it('returns a tagless component instance by constructor', function() {
        this.render(hbs`
          {{fake-component tagName=null}}
        `);
        expect(getComponent.instanceByConstructor(FakeComponent))
          .to.be.instanceOf(FakeComponent);
      });
    });

    describe('debug', function() {
      let logs = '';
      const collectLog = log => logs += `${log}\n`;
      beforeEach(function() {
        sinon.stub(console, 'log').callsFake(collectLog);
        sinon.stub(console, 'group').callsFake(collectLog);
        sinon.stub(console, 'groupCollapsed').callsFake(collectLog);
      });
      afterEach(function() {
        logs = '';
        console.log.restore();
        console.group.restore();
        console.groupCollapsed.restore();
      });

      it('lists components by name', function() {
        this.render(hbs`{{fake-component}}{{fake-component}}`);
        getComponent.debug();
        expect(logs).to.contain('\nfake-component (2)\n');
      });

      it('lists testAttrs by name', function() {
        this.render(hbs`
          {{fake-component testAttr="fooTestAttr"}}
          {{fake-component testAttr="fooTestAttr"}}
        `);
        getComponent.debug();
        expect(logs).to.contain('\nfooTestAttr (2)\n');
      });

      it('provides a helpful nullstate when no component found', function() {
        getComponent.debug();
        expect(logs).to.contain('I found no components in this context');
      });

      it('provides a helpful nullstate when no testAttrs found', function() {
        this.render(hbs`{{fake-component}}`);
        getComponent.debug();
        expect(logs).to.contain('I found no test-attrs in this context');
      });

      it('provides helpful mocha test assertions for component names', function() {
        this.render(hbs`{{fake-component}}{{fake-component}}`);
        getComponent.debug();
        expect(logs).to.contain('expect(getComponent.elementsByName(\'fake-component\')).to.have.length(2);');
      });

      it('provides helpful mocha test assertions for attr names', function() {
        this.render(hbs`
          {{fake-component testAttr="fooTestAttr"}}
          {{fake-component testAttr="fooTestAttr"}}
        `);
        getComponent.debug();
        expect(logs).to.contain('expect(getComponent.elementsByTestAttr(\'fooTestAttr\')).to.have.length(2);');
      });
    });
  }
);

