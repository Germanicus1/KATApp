module.exports = function () {
  return {
    files: [
      'server/**/*.js'
    ],

    tests: [
      'test/**/*Spec.js'
    ],

    debug: true,

    setup: function () {
      global.expect = require('mocha').expect;
    },

    env: {
      type: 'node',
      // params: {
      //   runner: `-r ${require.resolve('esm')}`
      // },
      runner: 'node'
    },
    workers: {
      recycle: true
    },
    // testFramework: 'mocha'
  };
};
