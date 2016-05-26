/**
 * Configuration for Babel 
 * @type {Object}
 */


module.exports.babel = {
    // Turn babel compile on by default
    compile: true,
    //an array of extensions, defaults to [".es6", ".es", ".jsx", ".js"] in babel
    // extensions: null,
    "presets": ["es2015", "stage-0"]
}