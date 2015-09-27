	var time=0; //Clock counter
	var probability=0; //The probability to create a process
	var mode=0; //1=play, 2=pause, 3=stop
	var fastness=0; //1=fast, 2=normal, 3=slow
	var quantum=0; //The quantum of the machine
	var ioTime=0;
	var algorithm=0; //1=round_robin, 2=fcfs
	var fastValues=[100,1500,3000]; //Fast, normal, slow times intervals
	window.alert(11); //Juts for debugging.
	var myVarTime; //Stores the timers

	//change



function myTimer() {
	if(mode===0 || mode===2 || mode===3)
		return;
	simulation();
}

function validateValues(){
	var isCorrect, posProbability, posQuantum, posIOTime;
	
	//
	posProbability=document.getElementById("probability").value;
	if(isNaN(posProbability) && isInt(posProbability) && posProbability>=0 && posProbability<=100){
		probability=posProbability;
		isCorrect=true;
	}
	else{
		window.alert("Probability");
		isCorrect=false;
	}
	//
	posQuantum=document.getElementById("quantum").value;
	if(!isNaN(posQuantum) && isInt(posQuantum) && posQuantum>=0 && posQuantum<=100){
		quantum=posQuantum;
		document.getElementById("quantumNumber").innerHTML=quantum;	
	}
	else {
		window.alert("Quantum");
		isCorrect=false;
	}

	//
	posIOTime=document.getElementById("ioTime").value;
	if(!isNaN(posIOTime) && isInt(posIOTime) && posIOTime>=0 && posIOTime<=100){
		ioTime=posIOTime;
	}
	else {
		window.alert("IOTime");
		isCorrect=false;
	}

	//
	if(fastness===0){
		window.alert("No speed");
		isCorrect=false;
	}
	
	//
	if(algorithm===0){
		window.alert("No algorithm");
		isCorrect=false;
	}

	return isCorrect;
}

function isInt(number){
	if(number % 1===0)
		return true;
	return false;
}

function simulation(){
	time++;
	document.getElementById("timer").innerHTML=time;
	addingRows();
}

function addingRows(){
	var table=document.getElementById("finished");
	var newRow=table.insertRow(1);
	newRow.insertCell(0).innerHTML="P0"+time;
}

function stopFunction(){
	if(mode===3)
		return;
	time=0;
	processAmount=0;
	document.getElementById("timer").innerHTML=time;
	clearAllTables();
	mode=3;
}

function clearAllTables(){
	var newTable=document.getElementById("new");
	var readyTable=document.getElementById("ready");
	var runningTable=document.getElementById("running");
	var finishedTable=document.getElementById("finished");
	var waitingTable=document.getElementById("waiting");
	var pcbTable=document.getElementById("pcb");
	clearSingleTable(newTable);
	clearSingleTable(readyTable);
	clearSingleTable(runningTable);
	clearSingleTable(finishedTable);
	clearSingleTable(waitingTable);
	clearSingleTable(pcbTable);
}

function clearSingleTable(table){
	for(var rowNumber=1; rowNumber<table.rows.length; rowNumber){
		table.deleteRow(1);
	}
}

function pauseFunction(){
	if(mode===2)
		return;
	mode=2;
}

function playFunction(){
	if(mode!==1){
		if (validateValues())
			mode=1;
	}
}

function fast() {
	if(mode!==1) {
		fastness=1;
		window.clearInterval(myVarTime);
		myVartime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
	}
}

function normal(){
	if(mode!==1){
		fastness=2;
		window.clearInterval(myVarTime);
		myVartime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
	}

}

function slow(){
	if(mode!==1){
		fastness=3;
		window.clearInterval(myVarTime);
		myVartime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
	}
}

function roundRobinButton(){
	if(mode!==1){
		algorithm=1;
	}
}

function fcfsButton(){
	if(mode!==1){
		algorithm=2;
	}
}

function Process(id){
	this.id=id;
}

function ProcessesList(maxProcessesList){
	this.maxProcessesList=maxProcessesList;
}

function PCB(){
	this.Process=[]
}