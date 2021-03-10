// 引入 gulp 插件，

var gulp = require('gulp'),
    babel = require('gulp-babel'),
    assetRev = require('gulp-asset-rev'),
    runSequence = require('run-sequence'),
    rev = require('askybig-gulp-rev'),
    revCollector = require('askybig-gulp-rev-collector');

// 定义 css、js 源文件路径
var cssSrc = 'css/**/*.css',  // 注意这里修改为你的源文件路径，例如笔者的项目 css 文件，设置为 static/css/main/*.css ，js 同理。
    jsSrc = 'js/**/*.js';

// 为 css 中引入的图片 / 字体等添加 hash 编码
// gulp.task('assetRev', function(){
//   return gulp.src (cssSrc)  // 该任务针对的文件
//    .pipe (assetRev ()) // 该任务调用的模块
//    .pipe (gulp.dest ('src/css')); // 编译后的路径
// });

//CSS 生成文件 hash 编码并生成 rev-manifest.json 文件名对照映射
gulp.task('revCss', function(){
  // 创建一个流，用于从文件系统读取 Vinyl 对象。
  // Vinyl 是描述文件的元数据对象。Vinyl 实例的主要属性是文件系统中文件核心的 path 和 contents 核心方面。Vinyl 对象可用于描述来自多个源的文件（本地文件系统或任何远程存储选项上）
  return gulp.src(cssSrc) 
    // gulp-rev 负责在文件名后追加 hash
    .pipe(rev()) 
    // gulp-rev 会生成一个 manifest 的文件:
    // {
    //    "static/styles/lib.css": "static/styles/lib-d41d8cd98f.css"
    //    "static/js/lib.js": "static/js/lib-273c2cin3f.js"
    // }
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'));
});

//js 生成文件 hash 编码并生成 rev-manifest.json 文件名对照映射
gulp.task('revJs', function(){
  return gulp.src(jsSrc)
    .pipe(rev())
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'));
});

//Html 替换 css、js 文件版本
gulp.task('revHtml', function() {
  return gulp.src (['rev/**/*.json', '*.htm']) // 这里的 View/*.html 是项目 html 文件路径，如果 gulpfile.js 和 html 文件同在一级目录下，修改为 return gulp.src (['rev/**/*.json', '*.html']);
    .pipe(revCollector())
    .pipe (gulp.dest (''));// 注意这里是生成的新的 html 文件，如果设置为你的项目 html 文件所在文件夹，会覆盖旧的 html 文件，若上面的 View/*.html 修改了，这里也要相应修改，如果 gulpfile.js 和 html 文件同在一级目录下，修改为  .pipe (gulp.dest (''));
});

gulp.task('revPageJs', function () {
  return gulp.src('js/page/*.js')
    .pipe(babel({
      presets: ['es2015']
    })) 
    .pipe(gulp.dest('js/page'));
})

// 开发构建
gulp.task('default', function(done) {
  condition = false;
  runSequence (    // 需要说明的是，用 gulp.run 也可以实现以上所有任务的执行，只是 gulp.run 是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了 runSequence.
//     ['assetRev'],
    ['revCss'],
    ['revJs'],
    ['revHtml'],
    ['revPageJs'],
    done);
});

  // "devDependencies": {
  //   "askybig-gulp-rev": "^1.0.0",
  //   "askybig-gulp-rev-collector": "^1.0.3",
  //   "babel-core": "^6.26.3",
  //   "babel-preset-env": "^1.7.0",
  //   "babel-preset-es2015": "^6.24.1",
  //   "gulp": "^3.9.1",
  //   "gulp-asset-rev": "^0.0.15",
  //   "gulp-babel": "^7.0.1",
  //   "run-sequence": "^2.2.1"
  // },
