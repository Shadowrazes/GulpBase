import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpCss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoPrefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиа запросов
import beautify from "gulp-beautify";

import { filePaths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';
import { isBuild, isDev } from '../../gulpfile.js';



const sass = gulpSass(dartSass);

const scss = () => {
  return (
    gulp
      .src(filePaths.src.scss, { sourcemaps: isDev })
      .pipe(plugins.handleError('SCSS'))
      .pipe(sass({ outputStyle: 'expanded' }))
      .pipe(plugins.replace(/@img\//g, '../images/'))
      .pipe(plugins.if(isBuild, groupCssMediaQueries()))
      /*.pipe(
        plugins.if(
          isBuild,
          webpCss({
            webpClass: '.webp',
            noWebpClass: '.no-webp',
          })
        )
      )*/
      .pipe(
        plugins.if(
          isBuild,
          autoPrefixer({
            grid: true,
            overrideBrowserslist: ['last 3 versions'],
            cascade: true,
          })
        )
      )
      .pipe(plugins.if(isBuild, beautify.css({
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
      
      /** Раскомментировать если нужен не сжатый дубль файла стилей */
      .pipe(gulp.dest(filePaths.build.css))
      /*.pipe(plugins.if(isBuild, cleanCss()))
      .pipe(rename({ extname: '.min.css' }))
      .pipe(gulp.dest(filePaths.build.css))*/
      .pipe(plugins.browserSync.stream())
  );
};

export { scss };