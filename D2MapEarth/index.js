//전역 객체 선언
window.viewer = undefined;
window.Cesium = window.cesium;
window.layerModel = [];

//전역 URL 설정
Cesium.buildModuleUrl.setBaseUrl('/D2MapEarth/');

//초기화
$(function () {

    var Viewer = Cesium.Viewer;
    window.viewer = new Viewer('D2MapEarthContainer', {
        contextOptions: {
            webgl: {
                preserveDrawingBuffer: true,
                powerPreference: 'high-performance',
            },
        },
        imageryProvider: false, //SetupLayer에서 추가하도록 설정
        shadows: false,
        scene3DOnly: true, //3차원으로만 렌더링됨
        sceneMode: Cesium.SceneMode.SCENE3D, //3차원 화면으로 구성
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        vrButton: false,
        homeButton: false,
        infoBox: false, //객체 선택 시 상세정보 표시 기능 활성화 여부
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        terrainExaggeration: 1.0, //고도 기복 비율 조정
        shouldAnimate: true, //눈,비,안개 효과 적용
        requestRenderMode: true, //throttled이 false이면 매번 화면 갱신, true이면 지도 정보 갱신시만 적용
        maximumRenderTimeChange: Infinity
    });

    //초기 배경 색상을 검정색으로 설정
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;

    //Remove Cesium Ion logo
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    //달, 태양, 별 등 효과 제거
    viewer.scene.moon.show = false;
    viewer.scene.sun.show = false;
    viewer.scene.skyBox.show = false;

    //Terrain Provider 설정으로 인한 Black Spot 방지
    viewer.scene.logarithmicDepthBuffer = false;

    //Depth Test 활성화
    viewer.scene.globe.depthTestAgainstTerrain = true;

    //화면 FPS 표시여부
    viewer.scene.debugShowFramesPerSecond = true;

    //Frame 모드, optional-check
    viewer.scene.globe._surface.tileProvider._debug.wireframe = false;

    //지도 레이어 객체 생성
    window.mapLayer = new MapLayer(viewer);

    //지도 레이어 등록
    setupLayer(viewer);

    //지도 객체 생성
    window.map = new MapObject(viewer);

    //투명도 객체 생성
    window.graphic = new Graphic(viewer);

    //도시요소 객체 생성
    window.cop = new COPLayer(viewer);

    // B3DM 객체 추가
    window.b3dmManager = new B3dmManager(viewer, function (type, tile, value) {
        // B3DM Picking information
        console.log(`${type}, ${tile}, ${value}`);
    });

    // UI 생성
    $(document).ready(function () {
        window.UIControl.initLeftMenu();
    });

})

function setupLayer(viewer) {
    //초기 카메라 위치 설정
    let orientation = {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0,
    };
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(128, 28.0, 800000),
        orientation: orientation
    });

    // 네비게이션 바 설정
    const options = {};
    options.defaultResetView = new Cesium.Cartographic(Cesium.Math.toRadians(127), Cesium.Math.toRadians(28), 800000);
    options.orientation = orientation;
    options.duration = 2;
    options.enableCompass = true;
    options.enableZoomControls = true;
    options.enableDistanceLegend = true;
    options.enableCompassOuterRing = true;
    options.resetTooltip = "Reset View";
    options.zoomInTooltip = "Zoom In";
    options.zoomOutTooltip = "Zoom Out";
    new window.CesiumNavigation(viewer, options);

    //고도 서비스 등록
    viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
        url: map3DConfig.DEM_PATH
    });
    //고도 서비스 가용성 등록
    var terrainProvider = new window.TerrainProviderAvailability(viewer, map3DConfig.DEM_PATH);

    //지도 서비스 등록
    var imageryLayers = viewer.imageryLayers;
    for (var i = 0; i < map3DConfig.MapList.length; i++ ) {
        var MapList = map3DConfig.MapList[i];
        var layer;
        if (MapList.type == 'xyz') {
            layer = imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
                url: MapList.url,
                maximumLevel: MapList.maximumLevel
            }));
        }
        else {
            layer = imageryLayers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
                url: MapList.url,
                maximumLevel: MapList.maximumLevel
            }));
        }
        layer.name = MapList.name;
        layer.show = MapList.visible;
        window.layerModel.push({ "name": layer.name, "layer": layer });
    }
}


//지도 레이어 On/Off
function toggleLayer(paramObj) {
    for (var i = 0; i < window.layerModel.length; i++) {
        if (window.layerModel[i].name == paramObj.id) {
            window.layerModel[i].layer.show = paramObj.checked;
            break;
        }
    }
}

//2차원 그물망 변경
function changeMesh() {
    var mode = window.viewer.scene.globe._surface.tileProvider._debug.wireframe;
    window.viewer.scene.globe._surface.tileProvider._debug.wireframe = !mode;
    window.viewer.scene.requestRender();

}

//지도이동속도
$('#move-sub-ratio').on('click', function () {
    var ratio = parseFloat($('#move-sub-ratio-value').val());
    if ($.isNumeric(ratio)) {
        if (ratio <= 1) ratio = 1;
        if (ratio > 10) ratio = 10;
        window.map._setKeyboard.setMoveRatio(ratio); //지도 이동 속도(범위 1.0 ~ 10.0)
    }
});





