const y2022 = []

var pushDataState = ['none',0,0,'']//dataGroup,segmentIndex,errorCount
var HWCCSclear = false

/*
day has array's of from and to hours range 0 - 23
[6,8],[15,19]
this mean's that the flame will be on from 6:00 to 8:00 and from 15:00 to 19:00
all other times flame is off

if there is a mask it could override the flame status
*/

function constructYearDb() {
	for (let i=0; i < 12; i++) {
		y2022.push([])
		//calc the number of days for year
		var noD = calcDaysInMonth(2022,i) 
		//populate 30 or 31 days
		for (let iday=0; iday < noD; iday++) {
			y2022[i].push([])
			//calc the day of the week
			var dt = (i+1)+','+(iday+1)+',2022'
			var dayWeek = calcDayWeek(dt)
			y2022[i][iday].push(dayWeek)
			y2022[i][iday].push(['min','max'])
			
		}
	}
}

constructYearDb()

var userTemplates = []
var offAllData = []
var schAndAssingments = []
var HWCData = []

var schToHWCD = []
var asgnToHWCD = []
var offAllToHWCD = []

//make a sample data string that will be received from the HWC device
//the year dataBase, offAll masks
//do init HWCS_data_base - construct the dataBase

function makeStringToHWCS() {
	//this was to generate the sample data
const strUserTempl = JSON.stringify(userTemplates);
const strSchAssign = JSON.stringify(schAndAssingments);
const strOffAll = JSON.stringify(offAllData);
console.log(strUserTempl)
console.log(strSchAssign)
console.log(strOffAll)
}


function makeDataFromHWCSjson() {
	
	//convert the userTemplate sample into an array and put in userTemplates	
	userTemplates = JSON.parse(userTemplatesSample)
	schAndAssingments = JSON.parse(assignmentsSample)
	offAllData = JSON.parse(offAllSample)
}

const userTemplatesSample = '[["1 an 4",[[1,1],[4,4]],[7,80]],["1 to 4",[[1,4]],[17,45]],["0 and 2 and 4",[[0,0],[2,2],[4,4]],[39,75]]]'


const assignmentsSample = '[["weekDays",0],["weekEnds",2]]'

const offAllSample = '[["dec-Holiday","2022-12-16","2023-01-07"],["july-park","2022-07-08","2022-07-15"]]'

//makeDataFromHWCSjson()


//when connection is established with device
	//receive the HWCD data
	// initialise the app with the data
		//get the schedule assignments
		//implement the assignments into y2022 data base

var schDataFromHWCS = ''
var assignedDataFromHWCS = ''
var offAllDataFromHWCS = ''
var HWCDataFromHWCS = ''
var schTmpDataFromHWCS = ''


function makeAppDataStructures() {
	//delete userTemplates
	userTemplates = []
	var segmentArray;
	var thisSegment;
	var theData;	
	//convert schDataFromHWCS into an array of data ,userTemplates
	//make array of schedules
	segmentArray = schDataFromHWCS.split(";");
	//how many schedules
	const noSch = segmentArray.length-1
	
	for (i = 0 ; i < noSch ; i++) {
		//do for all sch
		thisSegment = segmentArray[i]
		var fs1i = thisSegment.indexOf("/");
		var cln1i = thisSegment.indexOf(":");
		var fs2i = thisSegment.indexOf("/",fs1i+1);
		var fs3i = thisSegment.indexOf("/",fs2i+1);
		var nof = thisSegment.substring(0,cln1i);
		var ofn = thisSegment.substring(cln1i+1,fs1i);
		var thisName = thisSegment.substring(fs1i+1,fs2i);
		var thisData = thisSegment.substring(fs2i+1,fs3i);
		var thisTmpPair = thisSegment.substring(fs3i+1);
		theData = thisData.split(",");
		const dL = theData.length

		
		if (thisSegment[0] != 'none') {
			//the name is not 'none'
			//put name in the first user template
			userTemplates.push([thisName,[],[],[],[]])
		
			//loop put pairs in userTemplates
			for (di = 0; di < dL;di = di+2) {
				//not for '-1'
				var v1 = parseInt(theData[di])
				var v2 = parseInt(theData[(di+1)])
				if (v1 != -1 && v2 != -1) {
					//no -1 's
					//userTemplates[i][1].push([parseInt(theData[di]),parseInt(theData[(di+1)])])
					//userTemplates[i][1].push([,])				
					userTemplates[i][1].push([v1,v2])
				}
			}
			//put temprature pair into userTemplates[3][0]
			var cmaI = thisTmpPair.indexOf(",");
			var t1 = parseInt(thisTmpPair.substring(0,cmaI));
			var t2 = parseInt(thisTmpPair.substring(cmaI+1));
			userTemplates[i][2][0] = t1;
			userTemplates[i][2][1] = t2;
		}
	}
	
	//convert asgnDataFromHWCS into an array of data ,schAndAssingments
	//	1:6/asgnName1|0,0;2:6/asgnName2|1,2;
	schAndAssingments = []
	//make array of schedules
	segmentArray = assignedDataFromHWCS.split(";");
	//how many assignments
	const noAsgn = segmentArray.length-1
	
		for (i = 0 ; i < noAsgn ; i++) {
		//do for all segments
		thisSegment = segmentArray[i]
		var fs1i = thisSegment.indexOf("/");
		var cln1i = thisSegment.indexOf(":");
		var fs2i = thisSegment.indexOf("/",fs1i+1);
		var nof = thisSegment.substring(0,cln1i);
		var ofn = thisSegment.substring(cln1i+1,fs1i);
		var thisName = thisSegment.substring(fs1i+1,fs2i);
		var thisData = thisSegment.substring(fs2i+1);
		theData = thisData.split(",");
		const dL = theData.length
			
		//var theDataL = schData.length
		if (thisName != 'none') {
			//the asgn is not 'none'
			//put name of the schedule
			schAndAssingments.push([thisName])		
			//put the sch index in 
			//schAndAssingments[i].push(parseInt(theData[0]))
			schAndAssingments[i].push(parseInt(theData[1]))
		}	
	}	
	
	//--------------offAll------------------
	//convert offAllDataFromHWCS into an array of data ,userTemplates
	offAllData = []
	//make array of schedules
	segmentArray = offAllDataFromHWCS.split(";");
	//how many offAll's
	const noOffall = segmentArray.length-1
	
	for (i = 0 ; i < noOffall ; i++) {
		//do for all 
		thisSegment = segmentArray[i]
		var fs1i = thisSegment.indexOf("/");
		var cln1i = thisSegment.indexOf(":");
		var fs2i = thisSegment.indexOf("/",fs1i+1);
		var nof = thisSegment.substring(0,cln1i);
		var ofn = thisSegment.substring(cln1i+1,fs1i);
		var thisName = thisSegment.substring(fs1i+1,fs2i);
		var thisData = thisSegment.substring(fs2i+1);
		theData = thisData.split(",");
		const dL = theData.length
		if (thisName != 'none') {
			//offAll name is not 'none'
			offAllData.push([])	
			//put name in the first offAll
			offAllData[i][0] = thisName
			//put the date values in - should be 2 date values 
			offAllData[i][1] = theData[0]
			offAllData[i][2] = theData[1]
		}
	
	}
	
	//------------------HWCInfo---------------
	HWCData = []
	//thisSegment = HWCDataFromHWCS.split("/")	
	theData = HWCDataFromHWCS.split(",")
	const noHWCInfo = theData.length-1
	for (i = 0 ; i < noHWCInfo ; i++) {
		HWCData[i] = theData[i]
	}
	
	//--------------schTmp---------------
	//the sch tempratures are already done in sch
	
	//makeAppDataStructures - data comes from HWCCS - put this data into system
	schTmp = []
	//what does the string look like ??
	//1:6/Jesus/22,77;2:6/my Lord/0,0;3:6/the Christ of God/0,0;4:6/none/0,0;5:6/none/0,0;6:6/none/0,0;
	
	//write the temperature pairs into the apropriate schedule userTemplates[i][2][0] and [1]
	//??????

}


//if there are schedules? that are assigned - update the y2022 dataBase
function assignSchedules() {

	for (i = 0; i < schAndAssingments.length; i++) {
		//loop through the schAndassignments array - and update y2022 data
		//get the 'to what days' from the schAndAssingments
		var twd = schAndAssingments[i][0]
		//get this 'assigned user sch' out of the  userTemplates
		var schI = schAndAssingments[i][1]
		var aus = userTemplates[schI]
		if (twd == 'weekDays') { 
			//'to what days is weekdays
			for (iM = 0; iM < 12; iM++) {
				var dIm = y2022[iM].length
				//loop through all months
				for (iD = 0; iD < dIm; iD++) {
					if (y2022[iM][iD][0] > 0 &&  y2022[iM][iD][0] < 6) {
						//the day is a week day
						//loop throug all days in month, if week day - replace sch array with thisSch
						y2022[iM][iD][1] = aus[1].slice(0)
						//replace the name
						y2022[iM][iD][2] = aus[0]
						//replace min-max
						y2022[iM][iD][3] = aus[2].slice(0)
					}
				}
			}
		} else if (twd == 'weekEnds') {
			//'to what days is weekends'
			for (iM = 0; iM < 12; iM++) {
				var dIm = y2022[iM].length
				//loop through all months
				for (iD = 0; iD < dIm; iD++) {
					if (y2022[iM][iD][0] == 0 ||  y2022[iM][iD][0] == 6) {
						//it is weekend loop throug all days in month,- replace sch array with thisSch
						y2022[iM][iD][1] = aus[1].slice(0)
						//replace the name
						y2022[iM][iD][2] = aus[0]
						//replace min-max
						y2022[iM][iD][3] = aus[2].slice(0)
					}
				}
			}
		} else if (twd == '') {
			//future use
		}
	}
}

function buildUserSchCards() {
	if (schAndAssingments.length != 0) {
		//there are schedules assigned
		//first build the userSch GUI - make new GUI with user Templates
		const uTl = userTemplates.length
		for (uTi = 0; uTi < uTl; uTi++) {
			addScheduleGui(uTi)
		}
	}
}
