// 2021년12월8일패치 
// 사이드 메뉴 - 지형분석 기능 추가
async function initSidebarTerrainAnalysis() {    
    //투명도 레이어 생성을 위한 기본 설정
    var GraphicObjectProp = D2.Core.GraphicObjectProp;
    var GraphicObjectStyle = D2.Core.GraphicObjectStyle;
    var guid = null;
    //지형분석결과 투명도 이미지 객체로 전환
    function convertTerrainAnalysis2GraphicObject(canvasResult, name) {

        //중첩 영역 좌표값 설정(Google Mercator)
        let board;
        let coordinate = canvasResult.extent;
        let leftTop = [coordinate[0], coordinate[1]];
        let rightBottom = [coordinate[2], coordinate[3]];        
        
        getAnalysisGraphicBoard();       
        graphic.selectMode();

        //Canvas 정보를 png 이미지로 전환
        let imageURL = canvasResult.canvas.toDataURL('image/png', 1);
        
        //투명도 이미지 객체로 등록
        var imageProp = new GraphicObjectProp('image');
        var imageStyle = new GraphicObjectStyle();
        imageProp.name = name;
        imageProp.imgDataURL = imageURL;
        imageProp.setCoordinate([leftTop, rightBottom]);
        var imageObject = board.createObject(imageProp, imageStyle);
        imageObject.createFeature(true);

        // 투명도 레이어 설정
        function getAnalysisGraphicBoard() {
            let graphic = window.graphic;
            let count = graphic.getGraphicBoardCount();
            for (let i = 0; i < count; i++) {
                board = graphic.getGraphicBoard(i);                
                if (board._guid == guid) {
                    graphic.setSelectGraphicBoard(i);
                    return board;                
                }
            }            
            let index = graphic.addGraphicBoard();
            board = graphic.getGraphicBoard(index);
            graphic.setSelectGraphicBoard(index);
            board._name = 'TerrainAnalysis';  
            guid = board._guid;
        }
    }

    $('#terrain-analysis-clear').on('click', function () {         
        window.TerrainAnalysisManager.clear();
		window.eventManager.setMapMode('default');
    });

    //0. 임의지점 고도값 추출
    $('#terrain-get-height').on('click', function () { 
        var lon = parseFloat( $('#terrain-geographic-lon').val() );
        var lat = parseFloat( $('#terrain-geographic-lat').val() );

        window.spatialMath.getHeight(lon, lat, result => {
            let message = 'longitude : ' + lon + '\nlatitude : ' + lat + '\nheight : ' + result.toFixed(3) + 'm';
            alert(message);
        });
    });

    $('#observation-viewshed').on('click', function () {         
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '관측분석',
            operationMode : 'ObservationViewShed', //고정값
            mgrs: '52SBG7330447761',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            height: 10, //높이
            radius: 30000, //반경
            direction: 45, //방향각
            range: 120 //방향각 범위(좌/우)
        };

		window.ObservationViewShed.createObservationViewShed(options, extent => {
    
            //화면 도시 영역 자동 조절
			window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ObservationViewShed.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ObservationViewShed.clear();//기존 분석 결과 삭제
            });
        });

    });


    //02.사계 분석
    $('#firezone-viewshed').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '사계분석',
            operationMode : 'FireZoneViewShed', //고정값
            mgrs: '52SBG7330447761',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            height: 50, //높이
            radius: 50000, //반경
            direction: 30, //방향각
            range: 120 //방향각 범위(좌/우)
        };
        window.FireZoneViewShed.createFireZoneViewShed(options, extent => {
    
            //화면 도시 영역 자동 조절
			window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.FireZoneViewShed.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.FireZoneViewShed.clear();//기존 분석 결과 삭제
            });
        });
    });

    //03.수신가능지역분석
    $('#radio-reception-area').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '수신가능지역분석',
            operationMode : 'RadioReceptionArea', //고정값				
            sendRadioFrequency : 800,	//송신주파수 : 800MHz
            antenaGain : 24,	//안테나이득 : 24dB
            antenaOutput : 80,	//안테나출력 : 80Watt
            mgrs : '52SCG2200053753',//분석지점 설정, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시				
            radioLossModel : 'Egli', //전파손실모델 : Egli, Carey, Hata 중 택 1
            comboModel : 0, //콤보박스 : 대도시(0), 중소도시(1), 교외지(2), 개방지(3) 중 택 1
            receiveHeight : 200, //수신고도 : 200m
            sendHeight : 200, //송신기고도 : 200m
            range : 5000 //분석반경 : 5000m
        }; 							
        window.RadioReceptionArea.createRadioReceptionArea(options, extent => {
    
            //화면 도시 영역 자동 조절
			window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadioReceptionArea.exportCanvas( canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadioReceptionArea.clear();//기존 분석 결과 삭제
            });
        });
    });
        
    //04.통신가능성분석
    $('#radio-capability-sight').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '통신가능성분석',
            operationMode : 'RadioCapabilitySight', //고정값
            sendRadioFrequency : 30,	//송신주파수 : 30MHz
            antenaGain : 10,	//안테나이득 : 70dB
            antenaOutput : 25,	//안테나출력 : 25Watt
            mgrs1 : '52SEF2093624547', //분석지점 1, 좌표값을 직접 입력해야 분석 결과 표시
            mgrs2 : '52SCF7809166388', //분석지점 2, 좌표값을 직접 입력해야 분석 결과 표시
            radioLossModel : 'Egli', //전파손실모델 : Egli, Carey, Hata 중 택 1
            comboModel : 0, //콤보박스 : 대도시(0), 중소도시(1), 교외지(2), 개방지(3) 중 택 1
            receiveHeight : 34000, //수신고도 : 34km
            sendHeight : 3000, //송신기고도 : 3Km
            range : 100000 //분석반경 : 100km
        }; 							
        window.RadioCapabilitySight.createRadioCapabilitySight(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadioCapabilitySight.exportCanvas( (canvasResult) => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadioCapabilitySight.clear();//기존 분석 결과 삭제   
                console.log('[4] Egli complete');
            });
        });
    });

    //04.통신가능성분석
    $('#radio-capability-sightCarey').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '통신가능성분석',
            operationMode : 'RadioCapabilitySight', //고정값
            sendRadioFrequency : 30,	//송신주파수 : 30MHz
            antenaGain : 70,	//안테나이득 : 70dB
            antenaOutput : 25,	//안테나출력 : 25Watt
            mgrs1 : '52SCF7985389046', //분석지점 1, 좌표값을 직접 입력해야 분석 결과 표시
            mgrs2 : '52SDE5387695690', //분석지점 2, 좌표값을 직접 입력해야 분석 결과 표시
            radioLossModel : 'Carey', //전파손실모델 : Egli, Carey, Hata 중 택 1
            comboModel : 0, //콤보박스 : 대도시(0), 중소도시(1), 교외지(2), 개방지(3) 중 택 1
            receiveHeight : 34000, //수신고도 : 34km
            sendHeight : 3000, //송신기고도 : 3Km
            range : 100000 //분석반경 : 100km
        }; 							
        window.RadioCapabilitySight.createRadioCapabilitySight(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadioCapabilitySight.exportCanvas( (canvasResult) => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadioCapabilitySight.clear();//기존 분석 결과 삭제
                console.log('[4] Carey complete');
            });
        });
    });

    //04.통신가능성분석
    $('#radio-capability-sightHata').on('click', function () {         
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '통신가능성분석',
            operationMode : 'RadioCapabilitySight', //고정값
            sendRadioFrequency : 30,	//송신주파수 : 30MHz
            antenaGain : 70,	//안테나이득 : 70dB
            antenaOutput : 25,	//안테나출력 : 25Watt
            mgrs1 : '52SCF7832249839', //분석지점 1, 좌표값을 직접 입력해야 분석 결과 표시
            mgrs2 : '52SEF0337769747', //분석지점 2, 좌표값을 직접 입력해야 분석 결과 표시
            radioLossModel : 'Hata', //전파손실모델 : Egli, Carey, Hata 중 택 1
            comboModel : 0, //콤보박스 : 대도시(0), 중소도시(1), 교외지(2), 개방지(3) 중 택 1
            receiveHeight : 34000, //수신고도 : 34km
            sendHeight : 3000, //송신기고도 : 3Km
            range : 100000 //분석반경 : 100km
        }; 							
        window.RadioCapabilitySight.createRadioCapabilitySight(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadioCapabilitySight.exportCanvas( (canvasResult) => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadioCapabilitySight.clear();//기존 분석 결과 삭제
                console.log('[4] Hata complete');
            });
        });
    });

    //05.레이다 가시선
    $('#radar-viewshed').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '레이다가시선분석',
            operationMode : 'RadioViewShed', //고정값												
            mgrs : '52SCG4951052752',//값이 없으면 클릭 위치를 중심으로 분석 결과 표시				
            radarRadius : 50000, //감시거리 : 50km
            radarHeight : 400, //레이다높이 : 400m
            radarModel : 1, //레이다모델 : 지상(1), 해상(0) 중 택 1
            maxHeightUse : true,
            maxHeight : 2000, //최고고도 : 2km
            midHeight1Use : true,
            midHeight1 : 1000, //중간고도1 : 1km
            midHeight2Use : true,
            midHeight2 : 800, //중간고도2 : 800m
            midHeight3Use : true,
            midHeight3 : 500, //중간고도3 : 500m
            midHeight4Use : true,
            midHeight4 : 200, //중간고도4 : 200m
            minHeightUse : true, 
            minHeight : 10, //최저고도 : 10m
        }; 							
        window.RadioViewShed.createRadioViewShed(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadioViewShed.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadioViewShed.clear();//기존 분석 결과 삭제
            });
        });
    });		

    //06.감청장비분석
    $('#wiretapping-equipment').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');	
        let options = {		
            name : '감청장비분석',
            operationMode : 'WireTappingEquipment',	//고정값			
            sendRadioFrequency : 900,	//송신주파수 : 900MHz
            antenaGain : 25,	//안테나이득 : 25dB
            antenaOutput : 8,	//안테나출력 : 8Watt
            mgrs : '52SCG2200053753',//분석지점설정, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시				
            radioLossModel : 'Egli', //전파손실모델 : Egli, Carey, Hata 중 택 1
            comboModel : 0, //콤보박스 : 대도시(0), 중소도시(1), 교외지(2), 개방지(3) 중 택 1
            receiveHeight : 200, //수신고도 : 200m
            sendHeight : 200, //송신기고도 : 200m
            range : 10000 //분석반경 : 10000m
        }; 										
        window.WireTappingEquipment.createWireTappingEquipment(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.WireTappingEquipment.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.WireTappingEquipment.clear();//기존 분석 결과 삭제
            });
        });
    });

    //07.무기사격능력
    $('#weapon-fire-capability').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '무기사격능력',
            operationMode: 'WeaponFireCapability', //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            distance: 70000,
            direction: 100,
            leftAngle: 100,
            rightAngle: 90,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(0, 0, 255, 0.1)'
        };
        window.WeaponFireCapability.createWeaponFireCapability(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.WeaponFireCapability.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.WeaponFireCapability.clear();//기존 분석 결과 삭제
            });
        });
    });

    //08.포병무기사격능력
    $('#artillery-weapon-fire-capability').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '포병무기사격능력',
            operationMode: 'ArtilleryWeaponFireCapability', //고정값
            mgrs: '52SCG4234361516',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            distance: 80000,
            direction: 100,
            leftAngle: 120,
            rightAngle: 100,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(0, 100, 255, 0.1)'
        };
        window.WeaponFireCapability.createWeaponFireCapability(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.WeaponFireCapability.exportCanvas( canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.WeaponFireCapability.clear();//기존 분석 결과 삭제
            });
        });
    });

    //09.해상장비능력
    $('#sea-equipment-capability').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '해상장비능력',
            operationMode: 'SeaEquipmentCapability', //고정값
            mgrs: '52SCG4234361516',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            radius: 50000,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(0, 150, 255, 0.1)'
        };
        window.SeaEquipmentCapability.createSeaEquipmentCapability(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.SeaEquipmentCapability.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.SeaEquipmentCapability.clear();//기존 분석 결과 삭제
            });
        });
    });

    //10.포병레이다탐지능력
    $('#artillery-radar-detection-capability').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '포병레이다탐지능력',
            operationMode: 'ArtilleryRadarDetectionCapability', //고정값
            mgrs: '52SCG4234361516',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            distance: 100000,
            direction: 100,
            leftAngle: 100,
            rightAngle: 160,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(0, 200, 255, 0.1)'
        };
        window.WeaponFireCapability.createWeaponFireCapability(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.WeaponFireCapability.exportCanvas(canvasResult =>{                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.WeaponFireCapability.clear();//기존 분석 결과 삭제
            });
        });        
    });

    //11.해안레이다탐지능력(단위는 미터)
    $('#costal-radar-detection-capability').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '해안레이다탐지능력',
            operationMode: 'CoastalRadarDetectionCapability', //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            _5ton: 10000,
            _5tonDescription: '5톤 함정탐지',
            _100ton: 25000,
            _100tonDescription: '100톤 함정탐지',
            _300ton: 40000,
            _300tonDescription: '300톤 함정탐지',
            _500ton: 80000,
            _500tonDescription: '500톤 함정탐지',
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(0, 255, 255, 0.1)'
        };
        window.CostalRadarDetectionCapability.createCostalRadarDetectionCapability(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.CostalRadarDetectionCapability.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.CostalRadarDetectionCapability.clear();//기존 분석 결과 삭제
            });   
        });       
    });

    //12.항공기행동반경
    $('#aviation-activity-scope').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '항공기행동반경',
            operationMode: 'AviationActivityScope', //고정값
            mgrs: '52SCG4234361516',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            radius: 50000,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(255, 100, 0, 0.1)'
        };
        window.AviationActivityScope.createAviationActivityScope(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.AviationActivityScope.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.AviationActivityScope.clear();//기존 분석 결과 삭제
            });   
        });
    });

    //13.화생방오염예측(핵)
    $('#biological-pollution-prediction-by-nuclear').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측(핵)',
            operationMode: "RadiationPollutionPredictionByNuclear", //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            validWindDirection: 60, //유효풍향
            validWindSpeed: 5, //유효풍속(m/s)
            limitAngle: 30, //좌우한계각도
            firstZoneLength: 50000, //지대거리(m)
            attackRadius: 3000, //운반경(m)
            blowTime: '202111011234',//폭발일시분
            lineColor: 'rgba(0, 0, 255, 0.8)',
            pollutionLineColor: 'rgba(255, 0, 255, 0.8)'
        };
        window.RadiationPollutionPredictionByNuclear.createRadiationPollutionPredictionByNuclear(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.RadiationPollutionPredictionByNuclear.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.RadiationPollutionPredictionByNuclear.clear();//기존 분석 결과 삭제
            });   
        });        
    });

    //14.화생방오염예측(화학탄 A-a)
    $('#biological-pollution-prediction-by-aa').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 A-a)',
            operationMode: "ChemicalPollutionPredictionByAa", //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            radius1: 1000, 	//1km
            radius2: 10000,	//10km
            attackDate: '2021102913',
            lineColor: 'rgba(0, 0, 255, 0.8)'
        };
        window.ChemicalPollutionPrediction.createChemicalPollutionPrediction(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPrediction.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPrediction.clear();//기존 분석 결과 삭제
            });     
        });      
    });

    //15.화생방오염예측(화학탄 A-b)
    $('#biological-pollution-prediction-by-ab').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 A-b)',
            operationMode: "ChemicalPollutionPredictionByAb", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 1.2, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            attackPoint2: '52SCG8149321029', //공격지역2
            pollutionPoint1: '52SCG8616332106', //오염지역1
            pollutionPoint3: '52SCG8094828142', //오염지역3
            pollutionPoint4: '52SCG8657124188', //오염지역4
            pollutionPoint5: '52SCG9361730151', //오염지역5    
            attackDate: '20211029', //공격개시일
            lineColor: 'rgba(0, 0, 255, 0.8)'
        };
        window.ChemicalPollutionPredictionByA.createChemicalPollutionPredictionByA(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPredictionByA.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPredictionByA.clear();//기존 분석 결과 삭제
            });         
        });
    });

    //16.화생방오염예측(화학탄 B-a)
    $('#biological-pollution-prediction-by-ba').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 B-a)',
            operationMode: "ChemicalPollutionPredictionByBa", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 3, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            attackPoint2: '52SCG8149321029', //공격지역2
            pollutionPoint1: '52SCG8616332106', //오염지역1
            pollutionPoint3: '52SCG8094828142', //오염지역3
            pollutionPoint4: '52SCG8657124188', //오염지역4
            pollutionPoint5: '52SCG9361730151', //오염지역5    
            attackDate: '20211029', //공격개시일
            lineColor: 'rgba(0, 50, 255, 0.8)'
        };
        window.ChemicalPollutionPredictionByA.createChemicalPollutionPredictionByA(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPredictionByA.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPredictionByA.clear();//기존 분석 결과 삭제
            });     
        });     
    });

    //17.화생방오염예측(화학탄 B-b)
    $('#biological-pollution-prediction-by-bb').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 B-b)',
            operationMode: "ChemicalPollutionPredictionByBb", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 0.5, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            attackPoint2: '52SCG8149321029', //공격지역2
            pollutionPoint1: '52SCG8616332106', //오염지역1
            pollutionPoint3: '52SCG8094828142', //오염지역3
            pollutionPoint4: '52SCG8657124188', //오염지역4
            pollutionPoint5: '52SCG9361730151', //오염지역5    
            attackDate: '20211029', //공격개시일
            lineColor: 'rgba(0, 100, 255, 0.8)'
        };
        window.ChemicalPollutionPredictionByA.createChemicalPollutionPredictionByA(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPredictionByA.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPredictionByA.clear();//기존 분석 결과 삭제
            });
        });           
    });

    //18.화생방오염예측(화학탄 B-c)
    $('#biological-pollution-prediction-by-bc').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 B-c)',
            operationMode: "ChemicalPollutionPredictionByBc", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 1.0, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            attackPoint2: '52SCG8149321029', //공격지역2
            pollutionPoint1: '52SCG8616332106', //오염지역1
            pollutionPoint3: '52SCG8094828142', //오염지역3
            pollutionPoint4: '52SCG8657124188', //오염지역4
            pollutionPoint5: '52SCG9361730151', //오염지역5    
            pollutionPoint6: '52SCG9361139758', //오염지역6    
            attackDate: '20211029', //공격개시일
            lineColor: 'rgba(0, 120, 255, 0.8)'
        };
        window.ChemicalPollutionPredictionByA.createChemicalPollutionPredictionByA(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPredictionByA.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPredictionByA.clear();//기존 분석 결과 삭제
            });
        });           
    });

    //19.화생방오염예측(화학탄 B-d)
    $('#biological-pollution-prediction-by-bd').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(화학탄 B-d)',
            operationMode: "ChemicalPollutionPredictionByBd", //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            radius1: 0, //0km
            radius2: 10000, //10km
            attackDate: '2021102913',
            lineColor: 'rgba(0, 128, 255, 0.8)'
        };
        window.ChemicalPollutionPrediction.createChemicalPollutionPrediction(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPrediction.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPrediction.clear();//기존 분석 결과 삭제
            });  
        }); 
        
    });

    //20.화생방오염예측(생물학 A-a)
    $('#biological-pollution-prediction-by-baa').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(생물학 A-a)',
            operationMode: "BiologicalPollutionPredictionByAa", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 1.0, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시				
            pollutionPoint1: '52SDG0331337553', //오염지역1				
            pollutionPoint3: '52SCG6747636740', //오염지역3
            pollutionPoint4: '52SCG7750224320', //오염지역4
            pollutionPoint5: '52SDG0014316191', //오염지역5    
            pollutionPoint6: '52SCG8739630967', //오염지역6    
            attackDate: '20211104', //공격개시일
            lineColor: 'rgba(0, 120, 255, 0.8)'
        };
        window.BiologicalPollutionPrediction.createBiologicalPollutionPrediction(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.BiologicalPollutionPrediction.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.BiologicalPollutionPrediction.clear();//기존 분석 결과 삭제
            });   
        });       
    });

    //21.화생방오염예측(생물학 A-b)
    $('#biological-pollution-prediction-by-bab').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(생물학 A-b)',
            operationMode: "BiologicalPollutionPredictionByAb", //고정값
            validWindDirection: 0, //유효풍향
            validWindSpeed: 1.0, //유효풍속(m/s)
            attackPoint1: '52SCG8568012069', //공격지역1, 값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            attackPoint2: '52SCG8486722503', //공격지역2
            pollutionPoint1: '52SCG9383918300', //오염지역1
            pollutionPoint2: '52SCG8486722503', //오염지역2
            pollutionPoint3: '52SCG8224823146', //오염지역3
            pollutionPoint4: '52SCG8529814771', //오염지역4
            pollutionPoint5: '52SCG8838613436', //오염지역5    
            pollutionPoint6: '52SCG8961919222', //오염지역6    
            attackDate: '20211104', //공격개시일
            lineColor: 'rgba(0, 120, 255, 0.8)'
        };
        window.BiologicalPollutionPrediction.createBiologicalPollutionPrediction(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.BiologicalPollutionPrediction.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.BiologicalPollutionPrediction.clear();//기존 분석 결과 삭제
            });   
        });        
    });

    //22.화생방오염예측(생물학 B)
    $('#biological-pollution-prediction-by-b').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '화생방오염예측\n(생물학 B)',
            operationMode: "BiologicalPollutionPredictionByB", //고정값
            mgrs: '52SCG4234361516', //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            radius1: 0, //0km
            radius2: 10000, //10km
            attackDate: '2021102913',
            lineColor: 'rgba(0, 120, 255, 0.8)'
        };
        window.ChemicalPollutionPrediction.createChemicalPollutionPrediction(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.ChemicalPollutionPrediction.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.ChemicalPollutionPrediction.clear();//기존 분석 결과 삭제
            });   
        });        
    });

    //23.타격가능장비분석
    $('#attack-weapon-equipment').on('click', function () { 
        window.eventManager.setMapMode('terrainAnalysis');
        let options = {
            name: '타격가능장비분석',
            operationMode: 'AttackWeaponEquipment', //고정값
            mgrs: '52SCG4234361516',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            distance: 100000,
            direction: 25,
            leftAngle: 45,
            rightAngle: 45,
            lineColor: 'rgba(0, 0, 255, 0.8)',
            fillColor: 'rgba(255, 0, 0, 0.1)'
        };
        window.AttackWeaponEquipment.createAttackWeaponEquipment(options, extent => {
								
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);

            //지형분석 결과를 Canvas 객체로 callback 처리하여 전달
            window.AttackWeaponEquipment.exportCanvas(canvasResult => {                
                convertTerrainAnalysis2GraphicObject(canvasResult, options.name); //투명도 객체로 등록
                window.AttackWeaponEquipment.clear();//기존 분석 결과 삭제
            }); 
        });  
    });

    
}

