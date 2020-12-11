/**
 * @author csepulveda
 */

$(document).ready(function(){
	
	$("#errorMessage").addClass("hide");
	
	var loader;
	
	$(document).ajaxStart(function() {
		$("#olvide").attr("disabled", "disabled");
   		loader = new ajaxLoader($("#content"));
 	});
	
	$(document).ajaxComplete(function() {
 		loader.remove();
 		$("#olvide").removeAttr("disabled");
	});
	
	//Validaciones de email
	var validator = $("#frmOlvide").validate({
		rules: {
			email: {
				required: true, 
				email: true
			}
		},
		messages: {
			email: {required: "Debe ingresar su email", email: "Debe ingresar un email válido"}
		},
    	submitHandler: function() {
    		recaptchaValid();
		},
	});
	
	
});

function recaptchaValid() {
	var siteKey = $("#recaptcha").attr("data-siteKey");
	grecaptcha.execute(siteKey, {action: 'olvide'}).then(function(token) {
    	submmitOlvide(token);
     });
}

//Submite el formulario
function submmitOlvide(captchaToken) {
	$("#errorMessage").addClass("hide");
	$('#frmOlvide').prepend('<input type="hidden" name="captchaToken" value="' + captchaToken + '">');
	var data = $("#frmOlvide").serialize();
	$.ajax({
		type: "POST",
		url: "../services/olvidepsw.php",
		data: data,
		changeHash: false,
		dataType: "json",
		success: function(data){
			if(data.result == "success") {
				$('#content').load('olvideSuccess.html?v=2');
			} else {
				$("#errorMessage span").text(data.message);
				$("#errorMessage").removeClass("hide");
			}
		}
	});
}
