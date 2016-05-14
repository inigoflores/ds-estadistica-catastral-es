# ds-estadistica-catastral-es

Estadísticas catastrales desde 2006 hasta la fecha. 
 
Actualmente únicamente incluye:

    Urbano 041: Variables catastrales por municipio 





## Variables catastrales por municipio y año

- Fuente: [Estadísticas catastrales. Dirección General del Catastro](http://www.catastro.minhap.gob.es/esp/estadisticas.asp)
- URL: `http://www.catastro.minhap.gob.es/documentos/estadisticas/px.zip`
- Tipo: PC Axis
- Sección: `px/estYYYY/catastro/urbano/041MM`
- Datos procesados: [/data/urbano_municipios.csv](data/urbano_municipios.csv) 
 

### Formato de los datos

    municipio_id        Código INE del municipio
    year                Año del dato
    ultima_valoracion   Año de efecto de la última ponencia de valores (revisión catastral) 
    parcelas_num        Número de parcelas urbanas
    parcelas_area       Superficie de parcelas urbanas (hectáreas)
    inmuebles_num       Número de bienes inmuebles
    vc_construccion     Valor catastral de la construcción total (miles de euros)
    vc_suelo            Valor catastral del suelo total (miles de euros)
    vc_total            Suma del valor catastral de la construcción y suelo
    

Ejemplo en CSV:


|---------------+------+-------------------+--------------+---------------+---------------+-----------------+----------------+----------------|
|  municipio_id | year | ultima_valoracion | parcelas_num | parcelas_area | inmuebles_num | vc_construccion | vc_suelo       | vc_total       |
|---------------+------+-------------------+--------------+---------------+---------------+-----------------+----------------+----------------|
|  02001        | 2006 | 1990              | 756          | 27.8903       | 758           | 8278.791319856  | 4353.179390144 | 12631.97071    |
|  02002        | 2006 | 1990              | 748          | 18.4699       | 800           | 4364.222763276  | 2867.691856724 | 7231.91462     |
|  02003        | 2006 | 2006              | 19282        | 3071.4533     | 108239        | 3577383.08728   | 5794887.57849  | 9372270.66577  |
|---------------+------+-------------------+--------------+---------------+---------------+-----------------+----------------+----------------|


## Script

El script se puede encontrar en [/scripts/ine](/scripts/ine).


##Falta por añadir

Entre otros, lo siguiente:

###Catastro Urbano

    01001:  Resumen por Año última valoración y Variables Catastro.
    01002:  Resumen por Intervalos de número de bienes y Variables Catastro.
    01003:  Resumen por Intervalos de valor catastral por bien y Variables
    01004:  Resumen por Intervalos población y Variables Catastro
    01005:  Resumen por Intervalos población, por usos y bienes inmuebles y valor catastral
    01006:  Resumen por Intervalos población y parcelas edificadas por propiedad
    01007:  Resumen por Intervalos población y superficies de parcelas urbanas

    02001:  Resumen por Comunidades Autónomas y Variables Catastro
    02002:  Resumen por Comunidades Autónomas, por usos y bienes inmuebles y valor catastral
    02003:  Resumen por Comunidades Autónomas y parcelas edificadas por propiedad
    02004:  Resumen por Comunidades Autónomas y parcelas según superficie
    02005:  Resumen por Comunidades Autónomas y superficies parcelas urbanas

    03001:  Resumen por Provincias y Variables Catastro.;
    03002:  Resumen por Provincias, por usos y bienes inmuebles y valor
    03003:  Resumen por Provincias y parcelas edificadas por propiedad
    03004:  Resumen por Provincias y parcelas según superficie
    03005:  Resumen por Provincias y superficies parcelas urbanas

    042:    Bienes inmuebles, usos y valor catastral por municipio
    043:    Parcelas edificadas por propiedad
    044:    Parcelas según superficie y estado (edificadas o no)
    045:    Superficie de parcelas urbanas
    URAO42: Bienes inmuebles por uso y municipio (A partir de 2013)
    URBO42: Valor catastral por uso y municipio (A partir de 2013)


###Información por distritos censales


    ANUXXXX_1: Inmuebles por distrito y uso
    ANUXXXX_2: Superficie media por distrito
    ANUXXXX_3: Valor catastral medio por distrito 


###Catastro Rústico

    01001: Resumen por años del proceso de renovación y Variables Catastro
    01002: Resumen por intervalos de superficie rústica y Variables Catastro
    01003: Resumen por intervalos de valor catastral y Variables Catastro
    01004: Resumen por intervalos de número de parcelas y Variables Catastro
    01005: Resumen por intervalos de población y Variables Catastro
    01006: Resumen por intervalos de valor catastral por hectárea y Variables Catastro
    01007: Resumen por intervalos de valor catastral por parcela y Variables Catastro
    01008: Resumen por intervalos de valor catastral por habitante y Variables Catastro

    02001: Resumen por Comunidades Autónomas y Variables Catastro
    02002: Resumen por Comunidades Autónomas, tipo de cultivo (%) y Variables Catastro

    03001: Resumen por Provincias y Variables Catastro
    03002: Resumen por Provincias, tipo de cultivo (%) y Variables Catastro

    041:   Variables catastrales por municipio
    042:   Tipo de cultivo (%) y Variables Catastro por municipio


###Catastro Titulares

    02001: Resumen por Comunidades Autónomas, catastro y titulares
    03002: Resumen por provincias, catastro y titulares
    040  : Número de titulares por municipio y catastro


Muchos otros!


##Estructura del archivo px.zip


```
.
├── altasuso
├── datoshistoricos
│   ├── IBI
│   ├── Ordenanzas
│   ├── rustica
│   └── urbana
├── distrito
├── est2006
│   ├── catastro
│   │   ├── bice
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2007
│   ├── catastro
│   │   ├── bice
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2008
│   ├── catastro
│   │   ├── bice
│   │   ├── mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2009
│   ├── catastro
│   │   ├── bice
│   │   ├── mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2010
│   ├── catastro
│   │   ├── bice
│   │   ├── mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2011
│   ├── Catastro
│   │   ├── bice
│   │   ├── mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2012
│   ├── Catastro
│   │   ├── bice
│   │   ├── distrito
│   │   ├── mensuales
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2013
│   ├── Catastro
│   │   ├── altasuso
│   │   ├── bice
│   │   ├── distrito
│   │   ├── Mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2014
│   ├── Catastro
│   │   ├── bice
│   │   ├── distrito
│   │   ├── Mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   ├── ibi
│   └── ordenanzasfiscales
├── est2015
│   ├── Catastro
│   │   ├── altasuso
│   │   ├── bice
│   │   ├── distrito
│   │   ├── Mensuales
│   │   ├── rustico
│   │   ├── titulares
│   │   └── urbano
│   └── ordenanzasfiscales
└── est2016
    └── Catastro
        ├── Mensuales
        ├── Titulares
        └── Urbano

