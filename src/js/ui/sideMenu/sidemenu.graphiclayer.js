// 2021년12월8일패치 
// 사이드 메뉴 - 투명도 레이어 관리
async function initSidebarGraphicLayer() {
    var graphic = window.graphic;

    graphic._layerCallback = layerCallback;
    reloadBoardList();

    $('#graphiclayer-layer-controller a').on('click', function () {
        var tId = $(this).attr('id').splitPop('-');
        var layerList = graphic._graphicBoard;
        var layer = graphic.getSelectGraphicBoard();
        var currentIndex = layerList.indexOf(layer);
        switch (tId) {
            case 'forward':
                graphic.changeGraphicBoardOrder(currentIndex, currentIndex + 1, true);
                break;
            case 'backward':
                graphic.changeGraphicBoardOrder(currentIndex, currentIndex - 1, false);
                break;
            case 'top':
                graphic.changeGraphicBoardOrder(currentIndex, layerList.length - 1, true);
                break;
            case 'bottom':
                graphic.changeGraphicBoardOrder(currentIndex, 0, false);
                break;
            case 'create':
                var index = window.graphic.addGraphicBoard();
                graphic.setSelectGraphicBoard(index);
                break;
            case 'remove':
                graphic.removeGraphicBoard(currentIndex);
                graphic.setSelectGraphicBoard(0);
                break;
            case 'save':
                //exportStdXML(true)이면 군대부호에 적용된 모든 태그를 xml에 저장
                //exportStdXML(false)이면 군대부호 UI에서 변경된 태그만 xml에 저장
                //exportStdXML()의 디폴트값은 false
                var xml = layer.exportStdXML();
                // XML 용량 산정
                // https://programmingsummaries.tistory.com/239 참고
                let byteString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml.outerHTML
                let byteLength = (function (s, b, i, c) {
                    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
                    return b
                })(byteString);
                console.log("XML 용량 " + byteLength + " Bytes");
                //

                D2.Core.GraphicUtil.download("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + xml.outerHTML, 'graphic.xml', 'text/plain');
                break;
            case 'open':
                $('#layer-open-input').trigger('click');
                break;
            case 'rename':
                layer.setName("TEST");
                break;
        }
        reloadBoardList();
    });

    // - 투명도 레이어 UI 이벤트
    // 투명도 레이어 열기
    $('#layer-open-input').on('change', function () {
        var thisElem = this;
        var reader = new FileReader();
        var file = thisElem.files[0];

        reader.onload = function (e) {
            try {
                var index = window.graphic.addGraphicBoard();
                var board = window.graphic.getGraphicBoard(index);
                window.graphic.setSelectGraphicBoard(index);
                xml = new DOMParser().parseFromString(e.target.result, "text/xml");
                if (board != null)
                    board.importStdXML(xml);
                thisElem.value = '';
                reloadBoardList();
            } catch (e) {
                console.log(e);
            }
        };
        reader.readAsText(file);
    });

    // 모든 투명도 레이어 도시 상태 활성화
    $('#graphiclayer-layer-visible-checkAll').on('click', function () {
        var isChecked = $(this).is(':checked');
        var layerList = graphic._graphicBoard;
        for (var i = 0; i < layerList.length; i++) {
            const element = layerList[i];
            if (element.getVisible() == isChecked)
                continue;
            element.setVisible(isChecked);
        }
        reloadBoardList();
    });

    // 투명도 레이어 활성화
    $(document).on('click', '#graphiclayer-layer-list-content .graphiclayer-list-row', function (e) {
        if (e.target.tagName == 'INPUT')
            return;

        var index = $('#graphiclayer-layer-list-content .graphiclayer-list-row').index(this);
        graphic.setSelectGraphicBoard(graphic.getGraphicBoardCount() - index - 1);
        reloadBoardList();
    });

    // 투명도 레이어 도시 상태 활성화
    $(document).on('change', '.graphiclayer-layer-visible', function () {
        var isChecked = $(this).is(':checked');
        var index = graphic.getGraphicBoardCount() - $('.graphiclayer-layer-visible').index(this) - 1;
        var board = graphic.getGraphicBoard(index);
        var isBoardVisible = board.getVisible();
        if (isBoardVisible != isChecked)
            board.setVisible(isChecked);
        reloadBoardList();
    });

    // - 투명도 객체 UI 이벤트
    // 모든 투명도 객체 도시 상태
    $('#graphiclayer-object-visible-checkAll').on('click', function () {
        var isChecked = $(this).is(':checked');
        var objList = graphic.getSelectGraphicBoard().getParentObjectList();
        for (var i = 0; i < objList.length; i++) {
            const element = objList[i];
            if (element.getVisible() == isChecked)
                continue;
            if (element._prop.type == 'group')
                // 그룹 자식 객체 적용 여부
                element.setVisible(isChecked, true);
            else
                element.setVisible(isChecked);
        }
        reloadObjectList();
    });

    // 투명도 객체 선택
    $(document).on('click', '#graphiclayer-object-list-content .graphiclayer-list-row', function (e) {
        if (e.target.tagName == 'INPUT')
            return;

        var index = $('#graphiclayer-object-list-content .graphiclayer-list-row').index(this);
        var objList = graphic.getSelectGraphicBoard().getParentObjectList();
        var obj = objList[objList.length - index - 1];
        graphic._selectObjectManager.clear();
        graphic._selectObjectManager.add(obj);
        graphic._selectObjectManager.selectObject();
    });

    // 투명도 객체 도시 상태
    $(document).on('change', '.graphiclayer-object-visible', function () {
        var isChecked = $(this).is(':checked');
        var index = $('.graphiclayer-object-visible').index(this);
        var objList = graphic.getSelectGraphicBoard().getParentObjectList();
        var object = objList[objList.length - index - 1];
        var isObjectVisible = object.getVisible();
        if (isObjectVisible == isChecked)
            return;
        if (object._prop.type == 'group')
            // 그룹 자식 객체 적용 여부
            object.setVisible(isChecked, true);
        else
            object.setVisible(isChecked);
    });

    // 레이어를 불러온다.
    function reloadBoardList() {
        var boardList = graphic._graphicBoard;
        var boardListContent = $('#graphiclayer-layer-list-content');
        boardListContent.html('');
        for (var i = 0; i < boardList.length; i++) {
            const element = boardList[i];
            createBoardElement(element);
        }
        reloadObjectList();

        function createBoardElement(board) {
            var isEnable = false;
            var isVisible = true;
            var row;

            boardListContent.prepend('<div class="graphiclayer-list-row"></div>');
            row = boardListContent.children('div.graphiclayer-list-row:first-child');
            isVisible = board.getVisible() ? 'checked' : '';
            if (graphic.getSelectGraphicBoard() == board)
                isEnable = true;

            // visible
            addElement(row, '<input type="checkbox" class="graphiclayer-layer-visible" ' + isVisible + '>');
            // 레이어 이름
            addElement(row, board.getName());
            // 활성
            addElement(row, isEnable ? 'O' : 'X');
            // 생성일시
            addElement(row, board.getCreateTime());
        }
    }

    // 선택된 레이어의 모든 객체를 불러온다.
    function reloadObjectList() {
        var board = graphic.getSelectGraphicBoard();
        if (board == undefined)
            return;
        var objList = board.getParentObjectList();
        var objectListContent = $('#graphiclayer-object-list-content');
        objectListContent.html('');
        for (var i = 0; i < objList.length; i++) {
            const element = objList[i];
            addGraphicObject(element);
        }
    }

    function addGraphicObject(object) {
        var isVisible, name, isEnable, isLock, createTime, row, objectListContent, enableObjList;

        objectListContent = $('#graphiclayer-object-list-content');
        enableObjList = graphic.getSelectObjectList();
        objectListContent.prepend('<div class="graphiclayer-list-row"></div>');
        row = objectListContent.children('div.graphiclayer-list-row:first-child');

        row.attr('guid', object._prop.guid);
        isVisible = object.getVisible() ? 'checked' : '';
        name = object._prop.name;
        isEnable = enableObjList.indexOf(object) >= 0 ? 'O' : 'X';
        isLock = object.getLock() ? 'O' : 'X';
        createTime = object.getCreateTime();

        addElement(row, '<input type="checkbox" class="graphiclayer-object-visible" ' + isVisible + '>');
        addElement(row, name);
        addElement(row, isEnable);
        addElement(row, isLock);
        addElement(row, createTime);
    }

    // 레이어 / 객체를 로드할 때 HTML태그를 생성한다
    function addElement(place, text) {
        place.append('<span>' + text + '</span>');
    }

    // 투명도 관리 클래스에서 생성하는 이벤트 정보
    function layerCallback(type, param1, param2) {
        // type : 콜백 종류
        // param1 : 투명도 레이어
        // param2 : 투명도 객체
        var selectedGraphicBoard = window.graphic.getSelectGraphicBoard();
        switch (type) {
            // 투명도 객체 생성
            case 'CreateObject':
                if (param2._graphicBoard.getGUID() == selectedGraphicBoard.getGUID())
                    addGraphicObject(param2);
                break;
            // 투명도 레이어 열기
            case 'LoadGraphicBoard':
                reloadBoardList();
                break;
            // 선택한 투명도 객체 그룹화
            case 'SelectedObjectToGroup':
                reloadObjectList();
                break;
            // 선택한 투명도 객체 그룹화 해제
            case 'SelectedObjectToUnGroup':
                reloadObjectList();
                break;
            // 선택한 투명도 객체 삭제
            case 'SelectedObjectRemove':
                reloadObjectList();
                break;
            // 선택한 투명도 객체 복사
            case 'SelectedObjectToCopy':
            // 선택한 투명도 객체 붙여넣기
            case 'SelectedObjectToPaste':
            // 선택한 투명도 객체 변경
            case 'SelectedObjectChange':
                var selectedObject = window.graphic.getSelectObjectList();
                $('#graphiclayer-object-list-content .graphiclayer-list-row span:nth-child(3)').text('X');
                for (let i = 0; i < selectedObject.length; i++) {
                    var guid = selectedObject[i].getGUID();
                    $('.graphiclayer-list-row[guid=' + guid + ']').children('span').eq(2).text('O');
                }

                closeTextEditor();
                break;
            // 객체의 레이어 변경
            case 'ObjectChangeLayer':
                reloadBoardList();
                break;
            // 객체의 순서 변경
            case 'ObjectOrderChange':
                reloadBoardList();
                break;
            // 투명도 레이어 추가
            case 'AddGraphicBoard':
                reloadBoardList();
                break;
            // 투명도 레이어 선택
            case 'SelectGraphicBoard':
                reloadObjectList();
                break;
            // 모든 객체 삭제
            case 'RemoveAllObject':
                reloadBoardList();
                break;
            // 투명도 레이어 삭제
            case 'RemoveGraphicBoard':
                reloadBoardList();
                break;
            // 투명도 레이어가 비어있음
            case 'EmptyGraphicBoard':
            // undo / redo
            case 'RedoUndoGraphicBoard':
                reloadObjectList();
                break;
            // 투명도 객체 이름 변경
            // sidemenu.graphicapp.js 300 Line
            case 'SelectedObjectRename':
                reloadBoardList();
                break;
            // 객체 더블클릭
            case 'SelectedObjectToDClick':
                graphic._styleCallback('popupStyleOpen', param2);
                break;
            // 객체생성이 완료되거나 더블클릭시 TextEditor를 연다.
            case 'CreateObjectDone':
                // case 'SelectedObjectToDClick': 
                if (param2._prop.type == 'textEditor') {
                    if (param2._parent == undefined) {
                        openTextEditor(param2);
                    }
                } else if (param2._prop.type == 'table') {
                    if (param2._parent == undefined) {
                        openTableEditor(param2);
                    }
                }
                break;
        }
    }
}
