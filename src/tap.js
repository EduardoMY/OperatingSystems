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
		var position=this.findEmptySlot() 
		var realPositionInGrid = this.transformPositionToIndex(position);
		//if(this.collection.indexOf())
		this.collection.push(Process);
		Process.getActivePage().Place=1;
		Process.getActivePage().exactLocation = this.getCoordenates(realPositionInGrid);
		Process.getActivePage().Time=time;
		this.ramGrid[position]=Process.getActivePage();
		squareToAdd.push(realPositionInGrid);
		squareToAdd.push(this.squaresPerPage);
		squareToAdd.push("P0" + Process.id+"-"+Process.getActivePage().id);
		this.length++;
		return squareToAdd;
	}

	Swap(process, algorithm, time){
		//Dont forget to update the locations,
		//{indexGrid, squares,title ,deletesFromSwap }
		var data=[];
		var sPage;
		var index;
		var positionRam;
		var realPositionInGrid;
		var positionSwap;

		positionSwap=this.fileSwap.indexOf(process.getActivePage());
		
			if(!this.isRamFull()){ //If it will be a one swap
				if (positionSwap!==-1){ //Page in Swap
					positionRam=this.findEmptySlot();
					realPositionInGrid = this.transformPositionToIndex(positionRam);
					this.fileSwap.splice(positionSwap,1); //Deletes the item from Swap
					this.ramGrid[positionRam]=process.getActivePage(); //Loads the item to Ram again
					process.getActivePage().Place=1;
					process.getActivePage().Time=time;
					process.getActivePage().exactLocation = this.getCoordenates(realPositionInGrid);
					data.push(realPositionInGrid);//
					data.push(this.squaresPerPage);//
					data.push("P0"+process.id+"-"+process.getActivePage().id);
					data.push(positionSwap+1);
					this.length++;
				}
				else { //Page not loaded... yet
					//console.log("Aqui");
					positionRam=this.findEmptySlot();
					//console.log(positionRam);
					realPositionInGrid=this.transformPositionToIndex(positionRam);
					this.ramGrid[positionRam]=process.getActivePage(); //Loads the item to Ram again
					process.getActivePage().Place=1;
					process.getActivePage().exactLocation = this.getCoordenates(realPositionInGrid);
					process.getActivePage().Time=time;
					data.push(realPositionInGrid);//
					data.push(this.squaresPerPage);//
					data.push("P0"+process.id+"-"+process.getActivePage().id);
					data.push(-1);
					this.length++;
				}
			}
			else { //A two way swap

				if(algorithm===1)
					sPage=this.getOldest();
				else 
					sPage=this.getLeastUsed();

				if (positionSwap !== -1){ //Two way swapping, a page from grid to file and viceversa

					positionRam = this.ramGrid.indexOf(null); //Gets the position of the process
					realPositionInGrid=this.transformPositionToIndex(positionRam);
					this.fileSwap.splice(positionSwap, 1); //Deletes the item from Swap
					this.ramGrid[positionRam] = process.getActivePage(); //Loads the item to Ram again
					this.fileSwap.push(sPage); //Loads the content from Ram to Files
					process.getActivePage().Place = 1; //Changes location
					process.getActivePage().exactLocation = this.getCoordenates(realPositionInGrid);
					process.getActivePage().Time=time;
					sPage.Place = 2; //Changes location
					sPage.Time=0;
					data.push(realPositionInGrid); //
					data.push(this.squaresPerPage); //
					data.push("P0"+process.id+"-"+process.getActivePage().id);
					data.push(positionSwap+1);
					data.push("P0"+sPage.processID+"-"+sPage.id);
					data.push(sPage.processID);
				}
				else { //A page to grid and the old page to file
					positionRam = this.ramGrid.indexOf(null); //Gets the position of the process
					realPositionInGrid=this.transformPositionToIndex(positionRam);
					this.ramGrid[positionRam] = process.getActivePage(); //Loads the item to Ram again
					this.fileSwap.push(sPage); //Loads the content from Ram to Files
					process.getActivePage().Place = 1; //Changes location
					process.getActivePage().exactLocation = this.getCoordenates(realPositionInGrid);
					process.getActivePage().Time = time;
					sPage.Place = 2; //Changes location
					sPage.Time=0;
					data.push(realPositionInGrid); //
					data.push(this.squaresPerPage); //
					data.push("P0"+process.id+"-"+process.getActivePage().id);
					data.push(-1);
					data.push("P0"+sPage.processID+"-"+sPage.id);
					data.push(sPage.processID);
				}
			}
			return data;
	}

	changeRamSize(){

	}

	isSwappingNedded(activeProcess){
		return this.ramGrid.indexOf(activeProcess.getActivePage())===-1 ;
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
		return this.totalNumberOfPages===this.length;
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
			if(this.fileSwap[i].processID==process.id){
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
		return this.getRequiredPage("Time");
	}

	getLeastUsed(){
		return this.getRequiredPage("use")
	}

	getRequiredPage(variable){
		var page;
		var position=-1, leastSomething=-1;
		for (var i = this.ramGrid.length - 1; i >= 0; i--) {
			if(this.ramGrid[i]!==null && this.ramGrid[i]!=="SO"){
				if(leastSomething===-1 ||(this.ramGrid[i][variable] <= leastSomething 
					&& this.ramGrid[i].processID!==this.activeProcess.id)){
					leastSomething=this.ramGrid[i][variable];
					position=i;					
				}

			}
		};
		if(position===-1)
			page=null;
		else {
			page=this.ramGrid[position];//ramGrid.splice(position, 1);
			this.ramGrid[position]=null;
		}
		return page;
	}

	getInformation(process){
		return process.PrintRam();
	}

	getCoordenates(index){
		var letters =['A','B','C', 'D', 'E', 'F', 'G', 'H'];
		var realPositionInGrid = index;
		return letters[(realPositionInGrid-1)%8] + (Math.floor((realPositionInGrid) / 8)+1); 
	}

	transformPositionToIndex(index){
		return index*this.squaresPerPage+1
	}
}