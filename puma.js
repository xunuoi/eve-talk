/**
 * Puma at large
 * @type {[type]}
 * For sync application service
 */

'use strict'


var path = require('path')
var j = path.join

var through = require('./node_modules/gulpman/node_modules/through2')
var sequence = require('./node_modules/gulpman/node_modules/gulp-sequence/')

function syncApp(gulp, opts) {

    const APP_PATH = {
        // for the BE services side path
        'CONTROLLER': './api/controllers',
        'COMPONENT': './components',

        // for applications path
        'APPLICATIONS': './applications',
        'META': 'meta'
    }

    let apiPath = [j(APP_PATH.APPLICATIONS, '**/*.js'), '!' + j(APP_PATH.APPLICATIONS, 'meta/**/*.*')]
    let metaPath = [j(APP_PATH.APPLICATIONS, '*/meta/**/*.*')]

    function parseSourcePathInAPI(srcs, file, content) {
        var appDirName = path.dirname(file.relative)
        var metaPath =  j(file.base, 'meta')
        var diff = path.relative(file.path, metaPath)

        srcs.forEach(function(item) {
            var tmpContentList = content.split(item)

            var blockList = item.split(/['"](.+?)['"]/)
            var filePath = blockList[1]
            var fullFilePath = j(appDirName, filePath)

            blockList[1] = ['\'', fullFilePath, '\''].join('')
            var fixedPathTxt = blockList.join('')

            tmpContentList.splice(1, 0, fixedPathTxt)

            content = tmpContentList.join('')
        })

        return content
    }

    gulp.task('app:sync-api', () => {
        gulp.src(apiPath)
        .pipe(function(opts){

            return through.obj(function (file, enc, cb) {
                if (file.isNull()) {
                    this.push(file)
                    return cb()
                }

                if (file.isStream()) {
                    this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'))
                    return cb()
                }


                var content = file.contents.toString()
                var srcs = content.match(/render\(\s*['"]?(.+?)['"]?\s*\)/gm)
                if(srcs) {
                    content = parseSourcePathInAPI(srcs, file, content)
                    file.contents = new Buffer(content)
                }

                this.push(file)
                cb()
            })

        }())
        .pipe(gulp.dest(APP_PATH.CONTROLLER))
    })

    gulp.task('app:sync-meta', () => {
        gulp.src(metaPath)
        .pipe(gulp.dest(APP_PATH.COMPONENT))
    })

    gulp.task('app:sync', ['app:sync-api', 
        'app:sync-meta'])

    // auto update
    gulp.task('app:watch', function() {
        gulp.watch(j(APP_PATH.APPLICATIONS, '**/*.*'), ['app:sync'])
    })

    gulp.task('app:develop', sequence('app:watch', 'app:sync', 'gm:develop'))

    gulp.task('app:publish', sequence('app:sync', 'gm:publish'))

}

exports.enable = function(gulp, opts) {
    syncApp(gulp, opts)
}



