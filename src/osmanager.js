	var time=0; //Clock counter
	var processesNumber=1; //Number of processes been created
	var mode=0; //1=play, 2=pause, 3=stop
	var fastness=0; //1=fast, 2=normal, 3=slow
	var quantum=0; //The quantum of the machine
	var probability=0; //The probability to create a process
	var printerProbability=0; //The probability of a process to require IO
	var switchingPageProbability=0; //
	var averageIOTime=0; //
	var averageCPUTime=0; //
	var averageDiskTime=0; //
	var memorySize=0; //
	var frameSize=0; //
	var holdSize=0, //
		readySize=0, // 
		waitingPrinterSize=0, //
		waitingDiskSize=0; // 
	var algorithm=0; //1=round robin, 2=fcfs
	var swapAlgorithm=0; //1=Oldest, 2=least used
	var fastValues=[100,1500,2000]; //Fast, normal, slow times intervals
	var myVarTime =null; //Stores the timers
	var holdList = null; //
	var readyList = null; //
	var runningList = null; //
	var waitingPrinterList = null; //
	var waitingDiskList = null;
	var ioList = null; //
	var diskList = null;
	var pcb = null; //
	var tap=null;//
	var swap=null; //A vector of swapping
	var ramGrid=null; //A vector with every avaible slot to store processes
	var crucialState = false; //Seems good
//implement pinguin
//document.getElementById("p2").style.color = "blue";

function myTimer() {
	if(mode===0 || mode===2 || mode===3)
		return;
	simulation();
}

function validateValues(){
	var isCorrect=true;

	//Evaluate the probability, should be an integer number between 0 and 100
	isCorrect=isCorrect && evaluateValue(0, "probability", 0, 100);

	// Evaluate the quantum, should be an integer bigger than 1
	isCorrect = isCorrect && evaluateValue(1, "quantum", 2, 100);

	// Evaluate the CPUtime, should be an integer bigger than 0 and less than 100
	isCorrect = isCorrect && evaluateValue(2, "cpuTime", 1, 100);

	// Evaluate the IOtime, should be an integer bigger than 0 and less than 100
	isCorrect = isCorrect && evaluateValue(3, "ioTime", 1, 100);

	// Evaluate the Size of Hold
	isCorrect = isCorrect && evaluateValue(4, "holdsize", 1, 50);

	// Evaluate the size of Ready
	isCorrect = isCorrect && evaluateValue(5, "readysize", 1, 50);

	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(6, "waitingprintersize", 1, 50);

	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(7, "pagingprobability", 0, 100);
	
	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(8, "printerprobability", 0, 100);

	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(9, "diskTime", 1, 100);

	//frame,ram
	
	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(10, "waitingdisksize", 1, 100);


	// Evaluate algorithm and fastness
	isCorrect = isCorrect && evaluateElse();

	return isCorrect;
}

function evaluateValue(index, name, minLimit, maxLimit){
	var isCorrect=false;
	var posValue=document.getElementById(name).value;

	if(!Number.isNaN(posValue) && Number.isInteger(Number(posValue)) && posValue>=minLimit && posValue<=maxLimit){
		setGlobalValue(index, Number(posValue));
		isCorrect=true;
	}
	else{
		window.alert(name);
	}

	return isCorrect;
}

function setGlobalValue(index, value){
	if(index===0)
		probability=value;
	else if(index===1)
		quantum=value;
	else if(index===2)
		averageCPUTime=value;
	else if(index === 3)
		averageIOTime=value;
	else if(index===4)
		holdSize=value;
	else if(index===5)
		readySize=value;
	else if(index===6)
		waitingPrinterSize=value;
	else if(index===7)
		switchingPageProbability=value;
	else if(index===8)
		printerProbability=value;
	else if(index===9)
		averageDiskTime=value;
	else if(index===10)
		waitingDiskSize=value;
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
	if(swapAlgorithm===0){
		window.alert("No swap Algorithm");
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

		//To decide if the process will use the IO or not.
		if(Math.random()>0.5)
			return 0;

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
	var actualProbability=Math.floor(Math.random() * 100)+1;
	var processCPU=getCPUTime();
	var processIO=getIOTime(processCPU);

	time++;
	document.getElementById("timer").innerHTML=time;

	if(actualProbability<=probability){
		//id, arrival, cpuTime, ioTime, diskTime, arrivalIO, pageSpace
		newProcess = new Process(processesNumber,time, processCPU, processIO, 0, 0, 0);
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
		var tProcess=null, 
			tRProcess=null, 
			tIOProcess=null, 
			tWProcess=null, 
			//tRWProcess=null,
			tDProcess=null,
			tWDProcess=null;

		/* Table of actions (in order):
			Free CPU
			Free Printer
			From Ready to Running
			From Hold To Ready
			Making new Processes
		*/

		//from running to finished
		tProcess=running_Finished();

		//from running to ready
		tRProcess=running_Ready();

		//from running to Waiting Printer
		tWProcess=running_Waiting();

		//from IO Printer to ready
		tIOProcess=io_Ready();

		//from running to Waiting Disk
		tWDProcess=running_WaitingDisk();

		//from using Disk to ready
		tDProcess=disk_Ready();

		//Checks if the CPU is free to do the other activities
		if(runningList.isEmpty()){
			var hrWorked=true;

			//from waiting to IO
			waiting_IO();

			//from Waiting Disk to Disk
			waitingDisk_Disk();

			//from ready to running
			ready_Running();

			//from new to ready
			while(hrWorked)	//While to move more than one process per tick
				hrWorked=hold_Ready();
		}

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
		if(tWDProcess!==null)
			pcb.Remove(tWDProcess);
		if(tDProcess!==null)
			pcb.Remove(tDProcess);
}

function checkSystemState(){
	var processesSum = waitingPrinterSize + readySize;
	var actualProcessesSum = waitingPrinterList.length + readyList.length;
	if(waitingPrinterList.length > waitingPrinterSize*.6 || readyList.length > readySize*.6)
		crucialState=true;
	else if(waitingPrinterList.length < waitingPrinterSize*.4 && readyList.length < readySize*.4)
		crucialState=false;
}

function makeSwap() {

}

function running_Finished(){
	var dProcess=null;
	if(!runningList.isEmpty() && runningList.Top().isDone()){
			dProcess=runningList.Remove();
			dProcess.terminated=true;
			deleteFirstRow("running");
			addRowsFirst("finished", dProcess);
	}	
	return dProcess;
}

function running_Ready(){
		var eProcess=null, tProcess=null;
		if(!runningList.isEmpty() && quantum!==-1 && runningList.Top().cpuCounter>=quantum){

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
				addRowsFirst("finished", tProcess);
			}	

		}
		return tProcess;
}

function running_Waiting(){
	var eProcess=null, dProcess=null;
		if(!runningList.isEmpty() && runningList.Top().cpuTime!==0 && runningList.Top().ioTime!==runningList.Top().ioTimeNedded){
				
				if(runningList.Top().cpuTimeNedded===runningList.Top().cpuTime-1 && waitingPrinterList.isFull()){
					
					//delete the process
					dProcess=runningList.Remove();
					dProcess.terminated=true;
					deleteFirstRow("running");
					addRowsFirst("finished", dProcess);
				
				}
				else if(runningList.Top().cpuTimeNedded===runningList.Top().cpuTime - 1 ||  
						(Math.random()<.7 && !waitingPrinterList.isFull()) ){
					
					//Switch the process from running to waiting
					if(waitingPrinterList.isEmpty())
						waitingPrinterList.isLocked=true;
					eProcess=runningList.Remove();
					deleteFirstRow("running");
					waitingPrinterList.Push(eProcess);
					addRowsEnd("waitingprinter", eProcess);
					eProcess.cpuCounter = 0;
				}
			}
	return dProcess;
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

function waiting_IO(){
	var eProcess=null;
	if(ioList.isEmpty() && !waitingPrinterList.isEmpty())
		if(!waitingPrinterList.isLocked){
			eProcess=waitingPrinterList.Remove();
			deleteFirstRow("waitingprinter");
			ioList.Push(eProcess);
			addRowsEnd("ioprinter", eProcess);
		}
}


function io_Ready(){
	var eProcess=null, dProcess=null;
	if(!ioList.isEmpty())
		if(ioList.Top().ioTime===ioList.Top().ioTimeNedded){
			if(readyList.isFull()){
				dProcess=ioList.Remove();
				deleteFirstRow("ioprinter");
				dProcess.terminated=true;
				addRowsFirst("finished", dProcess);
			}
			else {
				eProcess=ioList.Remove();
				deleteFirstRow("ioprinter");
				readyList.Push(eProcess);
				addRowsEnd("ready", eProcess);
			}
		}
}

function waitingDisk_Disk() {

}

function disk_Ready(){

}

function running_WaitingDisk(){

}

function hold_Ready(){
	var nProcess=null;
	var actionMade=false;
	if(!crucialState)
		if(!readyList.isFull() && !holdList.isEmpty()){
			nProcess=holdList.Remove();
			readyList.Push(nProcess);
			deleteFirstRow("hold");
			addRowsEnd("ready", nProcess);
			actionMade=true;
		}
	return actionMade;
}

function creatingProcess(newProcess){

		if(newProcess!=null && !holdList.isFull()){
			processesNumber++;
			holdList.Push(newProcess);
			addRowsEnd("hold", newProcess);
			pcb.Push(newProcess);
			newRowPCB(newProcess);
		}
}

function updateLists(){
	holdList.UpdateProcess("waitingTime");
	readyList.UpdateProcess("waitingTime");
	runningList.UpdateProcess("cpuTime");
	runningList.UpdateProcess("cpuCounter");
	waitingPrinterList.UpdateProcess("waitingTime");
	if(waitingPrinterList.isLocked)
		waitingPrinterList.isLocked=false;
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
	var actualAction;
	for (var i = actions.length - 1; i >= 0; i--) {
		actualAction=actions[i];
		if(actualAction==0)
			cells[i].innerHTML=" - ";
		else 
			cells[i].innerHTML=actualAction;
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

function addRowsFirst(table, process){
	addRows(1, table, process);
}

function addRowsEnd(table, process){
	addRows(-1, table, process);
}

function addRows(index, table, process){
	var table=document.getElementById(table);
	var newRow=table.insertRow(index);
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

	holdList=null;
	readyList=null;
	runningList=null;
	waitingPrinterList=null;
	ioList=null;
	waitingDiskList=null;
	diskList=null;
	swapList=null;
	pcb=null;
	window.clearInterval(myVarTime);
	mode=3;
}

function clearAllTables(){
	var holdTable=document.getElementById("hold");
	var readyTable=document.getElementById("ready");
	var runningTable=document.getElementById("running");
	var finishedTable=document.getElementById("finished");
	var waitingTable=document.getElementById("waitingprinter");
	var ioTable=document.getElementById("ioprinter");
	var waitingDiskTable=document.getElementById("waitingdisk");
	var diskTable=document.getElementById("iodisk");
	var pcbTable=document.getElementById("pcb");
	var tapTable=document.getElementById("tap");
	var ramTable=document.getElementById("ramgrid");
	var swapTable=document.getElementById("swap");
	clearSingleTable(holdTable);
	clearSingleTable(readyTable);
	clearSingleTable(runningTable);
	clearSingleTable(finishedTable);
	clearSingleTable(waitingTable);
	clearSingleTable(ioTable);
	clearSingleTable(pcbTable);
	clearSingleTable(tapTable);
	clearSingleTable(ramTable);
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
				holdList = new ProcessesList(holdSize);
				readyList = new ProcessesList(readySize);
				waitingPrinterList = new ProcessesList(waitingPrinterSize);
				waitingDiskList = new ProcessesList(waitingDiskSize);
				ioList = new ProcessesList(1);
				diskList= new ProcessesList(1);
				runningList = new ProcessesList(1);
				tap = new TAP();
				swap=[];
				ramGrid=[]; 
			}
			else{
					holdList.changeSize(holdSize);
					readyList.changeSize(readySize);
					waitingPrinterList.changeSize(waitingPrinterSize);
					waitingDiskList.changeSize(waitingDiskSize);
			}
				document.getElementById("quantumNumber").innerHTML=quantum;
				myVarTime = setInterval(function () {myTimer()}, fastValues[fastness-1]);
				mode=1;
		}
	}
}
function fast() {
	if(mode!==1){
		fastness=1;
		document.getElementById("fast").className="btn btn-success";
		document.getElementById("normal").className="btn btn-default";
		document.getElementById("slow").className="btn btn-default";
	}
}

function normal(){
	if(mode!==1){
		fastness=2;
		document.getElementById("fast").className="btn btn-default";
		document.getElementById("normal").className="btn btn-success";
		document.getElementById("slow").className="btn btn-default";
	}
}

function slow(){
	if(mode!==1){
		fastness=3;
		document.getElementById("fast").className="btn btn-default";
		document.getElementById("normal").className="btn btn-default";
		document.getElementById("slow").className="btn btn-success";	
	}
}

function roundRobinButton(){
	if(mode!==1){
		algorithm=1;
		document.getElementById("round_robin").className="btn btn-success";
		document.getElementById("fcfs").className="btn btn-default";
	}
}

function fcfsButton(){
	if(mode!==1){
		algorithm=2;
		document.getElementById("round_robin").className="btn btn-default";
		document.getElementById("fcfs").className="btn btn-success";
	}
}

function oldest(){
	if(mode!==1){
		swapAlgorithm=1;
		document.getElementById("oldest_frame").className="btn btn-success";
		document.getElementById("least_used").className="btn btn-default";	
	}
}
function leastUsed(){
	if(mode!==1){
		swapAlgorithm=2;
		document.getElementById("oldest_frame").className="btn btn-default";
		document.getElementById("least_used").className="btn btn-success";
	}
}

function setRamSize(){

	var posFrameSize=Number(document.getElementById('frame').value);
	var list = document.getElementById("ram");
	list.options.length=0;
	var newOption;
	var total=posFrameSize*4;
	for(var c=4; total <=256 ; total = c *posFrameSize){
		c=c+4;
		if(total % 4 === 0){
			newOption=document.createElement("option");
			newOption.text=total;
			list.add(newOption,list[-1]);
		}
	}
}