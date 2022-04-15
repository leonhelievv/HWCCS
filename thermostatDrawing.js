const canvasDial = document.getElementById('canvasDial');
const ctx = canvasDial.getContext('2d');

segmentsFillStyles = ['rgb(0, 213, 218)','rgb(0, 213, 143)','rgb(248, 213, 87)','rgb(248, 140, 87)','rgb(248, 11, 87)'];
	
const face = 'ctx.moveTo(-8.863371, 594.271370);'+
	'ctx.bezierCurveTo(126.304840, 179.649750, 626.232150, 489.311230, 363.399170, 809.646830);'+
	'ctx.lineTo(456.464810, 895.054340);'+
	'ctx.bezierCurveTo(620.798890, 741.408290, 589.626260, 500.187640, 466.414250, 394.490970);'+
	'ctx.bezierCurveTo(316.817740, 266.160620, 38.377293, 296.672490, -8.863371, 594.271370);'

// Create gradient for dial face
const theFaceFill = ctx.createLinearGradient(-169,447,152,809); // x large
theFaceFill.addColorStop(0, 'rgb(0, 255, 255)');
theFaceFill.addColorStop(0.05, 'rgb(0, 255, 0)');
theFaceFill.addColorStop(0.4, 'rgb(255, 255, 0)');
theFaceFill.addColorStop(0.8, 'rgb(255, 149, 0)');
theFaceFill.addColorStop(1, 'rgb(255, 0, 0)');


//drop
const drop = 'ctx.moveTo(45.958371, 596.362500);'+
	'ctx.bezierCurveTo(132.825710, 642.905600, 182.945780, 724.527530, 249.746490, 689.912430);'+
	'ctx.bezierCurveTo(282.899260, 672.733230, 295.108440, 607.944970, 270.449690, 580.347820);'+
	'ctx.bezierCurveTo(220.800180, 524.781930, 125.743290, 596.248420, 45.958371, 596.362500);'
	

//square to delete drop of dial
const delSq = 'ctx.rect(29.601128, 540.940060, 278.753170, 179.226900)';

