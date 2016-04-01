var Task = require('../task');
var Job = require('../job');
var Scheduler = require('../scheduler');
var Adapters = require('../adapters');

var shdlr = new Scheduler();
shdlr.run();

function disp(){
	console.log("Jobs:");
	console.log(shdlr.getJobs());
}

var tasks = [
	new Task({"id":1, "adapter":Adapters.adapter1, "interval" : 1000}),
	new Task({"id":2, "adapter":Adapters.adapter1, "interval" : 1000}),
	new Task({"id":3, "adapter":Adapters.adapter1, "interval" : 3000})
]

tasks.forEach(function (task){
	shdlr.addTask(task);
	task.on('data', function (data){
		console.log("task %s recv data.", task.id);
	});	
});

setTimeout(function (){
	tasks.forEach(function (task){
		shdlr.removeTask(task);		
		console.log("Stop task %s.", task.id);
	});

	setTimeout(function(){
		disp();
		console.log("All tasks completed.");
		process.exit();
	}, 5000);
	
}, 12*1000);
