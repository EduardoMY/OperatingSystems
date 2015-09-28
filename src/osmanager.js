	var time=0; //Clock counter
	var processesNumber=0; //number of processes been created
	var probability=0; //The probability to create a process
	var mode=0; //1=play, 2=pause, 3=stop
	var fastness=0; //1=fast, 2=normal, 3=slow
	var quantum=0; //The quantum of the machine
	var ioTime=0; //
	var algorithm=0; //1=round robin, 2=fcfs
	var fastValues=[100,1500,3000]; //Fast, normal, slow times intervals
	window.alert(11); //Juts for debugging.
	var myVarTime; //Stores the timers



function myTimer() {
	if(mode===0 || mode===2 || mode===3)
		return;
	simulation();
}

function validateValues(){
	var isCorrect, posProbability, posQuantum, posIOTime;
	
	//
	posProbability=document.getElementById("probability").value;
	if(!isNaN(posProbability) && isInt(posProbability) && posProbability>=0 && posProbability<=100){
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
	var newProcess=null;
	var actualProbability=Math.floor(Math.random() * 101);
	
	time++;
	document.getElementById("timer").innerHTML=time;

	if(actualProbability<=probability){
		processesNumber++;
		newProcess = new Process(processesNumber, 0);
	}
	if(algorithm===1)
		roundRobin(newProcess);
	else
		fcfs(newProcess); 
}

function roundRobin(newProcess){
		if(newProcess!==null)
			addRows("finished", newProcess);
}

function fcfs(newProcess){

}

function addRows(table, process){
	var table=document.getElementById(table);
	var newRow=table.insertRow(1);
	newRow.insertCell(0).innerHTML="P0"+process.id;
}
function addRowsEnd(table, process){
	var table=document.getElementById(table);
	var newRow=table.insertRow(-1);
	newRow.insertCell(0).innerHTML="P0"+process.id;	
}

function stopFunction(){
	if(mode===3)
		return;
	time=0;
	processesNumber=0;
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
	for(var rowNumber=1; rowNumber<table.rows.length; )
		table.deleteRow(1);
	
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
		window.alert("fast");
		fastness=1;
		window.clearInterval(myVarTime);
		myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
	}
}

function normal(){
	if(mode!==1){

		window.alert("normal");
		fastness=2;
		window.clearInterval(myVarTime);
		myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
	}

}

function slow(){
	if(mode!==1){
		window.alert("slow");
		fastness=3;
		window.clearInterval(myVarTime);
		myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
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

function Process(id, cpuTime){
	this.processedTime=0;
	this.cpuTime=cpuTime;
	this.id=id;
	this.ioTime=0;
	this.waitingTime=0;

	this.TotalTime = function(){
		return processedTime + ioTime + waitingTime;
	};
	this.isDone=function(){
		return processedTime === processedTime; 
	};
}

function ProcessesList(maxProcessesList){
	this.maxProcessesList=maxProcessesList;
	this.processes=[];
	this.Push=function(process){
		if(this.isFull()){
			processes.push(process);
			return true;
		}
		return false;
	};

	this.Top=function(){
		if(processes.length!==0)
			return processes[0];
		else 
			return null;
	};
	this.Remove= function(){
		if(processes.length!==0)
			return processes.shift();
		else 
			return null;
	};
	this.isFull= function(){
		return processes.length === maxProcessesList;
	};
}

function PCB(){

	this.processes=[];	

	this.Add= function(process){
		processes.push(process);
	};

	this.Actions= function(index){
		var actions=[];
		var actualProcess=null;
		if(index < processes.length){
			actualProcess=processes[index];
			actions.push(actualProcess.id);
		}
		return actions;
	};
}