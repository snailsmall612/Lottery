var password = document.getElementById("signup_password");
var confirm_password = document.getElementById("signup_confirm_pwd");


function validatePassword() {
    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("密碼必須一致");
    } else {
        confirm_password.setCustomValidity('');
    }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;




function checkbox_check(element, actionFieldID) {
    var actionField = document.getElementById(actionFieldID);
    if (element.checked) {
        actionField.value = "不公開";
        actionField.style.visibility = "hidden";
    } else {
        actionField.value = "";
        actionField.style.visibility = "visible";
    }
}

function checkAccount(ajax_url,account,base_url){
	if(account){
		$.post(ajax_url,{
	      	account:account,
	    },
	    function(data,status){
	    	var check_account_msg = document.getElementById("check_account_msg");
	    	var check_account_img = document.getElementById("check_account_img");
	    	if(status == "success"){
	      		if(data == "account_exist"){
	      			check_account_img.innerHTML = "<img width='25' src='" + base_url + "images/signUp/error.png'/>";
	      			check_account_msg.innerHTML = "無法使用此帳號";
	      			check_account_msg.style.color="red";
	      			document.getElementById("signUpSendBtn").setAttribute("disabled","disabled");
	      		}
	      		else{
	      			check_account_img.innerHTML = "<img width='25' src='" + base_url + "images/signUp/ok.png'/>";
					check_account_msg.innerHTML = "此帳號可以使用";
					check_account_msg.style.color="blue";
					document.getElementById("signUpSendBtn").removeAttribute("disabled");					
	      		}
	      	}
	    });
	}
}
