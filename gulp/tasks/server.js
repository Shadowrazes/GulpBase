import { plugins } from '../config/plugins.js';
import { filePaths } from '../config/paths.js';
import getIp from 'dev-ip';

const server = (done) => {
  plugins.browserSync.init({
    server: {
      baseDir: filePaths.build.html,
    },
    host: getIp(),
    notify: false,
    port: 3000,
  });
};

export { server };