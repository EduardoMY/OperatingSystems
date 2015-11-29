class PCB {
	constructor(){
		this.processes=[];
		this.length=0;
	}

	Push(process){
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