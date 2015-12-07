class Page{
	constructor(id,pageSpace, processID){
		this.id=id;
		this.size=pageSpace;
		this.time=0;
		this.use=0;
		this.processID=processID;
		this.location=0; //0=NL, 1=RAM, 2=DISK
	}
	getLocation(){
		var place; 
		if(this.location===0)
			place='NL'
		else if(this.location===1)
			place='RAM';
		else if(this.location===2)
			place='Disk'
		return place;
	}
}