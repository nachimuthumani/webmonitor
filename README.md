# webmonitor

A tool for monitoring the up time and response time of websites.

# Installation
```
npm install webmonitor
```

# How to use
```
var Monitor = require('webmonitor')

var website = new Monitor(options)

website.on(event, callback(response){
  // Actions on response
})

```

# Options

* website (* required) - The full url of the website to be monitored.
* interval (defaults to 15) - Time interval (minutes) for checking website availability.

# Emitted Events

* up - Website operating as expected.
* down - Website is down.
* stop - Fired when the monitor has stopped.

# Example
```
var Monitor = require('webmonitor')

options = {
  website: 'https://www.google.com',
  interval: .3,
  up : function(response)
  {
    console.log(response);
  },
  down : function(response)
  {
	console.log(response);
  },
  stop :function(response)
  {
	console.log(response);
  }
}

options1 = {
  website: 'http://mycura.com/',
  interval: .3,
  up : function(response)
  {
    console.log(response);
  },
  down : function(response)
  {
	console.log(response);
  },
  stop :function(response)
  {
	console.log(response);
  }
}

var monitor = new Monitor(options);
var monitor1 = new Monitor(options1);


```
