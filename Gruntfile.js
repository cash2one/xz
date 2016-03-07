module.exports = function(grunt) {

    // 项目配置
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),


        // js 压缩
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
                mangle: false
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'static/src/js',
                    src: ['*.js', '!*.min.js'],
                    dest: 'static/dist/js',
                    ext: '.js'
                }]
            }
        },

        // scss 2 css
        sass: {
            build: {
                options: {
                    style: 'compressed' // 输出压缩的css，可以是 nested, compact, compressed, expanded
                },
                files: [{ // 文件列表
                    expand: true,
                    cwd: 'static/src/css',
                    src: ['*.scss'],
                    dest: 'static/dist/css',
                    ext: '.css'
                }]
            }
        },

        // 合并
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },

            // concat:js
            // js: {
            //     src: ['static/dist/js/common.js', 'static/dist/js/workout.js'],
            //     dest: 'static/dist/js/combine/combine-workout.js',
            // },
            jsActivity: {
                src: ['static/dist/js/functions.js', 'static/dist/js/letCityStrToIndexNum.js', 'static/dist/js/activity-uploadimage.js', 'static/dist/js/activity-form.js'],
                dest: 'static/dist/js/combine/activity-app.js',
            },

            // concat:css
            cssbootstrapbase: {
                src: ['static/dist/css/vendor/bootstrap.min.css', 'static/dist/css/base.css'],
                dest: 'static/dist/css/combine/bootstrapbase.min.css',
            },
            cssindex: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/index.css'],
                dest: 'static/dist/css/combine/index.min.css',
            },
            cssdownload: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/download.css'],
                dest: 'static/dist/css/combine/download.min.css',
            },
            csschallenges: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/challenges.css'],
                dest: 'static/dist/css/combine/challenges.min.css',
            },
            cssactivity: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/activity.css'],
                dest: 'static/dist/css/combine/activity.min.css',
            },
            csslushu: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/lushu.css'],
                dest: 'static/dist/css/combine/lushu.min.css',
            },
            cssexplore: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/explore.css'],
                dest: 'static/dist/css/combine/explore.min.css',
            },
            csshelp: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/help.css'],
                dest: 'static/dist/css/combine/help.min.css',
            },
            cssuser: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/user.css'],
                dest: 'static/dist/css/combine/user.min.css',
            },
            cssworkout: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/workout.css'],
                dest: 'static/dist/css/combine/workout.min.css',
            },
            cssworkout_mobile: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/workout_mobile.css'],
                dest: 'static/dist/css/combine/workout_mobile.min.css',
            },
            cssmatch: {
                src: ['static/dist/css/combine/bootstrapbase.min.css', 'static/dist/css/match.css'],
                dest: 'static/dist/css/combine/match.min.css',
            },
        },

        watch: {
            css: {
                files: ['static/src/css/*.scss', 'Gruntfile.js'],
                tasks: ['sass', 'concat:cssexplore']
            },
            js: {
                files: ['static/src/js/*.js'],
                tasks: ['uglify', 'concat:jsActivity']
            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('default', ['sass', 'uglify']);

    grunt.registerTask('css', ['sass', 'concat:cssbootstrapbase']);
    grunt.registerTask('js', ['uglify', 'concat:jsActivity']);
};
