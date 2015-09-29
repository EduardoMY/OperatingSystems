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
	var newList;
	var readyList;
	var runningList;
	var waitingList;
	var pcb;


class Process{
	constructor(id, cpuTime){
	this.cpuCounter=0;
	this.processedTime=0;
	this.cpuTime=cpuTime;
	this.id=id;
	this.ioTime=0;
	this.waitingTime=0;
	}
	
	TotalTime(){
		return this.processedTime + this.ioTime + this.waitingTime;
	}
	
	isDone (){
		return this.processedTime === this.processedTime; 
	}
}

class ProcessesList {

	constructor (maxProcessesList){
	this.maxProcessesList=maxProcessesList;
	this.processes=[];
}
	Push(process){
		if(true){
			this.processes.push(process);
			return true;
		}
		return false;
	}

	Top(){
		if(this.processes.length!==0)
			return this.processes[0];
		else 
			return null;
	}
	
	Remove(){
		if(this.processes.length!==0)
			return this.processes.shift();
		else 
			return null;
	}
	isFull(){
		return this.maxProcessesList===this.processes.length;
	}
	isEmpty(){
		return this.processes.length===0;
	}
	Add(process){
		processes.unshift(process);
	}
}

class PCB {
	constructor(){
		this.processes=[];	
	}

	Add(process){
		this.processes.push(process);
	}
	
	Purge(process){
		//processes.indexOf(processes);
	}

	Actions(index){
		var actions=[];
		var actualProcess=null;
		if(index < this.processes.length){
			actualProcess=this.processes[index];
			actions.push(actualProcess.id);
		}
		return actions;
	}
} 


function myTimer() {
	if(mode===0 || mode===2 || mode===3)
		return;
	simulation();
}

function validateValues(){
	var isCorrect, posProbability, posQuantum, posIOTime;
	
	//
	posProbability=document.getElementById("probability").value;
	if(!Number.isNaN(posProbability) && Number.isInteger(Number(posProbability)) && posProbability>=0 && posProbability<=100){
		probability=posProbability;
		isCorrect=true;
	}
	else{
		window.alert("Probability");
		isCorrect=false;
	}
	//
	posQuantum=document.getElementById("quantum").value;
	if(!Number.isNaN(posQuantum) && Number.isInteger(Number(posQuantum)) && posQuantum>=0 && posQuantum<=100){
		quantum=posQuantum;
		document.getElementById("quantumNumber").innerHTML=quantum;	
	}
	else {
		window.alert("Quantum");
		isCorrect=false;
	}

	//
	posIOTime=document.getElementById("ioTime").value;
	if(!Number.isNaN(posIOTime) && Number.isInteger(Number(posIOTime)) && posIOTime>=0 && posIOTime<=100){
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
		var dProcess=null;
		var rProcess=null;
		var nProcess=null;
		var ioProcess=null;

		//window.alert("AQui");

		//from running to done
		if(runningList.isFull()){
			dProcess=runningList.Remove();
			deleteFirstRow("running");
			addRowsEnd("finished", dProcess);
		}

		//from running to  ...

		//from ready to running
		if(!readyList.isEmpty() && !runningList.isFull()){
			rProcess=readyList.Remove();
			runningList.Push(rProcess);
			deleteFirstRow("ready");
			addRowsEnd("running", rProcess);
		}

		//from new to ready
		if(!readyList.isFull() && !newList.isEmpty()){
			nProcess=newList.Remove();
			readyList.Push(nProcess);
			deleteFirstRow("new");
			addRowsEnd("ready", nProcess);
		}
		//window.alert("Hola");

		//Adding a new Process... if able.
		if(newProcess!=null && !newList.isFull()){
			newList.Push(newProcess);
			addRowsEnd("new", newProcess);
		}

		//At the end, update pcb
		updatePCB();
}

function updatePCB(){
	
}

function fcfs(newProcess){

}

function deleteFirstRow(table){
	var tempTable= document.getElementById(table);
	tempTable.deleteRow(1);
}

function deleteLastRow(table){
	var tempTable= document.getElementById(table);
	tempTable.deleteRow(-1);
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
	window.clearInterval(myVarTime);
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
		if (validateValues()){
			
		if(mode===0 || mode===3){ //Creating the objects
			pcb = new PCB();
			newList = new ProcessesList(20);
			readyList = new ProcessesList(20);
			waitingList = new ProcessesList(20);
			runningList = new ProcessesList(1);
		}
			myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
			mode=1;
		}
	}
}

function fast() {
	if(mode!==1)
		fastness=1;
}

function normal(){
	if(mode!==1)
		fastness=2;

}

function slow(){
	if(mode!==1)
		fastness=3;
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