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
	Add(Process){ 
		var squareToAdd=[];
		this.collection.push(Process);
		Process.getActivePage().location=1;
		this.ramGrid[this.length]=Process.getActivePage();
		squareToAdd.push((this.length)*this.squaresPerPage+1);
		squareToAdd.push(this.squaresPerPage);
		squareToAdd.push("P0 " + Process.id+"-"+Process.getActivePage().id);
		this.length++;
			//squareToAdd.push();
		return squareToAdd;
	}

	setActiveProcess(Process){
		this.activeProcess=Process;
	}

	InitializeRamGrid(){
		for (var i = this.totalNumberOfPages - 1; i >= 0; i--) {
			this.ramGrid.push(null);
		};
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

	changeRamSize(){

	}

	Delete(process){
		var index=this.processes.indexOf(process);
		if(index!==-1){
			this.collection.splice(index,1);
			this.length--;
		}
		return index;
	}

	getIndex(process){
		var position=this.collection.indexOf(process);
		return position;
	}
	getRamIndex(process){
		var position=this.ramGrid.indexOf(process.getActivePage());
		var index=(position-1)*this.squaresPerPage+1;
		var amountSquares=this.squaresPerPage;
		var data=[];
		data.push(index);
		data.push(amountSquares);
		return data;
	}

	getOldest(){
		var process;
		var position=-1, biggerTime=0;
		for (var i = ramGrid.length - 1; i >= 0; i--) {
			if(ramGrid[i].time > biggerTime){
				biggerTime=ramGrid[i].time;
				position=i;
			}

		};
		if(position===-1)
			process=null;
		else {
			process=ramGrid[position];//ramGrid.splice(position, 1);
			ramGrid[position]=null;
		}
		return process;
	}

	getLeastUsed(){

	}

	getInformation(process){
		return process.PrintRam();

	}
}