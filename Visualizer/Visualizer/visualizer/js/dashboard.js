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

		$resource('/Publisher/api/data/sales').get(//
		// success
		function(response) {
			$scope.keys = response.keys;
			d3.selectAll("rect").data(response.values).enter().append("rect");
			alert('Data Fetched');
		},//
		// error
		function() {
			alert('Error in fetching data');
		});

	};

	$scope.drawChart = function(params) {

		d3.selectAll("rect").//

		// Bar
		attr("y", function(d, i) {
			return i * 25;
		}).//
		attr("width", function(d, i) {
			return d;
		}).//
		attr("height", 20);

		// Column
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

		// Line
		
		// Area

	};

}