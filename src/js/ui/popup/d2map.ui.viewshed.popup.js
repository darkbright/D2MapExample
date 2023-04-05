$(function () {

    // 입력 좌표값을 기준으로 가시선 분석
    $('#viewshed-apply-direct').on('click', function () {
        window.eventManager.setMapMode('terrainAnalysis');

        let options = {
            name: '가시권분석',
            operationMode : 'ViewShed',
            mgrs: '52SCF6572835747',  //디폴트로 입력한 좌표값을 기준으로 가시선 분석
            height: 100,
            radius: 3000,
            startAngle: 315,
            endAngle: 45
        };

        //가시선 색상 설정 가능, rgb(255, 0, 0, 0.5), #ff0000로 색상처리 모두 지원
        window.viewShed.setVisibleColor('rgba(0,0,255,0.5)');
        window.viewShed.setInvisibleColor('rgba(125,125,0,0.5)');			

        window.viewShed.createViewShed(options, (extent) => {
            //화면 도시 영역 자동 조절
            window.map.getView().fit(extent);
            console.log(extent);
        });
    });

    // UI 입력값을 기준으로 가시선 분석
    $('#viewshed-apply').on('click', function () {
        window.eventManager.setMapMode('terrainAnalysis');

        var nullInput = [];
        var vsHeight = $('#viewshed-height').val();
        var vsRad = $('#viewshed-radius').val();
        var vsSAngle = $('#viewshed-startangle').val();
        var vsEAngle = $('#viewshed-endangle').val();

        if (vsHeight == '') nullInput.push('높이');
        if (vsRad == '') nullInput.push('반경');
        if (vsSAngle == '') nullInput.push('시작각도');
        if (vsEAngle == '') nullInput.push('끝각도');

        if (nullInput.length != 0) {
            alert('다음 값이 입력되지 않음 : ' + nullInput.join(', '));
            return false;
        }
        
        let options = {
            name: '가시권분석',
            operationMode : 'ViewShed',
            mgrs: '',//'52SCF6572835747',  //값이 없으면 클릭 위치를 중심으로 분석 결과 표시
            height: vsHeight,
            radius: vsRad,
            startAngle: vsSAngle,
            endAngle: vsEAngle
        };

        //가시선 색상 설정 가능, rgb(255, 0, 0, 0.5), #ff0000로 색상처리 모두 지원
        //window.viewShed.setVisibleColor('rgba(0,0,255,0.5)');
        //window.viewShed.setInvisibleColor('rgba(125,125,0,0.5)');			

        window.viewShed.createViewShed(options, (extent) => {
            ;
        });
    });

    // validate
    $('#popup-viewshed input').on('change', function () {
        var vsHeight = $('#viewshed-height').val();
        var vsRad = $('#viewshed-radius').val();
        var vsSAngle = $('#viewshed-startangle').val();
        var vsEAngle = $('#viewshed-endangle').val();

        if (vsHeight < 0) vsHeight = 0;
        if (vsHeight > 500) vsHeight = 500;
        if (vsRad < 0) vsRad = 0;
        if (vsRad > 5000) vsRad = 5000;
        if (vsSAngle < 0) vsSAngle = 0;
        if (vsSAngle > 360) vsSAngle = 360;
        if (vsEAngle < 0) vsEAngle = 0;
        if (vsEAngle > 360) vsEAngle = 360;

        $('#viewshed-height').val(vsHeight);
        $('#viewshed-radius').val(vsRad);
        $('#viewshed-startangle').val(vsSAngle);
        $('#viewshed-endangle').val(vsEAngle);
    });
});