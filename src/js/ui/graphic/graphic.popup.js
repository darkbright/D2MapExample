
// 2021년12월8일패치 
// 투명도 객체 설정 창 이벤트 수행 JS
async function initGraphicPopup() {
    var graphicUtil = D2.Core.GraphicUtil;
    var ObjectStyle = D2.Core.GraphicObjectStyle;

    let draggableElems = document.querySelectorAll('.d2map_ui-popup');
    for (let elem of draggableElems) {
        new D2.Core.Draggabilly(elem, {
            containment: "body"
        });
    }

    $('.d2map_popup-close-btn').on('click', function () {
        $(this).parents('.d2map_ui-popup').hide();
    });

    $(document).on('click', '.d2map_tab-controller li', function (e) {
        var tabName = $(this).attr('data-tab');
        $('.d2map_' + tabName).siblings().hide();
        $('.d2map_' + tabName).show();
        $(this).siblings().removeClass('d2map_selected');
        $(this).addClass('d2map_selected');

        // 바뀐 팝업창의 크기가 화면을 넘어가게 되면 그만큼 빼준다
        var parent = $(this).parents('.d2map_ui-popup');
        if (parent.length == 0)
            parent = $(this).parents('.d2map_ms_prop_container');

        var parentWidth, parentHeight;
        var parentTop = parent.css('top');
        var parentLeft = parent.css('left');
        parentTop = parseInt(parentTop.replace('px'));
        parentLeft = parseInt(parentLeft.replace('px'));


        if (parent[0] != undefined) {
            parentWidth = parent[0].offsetWidth;
            parentHeight = parent[0].offsetHeight;
        } else {
            parentWidth = 0;
            parentHeight = 0;
        }

        var documentWidth = window.innerWidth;
        var documentHeight = window.innerHeight;

        if (parentWidth + parentLeft > documentWidth)
            parent.css({
                left: documentWidth - parentWidth + 'px',
            });

        if (parentHeight + parentTop > documentHeight)
            parent.css({
                top: documentHeight - parentHeight + 'px',
            });

    });

    // Feature graphicpopup input 항목
    $('input[name="graphicpopup-sub-input"]').on('propertychange change keyup paste input', function (event) {
        var sid = $(this).attr('id');
        sid = sid.replace('d2map_', '');
        var style, value, color, r, g, b, prevObjectStyle;
        var objList = window.graphic.getSelectObjectList();
        objList = graphicUtil.getObject(objList);  // 그룹 객체 내 자식 객체를 포함한 모든 객체를 반환한다.
        objList.forEach(function (obj) {
            let parent = graphicUtil.getObjParent(obj);

            if (obj._prop.type == 'image' && event.type != 'change')
                return;

            style = obj._style;
            value = Number($('#d2map_' + sid).val()) || 1;
            color = $('#d2map_' + sid).val();
            r = color.slice(1, 3);
            g = color.slice(3, 5);
            b = color.slice(5, 7);

            style.fill.gradient.stdXML_BlendFactors = undefined;
            style.fill.gradient.stdXML_FocusScale = undefined;
            style.fill.gradient.stdXML_InterpolationColors = undefined;

            if (sid == 'graphicpopup-sub-line-width') {
                // line-width 설정
                if (value < 1) value = 1;
                else if (value > 10) value = 10;

                $('#d2map_' + sid).val(value);
                style.line.width = value;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-color') {
                // line-color 설정
                style.line.color[0] = parseInt(r, 16);
                style.line.color[1] = parseInt(g, 16);
                style.line.color[2] = parseInt(b, 16);
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-alpha') {
                // line-alpha 설정
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;

                $('#d2map_' + sid).val(value);
                style.line.color[3] = value / 100;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-fill-backgroundColor') {
                // fill-color 설정
                style.line.color[0] = parseInt(r, 16);
                style.line.color[1] = parseInt(g, 16);
                style.line.color[2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-line-fill-backgroundAlpha') {
                // fill-alpha 설정
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.line.color[3] = value / 100;
            } else if (sid == 'graphicpopup-sub-line-fill-patternColor1') {
                // 패턴 색상 설정
                style.line.fill.patternColor[0][0] = parseInt(r, 16);
                style.line.fill.patternColor[0][1] = parseInt(g, 16);
                style.line.fill.patternColor[0][2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-line-fill-patternColor2') {
                // 패턴 색상 설정
                style.line.fill.patternColor[1][0] = parseInt(r, 16);
                style.line.fill.patternColor[1][1] = parseInt(g, 16);
                style.line.fill.patternColor[1][2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-line-fill-patternAlpha1') {
                // 패턴 alpha 설정
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.line.fill.patternColor[0][3] = value / 100;
            } else if (sid == 'graphicpopup-sub-line-fill-patternAlpha2') {
                // 패턴 alpha 설정
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.line.fill.patternColor[1][3] = value / 100;
            } else if (sid == 'graphicpopup-sub-line-fill-gradientColor') {
                // 그라데이션 색 설정
                if (prevObjectStyle != undefined) {
                    style.line.fill.gradient = prevObjectstyle.line.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option:selected'));
                    style.line.fill.gradient.color[index][0] = parseInt(r, 16);
                    style.line.fill.gradient.color[index][1] = parseInt(g, 16);
                    style.line.fill.gradient.color[index][2] = parseInt(b, 16);
                }
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-line-fill-gradientAlpha') {
                // 그라데이션 alpha 설정
                if (prevObjectStyle != undefined) {
                    style.line.fill.gradient = prevObjectstyle.line.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                    value = Number($('#d2map_' + sid).val()) || 0;
                    if (value < 0) value = 0;
                    else if (value > 100) value = 100;
                    $('#d2map_' + sid).val(value);
                    style.line.fill.gradient.color[index][3] = value / 100;
                }
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-line-fill-gradient-stopPoint-position') {
                // 그라데이션 중지점 설정
                if (prevObjectStyle != undefined) {
                    style.line.fill.gradient = prevObjectstyle.line.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option:selected'));
                    value = $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position').val();
                    style.line.fill.gradient.stopPoint[index] = value;
                }
                $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position-value').text(Math.floor(value * 100) + '%');
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-line-style-arrowbegin-width') {
                let arrowWidth = Number($('#d2map_graphicpopup-sub-line-style-arrowbegin-width').val()) || 0;
                if (arrowWidth < 0) arrowWidth = 0;
                else if (arrowWidth > 5) arrowWidth = 5;

                $('#d2map_graphicpopup-sub-line-style-arrowbegin-width').val(arrowWidth);
                style.line.arrow.begin.width = arrowWidth;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-style-arrowbegin-height') {
                let arrowHeight = Number($('#d2map_graphicpopup-sub-line-style-arrowbegin-height').val()) || 0;
                if (arrowHeight < 0) arrowHeight = 0;
                else if (arrowHeight > 5) arrowHeight = 5;

                $('#d2map_graphicpopup-sub-line-style-arrowbegin-height').val(arrowHeight);
                style.line.arrow.begin.height = arrowHeight;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-style-arrowend-width') {
                let arrowWidth = Number($('#d2map_graphicpopup-sub-line-style-arrowend-width').val()) || 0;
                if (arrowWidth < 0) arrowWidth = 0;
                else if (arrowWidth > 5) arrowWidth = 5;

                $('#d2map_graphicpopup-sub-line-style-arrowend-width').val(arrowWidth);
                style.line.arrow.end.width = arrowWidth;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-line-style-arrowend-height') {
                let arrowHeight = Number($('#d2map_graphicpopup-sub-line-style-arrowend-height').val()) || 0;
                if (arrowHeight < 0) arrowHeight = 0;
                else if (arrowHeight > 5) arrowHeight = 5;

                $('#d2map_graphicpopup-sub-line-style-arrowend-height').val(arrowHeight);
                style.line.arrow.end.height = arrowHeight;
                graphicUtil.createLineArrow(obj);
            } else if (sid == 'graphicpopup-sub-fill-backgroundColor') {
                // fill-color 설정
                style.fill.color[0] = parseInt(r, 16);
                style.fill.color[1] = parseInt(g, 16);
                style.fill.color[2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-fill-backgroundAlpha') {
                // fill-alpha 설정
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.fill.color[3] = value / 100;
            } else if (sid == 'graphicpopup-sub-fill-patternColor1') {
                style.fill.patternColor[0][0] = parseInt(r, 16);
                style.fill.patternColor[0][1] = parseInt(g, 16);
                style.fill.patternColor[0][2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-fill-patternColor2') {
                style.fill.patternColor[1][0] = parseInt(r, 16);
                style.fill.patternColor[1][1] = parseInt(g, 16);
                style.fill.patternColor[1][2] = parseInt(b, 16);
            } else if (sid == 'graphicpopup-sub-fill-patternAlpha1') {
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.fill.patternColor[0][3] = value / 100;
            } else if (sid == 'graphicpopup-sub-fill-patternAlpha2') {
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 100) value = 100;
                $('#d2map_' + sid).val(value);
                style.fill.patternColor[1][3] = value / 100;
            } else if (sid == 'graphicpopup-sub-fill-gradientColor') {
                if (prevObjectStyle != undefined) {
                    style.fill.gradient = prevObjectStyle.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                    style.fill.gradient.color[index][0] = parseInt(r, 16);
                    style.fill.gradient.color[index][1] = parseInt(g, 16);
                    style.fill.gradient.color[index][2] = parseInt(b, 16);
                }
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-fill-gradientAlpha') {
                if (prevObjectStyle != undefined) {
                    style.fill.gradient = prevObjectStyle.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                    value = Number($('#d2map_' + sid).val()) || 0;
                    if (value < 0) value = 0;
                    else if (value > 100) value = 100;
                    $('#d2map_' + sid).val(value);
                    style.fill.gradient.color[index][3] = value / 100;
                }
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-fill-gradient-stopPoint-position') {
                if (prevObjectStyle != undefined) {
                    style.fill.gradient = prevObjectStyle.fill.gradient;
                } else {
                    let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                    value = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position').val();
                    style.fill.gradient.stopPoint[index] = value;
                }
                $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position-value').text(Math.floor(value * 100) + '%');
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-text-color') {
                style.text.color[0] = parseInt(r, 16);
                style.text.color[1] = parseInt(g, 16);
                style.text.color[2] = parseInt(b, 16);
                // text-outlinecolor 설정
            } else if (sid == 'graphicpopup-sub-text-outlinecolor') {
                style.text.outlineColor[0] = parseInt(r, 16);
                style.text.outlineColor[1] = parseInt(g, 16);
                style.text.outlineColor[2] = parseInt(b, 16);
                // text-backgroundcolor 설정
            } else if (sid == 'graphicpopup-sub-text-backgroundcolor') {
                style.text.backgroundColor[0] = parseInt(r, 16);
                style.text.backgroundColor[1] = parseInt(g, 16);
                style.text.backgroundColor[2] = parseInt(b, 16);
                // text-size 설정
            } else if (sid == 'graphicpopup-sub-text-size') {
                if (value < 1) value = 1;
                else if (value > 100) value = 100;

                $('#d2map_' + sid).val(value);
                style.text.fontSize = value;
                // text-outlinesize 설정
            } else if (sid == 'graphicpopup-sub-text-outlinesize') {
                value = Number($('#d2map_' + sid).val()) || 0;
                if (value < 0) value = 0;
                else if (value > 5) value = 5;

                $('#d2map_' + sid).val(value);
                style.text.outlineWidth = value;
                // text-background 유무 설정
            } else if (sid == 'graphicpopup-sub-text-background') {
                var checked = $('#d2map_' + sid).prop('checked');
                style.text.showBackground = checked;
            } else if (sid == 'graphicpopup-sub-text-bold') {
                var checked = $('#d2map_' + sid).prop('checked');
                style.text.bold = checked;
            } else if (sid == 'graphicpopup-sub-text-italic') {
                var checked = $('#d2map_' + sid).prop('checked');
                style.text.italic = checked;
                // 우에서 좌로
            } else if (sid == 'graphicpopup-sub-text-rtl') {
                var checked = $('#d2map_' + sid).prop('checked');
                style.text.directionRightToLeft = checked;
                // text 세로쓰기
            } else if (sid == 'graphicpopup-sub-text-vertical') {
                var checked = $('#d2map_' + sid).prop('checked');
                style.text.directionVertical = checked;
                // text 설정
            } else if (sid == 'graphicpopup-sub-text-value') {
                value = $('#d2map_' + sid).val();
                // 군대부호에서는 텍스트 입력을 막는다.
                if (obj._prop.type != 'milSymbol')
                    obj._prop.text = value;
                // milsymbol-size 설정
            } else if (sid == 'graphicpopup-sub-rotate-value') {
                value = $('#d2map_' + sid).val() || 0;
                if (value < 0) $('#d2map_' + sid).val(0);
                if (value > 360) $('#d2map_' + sid).val(360);
                value = $('#d2map_' + sid).val();

                parent.setRotate(value);
            } else if (sid == 'graphicpopup-sub-lock') {
                value = $('#d2map_' + sid).is(':checked') || false;

                parent.setLock(value);
            } else if (sid == 'graphicpopup-sub-radius') {
                // 사각형 객체 테두리 둥글게
                value = $('#d2map_' + sid).val() || 0;
                if (value <= 0) $('#d2map_' + sid).val(0);
                if (value >= 500) $('#d2map_' + sid).val(500);
                value = $('#d2map_' + sid).val();
                obj._prop.radius = value;
                obj.updateFeature(false);
            } else if (sid == 'graphicpopup-sub-screenMode') {
                value = $('#d2map_' + sid).is(':checked') || false;
                parent.setScreenMode(value);
            } else if (sid == 'graphicpopup-sub-scalelimit' || sid == 'graphicpopup-sub-scaleupper' || sid == 'graphicpopup-sub-scalelower') {
                let scaleLimit = $('#d2map_graphicpopup-sub-scalelimit').is(':checked');
                let scaleUpper = $('#d2map_graphicpopup-sub-scaleupper').val();
                let scaleLower = $('#d2map_graphicpopup-sub-scalelower').val();

                let parent = graphicUtil.getObjParent(obj);
                parent.setScaleLimit(scaleLimit, scaleUpper, scaleLower);
            } else if (sid == 'graphicpopup-sub-milsymbol-size') {
                value = Number($('#d2map_' + sid).val()) || 1;
                if (value < 0) value = 1;
                else if (value > 30) value = 30;

                obj._prop.milSymSize = value;
                $('#d2map_' + sid).val(value);
            } else if (sid == 'graphicpopup-sub-milsymbol-width') {
                // milsymbol-width 설정
                value = Number($('#d2map_' + sid).val()) || 1;

                if (value < 0) value = 1;
                else if (value > 10) value = 10;

                obj._prop.milSymWidth = value;
                $('#d2map_' + sid).val(value);
            } else if (sid == 'graphicpopup-sub-milsymbol-information') {
                // milsymbol-information 설정
                var checked = $('#d2map_' + sid).prop('checked');
                obj._prop.infoFields = checked;
            } else if (sid == 'graphicpopup-sub-marker-size') {
                if (value < 5) value = 5;
                else if (value > 100) value = 100;
                $('#d2map_' + 'graphicpopup-sub-marker-size').val(value);
                style.marker.size = value;
            } else if (sid == 'graphicpopup-sub-point-size') {
                if (value < 5) value = 5;
                else if (value > 100) value = 100;
                $('#d2map_' + 'graphicpopup-sub-point-size').val(value);
                style.point.size = value;
            } else if (sid == 'graphicpopup-sub-point-color' || sid == 'graphicpopup-sub-point-alpha') {
                var alpha = Number($('#d2map_' + 'graphicpopup-sub-point-alpha').val()) || 0;
                if (alpha < 0) alpha = 0;
                else if (alpha > 100) alpha = 100;
                $('#d2map_' + 'graphicpopup-sub-point-alpha').val(alpha);

                color = $('#d2map_' + 'graphicpopup-sub-point-color').val();
                r = color.slice(1, 3);
                g = color.slice(3, 5);
                b = color.slice(5, 7);
                style.point.color = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), alpha / 100];
            }

            obj.updateStyle(true);
            if (parent._prop.type == 'group')
                parent.updateRotateFeature();
        });
        window.graphic._selectObjectManager.selectObject();
        var graphicBoard = window.graphic.getSelectGraphicBoard();
        if (graphicBoard && event.type == 'change') {
            graphicBoard.undoRedoSave();
        }
    });

    // Feature graphicpopup radio 항목
    $('#d2map_popup-graphic-style input[type="radio"]').on('change', function () {
        var elemName = $(this).attr('name');
        var objList = window.graphic.getSelectObjectList();
        objList = graphicUtil.getObject(objList);
        objList.forEach(function (obj) {
            var elem, value, prop, style, parent;
            elem = $('input[name="' + elemName + '"]:checked');
            obj;
            style = obj._style;
            prop = obj._prop;
            parent = graphicUtil.getObjParent(obj);

            style.fill.gradient.stdXML_BlendFactors = undefined;
            style.fill.gradient.stdXML_FocusScale = undefined;
            style.fill.gradient.stdXML_InterpolationColors = undefined;

            switch (elemName) {
                case 'graphicpopup-sub-textAlign':
                    value = elem.val();
                    value = value.split('-');
                    style.text.textBaseline = value[0];
                    style.text.textAlign = value[1];
                    break;
                case 'graphicpopup-sub-screenAnchor':
                    var parentElem, row, column;
                    parentElem = elem.parent()
                    row = parentElem.index() / 2;
                    column = parentElem.parent().index() / 2;
                    parent.setScreenAnchor([row, column]);
                    break;
            }

            obj.updateStyle(true);
            if (parent._prop.type == 'group')
                parent.updateRotateFeature();
        });

        window.graphic._selectObjectManager.selectObject();
        var graphicBoard = window.graphic.getSelectGraphicBoard();
        if (graphicBoard && event.type == 'change') {
            graphicBoard.undoRedoSave();
        }
    });

    $('#d2map_popup-graphic-style .d2map_abtn').on('click', function () {
        let sid = $(this).attr('id');
        let objList = window.graphic.getSelectObjectList()
        sid = sid.replace('d2map_', '');
        var prevObjectStyle;
        objList.forEach(function (obj) {
            var style, parent;
            style = obj._style;
            prop = obj._prop;
            parent = graphicUtil.getObjParent(obj);

            style.fill.gradient.stdXML_BlendFactors = undefined;
            style.fill.gradient.stdXML_FocusScale = undefined;
            style.fill.gradient.stdXML_InterpolationColors = undefined;

            switch (sid) {
                case 'graphicpopup-sub-fill-gradient-stopPoint-add': {
                    if (prevObjectStyle != undefined) {
                        style.fill.gradient = prevObjectStyle.fill.gradient;
                    } else {
                        let length = style.fill.gradient.color.length;
                        let stopPoint = 1;
                        let color = [0, 0, 0, 1];

                        style.fill.gradient.stopPoint.push(stopPoint);
                        style.fill.gradient.color.push(color);
                        $('#d2map_graphicpopup-sub-fill-gradient-stopPoint').append('<option value="color' + (length + 1) + '">색상 ' + (length + 1) + '</option>');
                    }
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                    break;
                }
                case 'graphicpopup-sub-fill-gradient-stopPoint-del': {
                    if (prevObjectStyle != undefined) {
                        style.fill.gradient = prevObjectStyle.fill.gradient;
                    } else {
                        let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                        let length = style.fill.gradient.color.length;

                        if (length == 1)
                            return;

                        style.fill.gradient.color.splice(index, 1);
                        style.fill.gradient.stopPoint.splice(index, 1);

                        $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').eq(index).remove();
                        $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').eq(index).prop('selected', true);
                    }
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                    break;
                }
                case 'graphicpopup-sub-line-fill-gradient-stopPoint-add': {
                    if (prevObjectStyle != undefined) {
                        style.line.fill.gradient = prevObjectStyle.line.fill.gradient;
                    } else {
                        let length, stopPoint, color;
                        stopPoint = 1
                        color = [0, 0, 0, 1];
                        length = style.line.fill.gradient.stopPoint.length;

                        style.line.fill.gradient.stopPoint.push(stopPoint);
                        style.line.fill.gradient.color.push(color);
                        $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint').append('<option value="color' + (length + 1) + '">색상 ' + (length + 1) + '</option>');
                    }
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                    break;
                }
                case 'graphicpopup-sub-line-fill-gradient-stopPoint-del': {
                    if (prevObjectStyle != undefined) {
                        style.line.fill.gradient = prevObjectStyle.line.fill.gradient;
                    } else {
                        let index = $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option:selected'));
                        let length = style.line.fill.gradient.stopPoint.length;

                        if (length == 1)
                            return;

                        style.line.fill.gradient.color.splice(index, 1);
                        style.line.fill.gradient.stopPoint.splice(index, 1);

                        $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').eq(index).remove();
                        $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').eq(index).prop('selected', true);
                    }
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                    break;
                }
            }

            obj.updateStyle(true);
            if (parent._prop.type == 'group')
                parent.updateRotateFeature();
        });

        window.graphic._selectObjectManager.selectObject();
        let graphicBoard = window.graphic.getSelectGraphicBoard();
        if (graphicBoard && event.type == 'change') {
            graphicBoard.undoRedoSave();
        }
    });
    // Feature graphicpopup Select 항목
    $('select[name="graphicpopup-sub-select"]').change(function () {
        var sid = $(this).attr('id');
        sid = sid.replace('d2map_', '');
        var objList = window.graphic.getSelectObjectList();
        objList = graphicUtil.getObject(objList);
        var prop, style, prevObjectStyle;
        objList.forEach(function (obj) {
            prop = obj._prop;
            style = obj._style;

            style.fill.gradient.stdXML_BlendFactors = undefined;
            style.fill.gradient.stdXML_FocusScale = undefined;
            style.fill.gradient.stdXML_InterpolationColors = undefined;

            // 라인 타입 설정
            if (sid == 'graphicpopup-sub-line-type') {
                var lineType = $('#d2map_graphicpopup-sub-line-type').val();

                if (lineType == 'simple') {
                    style.line.type = 'simple';
                } else if (lineType == 'arrow') {
                    style.line.type = 'arrow';
                } else {
                    style.line.type = 'dash';
                    if (lineType == 'dash') {
                        style.line.dash = [10, 10];
                    } else if (lineType == 'dash dot') {
                        style.line.dash = [10, 10, 0, 10];
                    } else if (lineType == 'dash dot dot') {
                        style.line.dash = [10, 10, 0, 10, 0, 10];
                    }
                }
                // 겹선 타입 설정
            } else if (sid == 'graphicpopup-sub-double-line-type') {
                let lineType = $('#d2map_graphicpopup-sub-double-line-type').val();

                if (lineType == 'type-1') {
                    style.line.doubleLine = undefined;
                } else if (lineType == 'type-2') {
                    style.line.doubleLine = [0.00, 0.30, 0.70, 1.00];
                } else if (lineType == 'type-3') {
                    style.line.doubleLine = [0.00, 0.50, 0.75, 1.00];
                } else if (lineType == 'type-4') {
                    style.line.doubleLine = [0.00, 0.25, 0.50, 1.00];
                } else if (lineType == 'type-5') {
                    style.line.doubleLine = [0.00, 0.15, 0.30, 0.70, 0.85, 1.00];
                }
                // milsymbol 설정
            } else if (sid == 'graphicpopup-sub-point-type') {
                var pointType = $('#d2map_graphicpopup-sub-point-type').val();
                style.point.type = pointType;

                $('#d2map_graphicpopup-sub-point-alpha').attr('disabled', false);

                let color = '#' + pad(style.fill.color[0].toString(16), 2) + pad(style.fill.color[1].toString(16), 2) + pad(style.fill.color[2].toString(16), 2);
                toIEColor($('#d2map_graphicpopup-sub-point-color'), color, false);
                $('#d2map_graphicpopup-sub-point-alpha').val(Math.round(parseFloat(style.fill.color[3]) * 100));
                // 화살표 타입
            } else if (sid == 'graphicpopup-sub-milsymbol-affiliation' || sid == 'graphicpopup-sub-milsymbol-echelon' || sid == 'graphicpopup-sub-milsymbol-status') {
                var affiliation = $('#d2map_graphicpopup-sub-milsymbol-affiliation').val();
                var unitSize = $('#d2map_graphicpopup-sub-milsymbol-echelon').val();
                var status = $('#d2map_graphicpopup-sub-milsymbol-status').val();
                var milCode = prop.milSymCode;
                var updateCode =
                    milCode.substring(0, 1) +
                    affiliation +
                    milCode.substring(2, 3) +
                    status +
                    milCode.substring(4, 10) +
                    milCode.substring(10, 11) +
                    unitSize +
                    milCode.substring(12, 13) +
                    milCode.substring(13, 14) +
                    milCode.substring(14, 15);
                prop.milSymCode = updateCode;
                // 포인트 타입 설정
            } else if (sid == 'graphicpopup-sub-line-fill-type') {
                let type = $('#d2map_' + sid).val();
                style.line.fill.type = type;

                $('.d2map_graphicpopup-sub-line-fill-simple-style').hide();
                $('#d2map_graphicpopup-sub-line-fill-pattern').hide();
                $('.d2map_graphicpopup-sub-line-fill-pattern-style').hide();
                $('#d2map_graphicpopup-sub-line-fill-gradient').hide();
                $('.d2map_graphicpopup-sub-line-fill-gradient-style').hide();
                if (type == 'simple') {
                    $('.d2map_graphicpopup-sub-line-fill-simple-style').show();
                    style.line.fill.pattern = 'horizontal';
                } else if (type == 'pattern') {
                    $('#d2map_graphicpopup-sub-line-fill-pattern').show();
                    $('.d2map_graphicpopup-sub-line-fill-pattern-style').show();
                    $('#d2map_graphicpopup-sub-line-fill-pattern-type').trigger('change');
                } else if (type == 'gradient') {
                    if (prevObjectStyle != undefined)
                        style.line.fill.gradient = prevObjectStyle.line.fill.gradient;
                    $('#d2map_graphicpopup-sub-line-fill-gradient').show();
                    $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').eq(0).prop('selected', true);
                    $('.d2map_graphicpopup-sub-line-fill-gradient-style').show();
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                }
            } else if (sid == 'graphicpopup-sub-line-fill-pattern-type') {
                let patternType = $('#d2map_' + sid).val();
                style.line.fill.pattern = patternType;
                style.line.fill.type = 'pattern';
                $('#d2map_graphicpopup-sub-line-fill-type').val('pattern').prop('selected', true);
            } else if (sid == 'graphicpopup-sub-line-fill-gradient-type') {
                if (prevObjectStyle != undefined) {
                    style.line.fill.gradient = prevObjectStyle.line.fill.gradient;
                } else {
                    let gradientType = $('#d2map_' + sid).val();
                    style.line.fill.gradient.type = gradientType;
                }
                style.line.fill.type = 'gradient';
                $('#d2map_graphicpopup-sub-line-fill-type').val('gradient').prop('selected', true);
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-line-fill-gradient-stopPoint') {
                let index = $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint option:selected'));
                if (index >= style.line.fill.gradient.color.length)
                    return;
                let color = '#' + pad(parseInt(style.line.fill.gradient.color[index][0]).toString(16), 2) + pad(parseInt(style.line.fill.gradient.color[index][1]).toString(16), 2) + pad(parseInt(style.line.fill.gradient.color[index][2]).toString(16), 2);
                $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position').val(style.line.fill.gradient.stopPoint[index]);
                $('#d2map_graphicpopup-sub-line-fill-gradient-stopPoint-position-value').text(Math.floor(style.line.fill.gradient.stopPoint[index] * 100) + '%');
                toIEColor($('#d2map_graphicpopup-sub-line-fill-gradientColor'), color);
                $('#d2map_graphicpopup-sub-line-fill-gradientAlpha').val(Math.round(parseFloat(style.line.fill.gradient.color[index][3]) * 100));
            } else if (sid == 'graphicpopup-sub-line-style-arrowbegin') {
                var arrowType = $('#d2map_graphicpopup-sub-line-style-arrowbegin').val();
                style.line.arrow.begin.type = arrowType;
            } else if (sid == 'graphicpopup-sub-fill-type') {
                let type = $('#d2map_' + sid).val();
                style.fill.type = type;

                $('.d2map_graphicpopup-sub-fill-simple-style').hide();
                $('#d2map_graphicpopup-sub-fill-pattern').hide();
                $('.d2map_graphicpopup-sub-fill-pattern-style').hide();
                $('#d2map_graphicpopup-sub-fill-gradient').hide();
                $('.d2map_graphicpopup-sub-fill-gradient-style').hide();
                if (type == 'simple') {
                    $('.d2map_graphicpopup-sub-fill-simple-style').show();
                    style.fill.pattern = 'horizontal';
                } else if (type == 'pattern') {
                    $('#d2map_graphicpopup-sub-fill-pattern').show();
                    $('.d2map_graphicpopup-sub-fill-pattern-style').show();
                    $('#d2map_graphicpopup-sub-fill-pattern-type').trigger('change');
                } else if (type == 'gradient') {
                    if (prevObjectStyle != undefined)
                        style.fill.gradient = prevObjectStyle.fill.gradient;
                    $('#d2map_graphicpopup-sub-fill-gradient').show();
                    $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').eq(0).prop('selected', true);
                    $('.d2map_graphicpopup-sub-fill-gradient-style').show();
                    prevObjectStyle = new ObjectStyle();
                    style.clone(prevObjectStyle);
                }
            } else if (sid == 'graphicpopup-sub-fill-pattern-type') {
                let patternType = $('#d2map_' + sid).val();
                style.fill.pattern = patternType;
                style.fill.type = 'pattern';
                $('#d2map_graphicpopup-sub-fill-type').val('pattern').prop('selected', true);
            } else if (sid == 'graphicpopup-sub-fill-gradient-type') {
                if (prevObjectStyle != undefined) {
                    style.fill.gradient = prevObjectStyle.fill.gradient;
                } else {
                    let gradientType = $('#d2map_' + sid).val();
                    style.fill.gradient.type = gradientType;
                }
                style.fill.type = 'gradient';
                $('#d2map_graphicpopup-sub-fill-type').val('gradient').prop('selected', true);
                prevObjectStyle = new ObjectStyle();
                style.clone(prevObjectStyle);
            } else if (sid == 'graphicpopup-sub-fill-gradient-stopPoint') {
                let index = $('#d2map_graphicpopup-sub-fill-gradient-stopPoint option').index($('#d2map_graphicpopup-sub-fill-gradient-stopPoint option:selected'));
                if (index >= style.fill.gradient.color.length)
                    return;
                let color = '#' + pad(parseInt(style.fill.gradient.color[index][0]).toString(16), 2) + pad(parseInt(style.fill.gradient.color[index][1]).toString(16), 2) + pad(parseInt(style.fill.gradient.color[index][2]).toString(16), 2);
                $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position').val(style.fill.gradient.stopPoint[index]);
                $('#d2map_graphicpopup-sub-fill-gradient-stopPoint-position-value').text(Math.floor(style.fill.gradient.stopPoint[index] * 100) + '%');
                toIEColor($('#d2map_graphicpopup-sub-fill-gradientColor'), color);
                $('#d2map_graphicpopup-sub-fill-gradientAlpha').val(Math.round(parseFloat(style.fill.gradient.color[index][3]) * 100));
            } else if (sid == 'graphicpopup-sub-line-style-arrowend') {
                var arrowType = $('#d2map_graphicpopup-sub-line-style-arrowend').val();
                style.line.arrow.end.type = arrowType;
            } else if (sid == 'graphicpopup-sub-font-type') {
                var fontType = $('#d2map_graphicpopup-sub-font-type').val();
                style.text.font = fontType;
            } else if (sid == 'graphicpopup-sub-arcType') {
                let value = $('#d2map_graphicpopup-sub-arcType').val();
                switch (value) {
                    case 'type-1': {
                        prop.lineType = 1;
                        prop.fillType = 2;
                        $('#d2map_arrow-tab').show();
                        break;
                    }
                    case 'type-2': {
                        prop.lineType = 1;
                        prop.fillType = 3;
                        $('#d2map_arrow-tab').show();
                        break;
                    }
                    case 'type-3': {
                        prop.lineType = 2;
                        prop.fillType = 2;
                        $('#d2map_arrow-tab').hide();
                        break;
                    }
                    case 'type-4': {
                        prop.lineType = 3;
                        prop.fillType = 2;
                        $('#d2map_arrow-tab').hide();
                        break;
                    }
                }
            }
            obj.updateFeature(true);
        });
        window.graphic._selectObjectManager.selectObject();
        var graphicBoard = objList[0]._graphicBoard;
        if (graphicBoard) {
            graphicBoard.undoRedoSave();
        }
    });
}