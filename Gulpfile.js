global.APP_ROOT = __dirname;
require( 'babel/register' )({
  optional: [ 'es7.decorators', 'es7.classProperties' ]
});
require( 'require-directory' )( module, './tasks' );
