	var time=0;
	var processAmount=0;
	var mode=0; //1=play, 2=pause, 3=stop
	var fast=[100,1500,3000];
	window.alert(11);

var myVar=setInterval(function () {myTimer()}, fast[0]);

function myTimer() {
	if(mode==0 || mode==2 || mode==3)
		return;
	
	if(!validateValues())
		simulation();
	else 
		mode=0;
}

function validateValues(){
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
	if(mode==3)
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
	if(mode==2)
		return;
	mode=2;
}

function playFunction(){
	mode=1;
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