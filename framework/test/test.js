var Task = require('../task');
var Job = require('../job');
var Scheduler = require('../scheduler');
var Adapters = require('../adapters');

var shdlr = new Scheduler();
shdlr.run();

function disp(){
	console.log("Tasks:%s, Jobs: %s.", shdlr.getTasksCount(), shdlr.getJobs().length);
}

var tasks = [
	new Task({"id":1, "adapter":Adapters.demoAdapter1, "interval" : 1000, "params":{"task":1}}),
	new Task({"id":2, "adapter":Adapters.demoAdapter1, "interval" : 1000, "params":{"task":2}}),
	new Task({"id":3, "adapter":Adapters.demoAdapter1, "interval" : 3000, "params":{"task":3}})
]

tasks.forEach(function (task){
	shdlr.addTask(task);
	task.on('data', function (data){
		console.log("task %s recv data, %s.", task.id, JSON.stringify(data));
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
