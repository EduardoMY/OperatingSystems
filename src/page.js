class Page{
	constructor(id,pageSpace, processID){
		this.id=id;
		this.size=pageSpace;
		this.time=0;
		this.use=0;
		this.processID=processID;
		this.location=0; //0=NL, 1=RAM, 2=DISK
	}
}