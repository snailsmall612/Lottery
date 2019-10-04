var subjectQuantity;
var subjectCount = 1;
var totalScore = 0;
var time = 0;
var isGameOver = false;
var base_url;
var gameType;
function init(gametype,sq,b_url){
	base_url = b_url;
	subjectQuantity = sq;
	gameType = gametype;
	updateSubjectCount();
	updateScore();
	timeCount();
	createSubject();
}

function decideAnswerLocation(answerLocation){

	var num1 = Math.floor((Math.random() * 100) + 1); // 1~100
	if(Math.floor((Math.random() * 2) + 1) == 2){  // 隨機變成負數
		num1 = num1 * -1;
	}
	var num2 = Math.floor((Math.random() * 100) + 1);
	if(Math.floor((Math.random() * 2) + 1) == 2){  // 隨機變成負數
		num2 = num2 * -1;
	}


	if(gameType == "add_reduce"){
		var randomOperator = Math.floor((Math.random() * 2) + 1); // 1~2
	}
	else if(gameType == "multiply_except"){
		var randomOperator = Math.floor((Math.random() * 2) + 1) + 2;  // 3~4
	}
	else{
		var randomOperator = Math.floor((Math.random() * 4) + 1); // 1~4
	}


	if(randomOperator == 1){
		var operator = "+";
	}
	else if(randomOperator == 2){
		var operator = "-";
	}
	else if(randomOperator == 3){
		var operator = "*";
	}
	else{
		var operator = "/";
	}

	var operatorArray = ["+","*","-","/"];
	var rightAnswer;



	if(answerLocation == 3){
		var rightAnswer = eval("(" + num1 + ")" + operator + "(" + num2 + ")");
	}
	else if(answerLocation == 1){
		var index = operatorArray.indexOf(operator);
		if(index == 0 || index == 1){
			rightAnswer = eval("(" + num2 + ")" + (operatorArray[index + 2]) + "(" + num1 + ")");
		}
		else{
			rightAnswer = eval("(" + num1 + ")" + (operatorArray[index - 2]) + "(" + num2 + ")");
		}		
	}
	else{
		var index = operatorArray.indexOf(operator);
		if(index == 0 || index == 1){
			rightAnswer = eval("(" + num2 + ")" + (operatorArray[index + 2]) + "(" + num1 + ")");
		}
		else if(index == 2){
			rightAnswer = (num1 + num2) * -1;
		}
		else{
			rightAnswer = num1 / num2;
		}
	}
	rightAnswer = Math.round(rightAnswer * 100) / 100;  // 四捨五入到小數點第二位
	var selectedAnswerArray = [];
	selectedAnswerArray.push(rightAnswer);
	selectedAnswerArray.push(randomOtherAnswer(rightAnswer));
	selectedAnswerArray.push(randomOtherAnswer(rightAnswer));
	selectedAnswerArray.push(randomOtherAnswer(rightAnswer));
	
	switch(operator){
		case "*":
			operator = "×";
			break;
		case "/":
			operator = "÷";
			break;
	}

	if(answerLocation == 1){
		if(num1 < 0)
			num1 = "(" + num1 + ")";
		var subject = "? "+operator+" " + num1 + " = " + num2;
	}
	else if(answerLocation == 2){
		var subject = num1 + " "+operator+" ? = " + num2;
	}
	else{
		if(num2 < 0)
			num2 = "(" + num2 + ")";
		var subject = num1 + " "+operator+" " + num2 + " = ?";
	}

	document.getElementById("subject_div").innerHTML = "\
	<div style='margin-top:30px;'>\
		" + subject + "\
	</div>\
	<div>\
		<a class='answer_button' onclick='checkAnswer(this.innerHTML," + rightAnswer + ");'>" + getSelectedAnswer(selectedAnswerArray) + "</a>\
	</div>\
	<div>\
		<a class='answer_button' onclick='checkAnswer(this.innerHTML," + rightAnswer + ");'>" + getSelectedAnswer(selectedAnswerArray) + "</a>\
	</div>\
	<div>\
		<a class='answer_button' onclick='checkAnswer(this.innerHTML," + rightAnswer + ");'>" + getSelectedAnswer(selectedAnswerArray) + "</a>\
	</div>\
	<div>\
		<a class='answer_button' onclick='checkAnswer(this.innerHTML," + rightAnswer + ");'>" + getSelectedAnswer(selectedAnswerArray) + "</a>\
	</div>";
}

function createSubject(){
	var randomNum = Math.floor((Math.random() * 3) + 1);

	switch(randomNum){
		case 1:  // 答案是數字1
			decideAnswerLocation(1);			
			break;
		case 2: // 答案是數字2
			decideAnswerLocation(2);
			break;
		case 3: // 答案是運算結果
			decideAnswerLocation(3);
			break;
	}
}

function randomOtherAnswer(rightAnswer){
	var randomNum = Math.floor((Math.random() * 2) + 1);
	if(randomNum == 1){
		var Answer = rightAnswer + Math.floor((Math.random() * 10) + 1);
		return Math.round(Answer * 100) / 100;
	}
	else{
		var Answer = rightAnswer - Math.floor((Math.random() * 10) + 1);
		return Math.round(Answer * 100) / 100;
	}
}

function getSelectedAnswer(selectedAnswerArray){
	var index = Math.floor(Math.random() * selectedAnswerArray.length);
	var selectedAnswer = selectedAnswerArray[index];
	selectedAnswerArray.splice(index, 1); // 移除指定元素
	return selectedAnswer;
}

function checkAnswer(userAnswer,rightAnswer){
	if(userAnswer == rightAnswer){
		var right_img_div = document.getElementById("right_img_div");
		right_img_div.innerHTML = '<img class="prompt_img_animation" src="'+base_url+'images/mathGame/right.png"/>';
		document.getElementById("correct_sound").play();
		totalScore += 100;
		updateScore();
		subjectCount++;
		if(subjectCount <= subjectQuantity){
			createSubject();
			updateSubjectCount();			
		}
		else{
			gameOver();
		}		
	}
	else{
		var error_img_div = document.getElementById("error_img_div");
		error_img_div.innerHTML = '<img class="prompt_img_animation" src="'+base_url+'images/mathGame/error.png"/>';
		document.getElementById("error_sound").play();
		totalScore -= 100;
		updateScore();
	}
	
}

function ajaxSaveScore(){
	var ajax_url = site_url + "/mathGame/checkLoginStatus";
	$.post(ajax_url,{
      	score:totalScore,
      	subjectQuantity:subjectQuantity,
      	gameType:gameType
    },
    function(data,status){
    	
    });
}

function gameOver(){
	isGameOver = true;
	document.getElementById("backgroundMusic").pause();
	document.getElementById("gameover_sound").play();


	if(totalScore > 0){
		var scoreBar = "\
		<div class='progress-wrap-plus progress'>\
	        <div id='scoreText' class='progress-bar progress'></div>\
	    </div>";
	    var message = "好棒哦~";
	}
	else{
		var scoreBar = "\
		<div class='progress-wrap-negative progress'>\
	        <div id='scoreText' class='progress-bar progress'></div>\
	    </div>";
	    var message = "再接再厲";
	}
	document.getElementById("subject_div").innerHTML = "\
	<div>" + message + "</div>\
	<div>總題數:" + subjectQuantity + "</div>\
	<div>花費時間:" + time + "秒</div>\
	<div>分數:</div>" + scoreBar;

	document.getElementById("score_div").innerHTML = "";
	document.getElementById("subject_count_div").innerHTML = "";
	document.getElementById("time_div").innerHTML = "";

	var animationLength;
	function playProgressBarAnimation(throughScore,progressTotal,animationLengthControl){
	    animationLength = Math.abs(throughScore * animationLengthControl);

	    $('.progress-bar').stop().animate({
	        left: progressTotal
	    }, animationLength);
	}
	playProgressBarAnimation(totalScore - 0,totalScore / 5,5.5);

    

    if(totalScore >= 0){
    	document.getElementById("scoreText").style.textAlign="left";
    }
    else{
    	document.getElementById("scoreText").style.textAlign="right";
    }

    function playScoreChangeSound(){
    	var score_change_sound = document.getElementById("score_change_sound");
		score_change_sound.volume = 0.2;
		score_change_sound.play();
    }

    var score = 0; 

    function scoreReduceTimeTextAnimation(scoreLength) {
    	playScoreChangeSound();
    	--score;
    	if(score >= 0){
	    	document.getElementById("scoreText").style.textAlign="left";
	    }
	    else{
	    	document.getElementById("scoreText").style.textAlign="right";
	    }
    	document.getElementById("scoreText").innerHTML = score;
    	if(score > totalScore){
	    	setTimeout(scoreReduceTimeTextAnimation(scoreLength), animationLength / scoreLength);
    	}
    	else{
    		scoreResult();
    	}	   
	}

    function scoreReduceTime(){
    	
    	score = totalScore;
    	totalScore = totalScore - (time * 10);
    	playProgressBarAnimation(Math.abs(score - totalScore),totalScore / 5,5.5);
    	scoreReduceTimeTextAnimation(Math.abs(score - totalScore));
    }

    function scoreResult(){
    	document.getElementById("score_result_sound").play();
    	var scoreText = document.getElementById("scoreText");
    	scoreText.className += " textScaleBigAnimation";
    	function AnimationEnd(){
    		new Messi('遊戲結束，您得到「' + totalScore + '」分!', {title: 'message', titleClass: 'info',width:'300px' ,buttons: [{id: 0, label: '確定', val: 'X'}]});
    	}
    	scoreText.addEventListener("webkitAnimationEnd", AnimationEnd, false);
    	scoreText.addEventListener("animationend", AnimationEnd, false);
    	scoreText.addEventListener("oanimationend", AnimationEnd, false); 	

    	ajaxSaveScore();
    }

    
    function scoreTextAnimation() {
    	if(totalScore > 0){
    		playScoreChangeSound();

	    	document.getElementById("scoreText").innerHTML = ++score;
	    	if(score < totalScore){
		    	setTimeout(scoreTextAnimation, animationLength / totalScore);
	    	}
	    	else{
	    		scoreReduceTime();
	    	}
	    }
	    else if(totalScore < 0){
	    	playScoreChangeSound();

	    	document.getElementById("scoreText").innerHTML = --score;
	    	if(score > totalScore){
		    	setTimeout(scoreTextAnimation, animationLength / totalScore);
	    	}
	    	else{
	    		scoreReduceTime();
	    	}
	    }
	    else{
	    	document.getElementById("scoreText").innerHTML = score;
	    }
	}
	scoreTextAnimation();

}

function updateSubjectCount(){
	document.getElementById("subject_count_div").innerHTML = subjectCount + "/" + subjectQuantity;
}

function updateScore(){
	document.getElementById("score_div").innerHTML = "Score: " + totalScore;
}

function timeCount(){	
	if(isGameOver == false){
		time++;
		document.getElementById("time_div").innerHTML = "time <div>" + time + "</div>";
		setTimeout("timeCount()",1000);
	}
}