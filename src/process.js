class Process{
	constructor(id, arrival, cpuTime, ioTime, diskTime, arrivalIO, pageSpace){
	
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
	}
	
	TotalTime(){
		return this.cpuTime + this.ioTime + this.waitingTime;
	}
	
	isDone (){
		return this.cpuTime === this.cpuTimeNedded; 
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
		data.push(0);//Size
		data.push(4);//Frames
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