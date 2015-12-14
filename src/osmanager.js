var time=0; //Clock counter
var processesNumber=1; //Number of processes been created
var mode = 0; //1=play, 2=pause, 3=stop
var fastness = 2; //1=fast, 2=normal, 3=slow
var quantum = 0; //The quantum of the machine
var probability = 0; //The probability to create a process
var printerProbability = 0; //The probability of a process to require IO
var switchingPageProbability = 0; //
var averageIOTime = 0; //
var averageCPUTime = 0; //
var averageDiskTime = 0; //
var memorySize = 0; //
var frameSize = 0; //
var holdSize = 0, //
	readySize = 0, // 
	waitingPrinterSize = 0, //
	waitingDiskSize = 0; //
var algorithm = 1; //1=round robin, 2=fcfs
var swapAlgorithm = 1; //1=Oldest, 2=least used
var fastValues=[100,1500,2000]; //Fast, normal, slow times intervals
var myVarTime =null; //Stores the timers
var holdList = null; //
var readyList = null; //
var runningList = null; //
var waitingPrinterList = null; //
var waitingDiskList = null;
var ioList = null; //
var diskList = null; //
var pcb = null; //
var tap = null;//
var swapNow = false; //Seems good
var activeTapCell=null;

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
	
	// Evaluate the size of Waiting
	isCorrect = isCorrect && evaluateValue(10, "waitingdisksize", 1, 100);

	//frame,ram
	frameSize=Number(document.getElementById("frame").value);
	memorySize=Number(document.getElementById("ram").value);

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

function getIOTime(){
		var df = Math.floor(Math.random() * averageIOTime / 4);
		var multiplier, ioNumber=0;
		var localProbability;
		//To decide if the process will use the IO or not.
		localProbability = Math.floor(Math.random()  * 100) + 1;
		if( localProbability > printerProbability){
			return 0;
		}

		if(Math.random() < 0.5)
			multiplier=-1;
		else multiplier=1;
		
		ioNumber = averageIOTime + df * multiplier;
		if(ioNumber<=0)
			ioNumber = averageIOTime - df * multiplier;

		if(ioNumber<=0)
			return 1;
		else 
			return ioNumber;
}

function getDiskTime(){
	var df = Math.floor(Math.random() * averageDiskTime / 4);
	var multiplier, diskNumber;

	if(Math.random() < 0.5)
		multiplier=-1;
	else multiplier=1;
		
	diskNumber = averageDiskTime + df * multiplier;
	if(diskNumber<=0)
		diskNumber = averageDiskTime - df * multiplier;

	if(diskNumber<=0)
		return 1;
	else 
		return diskNumber;
}

function calculateCPUClockForIO(cpu){
	var ioClock=Math.floor(cpu * Math.random());

	if(ioClock>=cpu)
		ioClock=cpu-1;
	else if(ioClock<=1)
		ioClock=2;
	return ioClock;
}

function calculateSpace(){
	var ram=Math.floor(240*Math.random()+16);
	if(ram<=16)
		ram=16;
	else if(ram>=256)
		ram=256;
	return ram;
}

//IO mayor a uno menor que el uso de CPU
function simulation(){
	var newProcess=null;
	var actualProbability=Math.floor(Math.random() * 100)+1;
	var processCPU;
	var processIO;
	var processDisk;
	var clockForIO;
	var ramSpace;

	time++;
	document.getElementById("timer").innerHTML=time;

	if(actualProbability<=probability){
		//id, arrival, cpuTime, ioTime, diskTime, arrivalIO, pageSpace
		processCPU=getCPUTime();
		processIO=getIOTime();
		processDisk=getDiskTime();

		if(processIO===0)		
			clockForIO=0;
		else 
			clockForIO=calculateCPUClockForIO(processCPU);
		
		ramSpace=calculateSpace();

		newProcess = new Process(processesNumber, time, processCPU, processIO, processDisk, clockForIO, frameSize,ramSpace);
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
		
		var tProcess=null; 
		var	tRProcess=null; 
		var	tIOProcess=null; 
		var	tWProcess=null; 
		var	tDProcess=null;
		var	tWDProcess=null;

		var canMoveToRunning=true;

		/* Table of actions (in order):
			Free CPU
			Free Printer
			From Ready to Running
			From Hold To Ready
			Making new Processes
		*/

		//from running to finished
		tProcess=running_Finished();

		//from running to Waiting Printer
		tWProcess=running_Waiting();
		
		if(readyList.isEmpty())
			canMoveToRunning=false;

		//from running to ready
		tRProcess=running_Ready();

		//if(read)
		
		//from running to Waiting Disk
		tWDProcess=running_WaitingDisk();

		//from IO Printer to ready
		tIOProcess=io_Ready();

		//from using Disk to ready
		tDProcess=disk_Ready();

		//Checks if the CPU is free to do the other activities
		if(runningList.isEmpty()){
			var hrWorked=true;

			//from waiting to IO
			waiting_IO();

			//from Waiting Disk to Disk
			waitingDisk_Disk();

			if(canMoveToRunning)
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
		//checkSystemState();

		if(tProcess!==null){
			pcb.Remove(tProcess);
			deleteFromRam(tProcess);
		}
		if(tRProcess!==null){
			pcb.Remove(tRProcess);
			deleteFromRam(tRProcess);
		}
		if(tIOProcess!==null){
			pcb.Remove(tIOProcess);
			deleteFromRam(tIOProcess);
		}
		if(tWProcess!==null){
			pcb.Remove(tWProcess);
			deleteFromRam(tWProcess);
		}
		if(tWDProcess!==null){
			pcb.Remove(tWDProcess);
			deleteFromRam(tWDProcess);
		}
		if(tDProcess!==null){
			pcb.Remove(tDProcess);
			deleteFromRam(tDProcess);
		}
}

function running_Finished(){
	var dProcess=null;
	if(!runningList.isEmpty() && runningList.Top().isDone()){
			dProcess=runningList.Remove();
			dProcess.terminated=true;
			deleteFirstRow("running");
			addRowsFirst("finished", dProcess);
			//paintLastActivePage();
	}	
	return dProcess;
}

function running_Ready(){
		var eProcess=null, tProcess=null;
		//alert(quantum);
		if(!runningList.isEmpty() && quantum!==-1 && runningList.Top().cpuCounter>=quantum){
			
			if(!readyList.isFull()){
				if(readyList.isEmpty())
					runningList.isBlocked=true;
				eProcess = runningList.Remove();
				eProcess.cpuCounter=0;
				deleteFirstRow("running");
				readyList.Push(eProcess);
				addRowsEnd("ready", eProcess);
				paintLastActivePage();

			}

			//from running to finished, in case 
			else {
				tProcess=runningList.Remove();
				deleteFirstRow("running");
				tProcess.terminated=true;
				addRowsFirst("finished", tProcess);
				paintLastActivePage();
			}	
		}
		return tProcess;
}

function running_Waiting(){
	var eProcess=null, dProcess=null;
		if(!runningList.isEmpty() && runningList.Top().arrivalIO!==0 &&
				runningList.Top().arrivalIO===runningList.Top().cpuTime){
				
				if(waitingPrinterList.isFull()){
					//delete the process
					dProcess=runningList.Remove();
					dProcess.terminated=true;
					deleteFirstRow("running");
					addRowsFirst("finished", dProcess);
					paintLastActivePage();
				}
				else {
					//Switch the process from running to waiting
					if(waitingPrinterList.isEmpty())
						waitingPrinterList.isLocked=true;
					eProcess=runningList.Remove();
					deleteFirstRow("running");
					waitingPrinterList.Push(eProcess);
					addRowsEnd("waitingprinter", eProcess);
					eProcess.cpuCounter = 0;
					paintLastActivePage();
				}
			}
	return dProcess;
}

function ready_Running(){
	var eProcess=null;
		if(!readyList.isEmpty() && !runningList.isFull() && !runningList.isBlocked){
			eProcess=readyList.Remove();
			tap.setActiveProcess(eProcess);
			runningList.Push(eProcess);
			deleteFirstRow("ready");
			addRowsEnd("running", eProcess);
			if(runningList.Top().getActivePage.Place!==1){
				runningList.isBlocked=true;
				swapNow=true;
			}
			else 
				paintActivePage(eProcess);
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
		return dProcess;
}

function running_WaitingDisk(){
	var eProcess=null, tProcess=null;
	var actualProbability=Math.floor(Math.random() * 100)+1;
	var wasPageChanged=false;
	var isSwappingNedded=false;

		if(!runningList.isEmpty()){
			if(swapNow){
				wasPageChanged=true;
				isSwappingNedded=tap.isSwappingNedded(runningList.Top());
				swapNow=false;
			}
			else if(actualProbability<switchingPageProbability){
					//paintActivePage(runningList.Top(), false);
					wasPageChanged=runningList.Top().setOtherActivePage();
					isSwappingNedded=tap.isSwappingNedded(runningList.Top());
			}

			if(wasPageChanged && isSwappingNedded){
				if(waitingDiskList.isFull()){
					//delete the process
					tProcess=runningList.Remove();
					tProcess.terminated = true;
					deleteFirstRow("running");
					addRowsFirst("finished", tProcess);
					paintLastActivePage();
				}
			else {
				//Switch the process from running to waiting
				if(waitingDiskList.isEmpty())
					waitingDiskList.isLocked=true;
				eProcess=runningList.Remove();
				deleteFirstRow("running");
				waitingDiskList.Push(eProcess);
				addRowsEnd("waitingdisk", eProcess);
				eProcess.cpuCounter = 0;
				}
			}
			else if (wasPageChanged && !isSwappingNedded){
				paintLastActivePage();
				paintActivePage(runningList.Top());
			}
			}
	return tProcess;
}

function waitingDisk_Disk() {
	var eProcess=null;
	if(diskList.isEmpty() && !waitingDiskList.isEmpty())
		if(!waitingDiskList.isLocked){
			eProcess=waitingDiskList.Remove();
			deleteFirstRow("waitingdisk");
			diskList.Push(eProcess);
			addRowsEnd("iodisk", eProcess);
		}
}

function disk_Ready(){
	var eProcess=null, tProcess=null;
	if(!diskList.isEmpty())
		if(diskList.Top().diskTime>=diskList.Top().diskTimeNedded){
			if(readyList.isFull()){
				tProcess=diskList.Remove();
				deleteFirstRow("iodisk");
				tProcess.terminated=true;
				addRowsFirst("finished", tProcess);
			}
			else {
				eProcess=diskList.Remove();
				deleteFirstRow("iodisk");
				readyList.Push(eProcess);
				addRowsEnd("ready", eProcess);
				makeSwap(eProcess);
			}
		}
	return tProcess;
}

function hold_Ready(){
	var nProcess=null;
	var actionMade=false;
	//if(!crucialState)
		if(!readyList.isFull() && !holdList.isEmpty()){
			nProcess=holdList.Remove();
			readyList.Push(nProcess);
			loadToRAM(nProcess);
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
	var index, data, process;

	holdList.UpdateProcess("waitingTime");
	readyList.UpdateProcess("waitingTime");
	if(!runningList.isBlocked){ //indicates if the corresponding page is in RAM or not
		runningList.UpdateProcess("cpuTime");
		runningList.UpdateProcess("cpuCounter");
	}
	waitingPrinterList.UpdateProcess("waitingTime");
	waitingDiskList.UpdateProcess("waitingTime");
	
	if(waitingPrinterList.isLocked)
		waitingPrinterList.isLocked=false;
	if(waitingDiskList.isLocked)
		waitingDiskList.isLocked=false;

	ioList.UpdateProcess("ioTime");
	diskList.UpdateProcess("diskTime");
	
	if(!runningList.isEmpty() && !runningList.isBlocked){
		process=runningList.Top();
		process.getActivePage().use++;
		index=tap.getIndex(process)+1;
		data=tap.getInformation(process);
		updateTAP(index, data);	
	}
	if(runningList.isEmpty() || runningList.isBlocked){
		paintLastActivePage();	
	}
	runningList.isBlocked=false;
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
	deleteRows(1, table);
}

function deleteLastRow(table){
	deleteRows(-1, table);
}

function deleteRows(index, table){
	var tempTable=document.getElementById(table);
	tempTable.deleteRow(index);	
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
	pcb=null;
	tap=null;
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
	var tapTable;//=document.getElementById("tap1");
	var swapTable=document.getElementById("swap");

	clearSingleTable(holdTable);
	clearSingleTable(readyTable);
	clearSingleTable(runningTable);
	clearSingleTable(finishedTable);
	clearSingleTable(waitingTable);
	clearSingleTable(waitingDiskTable);
	clearSingleTable(diskTable);
	clearSingleTable(ioTable);
	clearSingleTable(pcbTable);
	startGrip(false);//clearSingleTable(ramTable); 
	clearSingleTable(swapTable);

	for (var i = 1; i <=8 ; i++) {
		tapTable=document.getElementById("tap"+i);
		clearSingleTable(tapTable);
	};
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
				tap = new TAP(memorySize, frameSize); //memorySize, frameSize
				startGrip(true);
				//(processesNumber, time, processCPU, processIO, processDisk, clockForIO, ramSpace);
				loadSO();
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
	for(var c=4; total <= 256 ; total = c *posFrameSize){
		c=c+4;
		if(total % 4 === 0){
			newOption=document.createElement("option");
			newOption.text=total;
			list.add(newOption,list[-1]);
		}
	}
}

function loadSO(){
	var data=tap.AddSO();
	loadToGrid(data);
}

function loadToRAM(process){
	if(tap.isRamFull()){
		tap.collection.push(process) //
		makeSwap(process);
	}
	else {
		var data=tap.Add(process, time);
		loadToTap(process);
		loadToGrid(data);
	}
}

function makeSwap(process) {
	//
	if(tap.isRamFull())
		changingTwoPages(process);
	else changingOnePage(process);

}

function changingTwoPages(process){
	var data;
	data=tap.Swap(process, swapAlgorithm, time);

	if(data[3]===-1){
		loadToGrid(data);
		loadToTap(process);
		loadToTap(pcb.Find(data[5]));
		addRowFileSwap(data[4]);
	}
	else{
		loadToGrid(data);
		loadToTap(process);
		loadToTap(pcb.Find(data[5]));
		deleteRowFileSwap(data[3]);
		addRowFileSwap(data[4]);
	}
}

//
function changingOnePage(process){
	var data=tap.Swap(process, swapAlgorithm, time);
	//console.log('OnePage');
	if(data[3]===-1){
		loadToGrid(data);
		loadToTap(process);
	}
	else{
		loadToGrid(data);
		loadToTap(process);
		deleteRowFileSwap(data[3]);
	}
}

function deleteRowFileSwap(index){
	document.getElementById("swap").deleteRow(index);
}

function addRowFileSwap(name){
	document.getElementById("swap").insertRow(-1).insertCell(0).innerHTML=name;
}

function deleteFromRam(process){
	var index = tap.Delete(process);

	var positionsSwap=tap.DeleteFromSwap(process); //index, squares
	var positionsRam=tap.DeleteFromRam(process); //indexes
	
	//Erase from tap
	deleteFromTAP(index);

	//Erase the positionSwap
	deleteFromSwap(positionsSwap);
	
	//Erase the content of Ram Grid
	for (var i = positionsRam.length / 2; i >= 0; i-=2) {
		var data=[];
		data.push(positionsRam[i-1]);
		data.push(positionsRam[i]);
		data.push('*');
		loadToGrid(data);
	};
}

function deleteFromGrid(index, amount){
	var gridTable=document.getElementById("ramgrid");
	var rc=indexToCoordinates(index);
	
}

function deleteFromSwap(indexes){
	var swapTable=document.getElementById("swap");

	for (var i = indexes.length - 1; i >= 0; i--) {
		swapTable.deleteRow(indexes[i]);
	};

}

function deleteFromTAP(index){
	var table;
	for(var i=1; i<=8;i++){
		table=document.getElementById("tap"+i);
		table.deleteRow(index);
	}
}

function loadToGrid(data){
	var rows=document.getElementById("ramgrid").rows;
	var rc=indexToCoordinates(data[0]);
	var row, cell;
	var count=0;
	//Index, number of pages
	if(data[0]<=0)
		return ;
	for (var i = rc[0]; i <= rows.length - 1 && count!==data[1]; i++) {
		row=rows[i];
		for (var c = 1; c <= rows.length-1 && count!==data[1]; c++) {
			if(c>=rc[1] || i>rc[0]) {
				cell=row.cells[c];
				cell.style.backgroundColor="#FFFFFF"
				cell.innerHTML=data[2];
				count++;
			}
		};
	};
}



function loadToTap(process){
	var data, index;
	if(process!==null){
		index=tap.getIndex(process);
		index++;
		data=tap.getInformation(process);
		updateTAP(index, data);
	}	
}

function updateTAP(index, data){
	var tapTable, currentRow, currentCells, total=1;
	tapTable=document.getElementById("tap1");
	
	if(index<tapTable.rows.length){
		for(var c=1; c<=8; c++){
			tapTable=document.getElementById("tap"+c);
			currentRow=tapTable.rows[index];
			currentCells=currentRow.cells;
			currentCells[0].innerHTML=data[0];
			
			for (var i = 1; i <=24 && total !== data.length; i+=3) {
				currentCells[i].innerHTML=data[total];
				currentCells[i+1].innerHTML=data[total+1];
				currentCells[i+2].innerHTML=data[total+2];
				total+=3;
			};

		};

	}
	else {//Adding a new Row
		for(var c=1; c<=8; c++){
			tapTable=document.getElementById("tap"+c);
			currentRow=tapTable.insertRow(-1);
			currentRow.insertCell(0).innerHTML=data[0]

			for (var i = 1; i <=24 &&  total !== data.length; i+=3) {
				currentRow.insertCell(i).innerHTML=data[i];
				currentRow.insertCell(i+1).innerHTML=data[i+1];
				currentRow.insertCell(i+2).innerHTML=data[i+2];
				total+=3;
			};
		};
	}
}

function paintActivePage(activeProcess){
	var gridTable=document.getElementById("ramgrid");
	var tapTable;
	var tapNumber=Math.floor(activeProcess.activePage / 8) + 1;
	var index=tap.getIndex(activeProcess) + 1;	
	var indexCell = (activeProcess.activePage % 8) * 3 + 1;
	var color;
	var data=tap.getRamIndex(activeProcess);
	var rc=indexToCoordinates(data[0]);
	var cells, rows;
	var count=0;

	tapTable=document.getElementById("tap"+tapNumber);
	rows=gridTable.rows;
	color="#41F34A";//"#C8C8C8";

	paintLastActivePage(data[1]);
	if(data[0]>0){ //Validates de Data

			//Paints all the pages in RAM Grid
			for (var i = rc[0]; i <= rows.length - 1 && count!==data[1]; i++) {
				cells=rows[i].cells;
				for (var c = 1; c <= rows.length-1 && count!==data[1]; c++) {
					if(rc[0] < i || rc[1]<=c){
						cells[c].style.backgroundColor=color;
						count++;
					}
				};


			};

			//Paints the page in TAP
			tapTable.rows[index].cells[indexCell].style.backgroundColor=color;

			activeTapCell=tapTable.rows[index].cells[indexCell];	
		} 
}

function paintLastActivePage(){
	var color;

	color="#FFFFFF";

	if(activeTapCell!==null){
		activeTapCell.style.backgroundColor=color;
		clearGridColor(color);
	}
}

function clearGridColor(color){
	var gridTable=document.getElementById("ramgrid");
	var cells, rows;
	var slots= memorySize/4;
	rows=gridTable.rows;
		for (var i = 1; i <= rows.length - 1; i++) {
		cells=rows[i].cells;
		for (var c = 1; c <= rows.length-1; c++) {
				cells[c].style.backgroundColor=color;
				if((i-1)*8+c>slots)
					cells[c].style.backgroundColor="#C8C8C8";
		};
	};
}

function indexToCoordinates(index){
	var coor=[];
	coor.push(Math.floor(index/8)+1); //r
	coor.push(index%8);  //c
	return coor;
}

function startGrip(firstTime){//pcbRows[id].cells;

	var rows=document.getElementById("ramgrid").rows;
	var row, cell;
	var slots=memorySize/4;

	if(firstTime){
		for (var i = 1; i <= rows.length - 1; i++) {
			row=rows[i];
			for (var c = 1; c <= rows.length-1; c++) {
				cell=row.insertCell(-1);
				
				if((i-1)*8+c>slots)
					cell.style.backgroundColor="#C8C8C8";
			};
		};
	}
	else{
			for (var i = 1; i <= rows.length - 1; i++) {
				row=rows[i];
				for (var c = 1; c <= rows.length-1; c++) {
					if(row.cells.length!=1)
						cell=row.deleteCell(-1);
				};
		};
	}
}