/*Dudas
 -> Si un proceso se crea pero no hay lugar en hold?
 -> Se puede cambiar la mecanica del proyecto
 -> 
*/	
	var time=0; //Clock counter
	var processesNumber=1; //number of processes been created
	var probability=0; //The probability to create a process
	var mode=0; //1=play, 2=pause, 3=stop
	var fastness=0; //1=fast, 2=normal, 3=slow
	var quantum=0; //The quantum of the machine
	var averageIOTime=0; //
	var averageCPUTime=0; 
	var newSize=0, readySize=0, waitingSize=0;
	var algorithm=0; //1=round robin, 2=fcfs
	var fastValues=[100,1500,3000]; //Fast, normal, slow times intervals
	window.alert(11); //Juts for debugging.
	var myVarTime=null; //Stores the timers
	var newList=null;
	var readyList=null;
	var runningList=null;
	var waitingList=null;
	var ioList=null;
	var pcb=null;


class Process{
	constructor(id, arrival, cpuTime, ioTime){
	
	this.id=id;
	this.arrival=arrival;

	this.cpuCounter=0;
	this.ioTime=0;
	this.cpuTime=0;

	this.waitingTime=0;

	this.cpuTimeNedded=cpuTime;
	this.ioTimeNedded=ioTime;
	}
	
	TotalTime(){
		return this.processedTime + this.ioTime + this.waitingTime;
	}
	
	isDone (){
		return this.cpuTime === this.cpuTimeNedded; 
	}

	Print(){ //only gives an array with the data
		//format: ID|Arrival|CPU nedded| CPU Ussage| IO TIme | TIme of IO| Finish Time | Time in the System
		var data=[];
		data.push(this.id); //ID
		data.push(this.arrival); //Arival
		data.push(this.cpuTimeNedded); //CPU nedded
		data.push(this.cpuTime); //CPU Ussage
		data.push(this.ioTimeNedded); //IO TIme nedded
		data.push(this.ioTime); //IO Time Ussage
		data.push(this.TotalTime() + this.arrival); // Time the process ended
		data.push(this.TotalTime()); // Time in the SYstem
		return data;
	}
}

class ProcessesList {

	constructor (maxProcessesList) {
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
	
	UpdateProcess(variable){
		for (var i = this.processes.length - 1; i >= 0; i--) {
			(this.processes[i])[variable]++;
		};
	}

	Remove(){
		if(this.processes.length!==0)
			return this.processes.shift();
		else 
			return null;
	}

	isFull(){
		return this.maxProcessesList<=this.processes.length;
	}

	changeSize(changedSize){
		this.maxProcessesList=changedSize;
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
		this.length=0;
	}

	Add(process){
		this.processes.push(process);
		this.length++;
	}
	
	Remove(process){
		var position=this.processes.indexOf(process);
		if(position!==-1){
			this.processes.splice(position, 1);
			this.length--;
		}
	}

	Actions(index){
		var actions=[];
		var actualProcess=null;
		if(index < this.length){
			actualProcess=this.processes[index];
			actions=actualProcess.Print();
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
	var isCorrect, posProbability, posQuantum, posIOTime, posWaitingSize, posNewSize, posReadySize;
	
	//Evaluate the probability, should be an integer number between 0 and 100
	posProbability=document.getElementById("probability").value;
	if(!Number.isNaN(posProbability) && Number.isInteger(Number(posProbability)) && posProbability>=0 && posProbability<=100){
		probability=Number(posProbability);
		isCorrect=true;
	}
	else{
		window.alert("Probability");
		isCorrect=false;
	}

	// Evaluate the quantum, should be an integer bigger than 1
	posQuantum=document.getElementById("quantum").value;
	if(!Number.isNaN(posQuantum) && Number.isInteger(Number(posQuantum)) && posQuantum>0 && posQuantum<=100){
		quantum=Number(posQuantum);
		document.getElementById("quantumNumber").innerHTML=quantum;	
	}
	else {
		window.alert("Quantum");
		isCorrect=false;
	}

	// Evaluate the IOtime, should be an integer bigger than 0
	posIOTime=document.getElementById("ioTime").value;
	if(!Number.isNaN(posIOTime) && Number.isInteger(Number(posIOTime)) && posIOTime>=0 && posIOTime<=100){
		ioTime=Number(posIOTime);
	}
	else {
		window.alert("IOTime");
		isCorrect=false;
	}

	// Evaluate the Size
	posNewSize=document.getElementById("newsize").value;
	if(!Number.isNaN(posNewSize) && Number.isInteger(Number(posNewSize)) && posNewSize>=0 && posNewSize<=100){
		newSize=Number(posNewSize);
	}
	else {
		window.alert("New Size");
		isCorrect=false;
	}

	//
	posReadySize=document.getElementById("readysize").value;
	if(!Number.isNaN(posReadySize) && Number.isInteger(Number(posReadySize)) && posReadySize>=0 && posReadySize<=100){
		readySize=Number(posReadySize);
	}
	else {
		window.alert("Ready Size");
		isCorrect=false;
	}

	//
	posWaitingSize=document.getElementById("waitingsize").value;
	if(!Number.isNaN(posWaitingSize) && Number.isInteger(Number(posWaitingSize)) && posWaitingSize>=0 && posWaitingSize<=100){
		waitingSize=Number(posWaitingSize);
	}
	else {
		window.alert("Waiting Size");
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

function getQuantum(){
	return 10;
}

function getIOTime(){

}

function simulation(){
	var newProcess=null;
	var actualProbability=Math.floor(Math.random() * 101);
	var processIO=0;
	var processQuantum=getQuantum();

	time++;
	document.getElementById("timer").innerHTML=time;

	if(actualProbability<=probability){
		newProcess = new Process(processesNumber, time, processQuantum, processIO);
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
		if(!runningList.isEmpty() && runningList.Top().isDone()){
			dProcess=runningList.Remove();
			deleteFirstRow("running");
			addRowsEnd("finished", dProcess);
		}

		//if(runningList.isFull())
		//	window.alert(runningList.Top().cpuTime);
		//from running to  ... ready


		//from ready to running
		if(!readyList.isEmpty() && !runningList.isFull()){
			rProcess=readyList.Remove();
			runningList.Push(rProcess);
			deleteFirstRow("ready");
			addRowsEnd("running", rProcess);
		}

		//from waiting to IO
 
		//from 

		//from new to ready
		if(!readyList.isFull() && !newList.isEmpty()){
			nProcess=newList.Remove();
			readyList.Push(nProcess);
			deleteFirstRow("new");
			addRowsEnd("ready", nProcess);
		}

		//Adding a new Process... if able.
		if(newProcess!=null && !newList.isFull()){
			processesNumber++;
			newList.Push(newProcess);
			addRowsEnd("new", newProcess);
			pcb.Add(newProcess);
			newRowPCB(newProcess);
		}


		//EveryList Adds one
		updateLists();
		
		//At the end, update pcb
		updatePCB();
		
		if(dProcess!==null)
			pcb.Remove(dProcess)
}

function updateLists(){
	newList.UpdateProcess("waitingTime");
	readyList.UpdateProcess("waitingTime");
	runningList.UpdateProcess("cpuTime");
	runningList.UpdateProcess("cpuCounter");
	waitingList.UpdateProcess("waitingTime");
	ioList.UpdateProcess("ioTime");
}

function updatePCB(){

var pcbRows=document.getElementById("pcb").rows;
var data;
var id;
var specificRow;

for (var i = pcb.length - 1; i >= 0; i--) {
	data=pcb.Actions(i);
    id=data[0];
    specificRow=pcbRows[id].cells
    modifyPCBRow(specificRow, data);
};

}


function modifyPCBRow(cells, actions){
	for (var i = actions.length - 1; i >= 0; i--) {
		cells[i].innerHTML=actions[i];
	};
}

function newRowPCB(process){
	var actions=process.Print();
	var pcbTable=document.getElementById("pcb");
	var newRow=pcbTable.insertRow(1);

	for (var i = 0; i < actions.length; i++) {
		newRow.insertCell(i).innerHTML=actions[i];
	};
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
	document.getElementById("timer").innerHTML=0;
	document.getElementById("quantumNumber").innerHTML=0;
	clearAllTables();
	newList=null;
	readyList=null;
	runningList=null;
	waitingList=null;
	ioList=null;
	pcb=null;
	window.clearInterval(myVarTime);
	mode=3;
}

function clearAllTables(){
	var newTable=document.getElementById("new");
	var readyTable=document.getElementById("ready");
	var runningTable=document.getElementById("running");
	var finishedTable=document.getElementById("finished");
	var waitingTable=document.getElementById("waiting");
	var ioTable=document.getElementById("io");
	var pcbTable=document.getElementById("pcb");
	clearSingleTable(newTable);
	clearSingleTable(readyTable);
	clearSingleTable(runningTable);
	clearSingleTable(finishedTable);
	clearSingleTable(waitingTable);
	clearSingleTable(ioTable);
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
	window.clearInterval(myVarTime);
}

function playFunction(){
	if(mode!==1){
		if (validateValues()){
				
			if(pcb===null){ //Creating the objects
				pcb = new PCB();
				newList = new ProcessesList(newSize);
				readyList = new ProcessesList(readySize);
				waitingList = new ProcessesList(waitingSize);
				ioList = new ProcessesList(1);
				runningList = new ProcessesList(1);
			}
			else{
					newList.changeSize(newSize);
					readyList.changeSize(readySize);
					waitingList.changeSize(waitingSize);	
				
			}
				myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
				mode=1;
		}
	}
}

function fast() {
	if(mode!==1)
		fastness=1;
	window.alert("fast");
}

function normal(){
	if(mode!==1)
		fastness=2;
	window.alert("Normal");
}

function slow(){
	if(mode!==1)
		fastness=3;
	window.alert("slow");
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