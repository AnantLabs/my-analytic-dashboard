'use strict';

function DashboardCtrl($scope, $resource) {

	var margin = {
		top : 10,
		right : 30,
		bottom : 30,
		left : 30
	};

	$scope.initChart = function() {
	};

	$scope.fetchData = function(params) {

		$resource('/Publisher/api/data/sales').get(//
		// success
		function(response) {
			$scope.response = response;
			// alert('Data Fetched');
		},//
		// error
		function() {
			alert('Error in fetching data');
		});

	};

	$scope.drawChart = function(params) {

		var width = 400 - margin.left - margin.right;
		var height = 250 - margin.top - margin.bottom;

		d3.select("#chart").select("svg").remove();
		var rects = d3.select("#chart").append("svg").//
		attr("width", width + margin.left + margin.right).//
		attr("height", height + margin.top + margin.bottom).//
		append("g").attr("transform",
				"translate(" + margin.left + "," + margin.top + ")").//
		selectAll("rect").data($scope.response.values).enter().append("rect");//

		// Bar
		if (params.type == 'Bar') {
			rects.attr("x", 1).attr("y", function(d, i) {
				return i * 25;
			}).//
			attr("width", function(d, i) {
				return d * (4/3);
			}).//
			attr("height", 20);
		}
		// Column
		else if (params.type == 'Column') {
			rects.attr("x", function(d, i) {
				return i * 25;
			}).//
			attr("y", function(d, i) {
				return height - (d * .9);
			}).//
			attr("width", 20).//
			attr("height", height);
		}
		// Pie
		// Line
		// Area

	};

}