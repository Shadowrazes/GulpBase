import gulp from 'gulp';
import webpack from 'webpack-stream';
import beautify from "gulp-beautify";
import { webpackConfig } from '../../webpack.config.js';

import { plugins } from '../config/plugins.js';
import { filePaths } from '../config/paths.js';
import { isBuild } from '../../gulpfile.js';

const js = () => {
  return gulp
    .src(filePaths.src.js, { sourcemaps: app.isDev })
    .pipe(plugins.handleError('JS'))
    //.pipe(webpack({ config: webpackConfig(app.isDev) }))
    .pipe(plugins.if(isBuild, beautify({
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
    .pipe(gulp.dest(filePaths.build.js))
    .pipe(plugins.browserSync.stream());
};

export { js };