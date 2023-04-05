async function initSidebarGraphicApp() {
    var graphic = window.graphic;
    var arcTypeIndex = 0;
    var GraphicObjectProp = D2.Core.GraphicObjectProp;
    var GraphicObjectStyle = D2.Core.GraphicObjectStyle;
    var multiLineTextPosition = [[300, 100], []];

    $('.graphiclayer-object-exampleButton a').on('click', function () {
        var tid = $(this).attr('id').splitPop('-');
        var selectObject = graphic.getSelectObjectList()[0];
        switch (tid) {
            case 'initialize':
                // 모든 투명도 레이어를 삭제한다.
                var graphicBoard = graphic._graphicBoard;
                const graphicBoardLength = graphicBoard.length;
                for (var i = graphicBoardLength - 1; i >= 0; i--)
                    graphic.removeGraphicBoard(i);
                break;
            case 'create':
                var createID = $('#graphiclayer-object-createMode').val();
                switch (createID) {
                    case 'createMode1':
                        // 투명도 생성 모드 단축기 예제 1 - 드래그 polyline
                        var objProp = new GraphicObjectProp('polyline');
                        var objStyle = new GraphicObjectStyle();
                        objStyle.fill.color[3] = [0];
                        objProp.dragCreating = true;
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode2':
                        // 투명도 생성 모드 단축기 예제 2 - 드래그, 선 끝모양 polyline
                        var objProp = new GraphicObjectProp('polyline');
                        var objStyle = new GraphicObjectStyle();
                        objStyle.fill.color[3] = [0];
                        objProp.dragCreating = true;
                        objStyle.line.arrow.begin.type = 'arrow';
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode3':
                        // 투명도 생성 모드 단축기 예제 3 - 드래그, 선 끝모양 polyline
                        var objProp = new GraphicObjectProp('polyline');
                        var objStyle = new GraphicObjectStyle();
                        objStyle.fill.color[3] = [0];
                        objProp.dragCreating = true;
                        objStyle.line.arrow.begin.type = 'arrow';
                        objStyle.line.arrow.end.type = 'triangle';
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode4':
                        // 투명도 생성 모드 단축기 예제 4 - 선 끝모양 polyline
                        var objProp = new GraphicObjectProp('polyline');
                        var objStyle = new GraphicObjectStyle();
                        objStyle.fill.color[3] = [0];
                        objStyle.line.arrow.begin.type = 'arrow';
                        objStyle.line.arrow.end.type = 'triangle';
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode5':
                        // 투명도 생성 모드 단축기 예제 5 - 원
                        var objProp = new GraphicObjectProp('ellipse');
                        var objStyle = new GraphicObjectStyle();
                        objProp.sameRatio = true;
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode6':
                        // 투명도 생성 모드 단축기 예제 6 - 정다각형
                        var objProp = new GraphicObjectProp('regularPolygon');
                        var objStyle = new GraphicObjectStyle();
                        objProp.angleCount = 5;
                        objProp.sameRatio = true;
                        graphic.createMode(objProp, objStyle);
                        break;
                    case 'createMode7':
                        // 투명도 생성 모드 단축기 예제 7 - 작전활동부호 선형(우회)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*T*Y-----****X');
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode8':
                        // 투명도 생성 모드 단축기 예제 8 - 작전활동부호 선형(방위호형)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*AAA---****X');
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode9':
                        // 투명도 생성 모드 단축기 예제 9 - 작전활동부호 선형(지상조공전진축)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*OLAGS-****X');
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode10':
                        // 투명도 생성 모드 단축기 예제 10 - 작전활동부호 선형(아군항공전진축)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*OLAV--****X');
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode11':
                        // 투명도 생성 모드 단축기 예제 11 - 작전활동부호 선형(경계-사단)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*GLB---****X');
                        milSymbolObject.graphicObjProp.textExt = "Down";
                        milSymbolObject.graphicObjProp.textExt2 = "Up";
                        milSymbolObject.graphicObjProp.textExt4 = "I";
                        console.log(milSymbolObject);
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode12':
                        // 투명도 생성 모드 단축기 예제 12 - 작전활동부호 선형(경계-군단)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*GLB---****X');
                        milSymbolObject.graphicObjProp.textExt = "123";
                        milSymbolObject.graphicObjProp.textExt2 = "567";
                        milSymbolObject.graphicObjProp.textExt4 = "J";
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode13':
                        // 투명도 생성 모드 단축기 예제 13 - 작전활동부호 면형(공두보)
                        var MSTacticalPolygonGraphics = new ICOPS.MSTacticalPolygonGraphics();
                        var milSymbolObject = MSTacticalPolygonGraphics.getMSObject('G*G*SAA---****X');
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode14':
                        // 투명도 생성 모드 단축기 예제 14 - 작전활동부호 선형(엄폐)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('GFT-UC--------X') // 엄폐;
                        // var milSymbolObject = MSTacticalLineGraphics.getMSObject('GFT-UG--------X') // 경비;
                        // var milSymbolObject = MSTacticalLineGraphics.getMSObject('GFT-UP--------X') // 방호;
                        // var milSymbolObject = MSTacticalLineGraphics.getMSObject('GFT-US--------X') // 차장;
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMode15':
                        // 투명도 생성 모드 단축기 예제 15 - 작전활동부호 선형(비행회랑)
                        var MSTacticalLineGraphics = new ICOPS.MSTacticalLineGraphics();
                        var milSymbolObject = MSTacticalLineGraphics.getMSObject('G*G*ALC---****X') // 비행회랑;
                        milSymbolObject.graphicObjProp.msTextJSON.AM = 30000;
                        graphic.createMode(milSymbolObject.graphicObjProp, milSymbolObject.graphicObjStyle);
                        break;
                    case 'createMilSymbol1':
                        // 무선통신망 생성
                        var board = graphic.getSelectGraphicBoard();
                        graphic.selectMode();
                        createTacticalSymbol('G*G*GL5W--****X', 'F', [[13876479.486506728, 4631345.657494538], [14151041.292107081, 4654582.514093231], [13963923.44686497, 4523722.3216690095], [14154098.773238488, 4534117.757515794], [14086834.188347533, 4444227.8122524265], [14253772.658122357, 4409372.527354387], [14294131.409056932, 4564692.568829864]]);

                        //폭파예정
                        //createTacticalSymbol('GFM*ORP-------X', 'F', [ [13876479.486506728, 4631345.657494538], [14151041.292107081, 4654582.514093231], [13963923.44686497, 4523722.3216690095] ]);

                        //폭파준비2
                        //createTacticalSymbol('GFM*ORA-------X', 'F', [ [13876479.486506728, 4631345.657494538], [14151041.292107081, 4654582.514093231], [13963923.44686497, 4523722.3216690095] ]);

                        //도로봉쇄완료
                        //createTacticalSymbol('GFM-ORC-------X', 'F', [ [13876479.486506728, 4631345.657494538], [14151041.292107081, 4654582.514093231], [13963923.44686497, 4523722.3216690095] ]);


                        break;
                    case 'createMilSymbol2':
                        // 원형표적 생성
                        var board = graphic.getSelectGraphicBoard();
                        graphic.selectMode();
                        var obj = createTacticalSymbol('G*F*ATC---****X', 'F', [[14162048.224180145, 4540232.719778608]]);
                        obj.setRadius(20000);//반지름 20km

                        /*obj._prop.msTextJSON.AM = 20000;
                        obj.setTextProperty(obj._prop.msTextJSON);
                        obj.updateFeature(true);*/
                        break;
                }
                break;
            case 'createCoordObject':
                // 좌표로 객체를 생성한다.
                var index = graphic.addGraphicBoard();
                var board = graphic.getGraphicBoard(index);
                graphic.setSelectGraphicBoard(index);
                graphic.selectMode();
                // Rectangle
                var milSymbolProp = new GraphicObjectProp('rectangle');
                var milSymbolStyle = new GraphicObjectStyle();

                milSymbolProp.setCoordinate([[14245104.793751003, 4291185.457827624], [14373751.007506913, 4186337.2416309314]]);
                var milSymbolObject = board.createObject(milSymbolProp, milSymbolStyle);
                milSymbolObject.createFeature(true);

                // Arc
                var arcProp = new GraphicObjectProp('arc');
                var arcStyle = new GraphicObjectStyle();

                arcProp.lineType = 1;
                arcProp.fillType = 3;
                arcProp.setCoordinate([[14022015.588361708, 4586400.684862856], [14138811.367581459, 4494064.754694363], [14138811.367581459, 4494064.754694363], [14075215.760048192, 4498956.724504614]]);
                var arcObject = board.createObject(arcProp, arcStyle);
                arcObject.createFeature(true);


                // Point
                var pointProp = new GraphicObjectProp('point');
                var pointStyle = new GraphicObjectStyle();

                pointProp.setCoordinate([[14085611.19589497, 4452483.011307225], [14163271.216632705, 4525251.062234707], [14158379.246822454, 4164468.288728676], [14108848.052493664, 4277595.0905907415], [14164494.20908527, 4361981.569817576], [14215859.89209291, 4373599.9981169235], [14162048.224180143, 4246408.783050384], [14221974.85435572, 4301443.443415712], [14127804.435508383, 4389498.900000235], [14323483.227918435, 4367485.035854104], [14367510.956210697, 4322234.315109279], [14306361.333582556, 4587623.677315411], [14355281.03168507, 4495899.2433732]]);
                pointStyle.point.color = [255, 255, 255, 1];
                pointStyle.point.type = 'triangle';
                var pointObject = board.createObject(pointProp, pointStyle);
                pointObject.createFeature(true);


                // Polyline
                var polylineProp = new GraphicObjectProp('polyline');
                var polylineStyle = new GraphicObjectStyle();

                polylineStyle.fill.color[3] = 0;
                polylineProp.setCoordinate([[13975753.182046687, 4699927.676066701], [13976013.839338282, 4664939.219678825], [13988264.178486405, 4667396.04640542], [13984675.48184678, 4631340.084910335]]);
                var polylineObject = board.createObject(polylineProp, polylineStyle);
                polylineObject.createFeature(true);


                // Polygon
                var polygonProp = new GraphicObjectProp('polyline');
                var polygonStyle = new GraphicObjectStyle();

                polygonProp.close = 1;
                polygonProp.setCoordinate([[14052111.101014782, 4720624.106525905], [14036913.949049996, 4714980.095005577], [14031799.52798747, 4699864.435827506], [14053127.808795683, 4695858.509369055], [14062985.83552106, 4707968.846938852]]);
                var polygonObject = board.createObject(polygonProp, polygonStyle);
                polygonObject.createFeature(true);


                // Spline
                var splineProp = new GraphicObjectProp('polyline');
                var splineStyle = new GraphicObjectStyle();

                splineStyle.fill.color[3] = 0;
                splineProp.setCoordinate([[14256064.993911728, 4635464.939578007], [14254028.317914704, 4607472.4413391845], [14158308.871335551, 4609438.024417641], [14186349.568995584, 4580591.469214944]]);
                splineProp.lineType = 1;
                var splineObject = board.createObject(splineProp, splineStyle);
                splineObject.createFeature(true);

                // Closed Spline
                var closedSplineProp = new GraphicObjectProp('polyline');
                var closedSplineStyle = new GraphicObjectStyle();

                closedSplineStyle.fill.color[3] = 0;
                closedSplineProp.setCoordinate([[14089126.524136903, 4653809.826366451], [14056870.873259744, 4683628.584841594], [13991370.401560726, 4627782.911206084], [14019411.099220758, 4598936.356003388], [13983491.326105975, 4563163.828264156], [14102121.594004568, 4574782.256563503]]);
                closedSplineProp.lineType = 1;
                closedSplineProp.close = 1;
                var closedSplineObject = board.createObject(closedSplineProp, closedSplineStyle);
                closedSplineObject.createFeature(true);

                // 군대부호
                var milSymbolObject, milSymbolProp;
                createTacticalSymbol('G-G-OLAGS-----X', 'P', [[14075215.760046845, 4639182.956351638], [14050336.665007759, 4633563.614369038], [14047142.15264829, 4614501.100306114], [14060463.98435027, 4609449.185034035], [14066621.394510519, 4624721.656946203]]);
                createTacticalSymbol('G*G*GAE---****X', 'S', [[14089891.669478944, 4743555.215017178], [14169997.675121808, 4768626.560294716], [14195069.020399347, 4712368.907476827], [14077661.744953316, 4712980.4037031075]]);
                createTacticalSymbol('G*S*LCM---****X', 'N', [[14149206.803428238, 4459820.966022585], [14313518.629224917, 4537947.571734958]]);
                createTacticalSymbol('G*G*GL6---****X', 'K', [[14350389.061874826, 4445145.05659185], [14244600.21472814, 4393779.373584212], [14195069.020399345, 4415793.237730343]]);

                createMSPoint('S*P*S-----*****', 'F', [[14242765.726049293, 4676596.3782393625]]);
                createMSPoint('S*S*XL----*****', 'L', [[14028130.550624518, 4497427.98393891]]);
                createMSPoint('G*T*D-----****X', 'W', [[14200572.486435875, 4544513.193362578]]);


                // 사용자 정의 심볼 추가
                createMSPoint('G*S*PHRP--****X', 'F', [[14230572.486435875, 4544513.193362578]]); //육로조정소(HRP)
                createMSPoint('G*S*PCHRP-****X', 'F', [[14270572.486435875, 4544513.193362578]]); //육로조정소(CHRP)
                createMSPoint('G*S*PQRES-****X', 'F', [[14310572.486435875, 4544513.193362578]]); //구호소


                // 시군구 데이터
                var boundCoordinate = getBoundData()
                var gwangmyeongProp = new GraphicObjectProp('polyline');
                var gwangmyeongStyle = new GraphicObjectStyle();
                var gwangmyeongObject;

                gwangmyeongProp.close = 1;
                gwangmyeongProp.text = '광명시';
                gwangmyeongProp.setCoordinate(boundCoordinate.gwangmyeong);
                gwangmyeongStyle.line.color = [255, 0, 0, 1];
                gwangmyeongStyle.fill.color = [255, 255, 0, 1];
                gwangmyeongObject = board.createObject(gwangmyeongProp, gwangmyeongStyle);
                gwangmyeongObject.createFeature(true);

                var yongsanProp = new GraphicObjectProp('polyline');
                var yongsanStyle = new GraphicObjectStyle();
                var yongsanObject;

                yongsanProp = new GraphicObjectProp('polyline');
                yongsanStyle = new GraphicObjectStyle();
                yongsanProp.close = 1;
                yongsanProp.text = '용산구';
                yongsanProp.setCoordinate(boundCoordinate.yongsan);
                yongsanStyle.line.color = [255, 0, 0, 1];
                yongsanStyle.fill.color = [255, 255, 0, 1];
                yongsanObject = board.createObject(yongsanProp, yongsanStyle);
                yongsanObject.createFeature(true);

                var groupProp = new GraphicObjectProp('group');
                var groupObject = board.createObject(groupProp);
                groupObject.createFeature(true);
                groupObject.addObject(gwangmyeongObject);
                groupObject.addObject(yongsanObject);

                // 이미지
                var imageProp = new GraphicObjectProp('image');
                var imageStyle = new GraphicObjectStyle();

                imageProp.imgDataURL = getImage();
                imageProp.setCoordinate([[13781697.571433108, 4351280.3858538475], [13892378.388385378, 4281875.564174712]]);
                var imageObject = board.createObject(imageProp, imageStyle);
                imageObject.createFeature(true);

                board.undoRedoSave();
                break;
            //3D 중첩을 위한 투명도(군대부호 포함) 객체 정보를 json으로 저장한다.
            case 'createObjectfor3D':
                var board = window.graphic.getSelectGraphicBoard();

                if (board) {
                    let json = board.exportJSONfor3D(50000); //군대부호 빌보드 높이를 10000m로 설정
                    D2.Core.GraphicUtil.download(json, 'graphic.json', 'text/plain');
                }

                break;
            case 'setArcType':
                // arc 타입을 바꾼다.
                /**
                * _prop.lineType - arc 라인 타입 (1 - 현, 2 - 호, 3 - 부채꼴)
                * _prop.fillType - arc 채움 여부 (0 - 미채움, 1 - 채움)  
                * lineType 2, 3일 경우 fillType 상관없이 채움으로 설정
                */
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type != 'arc')
                    return;
                switch (arcTypeIndex) {
                    case 0:
                        selectObject._prop.lineType = 1;
                        selectObject._prop.fillType = 2;
                        arcTypeIndex++;
                        break;
                    case 1:
                        selectObject._prop.lineType = 1;
                        selectObject._prop.fillType = 3;
                        arcTypeIndex++;
                        break;
                    case 2:
                        selectObject._prop.lineType = 2;
                        selectObject._prop.fillType = 2;
                        arcTypeIndex++;
                        break;
                    case 3:
                        selectObject._prop.lineType = 3;
                        selectObject._prop.fillType = 2;
                        arcTypeIndex = 0;
                        break;
                }
                selectObject.updateFeature(true);
                break;
            case 'setArcArrow':
                // arc 객체에 화살표를 적용시킨다.
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type != 'arc')
                    return;
                selectObject._style.line.arrow.begin.type = 'circle';
                selectObject._style.line.arrow.end.type = 'cross';
                selectObject.updateFeature(true);
                break;
            case 'setMultiText':
                // 멀티라인 텍스트 예제
                if (selectObject == undefined)
                    return;
                selectObject._prop.text = 'Multi\nLine';
                selectObject.updateFeature(true);
                break;
            case 'setPointStyle':
                // point 객체에 패턴을 적용시킨다.
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type != 'point')
                    return;
                selectObject._style.point.size = 50;
                selectObject._style.point.stroke = [0, 255, 0, '1.0'];
                selectObject._style.fill.type = 'pattern';
                selectObject._style.fill.pattern = 'zigZag';
                selectObject._style.fill.patternColor1 = [255, 0, 0, 1];
                selectObject._style.fill.patternColor2 = [0, 255, 0, 1];

                selectObject.updateStyle();
                break;
            case 'setGradientStyle':
                // 다색 그라데이션을 설정한다.
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type == 'point')
                    return;
                selectObject._style.fill.type = 'gradient';
                selectObject._style.fill.gradient.type = 'path';
                selectObject._style.fill.gradient.color = [[255, 0, 0, 1], [0, 255, 0, 1], [0, 0, 255, 1], [255, 255, 255, 1]];
                selectObject._style.fill.gradient.anchor = [0.3, 0.7];
                selectObject._style.fill.gradient.stopPoint = [0.1, 0.3, 0.7, 1];

                selectObject.updateStyle();
                break;
            case 'moveCoordinate':
                // 투명도 객체를 해당 좌표로 이동시킨다.(경위도)
                if (selectObject == undefined)
                    return;
                var pos = selectObject._prop.positions;
                for (var i = 0; i < pos.length; i++) {
                    var coord = D2.Core.ol.proj.transform(pos[i], 'EPSG:3857', 'EPSG:4326');
                    coord[0] += 0.01;
                    coord[1] += 0.01;
                    coord = D2.Core.ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857');
                    pos[i] = coord;
                }
                selectObject._prop.setCoordinate(pos);
                selectObject.updateFeature();
                graphic._selectObjectManager.selectObject();
                break;
            case 'setDefaultStyle':
                // 선택한 객체를 기본 스타일로 설정한다.
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type == 'milSymbol')
                    return;

                selectObject._style.clone(graphic._defaultStyle);
                break;
            case 'setName':
                if (selectObject == undefined)
                    return;
                selectObject._prop.name = 'TEST';
                graphic._layerCallback('SelectedObjectRename');
                break;
            case 'moveToObject':
                if (selectObject == undefined)
                    return;
                graphic._map.getView().animate(
                    { zoom: graphic._map.getView().getZoom() },
                    { center: selectObject._prop.getCenter() },
                    { duration: 1000 }
                );
                break;
            case 'setLineStyle':
                if (selectObject == undefined)
                    return;
                if (selectObject._prop.type != 'polyline')
                    return;

                selectObject._style.line.type = 'dash';
                // LineCap
                // butt : 좌표에서 선 끝남 (flat)
                // round : 선 끝을 둥글게 마무리 (round)
                // square : 선 두께만큼 길이 늘림 (triangle)
                selectObject._style.line.lineCap = 'butt';
                // LineJoin
                // miter : 각진 모서리
                // round : 둥근 모서리
                // bevel : 끝이 잘린 모서리
                selectObject._style.line.lineJoin = 'miter';
                selectObject._style.line.dashOffset = 10;
                selectObject._style.line.dash = [10, 10];
                selectObject.updateStyle();
                break;

            case 'setLineGradient1':
                if (selectObject == undefined)
                    return;
                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'gradient';
                //그라데이션 타입
                // 선형 (horizontal,forwardDiagonal, vertical, backwardDiagonal) 
                // 경로형 (path), 방사형(radial)

                // 경로형일 경우 색상과 색 중지점
                selectObject._style.line.fill.gradient.type = 'path';
                // 그라데이션 색상 // 2개 이상의 색상의 배열
                selectObject._style.line.fill.gradient.color = [[255, 0, 0, 1], [0, 255, 0, 1], [0, 0, 255, 1]];
                // 중지점
                selectObject._style.line.fill.gradient.stopPoint = [0, 0.2, 1];
                // 중심점 
                selectObject._style.line.fill.gradient.anchor = [0.5, 0.5];
                selectObject.updateStyle();
                break;
            case 'setLineGradient2':
                if (selectObject == undefined)
                    return;

                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'gradient';
                //그라데이션 타입
                // horizontal,forwardDiagonal, vertical, backwardDiagonal, path, radial
                selectObject._style.line.fill.gradient.type = 'horizontal';
                // 그라데이션 색상
                // 2개 이상의 색상의 배열
                selectObject._style.line.fill.gradient.color = [[0, 0, 0, 1], [255, 255, 255, 1]];
                // 그라데이션 중지점 (0 ~ 1)
                // 중지점의 길이는 색상의 길이와 맞춰줘야함
                selectObject._style.line.fill.gradient.stopPoint = [0, 1];
                selectObject._style.line.fill.gradient.anchor = [0.5, 0.5];
                selectObject.updateStyle();
                break;
            case 'setLineGradient3':
                var selectObject = graphic.getSelectObjectList()[0];
                if (selectObject == undefined)
                    return;
                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'gradient';
                //그라데이션 타입
                // horizontal, forwardDiagonal, vertical, backwardDiagonal, path, radial
                selectObject._style.line.fill.gradient.type = 'vertical';
                selectObject._style.line.fill.gradient.color = [[0, 0, 0, 1], [255, 255, 255, 1]];
                // 그라데이션 중지점 (0 ~ 1)
                // 중지점의 길이는 색상의 길이와 맞춰줘야함
                selectObject._style.line.fill.gradient.stopPoint = [0, 1];
                selectObject._style.line.fill.gradient.anchor = [0.5, 0.5];
                selectObject.updateStyle();
                break;
            case 'setLineGradient4':
                if (selectObject == undefined)
                    return;
                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'gradient';
                //그라데이션 타입
                // horizontal,forwardDiagonal, vertical, backwardDiagonal, path, radial
                selectObject._style.line.fill.gradient.type = 'backwardDiagonal';
                // 그라데이션 색상
                // 2개 이상의 색상의 배열
                selectObject._style.line.fill.gradient.color = [[255, 0, 0, 1], [0, 255, 0, 1]];
                // 그라데이션 중지점 (0 ~ 1)
                // 중지점의 길이는 색상의 길이와 맞춰줘야함
                selectObject._style.line.fill.gradient.stopPoint = [0.4, 1];
                // 그라데이션 중심점(0 ~ 1)
                selectObject._style.line.fill.gradient.anchor = [0.5, 0.5];
                selectObject.updateStyle();
                break;
            case 'setLinePattern1':
                if (selectObject == undefined)
                    return;
                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'pattern';
                // 패턴 타입
                selectObject._style.line.fill.pattern = 'dottedDiamond';
                // 패턴 색상
                selectObject._style.line.fill.patternColor = [[0, 0, 0, 1], [255, 255, 255, 1]];
                selectObject.updateStyle();
                break;
            case 'setLinePattern2':
                if (selectObject == undefined)
                    return;
                // 선 속성
                // simple : 실선
                // gradient : 그라데이션
                // pattern : 패턴
                selectObject._style.line.fill.type = 'pattern';
                // 패턴 타입
                selectObject._style.line.fill.pattern = 'shingle';
                // 패턴 색상
                selectObject._style.line.fill.patternColor = [[0, 100, 255, 1], [100, 0, 255, 0.4]];
                selectObject.updateStyle();
                break;
            case 'setRegularPolygonType':
                var objList = graphic.getSelectObjectList();
                for (let i = 0; i < objList.length; i++) {
                    var obj = objList[i];
                    var angleCount;

                    if (obj == undefined)
                        return;
                    if (obj._prop.type != 'regularPolygon')
                        return;

                    angleCount = obj.getAngleCount();
                    if (angleCount == 8)
                        angleCount = 3;
                    else if (angleCount >= 3)
                        angleCount++;

                    obj.setAngleCount(angleCount);
                }
                break;
            case 'setSecurity':
                if (graphic.getSelectGraphicBoard() != undefined)
                    graphic.getSelectGraphicBoard()._security = 3;
                break;
            case 'getSecurity':
                if (graphic.getSelectGraphicBoard() != undefined)
                    alert(graphic.getSelectGraphicBoard()._security);
                break;
            case 'setObjectAttribute':
                if (graphic.getSelectObjectList()[0] != undefined)
                    graphic.getSelectObjectList()[0]._prop.attribute = {
                        "Object Attribute": {
                            "Test1": "Test Value1",
                            "Test2": "Test Value2",
                            "Test3": "Test Value3",
                        }
                    };
                break;
            case 'getObjectAttribute':
                if (graphic.getSelectObjectList()[0] != undefined)
                    alert(JSON.stringify(graphic.getSelectObjectList()[0]._prop.attribute));
                break;
            case 'setLayerAttribute':
                if (graphic.getSelectGraphicBoard() != undefined)
                    graphic.getSelectGraphicBoard()._attribute = {
                        "Layer Attribute": {
                            "Test1": "Test Value1",
                            "Test2": "Test Value2",
                            "Test3": "Test Value3",
                        }
                    }; break;
            case 'getLayerAttribute':
                if (graphic.getSelectGraphicBoard() != undefined)
                    alert(JSON.stringify(graphic.getSelectGraphicBoard()._attribute));
                break;
            case 'setLink':
                if (graphic.getSelectObjectList()[0] != undefined)
                    graphic.getSelectObjectList()[0]._prop.setLinks({
                        name: 'link',
                        desc: 'test link',
                        urn: 'test.com',
                        x: 50,
                        y: 100,
                        w: 100,
                        h: 300
                    });
                break;
            case 'getLink':
                if (graphic.getSelectObjectList()[0] != undefined)
                    alert(JSON.stringify(graphic.getSelectObjectList()[0]._prop.getLinks()));
                break;
            case 'undo':
                if (graphic.getSelectGraphicBoard() != undefined)
                    graphic.getSelectGraphicBoard().undo();

                break;
            case 'redo':
                if (graphic.getSelectGraphicBoard() != undefined)
                    graphic.getSelectGraphicBoard().redo();
                break;
            case 'createText':
                var map, text, size, coordinate, board, object;
                var objProp = new GraphicObjectProp('rectangle');
                var objStyle = new GraphicObjectStyle();


                board = graphic.getSelectGraphicBoard();
                if (board == null)
                    return;
                text = $('#graphiclayer-object-createTextInput').val();
                if (text == '')
                    return;

                graphic.selectMode();
                map = graphic._map;
                coordinate = [];
                size = getTextSize(text, objStyle.text.fontSize + "px " + objStyle.text.font);
                multiLineTextPosition[1][0] = multiLineTextPosition[0][0] + size[0];
                multiLineTextPosition[1][1] = multiLineTextPosition[0][1] + size[1];
                D2.Core.GraphicUtil.coordinateFromPixel(map, multiLineTextPosition, [0, 0], coordinate);

                objProp.name = 'text';
                objProp.text = text;
                objProp.setCoordinate(coordinate);
                objStyle.line.color[3] = 0;
                objStyle.fill.color[3] = 0;

                object = board.createObject(objProp, objStyle);
                object.createFeature(true);
                // multiLineTextPosition[0][0] = multiLineTextPosition[1][0];
                multiLineTextPosition[0][1] = multiLineTextPosition[1][1];
                break;
            case 'setAlignLeft':
                graphic._selectObjectManager.selectedObjectAlign('left');
                break;
            case 'setAlignCenter':
                graphic._selectObjectManager.selectedObjectAlign('center');
                break;
            case 'setAlignRight':
                graphic._selectObjectManager.selectedObjectAlign('right');
                break;
            case 'setAlignTop':
                graphic._selectObjectManager.selectedObjectAlign('top');
                break;
            case 'setAlignMiddle':
                graphic._selectObjectManager.selectedObjectAlign('middle');
                break;
            case 'setAlignBottom':
                graphic._selectObjectManager.selectedObjectAlign('bottom');
                break;
        }

        // ex) font = "30px Arial"
        function getTextSize(text, font) {
            var canvas, ctx, paragraph, longestWord, textMetrics, width, height;
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            if (font != undefined)
                ctx.font = font;
            paragraph = text.match(/\n/g);
            paragraph = paragraph == null ? 1 : paragraph.length + 1;
            longestWord = getLongestWord(text.split('\n'));
            // 텍스트 사이즈 가져오기
            // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
            textMetrics = ctx.measureText(longestWord);
            width = textMetrics.width;
            height = (textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent) * paragraph;
            return [width, height];

            function getLongestWord(arr) {
                let longestWord = arr[0]
                for (let i = 1; i < arr.length; i++) {
                    if (longestWord.length < arr[i].length)
                        longestWord = arr[i]
                }
                return longestWord;
            }
        }

        // 시군구 데이터 좌표를 가져온다.
        // 너무 길어 파일 분리
        function getBoundData() {
            var result; ``
            $.ajax({
                url: '../src/data/json/graphicObject-bound-coordinate.json',
                async: false,
                success: function (data) {
                    result = data;
                }
            });
            return result;
        }

        // base64 테스트 이미지를 가져온다.
        // 너무 길어 파일 분리
        function getImage() {
            var result;
            $.ajax({
                url: '../src/data/json/graphicObject-image-url.json',
                async: false,
                success: function (data) {
                    result = data.url;
                }
            });
            return result;
        }

        // 군대부호 - 점형객체를 만든다.
        function createMSPoint(cd, aff, pos) {
            // 해당 cd의 아이콘이 존재하는지 확인한다.
            var sym = new ICOPS.D2MS.ms.Symbol('');
            sym.setOptions({ SIDC: cd, size: 14, strokeWith: 4, addSymbol: "G*M*OMU---****X" });
            var validSymbol = isIE() ? sym.asCanvas().toDataURL('image/png', 1) : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sym.asSVG());
            if (validSymbol.length <= 227)
                return;

            var SIDC = cd.substring(0, 1) + aff + cd.substring(2, 15);
            milSymbolProp = new GraphicObjectProp('milSymbol');
            milSymbolProp.msKey = cd;
            milSymbolProp.msOriginKey = cd;
            milSymbolProp.msType = 'msPoint';
            milSymbolProp.setCoordinate(pos);
            milSymbolProp.options.SIDC = SIDC;
            milSymbolProp.options.size = 14; //군대부호 사이즈(3 ~ 14)
            milSymbolObject = board.createObject(milSymbolProp);
            milSymbolObject.createFeature(true);

            function isIE() { //IE11인지 체크  
                let agent = window.navigator.userAgent.toLowerCase();
                if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) return true;
                return false;
            }
        }

        // 군대부호 - 비점형객체를 만든다.
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
            } else {
                return;
            }
            milSymbolProp.graphicObjProp.setCoordinate(pos);
            milSymbolObject = board.createObject(milSymbolProp.graphicObjProp, milSymbolProp.graphicObjStyle);
            milSymbolObject.createFeature(true);
            return milSymbolObject;
        }
    });
}
