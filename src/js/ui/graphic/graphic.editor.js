var GraphicUtil = D2.Core.GraphicUtil;
// TextObject - 텍스트 관리 팝업

var offsetX, offsetY, ckeditorObject, editorValue, selectObject, maxTextLength, ckeUI;
async function initTextEditorPopupUI() {

    offsetX = 0;
    offsetY = 0;
    ckeditorObject = undefined;
    editorValue = '';
    selectObject = undefined;
    ckeUI = undefined;
    maxTextLength = 10000;

    initialize();


    function initialize() {
        ckeUI = new D2.Core.CKEditorUI('d2map_popup-text-editor');
        ckeditorObject = ckeUI.getInstance();
        editorEventHandler();
    }

    function editorEventHandler() {
        var editorElement;

        editorElement = document.querySelector('#d2map_popup-text-editor');

        CKEDITOR.baseZoomFunction = function () {
            selectObject.setBaseZoomLevel(window.map.getView().getZoom());
            closeTextEditor();
        }

        // 클릭된 요소가 CKEditor 내의 객체가 아니거나
        // editor 내부의 요소가 아닐 때 수정을 종료한다.
        document.addEventListener('mousedown', function (e) {
            var popupElement = document.getElementById('d2map_popup-text-editor');
            var isPopupElem = popupElement.contains(e.target);
            var isCKEElem = e.target.className.indexOf('cke_') >= 0;

            if (!(isPopupElem || isCKEElem))
                closeTextEditor();
        });

        document.addEventListener('keydown', function (e) {
            var objList = window.graphic.getSelectObjectList();
            if (objList.length != 1)
                return false;
            if (e.keyCode == 113)
                openEditor(objList[0]);
        });

        window.onresize = throttle(function (e) {
            closeTextEditor();
        });

        window.map.getTargetElement().addEventListener('wheel', throttle(function (e) {
            closeTextEditor();
        }));

        editorElement.addEventListener('keydown', keyEvent);
        editorElement.addEventListener('keypress', keyEvent);
        editorElement.addEventListener('keyup', keyEvent);
        editorElement.addEventListener('paste', keyEvent);

        editorElement.addEventListener('contextmenu', blockBubbling);
        editorElement.addEventListener('wheel', blockBubbling);

        editorElement.addEventListener('drop', function (e) {
            e.preventDefault();
        });

        // 글상자 툴바 lock/unlock 버튼 이벤트 
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('cke_button__unlock_icon') == false)
                return;

            var bgColor, borderColor, borderWidth, data
            var objList = window.graphic.getSelectObjectList();
            var lockIcon, scale;

            bgColor = document.querySelector(`#${ckeditorObject.name}`).style.backgroundColor;
            borderColor = document.querySelector(`#${ckeditorObject.name}`).style.borderColor;
            borderWidth = document.querySelector(`#${ckeditorObject.name}`).style.borderWidth.split('px')[0];
            scale = selectObject.getScale();
            lockIcon = document.querySelector('.cke_button__unlock_icon').style.backgroundImage.split('.png')[0].split('/').pop() === 'lock' ? "lock" : "unlock";
            objList[0]._style.fill.color = bgColor;
            objList[0]._style.line.color = borderColor;
            objList[0]._style.line.width = borderWidth;
            objList[0]._prop.editorScale = lockIcon;

            data = ckeditorObject.getData();
            objList[0]._prop.editorInfo = data;
            objList[0].updateEditorInfo();

            openEditor(objList[0]);
        });

        function keyEvent(e) {
            e.stopPropagation();
            if (e.keyCode == 27) {
                closeTextEditor();
            } else {
                notification(e);
                if (selectObject._prop.type == 'table') {
                    var data = ckeditorObject.getData();
                    if (data.indexOf('<table') < 0)
                        ckeditorObject.setData(editorValue);
                    else
                        editorValue = data;
                }
            }
        }

        function blockBubbling(e) {
            e.stopPropagation();
        }

        function throttle(func, delay) {
            var throttled = false
            return (...arg) => {
                if (!throttled) {
                    throttled = true
                    setTimeout(() => {
                        func(...arg)
                        throttled = false
                    }, delay)
                }
            }
        }

        function notification(e) {
            var allowedKey;

            allowedKey = (e.ctrlKey === true && e.which === 67 || /* CTRL + C */
                e.ctrlKey === true && e.which === 88 || /* CTRL + X */
                e.ctrlKey === true && e.which === 65 || /* CTRL + A */
                e.ctrlKey === true && e.which === 90 ||   /* CTRL + Z */
                e.which === 17 || /* CTRL */
                e.which === 8 ||  /* BACKSPACE */
                e.which === 35 || /* END */
                e.which === 36 || /* HOME */
                e.which === 37 || /* LEFT */
                e.which === 38 || /* UP */
                e.which === 39 || /* RIGHT*/
                e.which === 40 || /* DOWN */
                e.which === 46 /* DEL*/
            );

            if (allowedKey)
                return true;

            //*입력값이 max보다 초과됐을때 입력중지
            if (e.target.innerText.length >= getMaxTextLength()) {
                var elem, value;
                // elem = $(ckeditorObject.element.$);
                if (document.querySelector('.cke_notifications_area') == null) {
                    document.dispatchEvent(new CustomEvent('textNtablePaste', { detail: { message: getMaxTextLength() + "자 미만으로 작성해주세요!" } }));
                }

                // value = elem.eq(elem.children().length).text();
                // value.subs

                e.preventDefault();
                return false;
            }
        }
    }
}

function openEditor(object) {
    if (object._prop.type == 'textEditor') {
        openTextEditor(object);
    } else if (object._prop.type == 'table') {
        openTableEditor(object);
    }
}

// textEditorObject - CKEditor 팝업 열기
function openTextEditor(object) {
    var editorElement, value;
    if (object == undefined)
        return;
    if (object._prop.type != 'textEditor')
        return;

    editorElement = document.querySelector('#d2map_popup-text-editor');
    selectObject = object;
    ckeUI.setSelectObject(object);

    // 팝업 값 설정
    value = object.getEditorInfo();
    editorValue = value;
    ckeditorObject.setData(value);
    ckeditorObject.resetUndo();

    if (openPopup(object) == false)
        return;

    editorElement.classList.remove('table')
    editorElement.classList.add('textEditor');
    editorElement.style.background = `${GraphicUtil.rgb2hex(selectObject._style.fill.color)}`;
    editorElement.style.border = `${selectObject._style.line.width}px solid ${GraphicUtil.rgb2hex(selectObject._style.line.color)}`;

    document.querySelector('#' + ckeditorObject.ui.get('bgstyle')._.id).style.display = 'block';

    document.querySelector('.cke_button__unlock_icon').style.backgroundImage = (
        selectObject._prop.editorScale === 'lock' ?
            `url("${window.lockPluginPath}icons/lock.png?${document.querySelector(`.cke_button__justifyblock_icon`).style.backgroundImage.split('?')[1]}` :
            `url("${window.lockPluginPath}icons/unlock.png?${document.querySelector(`.cke_button__justifyblock_icon`).style.backgroundImage.split('?')[1]}`
    );


    // 객체 수정스타일을 도시
    selectObject.showTextEditFeature();
    // Tracker 제거
    window.graphic._selectObjectManager.clearTracker();
}

// tableObject - CKEditor 팝업 열기
function openTableEditor(object) {
    var editorElement, value;
    if (object == undefined)
        return;
    if (object._prop.type != 'table')
        return;

    selectObject = object;
    ckeUI.setSelectObject(object);

    editorElement = document.querySelector('#d2map_popup-text-editor');

    // 팝업 값 설정
    value = object.getEditorInfo();
    editorValue = value;
    ckeditorObject.setData(value);
    ckeditorObject.resetUndo();

    if (openPopup(object) == false)
        return;

    editorElement.classList.remove('textEditor');
    editorElement.classList.add('table');
    editorElement.style.background = `${GraphicUtil.rgb2hex([0, 0, 0, 0])}`;
    editorElement.style.border = 0;

    document.querySelector('#' + ckeditorObject.ui.get('bgstyle')._.id).style.display = 'none';

    document.querySelector('.cke_button__unlock_icon').style.backgroundImage = (
        selectObject._prop.editorScale === 'lock' ?
            `url("${window.lockPluginPath}icons/lock.png?${document.querySelector(`.cke_button__justifyblock_icon`).style.backgroundImage.split('?')[1]}` :
            `url("${window.lockPluginPath}icons/unlock.png?${document.querySelector(`.cke_button__justifyblock_icon`).style.backgroundImage.split('?')[1]}`
    );


    // 객체 수정스타일을 도시
    selectObject.showTextEditFeature();
    // Tracker 제거
    window.graphic._selectObjectManager.clearTracker();
}

// textEditorObject - CKEditor 팝업 닫기
function closeTextEditor() {
    var data, popupElement, editorElement, bgColor, borderColor, borderWidth, editorScale;
    if (selectObject == undefined)
        return;

    popupElement = document.querySelector('#d2map_popup-text-editor-popup');
    editorElement = document.querySelector('#d2map_popup-text-editor');

    if (popupElement.style.display == 'none')
        return;

    // 객체 트래커 도시
    selectObject._showTracker = true;
    // 객체 수정 스타일을 제거
    selectObject.destroyTextEditFeature();

    // 객체의 색을 설정
    bgColor = document.querySelector(`#${ckeditorObject.name}`).style.backgroundColor;
    borderColor = document.querySelector(`#${ckeditorObject.name}`).style.borderColor;
    borderWidth = document.querySelector(`#${ckeditorObject.name}`).style.borderWidth.split('px')[0];
    editorScale = document.querySelector('.cke_button__unlock_icon').style.backgroundImage.split('.png')[0].split('/').pop();

    if (selectObject._prop.type == 'textEditor') {
        selectObject._style.fill.color = bgColor;
        selectObject._style.line.color = borderColor;
        selectObject._style.line.width = borderWidth;
        selectObject._prop.editorScale = editorScale;
    }

    // 수정된 텍스트 값을 객체에 반영
    data = ckeditorObject.getData();


    if (selectObject._prop.type == 'table') {
        updateObjectSize();
        if (data == '') {
            selectObject.destroy();
            window.graphic._selectGraphicBoard.sortZIndex();
            window.graphic.layerMessage("SelectedObjectRemove", window.graphic._selectGraphicBoard);
            selectObject = undefined;
            ckeUI.unsetSelectObject();

            return false;
        }
    }

    selectObject.setEditorInfo(data);

    // 팝업 숨기기
    popupElement.style.display = 'none';
    editorElement.blur();

    // Edit 후 선택
    window.graphic._selectObjectManager.clear();
    window.graphic._selectObjectManager.add(selectObject);
    window.graphic._selectObjectManager.selectObject(false);

    // selectObject 해제
    selectObject = undefined;
    ckeUI.unsetSelectObject();
    document.querySelector(`#${ckeditorObject.name}`).style.background = '#ffffff';
    document.querySelector(`#${ckeditorObject.name}`).style.border = '1px solid #000000';

    window.graphic.getSelectGraphicBoard().undoRedoSave();

    // 투명도 객체 사이즈를 조절한다.
    function updateObjectSize() {
        var width, height, element, coord1, coord2, pixelPos1, pixelPos2, scale;

        element = ckeditorObject.element.$;
        element = element.querySelector('table');
        scale = selectObject.getScale();
        width = element.clientWidth * scale;
        height = element.clientHeight * scale;

        pixelPos1 = [
            Number(popupElement.style.left.replace('px', '')),
            Number(popupElement.style.top.replace('px', '')),
        ];
        pixelPos2 = [
            pixelPos1[0] + width,
            pixelPos1[1] + height
        ];
        coord1 = window.map.getCoordinateFromPixel(pixelPos1);
        coord2 = window.map.getCoordinateFromPixel(pixelPos2);
        selectObject._prop.setCoordinate([coord1, coord2]);
        selectObject.updateFeature(true);
        selectObject.updateBound();
    }
}

function setMaxTextLength(length) {
    maxTextLength = length;
}

function getMaxTextLength() {
    return maxTextLength;
}

function openPopup(object) {
    var scale, minPosition, maxPosition, top, left, editorElement, popupElement, mapElement, width, height, screenSize;


    width = object.getWidth();
    height = object.getHeight();

    // 객체 크기
    if (width <= 5 || height <= 5)
        return false;

    mapElement = window.map.getTargetElement();
    screenSize = [mapElement.clientWidth, mapElement.clientHeight];
    scale = object.getScale();
    minPosition = map.getPixelFromCoordinate([object._prop.bound.minX, object._prop.bound.minY]);
    maxPosition = map.getPixelFromCoordinate([object._prop.bound.maxX, object._prop.bound.maxY]);
    top = maxPosition[1];
    left = minPosition[0];
    popupElement = document.querySelector('#d2map_popup-text-editor-popup');
    editorElement = document.querySelector('#d2map_popup-text-editor');

    if (minPosition[0] < 0 || maxPosition[1] < 0 || maxPosition[0] > screenSize[0] || minPosition[1] > screenSize[1]) {
        var currentZoom, cnt;
        cnt = 0;
        while (width > screenSize[0] || height > screenSize[1]) {
            width = width / 2;
            height = height / 2;
            ++cnt;
        }
        currentZoom = map.getView().getZoom() - cnt;
        object._showTracker = false;
        map.getView().animate({
            zoom: currentZoom,
            center: object._prop.getCenter(),
            duration: 500
        }, function () {
            openEditor(object);
        });
    }

    // 팝업 스타일 설정
    editorElement.style.transform = `scale(${scale})`;
    editorElement.style.transformOrigin = 'left top';

    if (object._prop.type == 'table') {
        var tableElement = popupElement.querySelector('table');

        tableElement.style.width = width / scale + 'px';
        tableElement.style.height = height / scale + 'px';

        editorElement.style.width = 'auto';
        editorElement.style.height = 'auto';
        editorElement.style.display = 'inline-block';
    } else if (object._prop.type == 'textEditor') {
        editorElement.style.width = width / scale + 'px';
        editorElement.style.height = height / scale + 'px';
        editorElement.style.display = 'block';
    }


    popupElement.style.width = width + 'px';
    popupElement.style.height = height + 'px';
    popupElement.style.top = top + offsetY + 'px';
    popupElement.style.left = left + offsetX + 'px';
    popupElement.style.display = 'block';

    // 팝업 도시
    // popupElement.show();
    editorElement.focus();
    return;
}