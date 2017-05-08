angular.module('myApp', ['myApp.controllers']);

var myApp = angular.module('myApp.controllers', []);

myApp.controller('AppController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){

	var rotation = 0;

	jQuery.fn.rotate = function(degrees) {
	    $(this).css({'transform' : 'rotate('+ degrees +'deg)'});
	    return $(this);
	};

	$http.get('/json/pedais.json').then(function(response){
		$scope.pedals = response.data.pedais;
		$scope.marcas = response.data.marcas;
	});

	$http.get('/json/boards.json').then(function(response){
		$scope.boards = response.data;
	});

	$scope.pedalsList = [];

	$scope.addMarca = function(){
		var result = $.grep($scope.pedals, function(e){ return e.marca == $scope.marcaSelect; });
		$scope.pedalsByMarca = result;
	}

	$scope.addPedal = function(){

		var result = $.grep($scope.pedalsList, function(e){ return e.url == $scope.pedalSelect; });

		if(!result.length){
			$scope.pedalsList.push($.grep($scope.pedals, function(e){ return e.url == $scope.pedalSelect; })[0]);
		}

		$scope.pedalSelect = "";

	}

	$scope.removePedal = function(){
		$scope.pedalsList = $.grep($scope.pedalsList, function(e){ return e.name != $scope.removePedalSelect; });
		$scope.removePedalSelect = "";
	}

	$scope.rotate = function($event){
		if($($event.currentTarget).attr("data-rotate")){
			var deg = parseInt($($event.currentTarget).attr("data-rotate")) + 90;
			$($event.currentTarget).attr("data-rotate", deg);
		} else {
			$($event.currentTarget).attr("data-rotate", 90);
			var deg = 90;
		}
		$($event.currentTarget).rotate(deg);
	}

	$scope.addCustom = function(){
		if($scope.widthCustom && $scope.heightCustom){
			var widthPixel = (($scope.widthCustom * 28.345) / 100) * 50;
			var heightPixel = (($scope.heightCustom * 28.345) / 100) * 50;

			var obj = {
				"marca":"Personalizado",
				"name":$scope.widthCustom+" x "+$scope.heightCustom,
				"url": "/img/blank.gif",
				"width": widthPixel,
				"height": heightPixel
			};

			$scope.pedalsList.push(obj);
			$scope.pedalSelect = "";
			$scope.marcaSelect = "";
			$scope.widthCustom = "";
			$scope.heightCustom = "";
		} else {
			alert("Preencha os campos de largura e altura");
		}
	}

	setInterval(function(){
		$( ".pedal" ).each(function(idx, el){
    	var image = new Image();
    	image.src = $(el).attr("src");
    	if(!$(el).hasClass("custom")){
				wid = (image.width / 100) * 11.6;
				$(el).width(wid)
			};

    	$(el).addClass('active').draggable();
    })
	}, 500);

}])