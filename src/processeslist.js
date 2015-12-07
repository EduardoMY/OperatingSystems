class ProcessesList {

	constructor (maxProcessesList) {
	this.maxProcessesList=maxProcessesList;
	this.processes=[];
	this.length=0;
	this.isLocked=false;
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

	Last(){
		if(this.length!==0)
			return this.processes[length-1];
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

	pagesInactive(){
		for (var i = this.processes.length - 1; i >= 0; i--) {
			this.processes[i].updateInactivePages();
		};
	}

	pageActive(){
		for (var i = this.processes.length - 1; i >= 0; i--) {
			this.processes[i].updateActivePage();
		};
	}
}