/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'Ember 1.13',
      bower: { dependencies: { 'ember': '1.13.0'  } }
    },

    {
      name: 'Ember 2.4.5',
      bower: { dependencies: {  'ember': '2.4.5'  } }
    },

    {
      name: 'Ember canary',
      allowedToFail: true,
      bower: {
        dependencies: { 'ember': 'components/ember#canary' },
        resolutions: { 'ember': 'canary' }
      }
    },

    {
      name: 'Ember beta',
      allowedToFail: true,
      bower: {
        dependencies: { 'ember': 'components/ember#beta' },
        resolutions: { 'ember': 'beta' }
      }
    }
  ]
};
