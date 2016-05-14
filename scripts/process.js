var fs = require("fs");
var http = require("http");

var csvWriter = require('csv-write-stream');
var AdmZip = require('adm-zip');
var semver = require("semver");
var ProgressBar = require('progress');
var dpinit = require('datapackage-init');
var Px = require('px');
var argv = require('minimist')(process.argv.slice(2));

var SOURCEFILE = "../archive/px.zip";
var DESTFILE = '../data/urbano_municipios.csv';
var SOURCE_URL = "http://www.catastro.minhap.gob.es/documentos/estadisticas/px.zip";
var STARTING_YEAR = "2006";
var HEADERS = ['municipio_id','year','ultima_valoracion', 'parcelas_num', 'parcelas_area', 'inmuebles_num', 'vc_construccion','vc_suelo','vc_total'];

var currentYear = new Date().getFullYear();


// Generamos listado de provincias. Quitamos las del Pais Vasco y Navarra
var provincias = Array.apply(null, {length: 53})
  .map(Number.call, Number)
  .filter(function (item) {
    return ([1,20,31,48].indexOf(item) == -1)?item:null;
  });

// Inicializamos CSV de salida
var writer = csvWriter({ headers: HEADERS})
writer.pipe(fs.createWriteStream(DESTFILE));


// Inicializamos el Progress Bar
var bar = new ProgressBar('  Processing [:bar] :percent :etas', {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: (currentYear - STARTING_YEAR+1) * provincias.length // numero de municipios. Quitamos header y EOF
});


// Comprobamos si existe la fuente. Si no la descargamos.
try {
  stats = fs.lstatSync(SOURCEFILE);
}
catch (e) {
  console.log(e.toString());
  console.log('Downloading source');
  var sourceFile = fs.createWriteStream(SOURCEFILE);
  request = http.get(SOURCE_URL, function(response) {
    response.pipe(sourceFile);

  });
  request.end(function(){
    processZip();
    updateDatapackagejson();
  });
  return;

}

if (stats != undefined){
  if (stats.isFile()) {
    processZip();
    updateDatapackagejson();
  }
}

/**
 * Procesa los archivos fuente y genera el csv destino
 */
function processZip() {

  var zip = new AdmZip(SOURCEFILE);

  for (year = STARTING_YEAR; year <= currentYear; year++) {
    provincias.forEach(function (provinciaId, index) {
      provinciaId = ("00" + provinciaId).slice(-2);
      var catastroStr = (year <= 2010) ? "catastro" : "Catastro";
      var urbanoStr = (year <= 2015) ? "urbano" : "Urbano";
      var fileName = "px/est" + year + "/" + catastroStr + "/" + urbanoStr + "/041" + provinciaId + ".px";
      //console.log(fileName);

      //return;

      var px = new Px(zip.readAsText(fileName));
      var municipios = px.codes('Municipios');
      municipios.splice(-1);
      municipios.forEach(function (municipio_id, i) {
        //console.log(municipio_id);
        writer.write([municipio_id].concat([year], px.dataCol([i, '*'])));
      });
      bar.tick();

    });
  }
}


/**
 * Actualiza datapackage.json
 */
function updateDatapackagejson(){
  dpinit.init("../", function (err, datapackageJson) {
    //Actualizamos fecha y semver
    datapackageJson.last_updated = new Date().toISOString().slice(0,10);
    datapackageJson.version = semver.inc(datapackageJson.version, 'patch');

    //Grbamos a disco
    fs.writeFile("../datapackage.json", JSON.stringify(datapackageJson, null, 2));
  });
}



