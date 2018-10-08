const gulp = require('gulp');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const nodemon = require('gulp-nodemon');

gulp.task('server', () => {
    nodemon({
        'script': 'dist/server.js',
    });
});

gulp.task("tsc", function () {
  return tsProject.src()
      .pipe(tsProject())
      .js.pipe(gulp.dest("dist"));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.ts', ['tsc']);
})

gulp.task('serve', ['server','watch']);