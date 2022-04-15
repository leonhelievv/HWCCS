
//days of week drawings
const dayWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const  monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const hourBlock = 'ctx2.moveTo(40.433863, 44.461570);'+
	'ctx2.lineTo(95.812764, 44.461570);'+
	'ctx2.lineTo(95.812764, 99.367268);'+
	'ctx2.lineTo(40.433863, 99.367268);'

const clockFace = 'ctx2.moveTo(30.035559, 17.498096);'+
	'ctx2.bezierCurveTo(36.609038, 17.498096, 41.937896, 23.444993, 41.937896, 30.780863);'+
	'ctx2.bezierCurveTo(41.937896, 38.116733, 36.609038, 44.063630, 30.035559, 44.063630);'+
	'ctx2.bezierCurveTo(23.462080, 44.063630, 18.133222, 38.116733, 18.133222, 30.780863);'+
	'ctx2.bezierCurveTo(18.133222, 23.444993, 23.462080, 17.498096, 30.035559, 17.498096);'
	
const clockHands = 'ctx2.moveTo(24.973393, 26.675143);'+
	'ctx2.lineTo(29.963837, 30.816891);'+
	'ctx2.lineTo(37.154630, 25.686862);'
	
const flame = 'ctx2.moveTo(67.837288, 153.494900);'+
	'ctx2.bezierCurveTo(61.638178, 149.308580, 51.282712, 146.481740, 62.361318, 133.463040);'+
	'ctx2.bezierCurveTo(68.838048, 125.852100, 69.868788, 123.836500, 71.383988, 112.392420);'+
	'ctx2.bezierCurveTo(80.242208, 127.208150, 88.844958, 142.503510, 67.837288, 153.494900);'
	
const moon = 'ctx2.moveTo(82.986161, 51.499321);'+
	'ctx2.bezierCurveTo(96.622569, 87.643469, 61.543456, 89.825073, 52.400809, 82.216584);'+
	'ctx2.bezierCurveTo(65.068378, 81.431574, 78.270076, 74.220689, 82.986161, 51.499321);'
	
const sun = 'ctx2.moveTo(130.840060, 54.340523);'+
	'ctx2.bezierCurveTo(141.570649, 54.340523, 150.269511, 62.338364, 150.269511, 72.204201);'+
	'ctx2.bezierCurveTo(150.269511, 82.070038, 141.570649, 90.067879, 130.840060, 90.067879);'+
	'ctx2.bezierCurveTo(120.109471, 90.067879, 111.410609, 82.070038, 111.410609, 72.204201);'+
	'ctx2.bezierCurveTo(111.410609, 62.338364, 120.109471, 54.340523, 130.840060, 54.340523);'

//hour template

const hourTemplate = [
hourBlock, 			//0 'puzzelName',
'the hour',				//1
'the drawing array', //2 'Drawing of the square',
'the fill colour',		//3 the fill colour,
0,							//4 Txt X
20,					//5 Txt Y
"rgb('255, 255, 255')",		//6 'TxtClr',
'pzlX',					//7
'pzlY',					//8
'rgb(104, 111, 252)', //9 'fillClr',
"rgb(16, 41, 110)", //10 'lineClr',
"rgb(234, 252, 126)",//11 'highlightClr'
200, 						 //12 block width
292, 							//13 block height
'drawing array on top block',		//14
'fill colour',	//15
'drawing array on bottom block',	//16
'fill colour',	//17
false, 	//18 on/off state
'on state colour',	//19
'off state colour',	//20
'',	//21
'', 	//22
'Time', 	//23 text
'rgb(255,255,255)',	//24 fill
0,	//25 X
20	//26 Y
]


//these are the specifications for the hours menu 																														
const menuItemsSpecs = [
['00',
/*1*/hourTemplate, //template representing a day
/*2*/hourBlock, //the first item - drawing
/*3*/'day',
/*4*/'rgb(0,181,226)', //blue sky
/*5*/'sun',
/*6*/'rgb(252, 244, 0)',
/*7*/'flame',
/*8*/'rgb(255, 0, 0)',  //on state colour
/*9*/'rgb(81, 81, 81)'
],
['01',
/*1*/hourTemplate, 
/*2*/hourBlock,
/*3*/'night',
/*4*/'rgb(78,84,129)', //color of the 2 blocks dusc
/*5*/'moon',
/*6*/'rgb(240, 240, 240)',
/*7*/'flame',
/*8*/'rgb(255, 0, 0)', //on state colour
/*9*/'rgb(81, 81, 81)' //off state colour
]

] //end of puzzel specifications

//pre populate menuItemSpecs with drawing arrays
//make sun drawing at xy
var dx = makeDrawingArray(sun,1,1,'ctx2')
modToZero2(dx,'ctx2')
modToNew2(dx,24,40,'ctx2')
menuItemsSpecs[0][5] = dx;
//make flame drawing at xy
dx =  makeDrawingArray(flame,1,1,'ctx2');
modToZero2(dx,'ctx2')
modToNew2(dx,24,140,'ctx2')
menuItemsSpecs[0][7] = dx;
menuItemsSpecs[1][7] = dx;
//make moon drawing at xy
dx = makeDrawingArray(moon,1,1,'ctx2');
modToZero2(dx,'ctx2')
modToNew2(dx,40,40,'ctx2')
menuItemsSpecs[1][5] = dx;
dx = null

const dayBlock = 'ctx.moveTo(16.784092, 15.676511);'+
	'ctx.lineTo(158.530970, 15.698261);'+
	'ctx.lineTo(159.069830, 63.477795);'+
	'ctx.lineTo(16.367909, 65.148540);'
	
const monthBlock = 'ctx.moveTo(16.784092, 15.676511);'+
	'ctx.lineTo(158.530970, 15.698261);'+
	'ctx.lineTo(159.069830, 63.477795);'+
	'ctx.lineTo(16.367909, 65.148540);'
	
const okTick = 'ctx.moveTo(24.892508, 323.138690);'+
	'ctx.lineTo(32.969263, 315.061940);'+
	'ctx.bezierCurveTo(41.601369, 325.265580, 49.277234, 335.239320, 49.122773, 343.330580);'+
	'ctx.bezierCurveTo(73.372121, 313.909260, 97.588502, 300.428420, 121.813560, 282.754920);'+
	'ctx.lineTo(125.851950, 290.831680);'+
	'ctx.bezierCurveTo(93.959244, 312.426300, 68.021338, 335.565890, 45.084394, 359.484090);'+
	'ctx.bezierCurveTo(41.114146, 347.370540, 37.049739, 335.256950, 24.892508, 323.138690);'

const flame2 = 'ctx.moveTo(-50.562270, -86.045686);'+
	'ctx.bezierCurveTo(-37.805787, -27.237249, -90.781400, 9.487197, -83.980920, 49.714404);'+
	'ctx.bezierCurveTo(-79.197114, 78.012275, -31.864512, 75.886543, -18.572271, 52.887259);'+
	'ctx.bezierCurveTo(3.623871, 14.481755, -50.562270, -86.045686, -50.562270, -86.045686);'
