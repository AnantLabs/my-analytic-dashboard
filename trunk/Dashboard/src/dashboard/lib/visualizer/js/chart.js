'use strict';

function ChartCtrl($element, $resource, $rootScope, $scope) {

	/*
	 * $scope.response = { values : [ 100, 50, 200, 250, 25, 150, 75, 50 ] };
	 */
	
	var colors = [ //
	'rgb(255,153,0)', //
	'rgb(220,57,18)', // 
	'rgb(70,132,238)', //
	'rgb(73,66,204)', //
	'rgb(0,128,0)', //
	'rgb(0, 169, 221)', //
	'rgb(0, 169, 221)', //
	'rgb(50, 205, 252)', //
	'rgb(70,132,238)', //
	'rgb(0, 169, 221)', //
	'rgb(5, 150, 194)', //
	'rgb(50, 183, 224)', //
	'rgb(2, 185, 241)', //
	'rgb(0, 169, 221)', //
	'rgb(0, 169, 221)', //
	'rgb(50, 205, 252)', //
	'rgb(70,132,238)', //
	'rgb(0, 169, 221)', //
	'rgb(5, 150, 194)', //
	'rgb(50, 183, 224)', //
	'rgb(2, 185, 241)'
	];

	$scope.fetchData = function() {

		delete $scope.response;

		if ($scope.params.exec && $scope.params.by) {

			$resource($rootScope.API_BASE_URL + '/sales/product/' + $scope.params.exec).//
			get(function(response) {
				$scope.response = response;
				$scope.drawChart();
			});

		}
	};

	$scope.drawChart = function() {

		// d3.select($element[0]).select("svg");

		if ($scope.response) {

			var height = 250;

			var svg = d3.select($element[0]).select("svg").//
			attr("height", height);

			// Bar
			if ($scope.params.type == 'Bar') {

				svg.selectAll("rect").//
				data($scope.response.values).enter().append("rect").//
				attr("x", 1).//
				attr("y", function(d, i) {
					return i * 25;
				}).//
				attr("width", function(d, i) {
					return d;
				}).//
				attr("height", 20).//
				attr("fill", function(d, i) {
					return colors[i];
				});
			}

			// Column
			else if ($scope.params.type == 'Column') {

				svg.selectAll("rect").//
				data($scope.response.values).enter().append("rect").//
				attr("x", function(d, i) {
					return i * 25;
				}).//
				attr("y", function(d, i) {
					return height - d;
				}).//
				attr("width", 20).//
				attr("height", height).//
				attr("fill", function(d, i) {
					return colors[i];
				});
			}

			// Pie
			else if ($scope.params.type == 'Pie') {

				svg.//
				append("g").attr("transform", "translate(125,125)").//
				selectAll("path").//
				data(d3.layout.pie()($scope.response.values)).enter().//
				append("path").//
				attr("d", d3.svg.arc().outerRadius(100)).//
				attr("fill", function(d, i) {
					return colors[i];
				});
			}

			// Line
			else if ($scope.params.type == 'Line') {

				svg.selectAll("line").//
				data($scope.response.values).enter().append("line").//
				attr("x1", function(d, i) {
					return i * 25;
				}).//
				attr(
						"y1",
						function(d, i) {
							return height
									- (i == 0 ? d
											: $scope.response.values[i - 1]);
						}).//
				attr("x2", function(d, i) {
					return (i + 1) * 25;
				}).//
				attr("y2", function(d, i) {
					return height - d;
				}).//
				attr("stroke", function(d, i) {
					return colors[i];
				}).//
				attr("stroke-width", 2);

			}

			// Area
			else if ($scope.params.type == 'Area') {
			}

			svg.append("line").//
			attr("x1", 0).//
			attr("y1", 0).//
			attr("x2", 0).//
			attr("y2", height).//
			attr("stroke", 'black').//
			attr("stroke-width", 1);

			svg.append("line").//
			attr("x1", 0).//
			attr("y1", height).//
			attr("x2", $scope.response.values.length * 25).//
			attr("y2", height).//
			attr("stroke", 'black').//
			attr("stroke-width", 1);

		}
	};

}