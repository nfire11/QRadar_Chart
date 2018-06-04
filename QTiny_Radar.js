define([ "qlik","jquery","./echarts"],
function ( qlik,$,echarts) {

	return {
		initialProperties: {
			qHyperCubeDef: {
				qDimensions: [],
				qMeasures: [],
				qInitialDataFetch: [{
					qWidth: 7,
					qHeight: 1150,
				}]
			}
		},
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1
				},
				measures: {
					uses: "measures",
					min: 0
				},
				sorting: {
					uses: "sorting"
				},
				settings: {
					uses: "settings"
				},
				Section:{
                    type: "items",
                    		label: "Chart Settings",
                    		items:{
							TextBox0: {
	                            ref: "radar_name",
	                            label: "Chart Name",
	                            type: "string",
	                            //component: "textarea",
	                            defaultValue: "undefined",
	                            },							
	                        TextBoxA: {
	                            ref: "MaxList",
	                            label: "Max Value List",
	                            type: "string",
	                            //component: "textarea",
	                            defaultValue: "",
	                            },
	                        TextBoxB: {
	                            ref: "LegendPosition",
	                            label: "Legend Position",
	                            type: "string",
	                            //component: "textarea",
	                            defaultValue: "bottom:10",
	                            },
	                        TextBoxC: {
	                            ref: "ColorList",
	                            label: "Color List",
	                            type: "string",
	                            //component: "textarea",
	                            defaultValue: "",
	                            },						
								
				}},
				SectionB:{
                    type: "items",
                    		label: "About",
                    		items:{
							About0: {
	                            label: "QTiny Radar V1.0",
	                            component: "text",
	                            },							
							About1: {
								label: 'QTiny Radar',
	                            url: "https://github.com/nfire11/QTiny_Radar",
	                            component: "link",
	                            },
				}}				
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		
		paint: function ($element,layout) {
			//add your rendering code here
			var radar_id=Math.round(Math.random()*10000);
			var html="",self = this, lastrow = 0, dimcount = this.backendApi.getDimensionInfos().length,sortorder = this.backendApi.model.layout.qHyperCube.qEffectiveInterColumnSortOrder;	
			$element.html(html);
			$element.append('<div id="'+radar_id+'" style="width:100%;height:100%;"></div>');

			//###Render Data
			var app=qlik.currApp();
			var qtable=qlik.table(this);
			console.log(qtable);			
			var q_indicators=[];
			var max_list=[];
			$.each(self.backendApi.getMeasureInfos(),function(key, value){
				//console.log(key);
				//console.log(value["qFallbackTitle"]);
				max_list.push(0);
			});
			console.log(max_list);
			//console.log(q_indicators);
			var q_data=[];
			var q_legend=[];
			
			//console.log(qtable["rows"]);
			self.backendApi.eachDataRow(function(rownum,row){
				var temp_data=[];
				$.each(row,function(item_no,item){
					if(item_no>0){
						temp_data.push(item["qNum"]);
						if(item["qNum"]>max_list[item_no-1]){
							max_list[item_no-1]=item["qNum"];
						};
					};
				});
				var q_data_temp={
							value : temp_data,
							name : row[0]["qText"]
				};
				q_legend.push(row[0]["qText"]);
				q_data.push(q_data_temp);
			});
			
			if (layout.MaxList!=""){
				max_list=eval(layout.MaxList);
			};
			
			
			$.each(self.backendApi.getMeasureInfos(),function(key, value){
				//console.log(key);
				//console.log(value["qFallbackTitle"]);
				q_indicators.push({name:value["qFallbackTitle"],max:max_list[key]});
			});
			//#######eCharts Options#########
			var option = {
				title: {
					text: layout.radar_name
				},
				tooltip: {},
				legend: {
					data: q_legend,
				},
				radar: {
					// shape: 'circle',
					name: {
						textStyle: {
							color: '#fff',
							backgroundColor: '#999',
							borderRadius: 3,
							padding: [3, 5]
					   }
					},
					indicator: q_indicators,
				},
				series: [{
					name: layout.radar_name,
					type: 'radar',
					// areaStyle: {normal: {}},
					data : q_data
				}]
			};
			
			option["legend"][layout.LegendPosition.split(":")[0]]=layout.LegendPosition.split(":")[1];
			if(layout.ColorList!=""){
					option["color"]=eval(layout.ColorList);
			};

			var myChart = echarts.init(document.getElementById(radar_id),"macarons");
			myChart.setOption(option);
	}

	};
});
