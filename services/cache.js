const mongoose  = require('mongoose');
const redis     = require('redis');
const util      = require('util');
const keys      = require('../config.keys');

const client    = redis.createClient(keys.redisUrl);

client.hget      = util.promisify(client.hget);

const exec      = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}){
	this.useCache = true;
	this.hashKey  = JSON.stringify(options.key || 'not undefined'); //a top level key. key must be a number or string.. reason we're stringifying it

	return this;
}

mongoose.Query.prototype.exec = async function() {
	// console.log('IM ABOUT TO WRITE A QUERY');

	if(!this.useCache){ //checks if the .cache function is called on the controller
		return exec.apply(this, arguments);
	}

	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
		collection: this.mongooseCollection.name
	})
  );

	

	//see if we have value for 'key' in redis
	const cacheValue = await client.hget(this.hashKey, key);
	if(cacheValue){
		console.log('from cacheing');

		const doc = JSON.parse(cacheValue);

	return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);

		// const doc = new this.model(JSON.parse(cacheValue));
		

		// return doc;
	}
	

	
	const result = await exec.apply(this, arguments);

	client.hset(this.hashKey, key, JSON.stringify(result));

	return result;

	// console.log(result.validate);
	
};

module.exports = {
	clearHash(hashKey) {
		client.del(JSON.stringify(hashKey))
	}
}