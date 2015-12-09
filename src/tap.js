class TAP{

	constructor(memorySize, frameSize){
		this.activeProcess=null;
		//this.activePage=null;
		this.collection=[];
		this.ramGrid=[]; //Stores pages in ram
		this.fileSwap=[]; //Stores pages in Disk
		this.frameSize=frameSize;
		this.maxNumberOfPages=memorySize/4;///frameSize
		this.squaresPerPage=frameSize/4;//frameSize/this.maxNumberOfPages;
		this.totalNumberOfPages=Math.floor(memorySize/frameSize);
		this.length=0;
		this.InitializeRamGrid();
	}

	//Two things, 
	Add(Process, time){ 
		var squareToAdd=[];
		//if(this.collection.indexOf())
		this.collection.push(Process);
		Process.getActivePage().location=1;
		Process.getActivePage().time=time;
		this.ramGrid[this.findEmptySlot()]=Process.getActivePage();
		squareToAdd.push(this.transformPositionToIndex(this.length));
		squareToAdd.push(this.squaresPerPage);
		squareToAdd.push("P0 " + Process.id+"-"+Process.getActivePage().id);
		this.length++;
		return squareToAdd;
	}

	Swap(process){
		//Dont forget to update the locations,
		//{indexRG, squares, swapFrom, locationSwap}
			if(isRamFull()){ //If it will be a one swap

				if(this.ramGrid.indexOf(process.getActivePage())!==-1){ //A simple

				}
				else if (this.fileSwap.indexOf(process.getActivePage())!==-1)){ //

				}
				else {

				}
			}
			else { //A two way swap
				if(this.ramGrid.indexOf(process.getActivePage())===-1){

				}
				else if (this.fileSwap.indexOf(process.getActivePage())!==-1)){

				}
				else {
					
				}
			}
	}

	changeRamSize(){

	}

	isSwappingNedded(){
		return this.ramGrid.indexOf(this.activeProcess.getActivePage())===-1 ;
	}
	setActiveProcess(Process){
		this.activeProcess=Process;
	}

	InitializeRamGrid(){
		for (var i = this.totalNumberOfPages - 1; i >= 0; i--) {
			this.ramGrid.push(null);
		};
	}
	findEmptySlot(){
		var position=this.ramGrid.indexOf(null);
		return position;
	}

	AddSO(){
		var data=[];
		var pages=memorySize/frameSize/4;
		for (var i =  pages - 1; i >= 0; i--) {
			this.ramGrid[i]="SO";
			this.length++;
		};
		data.push(1);
		data.push(this.maxNumberOfPages/4);
		data.push("SO");
		return data;
	}

	isRamFull(){
		return this.maxNumberOfPages===this.length;
	}

	Delete(process){
		var index=this.collection.indexOf(process);
		if(index!==-1){
			this.collection.splice(index,1);
			this.length--;
		}
		return index+1;
	}

	DeleteFromRam(process){
		var indexes=[];
		for (var i = this.ramGrid.length - 1; i >= 0; i--) {
			if(this.ramGrid[i]!==null && this.ramGrid[i].processID===process.id){
				this.ramGrid[i]=null;
				indexes.push(this.transformPositionToIndex(i));
				indexes.push(this.squaresPerPage);
			}
		};
		return indexes;
	}

	DeleteFromSwap(process){
		var indexes=[];
		for (var i = this.fileSwap.length - 1; i >= 0; i--) {
			if(this.fileSwap[i].processID===process.id){
				this.fileSwap.splice(i, 1);
				indexes.push(i+1);
			}
		};
		return indexes;
	}

	getIndex(process){
		var position=this.collection.indexOf(process);
		return position;
	}

	getRamIndex(process){
		var position=this.ramGrid.indexOf(process.getActivePage());
		var index=(position)*this.squaresPerPage+1;
		var amountSquares=this.squaresPerPage;
		var data=[];
		data.push(index);
		data.push(amountSquares);
		return data;
	}

	getOldest(){
		return getRequiredPage("time");
	}

	getLeastUsed(){
		return getRequiredPage("use")
	}

	getRequiredPage(variable){
		var page;
		var position=-1, leastSomething=0;
		for (var i = this.ramGrid.length - 1; i >= 0; i--) {
			if(this.ramGrid[i]!==null && this.ramGrid[i][variable] <= leastSomething 
					&& this.ramGrid[i].processID!==this.activeProcess.id){
				leastSomething=this.ramGrid[i][variable];
				position=i;
			}
		};
		if(position===-1)
			page=null;
		else {
			page=ramGrid[position];//ramGrid.splice(position, 1);
			ramGrid[position]=null;
		}
		return page;
	}

	getInformation(process){
		return process.PrintRam();

	}
	transformPositionToIndex(index){
		return index*this.squaresPerPage+1
	}
}