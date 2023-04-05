// 군대부호 객체를 생성하고 툴팁, 정보창을 도시한다.
var milSymLayerSample = async function (map) {
    var D2MS = D2.Core.D2MS;
    var ol = D2.Core.ol;
    var coordManager = D2.Core.CoordManager;
    var olSource = undefined, olLayers = undefined, tracker = undefined;
    var milSymbolFeatures = [];
    var autoSize = 0.3;
    var interaction = undefined;
    var toolTip = false;
    var board = undefined;
    var graphic = window.graphic;
    var GraphicUtil = D2.Core.GraphicUtil;

    await initialize();
    async function initialize() {
        destroy();

        let index = graphic.addGraphicAppBoard();
        board = graphic.getGraphicAppBoard(index);
        olSource = board.getOLSource();
        olLayers = board.getOLLayer();

        // test code
        /*
        let index2 = graphic.addGraphicAppBoard();
        let board2 = graphic.getGraphicAppBoard(index);
        let olSource2 = board.getOLSource();
        let olLayers2 = board.getOLLayer();
        */


        /*
        // 벡터 정보로 군대부호 객체를 도시 할 수 있는 OL 레이어를 생성한다.
        olSource = new ol.source.Vector();
        olLayers = new ol.layer.VectorImage({
            source: olSource,
            zIndex: 500 //(디투맵 내부에서는 지도 0 ~ 99, 투명도 300 ~ 499의 인덱스를 사용한다.) 
        });
        map.addLayer(olLayers);
        */

        // 영역 검색을 위한 트렉커를 생성하고 스타일을 지정한다.
        tracker = new D2.Core.Tracker(map);
        tracker.setStyle([255, 173, 58, 1.0], 3, [128, 128, 128, 0.2]);

        // 툴팁, 정보창 도시를 위해 interaction을 생성한다.
        interaction = new ol.interaction.Pointer({
            handleEvent: handleEvent
        });
        map.addInteraction(interaction);

        function handleEvent(evt) {
            if (!toolTip)
                return true;

            switch (evt.type) {
                case 'pointermove':
                    showTooltip(findFeature(), evt);
                    break;
                case 'singleclick':
                    showTooltipInfo(findFeature(), evt);
                    break;
            }

            // 화면 좌표로 객체(feature)를 반환한다.
            function findFeature() {
                var retVal = undefined;
                map.forEachFeatureAtPixel(evt.pixel,
                    function (feature) {
                        if (feature != undefined && feature.getProperties().properties.name) {
                            retVal = feature;
                            return retVal;
                        }
                    },
                    {
                        hitTolerance: 3,
                        layerFilter: function (layer) {
                            return layer == olLayers;
                        }
                    }
                );
                return retVal;
            }
            return true;
        }
    }

    // 툴팁을 도시한다.
    function showTooltip(feature, evt) {
        var tooltipElement = document.querySelector('.d2map_selected-tp')
        if (tooltipElement != null)
            tooltipElement.style.display = 'none';

        if (feature) {
            var listHtml = document.createElement('div');
            var startScreenY = evt.pixel[1] - 50;
            var endScreenX = evt.pixel[0] + 10;
            listHtml.classList.add('d2map_selected-tp');
            listHtml.innerHTML = ' • ' + feature.get('properties')['name'] + '<br>' +
                ' • ' + feature.get('properties').MGRS.toString();

            if (tooltipElement != null)
                tooltipElement.remove();
            window.map.getTargetElement().append(listHtml);
            listHtml.style.top = startScreenY + 'px';
            listHtml.style.left = endScreenX + 'px';
            listHtml.style.display = 'block';
        }
    }

    // 툴팁 정보창을 도시한다.
    function showTooltipInfo(feature, evt) {
        var tooltipElement = document.querySelector('.d2map_selected-mi')
        if (tooltipElement != null)
            tooltipElement.style.display = none;
        unSelectMilSymbol();
        if (feature) {
            //경위도 좌표계를 구글 좌표계롤 변환하는 예제
            //var milMap = ol.proj.toLonLat(feature.getGeometry().getFirstCoordinate(), 'EPSG:3857'); 
            var startScreenY = evt.pixel[1] - 10;
            var endScreenX = evt.pixel[0] + 20;
            var listElem = document.createElement('div');
            var listHtml = "";
            listHtml += '<div class="d2map_selected-mi-title">' + feature.get('properties')['name'];
            listHtml += '<button type="button" class="d2map_selected-mi-close">x</button>';
            listHtml += '</div><div class="d2map_selected-mi-content">';
            listHtml += '<table>';
            listHtml += '<tr><td class="d2map_sub-title">Kind</td><td class="d2map_sub-content">' + feature.get('properties')['kind'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">SIDC</td><td class="d2map_sub-content">' + feature.get('properties')['SIDC'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">Name</td><td class="d2map_sub-content">' + feature.get('properties')['name'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">MGRS</td><td class="d2map_sub-content">' + feature.get('properties')['MGRS'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">Geo</td><td class="d2map_sub-content"> Lon ' + feature.get('properties')['longitude'] + ', Lat ' + feature.get('properties')['latitude'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">FullName</td><td class="d2map_sub-content">' + feature.get('properties')['fullname'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">Location</td><td class="d2map_sub-content">' + feature.get('properties')['location'] + '</td></tr>';
            listHtml += '<tr><td class="d2map_sub-title">Symbol</td><td class="d2map_sub-content" style="text-align: center;"><img src="' + feature.get('properties')['image'] + '"height="80"/></td></tr>';
            listHtml += '</table>';
            listElem.classList.add('d2map_selected-mi');
            listElem.innerHTML = listHtml;

            // 군대부호 선택 이미지를 생성한다.
            feature.set('queryStatus', 1);
            var msObj = getMilSymbolImg(feature.get('properties')['SIDC'], 1);
            feature.setStyle(
                new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.2,
                        anchor: msObj.anchor, //수식정보가 포함될 경우 부호 중심 위치를 조정한다.
                        src: msObj.imgURL,
                        imgSize: [msObj.size.width, msObj.size.height]
                    })
                })
            )
            feature.set('visible', true);

            setStyleByScale(feature);
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            var divWidth = listElem.innerWidth;
            var divHeight = listElem.hinnerHeight;

            // 계산된 startScreenY + 높이가 화면 높이보다 큰 경우
            if (startScreenY + divHeight > winHeight) {
                startScreenY = winHeight - divHeight - 10;
            }
            // 최종 top값이 음수이면 10 설정
            if (startScreenY < 0) {
                startScreenY = 10;
            }
            // 계산된 endScreenX + 너비가 화면 너비보다 큰 경우
            if (endScreenX + divWidth > winWidth) {
                endScreenX = evt.pixel[0] - 20 - divWidth;
            }
            // 최종 left값이 음수이면 전체 window에서 정보전시요소 너비를 뺀 값으로 설정
            if (endScreenX < 0) {
                endScreenX = winWidth - divWidth;
            }

            if (tooltipElement != null)
                tooltipElement.remove();
            window.map.getTargetElement().append(listElem);
            listElem.style.top = startScreenY + 'px';
            listElem.style.left = endScreenX + 'px';
            listElem.style.display = 'block';
            new window.Draggabilly(listElem, {
                containment: "body"
            })
        }
    }

    // JSON 객체로 군대부호를 생성한다.
    function loadData() {
        initialize().then(function () {
            $.ajax({
                url: '../src/data/json/target-isr-cop.json',
                success: function (data) {

                    var startTime = Date.now();

                    var features = data.features;
                    var cnt = features.length;
                    for (var i = 0; i < cnt; i++) {
                        var feature = features[i];
                        var coordinates = [parseFloat(feature.geometry.coordinates[0]), parseFloat(feature.geometry.coordinates[1])];
                        var properties = feature.properties;
                        properties = feature.properties;
                        if (properties) {
                            properties.longitude = coordinates[0];
                            properties.latitude = coordinates[1];
                            properties.height = feature.geometry.coordinates[2];
                            properties.MGRS = coordManager.Geo2MGRS(coordinates[0], coordinates[1]);
                        }

                        var msObj = getMilSymbolImg(properties['SIDC'], 0);
                        if (msObj == undefined)
                            continue;

                        properties.image = msObj.imgURL;
                        properties.imageSize = [msObj.size.width, msObj.size.height];

                        // 경위도 좌표를 구글좌표계로 변경한다.
                        var olPoint = new ol.geom.Point(ol.proj.fromLonLat(coordinates));
                        var olFeature = new ol.Feature(olPoint);
                        var olStyle = new ol.style.Style({
                            image: new ol.style.Icon({
                                scale: 0.2,
                                anchor: msObj.anchor, //수식정보가 포함될 경우 부호 중심 위치를 조정한다.
                                src: msObj.imgURL,
                                imgSize: [msObj.size.width, msObj.size.height]
                            })
                        });
                        olFeature.setStyle(olStyle);
                        olFeature.setProperties({ properties: properties, queryStatus: 0, visible: true });
                        milSymbolFeatures.push(olFeature)

                        //부대 중심 위치를 강제로 표시해 본다.
                        //markPoint(properties.longitude, properties.latitude);
                    }
                    olSource.addFeatures(milSymbolFeatures);
                    for (var i = 0; i < milSymbolFeatures.length; i++) {
                        setStyleByScale(milSymbolFeatures[i]);
                    }

                    var endTime = Date.now();
                    console.log(' Unit count : ', cnt, ' Elapsed Time : ' + (endTime - startTime).toLocaleString() + ' ms');

                },
                fail: function (xhr, status, errorThrown) {
                    console.error(`오류명 ${errorThrown}, 상태 ${status}`);
                }
            });
        });
    }

    // 축척에 따라 아이콘 크기를 조절한다.
    // ol setStyle 인자로 콜백 함수도 설정할 수 있다.
    // 콜백 함수에서 렌더링 시 스타일을 동적으로 변경 시킬 수 있다.
    function setStyleByScale(feature) {
        var style = feature.getStyle();
        var st = function (a, resolution) {
            style.getImage().setScale(1 / Math.pow(resolution, autoSize));
            return style;
        }
        feature.setStyle(st);
    }

    // 군대부호 선택 이미지를 기본 이미지로 변경한다. 
    function unSelectMilSymbol() {
        var cnt = milSymbolFeatures.length;
        for (var i = 0; i < cnt; i++) {
            var feature = milSymbolFeatures[i];
            var queryStatus = feature.get('queryStatus');
            if (queryStatus != 0) {
                feature.set('queryStatus', 0);
                var cd = feature.get('properties')['SIDC'];
                var msObj = getMilSymbolImg(cd, 0);
                var unselectedStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        scale: 0.2,
                        anchor: msObj.anchor, //수식정보가 포함될 경우 부호 중심 위치를 조정한다.
                        src: msObj.imgURL,
                        imgSize: [msObj.size.width, msObj.size.height]
                    })
                });
                feature.setStyle(unselectedStyle);
                setStyleByScale(feature);
            }
        }
    }

    // 툴팁 정보창을 닫는다.
    function closeSelected() {
        unselectMilSymbol();
        document.querySelector('.d2map_selected-ms').remove();
    }

    // 모든 객체를 삭제한다.
    function removeAll() {
        if (olSource)
            olSource.clear();

        milSymbolFeatures = [];
    }

    // 사용된 리소스를 반환한다.
    function destroy() {

        /*
        if (olSource)
            olSource.clear();

        if (olLayers)
            map.removeLayer(this.olLayers);

        olSource = undefined;
        olLayers = undefined;
        */

        if (board) {
            for (let i = 0; i < graphic.getGraphicBoardCount(); i++) {
                if (graphic.getGraphicAppBoard(i).getGUID() == board.getGUID()) {
                    graphic.removeGraphicAppBoard(i);
                    board = undefined;
                    break;
                }
            }
        }

        if (interaction)
            map.removeInteraction(interaction);

        if (tracker)
            tracker.destroy();

        milSymbolFeatures = [];
        interaction = undefined;
        tracker = undefined;
    }

    // 툴팁 활성여부를 설정한다.
    function enableTooltip(enable) {
        toolTip = enable;
    }

    // 군대부호와 상태값으로 점형 이미지를 반환한다.
    function getMilSymbolImg(cd, state) {
        if (!cd) return;
        if (state == undefined || state == null) {
            state = 0;
        }

        var sym = new D2MS.ms.Symbol('');

        var options = {
            SIDC: cd,
            size: 25,

            //infoFields: false, //수식정보 전체 표시여부 결정
            // infoColor: "RGB(255,178,58)", //수식정보 색상   

            //군대부호 밝기 조절 방법 : colorMode와 userDefineBrightness 두 가지 방법으로 설정 가능
            //colorMode : "Light", //"Light, Medium, Dark"
            // userDefineBrightness: "90", //0%:어둡게 ~ 100%:밝게

            // uniqueDesignation: "T:고유명칭[부호중심위치찾기]",
            // reinforcedReduced: "F:부대증감",
            // staffComments: "G:군/국가구분코드",

            //기본부호 밑에 텍스트 표시(표준부호내 AD 태그 대신 사용함) 
            // platformType: "905부대"            
        };

        if (state == 1) {
            options.outlineColor = "#FFAF3A";
            options.outlineWidth = "10";
        } else if (state == 2) {
            options.outlineColor = "#FF0040";
            options.outlineWidth = "20";
        }

        sym.setOptions(options);

        //군대부호 중심위치 찾기
        let symSize = sym.getSize();

        //객체 중심좌표로 Anchor 설정
        let anchorX = sym.symbolAnchor.x / symSize.width;
        let anchorY = sym.symbolAnchor.y / symSize.height;

        if (anchorX < 0.0 || anchorY < 0.0)
            anchorX = anchorY = 0.5;

        var svg = sym.asSVG();

        // 군대부호 생성이 실패한 경우
        if (svg.length <= 126)
            return undefined;

        return {
            ms: sym,
            anchor: [anchorX, anchorY],
            imgURL: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
            size: sym.getSize()
        }
    }

    // 군대부호 객체 visible을 실행한다.
    function setVisibleMilSym(visible) {
        var cd;
        for (var i = 0; i < milSymbolFeatures.length; i++) {
            // 적군 군대부호를 찾는다.
            cd = milSymbolFeatures[i].get('properties')['SIDC'];
            if (cd != undefined && cd.indexOf('H', 1) == 1) {
                if (visible == false) {
                    // Empty 스타일을 설정하여 객체를 Hide 시킨다.
                    milSymbolFeatures[i].setStyle(new ol.style.Style());
                    milSymbolFeatures[i].set('visible', false);
                }
                else {
                    // 군대부호 스타일 설정하여 객체를 Show 시킨다.
                    if (milSymbolFeatures[i].get('visible') == false) {
                        var msObj = getMilSymbolImg(cd, 0);
                        milSymbolFeatures[i].setStyle(
                            new ol.style.Style({
                                image: new ol.style.Icon({
                                    scale: 0.2,
                                    anchor: msObj.anchor, //수식정보가 포함될 경우 부호 중심 위치를 조정한다.
                                    src: msObj.imgURL,
                                    imgSize: [msObj.size.width, msObj.size.height]
                                })
                            })
                        )
                        milSymbolFeatures[i].set('visible', true);
                        // 동적 크기 조절을 반영한다.
                        setStyleByScale(milSymbolFeatures[i]);
                    }
                }
            }
        }
    }

    // 영역 검색 수행한다.    
    function selectFeature(type, continuity) {
        // Tracker를 영역을 반환 받는다.        
        // continuity select 연속 실행여부
        // parm1 select type : rectangle, circle, polygon       
        tracker.select(type, continuity, function (extent, param1, param2) {
            // rectangle일 경우 param1, param2 : undefined
            // circle일 경우 param1 : 중심좌표, param2 : 반지름
            // polygon일 경우 param1, 폴리곤 좌표열, param2 : undefiend
            // 아이콘 검색을 위해 트렉커 Extend 키기를 10px 버퍼를 준다.
            var resolution = window.map.getView().getResolution();
            var bufferExtend = [extent[0] - resolution * 10, extent[1] - resolution * 10,
            extent[2] + resolution * 10, extent[3] + resolution * 10]

            //  bufferExtend로 1차 영역 검색을 수행한다.                               
            var selectFeature = [], extentFeature = olSource.getFeaturesInExtent(bufferExtend);

            // visible이 true 객체만 필터링한다.          
            selectFeature = extentFeature.filter(feature => feature.get('visible') == true);

            // intersects 연산을 위한 공간연산 객체를 생성한다.
            // 트렉커 영역을 설정한다.
            var spatialOperator = new D2.Core.SpatialOperator(type, extent, param1, param2);
            if (selectFeature.length > 0) {
                // 아래 코드로 영역 검색을 수행할 경우 코드는 심플하지만
                // 군대부호(point) 객체는 중점이 포함되었을 경우에만 검색이 가능한다.
                // for (var i = 0; i < selectFeature.length; i++) {
                //     if (spatialOperator.intersectsOLFeature(selectFeature[i])) {
                //         console.log(selectFeature[i].get('properties')['SIDC']);
                //         count++;
                //         selectFeature[i].get('properties')['imageSize']                        
                //     }
                // }

                // 아이콘의 크기를 계산하여 조금 더 정밀하게 영역 계산을 수행한다.
                var iconScale = 1 / Math.pow(resolution, autoSize);
                for (var i = 0; i < selectFeature.length; i++) {
                    if (selectFeature[i].getGeometry().getType() == 'Point') {
                        // 아이콘 이미지 크기와 지도 해상도를 고려하여 아이콘이 그려지는 지리좌표 영역을 계산한다.
                        var center = selectFeature[i].getGeometry().getCoordinates();
                        var iconSize = selectFeature[i].get('properties')['imageSize'];
                        if (!iconSize) iconSize = [5, 5];
                        var width = resolution * iconScale * iconSize[0];
                        var height = resolution * iconScale * iconSize[1];
                        var iconExtend = [center[0] - width, center[1] - width, center[0] + height, center[1] + height];
                        // 지리 좌표로 공간연산을 수행한다.
                        /** 
                         * type - rectangle, extent 
                         * type - circle, param1 중심좌표, param2 반지름
                         * type - polygon param1 좌표열
                         * type - line param1 좌표열
                         * type - point param1 중심좌표  
                        */
                        if (spatialOperator.intersects('rectangle', iconExtend)) {
                            console.log(selectFeature[i].get('properties')['SIDC']);
                        }
                        // 포인트 객체가 아닌 경우는 OL 객체로 영역 계신을 수행한다.
                    } else if (spatialOperator.intersectsOLFeature(selectFeature[i])) {
                        console.log(selectFeature[i].get('properties')['SIDC']);
                    }
                }
            }

            // 비정형 코드
            selectFeature = board.getObjectInExtent(extent);
            for (var i = 0; i < selectFeature.length; i++) {
                for (var j = 0; j < selectFeature[i]._feature.length; j++) {
                    if (spatialOperator.intersectsOLFeature(selectFeature[i]._feature[j])) {
                        console.log(selectFeature[i].name);
                        break;
                    }
                }
            }
        })
    }

    function trackerClear() {
        tracker.handlerClear();
    }

    //OL 기반 Point 객체 생성 예제
    function markPoint(x, y) {

        //입력좌표값을 기준으로 폴리라인 객체를 그린다.
        var geoCoordinates = [];
        geoCoordinates.push([x, y]);

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var coordinates = [];
        for (var i = 0; i < geoCoordinates.length; i++) {
            var coordinate = ol.proj.transform(geoCoordinates[i], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
            coordinates.push(coordinate);
        }
        geoCoordinates.length = 0; //배열삭제

        //OL 포인트객체를 생성한다.        
        var feature = new ol.Feature(new ol.geom.Point(coordinates[0]));

        //폴리라인 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(0,255,0,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0,0,1.0)',
                    width: 2.0
                }),
                radius: 3
            }),
            zIndex: 500
        });

        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Point' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    //OL 기반 Point 객체 생성 예제
    function createPointMilSym() {

        //입력좌표값을 기준으로 폴리라인 객체를 그린다.
        var geoCoordinates = [];
        geoCoordinates.push([127, 37.5]);

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var coordinates = [];
        for (var i = 0; i < geoCoordinates.length; i++) {
            var coordinate = ol.proj.transform(geoCoordinates[i], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
            coordinates.push(coordinate);
        }
        geoCoordinates.length = 0; //배열삭제

        //OL 포인트객체를 생성한다.        
        var feature = new ol.Feature(new ol.geom.Point(coordinates[0]));

        //폴리라인 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: 'rgba(255,175,58,0.5)'
                }),
                stroke: new ol.style.Stroke({
                    color: 'rgba(255,0,0,0.5)',
                    width: 1.0
                }),
                radius: 5
            }),
            text: new ol.style.Text({
                text: 'Text',
                scale: 1.5,
                stroke: new ol.style.Stroke({
                    color: 'rgb(0, 0, 255)',
                    width: 1
                }),
                offsetX: 0,
                offsetY: 10,
            }),
            zIndex: 500
        });

        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Point' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    //OL 기반 Polyline 객체 생성 예제
    function createPolylineMilSym() {

        //입력좌표값을 기준으로 폴리라인 객체를 그린다.
        var geoCoordinates = [];
        geoCoordinates.push([126, 37]);
        geoCoordinates.push([127, 38]);
        geoCoordinates.push([128, 37]);
        geoCoordinates.push([129, 38]);

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var coordinates = [];
        for (var i = 0; i < geoCoordinates.length; i++) {
            var coordinate = ol.proj.transform(geoCoordinates[i], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
            coordinates.push(coordinate);
        }
        geoCoordinates.length = 0; //배열삭제

        //OL 라인객체를 생성한다.
        var feature = new ol.Feature(new ol.geom.LineString(coordinates));

        //폴리라인 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 10
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Polyline' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    //OL 기반 Polygon 객체 생성 예제
    function createPolygonMilSym() {
        console.log('create polygon');

        //입력좌표값을 기준으로 폴리곤 객체를 그린다.
        //폴리곤은 반드시 폐합되어야 한다.
        var geoCoordinates = [];
        geoCoordinates.push([126, 38]);
        geoCoordinates.push([127, 39]);
        geoCoordinates.push([128, 38]);
        geoCoordinates.push([129, 39]);
        geoCoordinates.push([126, 38]);

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var coordinates = [];
        for (var i = 0; i < geoCoordinates.length; i++) {
            var coordinate = ol.proj.transform(geoCoordinates[i], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
            coordinates.push(coordinate);
        }
        geoCoordinates.length = 0; //배열삭제

        //OL 폴리곤 객체를 생성한다.
        var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

        //폴리곤 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 255, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 10
            }),
            fill: new ol.style.Fill({
                color: [255, 255, 0, 0.5]
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Polygon' }, queryStatus: 0, visible: true });


        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    //OL 기반 Circle 객체 생성 예제
    function createCircleMilSym() {
        console.log('create circle');

        //입력좌표값을 기준으로 원형 객체 좌표를 계산한다.
        var coordinateCenter = ol.proj.transform([127, 37.5], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var radius = 100000; //반경 100km
        var coordinates = [];
        for (var angle = 0; angle <= 360; angle += 5) {
            var coordinate = getMercatorCoordinate(coordinateCenter, angle, radius);
            coordinates.push(coordinate);
        }

        //OL 폴리곤 객체를 생성한다.
        //OL 원(Circle)을 사용하지 않고 Polygon으로 생성한 이유는 정확한 반경값 계산을 위해서 이다.
        var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

        //원형 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 2
            }),
            fill: new ol.style.Fill({
                color: [255, 255, 0, 0.5]
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Circle' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    function ellipse(center, semiMajor, semiMinor) {
        var coordinates = [];
        const radian = Math.PI / 180;
        for (var angle = 0; angle <= 360; angle++) {
            const px = center[0] + (semiMajor * 1.259) * Math.cos(radian * angle); //장축에 대한 비율을 계산한다.
            const py = center[1] + (semiMinor * 1.27) * Math.sin(radian * angle); //단축에 대한 비율을 계산한다.
            coordinates.push([px, py]);
        }
        return coordinates;
    }

    //장반경은 x축 기준, 단반경은 y축 기준
    function rectangle(center, semiMajor, semiMinor) {
        var coordinates = [];

        var top = getMercatorCoordinate(center, 0, semiMinor);
        var bottom = getMercatorCoordinate(center, 180, semiMinor);
        var right = getMercatorCoordinate(center, 90, semiMajor);
        var left = getMercatorCoordinate(center, 270, semiMajor);

        coordinates.push([left[0], top[1]]);
        coordinates.push([right[0], top[1]]);
        coordinates.push([right[0], bottom[1]]);
        coordinates.push([left[0], bottom[1]]);
        coordinates.push([left[0], top[1]]); //폐합

        return coordinates;
    }

    //입력좌표(메르카도)에 대한 선 표시
    function addLines(coordinates) {
        var lines = new ol.geom.LineString(coordinates);
        var feature = new ol.Feature(lines);
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 2
            }),
            zIndex: 501
        });

        feature.setStyle(style);
        return feature;
    }

    //입력좌표(메르카토)에 문자열 표시
    function addText(coordinate, string) {
        //텍스트 표시
        var point = new ol.geom.Point(coordinate);
        var feature = new ol.Feature(point);
        var style = new ol.style.Style({
            text: new ol.style.Text({
                text: string,
                scale: 1.2,
                fill: new ol.style.Fill({
                    color: "#ffffff"
                }),
                stroke: new ol.style.Stroke({
                    color: "#000000",
                    width: 3
                })
            }),
            zIndex: 501
        });

        feature.setStyle(style);
        return feature;
    }

    //OL 기반 Ellipse 객체 생성 예제
    function createEllipseMilSym() {

        var coordinateCenter = ol.proj.transform([127, 37.5], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
        var coordinates = ellipse(coordinateCenter, 100000, 50000);

        coordinates.push(coordinateCenter);
        coordinates.push(coordinates[0]);

        //OL 폴리곤 객체를 생성한다.
        //OL 원(Circle)을 사용하지 않고 Polygon으로 생성한 이유는 정확한 반경값 계산을 위해서 이다.
        var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

        //원형 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 2
            }),
            fill: new ol.style.Fill({
                color: [255, 255, 0, 0.5]
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Circle' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);

        //원점에서 60도 만큼 타원을 회전시킨다.
        //feature.getGeometry().rotate(60 * Math.PI / 180, coordinateCenter);

        //일정 시간마다 타원을 회전시킨다.
        let timer = setInterval(function () {
            //0.1초 마다 1도씩 회전
            feature.getGeometry().rotate(-1 * Math.PI / 180, coordinateCenter);
        }, 100);

    }

    //OL 기반 Ellipse 객체 생성 예제(중심좌표, 장축, 단축표시)
    function createEllipseMilSymEx() {
        console.log('타원(중심좌표, 장축, 단축표시)');

        //타원
        var tracker = new D2.Core.Tracker(window.map);
        tracker.setStyle([0, 0, 255, 1.0], 2, [128, 128, 128, 0.2]);
        tracker.select('ellipse', false, function (extent, paramCenter, paramSemiMajor, paraSemiMinor) {
            console.log(extent, paramCenter, paramSemiMajor, paraSemiMinor);

            var center = ol.proj.transform(paramCenter, 'EPSG:3857', 'EPSG:4326'); //Google Mercator를 경위도로 환산
            console.log(center);
            var coordinateCenter = paramCenter;
            var semiMajor = paramSemiMajor;
            var semiMinor = paraSemiMinor;
            var coordinates = ellipse(coordinateCenter, semiMajor, semiMinor);

            //OL 폴리곤 객체를 생성한다.
            //OL 원(Circle)을 사용하지 않고 Polygon으로 생성한 이유는 정확한 반경값 계산을 위해서 이다.
            var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

            //원형 객체에 스타일을 설정한다.
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 0, 255, 1.0], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: [128, 128, 128, 0.3]
                }),
                zIndex: 500
            });
            feature.setStyle(style);
            feature.setProperties({ properties: { SIDC: 'Circle' }, queryStatus: 0, visible: true });

            //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
            olSource.addFeature(feature);

            //중심좌표 텍스트로 표시

            var centerPositionString = coordManager.Geo2MGRS(center[0], center[1]).toString(); //String(center[0]) + ',' + String(center[1]);
            var centerTextFeature = addText(coordinateCenter, centerPositionString);
            olSource.addFeature(centerTextFeature);

            //장축 텍스트로 표시
            var semiMajorString = semiMajor.toLocaleString() + 'm';
            var semiMajorTextFeature = addText(getMercatorCoordinate(coordinateCenter, 90, semiMajor), semiMajorString);
            olSource.addFeature(semiMajorTextFeature);

            //단축 텍스트로 표시
            var semiMinorString = semiMinor.toLocaleString() + 'm';
            var semiMinorTextFeature = addText(getMercatorCoordinate(coordinateCenter, 0, semiMinor), semiMinorString);
            olSource.addFeature(semiMinorTextFeature);

            //가이드 선 표시
            var guideCoordinates = [];
            guideCoordinates.push(getMercatorCoordinate(coordinateCenter, 0, semiMinor));
            guideCoordinates.push(coordinateCenter);
            guideCoordinates.push(getMercatorCoordinate(coordinateCenter, 90, semiMajor));
            olSource.addFeature(addLines(guideCoordinates));
        });
    }

    //OL 기반 Rectangle 객체 생성 예제(중심좌표, 장축, 단축표시)
    function createRectangleMilSym() {
        console.log('사각형(중심좌표, 장축, 단축표시)');

        //타원
        var tracker = new D2.Core.Tracker(window.map);
        tracker.setStyle([0, 0, 255, 1.0], 2, [128, 128, 128, 0.2]);
        tracker.select('rectangle', false, function (extent) {
            console.log(extent); //사각형 좌상/우하의 Google Mercator 좌표값을 출력한다.

            var paramCenter = [(extent[0] + extent[2]) * 0.5, (extent[1] + extent[3]) * 0.5];

            var center = ol.proj.transform(paramCenter, 'EPSG:3857', 'EPSG:4326'); //Google Mercator를 경위도로 환산 

            var semiMajor = Math.abs(extent[2] - extent[0]) * 0.5 / 1.259;  //장축에 대한 비율을 계산한다.
            var semiMinor = Math.abs(extent[3] - extent[1]) * 0.5 / 1.27; //단축에 대한 비율을 계산한다.

            var coordinateCenter = paramCenter;
            var coordinates = rectangle(coordinateCenter, semiMajor, semiMinor);

            //OL 폴리곤 객체를 생성한다.
            //OL 원(Circle)을 사용하지 않고 Polygon으로 생성한 이유는 정확한 반경값 계산을 위해서 이다.
            var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

            //원형 객체에 스타일을 설정한다.
            var style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0, 0, 255, 1.0], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: [128, 128, 128, 0.3]
                }),
                zIndex: 500
            });
            feature.setStyle(style);
            feature.setProperties({ properties: { SIDC: 'Circle' }, queryStatus: 0, visible: true });

            //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
            olSource.addFeature(feature);

            //중심좌표 텍스트로 표시
            var centerPositionString = coordManager.Geo2MGRS(center[0], center[1]).toString();
            var centerTextFeature = addText(coordinateCenter, centerPositionString);
            olSource.addFeature(centerTextFeature);

            //장축 텍스트로 표시
            var semiMajorString = semiMajor.toLocaleString() + 'm';
            var semiMajorTextFeature = addText(getMercatorCoordinate(coordinateCenter, 90, semiMajor), semiMajorString);
            olSource.addFeature(semiMajorTextFeature);

            //단축 텍스트로 표시
            var semiMinorString = semiMinor.toLocaleString() + 'm';
            var semiMinorTextFeature = addText(getMercatorCoordinate(coordinateCenter, 0, semiMinor), semiMinorString);
            olSource.addFeature(semiMinorTextFeature);

            //가이드 선 표시
            var guideCoordinates = [];
            guideCoordinates.push(getMercatorCoordinate(coordinateCenter, 0, semiMinor));
            guideCoordinates.push(coordinateCenter);
            guideCoordinates.push(getMercatorCoordinate(coordinateCenter, 90, semiMajor));
            olSource.addFeature(addLines(guideCoordinates));
        });

    }


    //OL 기반 능력도 표시 생성 예제
    function createCapacityMilSym() {
        console.log('create Capacity');

        var startAngle, endAngle;
        var direction = 30; //지향방향
        var leftAngle = 60; //지향방향 기준으로 왼쪽 각도
        var rightAngle = 60; //지향바향 기준으로 오른쪽 각도
        var distance = 100000; //100km

        startAngle = direction - leftAngle;
        endAngle = direction + rightAngle;

        //정규화 처리
        if (startAngle > endAngle)
            startAngle += 360;

        //입력좌표값을 기준으로 원형 객체 좌표를 계산한다.
        var coordinateCenter = ol.proj.transform([127, 38.5], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환

        // 폴리곤 좌표열은 폐합되어 있어야한다.
        var coordinates = [];
        for (var angle = startAngle; angle <= endAngle; angle += 5) {
            var coordinate = getMercatorCoordinate(coordinateCenter, angle, distance);
            coordinates.push(coordinate);
        }
        coordinates.push(coordinateCenter);
        coordinates.push(coordinates[0]);

        //OL 폴리곤 객체를 생성한다.
        var feature = new ol.Feature(new ol.geom.Polygon([coordinates]));

        //원형 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.5], //'rgba(0, 0, 255, 0.5)', //배열이나 rgba로 색상처리 모두 가능
                width: 2
            }),
            fill: new ol.style.Fill({
                color: [255, 255, 0, 0.5]
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'CapacityMilSym' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    function createTacticalLineGraphics() {
        if (board) {

            //createTacticalSymbol('G-G-OLAGS-----X', 'P', [[14075215.760046845, 4639182.956351638], [14050336.665007759, 4633563.614369038], [14047142.15264829, 4614501.100306114], [14060463.98435027, 4609449.185034035], [14066621.394510519, 4624721.656946203]]);
            //createTacticalSymbol('G*G*GAE---****X', 'S', [[14089891.669478944, 4743555.215017178], [14169997.675121808, 4768626.560294716], [14195069.020399347, 4712368.907476827], [14077661.744953316, 4712980.4037031075]]);
            //createTacticalSymbol('G*S*LCM---****X', 'N', [[14149206.803428238, 4459820.966022585], [14313518.629224917, 4537947.571734958]]);
            //createTacticalSymbol('G*G*GL6---****X', 'K', [[14350389.061874826, 4445145.05659185], [14244600.21472814, 4393779.373584212], [14195069.020399345, 4415793.237730343]]);
            //createTacticalSymbol('WO-DIOCS---L---', 'F', [[14350389.061874826, 4445145.05659185], [14244600.21472814, 4393779.373584212], [14195069.020399345, 4415793.237730343]]);

            //유선통신망
            createTacticalSymbol('G*G*GL5L--****X', 'F', [[14195069.020399345, 4415793.237730343], [14244600.21472814, 4393779.373584212], [14350389.061874826, 4445145.05659185]]);

            let objList = board.getObjectList();
            console.log(objList);

            for (let i = 0; i < objList.length; i++)
                console.log(objList[i].getZIndex());

            //도시요소로 생성된 정보를 3D 중첩용 JSON으로 저장
            // new D2.Core.TextEditorPopupUI().closeTextEditor();
            let json = board.exportJSONfor3D();
            D2.Core.GraphicUtil.download(json, 'graphic.json', 'text/plain');

            // objList[0].setVisible(false);
            //board.removeObject(1);
            //board.removeObject(2);


            //
            //objList[0].setVisible(true);


            // Polyline
            /*
            var polylineProp = new D2.Core.GraphicObjectProp('polyline');
            var polylineStyle = new D2.Core.GraphicObjectStyle();
            polylineStyle.fill.color[3] = 0;
            polylineProp.setCoordinate([[13975753.182046687, 4699927.676066701], [13976013.839338282, 4664939.219678825], [13988264.178486405, 4667396.04640542], [13984675.48184678, 4631340.084910335]]);
            var polylineObject = board.createObject(polylineProp, polylineStyle);
            polylineObject.createFeature(true);
            */

            function createTacticalSymbol(cd, aff, pos) {
                var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                var MSTacticalPolygonGraphics = new ICOPS.MSTacticalPolygonGraphics();
                aff = aff || '';
                if (MSTacticalLineGraphics.isExist(cd) == true) {
                    MSTacticalLineGraphics.setAffiliation(aff);
                    milSymbolProp = MSTacticalLineGraphics.getMSObject(cd);
                } else if (MSTacticalPolygonGraphics.isExist(cd) == true) {
                    MSTacticalPolygonGraphics.setAffiliation(aff);
                    milSymbolProp = MSTacticalPolygonGraphics.getMSObject(cd);
                } else
                    return;

                milSymbolProp.graphicObjProp.setCoordinate(pos);

                //현재 군대부호 객체가 제어 가능한 수식정보를 출력한다.
                console.log(milSymbolProp.graphicObjProp.msTextJSON);

                //현재 군대부호 객체에 대한 수식정보를 강제로 설정한다.
                milSymbolProp.graphicObjProp.msTextJSON = { "H": "활동사항", "H1": "활동사항1", "T": "고유명칭" };

                //현재 군대부호 객체에 대한 스타일 정보를 강제로 설정한다.
                milSymbolProp.graphicObjStyle.text.fontSize = 1.5174 * 7 * 0.8; //1.5174 * 부호크기(3 ~ 14) * 문자크기(0.2 ~ 5.0);

                milSymbolObject = board.createObject(milSymbolProp.graphicObjProp, milSymbolProp.graphicObjStyle);
                milSymbolObject.createFeature(true);
                milSymbolObject.name = cd;
            }
        }
    }

    // 22.11.08 추가
    // 군대부호 중첩 객체를 생성한다
    function createOverlapObject() {
        createMSPoint('S*A*WM----*****', 'F', [[14303915.348677434, 4572336.271658381]]);
        createMSPoint('SFS*NR----*****', 'H', [[14303915.348677434, 4572336.271658381]]);
        createMSPoint('SFA*CH----*****', 'W', [[14303915.348677434, 4572336.271658381]]);
        createMSPoint('SFP*L-----*****', 'P', [[14303915.348677434, 4572336.271658381]]);
        createMSPoint('SFP*L-----*****', 'J', [[14303915.348677434, 4572336.271658381]]);

        // 군대부호 - 점형객체를 만든다.
        function createMSPoint(cd, aff, pos) {
            // 해당 cd의 아이콘이 존재하는지 확인한다.
            var sym = new ICOPS.D2MS.ms.Symbol('');
            sym.setOptions({ SIDC: cd, size: 5, strokeWith: 4, addSymbol: "G*M*OMU---****X" });
            var validSymbol = isIE() ? sym.asCanvas().toDataURL('image/png', 1) : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sym.asSVG());
            if (validSymbol.length <= 227)
                return;

            var SIDC = cd.substring(0, 1) + aff + cd.substring(2, 15);
            milSymbolProp = new D2.Core.GraphicObjectProp('milSymbol');
            milSymbolProp.msKey = cd;
            milSymbolProp.msOriginKey = cd;
            milSymbolProp.msType = 'msPoint';
            milSymbolProp.setCoordinate(pos);
            milSymbolProp.options.SIDC = SIDC;
            milSymbolProp.options.size = 7; //군대부호 사이즈(3 ~ 14)
            milSymbolObject = board.createObject(milSymbolProp);
            milSymbolObject.createFeature(true);

            function isIE() { //IE11인지 체크  
                let agent = window.navigator.userAgent.toLowerCase();
                if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) return true;
                return false;
            }
        }
    }

    // 군대부호 중첩 객체를 선택한다.
    function selectOverlapObject() {
        var interaction = new D2.Core.ol.interaction.Pointer({
            handleDownEvent: handleDownEvent
        });
        // 인터렉션이 여러개 등록되지 않도록
        if (window.map.getTargetElement().classList.contains('selectOverlapObject') == false) {
            window.map.addInteraction(interaction);
            window.map.getTargetElement().classList.add('selectOverlapObject');
        }

        function handleDownEvent(evt) {
            var objectList = [];
            // 클릭한 좌표의 feature을 가져온다
            window.map.forEachFeatureAtPixel(
                evt.pixel,
                function (feature) {
                    objectList.push(feature.graphicObj);
                },
                {
                    hitTolerance: 3,
                    layerFilter: function (layer) {
                        return layer == board._graphicLayer;
                    },
                }
            );
            showResult(objectList, evt.pixel);
            window.map.removeInteraction(interaction);
            window.map.getTargetElement().classList.remove('selectOverlapObject');
        };

        // 결과를 화면에 도시한다.
        function showResult(objectList, pos) {
            if (objectList.length == 0)
                return;

            // 팝업 html 생성
            var popupElem, listElem, closeBtn;
            popupElem = document.createElement('div');

            // - 팝업 UI
            popupElem.style.minWidth = '300px';
            popupElem.style.minHeight = 0;
            popupElem.style.maxWidth = '500px';
            popupElem.style.padding = '10px 20px'
            popupElem.style.zIndex = 999999;
            popupElem.style.position = 'absolute';
            popupElem.style.background = 'rgba(51, 51, 51, 0.8)';
            popupElem.classList.add('initialCreate');

            // - 팝업 > ol UI
            listElem = document.createElement('ol');
            listElem.style.listStyle = 'none';
            listElem.style.padding = 0;
            listElem.style.display = 'flex';
            listElem.style.overflowX = 'auto';

            // - 팝업 > closeBtn
            closeBtn = document.createElement('span');
            closeBtn.innerHTML = 'X';
            closeBtn.style.padding = '5px';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = 0;
            closeBtn.style.right = 0;
            closeBtn.style.cursor = 'pointer';

            closeBtn.addEventListener('click', function () {
                popupElem.remove();
                document.body.removeEventListener('mousedown', removeInteraction);
            });
            popupElem.append(closeBtn);

            setObjectInfo(objectList);

            // 선택된 객체들을 팝업에 나타낸다
            function setObjectInfo(objectList) {
                listElem.innerHTML = '';
                for (var i = 0; i < objectList.length; i++) {
                    // html
                    // - li
                    var listItemElem, img;
                    listItemElem = document.createElement('li');
                    listItemElem.style.listStyle = 'inherit';
                    listItemElem.style.cursor = 'pointer';
                    listItemElem.style.width = '70px';
                    listItemElem.style.height = '70px';
                    listItemElem.dataset.guid = objectList[i].getGUID();

                    // - li > img
                    img = document.createElement('img');
                    img.src = getMilSymImg(objectList[i]._prop.options);
                    listItemElem.append(img);
                    listElem.append(listItemElem);

                    // - li 이벤트
                    // li(군대부호 이미지)를 클릭 시
                    // 선택한 객체를 강조시키고, 콘솔에 정보를 출력한다.
                    listItemElem.addEventListener('click', function () {
                        var clickObject;
                        var j = 0;
                        while (j < objectList.length) {
                            if (objectList[j].getGUID() == this.dataset.guid) {
                                clickObject = objectList.splice(j, 1)[0];
                                objectList.unshift(clickObject);
                                clickObject._prop.options.outlineColor = "#FFAF3A";
                                clickObject._prop.options.outlineWidth = 10;
                                if (j != 0)
                                    j = 0;
                            } else {
                                objectList[j]._prop.options.outlineWidth = 0;
                            }
                            objectList[j].setZIndex(objectList.length - j);
                            objectList[j].updateStyle();
                            this.parentElement.querySelector('li[data-guid="' + objectList[j].getGUID() + '"] img').src = getMilSymImg(objectList[j]._prop.options);
                            j++;
                        }

                        // 선택한 객체의 정보
                        console.log("선택한 객체의 정보 : ");
                        console.log(clickObject);
                    });
                }
            }
            popupElem.append(listElem);
            window.map.getTargetElement().append(popupElem);
            document.body.addEventListener('mousedown', removeInteraction);

            // 팝업이 화면을 넘어갈 경우
            if (pos[0] + popupElem.offsetWidth >= window.map.getTargetElement().offsetWidth) {
                pos[0] = window.map.getTargetElement().offsetWidth - popupElem.offsetWidth;
            }
            if (pos[1] + popupElem.offsetHeight >= window.map.getTargetElement().offsetHeight) {
                pos[1] = window.map.getTargetElement().offsetHeight - popupElem.offsetHeight;
            }
            popupElem.style.top = pos[1] + 'px';
            popupElem.style.left = pos[0] + 'px';

            // 사용된 interaction을 제거한다
            function removeInteraction(e) {
                if (popupElem.classList.contains('initialCreate')) {
                    popupElem.classList.remove('initialCreate');
                } else if (e.target != popupElem && popupElem.contains(e.target) == false) {
                    popupElem.remove();
                    document.body.removeEventListener('mousedown', removeInteraction);
                }
            }
        }

        function getMilSymImg(option) {
            var sym = new D2MS.ms.Symbol('');
            sym.setOptions(option);
            return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sym.asSVG());
        }
    }
    // ~

    //OL 기반 이미지 표시 예제
    function createImage() {
        //입력좌표값을 기준으로 원형 객체 좌표를 계산한다.
        var coordinateCenter = ol.proj.transform([127, 37.5], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환

        //OL 포인트객체를 생성한다.        
        var feature = new ol.Feature(new ol.geom.Point(coordinateCenter));

        var olStyle = new ol.style.Style({
            image: new ol.style.Icon({
                scale: 1,
                src: 'http://127.0.0.1:5501/src/image/truck.png'
            })
        });
        feature.setStyle(olStyle);
        feature.setProperties({ properties: { SIDC: 'ImageMilSym' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);
    }

    //폴리라인 등간격 좌표추출
    function createPolylineExtractCoordinate() {
        //입력좌표값을 기준으로 폴리라인 객체를 그린다.
        var geoCoordinates = [];
        geoCoordinates.push([126.926, 37.573]);
        geoCoordinates.push([127.371, 37.334]);
        geoCoordinates.push([127.699, 36.918]);
        geoCoordinates.push([128.633, 36.665]);
        geoCoordinates.push([129.01, 35.874]);
        geoCoordinates.push([129.19, 35.63]);
        geoCoordinates.push([127.6, 35.8]);
        /*var geoCoordinates = [
            [ 127.135712, 37.218205 ], [ 127.135948, 37.218169 ], [ 127.136059, 37.218318 ], [ 127.136284, 37.218618 ], [ 127.136734, 37.219218 ], [ 127.136996, 37.219551 ], [ 127.137337, 37.219989 ], [ 127.137548, 37.220443 ], [ 127.137596, 37.220488 ], [ 127.137691, 37.220537 ], [ 127.137844, 37.220569 ], [ 127.137993, 37.220605 ], [ 127.138148, 37.220689 ], [ 127.138299, 37.220844 ], [ 127.138399, 37.221071 ], [ 127.138439, 37.221117 ], [ 127.138494, 37.221154 ], [ 127.138553, 37.221193 ], [ 127.138713, 37.221273 ], [ 127.138803, 37.221393 ], [ 127.138916, 37.221897 ], [ 127.138996, 37.222049 ], [ 127.139104, 37.222142 ], [ 127.139247, 37.222194 ], [ 127.139429, 37.222224 ], [ 127.139716, 37.222199 ], [ 127.139945, 37.222235 ], [ 127.140249, 37.222328 ], [ 127.140417, 37.222376 ], [ 127.140834, 37.222425 ], [ 127.141329, 37.222467 ], [ 127.141428, 37.222467 ], [ 127.141543, 37.222439 ], [ 127.141582, 37.222413 ], [ 127.141954, 37.222157 ], [ 127.143297, 37.221002 ], [ 127.143487, 37.220924 ], [ 127.143654, 37.220934 ], [ 127.143826, 37.220992 ], [ 127.143987, 37.221118 ], [ 127.144018, 37.221222 ], [ 127.144030, 37.221551 ], [ 127.144085, 37.221660 ], [ 127.144145, 37.221720 ], [ 127.144662, 37.221953 ], [ 127.144745, 37.221967 ], [ 127.144897, 37.221967 ], [ 127.145001, 37.221925 ], [ 127.145096, 37.221862 ], [ 127.145282, 37.221547 ], [ 127.145376, 37.221474 ], [ 127.145386, 37.221471 ] ];*/

        //경위도 좌표값을 Google Mercator 좌표값을 환산한다.
        var coordinates = [];
        for (var i = 0; i < geoCoordinates.length; i++) {
            var coordinate = ol.proj.transform(geoCoordinates[i], 'EPSG:4326', 'EPSG:3857'); //경위도를 Google Mercator로 변환
            coordinates.push(coordinate);
        }

        //OL 라인객체를 생성한다.
        var feature = new ol.Feature(new ol.geom.LineString(coordinates));

        //폴리라인 객체에 스타일을 설정한다.
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 255, 0.8],
                width: 3
            }),
            zIndex: 500
        });
        feature.setStyle(style);
        feature.setProperties({ properties: { SIDC: 'Polyline' }, queryStatus: 0, visible: true });

        //객체 도시를 도시하도록 생성된 피쳐를 등록한다.
        olSource.addFeature(feature);

        //경위도 좌표값을 기준으로 등간격 경위도 좌표값을 얻어온다.
        var result = getEqualDistanceCoordinate(geoCoordinates, 500);
        for (var i = 0; i < result.length; i++) {
            var posMercator = toMercator(result[i]); //경위도 값을 화면 표시를 위해 Mercator로 전환한다.
            olSource.addFeature(addText(posMercator, '+'));
        }
        geoCoordinates.length = 0; //배열삭제
    }

    //경위도 배열값을 기준으로 equalDistance(m) 간격을 갖는 경위도 좌표값들을 리턴한다.
    function getEqualDistanceCoordinate(coordinates, equalDistance) {
        console.log('Input array : ', coordinates);

        var result = [];
        //두 지점간의 거리를 구한다.
        var line = {};
        var circle = {};
        var limit = 0;
        var interval = 2;
        var remainDistance = 0;

        for (let j = 0; j < coordinates.length - 1; j++) {
            var distance = getDistance(coordinates[j], coordinates[j + 1]);
            var start = toMercator(coordinates[j]); //경위도를 Google Mercator로 변환
            var end = toMercator(coordinates[j + 1]); //경위도를 Google Mercator로 변환
            var angle = GraphicUtil.getAngle(start[0], start[1], end[0], end[1]);

            //유효성 체크
            line.p1 = { x: start[0], y: start[1] };
            line.p2 = { x: end[0], y: end[1] };
            circle.center = {};

            //시작점에서 등간격의 위치를 구한다.
            var posMercator;
            var geoStart = toGeographic(start);

            //예외처리            
            j == 0 ? limit = interval : limit = 0;

            for (let i = 0; i < distance - limit; i += interval) {
                posMercator = getGeographicCoordinate(geoStart, angle, interval - remainDistance);

                circle.center.x = posMercator[0];
                circle.center.y = posMercator[1];
                circle.radius = interval;

                var rect = GraphicUtil.intersectCircleLine(circle, line);

                if (rect.length > 0) { //유효성 체크                                    
                    geoStart = toGeographic(posMercator);
                    result.push(geoStart);
                }
                remainDistance = 0;
            }
            console.log(j, posMercator, coordinates[j + 1]);
            remainDistance = getDistance(toGeographic(posMercator), coordinates[j + 1]);
        }

        //등간격에 좌표값을 구한다.
        var equalDistanceCoordinate = [];
        for (let k = 0; k < result.length; k += equalDistance * 0.5) {
            equalDistanceCoordinate.push(result[k]);
        }

        console.log('result array : ', result, equalDistanceCoordinate);
        result.length = 0;
        return equalDistanceCoordinate;
    }


    //경위도 좌표값을 Google Mercator 좌표값으로 변환한다.
    function toMercator(geographic) {
        return ol.proj.transform(geographic, 'EPSG:4326', 'EPSG:3857');
    }

    //Google Mercator 좌표값을 경위도 좌표값으로 변환한다.
    function toGeographic(mercator) {
        return ol.proj.transform(mercator, 'EPSG:3857', 'EPSG:4326');
    }

    //입력좌표값(google mercator)을 기준으로 각도(degree)/거리(m)만큼 떨어진 지점에 좌표값(google mercator)을 계산한다.
    function getMercatorCoordinate(mercatorCoordinate, angle, distance) {
        var epsg4326 = ol.proj.transform(mercatorCoordinate, 'EPSG:3857', 'EPSG:4326');  //Convert Google Mercator to geographic
        var result = window.spatialMath.destVincenty(epsg4326[0], epsg4326[1], angle, distance);
        return ol.proj.transform([result.lon, result.lat], 'EPSG:4326', 'EPSG:3857'); //Convert geographic to Google Mercator
    }

    //입력좌표값(경위도)을 기준으로 각도(degree)/거리(m)만큼 떨어진 지점에 좌표값(google mercator)을 계산한다.
    function getGeographicCoordinate(geographicCoordinate, angle, distance) {
        var result = window.spatialMath.destGeographic(geographicCoordinate[0], geographicCoordinate[1], angle, distance);
        return ol.proj.transform([result.lon, result.lat], 'EPSG:4326', 'EPSG:3857'); //Convert geographic to Google Mercator
    }

    //두 지점에 거리를 계산한다.
    function getDistance(c1, c2) {
        const radius = 6371008.8;
        const lat1 = window.spatialMath.toRad(c1[1]);
        const lat2 = window.spatialMath.toRad(c2[1]);
        const deltaLatBy2 = (lat2 - lat1) / 2;
        const deltaLonBy2 = window.spatialMath.toRad(c2[0] - c1[0]) / 2;
        const a = Math.sin(deltaLatBy2) * Math.sin(deltaLatBy2) + Math.sin(deltaLonBy2) * Math.sin(deltaLonBy2) * Math.cos(lat1) * Math.cos(lat2);
        return 2 * radius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }




















    //15자리 SIDC 코드값을 입력받아 기본부호인지, 작전활동부호 점, 선, 면형인지 리턴한다.
    //기본부호일 경우 리턴값 : 1
    //작전활동부호 점형일 경우 리턴값 : 2
    //작전황동부호 선형일 경우 리턴값 : 3
    //작전활동부호 면형일 경우 리턴값 : 4
    //무효한 부호일 경우 리턴값 0
    function getMilsymbolType() {
        var sidcArray = [
            'SFZ*------*****',
            'SFA*MF----*****',
            'G*T*B-----****X',
            'GFG*GPRN--****X',
            'G*G*GLB---****X',
            'G*G*GAE---****X',
            'WA-DBAIF----A--',
            'WO-DMCA----L---',
            'OFV*A-----*****',
            '124235345423453',
            '한글입력',
            'asdfasdfasdfasf',
        ];

        for (let i = 0; i < sidcArray.length; i++) {
            let type = D2.Core.MilSymbol.getMilSymbolType(sidcArray[i]);
            switch (type) {
                case 0:
                    console.log(sidcArray[i], '유효하지 않은 부호');
                    break;
                case 1:
                    console.log(sidcArray[i], '기본부호');
                    break;
                case 2:
                    console.log(sidcArray[i], '작전활동부호 점형');
                    break;
                case 3:
                    console.log(sidcArray[i], '작전활동부호 선형');
                    break;
                case 4:
                    console.log(sidcArray[i], '작전활동부호 면형');
                    break;
            }
        }

    }



    return {
        removeAll: removeAll,
        destroy: destroy,
        loadData: loadData,
        enableTooltip: enableTooltip,
        closeSelected: closeSelected,
        setVisibleMilSym: setVisibleMilSym,
        selectFeature: selectFeature,
        trackerClear: trackerClear,
        createPointMilSym: createPointMilSym,
        createPolylineMilSym: createPolylineMilSym,
        createPolygonMilSym: createPolygonMilSym,
        createCircleMilSym: createCircleMilSym,
        createCapacityMilSym: createCapacityMilSym,
        createTacticalLineGraphics: createTacticalLineGraphics,
        createEllipseMilSym: createEllipseMilSym,
        createEllipseMilSymEx: createEllipseMilSymEx,
        createRectangleMilSym: createRectangleMilSym,
        createImage: createImage,
        createPolylineExtractCoordinate: createPolylineExtractCoordinate,
        getMilsymbolType: getMilsymbolType,
        createOverlapObject: createOverlapObject,
        selectOverlapObject: selectOverlapObject
    };
}
