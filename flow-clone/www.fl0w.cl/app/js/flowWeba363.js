/**
 * @author csepulveda
 * 
 * Rutinas comunes aplicacion Web
 * 
 */

	// Fix para problema en dropdown en dispositivos touch
	$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });


 //Configuración default para Validator
     //run plugin dependent code
     if(typeof $.validator != "undefined") {
		 $.validator.setDefaults({
			errorElement: "div",
			errorPlacement: function (error, element) { 
					var tag = element[0].tagName.toUpperCase();
					if (tag == 'SELECT') {
		    			error.appendTo(element.parent());
		    			return;
		    		} else if(tag == 'INPUT') {
		    			if($(element).attr('type') == 'radio') {
		            		error.appendTo(element.parent().parent());
		            	} else {
		            		var elem = element.parent();
		            		if($(elem).hasClass("input-append")) {
		            			error.appendTo(elem.parent());
		            		} else {
		            			error.appendTo(element.parent());
		            		}
		        		} 
		    		} else if(tag == "TEXTAREA") {
		    			error.appendTo(element.parent());
		    		}
		    },
		    errorClass: "invalid",
		    validClass: "valid",
		    highlight: function(element, errorClass, validClass) {
		 		$(element).addClass(errorClass).removeClass(validClass);
			},
			unhighlight: function(element,errorClass,validClass){
				$(element).removeClass(errorClass).addClass(validClass);
			}
		});
	};
		
	
	//Definición de objeto Collection
	var collection = function() {
		this.collection = {};
		this.count = 0;
		
		this.add= function(key, item) {
			if(this.collection[key]!=undefined) {
				return undefined;
			}             
			this.collection[key] = item;
			return ++this.count;
		};
		
		this.remove = function(key) {
			 if(this.collection[key]==undefined) {
			 	return undefined;
			 }         
	 		delete this.collection[key];
			return --this.count;
		};
		
		this.item = function(key) {
			return this.collection[key];
		};
		
		this.forEach = function(block) {
			for (key in this.collection) {
	  			if(this.collection.hasOwnProperty(key)) {
	   				block(this.collection[key], key);
	  			}
	 		}
		};
	};
 
 
	//Funcion para enviar datos sendBeacon
	function sendBeacon(url, data) {
		if(navigator.sendBeacon) {
			navigator.sendBeacon(url, data);
		} else {
			window.fetch(url, {method: 'POST', body: data, credentials: 'include'});
		}
	}
	
	
	// Función de filtrado de listas
	function listFilter(list, filter) {
		$(list).find('li').removeClass('hide');
		if( filter ) {
			$(list).find('a:not(:Contains('+ filter +'))').parent().addClass('hide');
		}
	}

 // custom css expression for a case-insensitive contains()
  	jQuery.expr[':'].Contains = function(a,i,m){
      return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
  	};
  	
	var definicionTitulosTabla = {
		"oPaginate" : {
			"sNext" : "Siguiente",
			"sPrevious": "Anterior"
		},
		"sSearch": "Buscar por Nº Orden:",
		"sEmptyTable": "No hay datos para mostrar",
		"sInfo": "Mostrando resultados _START_ al _END_ de _TOTAL_",
		"sInfoEmpty": "No hay datos para mostrar",
		"sZeroRecords": "No hay datos para mostrar",
		"sInfoFiltered": "(filtrado de _MAX_ totales)",
		"sLengthMenu": "_MENU_ Registros por Página",
		"sProcessing": "Cargando ...",
		"sLoadingRecords": "Cargando ..."
	};
	
	 /* Get the rows which are currently selected */
    function fnGetSelected( oTableLocal ){
        return oTableLocal.$('tr.row_selected');
    }
	
	
// funcion para limpiar clases valid e invalid de formularios

	function clearForm(myform) {
		$('#' + myform + " :input").each(function() {
		  $(this).removeClass('valid');
		  $(this).removeClass('invalid');
		});
	}
	
// funcion para formatear con separador de miles un numero
	function formatMiles(mynumber, sep) {
    mynumber = mynumber || 0;
    sep = sep || ",";
    var amount = new String(mynumber);
    amount = amount.split("").reverse();

    var output = "";
    for ( var i = 0; i <= amount.length-1; i++ ){
        output = amount[i] + output;
        if ((i+1) % 3 == 0 && (amount.length-1) !== i)output = sep + output;
    }
    return output;
}

//Funcion para formatear numeros c=cantidad de decimales, d= separador decimal, t= separador de miles
// Use así: (12345.67).formatMoney(2,".", ",")
Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

	/**
	*
	*  Secure Hash Algorithm (SHA1)
	*  http://www.webtoolkit.info/
	*
	**/
	 
	function SHA1 (msg) {
	 
		function rotate_left(n,s) {
			var t4 = ( n<<s ) | (n>>>(32-s));
			return t4;
		};
	 
		function lsb_hex(val) {
			var str="";
			var i;
			var vh;
			var vl;
	 
			for( i=0; i<=6; i+=2 ) {
				vh = (val>>>(i*4+4))&0x0f;
				vl = (val>>>(i*4))&0x0f;
				str += vh.toString(16) + vl.toString(16);
			}
			return str;
		};
	 
		function cvt_hex(val) {
			var str="";
			var i;
			var v;
	 
			for( i=7; i>=0; i-- ) {
				v = (val>>>(i*4))&0x0f;
				str += v.toString(16);
			}
			return str;
		};
	 
	 
		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";
	 
			for (var n = 0; n < string.length; n++) {
	 
				var c = string.charCodeAt(n);
	 
				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
	 
			}
	 
			return utftext;
		};
	 
		var blockstart;
		var i, j;
		var W = new Array(80);
		var H0 = 0x67452301;
		var H1 = 0xEFCDAB89;
		var H2 = 0x98BADCFE;
		var H3 = 0x10325476;
		var H4 = 0xC3D2E1F0;
		var A, B, C, D, E;
		var temp;
	 
		msg = Utf8Encode(msg);
	 
		var msg_len = msg.length;
	 
		var word_array = new Array();
		for( i=0; i<msg_len-3; i+=4 ) {
			j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
			msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
			word_array.push( j );
		}
	 
		switch( msg_len % 4 ) {
			case 0:
				i = 0x080000000;
			break;
			case 1:
				i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
			break;
	 
			case 2:
				i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
			break;
	 
			case 3:
				i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
			break;
		}
	 
		word_array.push( i );
	 
		while( (word_array.length % 16) != 14 ) word_array.push( 0 );
	 
		word_array.push( msg_len>>>29 );
		word_array.push( (msg_len<<3)&0x0ffffffff );
	 
	 
		for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
	 
			for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
			for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
	 
			A = H0;
			B = H1;
			C = H2;
			D = H3;
			E = H4;
	 
			for( i= 0; i<=19; i++ ) {
				temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B,30);
				B = A;
				A = temp;
			}
	 
			for( i=20; i<=39; i++ ) {
				temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B,30);
				B = A;
				A = temp;
			}
	 
			for( i=40; i<=59; i++ ) {
				temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B,30);
				B = A;
				A = temp;
			}
	 
			for( i=60; i<=79; i++ ) {
				temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
				E = D;
				D = C;
				C = rotate_left(B,30);
				B = A;
				A = temp;
			}
	 
			H0 = (H0 + A) & 0x0ffffffff;
			H1 = (H1 + B) & 0x0ffffffff;
			H2 = (H2 + C) & 0x0ffffffff;
			H3 = (H3 + D) & 0x0ffffffff;
			H4 = (H4 + E) & 0x0ffffffff;
	 
		}
	 
		var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	 
		return temp.toLowerCase();
	 
	}

// funcion para retornar las variables pasada en un query string
function getUrlVars() {
	 var vars = [], hash;
	 var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	 for(var i = 0; i < hashes.length; i++) {
      	hash = hashes[i].split('=');
     	vars.push(hash[0]);
      	vars[hash[0]] = hash[1];
     }
    return vars;
}


/*
* Ajax overlay 1.0
* Author: Simon Ilett @ aplusdesign.com.au
* Descrip: Creates and inserts an ajax loader for ajax calls / timed events 
* Date: 03/08/2011 
*/
function ajaxLoader (el, options) {
	// Becomes this.options
	var defaults = {
		bgColor 		: "transparent",
		duration		: 200,
		opacity			: 1.0,
		classOveride 	: false
	};
	this.options 	= jQuery.extend(defaults, options);
	this.container 	= $(el);
	
	this.init = function() {
		var container = this.container;
		// Delete any other loaders
		this.remove(); 
		// Create the overlay 
		var overlay = $('<div></div>').css({
				'background-color': this.options.bgColor,
				'opacity': this.options.opacity,
				'margin': 'auto',
				'left':'0',
				'right':'0',
				'top':'0',
				'bottom':'0',
				'width': '200px',
				'height': '200px',
				'position':'absolute',
				'z-index':99999
		}).addClass('ajax_overlay');
		// add an overiding class name to set new loader style 
		if (this.options.classOveride) {
			overlay.addClass(this.options.classOveride);
		}
		// insert overlay and loader into DOM 
		container.append(
			overlay.append(
				$('<div></div>').addClass('ajax_loader')
			).fadeIn(this.options.duration)
		);
    };
	
	this.remove = function(){
		var overlay = this.container.children(".ajax_overlay");
		if (overlay.length) {
			overlay.fadeOut(this.options.classOveride, function() {
				overlay.remove();
			});
		}
	};

    this.init();
}

// Funcion para invocar desde el retorno de un servicio que ha perdido la sesion
function lostSession(page) {
	$.ajax({
		type: "post",
		data: {'page': page},
		url: "../services/lostSession.php",
		cache: false,
		dataType: "json",
		success: function(data, status) {
			if(data.result == "success") {
				window.location.href = data.location;
			}
		}
	});
}


/* Funciones Suscripciones */

// Funcion que cuenta el número de decimales de un número
function decimalPlaces(n) {
	function hasFraction(n) {
		return Math.abs(Math.round(n) - n) > 1e-10;
	}
	var count = 0;
	// multiply by increasing powers of 10 until the fractional part is ~ 0
	while (hasFraction(n * (Math.pow(10, count))) && isFinite(Math.pow(10, count)))
		count++;
	return count;
}


// Modifica formato de fecha DD-MM-YYYY por YYYY-MM-DD
function toDate(dateStr) {
	var parts = dateStr.split("-");
	if(parts.length < 3) {
		return null;
	} else {
		return parts[2] + "-" + parts[1] + "-" + parts[0];
	}
}

// Verifica fecha mínima
function validaFechaMinima(fecha, fechaMinima) {
	if(fecha == null) {
		return true;
	}
	var f1 = new Date(fecha);
	var f2 = new Date(fechaMinima);
	f1.setHours(0,0,0,0);
	f2.setHours(0,0,0,0);
	return (f1.getTime() >= f2.getTime());
}

