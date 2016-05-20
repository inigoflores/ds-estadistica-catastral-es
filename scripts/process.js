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
var SOURCE_URL = "http://www.catastro.minhap.gob.es/documentos/estadisticas/px.zip";

var STARTING_YEAR = 2006;

var URBANO_MUNICIPIOS_DESTFILE = '../data/urbano_municipios.csv';
var URBANO_MUNICIPIOS_HEADERS = ['municipio_id','year','ultima_valoracion', 'parcelas_num', 'parcelas_area', 'inmuebles_num', 'vc_construccion','vc_suelo','vc_total'];

var ORDENANZAS_FISCALES_DESTFILE = '../data/ordenanzas_fiscales.csv';
var ORDENANZAS_FISCALES_HEADERS = ['municipio_id','year','urbana', 'rustica', 'bice_grupo_a', 'bice_grupo_b', 'bice_grupo_c','bice_grupo_d'];


var currentYear = new Date().getFullYear();


// Generamos listado de provincias. Quitamos las del Pais Vasco y Navarra
var provincias = Array.apply(null, {length: 53})
  .map(Number.call, Number)
  .filter(function (item) {
    return ([1,20,31,48].indexOf(item) == -1)?item:null;
  });



// Inicializamos ZIP fuente
var zip = new AdmZip(SOURCEFILE);



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
    processUrbanoMunicipios();
    updateDatapackagejson();
    processOrdenanzasFiscales();
  });
  return;

}

if (stats != undefined){
  if (stats.isFile()) {
    processUrbanoMunicipios();
    processOrdenanzasFiscales();
    updateDatapackagejson();
  }
}

/**
 * urbano_municipios - Procesa los archivos fuente y genera el csv destino
 */
function processUrbanoMunicipios() {


// Inicializamos el Progress Bar
  var bar = new ProgressBar('  Processing [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: (currentYear - STARTING_YEAR+1) * provincias.length // numero de municipios. Quitamos header y EOF
  });

  // Inicializamos CSV de salida
  var writer = csvWriter({ headers: URBANO_MUNICIPIOS_HEADERS});
  writer.pipe(fs.createWriteStream(URBANO_MUNICIPIOS_DESTFILE));

  // Loop
  for (year = STARTING_YEAR; year <= currentYear; year++) {
    provincias.forEach(function (provinciaId, index) {
      provinciaId = ("00" + provinciaId).slice(-2);
      var catastroStr = (year <= 2010) ? "catastro" : "Catastro";
      var urbanoStr = (year <= 2015) ? "urbano" : "Urbano";
      var fileName = "px/est" + year + "/" + catastroStr + "/" + urbanoStr + "/041" + provinciaId + ".px";

      var px = new Px(zip.readAsText(fileName));
      var municipios = px.codes('Municipios');
      municipios.splice(-1);//quitamos la fila de totales
      municipios.forEach(function (municipio_id, i) {
        writer.write([municipio_id].concat([year], px.dataCol([i, '*'])));
      });
      bar.tick();

    });
  }
}


/**
 * ordenanzas_fiscales - Procesa los archivos fuente y genera el csv destino
 */
function processOrdenanzasFiscales() {


// Inicializamos el Progress Bar
  var bar = new ProgressBar('  Processing [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: (currentYear - STARTING_YEAR) * provincias.length // numero de municipios. Quitamos header y EOF
  });

  // Inicializamos CSV de salida
  var writer = csvWriter({ headers: ORDENANZAS_FISCALES_HEADERS});
  writer.pipe(fs.createWriteStream(ORDENANZAS_FISCALES_DESTFILE));

  // Loop
  for (year = STARTING_YEAR; year <= currentYear-1; year++) {
    provincias.forEach(function (provinciaId, index) {
      provinciaId = ("00" + provinciaId).slice(-2);

      var ext = ([2012,2014].indexOf(year)>=0) ? ".Px" : ".px";
      var fileName = "px/est" + year + "/ordenanzasfiscales/041" + provinciaId + ext;
      var dataString = zip.readAsText(fileName);

      // En 2015 los archivos tienen extensiones que varían entre .px y .Px.
      if (dataString.length==0) {
        dataString = zip.readAsText(fileName.replace('.px','.Px'));
      }

      var px = new Px(dataString);
      var municipios = (year>=2008)? px.codes('municipios'): px.codes('Municipios');

      // Arreglamos provincias con un solo municipio
      if (!Array.isArray(municipios)){
        municipios = [municipios];
      }

      municipios.forEach(function (municipio_id, i) {
        var row = px.dataCol([i, '*']);

        if (year>=2010) {
          row.splice(0,1); //quitamos la primera columna (Año de ultima valoracion)
        }

        if (year<=2012) {
          row.splice(1,1); //quitamos la segunda columna (Tipos diferenciados)
        }

        // A partir de 2014, los códigos de municipio vienen concatenados con el nombre
        if (year>=2014) {
          municipio_id = municipio_id.split(" ")[0];
        }

        row=row.map(function(column,index){
          return parseFloat(column);
        });

        writer.write([parseInt(municipio_id),year].concat(row));
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



