class Page{
	constructor(id,pageSpace, processID){
		this.id=id;
		this.size=pageSpace;
		this.Time=0;
		this.use=0;
		this.processID=processID;
		this.Place=0; //0=NL, 1=RAM, 2=DISK
		this.exactLocation;
	}
	getLocation(){
		var place; 
		if(this.Place==0)
			place='NL';
		else if(this.Place==1)
			place=this.exactLocation;
		else if(this.Place==2)
			place='Disk';
		return place;
	}
}