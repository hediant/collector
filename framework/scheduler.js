var EventEmitter = require('events').EventEmitter;
var Task = require('./task');
var Job = require('./job');
var Adapters = require('./adapters');
var Config = require('./config.json');

function Scheduler(){
	EventEmitter.call(this);
	var me = this;

	var is_running_ = false;
	var timer_, clean_timer_;

	var tasks_ = {};
	var jobs_ = [];

	this.run = function (){
		timer_ = setInterval(me.cycle, Config.check_cycle);
		clean_timer_ = setInterval(me.cleanCycle, Config.clean_cycle);
	}

	this.isActiveTask = function (task){
		return true;
	}

	this.matchJob = function (task){
		for (var i=0; i<jobs_.length; i++) {
			var job = jobs_[i];
			if (task.interval == job.interval && 
				task.adapter == job.adapter &&
				job.taskCount() < job.max_tasks)
			{
				return job;
			}
		};
	}

	this.dispatch = function (task){
		var job = me.matchJob(task);
		if (!job){
			job = new Job(task.adapter, task.interval);
			jobs_.push(job);
		}

		task.joinJob(job);
		job.run();
	}

	this.addTask = function (task){
		if (tasks_.hasOwnProperty(task.id)){
			me.removeTask(task);
		};

		tasks_[task.id] = task;
	}

	this.removeTask = function (task){
		task.stop();
		delete tasks_[task.id];
	}

	this.cycle = function (){
		for (var task_id in tasks_){
			var task = tasks_[task_id];
			if (me.isActiveTask(task) && task.status() != "running"){
				me.dispatch(task);
			}
		}
	}

	this.cleanCycle = function (){
		for (var i=0; i<jobs_.length; i++) {
			var job = jobs_[i];
			if (!job.taskCount()){
				job.close();
				jobs_.splice(i--, 1);
			}
		}
	}

	this.close = function (){
		if (timer_) clearInterval(timer_);
		if (clean_timer_) clearInterval(clean_timer_);
	}

	this.getJobs = function (){
		return jobs_;
	}

}
require('util').inherits(Scheduler, EventEmitter);
module.exports = Scheduler;

