// 사이드 메뉴 - 지도
async function initSidebarMap() {
    $('.layer-toggleBtn').on('change', function (e) {
        var layerVisible = $(this).is(':checked');
        var layerName = $(this).attr('id').replace('layer-toggleBtn-', '');
        var layer = window.mapLayerManager.getLayer('layer-sub-' + layerName);
        if (layer) {
            layer.setVisible(layerVisible);

            var configLayer = mapConfig.MapList.find(element => element.id == layerName);
            // reverse Visible 설정 (배경 반전 등 활용)
            if (configLayer.reverseVisible != undefined)
                mapLayerManager.getLayer('layer-sub-'+ configLayer.reverseVisible).setVisible(!layerVisible);

            // sub layer Visible 설정 (mvt 상위 레스터 레이어 활용)
            if (configLayer.subLayer != undefined)
                mapLayerManager.getLayer('layer-sub-'+ configLayer.subLayer.id).setVisible(layerVisible);

            // view Max Zoom 설정 (MVT 레이어에서 더 이상 확대 되지 않도록 설정)
            if (configLayer.viewMaxZoom != undefined)
                window.map.getView().setMaxZoom(configLayer.viewMaxZoom);
            else
                window.map.getView().setMaxZoom(mapConfig.viewMaxZoom);
        }
    });


    $('#overview-show').on('click', function () {
        if (window.mapLayerManager)
            window.mapLayerManager.createOverview();
    });

    $('#overview-hide').on('click', function () {
        if (window.mapLayerManager)
            window.mapLayerManager.destroyOverview();
    });

    var defaultBrightness = 50;
    var defaultContrast = 50;
    $('#apply-brightness-contrast').on('click', function () {
        var brightness = $('#effect-brightness').val();
        var contrast = $('#effect-contrast').val();

        if (brightness.trim() === '') {
            brightness = defaultBrightness;
            $('#effect-brightness').val(defaultBrightness);
        }
        if (contrast.trim() === '') {
            contrast = defaultContrast;
            $('#effect-contrast').val(defaultContrast);
        }

        //지도밝기 조절 기본값 구하기
        console.log('brightness value is', window.brightness.getBrightness());
        console.log('contrast value is', window.brightness.getContrast());

        //지도밝기 조절 적용
        window.brightness.setBrightnessAndContrast(brightness, contrast);
    });

    //화면 밝기/명암 조절
    $('#reset-brightness-contrast').on('click', function () {
        $('#effect-brightness').val(defaultBrightness);
        $('#effect-contrast').val(defaultContrast);
        window.brightness.setBrightnessAndContrast(defaultBrightness, defaultContrast);
    });

    //현재화면 클립보드로 복사
    $('#apply-copy-canvas-clipboard').on('click', function () {
        window.exportImage.copyClipboard(function (result) {
            if (result == true)
                alert("copy canvas to clipboard");
            else
                alert("copy failed");
        });
    });

    //선택 영역에 대한 좌표정보와 image 정보를 base64로 반환한다.
    $('#apply-return-canvas-base64').on('click', function () {
        window.exportImagePartialArea.setPositionAbsolute(0,0);
        window.exportImagePartialArea.downloadPNGEx('base64', result => {
            //console.log(result.startGeographic, result.endGeographic, result.href);
            var popup = window.open("", "popUpWindow", "width=500, height=500");
            var doc = popup.document;

            //초기화
            var imgElement = doc.querySelector('img');
            if(imgElement)
                doc.body.removeChild(imgElement);

            var divElement = doc.querySelectorAll('div');
            if(divElement)
                for(var i=0; i<divElement.length; i++)
                    doc.body.removeChild(divElement[i]);

            //Image와 영역정보 표시
            var image = new Image();
            image.src = result.href;
            image.onload = function() {
                var self = this;
                var width = image.width + 150;
                var height = image.height + 150;
                popup = popup.resizeTo(width, height);
            };

            var start = doc.createElement('div');
            start.innerHTML = '시작점 좌표 :' + result.startGeographic;
            var end = doc.createElement('div');
            end.innerHTML = '끝점 좌표 : ' + result.endGeographic;

            doc.body.appendChild(image);
            doc.body.appendChild(start);
            doc.body.appendChild(end);
        });
    });

    //지도 확대
    $('#apply-map-scale-zoomin').on('click', function () {
        let scale = window.spatialMath.getMapScale().replace(/,/g, '') / 2 + 10;
        window.spatialMath.setMapScale(scale);
    });

    //지도 축소
    $('#apply-map-scale-zoomout').on('click', function () {
        let scale = Number(window.spatialMath.getMapScale().replace(/,/g, '')) * 2 + 10;
        window.spatialMath.setMapScale(scale);
    });

    //지도 영역 확대
    $('#apply-map-scale-zoomregion').on('click', function () {
        var tracker = new D2.Core.Tracker(window.map);
        tracker.setStyle([255, 173, 58, 1.0], 2, [128, 128, 128, 0.2]);

        tracker.select('rectangle', false, function (extent, param1, param2) {
            var mainExtent = window.map.getView().calculateExtent();
            var ratio = (mainExtent[2] - mainExtent[0]) / (extent[2] - extent[0]);
            window.map.getView().setCenter([(extent[0] + extent[2]) * 0.5, (extent[1] + extent[3]) * 0.5]); //중심이동
            let scale = Number(window.spatialMath.getMapScale().replace(/,/g, '')) / ratio; //배율 계산
            window.spatialMath.setMapScale(scale); //축척 설정
            tracker.handlerClear();
        });
    });

    //2021년12월8일패치, 축척 변경하기 :: 배경지도 타일맵 레벨에 따라 축척이 자동 변경되어 설정된다.
    $('#apply-map-scale').on('click', function () {
        //축척 입력(콤마로 표시된 축척을 숫자로 변경)
        mapScale = parseInt($('#map-scale').val().replace(/,/g, ''));
        window.spatialMath.setMapScale(mapScale);
    });
    window.map.on('moveend', mouseHanHandler);

    //3차원 실행
    $('#tools-3d-3d').on('click', function () {
        window.open('../../../D2MapEarth/', 'parent'); //새로운 탭에 표시한다.
    });
}

//2021년12월8일패치
function mouseHanHandler() {

    //현재 축척얻기
    $('#map-scale').val(window.spatialMath.getMapScale());

    //현재 해상도 얻기
    //var resolution = window.map.getView().getResolution());
    //console.log(resolution);
}

