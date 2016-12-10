/**
 * Gulpman demo gulpfile.js
 * Config the gulpman by yourself
 */
'use strict'

var gulp = require('gulp'),
    gulpman = require('gulpman')

var puma = require('./puma')

gulpman.config({

    'is_absolute': true,
    
    //'cdn_prefix': '', 

    // 'url_prefix': '/static',

    // 'components': 'components',

    // 'runtime_views': 'views',
    // 'dist_views': 'views_dist',

    'runtime_assets': 'assets/static',
    'dist_assets': 'assets_dist/static',

    // 'lib': 'lib', 

    // 'global': 'common' 
    // 
})

puma.enable(gulp)

