	var time=0;
	var processAmount=0;
	var fast=[100,1500,3000];
	window.alert(11);

var myVar=setInterval(function () {myTimer()}, fast[1]);

function myTimer() {
	time++;
	document.getElementById("timer").innerHTML=time;
}


function stopFunction(){
	time=0;
	processAmount=0;
	document.getElementById("timer").innerHTML=time;
}

function pauseFunction(){

}

function playFunction(){

}

function Process(id ){

}

function ProcessesList(maxProcessesList){
	this.maxProcessesList=maxProcessesList;

}
function PCB(){
	this.Process=[]
}