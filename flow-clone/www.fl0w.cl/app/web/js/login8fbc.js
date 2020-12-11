/**
 * @author csepulveda
 */

$(document).ready(function(){
	//Pone la última cuenta de email utilizada
	if(localStorage.length > 0) {
		$("#email").val(localStorage.getItem("email"));
	}
	
	//Validaciones
	var validator = $("#formLogin").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			psw: {
				required: true,
				minlength: 6
			}
		},
		messages: {
			email: {
				required: "Debe ingresar su email",
				email: "Debe ingresar un email válido"
			},
			psw: {
				required: "Debe ingresar su clave",
				minlength: "La clave debe contener 6 caracteres mínimo"
			}
		},
    	submitHandler: function() {
    		recaptchaValid();
		},
	});
	
});

function recaptchaValid() {
	var siteKey = $("#recaptcha").attr("data-siteKey");
	grecaptcha.execute(siteKey, {action: 'login'}).then(function(token) {
    	submitLogin(token);
     });
}

function submitLogin(captchaToken) {
	var token = $.trim($("#token").val());
	var pswh = SHA1($.trim($("#psw").val()));
	$("#btnSubmit").attr("disabled", true);
	
	if(!$("#loginPopup").hasClass('hide')) {
		$("#loginPopup").addClass('hide');
	}
	var psw = (SHA1(pswh + token));
	var data = {email: $("#email").val(), psw: psw, captchaToken: captchaToken };
	$.ajax({
		type: "POST",
		url: "../services/login.php",
		data: data,
		changeHash: false,
		dataType: "json"
	}).done( function(data) {
		getResponse(data);
	}).fail( function(data) {
		getResponse(data.responseJSON);
	});
	
}

function getResponse(data) {
	var previousPage = $("#pre_p").val();
	if(data.result == "success") {
		localStorage.setItem("email", $("#email").val() );
		$.getJSON("../services/getUser.php",function(data) {
			sessionStorage.setItem("userName", data.user);
		});
		if(previousPage != "0"){
			window.location.href = previousPage;
		}else{
			window.location.href= "menu.php";
		}
	} else {
		$("#loginPopup").removeClass('hide');
		$("#loginPopup label").text(data.message);
		$("#btnSubmit").attr("disabled", false);
	}
}
