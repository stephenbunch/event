var pkg = require( './package' );

module.exports = function( config ) {
  config.set({

    frameworks: [ 'mocha' ],

    files: [
      'node_modules/chai/chai.js',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon-chai/lib/sinon-chai.js',
      'node_modules/babel/node_modules/babel-core/browser-polyfill.js',
      'test/_karma.js',

      'dist/' + pkg.name + '.js',
      { pattern: 'dist/' + pkg.name + '.js.map', included: false },
      { pattern: 'src/**/*.js', included: false },

      'test/**/*.spec.js'
    ],

    reporters: [ 'progress' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: false,

    browsers: [ 'Chrome' ],

    preprocessors: {
      'test/**/*.js': [ 'babel' ]
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
        optional: [ 'es7.decorators', 'es7.classProperties' ]
      },
      filename: function( file ) {
        return file.originalPath.replace( /\.js$/, '.es5.js' );
      },
      sourceFileName: function( file ) {
        return file.originalPath;
      }
    }
  });
};
