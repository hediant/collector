var Moment = require('moment');

// task.repeat - object
/*
	{
		"type" : "no" || "day" || "week" || "month",

		// if type == no
		"no" : {
			"start" : string, pattern like "hh:mm:ss",
			"end" : string, pattern like "hh:mm:ss"	
		},

		// if type == day
		"day" : {
			"start" : string, pattern like "hh:mm:ss",
			"end" : string, pattern like "hh:mm:ss"
		},

		// if type == week
		"week" : {
			"Sun" : {
				"start" : string, pattern like "hh:mm:ss",
				"end" : string, pattern like "hh:mm:ss"				
			},
			"Mon" : { ... },
			"Tue" : { ... },
			"Wed" : { ... },
			"Thu" : { ... },
			"Fri" : { ... },
			"Sat" : { ... }
		},

		// if type == month
		"month" : {
			"01" : {
				"start" : string, pattern like "hh:mm:ss",
				"end" : string, pattern like "hh:mm:ss"	
			},
			"02" : { ... },
			...
			"31" : { ... }
		}
	}
*/
module.exports = function (task){
	var repeat = task.repeat;
	var date = task.date;
	var exclude_dates = task.exclude_dates || [];

	var current = Moment();
	var cur_date = current.format("YYYY-MM-DD"); 	// '2016-04-01'
	var cur_week_day = current.format('ddd');		// 'Sun'
	var cur_month_day = current.format('DD');		// '03'
	var cur_time = current.format('HH:mm:ss');		// '20:58:07'

	if (exclude_dates.indexOf(cur_date) >= 0)
		return false;

	switch (repeat.type){
		case "month":
			var info = repeat.month || {};
			var period = info[cur_month_day];
			if (period &&
				cur_time >= period.start &&
				cur_time <= period.end)
				return true;
			break;

		case "week":
			var info = repeat.week || {};
			var period = info[week_day];
			if (period &&
				cur_time >= period.start &&
				cur_time <= period.end)
				return true;
			break;

		case "day":
			var period = repeat.day || { "start" : "00:00:00", "end" : "24:00:00" }; 
			if (date <= cur_date && 
				cur_time >= period.start &&
				cur_time <= period.end)
				return true;
			break;			

		case "no":
		default :
			var period = repeat.no || { "start" : "00:00:00", "end" : "24:00:00" }; 
			if (date == cur_date && 
				cur_time >= period.start &&
				cur_time <= period.end)
				return true;
			break;
	}

	return false;

}