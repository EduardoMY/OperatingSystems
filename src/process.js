class Process{
	constructor(id, arrival, cpuTime, ioTime, diskTime, arrivalIO, framesSize,Space){
	
	this.id=id;
	this.arrivalIO=arrivalIO;
	this.cpuCounter=0;
	this.ioTime=0;
	this.cpuTime=0;
	this.waitingTime=0;
	this.terminated=false;
	this.arrival=arrival;
	this.cpuTimeNedded=cpuTime;
	this.ioTimeNedded=ioTime;
	this.space=Space;
	this.pages = this.getPages(framesSize); 
	this.activePage=0; //
	}
	
	getPages(framesSize){
		var example=[];
		var pagesAmount=Math.floor(this.space/framesSize);
		var page;
		if(this.space%framesSize!==0)
			pagesAmount+=1;

		for (var c=0; c<pagesAmount; c++){
			page=new Page(c, framesSize, this.id);
			example.push(page);
			}
		return example;
	}

	getActivePage(){
		return this.pages[this.activePage];
	}

	updateProcessed(){
	}

	updateInactivePages(){
		for (var i = this.pages.length - 1; i >= 0; i--){
			(this.pages[i])['time']++;
			//(this.pages[i])['use']++;
		}
	}
	updateActivePage(){
		
	}

	TotalTime(){
		return this.cpuTime + this.ioTime + this.waitingTime;
	}
	
	isDone (){
		return this.cpuTime === this.cpuTimeNedded; 
	}

	PrintRam(){
		//id
		var data=[];
		data.push(this.id);
		for (var i = 0; i < this.pages.length; i++) {
			data.push(i);
			data.push(this.pages[i].getLocation());
			data.push(this.pages[i].size);
		};
		//data.push(this.space);
		return data;
	}
	
	Print(){ //only gives an array with the data
		//format: ID|Arrival|CPU nedded| CPU Ussage| IO TIme | Time of IO| Arrival Printer| 
		//	Waiting Time |  Time in the System | Finish Time| Status
		var data=[];
		var status;
		data.push(this.id); //ID
		data.push(this.arrival); //Arival
		data.push(this.cpuTimeNedded); //CPU nedded
		data.push(this.cpuTime); //CPU Ussage
		data.push(this.space);//Size
		data.push(this.pages.length);//Frames
		data.push(this.ioTimeNedded); //IO TIme nedded
		data.push(this.ioTime); //IO Time Ussage
		data.push(this.arrivalIO); //
		data.push(this.waitingTime); //
		
		if(this.terminated){
			data.push(this.TotalTime()); // Time in the System
			data.push(this.TotalTime() + this.arrival); // Time the process ended
			
			if(this.isDone())
				status="Finished";
			else 
				status="Aborted";
			data.push((this.waitingTime/this.TotalTime()*100).toFixed(2));
		}
		else {
			data.push(0);
			data.push(0);
			data.push(0);
			status="InSystem";
		}
		data.push(status); //Status: In system,Finished, Aborted
		return data;
	}
}