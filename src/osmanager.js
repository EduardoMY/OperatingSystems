	var time=0; //Clock counter
	var processesNumber=1; //number of processes been created
	var probability=0; //The probability to create a process
	var mode=0; //1=play, 2=pause, 3=stop
	var fastness=0; //1=fast, 2=normal, 3=slow
	var quantum=0; //The quantum of the machine
	var averageIOTime=0; //
	var averageCPUTime=0; //
	var newSize=0, readySize=0, waitingSize=0;
	var algorithm=0; //1=round robin, 2=fcfs
	var fastValues=[100,1500,3000]; //Fast, normal, slow times intervals
	window.alert(11); //Juts for debugging.
	var myVarTime=null; //Stores the timers
	var newList=null; //
	var readyList=null; //
	var runningList=null; //
	var waitingList=null; //
	var ioList=null; //
	var pcb=null; //
	var crucialState=false; 

//Continue working with io
//Continue working with fcfs
//implement pinguin

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
	this.terminated=false;
	}
	
	TotalTime(){
		return this.cpuTime + this.ioTime + this.waitingTime;
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
		if(this.terminated){
			data.push(this.TotalTime() + this.arrival); // Time the process ended
			data.push(this.TotalTime()); // Time in the SYstem
		}
		else {
			data.push(Number.NaN);
			data.push(Number.NaN);
		}
		return data;
	}
}

class ProcessesList {

	constructor (maxProcessesList) {
	this.maxProcessesList=maxProcessesList;
	this.processes=[];
	this.length=0;
	}

	Push(process){
		this.processes.push(process);
		this.length++;
	}

	Top(){
		if(this.length!==0)
			return this.processes[0];
		else 
			return null;
	}
	
	UpdateProcess(variable){
		for (var i = this.length - 1; i >= 0; i--)
			(this.processes[i])[variable]++;
	}

	Remove(){
		if(this.length!==0){
			this.length--;
			return this.processes.shift();
		}
		else 
			return null;
	}

	isFull(){
		return this.maxProcessesList<=this.length;
	}

	changeSize(changedSize){
		this.maxProcessesList=changedSize;
	}

	isEmpty(){
		return this.length===0;
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
	var isCorrect;

	//Evaluate the probability, should be an integer number between 0 and 100
	isCorrect=evaluateProbability();

	// Evaluate the quantum, should be an integer bigger than 1
	isCorrect=evaluateQuantum();

	// Evaluate the CPUtime, should be an integer bigger than 0 and less than cpu
	isCorrect=evaluateCPUTime();

	// Evaluate the IOtime, should be an integer bigger than 0 and less than cpu
	isCorrect=evaluateIOTime();

	// Evaluate the Size
	isCorrect=evaluateNewSize();

	//
	isCorrect=evaluateReadySize();

	//
	isCorrect=evaluateWaitingSize();
	
	//
	isCorrect = evaluateElse();

	return isCorrect;
}

function evaluateProbability(){
	var isCorrect=false;
	var posProbability=document.getElementById("probability").value;

	if(!Number.isNaN(posProbability) && Number.isInteger(Number(posProbability)) && posProbability>=0 && posProbability<=100){
		probability=Number(posProbability);
		isCorrect=true;
	}
	else{
		window.alert("Probability");
	}

	return isCorrect;
}

function evaluateQuantum(){
	var isCorrect=true;
	var posQuantum=document.getElementById("quantum").value;
	if(!Number.isNaN(posQuantum) && Number.isInteger(Number(posQuantum)) && posQuantum>2 && posQuantum<=100){
		quantum=Number(posQuantum);
		document.getElementById("quantumNumber").innerHTML=quantum;	
	}
	else {
		window.alert("Quantum");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateCPUTime(){
	var isCorrect=true;
	var posCPUTime=document.getElementById("cpuTime").value;
	if(!Number.isNaN(posCPUTime) && Number.isInteger(Number(posCPUTime)) && posCPUTime>0 && posCPUTime<=100){
		averageCPUTime=Number(posCPUTime);
	}
	else {
		window.alert("CPUTime");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateIOTime() {
	var isCorrect=true;
	var posIOTime=document.getElementById("ioTime").value;
	if(!Number.isNaN(posIOTime) && Number.isInteger(Number(posIOTime)) && posIOTime>0 && posIOTime<=100){
		averageIOTime=Number(posIOTime);
	}
	else {
		window.alert("IOTime");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateNewSize(){
	var isCorrect=true;
	var posNewSize=document.getElementById("newsize").value;
	if(!Number.isNaN(posNewSize) && Number.isInteger(Number(posNewSize)) && posNewSize>=1 && posNewSize<=100){
		newSize=Number(posNewSize);
	}
	else {
		window.alert("New Size");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateReadySize(){
	var isCorrect=true;
	var posReadySize=document.getElementById("readysize").value;
	if(!Number.isNaN(posReadySize) && Number.isInteger(Number(posReadySize)) && posReadySize>=1 && posReadySize<=100){
		readySize=Number(posReadySize);
	}
	else {
		window.alert("Ready Size");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateWaitingSize(){
	var isCorrect=true;
	var posWaitingSize=document.getElementById("waitingsize").value;
	if(!Number.isNaN(posWaitingSize) && Number.isInteger(Number(posWaitingSize)) && posWaitingSize>=1 && posWaitingSize<=100){
		waitingSize=Number(posWaitingSize);
	}
	else {
		window.alert("Waiting Size");
		isCorrect=false;
	}
	return isCorrect;
}

function evaluateElse(){
	var isCorrect=true;
		if(fastness===0){
		window.alert("No speed");
		isCorrect=false;
	}
	
	//
	if(algorithm===0){
		window.alert("No algorithm");
		isCorrect=false;
	}
	return isCorrect
}

function getCPUTime(){
		var df = Math.floor(Math.random() * averageCPUTime / 4);
		var multiplier, cpuNumber;
		if(Math.random() < 0.5)
			multiplier=-1;
		else multiplier=1;
		cpuNumber = averageCPUTime + df * multiplier;
		if(cpuNumber < 3)
			return 3;
		else 
			return cpuNumber;
}

function getIOTime(cpu){
		var df = Math.floor(Math.random() * averageIOTime / 4);
		var multiplier, ioNumber;
		if(Math.random() < 0.5)
			multiplier=-1;
		else multiplier=1;
		ioNumber = averageIOTime + df * multiplier;
		if(ioNumber < cpu)
			return ioNumber;
		else 
			ioNumber = averageIOTime - df * multiplier;
		if(ioNumber<=0)
			return 1;
		else 
			return ioNumber ;

}
 //IO mayor a uno menor que el uso de CPU
function simulation(){
	var newProcess=null;
	var actualProbability=Math.floor(Math.random() * 101);
	var processCPU=getCPUTime();
	var processIO=getIOTime(processCPU);

	time++;
	document.getElementById("timer").innerHTML=time;

	if(actualProbability<=probability){
		newProcess = new Process(processesNumber, time, processCPU, processIO);
	}
	if(algorithm===1)
		roundRobin(newProcess);
	else
		fcfs(newProcess); 
}

function roundRobin(newProcess){
	algorithmLogic(newProcess);
}

function fcfs(newProcess){
	quantum=-1;
	algorithmLogic(newProcess);
}

function algorithmLogic(newProcess){

		var tProcess=null, tRProcess=null,tIOProcess=null, tWProcess=null, tRWProcess=null;

		//from running to finished
		tProcess=running_Finished();

		//from running to ready
		tRProcess=running_Ready();

		//from IO to ready
		tIOProcess=io_Ready();

		//from running to Waiting
		tWProcess=running_Waiting();

		//from waiting to IO
		waiting_IO();

		//from ready to running
		ready_Running();

		//from new to ready
		new_Ready();

		//Adding a new Process... if able.
		creatingProcess(newProcess);

		//EveryList Adds one
		updateLists();
		
		//At the end, update pcb
		updatePCB();

		//Check if the SO is in a crucial state: will be in a deadlock.
		checkSystemState();

		if(tProcess!==null)
			pcb.Remove(tProcess);
		if(tRProcess!==null)
			pcb.Remove(tRProcess);
		if(tIOProcess!==null)
			pcb.Remove(tIOProcess);
		if(tWProcess!==null)
			pcb.Remove(tWProcess);

}
function checkSystemState(){
	var processesSum = waitingSize + readySize;
	var actualProcessesSum = waitingList.length + readyList.length;
	if(waitingList.length > waitingSize*.6 || readyList.length > readySize*.6)
		crucialState=true;
	else if(waitingList.length < waitingSize*.4 && readyList.length < readySize*.4)
		crucialState=false;
}

function running_Finished(){
	var dProcess=null;
	if(!runningList.isEmpty() && runningList.Top().isDone()){
		dProcess=runningList.Remove();
		dProcess.terminated=true;
		deleteFirstRow("running");
		addRows("finished", dProcess);
	}
	return dProcess;
}

function running_Ready(){

		var eProcess=null, tProcess=null;
		if(!runningList.isEmpty() && runningList.Top().cpuCounter===quantum){

				if(!readyList.isFull()){
					eProcess = runningList.Remove();
					eProcess.cpuCounter=0;
					deleteFirstRow("running");
					readyList.Push(eProcess);
					addRowsEnd("ready", eProcess);
			}

			//from running to finished, in case 
			else {
				tProcess=runningList.Remove();
				deleteFirstRow("running");
				tProcess.terminated=true;
				addRows("finished", tProcess);
			}	

		}
		return tProcess;
}

function ready_Running(){
	var eProcess=null;
		if(!readyList.isEmpty() && !runningList.isFull()){
			eProcess=readyList.Remove();
			runningList.Push(eProcess);
			deleteFirstRow("ready");
			addRowsEnd("running", eProcess);
		}
}

function running_Waiting(){
	var eProcess=null, dProcess=null;
		if(!runningList.isEmpty() && runningList.Top().cpuTime!==0 && runningList.Top().ioTime!==runningList.Top().ioTimeNedded){
				if(runningList.Top().cpuTimeNedded===runningList.Top().cpuTime-1 && waitingList.isFull()){
					//delete the process
					dProcess=runningList.Remove();
					dProcess.terminated=true;
					deleteFirstRow("running");
					addRows("finished", dProcess);
				}
				else if(runningList.Top().cpuTimeNedded===runningList.Top().cpuTime - 1 ||  
						(Math.random()<.7 && !waitingList.isFull()) ){
					//Switch the process from running to waiting
					eProcess=runningList.Remove();
					deleteFirstRow("running");
					waitingList.Push(eProcess);
					addRowsEnd("waiting", eProcess);
					eProcess.cpuCounter=0;
				}
			}
	return dProcess;
}


function waiting_IO(){
	var eProcess=null;
	if(ioList.isEmpty() && !waitingList.isEmpty()){
		eProcess=waitingList.Remove();
		deleteFirstRow("waiting");
		ioList.Push(eProcess);
		addRowsEnd("io", eProcess);
	}

}

function io_Ready(){
	var eProcess=null, dProcess=null;
	if(!ioList.isEmpty())
		if(ioList.Top().ioTime===ioList.Top().ioTimeNedded){
			if(readyList.isFull()){
				dProcess=ioList.Remove();
				deleteFirstRow("io");
				dProcess.terminated=true;
				addRows("finished", dProcess);
			}
			else {
				eProcess=ioList.Remove();
				deleteFirstRow("io");
				readyList.Push(eProcess);
				addRowsEnd("ready", eProcess);
			}
		}
}

function new_Ready(){
		var nProcess=null;
		if(!crucialState)
			if(!readyList.isFull() && !newList.isEmpty()){
				nProcess=newList.Remove();
				readyList.Push(nProcess);
				deleteFirstRow("new");
				addRows("ready", nProcess);
			}
}

function creatingProcess(newProcess){

		if(newProcess!=null && !newList.isFull()){
			processesNumber++;
			newList.Push(newProcess);
			addRowsEnd("new", newProcess);
			pcb.Add(newProcess);
			newRowPCB(newProcess);
		}
}

function updateLists(){
	newList.UpdateProcess("waitingTime");
	readyList.UpdateProcess("waitingTime");
	runningList.UpdateProcess("cpuTime");
	runningList.UpdateProcess("cpuCounter");
	waitingList.UpdateProcess("waitingTime");
	ioList.UpdateProcess("ioTime");
}


function updatePCB() {

var pcbRows=document.getElementById("pcb").rows;
var data;
var id;
var specificRow;

for (var i = pcb.length - 1; i >= 0; i--) {
	data=pcb.Actions(i);
    id=data[0];
    specificRow=pcbRows[id].cells;
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
	var newRow=pcbTable.insertRow(-1);

	for (var i = 0; i < actions.length; i++) {
		newRow.insertCell(i).innerHTML=actions[i];
	};
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
	processesNumber=1;
	crucialState=false;
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
	//window.alert("fast");
}

function normal(){
	if(mode!==1)
		fastness=2;
	//window.alert("Normal");
}

function slow(){
	if(mode!==1)
		fastness=3;
	//window.alert("slow");
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