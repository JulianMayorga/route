'use strict';

var snmp = require('snmp-native');

var host = 'localhost';
var community = 'public';

// nombre: ipRouteTable
// OID: 1.3.6.1.2.1.4.24.4
var oid = [1, 3, 6, 1, 2, 1, 4, 24, 4];
var columna = 0;
var total_columnas = 0;
var red = [];
var mascara = [];
var gateway = [];
var i = 0;

var session = new snmp.Session({ host: host, community: community });
session.getSubtree({ oid: oid }, function (err, varbinds) {
    if (err) {
        // Si hay un error, como SNMP timeout, terminamos aca.
        console.log(err);
    } else {
        // Esta es la lista de varbinds (varbind es un par oid-valor)
        varbinds.forEach(function (vb) {

            if (vb.oid[10] === 1) {
                red[total_columnas] = vb.value;
                total_columnas += 1;
            }

            if (vb.oid[10] === 2) {
               mascara[columna] = vb.value; 
               columna += 1;
                if (columna === total_columnas) {
                    columna = 0;
                }
            }

            if (vb.oid[10] === 4) {
               gateway[columna] = vb.value; 
               columna += 1;
                if (columna === total_columnas) {
                    columna = 0;
                }
            }
        });
    }

    // Imprimir resultados
    for (i; i < total_columnas; i++) {
        console.log('Red: ' + red[i] + ' | Mascara de red: ' + mascara[i] +
                    ' | Gateway: ' + gateway[i] + '\n');
    }

    session.close();
});
