var logData = null;
var registrado = false;
var recibePagos = 0;
var limitSec = 60;
var sec = limitSec;

$(document).ready(function() {
	
	$("#btnSubmit").attr("disabled", true);
	
	//Reenvía correo de validación para completar registro
	$("#enviarCorreo").click(function() {
		var data = {type:"register"};
		$.ajax({
			type : "POST",
			url : "../services/cambiaDataCorreo.php",
			changeHash : false,
			data: data,
			dataType : "json",
			success : function(data) {
				if(data.result == "success") {
					countDown("seconds", "enviarCorreo", "msjEnvioExitoso");
				} else {
					$('#msjEnvioFallido').html(data.message);
					$('#msjEnvioFallido').removeClass('hidden');
				}
			}
		});
	});
	
	//Función que cuenta
	function countDown(timer, btn, msj) {
		var myTimer = document.getElementById(timer);
		var myBtn = document.getElementById(btn);
		$('#'+btn).attr('disabled', true);
		$('#'+msj).removeClass('hidden');
		if (sec < 10) {
			myTimer.innerHTML = "0" + sec;
		} else {
			myTimer.innerHTML = sec;
		}
		if (sec <= 0) {
			$('#'+btn).attr('disabled', false);
			$('#'+msj).addClass('hidden');
			sec = limitSec;
			return;
		}
		sec -= 1;
		window.setTimeout(function() {
			countDown(timer, btn, msj);
		}, 1000);
	}				
	
	//Cuando el cliente abandona el registro
	$(window).bind('beforeunload', function(e){
		if(registrado == false) {
			var recibePagos = "Si";
			if($("input[name=pagos]:checked").val() == null) {
				recibePagos = "No";
			}
			var tipoPersona = "Natural";
			if(recibePagos == "Si" && $('input:radio[name=tipoPersona]:checked').val() == 2) {
				tipoPersona = "Jurídica";
			}
			logData = new FormData();
			logData.append("registroInicial", "Si");
			logData.append("recibePagos", recibePagos);
			logData.append("tipoPersona", tipoPersona);
			$.each($('#formRegistro').serializeArray(), function(i, field) {
		    	if(field.name != "tipoPersona" && field.name != "pagos" && field.name != "psw1" && field.name != "psw2") {
		    		logData.append(field.name, field.value);
		    	}
		    });
	   		return true;
		} else {
			return undefined;
		}
	});
	$(window).unload(function() {
		if(registrado == false) {
			sendBeacon("/app/services/sendRegistrosFallidos.php", logData);
		}
	});
	
	//Terminos y condiciones
	$('#terminos').load('/app/services/tyc/get_tyc_html.php');
	
	//Validaciones mínimas
	var validator = $("#formRegistro").validate({
		rules : {
			email : {
				required : true,
				email : true,
				maxlength : 45
			},
			email2 : {
				required : true,
				email : true,
				maxlength: 45,
				equalTo: "#email"
			},
			psw1 : {
				required : true,
				minlength : 6,
				maxlength: 45
			},
			psw2 : {
				required : true,
				minlength : 6,
				maxlength: 45,
				equalTo : "#psw1"
			}
			
		},
		messages : {
			email : {
				required : "Debes ingresar tu email",
				email : "Debes ingresar un email válido",
				maxlength : "Largo máximo 45 caracteres"
			},
			email2 : {
				required : "Debes repetir tu email",
				email : "Debes ingresar un email válido",
				maxlength : "Largo máximo 45 caracteres",
				equalTo : "Los email deben ser iguales"
			},
			psw1 : {
				required : "Debes ingresar tu clave",
				minlength : "La clave debe contener 6 caracteres mínimo",
				maxlength : "La clave debe contener 40 caracteres máximo"
			},
			psw2 : {
				required : "Debes ingresar nuevamente tu clave",
				minlength : "La clave debe contener 6 caracteres mínimo",
				maxlength : "La clave debe contener 40 caracteres máximo",
				equalTo : "Las claves deben ser iguales"
			}
			
		},
		submitHandler : function() {
			recaptchaValid();
		},
	});
	
	//Botón volver
	$("#volver").bind('click', function() {
		history.back(1);
	});
	
	//Si hizo clic en desea pago
	$("#pagos").click(function(event){
        if ($("#pagos").is(':checked')) {
            $("#btnSubmit").attr("disabled", true);
			$("#camposPago").removeClass('hide');
			$("#camposAceptoBoletaFactura").removeClass('hide');
			$("#acepta-terminos").prop('checked', false);
			$("#acepta-check").prop('checked', false);		
		} else {
            $("#btnSubmit").attr("disabled", true);
			$("#camposPago").addClass('hide');
            $("#camposAceptoBoletaFactura").addClass('hide');
            $("#acepta-terminos").prop('checked', false);
			$("#acepta-check").prop('checked', false);
        }
        enableSubmit();
    });
	
	//Si hizo clic en Acepta Documento electronico
	$("#acepta-check").click(function(event) {
		enableSubmit();
	});
	
	//Si hizo clic en Acepta Terminos y Condiciones
	$("#acepta-terminos").click(function(event) {
		enableSubmit();
	});
	
	//Popup de registro exitoso
	$('#registroPopupMessage').on('hidden.bs.modal', function () {
		if(recibePagos) {
			window.open("../../index.php", "_self", "", "");
		} else {
			window.open("../../app/web/menu.php", "_self", "", "");
		}
	});
	

	//Valida recaptcha
	function recaptchaValid() {
		var siteKey = $("#recaptcha").attr("data-siteKey");
		grecaptcha.execute(siteKey, {action: 'register'}).then(function(token) {
			submitRegistro(token);
		 });
	}

	//Submit Registro
	function submitRegistro(captchaToken) {

		var clave = SHA1($("#psw1").val());
		var clave2 = SHA1($("#psw2").val());
		var values = {};
		$("#registerError").addClass("hide");
		
		//Almaceno datos
		$.each($('#formRegistro').serializeArray(), function(i, field) {
			if(field.name != "psw1" && field.name != "psw2") {
				values[field.name] = field.value;
			}
		});
		
		//Valido si no hizo click en recibir pagos
		if($("input[name=pagos]:checked").val() == null) {
			recibePagos = 0;
			values["recibePagos"] = 0;
			values["tipoPersona"] = 1;
			values["estadoRegistro"] = 1;
		} else {
			recibePagos = 1;
			values["recibePagos"] = 1;
			values["estadoRegistro"] = 0;
		}
		
		//Actualizo claves
		values["clave1"] = clave;
		values["clave2"] = clave2;
		values["captchaToken"] = captchaToken;
		
		//Ejecuto petición Ajax
		$.ajax({
			type : "POST",
			url : "../services/saveRegister.php",
			data : values,
			changeHash : false,
			dataType : "json",
			success : function(data) {
				if (data.result == "success") {
					registrado = true;
					if(values["recibePagos"]) {
						$("#pag").hide();
					} else {
						$("#vendor").hide();
					}
					$('#registroPopupMessage').modal({
						show: true
					});
				} else {
					$("#labelError").text(data.message);
					$("#registerError").removeClass("hide");
				}
				
			}
		});
	};

	//Determina enable or disable botón submit
	function enableSubmit() {
		var aceptaPagos = $("#pagos").is(':checked');
		var aceptaCheck = $("#acepta-check").is(':checked');
		var aceptaTerminos = $("#acepta-terminos").is(':checked');
		$("#btnSubmit").attr("disabled", true);
		if(aceptaPagos) {
			if(aceptaTerminos && aceptaCheck) { 
				$("#btnSubmit").attr("disabled", false);
			}
		} else {
			if(aceptaTerminos) { 
				$("#btnSubmit").attr("disabled", false);
			}
		}
	}

	//Configuración default para Validator
	if(typeof $.validator != "undefined") {
		 $.validator.setDefaults({
			errorElement: "div",
			errorPlacement: function (error, element) { 
					var tag = element[0].tagName.toUpperCase();
					if (tag == 'SELECT') {
						error.appendTo(element.parent());
						return;
					}
					else if(tag == 'INPUT') {
						if($(element).attr('type') == 'radio') {
							error.appendTo(element.parent().parent());
						} 
						else if($(element).attr('type') == 'checkbox') {
							error.appendTo(element.parent().parent().parent().parent().parent());
						}
						else {
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
	}
});