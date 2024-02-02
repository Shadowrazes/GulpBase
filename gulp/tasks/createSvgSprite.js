import gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import svgMin from 'gulp-svgmin';
import cheerio from 'gulp-cheerio';
import replace from 'gulp-replace';

import { filePaths } from '../config/paths.js';
import { plugins } from '../config/plugins.js';

const createSvgSprite = () => {
  return gulp
    .src(`${filePaths.src.svgIcons}`, {})
    .pipe(plugins.handleError('SVG'))
    // minify svg
		.pipe(svgMin({
			js2svg: {
				pretty: true
			}
		}))
		// remove all fill and style declarations in out shapes
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio plugin create unnecessary string '>', so replace it.
		.pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: `../icons/icons.svg`,
            /** Создавать страницу с перечнем иконок */
            example: true,
          },
        },
      })
    )
    .pipe(gulp.dest(`${filePaths.build.images}`));
};

export { createSvgSprite };