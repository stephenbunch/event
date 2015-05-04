global.APP_ROOT = __dirname;
require( 'babel/register' )({
  optional: [ 'es7.decorators' ]
});
require( 'require-directory' )( module, './tasks' );
