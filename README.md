# foodGET

foodGET allows you to order food through the command line using Postmates

## Getting Started
Install the module with: `npm install foodGET -g`

## Usage
For a quote and Foursquare page of nearest venue:

```javascript
foodget --item 'Filet-o-Fish meal with large drink and 2 apple pies' --eatery 'McDonalds' --name 'Zuhayeer Musa' --address '3300 Walnut Street, Philadelphia' --phone '408-759-0676' -o
```

For actual delivery (invoke the --delivery flag):

```javascript
foodget --item 'Filet-o-Fish meal with large drink and 2 apple pies' --eatery 'McDonalds' --name 'Zuhayeer Musa' --address '3300 Walnut Street, Philadelphia' --phone '408-759-0676' --delivery
```

<!-- ## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/). -->

## Release History
_(Nothing yet)_

## License
Copyright (c) 2015 Zuhayeer Musa  
Licensed under the MIT license.
