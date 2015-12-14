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

	Find(id){
		var p=null;
		var position=-1;
		for (var i = this.processes.length - 1; i >= 0; i--) {
			if(this.processes[i].id==id)
				position=i;
		};

		if(position!==-1)
			p=this.processes[position];
		return p;
	}
} 