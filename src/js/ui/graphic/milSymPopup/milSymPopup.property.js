function toIEColor(JQueryElement, color, isDisabled) {
    if (isIE()) {
        if (color != undefined) JQueryElement.spectrum({ color: color, preferredFormat: 'hex' });
        if (isDisabled != undefined) {
            if (isDisabled) JQueryElement.spectrum('disable');
            else JQueryElement.spectrum('enable');
        }
    } else {
        if (color != undefined) JQueryElement.val(color);
        if (isDisabled != undefined) JQueryElement.attr('disabled', isDisabled);
    }

    function isIE() {
        var agent = navigator.userAgent.toLowerCase();
        if ((navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || agent.indexOf('msie') != -1) return true;
        else return false;
    }
}


// 문자열의 값이 유효(null, undefined, '' 가 아닐 때 유효)한지 검사한다.
// @param string src 값의 유효성을 체크할 대상
function isValid(src) {
    if (src === undefined || src === null || src === '') {
        return false;
    } else {
        return true;
    }
}

let instance;
class MilSymbolProperties {
    constructor() {
        if (instance)
            return instance;

        this._msMinSize = 3;
        this._msDefaultSize = 7;
        this._msMaxSize = 14;

        this._prop = undefined;
        instance = this;
        this.selectObjectList = null;
        this.msMap = new Map();
        this.initialize();
    }

    toHex(d) {
        return ("0" + (Number(d).toString(16))).slice(-2).toUpperCase()
    }

    initialize() {
        const self = this;
        const sidcSelector = new SIDCSelector($('#d2map_msSIDCTree'));

        // 스크린 크기에 따라 군대부호 속성 창 draggable 선별적 적용
        const mql = window.matchMedia("screen and (max-width: 830px)");
        mql.addEventListener("load", function (e) {
            if (e.matches) {
                // 모바일 화면 - draggable 미적용
                $('#d2map_ms_prop_container, #ms_prop_container_ex').draggable('disable');
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("top", "49px");
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("left", "0px");
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("bottom", "40px");
                $('.d2map_sub').css("top", "0px");
                $('.d2map_sub').css("bottom", "0px");
            } else {
                // 웹 화면 - draggable 적용
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("top", "49px");
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("left", "0px");
                $('#d2map_ms_prop_container, #ms_prop_container_ex').css("bottom", "auto");
                $('#d2map_ms_prop_container, #ms_prop_container_ex').draggable('enable');
                $('.d2map_sub').css("top", "auto");
                $('.d2map_sub').css("bottom", "auto");
            }
        });

        $(document).on('click', '.d2map_popupGraphicMSProperty', function () {
            let sidc = window.graphic.getSelectObjectList()[0]._prop.msOriginKey;
            self.setMSStyle(sidc);
        });

        // Milsymbol prop edit 팝업 닫기
        $(document).on('click', '#d2map_ms-prop-edit-close_ex', function () {
            if ($(this).parents('.d2map_ms_prop_container').attr('id') == 'ms_prop_container_nonpoint') $('.d2map_ui-draggable').hide();
            // 기본군대부호 속성 창 초기화
            $('#d2map_basic-tab').click();
            $('.d2map_popup-modal').removeClass("is-visible");

            $(this).parents('.d2map_ms_prop_container').hide();
        });

        // AH event handler
        // AH 팝업에서 탭 종류가 여러개 존재하기에 함수에 파라미터를 전달해야 됨.
        $(document).on('change', '.d2map_ms-prop-edit-bottom-forAH', function (e) {
            if ($(e.target).attr('min') && Number($(e.target).val()) < Number($(e.target).attr('min')))
                $(e.target).val($(e.target).attr('min'));
            else if ($(e.target).attr('max') && $(e.target).val() > Number($(e.target).attr('max')))
                $(e.target).val($(e.target).attr('max'));
            self.previewTacticalSymbol(false, e.target.className);
        });

        // AI event handler
        // AI 팝업에서 탭 종류가 여러개 존재하기에 함수에 파라미터를 전달해야 됨.
        $(document).on('change', '.d2map_ms-prop-edit-bottom-forAI', function (e) {
            if ($(e.target).attr('min') && Number($(e.target).val()) < Number($(e.target).attr('min')))
                $(e.target).val($(e.target).attr('min'));
            else if ($(e.target).attr('max') && $(e.target).val() > Number($(e.target).attr('max')))
                $(e.target).val($(e.target).attr('max'));
            self.previewTacticalSymbol(false, e.target.className);
        });

        // AJ event handler
        $(document).on('change', '.d2map_ms-prop-edit-bottom-forAJ', function (e) {
            if ($(e.target).attr('min') && Number($(e.target).val()) < Number($(e.target).attr('min')))
                $(e.target).val($(e.target).attr('min'));
            else if ($(e.target).attr('max') && $(e.target).val() > Number($(e.target).attr('max')))
                $(e.target).val($(e.target).attr('max'));
            self.previewTacticalSymbol();
        });

        // AH 없음 탭 이벤트 호출
        $(document).on('click', '#d2map_AH-confirm-btn', function () {
            self.previewTacticalSymbol(false, 'AH');
        });

        // AI 없음 탭 이벤트 호출
        $(document).on('click', '#d2map_AI-confirm-btn', function () {
            self.previewTacticalSymbol(false, 'AI');
        });

        // AJ 없음 탭 이벤트 호출  
        $(document).on('click', '#d2map_AJ-confirm-btn', function () {
            self.previewTacticalSymbol(false, 'AJ');
        });

        $(document).on('change', 'input[name=ms-prop-edit-chk], select[name=ms-prop-edit-select], input[name=ms-prop-edit-text], #d2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness, #d2map_ms-prop-edit-color-properties', function (e) {
            self.previewTacticalSymbol();
        });

        // 작전활동부호 - 선/면형 이벤트 호출
        $(document).on('change', 'input[name="ms-style-input"], select[name="ms-style-input"]', function (e) {
            let selectObject = this.selectObjectList[0];
            if (selectObject) this.preivewTacticalGraphicsNonPoint(selectObject, e);
        }.bind(this));

        // 작전활동부호 prop edit 팝업 닫기
        $(document).on('click', '#ms-prop-edit-close_ex', function () {
            $('#d2map_ms_prop_container_ex').hide();
        });

        // 작전활동부호 - 점형 이벤트 호출
        $(document).on('change', 'input[name=ms-prop-edit-text_ex], select[name=ms-prop-edit-select_ex]', function (e) {
            let selectObject = this.selectObjectList[0];
            if (selectObject)
                this.previewTacticalGraphicsPoint(false, selectObject._prop.msKey);
        }.bind(this)).on('change', '#d2map_ms-style-defineColor-stroke_ex, #d2map_ms-prop-edit-color-properties_ex', function () {
            let selectObject = this.selectObjectList[0];
            if (selectObject)
                this.previewTacticalGraphicsPoint(false, selectObject._prop.msKey);
        }.bind(this));

        // Extension의 버튼의 이벤트 (객체 변경 / 속성창)
        $(document).on('click', 'a#d2map_ms-style-button-icon', function () {
            let selectObject = this.selectObjectList[0];
            sidcSelector.popupOpen(selectObject._prop.msOriginKey.replace(/\*/g, '-'));
        }.bind(this));

        $(document).on('click', 'a#d2map_ms-style-button-property', function () {
            let selectObject = this.selectObjectList[0];
            let sidc = selectObject._prop.options.SIDC;
            //작전활동부호 - 점형
            if (sidc.substring(0, 1) == 'G' || sidc.substring(0, 1) == 'W') this.popupStyleSetTacticalGraphicsPoint();
            //기본군대부호
            else this.popupStyleSetTacticalSymbol();
        }.bind(this));
    }

    //외부에서 군대부호 속성정보 화면을 표시할 경우 호출한다.
    activateMilSymbolPopup(obj) {
        //object 인스턴스가 군대부호인지 확인한다.
        if (obj instanceof MSPointObject || obj instanceof MSPolylineObject || obj instanceof MSCPointCircleObject) {
            return true;
        }
        return false;
    }

    initMilsymbolPropData() {
        let self = this;
        $.ajax({
            url: window.D2MapManager.D2MS_PROPERTY,
            success: function (data) {
                data.forEach(obj => {
                    self.msMap.set(MSSIDCUtil.getMSPropMappingKey(obj.id), obj.pr);
                });
            },
            fail: function (xhr, status, errorThrown) {
                console.error(`오류명 ${errorThrown}, 상태 ${status}`);
            }
        })
    }

    classifyProp(findSIDC, isSubIcon) {
        //console.log('classifyProp', findSIDC);

        let propStr;
        if (this.msMap.has(findSIDC)) {
            //console.log('Composite Property for SIDC :: ', findSIDC);
            propStr = this.msMap.get(findSIDC).split(',');
        } else {
            //msMap에서 속성정보를 찾지 못했을 때 textJSON에서 찾아보기
            let msTacticalLineGraphics = new MSTacticalLineGraphics(); //작전활동부호 - 선형객체관리
            let test = msTacticalLineGraphics.getMSObject(findSIDC);
            if (test !== undefined) {
                propStr = Object.keys(test.graphicObjProp.msTextJSON);
                console.log('line number 414');
            } else {
                console.warn("sorry, textJSON is not available");
                return false;
            }
            //console.log(Object.keys(test.graphicObjProp.msTextJSON)); // undefined or  ['T', 'AM', 'T1', 'W', 'W1', 'X', 'X1'] array return
        }

        let composeProperty = false;
        let findSIDCObject = {};
        for (let i = 0; i < propStr.length; i++) {
            findSIDCObject[propStr[i]] = '1';
        }

        let subQuery = '';
        if (isSubIcon == true)
            subQuery = ':not("#d2map_ms_prop_container_nonpoint *")';

        let codeScheme = findSIDC.substr(0, 1).toUpperCase();

        //console.log(findSIDC, codeScheme);
        switch (codeScheme) { // 상태 표시
            case 'S':
            case 'I':
            case 'O':
            case 'G':
                if (findSIDCObject.stat === '1') {
                    $('.d2map_status' + subQuery).show();
                    $('.d2map_status_emergency' + subQuery).hide();
                    $('.d2map_status_weather' + subQuery).hide();
                }
                else {
                    $('.d2map_status' + subQuery).hide();
                    $('.d2map_status_emergency' + subQuery).hide();
                    $('.d2map_status_weather' + subQuery).hide();
                }
                break;
            case 'W': //기상부호는 Status 제어를 안한다.
                if (findSIDCObject.stat === '1') {
                    $('.d2map_status' + subQuery).hide();
                    $('.d2map_status_emergency' + subQuery).hide();
                    $('.d2map_status_weather' + subQuery).show();
                }
                else {
                    $('.d2map_status' + subQuery).hide();
                    $('.d2map_status_emergency' + subQuery).hide();
                    $('.d2map_status_weather' + subQuery).hide();
                }
                break;
            case 'E':
                if (findSIDCObject.stat === '1') {
                    $('.d2map_status' + subQuery).hide();
                    $('.d2map_status_emergency' + subQuery).show();
                    $('.d2map_status_weather' + subQuery).hide();
                }
                else {
                    $('.d2map_status' + subQuery).hide();
                    $('.d2map_status_emergency' + subQuery).hide();
                    $('.d2map_status_weather' + subQuery).hide();
                }
                break;
        }


        findSIDCObject.ocp === '1' ? $('.d2map_operationalConditionPoint' + subQuery).show() : $('.d2map_operationalConditionPoint' + subQuery).hide(); //운용조건-기본정보
        findSIDCObject.shl === '1' ? $('.d2map_icon' + subQuery).show() : $('.d2map_icon' + subQuery).hide(); // 기능부호
        findSIDCObject.shf === '1' ? $('.d2map_frame' + subQuery).show() : $('.d2map_frame' + subQuery).hide(); // 외형부호
        findSIDCObject.ff === '1' ? $('.d2map_fill' + subQuery).show() : $('.d2map_fill' + subQuery).hide(); // 외형채움
        findSIDCObject.shc === '1' ? $('.d2map_civilianColor' + subQuery).show() : $('.d2map_civilianColor' + subQuery).hide(); // 민간부호
        findSIDCObject.toco === '1' ? $('.d2map_useDefineColorTocombatEffectiveness' + subQuery).show() : $('.d2map_useDefineColorTocombatEffectiveness' + subQuery).hide(); // 사용자 정의색상-물채움
        findSIDCObject.tsz === '1' ? $('.d2map_textSize' + subQuery).show() : $('.d2map_textSize' + subQuery).hide(); // 문자크기

        if (findSIDCObject.C === '1') { $('.d2map_quantity' + subQuery).show(); composeProperty = true; } else $('.d2map_quantity' + subQuery).hide(); //수량-수식정보
        if (findSIDCObject.D === '1') { $('.d2map_mobileUnit' + subQuery).show(); composeProperty = true; } else $('.d2map_mobileUnit' + subQuery).hide(); //기동부대-수식정보
        if (findSIDCObject.F === '1') { $('.d2map_reinforcedReduced' + subQuery).show(); composeProperty = true; } else $('.d2map_reinforcedReduced' + subQuery).hide(); //부대증감-수식정보
        if (findSIDCObject.G === '1') { $('.d2map_staffComments' + subQuery).show(); composeProperty = true; } else $('.d2map_staffComments' + subQuery).hide(); //군/국가구분코드-수식정보
        if (findSIDCObject.H === '1') { $('.d2map_additionalInformation' + subQuery).show(); composeProperty = true; } else $('.d2map_additionalInformation' + subQuery).hide(); //활동사항-수식정보
        if (findSIDCObject.J === '1') { $('.d2map_evaluationRating' + subQuery).show(); composeProperty = true; } else $('.d2map_evaluationRating' + subQuery).hide(); //평가등급코드-수식정보
        if (findSIDCObject.K === '1') { $('.d2map_combatEffectiveness' + subQuery).show(); composeProperty = true; } else $('.d2map_combatEffectiveness' + subQuery).hide(); //전투력-수식정보
        if (findSIDCObject.L === '1') { $('.d2map_signatureEquipment' + subQuery).show(); composeProperty = true; } else $('.d2map_signatureEquipment' + subQuery).hide(); //신호정보장비-수식정보
        if (findSIDCObject.N === '1') { $('.d2map_hostile' + subQuery).show(); composeProperty = true; } else $('.d2map_hostile' + subQuery).hide(); //적군표시-수식정보
        if (findSIDCObject.M === '1') { $('.d2map_higherFormation' + subQuery).show(); composeProperty = true; } else $('.d2map_higherFormation' + subQuery).hide(); //상급부대-수식정보
        if (findSIDCObject.P === '1') { $('.d2map_iffSif' + subQuery).show(); composeProperty = true; } else $('.d2map_iffSif' + subQuery).hide(); //수식정보-수식정보
        if (findSIDCObject.Q === '1') { $('.d2map_direction' + subQuery).show(); composeProperty = true; } else $('.d2map_direction' + subQuery).hide(); //이동방향각도-수식정보
        if (findSIDCObject.R === '1') { $('.d2map_mobilityIndicator' + subQuery).show(); composeProperty = true; } else $('.d2map_mobilityIndicator' + subQuery).hide(); //기동수단코드-수식정보
        if (findSIDCObject.R2 === '1') { $('.d2map_mobilityCode' + subQuery).show(); composeProperty = true; } else $('.d2map_mobilityCode' + subQuery).hide(); //이동성코드-수식정보
        if (findSIDCObject.S === '1') { $('.d2map_headquarters' + subQuery).show(); composeProperty = true; } else $('.d2map_headquarters' + subQuery).hide(); //지휘소/실제위치표시-수식정보
        if (findSIDCObject.T === '1') { $('.d2map_uniqueDesignation' + subQuery).show(); composeProperty = true; } else $('.d2map_uniqueDesignation' + subQuery).hide(); //고유명칭-수식정보
        if (findSIDCObject.V === '1') { $('.d2map_type' + subQuery).show(); composeProperty = true; } else $('.d2map_type' + subQuery).hide();//장비명/종류-수식정보
        if (findSIDCObject.W === '1') { $('.d2map_dtg' + subQuery).show(); composeProperty = true; } else $('.d2map_dtg' + subQuery).hide(); //활동시각-수식정보
        if (findSIDCObject.X === '1') { $('.d2map_altitudeDepth' + subQuery).show(); composeProperty = true; } else $('.d2map_altitudeDepth' + subQuery).hide(); //고도/심도/거리-수식정보
        if (findSIDCObject.Y === '1') { $('.d2map_location' + subQuery).show(); composeProperty = true; } else $('.d2map_location' + subQuery).hide(); //위치-수식정보
        if (findSIDCObject.Z === '1') { $('.d2map_speed' + subQuery).show(); composeProperty = true; } else $('.d2map_speed' + subQuery).hide(); //속도-수식정보
        if (findSIDCObject.AA === '1') { $('.d2map_specialHeadquarters' + subQuery).show(); composeProperty = true; } else $('.d2map_specialHeadquarters' + subQuery).hide(); //지휘통제소명-수식정보
        if (findSIDCObject.AB === '1') { $('.d2map_feintDummyIndicator' + subQuery).show(); composeProperty = true; } else $('.d2map_feintDummyIndicator' + subQuery).hide(); //가장/가상식별부호-수식정보
        if (findSIDCObject.AD === '1') { $('.d2map_platformType' + subQuery).show(); composeProperty = true; } else $('.d2map_platformType' + subQuery).hide(); //기반형태-수식정보
        if (findSIDCObject.AE === '1') { $('.d2map_equipmentTeardownTime' + subQuery).show(); composeProperty = true; } else $('.d2map_equipmentTeardownTime' + subQuery).hide(); //분해시간-수식정보
        if (findSIDCObject.AF === '1') { $('.d2map_commonIdentifier' + subQuery).show(); composeProperty = true; } else $('.d2map_commonIdentifier' + subQuery).hide();//공통명칭-수식정보
        if (findSIDCObject.AG === '1') { $('.d2map_auxiliaryEquipmentIndicator' + subQuery).show(); composeProperty = true; } else $('.d2map_auxiliaryEquipmentIndicator' + subQuery).hide();//보조장비코드-수식정보
        if (findSIDCObject.AH === '1') { $('.d2map_areaOfUncertainty' + subQuery).show(); composeProperty = true; } else $('.d2map_areaOfUncertainty' + subQuery).hide();//불확정구역표시-수식정보
        if (findSIDCObject.AI === '1') { $('.d2map_deadReckoningTrailer' + subQuery).show(); composeProperty = true; } else $('.d2map_deadReckoningTrailer' + subQuery).hide();//추측선표시-수식정보
        if (findSIDCObject.AJ === '1') { $('.d2map_speedLeaderTrailer' + subQuery).show(); composeProperty = true; } else $('.d2map_speedLeaderTrailer' + subQuery).hide();//속도선표시-수식정보
        //작전활동부호 영역
        if (findSIDCObject.A === '1') { $('.d2map_icon-code' + subQuery).show(); composeProperty = true; } else $('.d2map_icon-code' + subQuery).hide();//아이콘부호코드-수식정보
        if (findSIDCObject.B === '1') { $('.d2map_echelon' + subQuery).show(); composeProperty = true; } else $('.d2map_echelon' + subQuery).hide();//부대단위(규모)코드-수식정보
        if (findSIDCObject.B1 === '1') { $('.d2map_echelon1' + subQuery).show(); composeProperty = true; } else $('.d2map_echelon1' + subQuery).hide();//규모(상단)-수식정보
        if (findSIDCObject.B2 === '1') { $('.d2map_echelon2' + subQuery).show(); composeProperty = true; } else $('.d2map_echelon2' + subQuery).hide();//규모(좌측)-수식정보
        if (findSIDCObject.B3 === '1') { $('.d2map_echelon3' + subQuery).show(); composeProperty = true; } else $('.d2map_echelon3' + subQuery).hide();//규모(우측)-수식정보
        if (findSIDCObject.H1 === '1') { $('.d2map_additionalInformation1' + subQuery).show(); composeProperty = true; } else $('.d2map_additionalInformation1' + subQuery).hide(); //활동사항1-수식정보
        if (findSIDCObject.H2 === '1') { $('.d2map_additionalInformation2' + subQuery).show(); composeProperty = true; } else $('.d2map_additionalInformation2' + subQuery).hide(); //활동사항2-수식정보
        if (findSIDCObject.T1 === '1') { $('.d2map_uniqueDesignation1' + subQuery).show(); composeProperty = true; } else $('.d2map_uniqueDesignation1' + subQuery).hide(); //고유명칭1-수식정보
        if (findSIDCObject.W1 === '1') { $('.d2map_dtg1' + subQuery).show(); composeProperty = true; } else $('.d2map_dtg1' + subQuery).hide(); //활동시각1-수식정보
        if (findSIDCObject.X1 === '1') { $('.d2map_altitudeDepth1' + subQuery).show(); composeProperty = true; } else $('.d2map_altitudeDepth1' + subQuery).hide();//고도/심도/거리1-수식정보
        if (findSIDCObject.X2 === '1') { $('.d2map_altitudeDepth2' + subQuery).show(); composeProperty = true; } else $('.d2map_altitudeDepth2' + subQuery).hide();//고도/심도/거리2-수식정보
        if (findSIDCObject.X3 === '1') { $('.d2map_altitudeDepth3' + subQuery).show(); composeProperty = true; } else $('.d2map_altitudeDepth3' + subQuery).hide();//고도/심도/거리3-수식정보
        if (findSIDCObject.AM === '1') { $('.d2map_distance' + subQuery).show(); composeProperty = true; } else $('.d2map_distance' + subQuery).hide();//거리(미터)-수식정보
        if (findSIDCObject.AM1 === '1') { $('.d2map_distance1' + subQuery).show(); composeProperty = true; } else $('.d2map_distance1' + subQuery).hide();//거리(미터)1-수식정보
        if (findSIDCObject.AM2 === '1') { $('.d2map_distance2' + subQuery).show(); composeProperty = true; } else $('.d2map_distance2' + subQuery).hide();//거리(미터)2-수식정보
        if (findSIDCObject.AM3 === '1') { $('.d2map_distance3' + subQuery).show(); composeProperty = true; } else $('.d2map_distance3' + subQuery).hide();//거리(미터)3-수식정보
        if (findSIDCObject.AN === '1') { $('.d2map_angle' + subQuery).show(); composeProperty = true; } else $('.d2map_angle' + subQuery).hide();//각도-수식정보
        if (findSIDCObject.AN1 === '1') { $('.d2map_angle1' + subQuery).show(); composeProperty = true; } else $('.d2map_angle1' + subQuery).hide();//각도1-수식정보
        if (findSIDCObject.AN2 === '1') { $('.d2map_angle2' + subQuery).show(); composeProperty = true; } else $('.d2map_angle2' + subQuery).hide();//각도2-수식정보
        if (findSIDCObject.AN3 === '1') { $('.d2map_angle3' + subQuery).show(); composeProperty = true; } else $('.d2map_angle3' + subQuery).hide();//각도3-수식정보
        if (findSIDCObject.AN4 === '1') { $('.d2map_angle4' + subQuery).show(); composeProperty = true; } else $('.d2map_angle4' + subQuery).hide();//각도4-수식정보
        if (findSIDCObject.AN5 === '1') { $('.d2map_angle5' + subQuery).show(); composeProperty = true; } else $('.d2map_angle5' + subQuery).hide();//각도5-수식정보
        if (findSIDCObject.AN6 === '1') { $('.d2map_angle6' + subQuery).show(); composeProperty = true; } else $('.d2map_angle6' + subQuery).hide();//각도6-수식정보
        if (findSIDCObject.AN7 === '1') { $('.d2map_angle7' + subQuery).show(); composeProperty = true; } else $('.d2map_angle7' + subQuery).hide();//각도7-수식정보

        if (composeProperty === true) //수식정보 구성이 이루어지므로
            $('.d2map_color-properties').show();
        else
            $('.d2map_color-properties').hide();
    }

    // 기본군대부호 속성관리
    popupStyleSetTacticalSymbol() {
        const self = this;
        let selectObjlist = this.selectObjectList;
        if (selectObjlist.length != 1 && selectObjlist[0]._prop.type != 'milSymbol') return;
        if ($('#d2map_ms_prop_container_sidc').is(':visible')) $('#d2map_ms_prop_container_sidc').hide();

        let obj = new Object();
        obj.prop = new ObjectProp();
        obj.style = new ObjectStyle();
        selectObjlist[0]._style.clone(obj.style);
        selectObjlist[0]._prop.clone(obj.prop);

        let objectName = obj.prop.options.SIDC; //이름 + 군대부호 ID

        //console.log(objectName, obj.prop.options.SIDC);

        if (obj.prop.msKey == undefined) objectName += ' : ' + obj.prop.name;

        //$('#d2map_ms-prop-main-tile').text('군대부호 속성정보 : ' + obj.prop.name);

        $('#d2map_ms-prop-edit-sidc').text(objectName);
        var status = obj.prop.options.SIDC.substring(3, 4);
        status = status == '*' ? '-' : status;
        var echelon = obj.prop.options.SIDC.substring(11, 12);
        echelon = echelon == '*' ? '-' : echelon;
        $('#d2map_ms-prop-edit-select-affiliation').val(obj.prop.options.SIDC.substring(1, 2)).prop('selected', true); // 군대부호 피아구분

        $('#d2map_ms-prop-edit-select-status').val(status).prop('selected', true); // 군대부호 상태

        $('#d2map_ms-prop-edit-select-echelon').val(echelon).prop('selected', true); // 군대부호 부대규모

        let conditionPoint = obj.prop.options.operationalConditionPoint;
        if (isValid(obj.prop.options.operationalConditionPoint)) $('#d2map_ms-prop-edit-select-operationalConditionPoint').val(conditionPoint).prop('selected', true);
        // 운용조건
        else $('#d2map_ms-prop-edit-select-operationalConditionPoint').val('0').prop('selected', true);

        if (isValid(obj.prop.options.dtg)) $('#d2map_ms-prop-edit-text-dtg').val(obj.prop.options.dtg);
        // W: 활동시각
        else $('#d2map_ms-prop-edit-text-dtg').val('');

        if (isValid(obj.prop.options.altitudeDepth)) $('#d2map_ms-prop-edit-text-altitudeDepth').val(obj.prop.options.altitudeDepth);
        //X: 고도/심도/거리
        else $('#d2map_ms-prop-edit-text-altitudeDepth').val('');

        if (isValid(obj.prop.options.location)) $('#d2map_ms-prop-edit-text-location').val(obj.prop.options.location);
        // Y: 위치
        else $('#d2map_ms-prop-edit-text-location').val('');

        if (isValid(obj.prop.options.uniqueDesignation)) $('#d2map_ms-prop-edit-text-uniqueDesignation').val(obj.prop.options.uniqueDesignation);
        // T: 고유명칭
        else $('#d2map_ms-prop-edit-text-uniqueDesignation').val('');

        if (isValid(obj.prop.options.speed)) $('#d2map_ms-prop-edit-text-speed').val(obj.prop.options.speed);
        // Z: 속도
        else $('#d2map_ms-prop-edit-text-speed').val('');

        if (isValid(obj.prop.options.specialHeadquarters)) $('#d2map_ms-prop-edit-text-specialHeadquarters').val(obj.prop.options.specialHeadquarters);
        // AA: 지휘통제소명
        else $('#d2map_ms-prop-edit-text-specialHeadquarters').val('');

        if (isValid(obj.prop.options.feintDummyIndicator)) $('#d2map_ms-prop-edit-text-feintDummyIndicator').val(obj.prop.options.feintDummyIndicator);
        // AB: 가장/가상식별부호
        else $('#d2map_ms-prop-edit-text-feintDummyIndicator').val('');

        if (isValid(obj.prop.options.platformType)) $("#d2map_ms-prop-edit-select-platformType").val(obj.prop.options.platformType).prop('selected', true);
        // AD: 기반형태
        else $("#d2map_ms-prop-edit-select-platformType").val('').prop('selected', true);

        if (isValid(obj.prop.options.equipmentTeardownTime)) $("#d2map_ms-prop-edit-text-equipmentTeardownTime").val(obj.prop.options.equipmentTeardownTime);
        // AE: 분해시간
        else $("#d2map_ms-prop-edit-text-equipmentTeardownTime").val('');

        if (isValid(obj.prop.options.commonIdentifier)) $("#d2map_ms-prop-edit-text-commonIdentifier").val(obj.prop.options.commonIdentifier);
        // AF: 공통명칭
        else $("#d2map_ms-prop-edit-text-commonIdentifier").val('');

        if (isValid(obj.prop.options.auxiliaryEquipmentIndicator)) $("#d2map_ms-prop-edit-text-auxiliaryEquipmentIndicator").val(obj.prop.options.auxiliaryEquipmentIndicator);
        // AG: 보조장비코드
        else $("#d2map_ms-prop-edit-text-auxiliaryEquipmentIndicator").val('');

        if (isValid(obj.prop.options.infoColor)) $('#d2map_ms-prop-edit-color-properties').val(obj.prop.options.infoColor);
        // 사용자 지정 물채움 색
        else $('#d2map_ms-prop-edit-color-properties').val('#000000');

        if (isValid(obj.prop.options.direction)) $('#d2map_ms-prop-edit-text-direction').val(obj.prop.options.direction);
        // Q: 이동방향각도
        else $('#d2map_ms-prop-edit-text-direction').val('');

        if (isValid(obj.prop.options.mobilityIndicator)) $('#d2map_ms-prop-edit-select-mobilityIndicator').val(obj.prop.options.mobilityIndicator).prop('selected', true);
        // R: 기동수단 코드
        else $('#d2map_ms-prop-edit-select-mobilityIndicator').val('-').prop('selected', true);

        if (isValid(obj.prop.options.mobilityCode)) $('#d2map_ms-prop-edit-select-mobilityCode').val(obj.prop.options.mobilityCode).prop('selected', true);
        // R2: 이동성 코드
        else $('#d2map_ms-prop-edit-select-mobilityCode').val('-').prop('selected', true);

        if (isValid(obj.prop.options.quantity)) $("#d2map_ms-prop-edit-text-quantity").val(obj.prop.options.quantity);
        // C: 수량
        else $("#d2map_ms-prop-edit-text-quantity").val('');

        if (isValid(obj.prop.options.mobileUnit) && obj.prop.options.mobileUnit.toString() === '1') $("#d2map_ms-prop-edit-text-mobileUnit").prop('checked', true);
        // D: 기동부대
        else $("#d2map_ms-prop-edit-text-mobileUnit").prop('checked', false);

        if (isValid(obj.prop.options.reinforcedReduced)) $('#d2map_ms-prop-edit-text-reinforcedReduced').val(obj.prop.options.reinforcedReduced);
        // F: 부대증감
        else $('#d2map_ms-prop-edit-text-reinforcedReduced').val('');

        if (isValid(obj.prop.options.staffComments)) $('#d2map_ms-prop-edit-text-staffComments').val(obj.prop.options.staffComments);
        // G: 군/국가구분코드
        else $('#d2map_ms-prop-edit-text-staffComments').val('');

        if (isValid(obj.prop.options.additionalInformation)) $('#d2map_ms-prop-edit-text-additionalInformation').val(obj.prop.options.additionalInformation);
        // H: 활동사항
        else $('#d2map_ms-prop-edit-text-additionalInformation').val('');

        if (isValid(obj.prop.options.signatureEquipment)) $('#d2map_ms-prop-edit-text-signatureEquipment').val(obj.prop.options.signatureEquipment);
        // L: 신호정보장비
        else $('#d2map_ms-prop-edit-text-signatureEquipment').val('');

        if (isValid(obj.prop.options.higherFormation)) $('#d2map_ms-prop-edit-text-higherFormation').val(obj.prop.options.higherFormation);
        // M: 상급부대
        else $('#d2map_ms-prop-edit-text-higherFormation').val('');

        if (isValid(obj.prop.options.hostile)) $("#d2map_ms-prop-edit-text-hostile").val(obj.prop.options.hostile);
        // N: 적군표시
        else $("#d2map_ms-prop-edit-text-hostile").val('');

        if (isValid(obj.prop.options.evaluationRating)) $('#d2map_ms-prop-edit-select-evaluationRating').val(obj.prop.options.evaluationRating).prop('selected', true);
        // J: 평가등급코드
        else $('#d2map_ms-prop-edit-select-evaluationRating').val('-').prop('selected', true);

        if (isValid(obj.prop.options.showCombatEffectivenessLabel)) $('#d2map_ms-prop-edit-chk-showCombatEffectivenessLabel').prop('checked', true);
        // K: 전투력 체크표시 여부
        else $('#d2map_ms-prop-edit-chk-showCombatEffectivenessLabel').prop('checked', false);

        if (isValid(obj.prop.options.combatEffectiveness)) $('#d2map_ms-prop-edit-text-combatEffectiveness').val(obj.prop.options.combatEffectiveness);
        // K: 전투력
        else $('#d2map_ms-prop-edit-text-combatEffectiveness').val('');

        if (isValid(obj.prop.options.iffSif)) $('#d2map_ms-prop-edit-text-iffSif').val(obj.prop.options.iffSif);
        // P:IFF/SIF
        else $('#d2map_ms-prop-edit-text-iffSif').val('');

        if (isValid(obj.prop.options.headquarters)) $("#d2map_ms-prop-edit-text-headquarters").prop('checked', obj.prop.options.headquarters);
        // S: 지휘소/실제위치 표시
        else $("#d2map_ms-prop-edit-text-headquarters").prop('checked', false);

        if (isValid(obj.prop.options.type)) $('#d2map_ms-prop-edit-text-type').val(obj.prop.options.type);
        // V: 장비명/종류
        else $('#d2map_ms-prop-edit-text-type').val('');

        if (isValid(obj.prop.options.showCombatEffectivenessWaterFill)) $('#d2map_ms-prop-edit-chk-showCombatEffectivenessWaterFill').prop('checked', obj.prop.options.showCombatEffectivenessWaterFill);
        // 물채움 여부
        else $('#d2map_ms-prop-edit-chk-showCombatEffectivenessWaterFill').prop('checked', false);

        if (isValid(obj.prop.options.showUseDefineColor)) $('#d2map_ms-prop-edit-chk-showUseDefineColor').prop('checked', obj.prop.options.showUseDefineColor);
        // 물채움 색 지정 여부
        else $('#d2map_ms-prop-edit-chk-showUseDefineColor').prop('checked', false);

        if (isValid(obj.prop.options.useDefineColorTocombatEffectiveness)) $('#d2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness').val(obj.prop.options.useDefineColorTocombatEffectiveness);
        // 사용자 지정 물채움 색
        else $('#d2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness').val('#000000');

        if (isValid(obj.prop.options.icon)) {
            $('#d2map_ms-prop-edit-chk-displayicon').prop('checked', obj.prop.options.icon); // 기능부호(icon) 표시 여부
        } else {
            $('#d2map_ms-prop-edit-chk-displayicon').prop('checked', true);
        }
        if (isValid(obj.prop.options.frame)) $('#d2map_ms-prop-edit-chk-displayframe').prop('checked', obj.prop.options.frame);
        // 외형부호(frame) 표시 여부
        else $('#d2map_ms-prop-edit-chk-displayframe').prop('checked', true);
        if (isValid(obj.prop.options.fill)) $('#d2map_ms-prop-edit-chk-displayfill').prop('checked', obj.prop.options.fill);
        // 외형채움(fill) 표시 여부
        else $('#d2map_ms-prop-edit-chk-displayfill').prop('checked', true);
        if (isValid(obj.prop.options.civilianColor)) $('#d2map_ms-prop-edit-chk-civilianColor').prop("checked");
        // 민간부호 채움 표시 여부
        else $('#d2map_ms-prop-edit-chk-civilianColor').prop('checked', false);

        // 군대부호 크기 범위 3~14
        if (isValid(obj.prop.options.size))
            $('#d2map_ms-prop-edit-text-size').val(obj.prop.options.size);
        else
            $('#d2map_ms-prop-edit-text-size').val(this._msDefaultSize);

        if (isValid(obj.prop.options.fillOpacity)) $('#d2map_ms-prop-edit-text-opacity').val(Math.round(obj.prop.options.fillOpacity * 255));
        // 군대부호 투명(0~255)
        else $('#d2map_ms-prop-edit-text-opacity').val(255);


        // 피아배경 색상설정
        if (isValid(obj.prop.options.userDefineFillColor)) {
            $('#d2map_ms-prop-edit-chk-userDefineFillColor').prop("checked", true);

            let fillColor = obj.prop.options.userDefineFillColor.substr(0, 7); //RGBA to RGB HEX     

            if (obj.prop.options.userDefineFillColor.length > 7) //색상 코드값 내에 투명값이 존재하므로 prop.alphaFillHex에 따로 보관한다.       
                this._prop.options.alphaFillHEX = obj.prop.options.userDefineFillColor.substr(7, 8);

            //console.log(obj.prop.options.userDefineFillColor, this._prop.options.alphaFillHEX);

            $('#d2map_ms-prop-edit-color-userDefineFillColor').val(fillColor); //ARGB to RGB 필요
        }
        else
            $('#d2map_ms-prop-edit-chk-userDefineFillColor').prop('checked', false);

        if (isValid(obj.prop.options.strokeWidth)) $('#d2map_ms-prop-edit-text-strokeWidth option[value="' + obj.prop.options.strokeWidth + '"]').prop('selected');
        // 군대부호 테두리 두께
        else $('#d2map_ms-prop-edit-text-strokeWidth option[value="4"]').prop('selected');

        $('#d2map_ms-prop-edit-chk-lock').prop('checked', GraphicUtil.getObjectLock());

        // AH : 불확정 구역 표시
        if (isValid(obj.prop.options.infoAHLineLength)) $('#d2map_ms-prop-edit-text-infoAHLineLength').val(obj.prop.options.infoAHLineLength);
        // 방향-길이
        else $('#d2map_ms-prop-edit-text-infoAHLineLength').val('');

        if (isValid(obj.prop.options.infoAHAzimuth)) $('#d2map_ms-prop-edit-text-direction-infoAHAzimuth').val(obj.prop.options.infoAHAzimuth);
        // 방향-방위각
        else $('#d2map_ms-prop-edit-text-direction-infoAHAzimuth').val('');

        if (isValid(obj.prop.options.infoAHAzimuthError)) $('#d2map_ms-prop-edit-text-infoAHAzimuthError').val(obj.prop.options.infoAHAzimuthError);
        // 방향-오차각
        else $('#d2map_ms-prop-edit-text-infoAHAzimuthError').val('');

        if (obj.prop.options.areaOfUncertainty === "direction") {
            if (isValid(obj.prop.options.infoAHLineColor)) $('#d2map_ms-prop-edit-text-direction-infoAHLineColor').val(obj.prop.options.infoAHLineColor);
            // 방향-방위선-선색상
            else $('#d2map_ms-prop-edit-text-direction-infoAHLineColor').val('');
            if (isValid(obj.prop.options.areaOfUncertainty)) $('#d2map_ms-prop-edit-text-direction-infoAHLineWidth').val(obj.prop.options.infoAHLineWidth);
            // 방향-방위선-선굵기
            else $('#d2map_ms-prop-edit-text-direction-infoAHLineWidth').val('');
            if (isValid(obj.prop.options.infoAHLineStyle)) $('#d2map_ms-prop-edit-text-direction-infoAHLineStyle').val(obj.prop.options.infoAHLineStyle);
            // 방향-방위선-점선형태
            else $('#d2map_ms-prop-edit-text-direction-infoAHLineStyle').val('');
        } else if (obj.prop.options.areaOfUncertainty === "ellipse") {
            if (isValid(obj.prop.options.infoAHLineColor)) $('#d2map_ms-prop-edit-text-ellipse-infoAHLineColor').val(obj.prop.options.infoAHLineColor);
            // 타원-선색상
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHLineColor').val('');
            if (isValid(obj.prop.options.areaOfUncertainty)) $('#d2map_ms-prop-edit-text-ellipse-infoAHLineWidth').val(obj.prop.options.infoAHLineWidth);
            // 타원-선굵기
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHLineWidth').val('');
            if (isValid(obj.prop.options.infoAHLineStyle)) $('#d2map_ms-prop-edit-text-ellipse-infoAHLineStyle').val(obj.prop.options.infoAHLineStyle);
            // 타원-점선형태
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHLineStyle').val('');
            if (isValid(obj.prop.options.infoAHRectWidth)) $('#d2map_ms-prop-edit-text-ellipse-infoAHRectWidth').val(obj.prop.options.infoAHRectWidth);
            // 타원-가로길이 
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHRectWidth').val('');
            if (isValid(obj.prop.options.infoAHRectHeight)) $('#d2map_ms-prop-edit-text-ellipse-infoAHRectHeight').val(obj.prop.options.infoAHRectHeight);
            // 타원-세로길이
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHRectHeight').val('');
            if (isValid(obj.prop.options.infoAHAzimuth)) $('#d2map_ms-prop-edit-text-ellipse-infoAHAzimuth').val(obj.prop.options.infoAHAzimuth);
            // 타원-방위각
            else $('#d2map_ms-prop-edit-text-ellipse-infoAHAzimuth').val('');
            if (isValid(obj.prop.options.infoAHFillColor)) {
                $('#d2map_ms-prop-edit-chk-ellipse-infoAHFillColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-ellipse-infoAHFillColor').val(obj.prop.options.infoAHFillColor);
                // 타원-채움색상
            } else {
                $('#d2map_ms-prop-edit-chk-ellipse-infoAHFillColor').prop('checked', false);
                $('#d2map_ms-prop-edit-text-ellipse-infoAHFillColor').val('#0d0d0d');
            }
        } else if (obj.prop.options.areaOfUncertainty === "rectangle") {
            if (isValid(obj.prop.options.infoAHLineColor)) $('#d2map_ms-prop-edit-text-rectangle-infoAHLineColor').val(obj.prop.options.infoAHLineColor);
            // 사각형-선색상
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHLineColor').val('');
            if (isValid(obj.prop.options.areaOfUncertainty)) $('#d2map_ms-prop-edit-text-rectangle-infoAHLineWidth').val(obj.prop.options.infoAHLineWidth);
            // 사각형-선굵기
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHLineWidth').val('');
            if (isValid(obj.prop.options.infoAHLineStyle)) $('#d2map_ms-prop-edit-text-rectangle-infoAHLineStyle').val(obj.prop.options.infoAHLineStyle);
            // 사각형-점선형태
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHLineStyle').val('');
            if (isValid(obj.prop.options.infoAHRectWidth)) $('#d2map_ms-prop-edit-text-rectangle-infoAHRectWidth').val(obj.prop.options.infoAHRectWidth);
            // 사각형-가로길이
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHRectWidth').val('');
            if (isValid(obj.prop.options.infoAHRectHeight)) $('#d2map_ms-prop-edit-text-rectangle-infoAHRectHeight').val(obj.prop.options.infoAHRectHeight);
            // 사각형-세로길이
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHRectHeight').val('');
            if (isValid(obj.prop.options.infoAHAzimuth)) $('#d2map_ms-prop-edit-text-rectangle-infoAHAzimuth').val(obj.prop.options.infoAHAzimuth);
            // 사각형-방위각
            else $('#d2map_ms-prop-edit-text-rectangle-infoAHAzimuth').val('');
            if (isValid(obj.prop.options.infoAHFillColor)) {
                $('#d2map_ms-prop-edit-chk-rectangle-infoAHFillColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-rectangle-infoAHFillColor').val(obj.prop.options.infoAHFillColor);
                // 사각형 채움색상
            } else {
                $('#d2map_ms-prop-edit-chk-rectangle-infoAHFillColor').prop('checked', false);
                $('#d2map_ms-prop-edit-text-rectangle-infoAHFillColor').val('#0d0d0d');
            }
        }

        if (isValid(obj.prop.options.infoAHLineColorError)) {
            if (obj.prop.options.infoAHLineColorError !== '#0d0d0d')
                $('#d2map_ms-prop-edit-text-infoAHLineColorError').val(obj.prop.options.infoAHLineColorError);
        }
        else // 방향-오차선-선색상 
            $('#d2map_ms-prop-edit-text-infoAHLineColorError').val('#0d0d0d');

        if (isValid(obj.prop.options.infoAHLineWidthError)) $('#d2map_ms-prop-edit-text-infoAHLineWidthError').val(obj.prop.options.infoAHLineWidthError);
        // 방향-오차선-선굵기
        else $('#d2map_ms-prop-edit-text-infoAHLineWidthError').val('');

        if (isValid(obj.prop.options.infoAHLineStyleError)) $('#d2map_ms-prop-edit-text-infoAHLineStyleError').val(obj.prop.options.infoAHLineStyleError);
        // 방향-오차선-점선형태
        else $('#d2map_ms-prop-edit-text-infoAHLineStyleError').val('');

        // AI : 추측선 표시
        if (isValid(obj.prop.options.infoAIRadius)) $('#d2map_ms-prop-edit-text-infoAIRadius').val(obj.prop.options.infoAIRadius);
        // 반경
        else $('#d2map_ms-prop-edit-text-infoAIRadius').val('');

        if (obj.prop.options.deadReckoningTrailer === "circle") {
            if (isValid(obj.prop.options.infoAILineColor)) {
                $('#d2map_ms-prop-edit-chk-circle-infoAILineColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-circle-infoAILineColor').val(obj.prop.options.infoAILineColor);
                // 원-선색상 표시 여부
            } else {
                $('#d2map_ms-prop-edit-chk-circle-infoAILineColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-circle-infoAILineColor').val('#0d0d0d');
            }

            if (isValid(obj.prop.options.infoAILineWidth)) $('#d2map_ms-prop-edit-text-circle-infoAILineWidth').val(obj.prop.options.infoAILineWidth);
            // 원-선굵기
            else $('#d2map_ms-prop-edit-text-circle-infoAILineWidth').val('');

            if (isValid(obj.prop.options.infoAILineStyle)) $('#d2map_ms-prop-edit-text-circle-infoAILineStyle').val(obj.prop.options.infoAILineStyle);
            // 점선형태
            else $('#d2map_ms-prop-edit-text-circle-infoAILineStyle').val('');

        } else if (obj.prop.options.deadReckoningTrailer === "line") {
            if (isValid(obj.prop.options.infoAILineColor)) {
                $('#d2map_ms-prop-edit-chk-line-infoAILineColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-line-infoAILineColor').val(obj.prop.options.infoAILineColor);
                // 선-선색상 표시 여부
            } else {
                $('#d2map_ms-prop-edit-chk-line-infoAILineColor').prop('checked', true);
                $('#d2map_ms-prop-edit-text-line-infoAILineColor').val('#0d0d0d');
            }
            if (isValid(obj.prop.options.infoAILineWidth)) $('#d2map_ms-prop-edit-text-line-infoAILineWidth').val(obj.prop.options.infoAILineWidth);
            // 선-선굵기
            else $('#d2map_ms-prop-edit-text-line-infoAILineWidth').val('');

            if (isValid(obj.prop.options.infoAILineStyle)) $('#d2map_ms-prop-edit-text-line-infoAILineStyle').val(obj.prop.options.infoAILineStyle);
            // 점선형태
            else $('#d2map_ms-prop-edit-text-line-infoAILineStyle').val('');
        }

        if (isValid(obj.prop.options.infoAIFillColor)) {
            $('#d2map_ms-prop-edit-chk-infoAIFillColor').prop('checked', true);
            $('#d2map_ms-prop-edit-text-infoAIFillColor').val(obj.prop.options.infoAIFillColor);
            // 채움색상
        } else {
            $('#d2map_ms-prop-edit-chk-infoAIFillColor').prop('checked', false);
            $('#d2map_ms-prop-edit-text-infoAIFillColor').val('#0d0d0d');
        }

        if (isValid(obj.prop.options.infoAIStartLineX)) $('#d2map_ms-prop-edit-text-infoAIStartLineX').val(obj.prop.options.infoAIStartLineX);
        // X좌표
        else $('#d2map_ms-prop-edit-text-infoAIStartLineX').val('');

        if (isValid(obj.prop.options.infoAIStartLineY)) $('#d2map_ms-prop-edit-text-infoAIStartLineY').val(obj.prop.options.infoAIStartLineY);
        // Y좌표
        else $('#d2map_ms-prop-edit-text-infoAIStartLineY').val('');

        // AJ : 속도선 표시
        if (isValid(obj.prop.options.infoAJMovingDirection)) $('#d2map_ms-prop-edit-text-infoAJMovingDirection').val(obj.prop.options.infoAJMovingDirection);
        // 이동방향
        else $('#d2map_ms-prop-edit-text-infoAJMovingDirection').val('');

        if (isValid(obj.prop.options.infoAJMovingSpeed)) $('#d2map_ms-prop-edit-text-infoAJMovingSpeed').val(obj.prop.options.infoAJMovingSpeed);
        // 이동속력
        else $('#d2map_ms-prop-edit-text-infoAJMovingSpeed').val('');

        if (isValid(obj.prop.options.infoAJSpeedRangeLower)) {
            let value = obj.prop.options.infoAJSpeedRangeLower;
            if (value == $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLower').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLower').val(value);
        }
        // 속력구간 저속-중간
        else $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLower').val('');

        if (isValid(obj.prop.options.infoAJSpeedRangeUpper)) {
            let value = obj.prop.options.infoAJSpeedRangeUpper;
            if (value == $('#d2map_ms-prop-edit-text-infoAJSpeedRangeUpper').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJSpeedRangeUpper').val(value);
        }
        // 속력구간 중간-고속
        else $('#d2map_ms-prop-edit-text-infoAJSpeedRangeUpper').val('');

        if (isValid(obj.prop.options.infoAJSpeedRangeLengthLow)) {
            let value = obj.prop.options.infoAJSpeedRangeLengthLow;
            if (value == $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthLow').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthLow').val(value);
        }
        // 속력구간 저속길이
        else $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthLow').val('');

        if (isValid(obj.prop.options.infoAJSpeedRangeLengthMid)) {
            let value = obj.prop.options.infoAJSpeedRangeLengthMid;
            if (value == $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthMid').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthMid').val(value);
        }
        // 속력구간 중간길이
        else $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthMid').val('');

        if (isValid(obj.prop.options.infoAJSpeedRangeLengthHigh)) {
            let value = obj.prop.options.infoAJSpeedRangeLengthHigh;
            if (value == $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthHigh').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthHigh').val(value);
        }
        // 속력구간 고속길이
        else $('#d2map_ms-prop-edit-text-infoAJSpeedRangeLengthHigh').val('');

        if (isValid(obj.prop.options.infoAJLineColor)) {
            if (obj.prop.options.infoAJLineColor !== "#0d0d0d")
                $('#d2map_ms-prop-edit-text-infoAJLineColor').val(obj.prop.options.infoAJLineColor);
        }
        // 속도선-선색상
        else $('#d2map_ms-prop-edit-text-infoAJLineColor').val('#0d0d0d');

        if (isValid(obj.prop.options.infoAJLineWidth)) {
            let value = obj.prop.options.infoAJLineWidth;
            if (value == $('#d2map_ms-prop-edit-text-infoAJLineWidth').prop('placeholder'))
                value = '';
            $('#d2map_ms-prop-edit-text-infoAJLineWidth').val(value);
        }
        // 속도선-선두께
        else $('#d2map_ms-prop-edit-text-infoAJLineWidth').val('');

        if (isValid(obj.prop.options.infoAJLineStyle)) $('#d2map_ms-prop-edit-text-infoAJLineStyle').val(obj.prop.options.infoAJLineStyle);
        // 속도선-선스타일
        else $('#d2map_ms-prop-edit-text-infoAJLineStyle').val('');

        if (isValid(obj.prop.options.infoAJDynamicLength)) $('#d2map_ms-prop-edit-text-infoAJDynamicLength').val(obj.prop.options.infoAJDynamicLength);
        // 가변견인센서열 거리
        else $('#d2map_ms-prop-edit-text-infoAJDynamicLength').val('');

        if (isValid(obj.prop.options.infoAJDynamicSize)) $('#d2map_ms-prop-edit-text-infoAJDynamicSize').val(obj.prop.options.infoAJDynamicSize);
        // 가변견인센서열 크기
        else $('#d2map_ms-prop-edit-text-infoAJDynamicSize').val('');

        self.previewTacticalSymbol(true);
        // 팝업 창의 위치 설정
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var popupWidth = $('#d2map_ms_prop_container').width();
        var popupHeight = $('#d2map_ms_prop_container').height();
        $('#d2map_ms_prop_container').css({
            left: (windowWidth - popupWidth) / 2,
            top: (windowHeight - popupHeight) / 2
        });


        // 웹 상에서 팝업을 띄울 때만 동적 위치 적용 (모바일 디바이스에서는 위치 고정)
        // var RESPONSIVE_WIDTH = 830;
        // if (windowWidth > RESPONSIVE_WIDTH) {
        //     // 군대부호 객체의 중심좌표 가져오기 (map 좌표)
        //     var centerCoordArr = selectObjlist[0]._prop.getCenter();
        //     // 군대부호 객체의 중심좌표 변환 (map --> 화면)
        //     var centerPositionArr = window.map.getPixelFromCoordinate(centerCoordArr);
        //     var pageX = Math.round(centerPositionArr[0]);
        //     var pageY = Math.round(centerPositionArr[1]);
        //     var popupWidth = 830; // 군대부호 속성 편집 창의 너비
        //     var popupHeight = 338; // 군대부호 속성 편집 창의 높이 ($('#d2map_ms_prop_container').height() 값이 제대로 반환되지 않아서 상수값 적용)

        //     /* - left 값 설정 로직
        //        1. 클릭한 곳에서 팝업 크기의 절반을 뺀 값으로 설정
        //        2. 위 값이 음수면 0으로 설정 (계산된 값이 왼쪽 창보다 작은 경우 --> 팝업을 브라우저 왼쪽에 붙임)
        //        3. 위 값 + popup 너비 > 스크린 너비 일 경우 윈도우 너비에서 popup 너비를 뺀 값으로 설정 (계산된 값이 오른 쪽 창 보다 큰 경우 --> 팝업을 브라우저 오른쪽에 붙임)
        //        - top 값 설정 로직
        //        1. 클릭한 곳 - (60 + 팝업화면의 높이) 값으로 설정
        //        2. 위 값이 음수면, (클릭한 곳 + 40) 값으로 설정
        //        3. (위 값 + 팝업화면의 높이) > 를 더한 값이 스크린 높이보다 크면 0으로 설정
        //     */
        //     var left = pageX - Math.round(popupWidth / 2);
        //     if (left < 0) {
        //         left = 0;
        //     }
        //     if (left + popupWidth > windowWidth) {
        //         left = windowWidth - popupWidth;
        //     }
        //     var top = pageY - (60 + popupHeight);
        //     if (top < 0) {
        //         top = pageY + 40;
        //         if (top + popupHeight > windowHeight) {
        //             top = 0;
        //         }
        //     }
        //     $('#d2map_ms_prop_container').css({
        //         top: top + 'px',
        //         left: left + 'px',
        //     });
        // }
        //반응형 웹 적용 전 코드
        /* $('.d2map_ms-prop-edit-container').show(); */
        $('#d2map_ms_prop_container').css('display', '-webkit-flex');
        $('#d2map_ms_prop_container').css('display', 'flex');
    }


    // 작전활동부호 - 점형 속성관리
    popupStyleSetTacticalGraphicsPoint(findSIDC) {
        const self = this;
        let selectObjlist = this.selectObjectList;
        if (selectObjlist.length != 1 && selectObjlist[0]._prop.type != 'milSymbol') return;
        if ($('#d2map_ms_prop_container_sidc').is(':visible')) $('#d2map_ms_prop_container_sidc').hide();

        //this.objList = [];
        let obj = new Object();
        obj.prop = new ObjectProp();
        obj.style = new ObjectStyle();
        selectObjlist[0]._style.clone(obj.style);
        selectObjlist[0]._prop.clone(obj.prop);

        let codeScheme = findSIDC.substr(0, 1);

        $('#d2map_ms-prop-edit-sidc_ex').text(obj.prop.options.SIDC); // 군대부호
        var status = obj.prop.options.SIDC.substring(3, 4);
        status = status == '*' ? '-' : status;
        var echelon = obj.prop.options.SIDC.substring(11, 12);
        echelon = echelon == '*' ? '-' : echelon;

        //군대부호 피아구분값
        if (codeScheme === 'W')
            $('#d2map_ms-prop-edit-select-affiliation_ex').attr('disabled', true);
        else {
            $('#d2map_ms-prop-edit-select-affiliation_ex').attr('disabled', false);
            $('#d2map_ms-prop-edit-select-affiliation_ex').val(obj.prop.options.SIDC.substring(1, 2)).prop('selected', true); // 군대부호 피아구분
        }


        //군대부호 상태값
        if (obj.prop.options.SIDC.substr(0, 1) === 'W')
            $('#d2map_ms-prop-edit-select-status_weather').attr('disabled', true);
        else {
            $('#d2map_ms-prop-edit-select-status_weather').attr('disabled', false);
            $('#d2map_ms-prop-edit-select-status_ex').val(status).prop('selected', true);
        }


        // 아이콘 부호 코드 option 값 생성 (지뢰, 바람기호, 기타 별로 다름)
        var addSymbols = $('#d2map_ms-prop-edit-select-addsymbol_ex');
        var cd = obj.prop.options.SIDC;
        var mineCodeArr = ['G*G*PN----****X', 'G*M*OFS---****X', 'GFG*PN----****X', 'GHG*PN----****X', 'GNG*PN----****X', 'GUG*PN----****X', 'GFM*OFS---****X', 'GHM*OFS---****X', 'GNM*OFS---****X', 'GUM*OFS---****X'];
        var windCodeArr = ['WAS-WP----P----', 'WFS-WP----P----', 'WHS-WP----P----', 'WNS-WP----P----', 'WUS-WP----P----', 'WFS*WP----P*---', 'WHS*WP----P*---', 'WNS*WP----P*---', 'WUS*WP----P*---'];

        if (mineCodeArr.indexOf(cd) > -1) {
            // 지뢰관련 작전활동부호
            addSymbols.children('option').remove();
            $('.d2map_color-properties').hide(); // 수식정보 색상설정 숨김처리
            addSymbols.append('<option value="G*M*OMU---****X" data-lang="uncertainMine" selected></option>');
            addSymbols.append('<option value="G*M*OMT---****X" data-lang="antiTankMine"></option>');
            addSymbols.append('<option value="G*M*OMD---****X" data-lang="antilTankMineDevice"></option>');
            addSymbols.append('<option value="G*M*OME---****X" data-lang="antilTankMineDir"></option>');
            addSymbols.append('<option value="G*M*OMP---****X" data-lang="antiPersonnel"></option>');
            addSymbols.append('<option value="G*M*OMW---****X" data-lang="scatterableMine"></option>');
            addSymbols.append('<option value="G*M*OMA---****X" data-lang="protrudingMine"></option>');
            addSymbols.append('<option value="G*M*OMB---****X" data-lang="tripflare"></option>');
            addSymbols.append('<option value="G*M*OMF---****X" data-lang="multiClaymore"></option>');
        } else if (windCodeArr.indexOf(cd) > -1) {
            // 바람관련 작전활동부호
            $('.d2map_color-properties').hide();
            addSymbols.children('option').remove(); // 수식정보 색상설정 숨김처리
            addSymbols.append('<option value="WAS-CCCSCSP----" data-lang="sunny" selected></option>');
            addSymbols.append('<option value="WAS-CCCSFCP----" data-lang="littleC"></option>');
            addSymbols.append('<option value="WAS-CCCSSCP----" data-lang="someC"></option>');
            addSymbols.append('<option value="WAS-CCCSBCP----" data-lang="partlyC"></option>');
            addSymbols.append('<option value="WAS-CCCSOCP----" data-lang="cloudy"></option>');
            addSymbols.append('<option value="WAS-CCCSOBP----" data-lang="veryCloudy"></option>');
        }


        if (obj.prop.msUseDefineColor) $('#d2map_ms-style-defineColor_ex').prop('checked', obj.prop.msUseDefineColor);
        // 피아색상 checkbox
        else $('#d2map_ms-style-defineColor_ex').prop('checked', false);

        if (isValid(obj.prop.options.userDefineLineColor)) $('#d2map_ms-style-defineColor-stroke_ex').val(obj.prop.options.userDefineLineColor);
        // 피아색상 - 선색
        else $('#d2map_ms-style-defineColor-stroke_ex').val('#000000');

        if (isValid(obj.prop.options.fillOpacity)) $('#d2map_ms-prop-edit-text-opacity_ex').val(Math.round(obj.prop.options.fillOpacity * 255));
        // 피아색상 - 투명
        else $('#d2map_ms-prop-edit-text-opacity_ex').val(255);


        // 피아배경 색상설정
        if (isValid(obj.prop.options.userDefineLineColor)) {
            let lineColor = obj.prop.options.userDefineLineColor.substr(0, 7); //RGBA to RGB HEX

            if (obj.prop.options.userDefineLineColor.length > 7) //Alpha값이 존재하므로 Prop.alphaLineHEX에 별도 보관한다.
                this._prop.options.alphaLineHEX = obj.prop.options.userDefineLineColor.substr(7, 8);

            $('#d2map_ms-style-defineColor-stroke_ex').val(lineColor); //ARGB to RGB 필요
        }


        if (isValid(obj.prop.options.dtg)) $('#d2map_ms-prop-edit-text-dtg_ex').val(obj.prop.options.dtg);
        // W: 활동시각
        else $('#d2map_ms-prop-edit-text-dtg_ex').val('');

        if (isValid(obj.prop.options.dtg1)) $('#d2map_ms-prop-edit-text-dtg1_ex').val(obj.prop.options.dtg1);
        // W1: 활동시각
        else $('#d2map_ms-prop-edit-text-dtg1_ex').val('');

        if (isValid(obj.prop.options.altitudeDepth)) $('#d2map_ms-prop-edit-text-altitudeDepth_ex').val(obj.prop.options.altitudeDepth);
        // X: 고도/심도/거리
        else $('#d2map_ms-prop-edit-text-altitudeDepth_ex').val('');

        if (isValid(obj.prop.options.altitudeDepth1)) $('#d2map_ms-prop-edit-text-altitudeDepth1_ex').val(obj.prop.options.altitudeDepth1);
        // X1: 고도/심도/거리
        else $('#d2map_ms-prop-edit-text-altitudeDepth1_ex').val('');

        if (isValid(obj.prop.options.infoColor)) $('#d2map_ms-prop-edit-color-properties_ex').val(obj.prop.options.infoColor);
        // 수식정보 색상설정
        else $('#d2map_ms-prop-edit-color-properties_ex').val('#000000');

        if (isValid(obj.prop.options.type)) $('#d2map_ms-prop-edit-text-type_ex').val(obj.prop.options.type);
        //V: 장비명/종류
        else $('#d2map_ms-prop-edit-text-type_ex').val('');

        //console.log(findSIDC);

        //G*O*D-----****X에서 "T: 댐명칭"로 사용됨        
        if (MSSIDCUtil.getMSPropMappingKey(findSIDC) === 'G*O*D-----')
            $('#d2map_ms-style-nonpoint-info-T-text').attr("data-lang", "dam");
        //$('#d2map_ms-style-nonpoint-info-T-text').text("T: 댐명칭");
        else if (MSSIDCUtil.getMSPropMappingKey(findSIDC) === 'G*G*GPRE--')
            $('#d2map_ms-style-nonpoint-info-T-text').attr("data-lang", "nodeNum");
        //$('#d2map_ms-style-nonpoint-info-T-text').text("T: 노드번호");
        else
            $('#d2map_ms-style-nonpoint-info-T-text').attr("data-lang", "uniqueDesignation");
        //$('#d2map_ms-style-nonpoint-info-T-text').text("T: 고유명칭");

        if (isValid(obj.prop.options.uniqueDesignation)) $('#d2map_ms-prop-edit-text-uniqueDesignation_ex').val(obj.prop.options.uniqueDesignation);
        // T: 고유명칭
        else $('#d2map_ms-prop-edit-text-uniqueDesignation_ex').val('');


        if (MSSIDCUtil.getMSPropMappingKey(findSIDC) === 'G*G*GPRE--') {
            $('#d2map_ms-style-nonpoint-info-T1-text').attr("data-lang", "uniqueDesignation0");
            //$('#d2map_ms-style-nonpoint-info-T1-text').text("T1: 교환기번호");
        }
        else {
            $('#d2map_ms-style-nonpoint-info-T1-text').attr("data-lang", "uniqueDesignation1");
            //$('#d2map_ms-style-nonpoint-info-T1-text').text("T1: 고유명칭");
        }

        if (isValid(obj.prop.options.uniqueDesignation1)) $('#d2map_ms-prop-edit-text-uniqueDesignation1_ex').val(obj.prop.options.uniqueDesignation1);
        // T1: 고유명칭
        else $('#d2map_ms-prop-edit-text-uniqueDesignation1_ex').val('');
        if (isValid(obj.prop.options.infoColor)) $('#d2map_ms-prop-edit-color-properties_ex').val(obj.prop.options.infoColor);
        // 수식정보 색상
        else $('#d2map_ms-prop-edit-color-properties_ex').val('#000000');
        if (isValid(obj.prop.options.quantity)) $('#d2map_ms-prop-edit-text-quantity_ex').val(obj.prop.options.quantity);
        // C: 수량
        else $('#d2map_ms-prop-edit-text-quantity_ex').val('');


        //G*O*D-----****X에서 "H: 추가상황(적용수위 등)"로 사용됨        
        if (MSSIDCUtil.getMSPropMappingKey(findSIDC) === 'G*O*D-----')
            $('#d2map_ms-style-nonpoint-info-H-text').attr("data-lang", "activityAdditional");
        else if (MSSIDCUtil.getMSPropMappingKey(findSIDC) === 'G*G*GPRE--')
            $('#d2map_ms-style-nonpoint-info-H-text').attr("data-lang", "activityAdditional1");
        else
            $('#d2map_ms-style-nonpoint-info-H-text').attr("data-lang", "activity");

        if (isValid(obj.prop.options.additionalInformation)) $('#d2map_ms-prop-edit-text-additionalInformation_ex').val(obj.prop.options.additionalInformation);
        // H: 활동사항
        else $('#d2map_ms-prop-edit-text-additionalInformation_ex').val('');


        if (isValid(obj.prop.options.additionalInformation1)) $('#d2map_ms-prop-edit-text-additionalInformation1_ex').val(obj.prop.options.additionalInformation1);
        // H1: 활동사항
        else $('#d2map_ms-prop-edit-text-additionalInformation1_ex').val('');
        if (isValid(obj.prop.options.hostile)) $('#d2map_ms-prop-edit-text-hostile_ex').val(obj.prop.options.hostile);
        // N: 고유명칭
        else $('#d2map_ms-prop-edit-text-hostile_ex').val('');
        if (isValid(obj.prop.options.location)) $('#d2map_ms-prop-edit-text-location_ex').val(obj.prop.options.location);
        // Y: 위치
        else $('#d2map_ms-prop-edit-text-location_ex').val('');
        if (isValid(obj.prop.options.direction)) $('#d2map_ms-prop-edit-text-direction_ex').val(obj.prop.options.direction);
        // Q: 이동방향각도
        else $('#d2map_ms-prop-edit-text-direction_ex').val('');

        if (isValid(obj.prop.options.addSymbol)) $('#d2map_ms-prop-edit-select-addsymbol_ex').val(obj.prop.options.addSymbol).prop('selected', true);
        else $('#d2map_ms-prop-edit-select-addsymbol_ex option:eq(0)').prop('selected', true);

        if (isValid(obj.prop.options.speed)) $('#d2map_ms-prop-edit-text-speed_ex').val(obj.prop.options.speed);
        // Z: 속도
        else $('#d2map_ms-prop-edit-text-speed_ex').val('');

        // 군대부호 크기 범위 3~14
        if (isValid(obj.prop.options.size))
            $('#d2map_ms-prop-edit-text-size_ex').val(obj.prop.options.size);
        else
            $('#d2map_ms-prop-edit-text-size_ex').val(this._msDefaultSize);


        if (isValid(obj.prop.options.strokeWidth)) $('#d2map_ms-prop-edit-text-strokeWidth_ex option[value="' + obj.prop.options.strokeWidth + '"]').prop('selected');
        // 군대부호 테두리 두께
        else $('#d2map_ms-prop-edit-text-strokeWidth_ex option[value="4"]').prop('selected');

        self.previewTacticalGraphicsPoint(true, findSIDC);

        // 팝업 창의 위치 설정

        // 화면 중앙으로 팝업 이동
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var popupWidth = $('#d2map_ms_prop_container_ex').width();
        var popupHeight = $('#d2map_ms_prop_container_ex').height();
        $('#d2map_ms_prop_container_ex').css({
            left: (windowWidth - popupWidth) / 2,
            top: (windowHeight - popupHeight) / 2
        });

        // 웹 상에서 팝업을 띄울 때만 동적 위치 적용 (모바일 디바이스에서는 위치 고정)
        // var RESPONSIVE_WIDTH = 830;
        // if (windowWidth > RESPONSIVE_WIDTH) {
        //     // 군대부호 객체의 중심좌표 가져오기 (map 좌표)
        //     var centerCoordArr = selectObjlist[0]._prop.getCenter();
        //     // 군대부호 객체의 중심좌표 변환 (map --> 화면)
        //     var centerPositionArr = window.map.getPixelFromCoordinate(centerCoordArr);
        //     var pageX = Math.round(centerPositionArr[0]);
        //     var pageY = Math.round(centerPositionArr[1]);
        //     var popupWidth = 830; // 군대부호 속성 편집 창의 너비
        //     var popupHeight = 338; // 군대부호 속성 편집 창의 높이 ($('#d2map_ms_prop_container').height() 값이 제대로 반환되지 않아서 상수값 적용)

        //     /* - left 값 설정 로직
        //        1. 클릭한 곳에서 팝업 크기의 절반을 뺀 값으로 설정
        //        2. 위 값이 음수면 0으로 설정 (계산된 값이 왼쪽 창보다 작은 경우 --> 팝업을 브라우저 왼쪽에 붙임)
        //        3. 위 값 + popup 너비 > 스크린 너비 일 경우 윈도우 너비에서 popup 너비를 뺀 값으로 설정 (계산된 값이 오른 쪽 창 보다 큰 경우 --> 팝업을 브라우저 오른쪽에 붙임)
        //        - top 값 설정 로직
        //        1. 클릭한 곳 - (60 + 팝업화면의 높이) 값으로 설정
        //        2. 위 값이 음수면, (클릭한 곳 + 40) 값으로 설정
        //        3. (위 값 + 팝업화면의 높이) > 를 더한 값이 스크린 높이보다 크면 0으로 설정
        //     */
        //     var left = pageX - Math.round(popupWidth / 2);
        //     if (left < 0) {
        //         left = 0;
        //     }
        //     if (left + popupWidth > windowWidth) {
        //         left = windowWidth - popupWidth;
        //     }
        //     var top = pageY - (60 + popupHeight);
        //     if (top < 0) {
        //         top = pageY + 40;
        //         if (top + popupHeight > windowHeight) {
        //             top = 0;
        //         }
        //     }
        //     $('#d2map_ms_prop_container_ex').css({
        //         top: top + 'px',
        //         left: left + 'px',
        //     });
        // }
        //반응형 웹 적용 전 코드
        /* $('.d2map_ms-prop-edit-container').show(); */
        $('#d2map_ms_prop_container_ex').css('display', '-webkit-flex');
        $('#d2map_ms_prop_container_ex').css('display', 'flex');
    }


    // 작전활동부호 - 선형/면형 속성관리
    popupStyleSetTacticalGraphicsNonPoint() {
        let self = window;
        let selectObjlist = this.selectObjectList;
        if (selectObjlist.length != 1 && selectObjlist[0]._prop.type != 'milSymbol') return;

        let msProp = selectObjlist[0]._prop;
        let msStyle = selectObjlist[0]._style;

        //console.log(selectObjlist[0]._style, selectObjlist[0]._prop);
        setPopupValue.bind(this)();

        $('#d2map_ms-tab-controller li').eq(0).trigger('click');
        $('.d2map_ui-popup').hide();
        $('.d2map_ms_prop_container').hide();
        $('#d2map_ms_prop_container_nonpoint').show();

        setPopupPositionCenter('#d2map_ms_prop_container_nonpoint');

        // 팝업이 열릴 때 input 값들을 설정한 객체의 값으로 설정한다
        function setPopupValue() {
            //this.settingMSValue = true;
            // 이름, SIDC
            //$('#d2map_ms-nonpoint-name').text(msProp.name + ' : ' + msProp.msOriginKey);

            let codeScheme = msProp.msOriginKey.substr(0, 1);

            let echelon = msProp.msOriginKey.substring(11, 12);
            echelon = echelon == '-' ? '*' : echelon;

            let msPropName;
            if (codeScheme === 'W')
                msPropName = msProp.msOriginKey;
            else {
                msPropName = msProp.msOriginKey.substring(0, 1);
                msPropName += msProp.msAffiliation ? msProp.msAffiliation : '-';
                msPropName += msProp.msOriginKey.substring(2, 3);
                msPropName += msProp.msStatus ? msProp.msStatus : '-';
                msPropName += msProp.msOriginKey.substring(4, 11);
                msPropName += echelon ? echelon : '-';
                msPropName += msProp.msOriginKey.substring(12, 15);
            }

            $('#d2map_ms-nonpoint-name').text(msPropName);


            // 피아구분
            if (codeScheme === 'W') {
                $('#d2map_ms-style-nonpoint-aff').attr('disabled', true);
                $('#d2map_ms-style-nonpoint-aff').val('');
            }
            else {
                $('#d2map_ms-style-nonpoint-aff').attr('disabled', false);
                $('#d2map_ms-style-nonpoint-aff').val(msProp.msAffiliation);
            }

            //상태
            if (codeScheme === 'W')
                $('#d2map_ms-prop-edit-select-status_ex_weather').attr('disabled', true);
            else {
                $('#d2map_ms-prop-edit-select-status_ex_weather').attr('disabled', false);
                $('#d2map_ms-prop-edit-select-status_ex_weather').val(msProp.msStatus).attr('selected', true);
            }

            // 부호크기
            $('#d2map_ms-style-nonpoint-size').val(Math.floor(msProp.msSize * 7));
            // 투명
            // 객체 투명도
            let opacity = msProp.opacity;
            $('#d2map_ms-style-nonpoint-opacity').val(opacity);

            // 선, 면 투명
            let alpha = GraphicUtil.rgb2hex(msStyle.line.color);
            let fillAlpha = GraphicUtil.rgb2hex(msStyle.fill.color);
            if (alpha != undefined) {
                if (alpha.length == 7) alpha = 'ff';
                else if (alpha.length > 7) alpha = alpha.substring(7, 9);
                $('#d2map_ms-style-nonpoint-strokeAlpha').val(toHex(alpha)).prop('disabled', false);
            } else {
                $('#d2map_ms-style-nonpoint-fillAlpha').val('').prop('disabled', true);
            }

            if (fillAlpha != undefined) {
                if (fillAlpha.length == 7) fillAlpha = 'ff';
                else if (fillAlpha.length > 7) fillAlpha = fillAlpha.substring(7, 9);
                $('#d2map_ms-style-nonpoint-fillAlpha').val(toHex(fillAlpha)).prop('disabled', false);
            } else {
                $('#d2map_ms-style-nonpoint-fillAlpha').val('').prop('disabled', true);
            }

            // 피아색상 - 외곽선
            if (msStyle.line.color != undefined) {
                let lineColor = GraphicUtil.rgb2hex(msStyle.line.color);
                lineColor = lineColor.substr(0, 7);
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-stroke'), lineColor, false);
            } else {
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-stroke'), lineColor, true);
            }

            // 피아색상 - 채움
            if (msStyle.fill.color != undefined && msProp.msKey != 'G-M-OAR---') {
                let fillColor = GraphicUtil.rgb2hex(msStyle.fill.color);
                fillColor = fillColor.substr(0, 7);
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-fill'), fillColor, false);
                $('#d2map_ms-style-nonpoint-fillRow').show();
            } else {
                $('#d2map_ms-style-nonpoint-fillRow').hide();
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-fill'), '#ffffff', true);
            }

            // 피아색상 - 체크
            $('#d2map_ms-style-nonpoint-defineColor').prop('checked', msProp.msUseDefineColor);
            if (msProp.msUseDefineColor == false) {
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-stroke'), '#ffffff', msProp.msUseDefineColor == false);
                toIEColor($('#d2map_ms-style-nonpoint-defineColor-fill'), '#ffffff', msProp.msUseDefineColor == false);
                $('#d2map_ms-style-nonpoint-defineColor-useLineColor').prop('disabled', true);
                $('#d2map_ms-style-nonpoint-defineColor-useFillColor').prop('disabled', true);
            } else {
                $('#d2map_ms-style-nonpoint-defineColor-useLineColor').prop('disabled', false);
                $('#d2map_ms-style-nonpoint-defineColor-useFillColor').prop('disabled', false);
            }

            // 선 색상 없음
            $('#d2map_ms-style-nonpoint-defineColor-useLineColor').prop('checked', !msStyle.line.useLineColor);

            // 채움 색상 없음
            $('#d2map_ms-style-nonpoint-defineColor-useFillColor').prop('checked', !msStyle.fill.useFillColor);


            // 선굵기
            // W---HDDA----A-- 선이 얇을때 오류
            if (msProp.msKey == 'W---HDDA--') {
                $('#d2map_ms-style-nonpoint-lineWidth').prop('disabled', true);
                $('#d2map_ms-style-nonpoint-lineWidth').val('');
            } else {
                $('#d2map_ms-style-nonpoint-lineWidth').prop('disabled', false);
                $('#d2map_ms-style-nonpoint-lineWidth').val(msProp.msLineRatio);
            }

            // 문자 크기
            let textSize;
            if (msStyle.text.fontSize == undefined) {
                $('#d2map_ms-style-nonpoint-textSize').attr('disabled', true);
                textSize = '';
            } else {
                $('#d2map_ms-style-nonpoint-textSize').attr('disabled', false);
                textSize = msProp.msFontRatio;
                //if (/\.[0-9]/.test(textSize) == false) textSize += '.0';
            }
            $('#d2map_ms-style-nonpoint-textSize').val(textSize);

            // 잠금
            let isLock = GraphicUtil.getObjectLock();
            $('#d2map_ms-style-nonpoint-lock').prop('checked', isLock);


            // EXTENSION
            if (selectObjlist[0].getTextProperty) {
                if (msProp.msKey == 'G-F-AXC---' || msProp.msKey == 'G-F-AXS---') {
                    $('#d2map_ms-style-nonpoint-info-X-text').attr('data-lang', 'xaltitudeDepth');
                    $('#d2map_ms-style-nonpoint-info-X1-text').attr('data-lang', 'x1altitudeDepth');
                }
                else {
                    $('#d2map_ms-style-nonpoint-info-X-text').attr("data-lang", "altitudeDepth");
                    //$('#d2map_ms-style-nonpoint-info-X-text').text("X: 고도/심도/거리");
                    $('#d2map_ms-style-nonpoint-info-X1-text').attr("data-lang", "x1altitudeDepthDistance");
                    //$('#d2map_ms-style-nonpoint-info-X1-text').text("X1: 고도/심도/거리");
                }

                let textProp = selectObjlist[0].getTextProperty();
                if (textProp == undefined) {
                    $('#d2map_extend-tab').hide();
                } else {
                    $('#d2map_extend-tab').show();
                    $('.d2map_additionalInformation').hide();
                    $('#d2map_ms-style-nonpoint-info-C-text').attr('data-lang', 'quantity1');
                    $('.d2map_uniqueDesignation').hide();
                    //$('.d2map_extend-content tr').hide();
                    for (let key in textProp) {
                        let $el = $('#d2map_ms-style-nonpoint-info-' + key);
                        $el.parents('tr').css('display', 'table-row');
                        $el.val(textProp[key]);
                        if (msProp.msKey.indexOf('GLB') >= 0) {
                            if (key == 'T')
                                $el.parents('tr').children('td:first-child').attr('data-lang', 'leftUnit');
                            else if (key == 'T1')
                                $el.parents('tr').children('td:first-child').attr('data-lang', 'rightUnit');
                        } else {
                            if (key == 'T')
                                $el.parents('tr').children('td:first-child').attr('data-lang', 'uniqueDesignation');
                            else if (key == 'T1')
                                $el.parents('tr').children('td:first-child').attr('data-lang', 'uniqueDesignation1');
                        }
                    }
                }
            }
            //this.settingMSValue = false;

            // 16진수로 변환한다
            function toHex(decimal) {
                return parseInt(decimal, 16);
            }
        }

        // 레이어를 화면 중앙으로 이동시킨다.
        function setPopupPositionCenter(selector) {
            let $el = $(selector);

            let windowWidth = $(document).width();
            let windowHeight = $(document).height();
            let $elWidth = $el.width();
            let $elHeight = $el.height();

            let posX = (windowWidth - $elWidth) / 2;
            let posY = (windowHeight - $elHeight) / 2;

            $el.css({
                left: posX,
                top: posY,
            });
        }
    }


    // 작전활동부호 - 점형 속성 변경시 이벤트 관리
    previewTacticalGraphicsPoint(isInit, findSIDC) {
        // 군대부호 options 객체 선언
        var options = {};
        var infoFields = false;
        // 설정된 속성값 가져오기
        var sidc = $('#d2map_ms-prop-edit-sidc_ex').text();
        var affiliation = $('#d2map_ms-prop-edit-select-affiliation_ex option:selected').val();
        if (affiliation == undefined) affiliation = 'F';
        var echelon = sidc.substring(11, 12);
        echelon = echelon == '-' ? '*' : echelon;

        var status;
        let codeScheme = findSIDC.substr(0, 1);
        if (codeScheme === 'W')
            status = '-'; //$('#d2map_ms-prop-edit-select-status_ex_weather option:selected').val();
        else
            status = $('#d2map_ms-prop-edit-select-status_ex option:selected').val();

        status = status == '-' ? '*' : status;

        let updatedSidc = MSSIDCUtil.getSIDC(sidc, affiliation, status); //예외코드조건 반영
        options.SIDC = updatedSidc; // 군대부호

        options.fill = this._prop.options.fill;
        options.icon = this._prop.options.icon;
        options.frame = this._prop.options.frame;

        let selectObject = this.selectObjectList[0];
        // affiliation과 echelon이 반영된 새로운 sidc를 생성하여 갱신
        if (selectObject._prop.msKey == undefined) updatedSidc += ' : ' + selectObject._prop.name;

        if (selectObject._prop.msKey == 'G-M-OFD---' || selectObject._prop.msKey == 'G-G-PC----') {
            let prop = new ObjectProp();
            selectObject._prop.clone(prop);
            options = prop.options;
        } else {
            $('#d2map_ms-prop-edit-sidc_ex').text(updatedSidc);
        }

        let lineColor = this._prop.options.userDefineLineColor;
        let fillColor = this._prop.options.userDefineFillColor;
        //console.log(lineColor, fillColor);

        var checkedDefineColor = $('#d2map_ms-style-defineColor_ex').is(":checked");
        var userDefineLineColor = $('#d2map_ms-style-defineColor-stroke_ex').val(); // 선색
        if (checkedDefineColor) {
            this._prop.msUseDefineColor = true;
            if (isValid(userDefineLineColor)) {
                options.userDefineLineColor = userDefineLineColor + (this._prop.options.alphaLineHEX != undefined ? this._prop.options.alphaLineHEX : '');
                infoFields = true;
            }

            if (!options.userDefineFillColor)
                options.userDefineFillColor = fillColor;

        } else {
            this._prop.msUseDefineColor = false;
            options.userDefineLineColor = "";
            infoFields = true;
        }

        var dtg = $('#d2map_ms-prop-edit-text-dtg_ex').val(); // W: 활동시각
        if (isValid(dtg)) {
            options.dtg = dtg;
            infoFields = true;
        }
        var dtg1 = $('#d2map_ms-prop-edit-text-dtg1_ex').val(); // W1: 활동시각
        if (isValid(dtg1)) {
            options.dtg1 = dtg1;
            infoFields = true;
        }
        var altitudeDepth = $('#d2map_ms-prop-edit-text-altitudeDepth_ex').val(); // X: 고도/심도/거리
        if (isValid(altitudeDepth)) {
            options.altitudeDepth = altitudeDepth;
            infoFields = true;
        }
        var altitudeDepth1 = $('#d2map_ms-prop-edit-text-altitudeDepth1_ex').val(); // X1: 고도/심도/거리
        if (isValid(altitudeDepth1)) {
            options.altitudeDepth1 = altitudeDepth1;
            infoFields = true;
        }
        var type = $('#d2map_ms-prop-edit-text-type_ex').val(); // V: 장비명/종류
        if (isValid(type)) {
            options.type = type;
            infoFields = true;
        }
        var uniqueDesignation = $('#d2map_ms-prop-edit-text-uniqueDesignation_ex').val(); // T: 고유명칭
        if (isValid(uniqueDesignation)) {
            options.uniqueDesignation = uniqueDesignation;
            infoFields = true;
        }
        var uniqueDesignation1 = $('#d2map_ms-prop-edit-text-uniqueDesignation1_ex').val(); // T1: 고유명칭
        if (isValid(uniqueDesignation1)) {
            options.uniqueDesignation1 = uniqueDesignation1;
            infoFields = true;
        }
        var infoColor = $('#d2map_ms-prop-edit-color-properties_ex').val(); //수식정보 색상 설정
        options.infoColor = infoColor;
        var quantity = $('#d2map_ms-prop-edit-text-quantity_ex').val(); // C: 수량
        if (isValid(quantity) && !isNaN(quantity)) {
            options.quantity = parseInt(quantity);
            infoFields = true;
        } else $('#d2map_ms-prop-edit-text-quantity_ex').val('');
        var additionalInformation = $('#d2map_ms-prop-edit-text-additionalInformation_ex').val(); // H: 활동사항
        if (isValid(additionalInformation)) {
            options.additionalInformation = additionalInformation;
            infoFields = true;
        }
        var additionalInformation1 = $('#d2map_ms-prop-edit-text-additionalInformation1_ex').val(); // H1: 활동사항
        if (isValid(additionalInformation1)) {
            options.additionalInformation1 = additionalInformation1;
            infoFields = true;
        }
        var hostile = $('#d2map_ms-prop-edit-text-hostile_ex').val(); // N: 고유명칭
        if (isValid(hostile)) {
            options.hostile = hostile;
            infoFields = true;
        }
        var location = $('#d2map_ms-prop-edit-text-location_ex').val(); // Y: 위치
        if (isValid(location)) {
            options.location = location;
            infoFields = true;
        }
        // Q: 이동방향각도
        var direction = $('#d2map_ms-prop-edit-text-direction_ex').val();
        if (isValid(direction) && !isNaN(direction)) {
            direction = parseInt(Number(direction % 360));
            options.direction = direction;
            $('#d2map_ms-prop-edit-text-direction_ex').val(options.direction);
            infoFields = true;
        } else $('#d2map_ms-prop-edit-text-direction_ex').val('');

        // A: 아이콘 부호코드
        var addSymbol = $('#d2map_ms-prop-edit-select-addsymbol_ex option:selected').val();
        if (isValid(addSymbol)) {
            options.addSymbol = addSymbol;
            infoFields = true;
        }

        // Z: speed
        var speed = $('#d2map_ms-prop-edit-text-speed_ex').val();
        if (isValid(speed)) {
            options.speed = speed;
            infoFields = true;
        }

        // 군대부호 크기
        var size = $('#d2map_ms-prop-edit-text-size_ex').val();
        size = isNaN(Number(size)) ? this._msDefaultSize : Number(size); /*군대부호 크기 범위 3~14 */

        if (size > this._msMaxSize) size = this._msMaxSize; /*군대부호 크기 범위 3~14 */
        else if (size < this._msMinSize) size = this._msMinSize; /*군대부호 크기 범위 3~14 */
        $('#d2map_ms-prop-edit-text-size_ex').val(size);
        options.size = size;

        // 군대부호 둘레 선 두께
        var strokeWidth = $('#d2map_ms-prop-edit-text-strokeWidth_ex').val();
        strokeWidth = isNaN(Number(strokeWidth)) ? 3 : Number(strokeWidth);
        if (strokeWidth > 10) strokeWidth = 10;
        else if (strokeWidth < 1) strokeWidth = 1;
        $('#d2map_ms-prop-edit-text-strokeWidth_ex').val(strokeWidth);
        options.strokeWidth = strokeWidth;
        // 군대부호 투명도
        var fillOpacity = $('#d2map_ms-prop-edit-text-opacity_ex').val();
        fillOpacity = isNaN(Number(fillOpacity)) ? 255 : Number(fillOpacity);
        if (fillOpacity > 255) fillOpacity = 255;
        else if (fillOpacity < 0) fillOpacity = 0;
        $('#d2map_ms-prop-edit-text-opacity_ex').val(fillOpacity);
        options.fillOpacity = fillOpacity / 255;

        options.infoFields = infoFields;

        // 군대부호 인스턴스 생성
        var sym = new D2MS.ms.Symbol('');
        sym.setOptions(options);
        var imgSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sym.asSVG()); //SVG 방식
        var imgContainer = $('#d2map_ms-prop-edit-img-container_ex'); // 이미지를 표시할 컨테이너
        var img = document.createElement('img'); // 이미지 요소 생성
        img.src = imgSrc;
        imgContainer.empty(); // 기존 이미지 삭제
        imgContainer.append(img); // 이미지 컨테이너에 이미지 추가

        options.size = size; // 군대부호 크기 원복 /*군대부호 크기 범위 3~14 */
        if (selectObject._prop.msKey != undefined) {
            let sidc = selectObject._prop.options.SIDC;
            if (sidc != undefined && (sidc[0] == 'G' || sidc[0] == 'W') == false) {
                $('#d2map_ms-style-nonpoint-info-A').val(sidc);
            }
        }

        selectObject._prop.options = options;
        selectObject.updateFeature(true);
        if (!(isInit == true)) {
            selectObject._graphicBoard.undoRedoSave();
        }
        return options;
    }

    // 작전활동부호 - 선/면형 속성 변경시 이벤트 관리
    preivewTacticalGraphicsNonPoint(selectObject, e) {
        if (selectObject == undefined) return; //예외처리
        //if (this.settingMSValue == true) return; // 용도 파악 필요
        let objStyle = selectObject._style;
        let objProp = selectObject._prop;
        let tId = e.target.id.split('-').pop();
        tId = tId.split('-').pop();

        switch (tId) {
            case 'aff': {
                // 피아구분
                if (MSSIDCUtil.getAffiliationExceptionCode(objProp.msOriginKey))
                    objProp.msAffiliation = '*';
                else
                    objProp.msAffiliation = e.target.value;

                // ~ 피아에 따른 색상 적용
                if (objProp.msUseDefineColor == false) objStyle.line.color = getAffColor();
                break;
            }
            case 'status': {
                // 상태
                objProp.msStatus = e.target.value;
                switch (e.target.value) {
                    case 'P':
                        objStyle.line.type = 'simple';
                        break;
                    case 'A':
                        objStyle.line.type = 'dash';
                        break;
                    default:
                        objStyle.line.type = 'simple';
                        break;
                }
            }
            case 'size': {
                // 부호크기
                let symbolSize = e.target.value;
                symbolSize = isNaN(Number(symbolSize)) ? 7 : Number(symbolSize);
                if (symbolSize === 0) { // backspace 키를 사용 가능하도록 하는 코드
                    e.target.value = '';
                    symbolSize = 0;
                } else if (symbolSize < this._msMinSize) {
                    e.target.value = this._msMinSize;
                    symbolSize = this._msMinSize;
                } else if (symbolSize > this._msMaxSize) {
                    e.target.value = this._msMaxSize;
                    symbolSize = this._msMaxSize;
                }
                objProp.msSize = symbolSize / 7; // 7 은 디폴트값
                objStyle.text.fontSize = objProp.msOldStyle.fontSize * objProp.msSize * objProp.msFontRatio;
                objStyle.line.width = objProp.msOldStyle.lineWidth * objProp.msSize * objProp.msLineRatio;
                break;
            }
            case 'opacity': {
                // 투명도
                let opacity, lineColor, fillColor;
                opacity = isNaN(Number(e.target.value)) ? 255 : Number(e.target.value);
                if (opacity === 0) { // backspace 키를 사용 가능하도록 하는 코드
                    e.target.value = '';
                    opacity = 0;
                } else if (opacity < 0) {
                    e.target.value = 0;
                    opacity = 0;
                } else if (opacity > 255) {
                    e.target.value = 255;
                    opacity = 255;
                }

                objProp.opacity = opacity;

                objProp.options.fillOpacity = opacity / 255; //부호 투명값 설정

                opacity = opacity.toString(16);
                if (opacity.length == 1)
                    opacity = '0' + opacity;

                if (objStyle.line.color) {
                    lineColor = GraphicUtil.rgb2hex(objStyle.line.color).substr(0, 7) + opacity;
                    objStyle.line.color = lineColor;
                    if (objStyle.line.colorExt != undefined)
                        objStyle.line.colorExt = lineColor;
                    if (objStyle.marker.color != undefined)
                        objStyle.marker.color = lineColor;
                }
                if (objStyle.fill.color) {
                    fillColor = GraphicUtil.rgb2hex(objStyle.fill.color).substr(0, 7) + opacity;
                    objStyle.fill.color = fillColor;
                }

                break;
            }
            case 'strokeAlpha':
            case 'fillAlpha': {
                // 투명
                let alpha;
                let lineColor, fillColor;
                if (objStyle.line.color != undefined) {
                    alpha = getAlpha('stroke');
                    lineColor = GraphicUtil.rgb2hex(objStyle.line.color);
                    lineColor = lineColor.substr(0, 7);
                    lineColor += alpha;
                    objStyle.line.color = GraphicUtil.hex2rgb(lineColor);
                    if (objStyle.marker.color != undefined) objStyle.marker.color = GraphicUtil.hex2rgb(lineColor);
                    if (objProp.msKey == 'G-M-OAR---') {
                        objStyle.fill.color = GraphicUtil.hex2rgb(lineColor);
                        break;
                    }
                }
                if (objStyle.fill.color != undefined) {
                    alpha = getAlpha('fill');
                    fillColor = GraphicUtil.rgb2hex(objStyle.fill.color);
                    fillColor = fillColor.substr(0, 7);
                    fillColor += alpha;
                    objStyle.fill.color = GraphicUtil.hex2rgb(fillColor);
                }
                break;
            }
            case 'defineColor': {
                // 피아색상 - 체크박스
                let isChecked = e.target.checked;
                objProp.msUseDefineColor = isChecked;
                if (isChecked) {
                    let temp_lineColor, temp_fillColor, temp_useLineColor, temp_useFillColor;

                    if (objProp.msOldStyle.lineColor != undefined) {
                        temp_lineColor = typeof objStyle.line.color == 'string' ? objStyle.line.color.split()[0] : [...objStyle.line.color];
                        toIEColor($('#d2map_ms-style-nonpoint-defineColor-stroke'), GraphicUtil.rgb2hex(objProp.msOldStyle.lineColor).substr(0, 7), false)
                        objStyle.line.color = objProp.msOldStyle.lineColor;
                        objProp.msOldStyle.lineColor = temp_lineColor;
                        temp_useLineColor = objStyle.line.useLineColor;
                        objStyle.line.useLineColor = objProp.msOldStyle.useLineColor;
                        objProp.msOldStyle.useLineColor = temp_useLineColor;
                    };
                    if (objProp.msOldStyle.fillColor != undefined) {
                        temp_fillColor = typeof objStyle.fill.color == 'string' ? objStyle.fill.color.split()[0] : [...objStyle.fill.color];
                        toIEColor($('#d2map_ms-style-nonpoint-defineColor-fill'), GraphicUtil.rgb2hex(objProp.msOldStyle.fillColor).substr(0, 7), false)
                        objStyle.fill.color = objProp.msOldStyle.fillColor;
                        objProp.msOldStyle.fillColor = temp_fillColor;
                        temp_useFillColor = objStyle.fill.useFillColor;
                        objStyle.fill.useFillColor = objProp.msOldStyle.useFillColor;
                        objProp.msOldStyle.useFillColor = temp_useFillColor;
                    };
                    $('#d2map_ms-style-nonpoint-defineColor-useLineColor').prop('disabled', false);
                    $('#d2map_ms-style-nonpoint-defineColor-useFillColor').prop('disabled', false);
                } else {
                    // ~ AFF 색 입력
                    let temp_lineColor, temp_fillColor, temp_useLineColor, temp_useFillColor;

                    if (objProp.msOldStyle.lineColor != undefined) {
                        temp_lineColor = typeof objStyle.line.color == 'string' ? objStyle.line.color.split()[0] : [...objStyle.line.color];
                        objStyle.line.color = getAffColor();
                        if (objStyle.line.colorExt != undefined) objStyle.line.colorExt = objProp.msOldStyle.lineColorExt;
                        objProp.msOldStyle.lineColor = temp_lineColor;

                        temp_useLineColor = objStyle.line.useLineColor;
                        objStyle.line.useLineColor = objProp.msOldStyle.useLineColor;
                        objProp.msOldStyle.useLineColor = temp_useLineColor;
                    }
                    if (objProp.msOldStyle.fillColor != undefined) {
                        temp_fillColor = typeof objStyle.fill.color == 'string' ? objStyle.fill.color.split()[0] : [...objStyle.fill.color];
                        objStyle.fill.patternColor = getAffColor();
                        objStyle.fill.color = objProp.msOldStyle.fillColor;
                        if (objStyle.fill.colorExt != undefined) objStyle.fill.colorExt = objProp.msOldStyle.fillColorExt;
                        objProp.msOldStyle.fillColor = temp_fillColor;

                        temp_useFillColor = objStyle.fill.useFillColor;
                        objStyle.fill.useFillColor = objProp.msOldStyle.useFillColor;
                        objProp.msOldStyle.useFillColor = temp_useFillColor;
                    }

                    toIEColor($('#d2map_ms-style-nonpoint-defineColor-stroke'), '#ffffff', true);
                    toIEColor($('#d2map_ms-style-nonpoint-defineColor-fill'), '#ffffff', true);
                    $('#d2map_ms-style-nonpoint-defineColor-useLineColor').prop('disabled', true);
                    $('#d2map_ms-style-nonpoint-defineColor-useFillColor').prop('disabled', true);
                }
                $('#d2map_ms-style-nonpoint-opacity').trigger('input');
                break;
            }
            case 'useLineColor': {
                // 선 색상 없음 - 체크박스
                let isChecked = e.target.checked;
                objStyle.line.useLineColor = !isChecked;
                $('#d2map_ms-style-nonpoint-opacity').trigger('input');
                break;
            }
            case 'useFillColor': {
                // 면 색상 없음 - 체크박스
                let isChecked = e.target.checked;
                objStyle.fill.useFillColor = !isChecked;
                $('#d2map_ms-style-nonpoint-opacity').trigger('input');
                break;
            }
            case 'stroke': {
                // 피아색상 - 외곽선
                if (objStyle.line.color != undefined)
                    if ($('#d2map_ms-style-nonpoint-defineColor').is(':checked')) {
                        // let tColor = GraphicUtil.hex2rgb(e.target.value + getAlpha('stroke'));
                        let tColor = GraphicUtil.hex2rgb(e.target.value + getAlpha('object'));
                        objStyle.line.color = tColor;

                        if (objStyle.line.colorExt != undefined) objStyle.line.colorExt = tColor;
                        if (objStyle.marker.color != undefined) objStyle.marker.color = tColor;
                        if (objProp.msKey == 'G-M-OAR---') objStyle.fill.color = tColor;
                    }
                break;
            }
            case 'fill': {
                // 피아색상 - 채움색상
                if (objStyle.fill != undefined)
                    if ($('#d2map_ms-style-nonpoint-defineColor').is(':checked')) {
                        // let tColor = GraphicUtil.hex2rgb(e.target.value + getAlpha('fill'));
                        let tColor = GraphicUtil.hex2rgb(e.target.value + getAlpha('object'));
                        objStyle.fill.color = tColor;
                        if (objStyle.fill.colorExt != undefined) objStyle.fill.colorExt = tColor;
                    }
                break;
            }
            case 'lineWidth': {
                // 선굵기
                objProp.msLineRatio = e.target.value;
                objStyle.line.width = objProp.msOldStyle.lineWidth * objProp.msLineRatio * objProp.msSize;
                break;
            }
            case 'textSize': {
                // 문자 크기
                let ratio = e.target.value;
                ratio = isNaN(Number(ratio)) ? 1 : Number(ratio);

                if (ratio === 0) {
                    // backspace 키를 사용 가능하도록 하는 코드
                    // e.target.value = 0;
                    ratio = 0;
                } else if (ratio > 5) {
                    ratio = e.target.value = 5;
                } else if (ratio < 0.2) {
                    ratio = e.target.value = 0.2;
                }

                if (/\./.test(ratio) == false) e.target.value; //.val(ratio + '.0');
                objProp.msFontRatio = ratio;
                objStyle.text.fontSize = objProp.msOldStyle.fontSize * objProp.msFontRatio * objProp.msSize;
                break;
            }
            case 'lock': {
                let isLock = e.target.checked;
                selectObject.setLock(isLock);
                break;
            }
            default:
                // EXTENSION
                if ($('.d2map_content_input').is(":visible")) {
                    let visibleElem = $('.d2map_content_input:visible *[name="ms-style-input"]');

                    let textObj = {};
                    for (let index = 0; index < visibleElem.length; index++) {
                        let elem = $(visibleElem[index]);
                        let value = elem.val();
                        let key = elem.attr('id').split('-').pop();
                        textObj[key] = value;
                        if (key == 'A')
                            selectObject._prop.options.SIDC = value;
                    }

                    selectObject.setTextProperty(textObj);
                    break;
                }
        }

        let echelon = objProp.msOriginKey.substring(11, 12);
        echelon = echelon == '-' ? '*' : echelon;
        let updatedSidc = objProp.msOriginKey.substring(0, 1) + objProp.msAffiliation + objProp.msOriginKey.substring(2, 3) + objProp.msStatus + objProp.msOriginKey.substring(4, 11) + echelon + objProp.msOriginKey.substring(12, 15);
        $('#d2map_ms-nonpoint-name').text(updatedSidc);

        window.graphic._selectObjectManager.selectObject();
        selectObject.updateFeature(true);
        if (e.type == 'change') {
            selectObject._graphicBoard.undoRedoSave();
        };

        // UI의 alpha값을 hex값으로 변환해서 반환한다.
        function getAlpha(type) {
            let uiVal = $('#d2map_ms-style-nonpoint-' + type + 'Alpha').val();
            let alpha;
            if (isNaN(uiVal)) {
                let color = GraphicUtil.rgb2hex(objStyle.line.color);
                color = color.substr(7, 9);
                if (color.length > 0) color = parseInt(color, 16);
                else color = 255;

                $('#d2map_ms-style-nonpoint-' + type + 'Alpha').val(color);
                alpha = parseInt(color, 10).toString(16);
                if (alpha.length == 1) alpha = '0' + alpha;
            } else {
                if (uiVal > 255) uiVal = 255;
                else if (uiVal < 0) uiVal = 0;
                $('#d2map_ms-style-nonpoint-' + type + 'Alpha').val(uiVal);
                alpha = parseInt(uiVal, 10).toString(16);
                if (alpha.length == 1) alpha = '0' + alpha;
            }
            return alpha;
        }

        function getAffColor() {
            let aff = objProp.msAffiliation;
            let retVal = '#ffffff';
            switch (aff) {
                case '-':
                case '*':
                    retVal = GraphicUtil.hex2rgb(GraphicUtil.rgb2hex(objProp.msOldStyle.lineColor));
                    break;
                case 'P':
                case 'U':
                case 'G':
                case 'W':
                    retVal = [255, 255, 0];
                    break;
                case 'F':
                case 'A':
                case 'D':
                case 'M':
                    retVal = [0, 0, 0];
                    break;
                case 'N':
                case 'L':
                    retVal = [0, 255, 0];
                    break;
                case 'H':
                case 'S':
                case 'J':
                case 'K':
                    retVal = [255, 0, 0];
                    break;
            }
            retVal.push(parseInt(getAlpha('object'), 16));
            // retVal.push(parseInt(getAlpha('stroke'), 16));
            return GraphicUtil.hex2rgb(GraphicUtil.rgb2hex(retVal));
        }
    }


    //군대부호 속성 창 표시
    // isSubIcon : 아이콘이 있는 비점형객체(탈취) - 아이콘의 속성창 열 때
    setMSStyle(sidc, isSubIcon) {

        $('.d2map_ui-popup').hide();
        $('#d2map_ms_prop_container').hide();
        $('#d2map_ms_prop_container_sidc').hide();
        $('#d2map_ms_prop_container_nonpoint').hide();

        this.selectObjectList = window.graphic.getSelectObjectList();
        if (this.selectObjectList !== undefined && this.selectObjectList.length == 1) {

            this._prop = this.selectObjectList[0]._prop;
            if (sidc === undefined)
                console.log('SIDC Undefined.......');

            let msSymbolCodeScheme = MSSIDCUtil.getMSSymbolCodeScheme(sidc); //군대부호 코드 스키마 리턴            
            this.classifyProp(MSSIDCUtil.getMSPropMappingKey(sidc), isSubIcon);

            switch (msSymbolCodeScheme) {
                case 0:  //기본군대부호 및 작전활동부호 점형는 0
                    {
                        if (sidc != undefined) {
                            if (sidc.substring(0, 1) == 'G' || sidc.substring(0, 1) == 'W')
                                this.popupStyleSetTacticalGraphicsPoint(sidc); //작전활동부호(점형) 속성표시
                            else {
                                //기본군대부호 속성표시               
                                this.modalHandler();
                                this.AHTabHandler();
                                this.AITabHandler();
                                this.AJTabHandler();
                                this.popupStyleSetTacticalSymbol();
                            }
                        }
                    }
                    break;
                case 1: //작전활동부호 선형/면형은 1
                    this.popupStyleSetTacticalGraphicsNonPoint(); //작전활동부호(선형/면형) 속성표시
                    break;
                case -1: //군대부호 타입이 아님
                    console.log('It is not a military symbol');
                    break;
            }
            // 군대부호 속성창 언어변경
            //console.log("text 바뀐 경우가 있으므로 필요")
            window.MilSymbol.translateMilsymbolProperties();
        }
    }


    // AH,AI,AJ popup handler
    modalHandler() {
        const popupTrigger = document.getElementById('d2map_extension-content-table');
        const modal = document.querySelectorAll(".d2map_popup-modal");
        const modalClose = document.querySelectorAll(".d2map_popup-modal-close");

        if (popupTrigger.clickHandler) {
            popupTrigger.removeEventListener('click', popupTrigger.clickHandler);
        }

        popupTrigger.clickHandler = (event) => {
            let targetElement = event.target || event.srcElement;
            if (targetElement.getAttribute('class') === 'd2map_popup-trigger') {
                let index = parseInt(targetElement.getAttribute('data-index'));
                modal[index].classList.add("is-visible");
                $('.d2map_popup-modal.is-visible').draggable({ containment: '#d2map_map' });
                // popup이 놓일 위치
                modal[index].style.top = 280 + 'px';
                modal[index].style.left = 665 + 'px';
                modal[index].style.display = "block";
                for (let i = 0; i < document.querySelectorAll(".is-visible").length + 1; i++) {
                    if (i === index) continue;
                    modal[i].classList.remove("is-visible");
                }
            }
        };

        popupTrigger.addEventListener('click', popupTrigger.clickHandler);

        modalClose.forEach(function (item, index) {
            item.addEventListener("click", function (e) {
                modal[index].classList.remove("is-visible");
            });
        });
    }

    // AH: 불확정 구역표시 modal 탭을 작동한다.
    AHTabHandler() {
        let AHCurrentIndex = 0; // 현재 클릭한 탭
        const nav = document.querySelector(".d2map_ms-prop-edit-bottom-forAH nav");
        const glider = document.querySelector(".d2map_AH-glider");
        const tabContent = document.querySelectorAll(".d2map_AH-tab-content");

        nav.addEventListener("click", (e) => {
            AHCurrentIndex = +e.target.dataset.index;
            glider.style.transform = `translate3D(${AHCurrentIndex * 100}%, 0, 0)`;
            tabContent.forEach((tabContent, i) => {
                tabContent.classList.toggle("active", i === AHCurrentIndex);
            });
        });
    }

    //AI: 추측선 표시 modal 탭을 작동한다.
    AITabHandler() {
        let AICurrentIndex = 0; // 현재 클릭한 탭
        const nav = document.querySelector(".d2map_ms-prop-edit-bottom-forAI nav");
        const glider = document.querySelector(".d2map_AI-glider");
        const tabContent = document.querySelectorAll(".d2map_AI-tab-content");

        nav.addEventListener("click", (e) => {
            if (e.target.dataset.index != undefined) {
                AICurrentIndex = +e.target.dataset.index;
            }
            glider.style.transform = `translate3D(${AICurrentIndex * 100}%, 0, 0)`;
            tabContent.forEach((tabContent, i) => {
                tabContent.classList.toggle("active", i === AICurrentIndex);
            });
        });
    }

    //AJ: 추측선 표시 modal 탭을 작동한다.
    AJTabHandler() {
        let AJCurrentIndex = 0; // 현재 클릭한 탭
        const nav = document.querySelector(".d2map_ms-prop-edit-bottom-forAJ nav");
        const glider = document.querySelector(".d2map_AJ-glider");
        const tabContent = document.querySelectorAll(".d2map_AJ-tab-content");

        nav.addEventListener("click", (e) => {
            if (e.target.dataset.index != undefined) {
                AJCurrentIndex = +e.target.dataset.index;
            }
            glider.style.transform = `translate3D(${AJCurrentIndex * 100}%, 0, 0)`;
            tabContent.forEach((tabContent, i) => {
                tabContent.classList.toggle("active", i === AJCurrentIndex);
            });
        });
    }


    //CodeScheme에 따른 Status값을 구분한다.
    getStatusCode(sidc) {
        let status = '-';
        let codeScheme = sidc.substr(0, 1).toUpperCase();

        switch (codeScheme) {
            case 'S':
            case 'I':
            case 'O':
                status = $('#d2map_ms-prop-edit-select-status option:selected').val();
                break;
            case 'W':
                break;
            case 'E':
                status = $('#d2map_ms-prop-edit-select-status_emergency option:selected').val();
                break;
        }

        //console.log(sidc, status, codeScheme);
        return status;
    }


    // 기본군대부호 속성 창에서 <<미리보기>> 버튼을 눌렀을 때, 현재 설정된 속성이 반영된
    // 기본군대부호 이미지를 보여준다.
    previewTacticalSymbol(isInit, tabBtn) {
        //console.log("previewMilSymbol start~")
        var options = {}; // 군대부호 options 객체 선언
        var infoFields = false;
        // 설정된 속성값 가져오기
        var sidc = $('#d2map_ms-prop-edit-sidc').text();
        var affiliation = $('#d2map_ms-prop-edit-select-affiliation option:selected').val() || '*';
        var echelon = $('#d2map_ms-prop-edit-select-echelon option:selected').val();

        echelon = (echelon == '-' && sidc.substr(0, 1) != 'I') ? '*' : echelon; //신호정보는 11번째를 '-'로 표시한다.

        var status = this.getStatusCode(sidc);
        status = status == '-' ? '*' : status;

        var updatedSidc = '';
        updatedSidc = sidc.substring(0, 1) + affiliation + sidc.substring(2, 3) + status + sidc.substring(4, 11) + echelon + sidc.substring(12, 15);
        options.SIDC = updatedSidc; // 군대부호

        let selectObject = this.selectObjectList[0];

        // affiliation과 echelon이 반영된 새로운 sidc를 생성하여 갱신
        if (selectObject == undefined) return options; //예외처리
        if (selectObject._prop.msKey == undefined) updatedSidc += ' : ' + selectObject._prop.name;

        $('#d2map_ms-prop-edit-sidc').text(updatedSidc);

        if (selectObject._prop.msKey == 'G-M-OFD---' || selectObject._prop.msKey == 'G-G-PC----') {
            let prop = window.ObjectProp;
            selectObject._prop.clone(prop);
            options = prop.options;
        }
        let conditionPoint = $('#d2map_ms-prop-edit-select-operationalConditionPoint option:selected').val(); // 운용조건
        options.operationalConditionPoint = conditionPoint;
        if (isValid(conditionPoint)) {
            infoFields = true;
        }

        options.civilianColor = $("#d2map_ms-prop-edit-chk-civilianColor").prop("checked"); //민간부호 채움 표시 여부
        //피아배경 색상설정
        if ($("#d2map_ms-prop-edit-chk-civilianColor").prop("checked")) {
            options.userDefineFillColor = "";
        }
        if ($("#d2map_ms-prop-edit-chk-userDefineFillColor").prop("checked")) {
            let fillColor = $("#d2map_ms-prop-edit-color-userDefineFillColor").val();
            let opacity = $('#d2map_ms-prop-edit-text-opacity').val();

            //원시 색상의 Alpha 값 유지를 위해
            options.userDefineFillColor = fillColor + (this._prop.options.alphaFillHEX != undefined ? this._prop.options.alphaFillHEX : '');
        } else {
            options.userDefineFillColor = "";
        }

        var dtg = $('#d2map_ms-prop-edit-text-dtg').val(); // W: 활동시각
        options.dtg = dtg;
        if (isValid(dtg)) {
            infoFields = true;
        }
        var altitudeDepth = $('#d2map_ms-prop-edit-text-altitudeDepth').val(); // X: 고도/심도/거리
        options.altitudeDepth = altitudeDepth;
        if (isValid(altitudeDepth)) {
            infoFields = true;
        }
        var location = $('#d2map_ms-prop-edit-text-location').val(); // Y: 위치
        options.location = location;
        if (isValid(location)) {
            infoFields = true;
        }

        options.headquarters = $("#d2map_ms-prop-edit-text-headquarters").prop('checked'); // S: 지휘소/실제위치
        infoFields = true;

        var type = $("#d2map_ms-prop-edit-text-type").val(); // V: 장비명/종류
        options.type = type;
        if (isValid(type)) {
            infoFields = true;
        }

        var uniqueDesignation = $('#d2map_ms-prop-edit-text-uniqueDesignation').val(); // T: 고유명칭
        options.uniqueDesignation = uniqueDesignation;
        if (isValid(uniqueDesignation)) {
            infoFields = true;
        }
        var speed = $('#d2map_ms-prop-edit-text-speed').val();
        options.speed = speed;
        if (isValid(speed)) {
            infoFields = true;
        }
        var specialHeadquarters = $('#d2map_ms-prop-edit-text-specialHeadquarters').val(); // AA: 지휘통제소명
        options.specialHeadquarters = specialHeadquarters;
        if (isValid(specialHeadquarters)) {
            infoFields = true;
        }

        var feintDummyIndicator = $('#d2map_ms-prop-edit-text-feintDummyIndicator').val(); // AB: 가장/가상식별부호
        options.feintDummyIndicator = feintDummyIndicator;
        if (isValid(feintDummyIndicator)) {
            infoFields = true;
        }

        var platformType = $("#d2map_ms-prop-edit-select-platformType option:selected").val(); // AD: 기반형태
        if (platformType == '-')
            platformType = ''
        options.platformType = platformType;
        if (isValid(platformType)) {
            infoFields = true;
        }

        var equipmentTeardownTime = $("#d2map_ms-prop-edit-text-equipmentTeardownTime").val(); // AE: 분해시간
        options.equipmentTeardownTime = equipmentTeardownTime;
        if (isValid(equipmentTeardownTime)) {
            infoFields = true;
        }

        var commonIdentifier = $("#d2map_ms-prop-edit-text-commonIdentifier").val(); // AF: 공통명칭
        options.commonIdentifier = commonIdentifier;
        if (isValid(commonIdentifier)) {
            infoFields = true;
        }

        var auxiliaryEquipmentIndicator = $("#d2map_ms-prop-edit-text-auxiliaryEquipmentIndicator").val(); // AG: 보조장비코드
        options.auxiliaryEquipmentIndicator = auxiliaryEquipmentIndicator;
        if (isValid(auxiliaryEquipmentIndicator)) {
            infoFields = true;
        }

        // Q: 이동방향각도
        var direction = $('#d2map_ms-prop-edit-text-direction').val();
        direction = isValid(direction) && !isNaN(Number(direction)) ? parseInt(Number(direction % 360)) : '';
        options.direction = direction;
        $('#d2map_ms-prop-edit-text-direction').val(options.direction);
        if (isValid(direction)) {
            infoFields = true;
        }

        var mobilityIndicator = $('#d2map_ms-prop-edit-select-mobilityIndicator option:selected').val(); // R: 기동수단 코드
        if (mobilityIndicator == '-')
            mobilityIndicator = '';
        options.mobilityIndicator = mobilityIndicator;
        if (isValid(mobilityIndicator)) {
            infoFields = true;
        }

        var mobilityCode = $('#d2map_ms-prop-edit-select-mobilityCode option:selected').val(); // R2: 이동성 코드
        if (mobilityCode == '-')
            mobilityCode = '';
        options.mobilityCode = mobilityCode;
        if (isValid(mobilityCode)) {
            infoFields = true;
        }

        var quantity = $("#d2map_ms-prop-edit-text-quantity").val(); // C: 수량
        quantity = isValid(quantity) && !isNaN(Number(quantity)) ? Number(quantity) : '';
        options.quantity = quantity;
        if (isValid(quantity)) {
            infoFields = true;
        }

        var mobileUnit = $("#d2map_ms-prop-edit-text-mobileUnit").is(':checked'); // D: 기동부대
        options.mobileUnit = mobileUnit ? 1 : 0;
        if (isValid(mobileUnit)) {
            infoFields = true;
        }

        var reinforcedReduced = $('#d2map_ms-prop-edit-text-reinforcedReduced').val(); // F: 부대증감
        options.reinforcedReduced = reinforcedReduced;
        if (isValid(reinforcedReduced)) {
            infoFields = true;
        }

        var staffComments = $('#d2map_ms-prop-edit-text-staffComments').val(); // G: 군/국가구분코드
        options.staffComments = staffComments;
        if (isValid(staffComments)) {
            infoFields = true;
        }

        var additionalInformation = $('#d2map_ms-prop-edit-text-additionalInformation').val(); // H: 활동사항
        options.additionalInformation = additionalInformation;
        if (isValid(additionalInformation)) {
            infoFields = true;
        }

        var signatureEquipment = $('#d2map_ms-prop-edit-text-signatureEquipment').val(); // L: 신호정보장비
        options.signatureEquipment = signatureEquipment;
        if (isValid(signatureEquipment)) {
            infoFields = true;
        }

        var higherFormation = $('#d2map_ms-prop-edit-text-higherFormation').val(); // M: 상급부대
        options.higherFormation = higherFormation;
        if (isValid(higherFormation)) {
            infoFields = true;
        }

        var hostile = $("#d2map_ms-prop-edit-text-hostile").val(); // N: 적군
        options.hostile = hostile;
        if (isValid(hostile)) {
            infoFields = true;
        }

        var evaluationRating = $('#d2map_ms-prop-edit-select-evaluationRating option:selected').val(); // J: 평가등급코드
        if (evaluationRating == '-')
            evaluationRating = '';
        options.evaluationRating = evaluationRating;
        if (isValid(evaluationRating)) {
            infoFields = true;
        }

        var combatEffectiveness = $('#d2map_ms-prop-edit-text-combatEffectiveness').val(); // K: 전투력
        options.combatEffectiveness = isValid(combatEffectiveness) && !isNaN(Number(combatEffectiveness)) ? parseInt(Number(combatEffectiveness)) : '';
        if (options.combatEffectiveness > 100) options.combatEffectiveness = '100';
        else if (options.combatEffectiveness < 0) options.combatEffectiveness = '0';
        $('#d2map_ms-prop-edit-text-combatEffectiveness').val(options.combatEffectiveness); //전투력 실제값
        if (isValid(direction)) {
            infoFields = true;
        }

        var iffSif = $('#d2map_ms-prop-edit-text-iffSif').val(); // P:IFF/SIF
        options.iffSif = iffSif;

        options.showCombatEffectivenessLabel = $('#d2map_ms-prop-edit-chk-showCombatEffectivenessLabel').prop('checked'); // 전투력 표시 여부
        options.showCombatEffectivenessWaterFill = $('#d2map_ms-prop-edit-chk-showCombatEffectivenessWaterFill').prop('checked'); // 물채움 여부
        options.showUseDefineColor = $('#d2map_ms-prop-edit-chk-showUseDefineColor').prop('checked'); // 물채움 색 지정 여부

        var useDefineColorTocombatEffectiveness = $('#d2map_ms-prop-edit-color-useDefineColorTocombatEffectiveness').val();
        if (isValid(useDefineColorTocombatEffectiveness) && options.showUseDefineColor) {
            options.useDefineColorTocombatEffectiveness = useDefineColorTocombatEffectiveness; // 사용자 지정 물채움 색
        }

        // 군대부호 크기
        var size = $('#d2map_ms-prop-edit-text-size').val();
        size = isNaN(Number(size)) ? this._msDefaultSize : Number(size); //군대부호 크기 범위 3~14
        if (size > this._msMaxSize) {
            size = this._msMaxSize; //군대부호 크기 범위 3~14
        }
        else if (size < this._msMinSize) {
            size = this._msMinSize; //군대부호 크기 범위 3~14
        }
        options.size = size;
        $('#d2map_ms-prop-edit-text-size').val(size);

        // 군대부호 둘레 선 두께
        var strokeWidth = $('#d2map_ms-prop-edit-text-strokeWidth').val();
        $('#d2map_ms-prop-edit-text-strokeWidth').val(strokeWidth);
        options.strokeWidth = strokeWidth;

        // 군대부호 투명
        var fillOpacity = $('#d2map_ms-prop-edit-text-opacity').val();
        fillOpacity = isNaN(Number(fillOpacity)) ? 255 : Number(fillOpacity);
        if (fillOpacity > 255) fillOpacity = 255;
        else if (fillOpacity < 0) fillOpacity = 0;
        $('#d2map_ms-prop-edit-text-opacity').val(fillOpacity);
        options.fillOpacity = fillOpacity / 255;

        options.infoColor = $('#d2map_ms-prop-edit-color-properties').val(); //수식정보 색상 설정
        options.infoFields = infoFields; // 부가 속성정보 표시 여부

        options.icon = $('#d2map_ms-prop-edit-chk-displayicon').prop('checked'); // 기능부호(icon) 표시 여부
        options.frame = $('#d2map_ms-prop-edit-chk-displayframe').prop('checked'); // 외형부호(frame) 표시 여부
        options.fill = $('#d2map_ms-prop-edit-chk-displayfill').prop('checked'); // 외형채움(fill) 표시 여부

        selectObject.setLock($('#d2map_ms-prop-edit-chk-lock').is(':checked'));

        // AH: 불확정 구역 표시 기능들을 options 객체에 적용한다.
        //공통으로 사용하는 변수 : 선색상, 선굵기, 점선형태
        //타원&사각형만 공통으로 사용하는 변수: 가로길이, 세로길이, 방위각, 채움색상 구분

        let clickedAHTab = '';

        if (tabBtn == 'AH') {
            clickedAHTab = "none";
        } else {
            clickedAHTab = tabBtn || selectObject._prop.options.areaOfUncertainty;
        }

        if (clickedAHTab.indexOf("none") >= 0) {
            options.areaOfUncertainty = "";
            options.infoAHLineLength = "";
            options.infoAHAzimuth = "";
            options.infoAHAzimuthError = "";
            options.infoAHLineColor = "";
            options.infoAHLineWidth = "";
            options.infoAHLineStyle = "";
            options.infoAHLineColorError = "";
            options.infoAHLineWidthError = "";
            options.infoAHLineStyleError = "";
            options.infoAHRectWidth = "";
            options.infoAHRectHeight = "";
            options.infoAHFillColor = "";

            //입력된 값을 모두 초기화시킨다.
            document
                .querySelectorAll('.d2map_AH-tab-content input[type="text"]')
                .forEach((content) => content.value = "");
            document
                .querySelectorAll('.d2map_AH-tab-content input[type="number"]')
                .forEach((content) => content.value = "");
            document
                .querySelectorAll('.d2map_AH-tab-content input[type="color"]')
                .forEach((content) => (content.value = "#0d0d0d"));
        } else if (clickedAHTab.indexOf("direction") >= 0) {
            //방향
            options.areaOfUncertainty = "direction";
            options.infoAHLineLength = $("#d2map_ms-prop-edit-text-infoAHLineLength").val(); //길이
            if (!$("#d2map_ms-prop-edit-chk-direction-infoAHLineColor").is(":checked"))
                options.infoAHLineColor = "";
            else
                options.infoAHLineColor = $(
                    "#d2map_ms-prop-edit-text-direction-infoAHLineColor"
                ).val();
            options.infoAHLineWidth = $(
                "#d2map_ms-prop-edit-text-direction-infoAHLineWidth"
            ).val();
            options.infoAHLineStyle = $(
                "#d2map_ms-prop-edit-text-direction-infoAHLineStyle"
            ).val();
            options.infoAHAzimuthError = $(
                "#d2map_ms-prop-edit-text-infoAHAzimuthError"
            ).val();
            if (!$("#d2map_ms-prop-edit-chk-infoAHLineColorError").is(":checked"))
                options.infoAHLineColorError = "";
            else
                options.infoAHLineColorError = $(
                    "#d2map_ms-prop-edit-text-infoAHLineColorError"
                ).val();
            options.infoAHLineWidthError = $(
                "#d2map_ms-prop-edit-text-infoAHLineWidthError"
            ).val(); //오차선 선굵기
            options.infoAHLineStyleError = $(
                "#d2map_ms-prop-edit-text-infoAHLineStyleError"
            ).val(); //오차선 점선형태
            options.infoAHAzimuth = $("#d2map_ms-prop-edit-text-direction-infoAHAzimuth").val();
        } else if (clickedAHTab.indexOf("ellipse") >= 0) {
            //타원
            options.areaOfUncertainty = "ellipse";
            options.infoAHLineLength = $("#d2map_ms-prop-edit-text-infoAHLineLength").val(); //길이
            if (!$("#d2map_ms-prop-edit-chk-ellipse-infoAHLineColor").is(":checked"))
                options.infoAHLineColor = "";
            else
                options.infoAHLineColor = $(
                    "#d2map_ms-prop-edit-text-ellipse-infoAHLineColor"
                ).val();

            options.infoAHLineWidth = $(
                "#d2map_ms-prop-edit-text-ellipse-infoAHLineWidth"
            ).val();
            options.infoAHLineStyle = $(
                "#d2map_ms-prop-edit-text-ellipse-infoAHLineStyle"
            ).val();

            options.infoAHRectWidth = $(
                "#d2map_ms-prop-edit-text-ellipse-infoAHRectWidth"
            ).val();
            options.infoAHRectHeight = $(
                "#d2map_ms-prop-edit-text-ellipse-infoAHRectHeight"
            ).val();
            options.infoAHAzimuth = $("#d2map_ms-prop-edit-text-ellipse-infoAHAzimuth").val();

            if (!$("#d2map_ms-prop-edit-chk-ellipse-infoAHFillColor").is(":checked"))
                options.infoAHFillColor = "";
            else
                options.infoAHFillColor = $(
                    "#d2map_ms-prop-edit-text-ellipse-infoAHFillColor"
                ).val();
        } else if (clickedAHTab.indexOf("rectangle") >= 0) {
            //사각형
            options.areaOfUncertainty = "rectangle";
            options.infoAHLineLength = $("#d2map_ms-prop-edit-text-infoAHLineLength").val(); //길이
            if (!$("#d2map_ms-prop-edit-chk-rectangle-infoAHLineColor").is(":checked"))
                options.infoAHLineColor = "";
            else
                options.infoAHLineColor = $(
                    "#d2map_ms-prop-edit-text-rectangle-infoAHLineColor"
                ).val();

            options.infoAHLineWidth = $(
                "#d2map_ms-prop-edit-text-rectangle-infoAHLineWidth"
            ).val();
            options.infoAHLineStyle = $(
                "#d2map_ms-prop-edit-text-rectangle-infoAHLineStyle"
            ).val();

            options.infoAHRectWidth = $(
                "#d2map_ms-prop-edit-text-rectangle-infoAHRectWidth"
            ).val();
            options.infoAHRectHeight = $(
                "#d2map_ms-prop-edit-text-rectangle-infoAHRectHeight"
            ).val();
            options.infoAHAzimuth = $("#d2map_ms-prop-edit-text-rectangle-infoAHAzimuth").val();

            if (!$("#d2map_ms-prop-edit-chk-rectangle-infoAHFillColor").is(":checked"))
                options.infoAHFillColor = "";
            else
                options.infoAHFillColor = $(
                    "#d2map_ms-prop-edit-text-rectangle-infoAHFillColor"
                ).val();
        }
        // AI: 추측선 표시 기능들을 options 객체에 적용한다.
        let clickedAITab = '';

        if (tabBtn === 'AI') {
            clickedAITab = "none";
        } else {
            clickedAITab = tabBtn || selectObject._prop.options.deadReckoningTrailer;
        }

        if (clickedAITab.indexOf("none") >= 0) {
            //없음
            options.deadReckoningTrailer = "";
            options.infoAIRadius = "";
            options.infoAILineColor = "";
            options.infoAILineWidth = "";
            options.infoAILineStyle = "";
            options.infoAIFillColor = "";
            options.infoAIStartLineX = "";
            options.infoAIStartLineY = "";

            //입력된 값을 모두 초기화시킨다.
            document
                .querySelectorAll('.d2map_AI-tab-content input[type="text"]')
                .forEach((content) => (content.value = ""));
            document
                .querySelectorAll('.d2map_AI-tab-content input[type="number"]')
                .forEach((content) => (content.value = ""));
            document
                .querySelectorAll('.d2map_AI-tab-content input[type="color"]')
                .forEach((content) => (content.value = "#0d0d0d"));

        } else if (clickedAITab.indexOf("circle") >= 0) {
            //원
            options.deadReckoningTrailer = "circle";

            let infoAIRadius = $("#d2map_ms-prop-edit-text-infoAIRadius").val(); //반경

            options.infoAIRadius = infoAIRadius;

            if (!$("#d2map_ms-prop-edit-chk-circle-infoAILineColor").is(":checked"))
                options.infoAILineColor = "";
            else
                options.infoAILineColor = $(
                    "#d2map_ms-prop-edit-text-circle-infoAILineColor"
                ).val();

            options.infoAILineWidth = $(
                "#d2map_ms-prop-edit-text-circle-infoAILineWidth"
            ).val();

            let infoAIFillColor = $("#d2map_ms-prop-edit-text-infoAIFillColor").val(); //채움색상

            if (!$("#d2map_ms-prop-edit-chk-infoAIFillColor").is(":checked"))
                infoAIFillColor = "";
            else infoAIFillColor = infoAIFillColor;

            options.infoAIFillColor = infoAIFillColor;

            options.infoAILineStyle = $(
                "#d2map_ms-prop-edit-text-circle-infoAILineStyle"
            ).val();
        } else if (clickedAITab.indexOf("line") >= 0) {
            //선
            options.deadReckoningTrailer = "line";
            let infoAIStartLineX = $("#d2map_ms-prop-edit-text-infoAIStartLineX").val(); //중심점 X

            options.infoAIStartLineX = infoAIStartLineX;

            let infoAIStartLineY = $("#d2map_ms-prop-edit-text-infoAIStartLineY").val(); //중심점 Y

            options.infoAIStartLineY = infoAIStartLineY;

            if (!$("#d2map_ms-prop-edit-chk-line-infoAILineColor").is(":checked"))
                options.infoAILineColor = "";
            else
                options.infoAILineColor = $(
                    "#d2map_ms-prop-edit-text-line-infoAILineColor"
                ).val();
            options.infoAILineWidth = $("#d2map_ms-prop-edit-text-line-infoAILineWidth").val();
            options.infoAILineStyle = $("#d2map_ms-prop-edit-text-line-infoAILineStyle").val();
        }

        // AJ: 속도선 표시 기능들을 options 객체에 적용한다.
        let clickedAJTab = '';
        if (isValid(selectObject._prop.options.speedLeaderTrailer)) {
            if (tabBtn === 'AJ') {
                clickedAJTab = "none";
            } else {
                clickedAJTab = selectObject._prop.options.speedLeaderTrailer.toLowerCase();
            }
        } else {
            clickedAJTab = document.querySelector('.d2map_AJ-tab-content.active').id;
        }

        if (clickedAJTab.indexOf("none") >= 0) {
            options.speedLeaderTrailer = "";
            options.infoAJMovingDirection = "";
            options.infoAJMovingSpeed = "";
            options.infoAJSpeedRangeLower = "40";
            options.infoAJSpeedRangeUpper = "80";
            options.infoAJSpeedRangeLengthLow = "6";
            options.infoAJSpeedRangeLengthMid = "12";
            options.infoAJSpeedRangeLengthHigh = "20";
            options.infoAJLineColor = "";
            options.infoAJLineWidth = "";
            options.infoAJLineStyle = "";
            options.infoAJDynamicLength = "";
            options.infoAJDynamicSize = "";

            //입력된 값을 모두 초기화시킨다.
            document
                .querySelectorAll('.d2map_AJ-tab-content input[type="text"]')
                .forEach((content) => (content.value = ""));
            document
                .querySelectorAll('.d2map_AJ-tab-content input[type="number"]')
                .forEach((content) => (content.value = ""));
            document
                .querySelectorAll('.d2map_AJ-tab-content input[type="color"]')
                .forEach((content) => (content.value = "#0d0d0d"));

        } else if (clickedAJTab.indexOf("speed") >= 0) {
            options.speedLeaderTrailer = "SpeedLeader";

            let infoAJMovingDirection = $("#d2map_ms-prop-edit-text-infoAJMovingDirection").val(); //이동방향

            options.infoAJMovingDirection = infoAJMovingDirection;

            let infoAJMovingSpeed = $("#d2map_ms-prop-edit-text-infoAJMovingSpeed").val(); //이동속력

            options.infoAJMovingSpeed = infoAJMovingSpeed;

            //속력구간 저속-중간
            options.infoAJSpeedRangeLower = setAJValue('infoAJSpeedRangeLower');

            //속력구간 중간-고속
            options.infoAJSpeedRangeUpper = setAJValue('infoAJSpeedRangeUpper');

            //속력구간 저속길이
            options.infoAJSpeedRangeLengthLow = setAJValue('infoAJSpeedRangeLengthLow');

            //속력구간 중간길이
            options.infoAJSpeedRangeLengthMid = setAJValue('infoAJSpeedRangeLengthMid');

            //속력구간 고속길이
            options.infoAJSpeedRangeLengthHigh = setAJValue('infoAJSpeedRangeLengthHigh');

            let infoAJLineColor = $("#d2map_ms-prop-edit-text-infoAJLineColor").val(); //선색상
            if (!$("#d2map_ms-prop-edit-chk-infoAJLineColor").is(":checked"))
                infoAJLineColor = "";
            else infoAJLineColor = infoAJLineColor;

            options.infoAJLineColor = infoAJLineColor;

            options.infoAJLineWidth = setAJValue('infoAJLineWidth');

            let infoAJLineStyle = $("#d2map_ms-prop-edit-text-infoAJLineStyle").val(); //선스타일

            options.infoAJLineStyle = infoAJLineStyle;

            let infoAJDynamicLength = $(
                "#d2map_ms-prop-edit-text-infoAJDynamicLength"
            ).val(); //가변견인센서열 거리

            options.infoAJDynamicLength = infoAJDynamicLength;

            let infoAJDynamicSize = $("#d2map_ms-prop-edit-text-infoAJDynamicSize").val(); //가변견인센서열 크기

            options.infoAJDynamicSize = infoAJDynamicSize;
        }


        // options.size = size; // 군대부호 크기 원복 /*군대부호 크기 범위 3~14 */

        // selectObject._prop.options = options;
        options = Object.assign(selectObject._prop.options, options);
        selectObject.updateFeature(true);
        window.graphic._selectObjectManager.selectObject();


        // 군대부호 인스턴스 생성infoAJLineWidth
        var sym = new D2MS.ms.Symbol('');
        sym.setOptions(options);

        var imgSrc = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sym.asSVG()); //SVG 방식
        var imgContainer = $('#d2map_ms-prop-edit-img-container'); // 이미지를 표시할 컨테이너
        var img = document.createElement('img'); // 이미지 요소 생성
        img.src = imgSrc;
        imgContainer.empty(); // 기존 이미지 삭제
        imgContainer.append(img); // 이미지 컨테이너에 이미지 추가

        if (!(isInit == true)) {
            let graphicBoard = window.graphic.getSelectGraphicBoard();
            graphicBoard.undoRedoSave();
        }

        return options;

        function setAJValue(place) {
            let infoAJMovingDirection = $("#d2map_ms-prop-edit-text-infoAJMovingDirection").val(); //이동방향
            let infoAJMovingSpeed = $("#d2map_ms-prop-edit-text-infoAJMovingSpeed").val(); //이동속력
            let value = $("#d2map_ms-prop-edit-text-" + place).val();

            if (isValid(value) == false && isValid(infoAJMovingDirection) == true && isValid(infoAJMovingSpeed) == true)
                value = $("#d2map_ms-prop-edit-text-" + place).prop('placeholder');
            return value;
        }
    }
}

export default MilSymbolProperties;
