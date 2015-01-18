#! /usr/bin/env node

/*
 * foodGET
 * https://github.com/zuhaz3/foodget
 *
 * Copyright (c) 2015 Zuhayeer Musa
 * Licensed under the MIT license.
 */

'use strict';

var colors = require('colors'),
  request = require('request'),
  opts = require("nomnom")
   .option('item', {
      abbr: 'i',
      type: 'string',
      required: true,
      help: 'Food item you want to order'
   })
   .option('eatery', {
   	  abbr: 'e',
   	  type: 'string',
   	  required: true,
      help: 'Place you would like to order from'
   })
   .option('name', {
   	  abbr: 'n',
   	  type: 'string',
   	  required: true,
      help: 'Your first and last name for the order'
   })
   .option('address', {
   	  abbr: 'a',
   	  type: 'string',
   	  required: true,
      help: 'Your address to be delivered to'
   })
   .option('phone', {
   	  abbr: 'p',
   	  type: 'string',
   	  required: true,
      help: 'Your phone number for contact'
   })
   .option('version', {
   	  abbr: 'v',
   	  flag: true,
      help: 'Version of foodget',
      callback: function() {
      	return "Version 0.1.0";
      }
   })
   .option('delivery', {
   	  abbr: 'go',
   	  flag: true,
      help: 'Flag to deliver food to you if found. If not found, quote will be returned'
   })
   .parse();

if (opts.delivery) {
	console.log("Loading your order for delivery...".green);
} else {
	console.log("Loading a quote for your order...".green);
}

request('https://maps.googleapis.com/maps/api/geocode/json?address=' + opts.address.replace(/ /g, '+') + '&key=AIzaSyBT3OYuIPo-oSB6rtQ962EeuItv_VL9Xu0', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		body = JSON.parse(body);
		request('https://api.foursquare.com/v2/venues/search?client_id=UPRKRW53KFPMAWJG3EFEJJR4EJWEGWOPNG04AEHZLU3WZ0NU%20&client_secret=GWEVIXWDLJQUEPH4SCPNF5JDHCHFFS0PHEBAI52P5N3RB2LB%20&v=20130815%20&ll=' + body.results[0].geometry.location.lat + ',' +body.results[0].geometry.location.lng+ '&query=' + opts.eatery + '&categoryId=4d4b7105d754a06374d81259', function (error, response, body) {
        	if (!error && response.statusCode == 200) {
            	body = JSON.parse(body);
            	if (body.response.venues.length != 0) {
                    var fromAddress = body.response.venues[0].location.formattedAddress.join(", ");
                    opts.phone = opts.phone.replace('(', '').replace(')', '').replace(/-/g, '');
                    var pickupPhone = opts.phone;
                    if (body.response.venues[0].contact && body.response.venues[0].contact.formattedPhone) {
                    	pickupPhone = body.response.venues[0].contact.formattedPhone.replace('(', '').replace(')', '').replace(/ /g, '').replace(/-/g, '');
                    }

                    if (opts.delivery) {
                    	request.post({
	                        url:     'https://api.postmates.com/v1/customers/cus_Jka1D1BIcco-M-/deliveries',
	                        form:    {
	                                    manifest: opts.item,
	                                    pickup_name: opts.eatery,
	                                    pickup_address: fromAddress,
	                                    pickup_phone_number: pickupPhone,
	                                    dropoff_name: opts.name,
	                                    dropoff_address: opts.address,
	                                    dropoff_phone_number: opts.phone
	                                            },
	                        headers: {'Authorization' : 'Basic YjE2MDA3NDEtZjYyNS00NDRlLWE5NDEtOGRhZDFhNDY0MGRiOg=='}
	                    }, function(error, response, body) {
	                        if (!error && response.statusCode == 200) {
	                        	body = JSON.parse(body);
	                        	if (body.kind == "error") {
	                        		console.log(body.message);
	                        	} else {
	                        		// Cents to dollars and rounded
		                        	var money = parseFloat(body.fee) / 100.0;
		                            money = "$" + money.toFixed(2);

		                            console.log("\n YOUR FINAL ORDER IS OUTLINED BELOW ".inverse.yellow.bold);
	                        		var counter = 0
	                        		for (var key in body) {
	                        		  var wentInIndent = false;
	                        		  if (Date.parse(body[key])) {
	                        		  	var d = new Date(body[key]);
	                        		  	var str = key + " : " + d.toLocaleString() + "";
	                        		  } else if (key == "fee") {
	                        		  	var str = key + " : " + money + "";
	                        		  } else if (key == "manifest" || key == "pickup" || key == "dropoff") {
	                        		  	var newCount = counter;
	                        		  	var str = "" + key + " :";
                        		  	  	if (counter % 2 == 0)
									  	  console.log(str.white);
									    else
									  	  console.log(str.cyan);
	                        		  	for (var k in body[key]) {
	                        		  	  var indent = false;
	                        		  	  if (k == "location") {
	                        		  	  	var c = newCount;
	                        		  	  	var str = "\t" + k + " :";
	                        		  	  	if (newCount % 2 == 0)
										  	  console.log(str.white);
										    else
										  	  console.log(str.cyan);
	                        		  	  	for (var k1 in body[key][k]) {
	                        		  	  		var str = "\t\t" + k1 + " : " + body[key][k][k1] + "";
	                        		  	  		if (c % 2 == 0)
											  	  console.log(str.white);
											    else
											  	  console.log(str.cyan);
											  	c++;
	                        		  	  	}
	                        		  	  	indent = true;
	                        		  	  }
	                        		  	  var str = "\t" + k + " : " + body[key][k] + "";
	                        		  	  if (!indent) {
	                        		  	  	if (newCount % 2 == 0)
										  	  console.log(str.white);
										    else
										  	  console.log(str.cyan);
	                        		  	  }
										  newCount++;
	                        		  	}
	                        		  	wentInIndent = true;
	                        		  } else {
	                        		  	var str = key + " : " + body[key] + "";
	                        		  }

	                        		  if (!wentInIndent) {
	                        		  	if (counter % 2 == 0)
									  		console.log(str.white);
									  	else
									  		console.log(str.cyan);
	                        		  }
									  counter++;
									}
									var l = "\nYour order has been sent in and will cost " + money + "\n";
		                            console.log(l.magenta);
	                        	}
	                        } else {
	                        	body = JSON.parse(body);
	                        	if (body.kind == "error") {
	                        		console.log(body.message);
	                        	}
	                        }
	                    });
                    } else {
                    	request.post({
	                        url:     'https://api.postmates.com/v1/customers/cus_Jka1D1BIcco-M-/delivery_quotes',
	                        form:    {
	                                    pickup_address: fromAddress,
	                                    dropoff_address: opts.address
	                                            },
	                        headers: {'Authorization' : 'Basic YjE2MDA3NDEtZjYyNS00NDRlLWE5NDEtOGRhZDFhNDY0MGRiOg=='}
	                    }, function(error, response, body) {
	                        if (!error && response.statusCode == 200) {
	                        	body = JSON.parse(body);
	                        	if (body.kind == "error") {
	                        		console.log(body.message);
	                        	} else {
	                        		console.log("\n YOUR QUOTE IS OUTLINED BELOW ".inverse.yellow.bold);
	                        		var counter = 0
	                        		for (var key in body) {
	                        		  if (Date.parse(body[key])) {
	                        		  	var d = new Date(body[key]);
	                        		  	var str = key + " : " + d.toLocaleString() + "";
	                        		  } else if (key == "fee") {
	                        		  	var money = parseFloat(body.fee) / 100.0;
		                            	money = "$" + money.toFixed(2);
	                        		  	var str = key + " : " + money + "";
	                        		  } else if (body[key] == Object) {
	                        		  	var newCount = counter;
	                        		  	for (var k in body[key]) {
	                        		  	  var str = "\t" + k + " : " + body[key][k] + "";
	                        		  	  if (newCount % 2 == 0)
										  	console.log(str.white);
										  else
										  	console.log(str.cyan);
										  newCount++;
	                        		  	}
	                        		  } else {
	                        		  	var str = key + " : " + body[key] + "";
	                        		  }
	                        		  if (counter % 2 == 0)
									  	console.log(str.white);
									  else
									  	console.log(str.cyan);
									  counter++;
									}
									console.log("\n");
	                        	}
	                        } else {
	                        	body = JSON.parse(body);
	                        	if (body.kind == "error") {
	                        		console.log(body.message);
	                        	}
	                        }
	                    });
                    }
                }
            }
        });
	}
});

