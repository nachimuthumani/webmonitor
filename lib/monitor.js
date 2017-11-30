var http = require('http')
var https = require('https')
var fs = require('fs')
var util = require('util')
var EventEmitter = require('events').EventEmitter
var url = require('url')
var statusCodes = http.STATUS_CODES

function Monitor (options) {
  this.method = 'GET'
  this.website = ''
  this.interval = 15
  this.handle = null

util.inherits(Monitor, EventEmitter)

this.init = function (options) {
  var interval = options.interval || this.interval || 15
  var website = options.website
  if(!website) {
    return this.emit('error', {msg:'A valid website URL is required'})
  }
  this.method = options.method || this.method
  this.website = website
  this.interval = (interval * (60*1000))
  this.start()
  return this
}

this.start = function () {
  var self = this
  var time = Date.now()

  console.log("\nMonitoring: "+self.website+"\nTime: "+self.formatDate(time)+"\n")

  self.handle = setInterval(function(){
    self.ping()
  }, self.interval)

  return self
}

this.status = function (res, start) {
  var self = this
  var responseTime = process.hrtime(start)
  responseTime = responseTime[0]+responseTime[1]/1e6

  var response = {
    "statusCode"   : res.statusCode,
    "responseTime" : responseTime
  }

  if(res.statusCode === 200) {
    self.isOk(response)
  } else {
    self.isNotOk(response)
  }
  return this
}

this.ping = function () {
  var self = this
  var currentTime = Date.now()
  var start = process.hrtime()
  var req
  var options = url.parse(self.website)
  options.method = this.method

  if(self.website.indexOf('https:') === 0) {
    req = https.request(options, function(res){
      self.status(res, start)
    })
  } else {
    req = http.request(options, function(res) {
      self.status(res, start)
    })
  }

  req.on('error', function(err){
    response = {
      "statusCode": '404'
    }
    self.status(response, start)
  })

  req.end()

  return this
}

this.isOk = function (response) {
  var data = this.formatResponse(response)
  this.emit('up', data)
  return this
}

this.isNotOk = function (response) {
  var data = this.formatResponse(response)
  this.emit('down', data)
  return this
}

this.stop = function () {
  clearInterval(this.handle)
  this.handle = null
  this.emit('stop', this.website)
  return this
}

this.formatResponse = function (response) {
  var data = {
    website: this.website,
    time: Date.now(),
    responseTime: response.responseTime || 0,
    statusCode: response.statusCode,
    statusMessage: statusCodes[response.statusCode]
  }
  return data
}

this.formatDate = function (time) {
  var currentDate = new Date(time)

  currentDate = currentDate.toISOString()
  currentDate = currentDate.replace(/T/, ' ')
  currentDate = currentDate.replace(/\..+/, '')

  return currentDate
}

this.init(options)
if(options.up)
	this.on('up', options.up);

if(options.down)
this.on('down', options.down);

if(options.stop)
this.on('stop', options.stop);

}

module.exports = Monitor
