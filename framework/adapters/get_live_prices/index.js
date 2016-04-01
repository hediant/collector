exports.config = {
	"max_tasks" : 100
};

exports.crawl = function (tasks, cb){
	setImmediate(function (){
		cb (null, []);
	})
}