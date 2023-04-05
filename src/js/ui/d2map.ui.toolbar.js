$(function () {
    uiGraphicHandler();
    uiManageHandler();
    uiCalcHandler();
    uiQuickMove();
    uiCenterlineCoordType();
    uiAPIReferenceGuide();

    var GraphicUtil = D2.Core.GraphicUtil;
    $('#main-toolbar a').on('click', enableToolbarButton);

    // 투명도
    function uiGraphicHandler() {
        $('#tools-drawing-drawing').on('click', subMenuAppend);

        var GraphicObjectProp = D2.Core.GraphicObjectProp;
        var GraphicObjectStyle = D2.Core.GraphicObjectStyle;
        // 서브툴바의 메뉴 선택
        $(document).on('click', '#sub-toolbar a', function () {
            var thisId = $(this).attr('id').toLowerCase();
            $(this).siblings().removeClass('toggle');
            $(this).addClass('toggle');
            if (!$('#popup-layer').is(':visible')) $('#toolbar-popup > div').hide();
            thisId = thisId.splitPop('-');
            window.eventManager.setMapMode('graphic');
            switch (thisId) {
                case 'layer':
                    subPopupMenu(thisId);
                    $(this).toggleClass('');
                    break;
                case 'select':
                    window.graphic.muteMode();
                    window.graphic.selectMode();
                    break;
                case 'point':
                    var objProp = new GraphicObjectProp('point');
                    window.graphic.createMode(objProp);
                    break;
                case 'text':
                    // subPopupMenu(thisId);
                    var objProp = new GraphicObjectProp('textEditor');
                    var objStyle = new GraphicObjectStyle();
                    objStyle.fill.color = [255, 255, 255, 1];
                    objStyle.line.color = [0, 0, 0, 1];
                    objStyle.line.width = 1;
                    window.graphic.createMode(objProp, objStyle);
                    break;
                case 'table':
                    var objProp = new GraphicObjectProp('table');
                    var objStyle = new GraphicObjectStyle();
                    objProp.column = 4;
                    objProp.row = 3;
                    objStyle.fill.color = [255, 255, 255, 1];
                    objStyle.line.color = [238, 238, 238, 1];
                    objStyle.line.width = 1;
                    window.graphic.createMode(objProp, objStyle);
                    break;
                case 'rectangle':
                    var objProp = new GraphicObjectProp('rectangle');
                    window.graphic.createMode(objProp);
                    break;
                case 'rectangleround':
                    var objProp = new GraphicObjectProp('rectangle');
                    objProp.radius = 50;
                    window.graphic.createMode(objProp);
                    break;
                case 'ellipse':
                    var objProp = new GraphicObjectProp('ellipse');
                    window.graphic.createMode(objProp);
                    break;
                case 'triangle':
                    var objProp = new GraphicObjectProp('triangle');
                    window.graphic.createMode(objProp);
                    break;
                case 'arc1':
                    var objProp = new GraphicObjectProp('arc');
                    objProp.lineType = 1;
                    objProp.fillType = 2;
                    window.graphic.createMode(objProp);
                    break;
                case 'arc2':
                    var objProp = new GraphicObjectProp('arc');
                    objProp.lineType = 1;
                    objProp.fillType = 3;
                    window.graphic.createMode(objProp);
                    break;
                case 'arc3':
                    var objProp = new GraphicObjectProp('arc');
                    objProp.lineType = 2;
                    window.graphic.createMode(objProp);
                    break;
                case 'arc4':
                    var objProp = new GraphicObjectProp('arc');
                    objProp.lineType = 3;
                    window.graphic.createMode(objProp);
                    break;
                case 'polyline':
                    var objProp = new GraphicObjectProp('polyline');
                    var objStyle = new GraphicObjectStyle();
                    objStyle.fill.color[3] = [0];
                    window.graphic.createMode(objProp, objStyle);
                    break;
                case 'polygon':
                    var objProp = new GraphicObjectProp('polyline');
                    objProp.close = 1;
                    window.graphic.createMode(objProp);
                    break;
                case 'spline':
                    var objProp = new GraphicObjectProp('polyline');
                    var objStyle = new GraphicObjectStyle();
                    objStyle.fill.color[3] = [0];
                    objProp.lineType = 1;
                    window.graphic.createMode(objProp, objStyle);
                    break;
                case 'splineclosed':
                    var objProp = new GraphicObjectProp('polyline');
                    objProp.lineType = 1;
                    objProp.close = 1;
                    window.graphic.createMode(objProp);
                    break;
                case 'image':
                    $('#drawing-img-source').trigger('click');
                    break;
                case 'milsymbol':
                    subPopupMenu(thisId);
                    break;
            }

            function subPopupMenu(id) {
                $('#toolbar-popup>div').hide();
                id = '#popup-' + id;
                $(id).css('display', 'block');
            }
        });
        // 서브팝업의 닫기 버튼 선택
        $('.close-btn a').on('click', function () {
            $(this).parents('#toolbar-popup div').hide();
        });
        // Text 추가
        $('#popup-text-add').on('click', function () {
            window.eventManager.setMapMode('graphic');
            var text = $('#popup-text-value').val() || '';
            if (text == '') {
                alert('텍스트를 입력해주세요.');
                return false;
            }
            var objProp = new GraphicObjectProp('rectangle');
            objProp.name = 'text';
            objProp.text = text;
            // 빈 사각형을 만들어준다.
            let objStyle = new GraphicObjectStyle();
            objStyle.line.color[3] = 0;
            objStyle.fill.color[3] = 0;
            window.graphic.createMode(objProp, objStyle);
            $('#popup-text-value').val('');
        });

        // Milsymbol Drawing 부 항목 Add 버튼 클릭
        $('a#d2map_milsymbol-drawing-sub-explorer-add').on('click', function () {
            var cd = $('#d2map_milsymbol-sub-explorer-sidc').val();
            if (cd == '') return;
            var sym = new ICOPS.D2MS.ms.Symbol('');
            var image;
            var options = {
                SIDC: cd,
            };
            sym.setOptions(options);
            image = sym.asCanvas().toDataURL('image/png', 1);
            if (image.length < 119) {
                alert("Because it's not the valid military symbol code, it can not be added.");
                return false;
            }
            var objProp = new D2.Core.GraphicObjectProp('milSymbol');
            objProp.options.SIDC = cd;
            objProp.msType = 'msPoint';
            window.graphic.createMode(objProp);
        });
        // Drawing - image 클릭
        $('#drawing-img-source').on('change', function () {
            var GraphicObjectProp = D2.Core.GraphicObjectProp;
            var input = document.querySelector('#drawing-img-source');
            var fileList = input.files;
            var fileTypes = ['jpg', 'jpeg', 'png', 'bmp'];
            if (fileList.length <= 0) return;
            if (window.FileReader) {
                try {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        window.eventManager.setMapMode('graphic');
                        var objProp = new GraphicObjectProp('image');
                        objProp.imgDataURL = e.target.result;
                        window.graphic.createMode(objProp);

                        //같은파일 을 선택 할 수 있도록 공백처리
                        $('#drawing-img-source').val('');
                    };
                    var extension = fileList[0].name.splitPop('.').toLowerCase();
                    var isSuccess = fileTypes.indexOf(extension) > -1;
                    if (isSuccess == false) throw 'Please select an image file (png, jpg, bmp)';

                    if (fileList[0].size > 1 * 1024 * 1024)
                        // 1M
                        throw 'Only files less than 1MB are supported.';

                    reader.readAsDataURL(fileList[0]);
                } catch (e) {
                    alert(e);
                }
            }
        });

        manageLayer();

        // 서브 툴바를 연다.
        function subMenuAppend() {
            var thisId = $(this).attr('id');
            thisId = thisId.splitPop('-');
            $('#sub-toolbar > div a').removeClass('toggle');

            if (thisId == 'drawing') {
                window.eventManager.setMapMode('graphic');
                $('#tools-management-default').removeClass();
                $('#drawing-select').addClass('toggle');
                window.graphic.muteMode();
                window.graphic.selectMode();
            }
            $('#sub-toolbar-' + thisId)
                .siblings()
                .removeClass('enable');
            $('#sub-toolbar-' + thisId).toggleClass('enable');
        }

        // 레이어 이벤트 관리
        function manageLayer() {
            $('#layer-controller a').on('click', layerBtnHandler);
            // 레이어 열기
            $('#layer-open-file').on('change', function () {
                var self = this;
                var reader = new FileReader();
                var file = self.files[0];

                reader.onload = function (e) {
                    try {
                        var index = window.graphic.addGraphicBoard();
                        var board = window.graphic.getGraphicBoard(index);
                        window.graphic.setSelectGraphicBoard(index);
                        if (board != null) board.importJSON(JSON.parse(e.target.result));
                        self.value = '';
                    } catch (e) {
                        console.log(e);
                    }
                };
                reader.readAsText(file);
            });
            // 레이어 선택
            $(document).on('click', '.layer-list-content', function (evnet) {
                if (event.target.tagName == 'INPUT') return;
                $(this).siblings().removeClass('selected');
                $(this).addClass('selected');

                var selectIndex = $('#layer-list > span').index(this);
                var length = window.graphic.getGraphicBoardCount() - 1;
                selectIndex = length - selectIndex;
                window.graphic.setSelectGraphicBoard(selectIndex);
            });
            // 그래픽보드 이름 바꾸기
            $(document).on('dblclick', '.layer-list-content', function () {
                var $this = $(this).children('span');
                var isEditable = $this.attr('contenteditable');
                if (isEditable != 'true') {
                    $($this).attr('contenteditable', true);
                    $($this).focus();
                }
            });

            // 그래픽 보드 change 이벤트
            $(document).on('change focusout', '.layer-list-content span', function () {
                var index = $(this).parent().index();
                index = window.graphic.getGraphicBoardCount() - index - 1;
                var board = window.graphic.getGraphicBoard(index);
                board.setName($(this).text());
                $(this).attr('contenteditable', false);
            });

            // 그래픽 보드 이름 수정 시작
            // 커서를 맨 끝으로 옮긴다.
            $(document).on('focus', '.layer-list-content span', function () {
                var el = this.childNodes[0];
                var length = this.innerText.length;
                var range = document.createRange();
                var selection = window.getSelection();

                range.setStart(el, length);
                range.setEnd(el, length);

                selection.removeAllRanges();
                selection.addRange(range);
            });

            // 엔터키를 누르면 편집이 종료된다.
            $(document).on('keydown', '.layer-list-content span', function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    $(this).attr('contenteditable', false);
                }
            });

            // 그래픽보드 글자수 제한
            $(document).on('input', '.layer-list-content span', function (e) {
                if (this.innerText.length > 20) {
                    this.innerText = this.innerText.slice(0, 20);
                    $(this).trigger('focus');
                }
            });

            // 그래픽 보드 도시상태 수정
            $(document).on('change', '.layer-list-content input', function () {
                var index = $(this).parent().index();
                var isChecked = $(this).is(':checked');
                index = window.graphic.getGraphicBoardCount() - index - 1;
                var board = window.graphic.getGraphicBoard(index);
                board.setVisible(isChecked);
            });

            function layerBtnHandler() {
                var thisID = $(this).attr('id').splitPop('-');
                var board = window.graphic.getSelectGraphicBoard();
                $('#layer-list input').trigger('change');
                switch (thisID) {
                    case 'new':
                        window.graphicLayerUI.addBoard();
                        break;
                    case 'open':
                        $('#layer-open-file').trigger('click');
                        break;
                    case 'save':
                        if (!board) return false;
                        if (board) D2.Core.GraphicUtil.download(board.save(), 'graphic.json', 'text/plain');
                        break;
                    case 'delete':
                        if (!board) return false;
                        window.graphicLayerUI.removeBoard();
                        break;
                }
            }
        }
    }

    // 관리
    function uiManageHandler() {
        $('#tools-management a').on('click', function () {
            var thisId = $(this).attr('id').splitPop('-');
            switch (thisId) {
                case 'default':
                    defaultMode();
                    break;
                case 'save':
                    pngDownload();
                    break;
                case 'grid':
                    $('.ui-popup').hide();
                    $('#popup-grid').toggle();
                    break;
                case 'centerline':
                    centerline();
                    break;
            }
            // 지도 기본 모드
            function defaultMode() {
                window.eventManager.setMapMode('graphic');
                window.graphic.muteMode();
            }
            // 중심선
            function centerline() {
                $('#tools-management-centerline').toggleClass('checked');
                var checked = $('#tools-management-centerline').hasClass('checked');

                var centerStyle = window.postComposeCtrl.getCenterLineStyle();
                centerStyle.text.offsetY = 10; //좌표 표시를 위한 Y축 Offset값
                centerStyle.coordType = 'geo'; //좌표표시 방식설정, 문자열로 geo, utm, mgrs, georef, gars로 입력 가능
                window.postComposeCtrl.setCenterLineUpdateStyle();

                // 2021년12월8일패치 : CenterLine, 좌표 도시 설정 추가 (두번째 인자)
                window.postComposeCtrl.setCenterLineVisible(checked, checked);
            }
            // 지도 저장
            function pngDownload() {
                // window.exportImage.setFileName([파일명]);
                window.exportImage.downloadPNG();
            }
        });
    }

    // 빠른이동
    function uiQuickMove() {
        $('#tools-movement-where').on('change', function () {
            var where = $(this).val();
            var olProj = ol.proj;
            var pos = olProj.fromLonLat([127.027583, 37.497928]);
            var zoom = 7;
            switch (where) {
                case 'world':
                    zoom = 3;
                    break;
                case 'eastasia':
                    pos = olProj.fromLonLat([105.027583, 38.497928]);
                    zoom = 5;
                    break;
                case 'korea':
                    pos = olProj.fromLonLat([127.027583, 38.497928]);
                    break;
                case 'westsea':
                    pos = olProj.fromLonLat([123.027583, 37.497928]);
                    break;
                case 'eastsea':
                    pos = olProj.fromLonLat([130.027583, 37.497928]);
                    break;
            }
            window.map.getView().animate({
                center: pos,
                zoom: zoom,
                duration: 1500,
            });

            $(this).val('none');
        });
    }

    //중심선 좌표 형식 표시
    function uiCenterlineCoordType() {
        $('#tools-centerline-coodrdtype-where').on('change', function () {
            var type = $(this).val();
            console.log(type);

            var centerStyle = window.postComposeCtrl.getCenterLineStyle();
            centerStyle.text.offsetY = 10; //좌표 표시를 위한 Y축 Offset값
            centerStyle.coordType = type; //좌표표시 방식설정, 문자열로 geo, utm, mgrs, georef, gars로 입력 가능
            window.postComposeCtrl.setCenterLineUpdateStyle();
        });
    }

    // 계산
    function uiCalcHandler() {
        $('#tools-calculation a').on('click', function (param, clear) {
            var thisId = $(this).attr('id');
            thisId = thisId.splitPop('-');
            switch (thisId) {
                case 'dist':
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리                    
                    $('#tools-management-default').removeClass();

                    // 직접 작도하는 경우 지점별 GoogleMercator 좌표값을 리턴한다.
                    window.distance.createDistance(/*callbackArray => {
                        //좌표 환산 결과 콘솔창에 표시
                        for(var i=0; i<callbackArray.length; i++) {
                            var geo = D2.Core.ol.proj.transform(callbackArray[i], 'EPSG:3857', 'EPSG:4326');
                            var mgrs = window.CoordManager.Geo2MGRS(geo[0], geo[1]);
                            console.log(i, geo, mgrs.toString());
                        }
                    }*/);

                    var unit = $('#tools-calculation-distunit').attr('class').replace(' toggle', '').splitPop('-');
                    window.distance.setSpeed(0); //속도가 0이면 소요시간 출력 안함
                    window.distance.setBearing(true); //방위각 표시
                    window.distance.setUnit(unit);
                    break;
                //거리 계산시 소요시간 표시를 위한 모드 분리
                case 'elapse':
                    window.eventManager.setMapMode('terrainAnalysis');
                    $('#tools-management-default').removeClass();

                    // 직접 작도하는 경우 지점별 GoogleMercator 좌표값을 리턴한다.
                    window.distanceElapseTime.createDistance();

                    var unit = $('#tools-calculation-distunit').attr('class').replace(' toggle', '').splitPop('-');
                    window.distanceElapseTime.setSpeed(60); //속도가 0이면 소요시간 출력 안함
                    window.distanceElapseTime.setBearing(true); //방위각 표시
                    window.distanceElapseTime.setUnit(unit);
                    break;
                case 'distunit':
                    setUnit('tools-calculation-distunit');
                    break;
                case 'area':
                    //clearAnalysis(clear == undefined);                    
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리
                    $('#tools-management-default').removeClass();

                    // 직접 작도하는 경우 지점별 GoogleMercator 좌표값을 리턴한다.
                    window.area.createArea(/*callbackArray => {
                        //좌표 환산 결과 콘솔창에 표시
                        for(var i=0; i<callbackArray.length; i++) {
                            var geo = D2.Core.ol.proj.transform(callbackArray[i], 'EPSG:3857', 'EPSG:4326');
                            var mgrs = window.CoordManager.Geo2MGRS(geo[0], geo[1]);
                            console.log(i, geo, mgrs.toString());
                        }                        
                    }*/);

                    var unit = $('#tools-calculation-areaunit').attr('class').replace(' toggle', '').splitPop('-');
                    window.area.setUnit(unit);
                    break;
                case 'areaunit':
                    setUnit('tools-calculation-areaunit');
                    break;
                case 'remove':
                    clearAnalysis(true);
                    window.eventManager.setMapMode('default');
                    break;
                case 'point':
                    //clearAnalysis(true);
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리
                    // 클립보드로 좌표가 정상 복사되면 콜백으로 처리결과 리턴
                    // 가능한 타입: MGRS, Geographic 
                    var clipboardOptions = {
                        type: 'MGRS',
                        visibleGuideLine: false
                    };
                    window.clipboardCoordinate.createClipboard(clipboardOptions, function (result) {
                        if (result === true) {
                            console.log(window.clipboardCoordinate.getCoordinates()); //좌표값 문자열로 얻어오기
                            alert('Copy coordinates to clipboard');
                        }
                        else {
                            alert('Copy Failed');
                        }
                    });
                    break;
                case 'viewshed':
                    //clearAnalysis(true);
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리
                    //window.graphic.muteMode();
                    $('.ui-popup').hide();
                    $('#popup-viewshed').show();
                    break;
                case 'elevation':
                    //clearAnalysis(true);
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리
                    window.heightBillboard.createBillboard();
                    break;
                case 'crosschart':
                    $('.ui-popup').hide();
                    //clearAnalysis(true);
                    window.eventManager.setMapMode('terrainAnalysis'); //2021년12월8일패치 : measurement 모드를 terrainAnalysis로 통합하여 관리
                    // 22.11.10 추가
                    // 지형 분석 콜백 추가
                    window.crossSection.createCrossSection(function (data) {
                        console.log("지형 분석 데이터 : ");
                        console.log(data);
                    });
                    break;
            }
        });

        //좌표값을 배열로 정의하여 일괄 거리 측정
        $('#create-distance-by-coordinates').on('click', function () {
            let geoCoordinates = [];
            geoCoordinates.push([126, 37]);
            geoCoordinates.push([127, 38]);
            geoCoordinates.push([128, 37]);
            geoCoordinates.push([129, 38]);

            window.eventManager.setMapMode('terrainAnalysis');
            window.distance.setSpeed(Math.random() * 100 + 30); //km/h 랜덤 속도로 표시
            window.distance.addCoordinates(geoCoordinates);
            window.distance.setBearing(true); //방위각 표시
            window.distance.setUnit('meter'); //meter, mile, nautical-mile 지원            
        });


        //좌표값을 배열로 정의하여 일괄 면적 측정
        $('#create-area-by-coordinates').on('click', function () {
            let geoCoordinates = [];
            geoCoordinates.push([126, 38]);
            geoCoordinates.push([128, 39]);
            geoCoordinates.push([128, 37]);
            geoCoordinates.push([127, 37]);

            window.eventManager.setMapMode('terrainAnalysis');
            window.area.addCoordinates(geoCoordinates);
            window.area.setUnit('meter'); //meter, mile, nauticalmile 지원	    
        });

        function clearAnalysis(clear) {
            if (clear)
                window.TerrainAnalysisManager.clear(); //2021년12월8일패치 : MeasurementManager를 TerrainAnalysis로 통합하여 관리        
        }

        // 거리, 면적 단위 조정
        function setUnit(id) {
            id = '#' + id;
            var className = $(id).attr('class').replace(' toggle', '').split('-');
            if (className.length == 1) return false;
            var unit = className.pop();
            var type = className.shift();

            switch (unit) {
                case 'meter':
                    unit = 'mile';
                    break;
                case 'mile':
                    unit = 'nauticalmile';
                    if (type == 'area') unit = 'meter';
                    break;
                case 'nauticalmile':
                    unit = 'meter';
                    break;
            }
            type == 'dist' ? window.distance.setUnit(unit) : window.area.setUnit(unit);
            $(id).removeClass();
            className.unshift(type);
            className.push(unit);
            className = className.join('-');
            $(id).addClass(className);
            $('#tools-calculation-' + type).trigger('click', false);
            $('#tools-calculation-' + type).addClass('toggle');
        }
    }

    // 공통 속성
    $(document).on('propertychange change keyup paste input', 'input[name="common-style-input"]', function (e) {
        var tId = $(this).attr('id').splitPop('-');
        var style
        var color = $('#common-' + tId).val();
        if (color !== undefined) {
            var r = color.slice(1, 3);
            var g = color.slice(3, 5);
            var b = color.slice(5, 7);
        }

        var objList = window.graphic.getSelectObjectList();
        objList = GraphicUtil.getObject(objList);  // 그룹 객체 내 자식 객체를 포함한 모든 객체를 반환한다.

        // 분류
        switch (tId) {
            case "linecolor":
                objList.forEach((obj) => {
                    var parent = GraphicUtil.getObjParent(obj);
                    style = obj._style;
                    style.line.color[0] = parseInt(r, 16);
                    style.line.color[1] = parseInt(g, 16);
                    style.line.color[2] = parseInt(b, 16);
                    GraphicUtil.createLineArrow(obj);

                    if (obj._prop.type === "milSymbol") { // graphic 인지 milSymbol인지 구분이 필요함
                        var tColor = GraphicUtil.hex2rgb($(this).val() + getAlpha('stroke'));
                        obj._style.line.color = tColor;

                        if (obj._style.line.colorExt != undefined) obj._style.line.colorExt = tColor;
                        if (obj._style.marker.color != undefined) obj._style.marker.color = tColor;
                        if (obj._prop.msKey == 'G-M-OAR-------X') obj._style.fill.color = tColor;
                    }

                    obj.updateStyle(true);

                    if (parent._prop.type == 'group') {
                        parent.updateRotateFeature();
                    }
                });
                break;
            case "width":
                objList.forEach((obj) => {
                    var parent = GraphicUtil.getObjParent(obj);
                    var value = Number($('#common-line-' + tId).val());
                    if (value > 10) value = 10;

                    $('#common-line-width').val(value);
                    style = obj._style;

                    if (obj._prop.type === "milSymbol") { // 군대부호 선굵기 수정 - 속성 창 선굵기 옵션 참고
                        var msLineRatio;
                        if (value < 4) {
                            msLineRatio = 0.5;
                            $('#d2map_ms-style-nonpoint-lineWidth option:eq(0)').prop('selected', true);
                        } else if (3 < value && value < 7) {
                            msLineRatio = 1;
                            $('#d2map_ms-style-nonpoint-lineWidth option:eq(1)').prop('selected', true);
                        } else if (6 < value && value < 11) {
                            msLineRatio = 3;
                            $('#d2map_ms-style-nonpoint-lineWidth option:eq(2)').prop('selected', true);
                        }
                        obj._prop.msLineRatio = msLineRatio;
                    }

                    style.line.width = (obj._prop.type === "milSymbol" ? obj._prop.msOldStyle.lineWidth * obj._prop.msLineRatio * obj._prop.msSize : value);

                    obj.updateStyle(true);

                    if (parent._prop.type == 'group') {
                        parent.updateRotateFeature();
                    }
                });
                break;
            case "fillcolor":
                objList.forEach((obj) => {
                    var parent = GraphicUtil.getObjParent(obj);
                    style = obj._style;
                    if (style.fill.color != undefined) {
                        style.fill.color[0] = parseInt(r, 16);
                        style.fill.color[1] = parseInt(g, 16);
                        style.fill.color[2] = parseInt(b, 16);
                    }

                    if (obj._prop.type === "milSymbol") { // graphic 인지 milSymbol인지 구분이 필요함
                        let tColor = GraphicUtil.hex2rgb($(this).val() + getAlpha('fill'));
                        obj._style.fill.color = tColor;
                        if (obj._style.fill.colorExt != undefined) obj._style.fill.colorExt = tColor;
                    }

                    obj.updateStyle(true);

                    if (parent._prop.type == 'group') {
                        parent.updateRotateFeature();
                    }
                });
                break;
        }

        window.graphic._selectObjectManager.selectObject();
        var graphicBoard = window.graphic.getSelectGraphicBoard();
        if (graphicBoard && event.type == 'change') {
            graphicBoard.undoRedoSave();
        }

        // UI의 alpha값을 hex값으로 변환해서 반환한다.
        function getAlpha(type) {
            var uiVal = 255;
            var alpha;
            $('#d2map_ms-style-nonpoint-' + type + 'Alpha').val(uiVal);
            alpha = parseInt(uiVal, 10).toString(16);
            if (alpha.length == 1) alpha = '0' + alpha;
            return alpha;
        }
    });

    // 아이콘을 활성화한다.
    function enableToolbarButton(e) {
        var thisId = $(this).attr('id').splitPop('-');
        switch (thisId) {
            case 'default':
            case 'dist':
            case 'elapse':
            case 'area':
            case 'grid':
            case 'point':
            case 'viewshed':
                $('#sub-toolbar > div').removeClass('enable');
            case 'drawing':
                $('#toolbar-popup > div').hide();
                if (thisId != 'viewshed') $('#popup-viewshed').hide();
                if (thisId != 'grid') $('#popup-grid').hide();
                if (thisId != 'crosschart') $('.d2map_selected-cs').hide();
                var isDrawing = thisId == 'drawing' && $(this).hasClass('toggle');
                $('#main-toolbar a').removeClass('toggle');
                if (!isDrawing) $(this).addClass('toggle');
                break;
            case 'elevation':
                $('#toolbar-popup > div').hide();
                if (thisId != 'viewshed') $('#popup-viewshed').hide();
                if (thisId != 'grid') $('#popup-grid').hide();
                if (thisId != 'crosschart') $('.d2map_selected-cs').hide();
                var isDrawing2 = thisId == 'drawing' && $(this).hasClass('toggle');
                $('#main-toolbar a').removeClass('toggle');
                if (!isDrawing2) $(this).addClass('toggle');
                break;
            case 'crosschart':
                $('#toolbar-popup > div').hide();
                if (thisId != 'viewshed') $('#popup-viewshed').hide();
                if (thisId != 'grid') $('#popup-grid').hide();
                if (thisId != 'crosschart') $('.d2map_selected-cs').hide();
                var isDrawing = thisId == 'drawing' && $(this).hasClass('toggle');
                $('#main-toolbar a').removeClass('toggle');
                if (!isDrawing) $(this).addClass('toggle');
                break;
            default:
                if (thisId == 'areaunit' || thisId == 'distunit') break;
                if ($(this).parent().attr('id') == 'tools-management') return;
                $('.toggle').removeClass('toggle');
                $('#tools-management-default').trigger('click');
                break;
        }
    }

    //API Reference Guide 페이지를 실행한다.
    function uiAPIReferenceGuide() {
        $('#tools-api-reference-guide').on('click', function () {
            window.open('../../../api/apidoc/', 'parent'); //새로운 탭에 표시한다.
        });
    }


});

