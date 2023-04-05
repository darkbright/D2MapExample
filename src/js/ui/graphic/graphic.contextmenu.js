// 2021년12월8일패치 
// 투명도 객체 context 메뉴
async function initGraphicContextMenu() {
    var graphic = window.graphic;
    graphic._styleCallback = styleCallback;

    eventHandler();

    function eventHandler() {
        window.map.getTargetElement().addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (graphic == undefined)
                return;
            if (graphic._mode == 'mute')
                return false;
            if (popupStyleIsShow() == true)
                return false;
            if (setPopupMenu() == false)
                return false;

            var contextElem = document.querySelector('.graphic-contextmenu');

            var posLeft, posTop;
            var winWidth = window.innerWidth;
            var winHeight = window.innerHeight;
            var posX = e.pageX;
            var posY = e.pageY;
            var menuWidth = contextElem.innerWidth;
            var menuHeight = contextElem.innerHeight;
            var secMargin = 10;

            if (posX + menuWidth + secMargin >= winWidth && posY + menuHeight + secMargin >= winHeight) {
                posLeft = posX - menuWidth - secMargin + 'px';
                posTop = posY - menuHeight - secMargin + 'px';
            } else if (posX + menuWidth + secMargin >= winWidth) {
                posLeft = posX - menuWidth - secMargin + 'px';
                posTop = posY + secMargin + 'px';
            } else if (posY + menuHeight + secMargin >= winHeight) {
                posLeft = posX + secMargin + 'px';
                posTop = posY - menuHeight - secMargin + 'px';
            } else {
                posLeft = posX + secMargin + 'px';
                posTop = posY + secMargin + 'px';
            }

            contextElem.style.left = posLeft;
            contextElem.style.top = posTop;
            contextElem.style.display = 'block';

            return false;

            function setPopupMenu() {
                var showPopup = false;
                showElement('.contextmenu-graphicCopy', false);
                showElement('.contextmenu-graphicCut', false);
                showElement('.contextmenu-graphicPaste', false);
                showElement('.contextmenu-graphicDelete', false);
                showElement('.contextmenu-graphicStyle', false);
                showElement('.contextmenu-graphicTop', false);
                showElement('.contextmenu-graphicBottom', false);
                showElement('.contextmenu-graphicForward', false);
                showElement('.contextmenu-graphicBackward', false);
                showElement('.contextmenu-graphicGroup', false);
                showElement('.contextmenu-graphicUnGroup', false);
                showElement('.contextmenu-graphicVertexEdit', false);
                showElement('.contextmenu-graphicTextEdit', false);
                showElement('.contextmenu-graphicTableEdit', false);
                showElement('.contextmenu-graphicMSProperty', false);

                var selectObjlist = graphic.getSelectObjectList();
                if (selectObjlist.length == 0) {
                    return false;
                }
                // 선택된 객체가 있으면 기본 메뉴 활성화
                else {
                    showElement('.contextmenu-graphicCopy', true);
                    showElement('.contextmenu-graphicCut', true);
                    showElement('.contextmenu-graphicDelete', true);
                    showElement('.contextmenu-graphicStyle', true);
                    showElement('.contextmenu-graphicTop', true);
                    showElement('.contextmenu-graphicBottom', true);
                    showElement('.contextmenu-graphicForward', true);
                    showElement('.contextmenu-graphicBackward', true);

                    if (graphic.selectedObjectIsGrouping())
                        showElement('.contextmenu-graphicGroup', true);

                    showPopup = true;
                }

                // Copy Object가 있으면 Paste메뉴 활성화
                if (graphic._selectObjectManager._copyObjectList.length > 0) {
                    showElement('.contextmenu-graphicPaste', true);
                    showPopup = true;
                }

                if (selectObjlist.length == 1 && selectObjlist[0]._prop.type == 'milSymbol') {
                    showElement('.contextmenu-graphicMSProperty', true);
                    // showElement('.d2map_popupGraphicMSProperty', true); // 엔진내부 군대부호 속성 기능
                    // $('.contextmenu-graphicStyle').hide();
                }
                if (window.graphic._selectObjectManager.getEditable()) {
                    showElement('.contextmenu-graphicVertexEdit', true);
                }
                // 선택된 객체가 하나이고 그룹이면 UnGroup 메뉴 활성화
                if (selectObjlist.length == 1 && selectObjlist[0]._prop.type == 'group') {
                    showElement('.contextmenu-graphicUnGroup', true);
                }

                // 선택된 객체가 두개 이상이고 모두 군대부호일 경우 프로퍼티 메뉴를 비활성화
                var milSym = false;
                var objList = getAllChildObj(selectObjlist);
                objList.some(function (obj) {
                    if (obj._prop.type == 'milSymbol') {
                        milSym = true;
                        return true;
                    }
                    return false;
                });

                // 선택된 객체가 textEditor일 때 활성화
                if (selectObjlist[0]._prop.type == 'textEditor')
                    showElement('.contextmenu-graphicTextEdit', true);

                // 선택된 객체가 table일 때 활성화
                if (selectObjlist[0]._prop.type == 'table')
                    showElement('.contextmenu-graphicTableEdit', true);
                // if (milSym == true) $('.contextmenu-graphicStyle').hide();

                return showPopup;

                function getAllChildObj(objList) {
                    var resArr = [];
                    objList.some(function (obj) {
                        if (obj._prop.type == 'group') {
                            resArr.push(...getAllChildObj(obj._objectList));
                        } else {
                            resArr.push(obj);
                        }
                    });
                    return resArr;
                }
            }
        });

        document.addEventListener('click', function () {
            showElement('.graphic-contextmenu', false);
        })

        document.querySelector('.contextmenu-graphicVertexEdit').addEventListener('click', function () {
            graphic.getSelectObjectList()[0].vertexEdit();
        });

        document.querySelector('.contextmenu-graphicTextEdit').addEventListener('click', function () {
            let selectObject = window.graphic.getSelectObjectList()[0]
            openTextEditor(selectObject);
        });

        document.querySelector('.contextmenu-graphicTableEdit').addEventListener('click', function () {
            let selectObject = window.graphic.getSelectObjectList()[0]
            openTableEditor(selectObject);
        });

        document.querySelector('.contextmenu-graphicCopy').addEventListener('click', function () {
            graphic.copyObject();
        });

        document.querySelector('.contextmenu-graphicCut').addEventListener('click', function () {
            graphic.copyObject();
            graphic.selectObjectRemove();
        });

        document.querySelector('.contextmenu-graphicPaste').addEventListener('click', function () {
            graphic.pasteObject();
        });

        document.querySelector('.contextmenu-graphicDelete').addEventListener('click', function () {
            graphic.selectObjectRemove();
        });

        document.querySelector('.contextmenu-graphicTop').addEventListener('click', function () {
            graphic.selectedObjectToTop();
        });

        document.querySelector('.contextmenu-graphicBottom').addEventListener('click', function () {
            graphic.selectedObjectToBottom();
        });

        document.querySelector('.contextmenu-graphicForward').addEventListener('click', function () {
            graphic.selectedObjectToForward();
        });

        document.querySelector('.contextmenu-graphicBackward').addEventListener('click', function () {
            graphic.selectedObjectToBackward();
        });

        document.querySelector('.contextmenu-graphicGroup').addEventListener('click', function () {
            graphic.selectedObjectToGroup();
        });

        document.querySelector('.contextmenu-graphicUnGroup').addEventListener('click', function () {
            graphic.selectedObjectToUnGroup();
        });

        document.querySelector('.contextmenu-graphicStyle').addEventListener('click', function () {
            popupStyleSetValue(graphic.getSelectObjectList());
        });

        document.querySelector('.contextmenu-graphicMSProperty').addEventListener('click', function () {
            var sidc = window.graphic.getSelectObjectList()[0]._prop.msOriginKey;
            window.MilSymbol.getMilSymbolPropertiesObject().setMSStyle(sidc);
        });

        document.querySelectorAll('.d2map_popup-close-btn').forEach(function (elem) {
            elem.addEventListener('click', function () {
                var parent = this;
                while (parent.classList.contains('d2map_ui-popup') == false) {
                    parent = parent.parentNode;
                }
                showElement(parent, false);
            });
        })
    }

    function styleCallback(type, param1, param2) {
        switch (type) {
            case 'popupStyleOpen':
                popupStyleSetValue(param1)
                break;
            case 'popupStyleSetValue':
                if (popupStyleIsShow() == true) {
                    if (window.MilSymbol.getMilSymbolPropertiesObject().activateMilSymbolPopup(param1[0]))
                        window.MilSymbol.getMilSymbolPropertiesObject().setMSStyle(param1[0]._prop.msOriginKey);
                    else
                        popupStyleSetValue(param1)
                }
                break;
            case 'popupStyleHide':
                popupStyleHide();
                break;
        }
    }
}

// 그래픽 스타일 팝업을 열 때 html 요소를 설정한다.
function popupStyleSetValue(selectObjlist) {
    if (selectObjlist.length == 0) return;

    var line, fill, text, marker, point, lineArrow, graphicObject;
    line = fill = text = marker = point = lineArrow = 'init';
    graphicObject = graphic.getSelectObjectList()[0];

    // 기본 객체
    popupStyleShow();
    showElement('#d2map_ms_prop_container', false);
    showElement('#d2map_ms_prop_container_ex', false);

    //  탭 설정
    showElement('#d2map_graphic-tab-controller li', false);
    showElement('#d2map_prop-tab', true);
    // 탭 컨텐츠 설정
    var tabContent = document.querySelector('#d2map_graphic-tab-content').childNodes;
    tabContent.forEach(function (elem) {
        if (elem.tagName == 'DIV')
            showElement(elem, false)
    });

    var tabController = document.querySelectorAll('#d2map_graphic-tab-controller > li');
    tabController.forEach(function (elem) {
        if (elem.tagName == 'LI')
            elem.classList.remove('selected');
    });

    // 회전 각도 설정
    var rotateValue = Math.floor(graphicObject._prop.rotate);
    document.querySelector('#d2map_graphicpopup-sub-rotate-value').value = rotateValue;
    // 잠금상태 설정
    var lock = graphicObject.getLock();
    document.querySelector('#d2map_graphicpopup-sub-lock').checked = lock;

    // 화면좌표 설정
    var screenMode = graphicObject.getScreenMode();
    document.querySelector('#d2map_graphicpopup-sub-screenMode').checked = screenMode;
    // 화면좌표 기준점 설정
    var screenAnchor = graphicObject.getScreenAnchor();
    var posElem = document.querySelector('#d2map_graphicpopup-sub-screenAnchor-table').querySelectorAll('tr');
    posElem = posElem[screenAnchor[1] * 2].querySelectorAll('input')[screenAnchor[0] * 2];
    posElemchecked = true;

    // 축척제한 설정
    var scaleLimit = graphicObject.getScaleLimit();
    $('#d2map_graphicpopup-sub-scalelimit').prop('checked', scaleLimit);
    var scaleUpper = graphicObject.getScaleUpper();
    $('#d2map_graphicpopup-sub-scaleupper').val(scaleUpper);
    var scaleLower = graphicObject.getScaleLower();
    $('#d2map_graphicpopup-sub-scalelower').val(scaleLower);

    if (graphicObject._prop.type == 'arc') {
        let lineType = graphicObject._prop.lineType;
        let fillType = graphicObject._prop.fillType;

        $('.d2map_graphicpopup-sub-arcType').show();
        if (lineType == 1 && fillType == 2)
            $('#d2map_graphicpopup-sub-arcType option').eq(0).prop('selected', true);
        if (lineType == 1 && fillType == 3)
            $('#d2map_graphicpopup-sub-arcType option').eq(1).prop('selected', true);
        if (lineType == 2 && fillType == 2)
            $('#d2map_graphicpopup-sub-arcType option').eq(2).prop('selected', true);
        if (lineType == 3 && fillType == 2)
            $('#d2map_graphicpopup-sub-arcType option').eq(3).prop('selected', true);
    } else {
        $('.d2map_graphicpopup-sub-arcType').hide();
    }
    if (graphicObject._prop.type == 'rectangle') {
        $('.d2map_graphicpopup-sub-radius').show();
        $('#d2map_graphicpopup-sub-radius').val(graphicObject._prop.radius);
    } else {
        $('.d2map_graphicpopup-sub-radius').hide();
    }


    // 다중 선택 시 input 값 설정
    for (var i = 0; i < selectObjlist.length; i++) {
        let lineType = selectObjlist[i]._prop.lineType;
        let fillType = selectObjlist[i]._prop.fillType;

        if ($('#d2map_graphicpopup-sub-rotate-value').val() != Math.floor(selectObjlist[i]._prop.rotate)) {
            $('#d2map_graphicpopup-sub-rotate-value').val('');
        }
        if (selectObjlist[i].getLock() != $('#d2map_graphicpopup-sub-lock').is(':checked')) {
            $('#d2map_graphicpopup-sub-lock').prop('checked', false);
        }

        if (
            ((lineType == 1 && fillType == 2) && $('#d2map_graphicpopup-sub-arcType option:selected').index('#d2map_graphicpopup-sub-arcType option') != 0) ||
            ((lineType == 1 && fillType == 3) && $('#d2map_graphicpopup-sub-arcType option:selected').index('#d2map_graphicpopup-sub-arcType option') != 1) ||
            ((lineType == 2 && fillType == 2) && $('#d2map_graphicpopup-sub-arcType option:selected').index('#d2map_graphicpopup-sub-arcType option') != 2) ||
            ((lineType == 3 && fillType == 2) && $('#d2map_graphicpopup-sub-arcType option:selected').index('#d2map_graphicpopup-sub-arcType option') != 3)
        )
            $('#d2map_graphicpopup-sub-arcType').val('').prop('selected', true)

        if (selectObjlist[i].getScaleLimit() != $('#d2map_graphicpopup-sub-scalelimit').is(':checked')) {
            $('#d2map_graphicpopup-sub-scalelimit').prop('checked', false);
        }
        if (selectObjlist[i].getScaleUpper() != $('#d2map_graphicpopup-sub-scaleupper').val()) {
            $('#d2map_graphicpopup-sub-scaleupper').val('');
        }
        if (selectObjlist[i].getScaleLower() != $('#d2map_graphicpopup-sub-scalelower').val()) {
            $('#d2map_graphicpopup-sub-scalelower').val('');
        }
    }


    addObject(selectObjlist);

    function addObject(list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i]._prop.type == 'group') {
                addObject(list[i]._objectList);
            } else {
                var obj = new Object();
                obj.prop = new D2.Core.GraphicObjectProp();
                obj.style = new D2.Core.GraphicObjectStyle();
                obj.srcObject = list[i];
                obj.parentRotate = D2.Core.GraphicUtil.getObjParent(list[i])._prop.rotate;

                list[i]._style.clone(obj.style);
                list[i]._prop.clone(obj.prop);
                // 마커
                if (obj.prop.type == 'marker') {
                    $('#d2map_marker-tab').show();
                    $('#d2map_marker-tab').addClass('selected');
                    setMarkerStyle(obj.style);
                }
                // 포인트
                else if (obj.prop.type == 'point') {
                    $('#d2map_point-tab').show();
                    $('#d2map_point-tab').addClass('selected');
                    $('#d2map_text-tab').show();
                    $('#d2map_line-tab').show();
                    $('#d2map_fill-tab').show();
                    setPointStyle(obj.style);
                    setLineStyle(obj.style);
                    setFillStyle(obj.style);
                    setTextStyle(obj.style, obj.prop);
                }
                // 텍스트
                else if (obj.prop.type == 'text') {
                    $('#d2map_text-tab').show();
                    setTextStyle(obj.style, obj.prop);
                }
                // 폴리라인
                else if (obj.prop.type == 'polyline' && obj.prop.close == 0) {
                    $('#d2map_line-tab').show();
                    $('#d2map_arrow-tab').show();
                    $('#d2map_fill-tab').show();
                    $('#d2map_text-tab').show();
                    setLineStyle(obj.style);
                    setFillStyle(obj.style);
                    setTextStyle(obj.style, obj.prop);
                }
                // 원호
                else if (obj.prop.type == 'arc' && obj.prop.lineType == 1) {
                    $('#d2map_line-tab').show();
                    $('#d2map_arrow-tab').show();
                    $('#d2map_fill-tab').show();
                    $('#d2map_text-tab').show();
                    setLineStyle(obj.style);
                    setFillStyle(obj.style);
                    setTextStyle(obj.style, obj.prop);
                }
                else {
                    if (obj.prop.type != 'image' && obj.prop.type != 'textEditor' && obj.prop.type != 'table' && obj.prop.type != 'milSymbol') {
                        setFillStyle(obj.style);
                        setLineStyle(obj.style);
                        setTextStyle(obj.style, obj.prop);
                        $('#d2map_fill-tab').show();
                        $('#d2map_line-tab').show();
                        $('#d2map_text-tab').show();
                    }
                }
                var $tab = $('#d2map_graphic-tab-controller li');
                for (var liIndex = 0; liIndex < $tab.length; liIndex++) {
                    if ($tab.eq(liIndex).is(':visible')) {
                        $tab.eq(liIndex).trigger('click');
                        break;
                    }
                }
            }
        }
    }

    function setMarkerStyle(style) {
        if (marker == 'init') {
            $('#d2map_graphicpopup-sub-marker-size').val(style.marker.size);
            marker = 'set';
        } else {
            if ($('#d2map_graphicpopup-sub-marker-size').val() != style.marker.size) $('#d2map_graphicpopup-sub-marker-size').val('');
        }
    }

    function setPointStyle(style) {
        var color, pointType;

        if (point == 'init') {
            $('#d2map_graphicpopup-sub-point-type').val(style.point.type).prop('selected', true);
            $('#d2map_graphicpopup-sub-point-size').val(style.point.size);

            if (style.point.type == 'marker') {
                toIEColor($('#d2map_graphicpopup-sub-point-color'), '#000000', true);
                $('#d2map_graphicpopup-sub-point-alpha').attr('disabled', true);
                $('#d2map_graphicpopup-sub-point-alpha').val('');
            }
            point = 'set';
        } else {
            if ($('#d2map_graphicpopup-sub-point-type').val() != style.point.type) {
                $('#d2map_graphicpopup-sub-point-type').val('');
                toIEColor($('#d2map_graphicpopup-sub-point-color'), undefined, false);
                $('#d2map_graphicpopup-sub-point-alpha').attr('disabled', false);
            }

            if ($('#d2map_graphicpopup-sub-point-size').val() != style.point.size) $('#d2map_graphicpopup-sub-point-size').val('');

            pointType = $('#d2map_graphicpopup-sub-point-type').val();
        }
    }

    function setFillStyle(style) {
        let color;
        let patternColor1, patternColor2;
        let gradientColor, stopPointLength;
        if (fill == 'init') {
            color = '#' + pad(style.fill.color[0].toString(16), 2) + pad(style.fill.color[1].toString(16), 2) + pad(style.fill.color[2].toString(16), 2);
            patternColor1 = '#' + pad(style.fill.patternColor[0][0].toString(16), 2) + pad(style.fill.patternColor[0][1].toString(16), 2) + pad(style.fill.patternColor[0][2].toString(16), 2);
            patternColor2 = '#' + pad(style.fill.patternColor[1][0].toString(16), 2) + pad(style.fill.patternColor[1][1].toString(16), 2) + pad(style.fill.patternColor[1][2].toString(16), 2);
            gradientColor = '#' + pad(parseInt(style.fill.gradient.color[0][0]).toString(16), 2) + pad(parseInt(style.fill.gradient.color[0][1]).toString(16), 2) + pad(parseInt(style.fill.gradient.color[0][2]).toString(16), 2);

            stopPointLength = style.fill.gradient.color.length;

            $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').remove();
            for (let index = 1; index <= stopPointLength; index++) {
                $('#d2map_graphicpopup-sub-fill-gradient-stopPoint').append('<option value="color' + index + '">색상 ' + index + '</option>');
            }

            $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position').val(style.fill.gradient.stopPoint[0]);
            $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position-value').text(Math.floor(style.fill.gradient.stopPoint[0] * 100) + '%');

            toIEColor($('#d2map_graphicpopup-sub-fill-backgroundColor'), color);
            toIEColor($('#d2map_graphicpopup-sub-fill-patternColor1'), patternColor1);
            toIEColor($('#d2map_graphicpopup-sub-fill-patternColor2'), patternColor2);
            toIEColor($('#d2map_graphicpopup-sub-fill-gradientColor'), gradientColor);
            $('#d2map_graphicpopup-sub-fill-backgroundAlpha').val(Math.round(parseFloat(style.fill.color[3]) * 100));
            $('#d2map_graphicpopup-sub-fill-patternAlpha1').val(Math.round(parseFloat(style.fill.patternColor[0][3]) * 100));
            $('#d2map_graphicpopup-sub-fill-patternAlpha2').val(Math.round(parseFloat(style.fill.patternColor[1][3]) * 100));
            $('#d2map_graphicpopup-sub-fill-gradientAlpha').val(Math.round(parseFloat(style.fill.gradient.color[0][3]) * 100));

            $('#d2map_graphicpopup-sub-fill-pattern').hide();
            $('.d2map_graphicpopup-sub-fill-pattern-style').hide();
            $('#d2map_graphicpopup-sub-fill-gradient').hide();
            $('.d2map_graphicpopup-sub-fill-gradient-style').hide();
            $('.d2map_graphicpopup-sub-fill-simple-style').hide();

            $('#d2map_graphicpopup-sub-fill-type').val(style.fill.type).prop('selected', true);
            $('#d2map_graphicpopup-sub-fill-pattern-type').val(style.fill.pattern).prop('selected', true);
            $('#d2map_graphicpopup-sub-fill-gradient-type').val(style.fill.gradient.type).prop('selected', true);
            if (style.fill.type == 'simple') {
                $('.d2map_graphicpopup-sub-fill-simple-style').show();
            } else if (style.fill.type == 'pattern') {
                $('#d2map_graphicpopup-sub-fill-pattern').show();
                $('.d2map_graphicpopup-sub-fill-pattern-style').show();
            } else if (style.fill.type == 'gradient') {

                $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').eq(0).prop('selected', true);

                $('#d2map_graphicpopup-sub-fill-gradient').show();
                $('.d2map_graphicpopup-sub-fill-gradient-style').show();
            }
            fill = 'set';
        } else {
            color = '#' + pad(style.fill.color[0].toString(16), 2) + pad(style.fill.color[1].toString(16), 2) + pad(style.fill.color[2].toString(16), 2);
            let patternColor1 = '#' + pad(style.fill.patternColor[0][0].toString(16), 2) + pad(style.fill.patternColor[0][1].toString(16), 2) + pad(style.fill.patternColor[0][2].toString(16), 2);
            let patternColor2 = '#' + pad(style.fill.patternColor[1][0].toString(16), 2) + pad(style.fill.patternColor[1][1].toString(16), 2) + pad(style.fill.patternColor[1][2].toString(16), 2);
            gradientColor = '#' + pad(style.fill.gradient.color[0][0].toString(16), 2) + pad(style.fill.gradient.color[0][1].toString(16), 2) + pad(style.fill.gradient.color[0][2].toString(16), 2);


            if (color != $('#d2map_graphicpopup-sub-fill-backgroundColor').val()) toIEColor($('#d2map_graphicpopup-sub-fill-backgroundColor'), '#FFFFFF');

            if ($('#d2map_graphicpopup-sub-fill-backgroundAlpha').val() != Math.round(parseFloat(style.fill.color[3]) * 100)) $('#d2map_graphicpopup-sub-fill-alpha').val('');

            if ($('#d2map_graphicpopup-sub-fill-patternColor1').val() != patternColor1) toIEColor($('#d2map_graphicpopup-sub-fill-patternColor1'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-fill-patternAlpha1').val() != Math.round(parseFloat(style.fill.patternColor[0][3]) * 100)) $('#d2map_graphicpopup-sub-fill-patternAlpha1').val('');
            if ($('#d2map_graphicpopup-sub-fill-patternColor2').val() != patternColor2) toIEColor($('#d2map_graphicpopup-sub-fill-patternColor2'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-fill-patternAlpha2').val() != Math.round(parseFloat(style.fill.patternColor[1][3]) * 100)) $('#d2map_graphicpopup-sub-fill-patternAlpha2').val('');

            if ($('#d2map_graphicpopup-sub-fill-gradientColor').val() != gradientColor) toIEColor($('#d2map_graphicpopup-sub-fill-gradientColor'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-fill-gradientAlpha').val() != Math.round(parseFloat(style.fill.gradient.color[0][3]) * 100)) $('#d2map_graphicpopup-sub-fill-gradientAlpha').val('');
            if ($('#d2map_graphicpopup-sub-fill-gradientAlpha2').val() != Math.round(parseFloat(style.fill.gradient.color[1][3]) * 100)) $('#d2map_graphicpopup-sub-fill-gradientAlpha2').val('');

            if ($('#d2map_graphicpopup-sub-fill-type').val() != style.fill.type) {
                $('#d2map_graphicpopup-sub-fill-type').val('').prop('selected', true);
                $('#d2map_graphicpopup-sub-fill-pattern').hide();
                $('.d2map_graphicpopup-sub-fill-pattern-style').hide();
                $('#d2map_graphicpopup-sub-fill-gradient').hide();
                $('.d2map_graphicpopup-sub-fill-gradient-style').hide();
                $('.d2map_graphicpopup-sub-fill-simple-style').hide();
            }
            if ($('#d2map_graphicpopup-sub-fill-pattern-type').val() != style.fill.pattern) {
                $('#d2map_graphicpopup-sub-fill-pattern-type').val('').prop('selected', true);
            }
            if ($('#d2map_graphicpopup-sub-fill-gradient-type').val() != style.fill.gradient.type) {
                $('#d2map_graphicpopup-sub-fill-gradient-type').val('').prop('selected', true);
            }
        }
    }

    function setLineStyle(style) {
        let color;
        let patternColor1, patternColor2;
        let gradientColor, stopPointLength;
        if (line == 'init') {
            if (style.line.type != 'dash') $('#d2map_graphicpopup-sub-line-type').val(style.line.type).prop('selected', true);
            else {
                if (style.line.dash.length == 6) $('#d2map_graphicpopup-sub-line-type').val('dash dot dot').prop('selected', true);
                else if (style.line.dash.length == 4) $('#d2map_graphicpopup-sub-line-type').val('dash dot').prop('selected', true);
                else $('#d2map_graphicpopup-sub-line-type').val(style.line.type).prop('selected', true);
            }

            // 겹선 설정
            $('#d2map_graphicpopup-sub-double-line-type').val(getDoubleLineType(style)).prop('selected', true);
            $('#d2map_graphicpopup-sub-line-width').val(style.line.width);
            $('#d2map_graphicpopup-sub-line-alpha').val(Math.round(parseFloat(style.line.color[3]) * 100));
            $('#d2map_graphicpopup-sub-line-style-arrowbegin').val(style.line.arrow.begin.type).prop('selected', true);
            $('#d2map_graphicpopup-sub-line-style-arrowbegin-width').val(style.line.arrow.begin.width);
            $('#d2map_graphicpopup-sub-line-style-arrowbegin-height').val(style.line.arrow.begin.height);
            $('#d2map_graphicpopup-sub-line-style-arrowend').val(style.line.arrow.end.type).prop('selected', true);
            $('#d2map_graphicpopup-sub-line-style-arrowend-width').val(style.line.arrow.end.width);
            $('#d2map_graphicpopup-sub-line-style-arrowend-height').val(style.line.arrow.end.height);

            // Line fill
            color = '#' + pad(style.line.color[0].toString(16), 2) + pad(style.line.color[1].toString(16), 2) + pad(style.line.color[2].toString(16), 2);
            patternColor1 = '#' + pad(style.line.fill.patternColor[0][0].toString(16), 2) + pad(style.line.fill.patternColor[0][1].toString(16), 2) + pad(style.line.fill.patternColor[0][2].toString(16), 2);
            patternColor2 = '#' + pad(style.line.fill.patternColor[1][0].toString(16), 2) + pad(style.line.fill.patternColor[1][1].toString(16), 2) + pad(style.line.fill.patternColor[1][2].toString(16), 2);
            gradientColor = '#' + pad(parseInt(style.line.fill.gradient.color[0][0]).toString(16), 2) + pad(parseInt(style.line.fill.gradient.color[0][1]).toString(16), 2) + pad(parseInt(style.line.fill.gradient.color[0][2]).toString(16), 2);

            stopPointLength = style.line.fill.gradient.color.length;

            $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').remove();
            for (let index = 1; index <= stopPointLength; index++) {
                $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint').append('<option value="color' + index + '">색상 ' + index + '</option>');
            }

            $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position').val(style.line.fill.gradient.stopPoint[0]);
            $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position-value').text(Math.floor(style.line.fill.gradient.stopPoint[0] * 100) + '%');

            toIEColor($('#d2map_graphicpopup-sub-line-fill-backgroundColor'), color);
            toIEColor($('#d2map_graphicpopup-sub-line-fill-patternColor1'), patternColor1);
            toIEColor($('#d2map_graphicpopup-sub-line-fill-patternColor2'), patternColor2);
            toIEColor($('#d2map_graphicpopup-sub-line-fill-gradientColor'), gradientColor);
            $('#d2map_graphicpopup-sub-line-fill-backgroundAlpha').val(Math.round(parseFloat(style.line.color[3]) * 100));
            $('#d2map_graphicpopup-sub-line-fill-patternAlpha1').val(Math.round(parseFloat(style.line.fill.patternColor[0][3]) * 100));
            $('#d2map_graphicpopup-sub-line-fill-patternAlpha2').val(Math.round(parseFloat(style.line.fill.patternColor[1][3]) * 100));
            $('#d2map_graphicpopup-sub-line-fill-gradientAlpha').val(Math.round(parseFloat(style.line.fill.gradient.color[0][3]) * 100));

            $('#d2map_graphicpopup-sub-line-fill-pattern').hide();
            $('.d2map_graphicpopup-sub-line-fill-pattern-style').hide();
            $('#d2map_graphicpopup-sub-line-fill-gradient').hide();
            $('.d2map_graphicpopup-sub-line-fill-gradient-style').hide();
            $('.d2map_graphicpopup-sub-line-fill-simple-style').hide();

            $('#d2map_graphicpopup-sub-line-fill-type').val(style.line.fill.type).prop('selected', true);
            $('#d2map_graphicpopup-sub-line-fill-pattern-type').val(style.line.fill.pattern).prop('selected', true);
            $('#d2map_graphicpopup-sub-line-fill-gradient-type').val(style.line.fill.gradient.type).prop('selected', true);
            if (style.line.fill.type == 'simple') {
                $('.d2map_graphicpopup-sub-line-fill-simple-style').show();
            } else if (style.line.fill.type == 'pattern') {
                $('#d2map_graphicpopup-sub-line-fill-pattern').show();
                $('.d2map_graphicpopup-sub-line-fill-pattern-style').show();
            } else if (style.line.fill.type == 'gradient') {

                $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').eq(0).prop('selected', true);

                $('#d2map_graphicpopup-sub-line-fill-gradient').show();
                $('.d2map_graphicpopup-sub-line-fill-gradient-style').show();
            }
            line = 'set';
        } else {
            let lineType = $('#d2map_graphicpopup-sub-line-type').val();
            if (lineType == 'dash dot' && style.line.type == 'dash' && style.line.dash.length == 4);
            else if (lineType == 'dash dot dot' && style.line.type == 'dash' && style.line.dash.length == 6);
            else if (lineType == 'dash' && style.line.type == 'dash' && style.line.dash.length == 2);
            else if (lineType == 'simple' && style.line.type == 'simple');
            else $('#d2map_graphicpopup-sub-line-type').val('').prop('selected', true);

            // 겹선 설정
            let doubleLineType = $('#d2map_graphicpopup-sub-double-line-type').val();
            if (doubleLineType != getDoubleLineType(style))
                $('#d2map_graphicpopup-sub-double-line-type').val('').prop('selected', true);

            if (style.line.width != $('#d2map_graphicpopup-sub-line-width').val()) $('#d2map_graphicpopup-sub-line-width').val('');

            if ($('#d2map_graphicpopup-sub-line-alpha').val() != Math.round(parseFloat(style.line.color[3]) * 100)) $('#d2map_graphicpopup-sub-line-alpha').val('');
            if ($('#d2map_graphicpopup-sub-line-style-arrowbegin').val() != style.line.arrow.begin.type) $('#d2map_graphicpopup-sub-line-style-arrowbegin').val('').prop('selected', true);
            if ($('#d2map_graphicpopup-sub-line-style-arrowbegin-width').val() != style.line.arrow.begin.width) $('#d2map_graphicpopup-sub-line-style-arrowbegin-width').val('');
            if ($('#d2map_graphicpopup-sub-line-style-arrowbegin-height').val() != style.line.arrow.begin.height) $('#d2map_graphicpopup-sub-line-style-arrowbegin-height').val('');
            if ($('#d2map_graphicpopup-sub-line-style-arrowend').val() != style.line.arrow.end.type) $('#d2map_graphicpopup-sub-line-style-arrowend').val('').prop('selected', true);
            if ($('#d2map_graphicpopup-sub-line-style-arrowend-width').val() != style.line.arrow.end.width) $('#d2map_graphicpopup-sub-line-style-arrowend-width').val('');
            if ($('#d2map_graphicpopup-sub-line-style-arrowend-height').val() != style.line.arrow.end.height) $('#d2map_graphicpopup-sub-line-style-arrowend-height').val('');


            color = '#' + pad(style.line.color[0].toString(16), 2) + pad(style.line.color[1].toString(16), 2) + pad(style.line.color[2].toString(16), 2);
            patternColor1 = '#' + pad(style.line.fill.patternColor[0][0].toString(16), 2) + pad(style.line.fill.patternColor[0][1].toString(16), 2) + pad(style.line.fill.patternColor[0][2].toString(16), 2);
            patternColor2 = '#' + pad(style.line.fill.patternColor[1][0].toString(16), 2) + pad(style.line.fill.patternColor[1][1].toString(16), 2) + pad(style.line.fill.patternColor[1][2].toString(16), 2);
            gradientColor = '#' + pad(style.line.fill.gradient.color[0][0].toString(16), 2) + pad(style.line.fill.gradient.color[0][1].toString(16), 2) + pad(style.line.fill.gradient.color[0][2].toString(16), 2);


            if (color != $('#d2map_graphicpopup-sub-line-fill-backgroundColor').val()) toIEColor($('#d2map_graphicpopup-sub-line-fill-backgroundColor'), '#FFFFFF');

            if ($('#d2map_graphicpopup-sub-line-fill-backgroundAlpha').val() != Math.round(parseFloat(style.line.color[3]) * 100)) $('#d2map_graphicpopup-sub-line-fill-alpha').val('');

            if ($('#d2map_graphicpopup-sub-line-fill-patternColor1').val() != patternColor1) toIEColor($('#d2map_graphicpopup-sub-line-fill-patternColor1'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-line-fill-patternAlpha1').val() != Math.round(parseFloat(style.line.fill.patternColor[0][3]) * 100)) $('#d2map_graphicpopup-sub-line-fill-patternAlpha1').val('');
            if ($('#d2map_graphicpopup-sub-line-fill-patternColor2').val() != patternColor2) toIEColor($('#d2map_graphicpopup-sub-line-fill-patternColor2'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-line-fill-patternAlpha2').val() != Math.round(parseFloat(style.line.fill.patternColor[1][3]) * 100)) $('#d2map_graphicpopup-sub-line-fill-patternAlpha2').val('');

            if ($('#d2map_graphicpopup-sub-line-fill-gradientColor').val() != gradientColor) toIEColor($('#d2map_graphicpopup-sub-line-fill-gradientColor'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-line-fill-gradientAlpha').val() != Math.round(parseFloat(style.line.fill.gradient.color[0][3]) * 100)) $('#d2map_graphicpopup-sub-line-fill-gradientAlpha').val('');
            if ($('#d2map_graphicpopup-sub-line-fill-gradientAlpha2').val() != Math.round(parseFloat(style.line.fill.gradient.color[1][3]) * 100)) $('#d2map_graphicpopup-sub-line-fill-gradientAlpha2').val('');

            if ($('#d2map_graphicpopup-sub-line-fill-type').val() != style.line.fill.type) {
                $('#d2map_graphicpopup-sub-line-fill-type').val('').prop('selected', true);
                $('#d2map_graphicpopup-sub-line-fill-pattern').hide();
                $('.d2map_graphicpopup-sub-line-fill-pattern-style').hide();
                $('#d2map_graphicpopup-sub-line-fill-gradient').hide();
                $('.d2map_graphicpopup-sub-line-fill-gradient-style').hide();
                $('.d2map_graphicpopup-sub-line-fill-simple-style').hide();
            }
            if ($('#d2map_graphicpopup-sub-line-fill-pattern-type').val() != style.line.fill.pattern) {
                $('#d2map_graphicpopup-sub-line-fill-pattern-type').val('').prop('selected', true);
            }
            if ($('#d2map_graphicpopup-sub-line-fill-gradient-type').val() != style.line.fill.gradient.type) {
                $('#d2map_graphicpopup-sub-line-fill-gradient-type').val('').prop('selected', true);
            }
        }
    }

    // 텍스트 스타일
    function setTextStyle(style, prop) {
        var color, textPosition;
        if (text == 'init') {
            textPosition = style.text.textBaseline + '-' + style.text.textAlign;
            color = '#' + pad(style.text.color[0].toString(16), 2) + pad(style.text.color[1].toString(16), 2) + pad(style.text.color[2].toString(16), 2);
            toIEColor($('#d2map_graphicpopup-sub-text-color'), color);
            color = '#' + pad(style.text.outlineColor[0].toString(16), 2) + pad(style.text.outlineColor[1].toString(16), 2) + pad(style.text.outlineColor[2].toString(16), 2);
            toIEColor($('#d2map_graphicpopup-sub-text-outlinecolor'), color);
            color = '#' + pad(style.text.backgroundColor[0].toString(16), 2) + pad(style.text.backgroundColor[1].toString(16), 2) + pad(style.text.backgroundColor[2].toString(16), 2);
            toIEColor($('#d2map_graphicpopup-sub-text-backgroundcolor'), color);
            $('#d2map_graphicpopup-sub-text-size').val(style.text.fontSize);
            $('#d2map_graphicpopup-sub-text-outlinesize').val(style.text.outlineWidth);
            $('#d2map_graphicpopup-sub-text-background').prop('checked', style.text.showBackground);
            $('#d2map_graphicpopup-sub-text-bold').prop('checked', style.text.bold);
            $('#d2map_graphicpopup-sub-text-italic').prop('checked', style.text.italic);
            $('#d2map_graphicpopup-sub-text-rtl').prop('checked', style.text.directionRightToLeft);
            $('#d2map_graphicpopup-sub-text-vertical').prop('checked', style.text.directionVertical);
            $('#d2map_graphicpopup-sub-text-value').val(prop.text);
            $('input[name="graphicpopup-sub-textAlign"][value="' + textPosition + '"]').prop('checked', true);
            text = 'set';
        } else {
            textPosition = style.text.textBaseline + '-' + style.text.textAlign;
            color = '#' + pad(style.text.color[0].toString(16), 2) + pad(style.text.color[1].toString(16), 2) + pad(style.text.color[2].toString(16), 2);
            if ($('#d2map_graphicpopup-sub-text-color').val() != color)
                toIEColor($('#d2map_graphicpopup-sub-text-color'), '#FFFFFF');

            color = '#' + pad(style.text.outlineColor[0].toString(16), 2) + pad(style.text.outlineColor[1].toString(16), 2) + pad(style.text.outlineColor[2].toString(16), 2);
            if ($('#d2map_graphicpopup-sub-text-outlinecolor').val() != color)
                toIEColor($('#d2map_graphicpopup-sub-text-outlinecolor'), '#FFFFFF');

            color = '#' + pad(style.text.backgroundColor[0].toString(16), 2) + pad(style.text.backgroundColor[1].toString(16), 2) + pad(style.text.backgroundColor[2].toString(16), 2);
            if ($('#d2map_graphicpopup-sub-text-backgroundcolor').val() != color)
                toIEColor($('#d2map_graphicpopup-sub-text-backgroundcolor'), '#FFFFFF');
            if ($('#d2map_graphicpopup-sub-text-size').val() != style.text.fontSize)
                $('#d2map_graphicpopup-sub-text-size').val('');
            if ($('#d2map_graphicpopup-sub-text-outlinesize').val() != style.text.outlineWidth)
                $('#d2map_graphicpopup-sub-text-outlinesize').val('');
            if ($('#d2map_graphicpopup-sub-text-background').prop('checked') != style.text.showBackground)
                $('#d2map_graphicpopup-sub-text-background').prop('checked', false);
            if ($('#d2map_graphicpopup-sub-text-bold').prop('checked') != style.text.bold)
                $('#d2map_graphicpopup-sub-text-bold').prop('checked', false);
            if ($('#d2map_graphicpopup-sub-text-italic').prop('checked') != style.text.italic)
                $('#d2map_graphicpopup-sub-text-italic').prop('checked', false);
            if ($('#d2map_graphicpopup-sub-text-rtl').prop('checked') != style.text.directionRightToLeft)
                $('#d2map_graphicpopup-sub-text-rtl').prop('checked', false);
            if ($('#d2map_graphicpopup-sub-text-vertical').prop('checked') != style.text.directionVertical)
                $('#d2map_graphicpopup-sub-text-vertical').prop('checked', false);
            if ($('#d2map_graphicpopup-sub-text-value').val() != prop.text)
                $('#d2map_graphicpopup-sub-text-value').val('');
            if ($('input[name="graphicpopup-sub-textAlign"]:checked').val() != textPosition)
                $('input[name="graphicpopup-sub-textAlign"]:checked').prop('checked', false);
        }
    }

    function getDoubleLineType(style) {
        let type = '';
        if (style.line.doubleLine == undefined) {
            type = 'type-1';
        } else {
            // 값이 다음과 같다고 가정
            //this.line.doubleLine = [0.00,0.30,0.70,1.00];				
            //this.line.doubleLine = [0.00,0.50,0.75,1.00];
            //this.line.doubleLine = [0.00,0.25,0.50,1.00];
            //this.line.doubleLine = [0.00,0.15,0.30,0.70,0.85,1.00];
            if (style.line.doubleLine.length > 0) {
                switch (String(style.line.doubleLine[1])) {
                    case '0.3': type = 'type-2'; break;
                    case '0.5': type = 'type-3'; break;
                    case '0.25': type = 'type-4'; break;
                    case '0.15': type = 'type-5'; break;
                }
            }
        }
        return type;
    }
}

// 스타일 팝업을 띄운다
function popupStyleShow() {
    $('.d2map_ui-popup').hide();
    $('#d2map_popup-graphic-style').show();
}

function popupStyleHide() {
    if (popupStyleIsShow() == true) {
        $('.d2map_ui-popup').hide();
        // 기본군대부호 속성 창 초기화
        $('#d2map_basic-tab').click();
        $('.d2map_popup-modal').removeClass("is-visible");

        $('.d2map_ms_prop_container').hide();
        $('#d2map_ms_prop_container_ex').hide();
    }
}

function popupStyleIsShow() {
    return $('#d2map_popup-graphic-style').is(':visible') || $('.d2map_ms_prop_container').is(':visible') || $('.d2map_ms_prop_container_ex').is(':visible');
}