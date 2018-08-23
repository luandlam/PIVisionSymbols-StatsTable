(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);
	
	var tagInfo = [];
	var definition = { 
		typeName: "StatsTable",
		displayName: 'Statistics Table',
		visObjectType: symbolVis,
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Multiple,
		iconUrl: '/Scripts/app/editor/symbols/ext/Icons/StatsTable.png',
		getDefaultConfig: function(){
           return {
				DataShape: "Timeseries",
				Height: 150,
				Width: 400,
				GridColor: '#ff7f27',
				TextColor: '#cdd0db',
				TextSize: 12,
				DisplayDigits: 1,
				ShowMin: true,
				ShowMax: true,
				ShowAverage: true,
				ShowTotal: true
           }
       },
	   configOptions: function(){
		   return [
			   {
				   title: "Format Stats Table",
				   mode: "Format"
			   }
		   ];
	   }
	}
	
	symbolVis.prototype.init = function(scope, elem) { 
		this.onDataUpdate = dataUpdate;
		
		function dataUpdate(data){
			if (!data) return;
						
			// Get list of Names and Units in array
			if (data.Data[0] && data.Data[0].Label)
			{
				tagInfo = [];
				for (var i = 0; i < data.Data.length; i++)
				{
					var tagMetaData = {
						"Name": data.Data[i].Label,
						"Units": data.Data[i].Units
					};
					
					tagInfo.push(tagMetaData);
				}
			}
			
			// Calculate the stats for the tag
			var tagStats = [];

			var tagData = data.Data;
			//console.log(tagData);
			for (var i = 0; i < tagData.length; i++)
			{
				var tagValues = tagData[i].Values;
				var lastValue, lastTime, minValue, minTime, maxValue, maxTime, total;

				if (tagValues && tagValues.length > 0)
				{
					lastValue = parseFloat(tagValues[tagValues.length-1].Value);
					lastTime = tagValues[tagValues.length-1].Time;
					minValue = parseFloat(tagValues[0].Value);
					minTime = tagValues[0].Time;
					maxValue = parseFloat(tagValues[0].Value);
					maxTime = tagValues[0].Time;
					total = parseFloat(tagValues[0].Value);
				
					for (var j = 1; j < tagValues.length; j++)
					{
						var value = parseFloat(tagValues[j].Value);
						if (value > maxValue)
						{
							maxValue = value;
							maxTime = tagValues[j].Time;
						}
						
						if (value < minValue)
						{
							minValue = value;
							minTime = tagValues[j].Time;
						}
						
						total += value;
					}
				}
				
				// Store Tag stats data
				var stats = {
					"Name": tagInfo[i].Name,
					"Units": tagInfo[i].Units,
					"LastValue": lastValue,
					"LastTime": lastTime,
					"MinValue": minValue,
					"MinTime": minTime,
					"MaxValue": maxValue,
					"MaxTime": maxTime,
					"Total": total,
					"Average": total / tagValues.length
				};
				
				tagStats.push(stats);
			}
			
			//console.log(tagStats);
			scope.TagStats = tagStats;
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
