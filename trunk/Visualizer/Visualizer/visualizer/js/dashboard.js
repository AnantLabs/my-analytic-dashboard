'use strict';

function DashboardCtrl($scope, $resource) {

	$scope.initChart = function() {
		var margin = {
			top : 10,
			right : 30,
			bottom : 30,
			left : 30
		}, //
		width = 960 - margin.left - margin.right, //
		height = 500 - margin.top - margin.bottom;

		d3.select("#chart").//
		append("svg").//
		attr("width", width + margin.left + margin.right).//
		attr("height", height + margin.top + margin.bottom).//
		append("g").//
		attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	};

	$scope.fetchData = function(params) {

		$resource('/Publisher/api/data').get(//
		// success
		function(response) {
			$scope.d3data = d3.selectAll("rect").data(response).enter();
			alert('Data Fetched');
		},//
		// error
		function() {
			alert('Error in fetching data');
		});

	};

	$scope.drawChart = function(params) {

		$scope.d3data.//

		// Bar
		append("rect").//
		// attr("x", 1).//
		attr("y", function(d, i) {
			return i * 25;
		}).//
		attr("width", function(d, i) {
			return d * 1000;
		}).//
		attr("height", function(d, i) {
			return 20;
		});

		// Histogram
		// append("rect").//
		// attr("x", function(d, i) {
		// return i * 25;
		// }).//
		// attr("y", function(d, i) {
		// return height - (d * 500);
		// }).//
		// attr("width", function(d, i) {
		// return 20;
		// }).//
		// attr("height", function(d, i) {
		// return height;
		// });

		// Pie

		// bar.append("text").//
		// attr("dy", ".75em").//
		// attr("y", 6).//
		// attr("x", x(data[0].dx) / 2).//
		// attr("text-anchor", "middle").//
		// text(function(d) {
		// return formatCount(d.y);
		// });

		// svg.append("g").//
		// attr("class", "x axis").//
		// attr("transform", "translate(0," + height + ")").//
		// call(xAxis);

	};

}