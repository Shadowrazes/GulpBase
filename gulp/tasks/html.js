import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import versionNumber from 'gulp-version-number';
import htmlMin from 'gulp-htmlmin';
import beautify from "gulp-beautify";

import { plugins } from '../config/plugins.js';
import { filePaths } from '../config/paths.js';
import { isBuild } from '../../gulpfile.js';

const html = () => {
  return gulp
    .src(filePaths.src.html)
    .pipe(plugins.handleError('HTML'))
    .pipe(fileInclude())
    .pipe(plugins.replace(/@img\//g, 'images/'))
    //.pipe(plugins.if(app.isBuild, webpHtml()))
    .pipe(
      htmlMin({
        useShortDoctype: true,
        sortClassName: true,
        collapseWhitespace: false,
        removeComments: false
      })
    )
    .pipe(plugins.if(isBuild, beautify.html({
      "indent_size": "4",
      "indent_char": " ",
      "max_preserve_newlines": "2",
      "preserve_newlines": true,
      "keep_array_indentation": false,
      "break_chained_methods": true,
      "indent_scripts": "keep",
      "brace_style": "end-expand",
      "space_before_conditional": true,
      "unescape_strings": false,
      "jslint_happy": false,
      "end_with_newline": true,
      "wrap_line_length": "0",
      "indent_inner_html": false,
      "comma_first": false,
      "e4x": false,
      "indent_empty_lines": false
    })))
    .pipe(
      plugins.if(
        app.isBuild,
        versionNumber({
          value: '%DT%',
          append: {
            key: '_v',
            cover: 0,
            to: ['css', 'js'],
          },
          output: {
            file: 'gulp/version.json',
          },
        })
      )
    )
    .pipe(gulp.dest(filePaths.build.html))
    .pipe(plugins.browserSync.stream());
};

export { html };