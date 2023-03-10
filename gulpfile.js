//Para enviar a llamar tareas en gulp en la consola se debe hacer lo siguiente en la terminal:
//npx gulp nombredelatarea
//También se pueden llamar tareas en gulp usando npm de la siguiente forma, para lo cuál habrás
//primero agregado al apartado "Scripts" la tarea a ejecutar en gulp:
//npm run nombredelatarea

//npm i --save-dev gulp-sass

//npx gulp dev
//npm run dev

//npm i --save-dev gulp-plumber

//npm install --save-dev gulp-webp //Convertir imagenes a formato webp usando gulp

//npm i gulp-terser-js

const { src, dest, watch, parallel } = require('gulp');



// CSS
const sass = require('gulp-sass')(require('sass')); //Permite unir gulp con sass
const plumber = require('gulp-plumber'); //Evita que se detenga el compilador por errores
const autoprefixer = require('autoprefixer'); //Regula el codigo para compatibilizar con otros navegadores
const cssnano = require('cssnano'); //Mejora el performance del código
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css( done ) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber())
        .pipe( sass() ) // Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano() ]) )
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') ) // Almacenarla en el disco duro
    done();
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') )
    done();
}

function versionWebp( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img') )
    done();
}

function versionAvif( done ) {
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img') )
    done();
}

function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe( terser() )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}

function tarea (done) {
    console.log('Desde la primera tarea');
    done();
}
 
exports.tarea = tarea;

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev) ;