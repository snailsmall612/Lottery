function check(ajax_url){
	
	var account = document.getElementById("login_account");
	var password = document.getElementById("login_password");
	var error_msg = document.getElementById("login_error_msg");
	if(account.value == ""){
		error_msg.innerHTML="未輸入帳號";	
	}
	else if(password.value == ""){
		error_msg.innerHTML="未輸入密碼";	
	}
	else{

		$.post(ajax_url,{
	      	account:account.value,
	      	password:password.value
	    },
	    function(data,status){

	    	if(data == "login_success"){
	    		location.reload();
	    	}
	    	else{
	    		error_msg.innerHTML="帳號或密碼輸入錯誤";
	    	}
	    });
	}

}