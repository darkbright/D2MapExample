var ol = D2.Core.ol;
var serverList = ["local", "server"];
var mapServerType;
var boundaryStyle;
window.D2MapVersion = '2023.03.13';

// 클릭한 버튼 content 가져오기
(function () {

	try {
		// 서버 타입(local, server)을 가져온다.
		getServerType();

		// 지도 리스트 HTML 추가
		insertMapListHTML();

		// 2021년12월8일패치 : 벡터 지도 색성 설정
		setupMapStyle();

		// 지도 초기화 및 레이어 설정
		setupMap();
		setupMapLayer();
		setupGridMVT();

		// 툴바 및 Side 메뉴 이벤트 설정
		mainHandler();
		initToolbarElement();

		// 투명도 관리 이벤트 설정
		initGraphicContextMenu();
		initGraphicPopup();

		// 투명도 글상자/표 이벤트 설정
		initTextEditorPopupUI();

		// 좌표계설정
		showCoordinate();

		// 서버 토글 설정
		setupServerLocalToggle();

		// Side 메뉴 설정
		initSidebarMap();
		initSidebarMVTLayer();
		initSidebarMilSym();
		initSidebarCoordinate();
		initSidebarGraphicLayer();
		initSidebarGraphicApp();
		initSidebarTerrainAnalysis();
		initSidebarMeasurement();
	} catch (error) {
		console.log(error);
		//window.location.reload();
	}

	// 토글 버튼 이벤트 처리
	function setupServerLocalToggle() {
		document.querySelectorAll('.tools-service').forEach(function (elem) {
			elem.addEventListener('click', function (e) {
				if (e.target.id === "btn-local") {
					mapServerType = serverList[0];
				} else {
					mapServerType = serverList[1];
				}

				if (sessionStorage.getItem("setting") !== mapServerType) {
					sessionStorage.setItem("setting", mapServerType);
					location.reload();
				}
			});
		})
	}

	// D2Map 생성 및 초기화
	function setupMap() {
		// 대한민국 중심좌표를 초기 화면으로 설정
		var olCenter = ol.proj.fromLonLat([127.027583, 37.497928]);
		// ol 맵 생성
		window.map = new ol.Map({
			controls: ol.control.defaults({
				zoom: false,
			}),
			// 지도를 표시할 요소 ID
			target: 'map',
			layers: [],
			view: new ol.View({
				center: olCenter,
				zoom: 8,
				minZoom: 0,
				maxZoom: mapConfig.viewMaxZoom,
			}),
			interactions: ol.interaction.defaults({
				doubleClickZoom: false,
				altShiftDragRotate: false,
				shiftDragZoom: false,
				pinchRotate: false,
				pinchZoom: false,
				keyboard: false
			})
		});

		// 베이스 맵 추가
		let baseLayer = new ol.layer.Tile({
			preload: Infinity,
			source: new ol.source.XYZ({
				// 기본 지도 설정 - url은 사이트에 맞게 변경
				url: mapConfig.BaseMap.url,
				crossOrigin: 'Anonymous',
				minZoom: mapConfig.BaseMap.minZoom,
				maxZoom: mapConfig.BaseMap.maxZoom,
			}),
		});
		window.map.addLayer(baseLayer);
		// 레이어 관리 모듈 생성
		window.mapLayerManager = new D2.Core.MapLayerManager(window.map);
		window.mapLayerManager.addLayer('layer-sub-baseMap', false, baseLayer);

		// 정배율 지도 확대/축소 설정
		window.map.getView().setConstrainResolution(true);

		// 임배디드 이미지 정의
		var D2_CONSTANTS = {
			embeddedImages: {
				billboard:
					'data:image/png;base64,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',
				billboardTerrain:
					'data:image/png;base64,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',
				marker:
					'data:image/png;base64,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rQEfBsa6ebbv2WbeCKC6ZmXjeQB3ki0Nm9IIET85HsX1h0brI2NRrYOQ7w/JTjLr6tm+Z5t5IwAg613lGFlwqGl4VoBaos5XtvkyFWkyFWn69R2+1ybkO0U2+o/Pk6n/BPNKAP6alQ3rfB9tQsTPTMSFh8fC6Ht7g3DH8bhd0OduYCPMrWSPTuiJQ6LOJo5CKlTJRuyNwAXNrksU859bZtxUkVRzC7cPk/kVvjOP5v4G88oCAEzXR6jAw8A3W10nwJGaLRwLrdemW/9blJ8ATM+jub/BvBMANOoKiclCxCOtrmusAnLYA3xWpfeOdjlbzEsBnEBlC9nZPKfjulngduskz8yXoE8z5q0A/LXDIGrJEkifOY2P2AJ8xaSuzpegTzPmrQAgWxVGsewhO3UsnsVbI+CjKjrSQ2c6nhPmtQCqa4YpeApZXeGmWbz1x8A9otITJ3qfS+a1AKB+BGxWS7CO7LDmdrTNMppPzHsBBLeeqCW4h2xp2I77yU4om7N5frNh3gsgQwCOky0L8zJ4p+rXTM6nDZ88nhcCOGnz5vvknUOcnUq28Tnvmdc8LwSQoZBV8fwzzTOHngE+CPg6j9f9z+X5YefqVNaNIFlZyUuA9wMvJQv4bCQr7X4SRZ8Pc3+D55UAACqfGIFIwZUSsARQVZlwnDSMY4/wfZec6Vf06dOnT58+ffr06dOnT58+ffr06dOnT58+ffr06dOnT58+3eb/ARUT6iCbj0OIAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTAyLTAxVDEyOjMwOjM3KzAxOjAwUlma2wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wMi0wMVQxMjozMDozNyswMTowMCMEImcAAABGdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuNy44LTkgMjAxNi0wNi0xNiBRMTYgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfmvzS2AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OmhlaWdodAA1MTLA0FBRAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADUxMhx8A9wAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ4NTk0ODYzNwvbBsIAAAATdEVYdFRodW1iOjpTaXplADIwLjJLQkIJjBivAAAAVXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8uL3VwbG9hZHMvY2FybG9zcHJldmkvenU3SHpMdC8xMTAyLzE0ODU5Njk5MjgtMTctbG9jYXRpb25fNzg4OTYucG5nDYjrbwAAAABJRU5ErkJggg==',
				trackerRotate:
					'data:image/png;base64,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',
			},
		};
		window.D2_CONSTANTS = D2_CONSTANTS;

		// URL 관리 모듈 생성
		window.D2MapManager = new D2.Core.D2MapManager();

		// 투명도 레이어 모듈 생성
		window.graphic = new D2.Core.Graphic(map, new window.D2.Core.GraphicSelectObjectManager, new window.ICOPS.MSObjectCreator());
		window.graphic.getSelectGraphicBoard().setName('Layer-01');
		window.graphic.loadStdXSD(mapConfig.GRAPHIC_StdXSD); // 투명도 스키마

		// 투명도 군대부호 Tree 생성
		window.MilSymbol = new window.ICOPS.MilSymbol(window.graphic, mapConfig.D2MSPath);
		window.MilSymbol.initMilSymbolLang('d2map_tree-container');

		// 좌표 관리 모듈 생성
		window.Coordinate = new D2.Core.Coordinate(mapConfig.DEMPath, true);
		window.Coordinate.setGt2Provider(mapConfig.GT2Path, 0, 15);

		// 투명도 커서 정의
		var cursor = {};
		cursor.default = 'default';
		cursor.move = 'move';
		cursor.edit = 'crosshair';
		cursor.rotate = 'url(src/lib/image/icon/cursor-rotate.cur),auto';
		window.graphic.setCursor(cursor);
	}

	// Grid 설정
	function setupGridMVT() {
		// GARS Grid
		var garsGrid = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.gars,
				minZoom: 0,
				maxZoom: 13,
			}),
			visible: false
		});
		garsGrid.styleProperty = new GridStyle()
		garsGrid.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (garsGrid.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				garsGrid.styleProperty.label.getText().setText(featureProperty.Label);
				return garsGrid.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return garsGrid.styleProperty.grid;
			}
		})
		window.map.addLayer(garsGrid);
		window.mapLayerManager.addLayer('grid-sub-gars', false, garsGrid);

		// UTM Grid20KM
		var utmGrid20KM = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.utm20,
				minZoom: 1,
				maxZoom: 12,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		utmGrid20KM.styleProperty = new GridStyle();
		utmGrid20KM.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (utmGrid20KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				utmGrid20KM.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return utmGrid20KM.styleProperty.label;
			} else if (utmGrid20KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'UTM_20000_Label' && feature.properties_.name != undefined) {
				utmGrid20KM.styleProperty.label.getText().setText(featureProperty.name.toString());
				return utmGrid20KM.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return utmGrid20KM.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return utmGrid20KM.styleProperty.grid;
			}
		});
		window.map.addLayer(utmGrid20KM);
		window.mapLayerManager.addLayer('grid-sub-utm', false, utmGrid20KM);

		// UTM Grid10KM
		var utmGrid10KM = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.utm10,
				minZoom: 1,
				maxZoom: 12,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		utmGrid10KM.styleProperty = new GridStyle();
		utmGrid10KM.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (utmGrid10KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				utmGrid10KM.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return utmGrid10KM.styleProperty.label;
			} else if (utmGrid10KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'UTM_20000_Label' && feature.properties_.name != undefined) {
				utmGrid10KM.styleProperty.label.getText().setText(featureProperty.name.toString());
				return utmGrid10KM.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return utmGrid10KM.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return utmGrid10KM.styleProperty.grid;
			}
		});
		window.map.addLayer(utmGrid10KM);
		window.mapLayerManager.addLayer('grid-sub-utm-10', false, utmGrid10KM);

		// UTM Grid5KM
		var utmGrid5KM = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.utm5,
				minZoom: 1,
				maxZoom: 14,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		utmGrid5KM.styleProperty = new GridStyle();
		utmGrid5KM.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (utmGrid5KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				utmGrid5KM.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return utmGrid5KM.styleProperty.label;
			} else if (utmGrid5KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'UTM_20000_Label' && feature.properties_.name != undefined) {
				utmGrid5KM.styleProperty.label.getText().setText(featureProperty.name.toString());
				return utmGrid5KM.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return utmGrid5KM.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return utmGrid5KM.styleProperty.grid;
			}
		});
		window.map.addLayer(utmGrid5KM);
		window.mapLayerManager.addLayer('grid-sub-utm-5', false, utmGrid5KM);

		// UTM Grid1KM
		var utmGrid1KM = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.utm1,
				minZoom: 1,
				maxZoom: 14,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		utmGrid1KM.styleProperty = new GridStyle();
		utmGrid1KM.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (utmGrid1KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				utmGrid1KM.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return utmGrid1KM.styleProperty.label;
			} else if (utmGrid1KM.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'UTM_20000_Label' && feature.properties_.name != undefined) {
				utmGrid1KM.styleProperty.label.getText().setText(featureProperty.name.toString());
				return utmGrid1KM.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return utmGrid1KM.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return utmGrid1KM.styleProperty.grid;
			}
		});
		window.map.addLayer(utmGrid1KM);
		window.mapLayerManager.addLayer('grid-sub-utm-1', false, utmGrid1KM);

		// Geographic Grid
		var geographicGrid = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.geographic,
				minZoom: 0,
				maxZoom: 12,
			}),
			visible: false
		});
		geographicGrid.styleProperty = new GridStyle();
		geographicGrid.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (geographicGrid.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				geographicGrid.styleProperty.label.getText().setText(featureProperty.Label);
				return geographicGrid.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return geographicGrid.styleProperty.grid;
			}
		});
		window.map.addLayer(geographicGrid);
		window.mapLayerManager.addLayer('grid-sub-geographic', false, geographicGrid);

		// GeoRef Grid
		var geoRefGrid = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.georef,
				minZoom: 0,
				maxZoom: 12,
			}),
			visible: false
		});
		geoRefGrid.styleProperty = new GridStyle();
		geoRefGrid.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (geoRefGrid.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				geoRefGrid.styleProperty.label.getText().setText(featureProperty.Label);
				return geoRefGrid.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return geoRefGrid.styleProperty.grid;
			}
		});
		window.map.addLayer(geoRefGrid);
		window.mapLayerManager.addLayer('grid-sub-georef', false, geoRefGrid);

		// MGRS Grid 20Km
		var mgrsGrid = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.mgrs20,
				minZoom: 1,
				maxZoom: 12,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		mgrsGrid.styleProperty = new GridStyle();
		mgrsGrid.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (mgrsGrid.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				mgrsGrid.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return mgrsGrid.styleProperty.label;
			} else if (mgrsGrid.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'MGRS_20000_Label' && feature.properties_.name != undefined) {
				mgrsGrid.styleProperty.label.getText().setText(featureProperty.name.toString());
				return mgrsGrid.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return mgrsGrid.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return mgrsGrid.styleProperty.grid;
			}
		});
		window.map.addLayer(mgrsGrid);
		window.mapLayerManager.addLayer('grid-sub-mgrs', false, mgrsGrid);

		// MGRS Grid 10Km
		var mgrsGrid10Km = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.mgrs10,
				minZoom: 1,
				maxZoom: 12,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		mgrsGrid10Km.styleProperty = new GridStyle();
		mgrsGrid10Km.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (mgrsGrid10Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				mgrsGrid10Km.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return mgrsGrid10Km.styleProperty.label;
			} else if (mgrsGrid10Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'MGRS_20000_Label' && feature.properties_.name != undefined) {
				mgrsGrid10Km.styleProperty.label.getText().setText(featureProperty.name.toString());
				return mgrsGrid10Km.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return mgrsGrid10Km.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return mgrsGrid10Km.styleProperty.grid;
			}
		});
		window.map.addLayer(mgrsGrid10Km);
		window.mapLayerManager.addLayer('grid-sub-mgrs-10', false, mgrsGrid10Km);

		// MGRS Grid 5Km
		var mgrsGrid5Km = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.mgrs5,
				minZoom: 1,
				maxZoom: 14,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		mgrsGrid5Km.styleProperty = new GridStyle();
		mgrsGrid5Km.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (mgrsGrid5Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				mgrsGrid5Km.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return mgrsGrid5Km.styleProperty.label;
			} else if (mgrsGrid5Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'MGRS_20000_Label' && feature.properties_.name != undefined) {
				mgrsGrid5Km.styleProperty.label.getText().setText(featureProperty.name.toString());
				return mgrsGrid5Km.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return mgrsGrid5Km.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return mgrsGrid5Km.styleProperty.grid;
			}
		});
		window.map.addLayer(mgrsGrid5Km);
		window.mapLayerManager.addLayer('grid-sub-mgrs-5', false, mgrsGrid5Km);

		// MGRS Grid 1Km
		var mgrsGrid1Km = new ol.layer.VectorTile({
			source: new ol.source.VectorTile({
				format: new ol.format.MVT(),
				url: mapConfig.GRID_URL.mgrs1,
				minZoom: 1,
				maxZoom: 14,
			}),
			visible: false,
			minZoom: 1,
			maxZoom: 17,
		});
		mgrsGrid1Km.styleProperty = new GridStyle();
		mgrsGrid1Km.setStyle(function (feature, resolution) {
			var featureProperty = feature.properties_;
			if (mgrsGrid1Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.Label != undefined) {
				mgrsGrid1Km.styleProperty.label.getText().setText(featureProperty.Label.toString());
				return mgrsGrid1Km.styleProperty.label;
			} else if (mgrsGrid1Km.styleProperty.getLabelVisible() && feature.type_ == 'Point' && feature.properties_.layer == 'MGRS_20000_Label' && feature.properties_.name != undefined) {
				mgrsGrid1Km.styleProperty.label.getText().setText(featureProperty.name.toString());
				return mgrsGrid1Km.styleProperty.label;
			} else if (feature.type_ == 'Polygon') {
				return mgrsGrid1Km.styleProperty.grid;
			} else if (feature.type_ == 'LineString') {
				return mgrsGrid1Km.styleProperty.grid;
			}
		});
		window.map.addLayer(mgrsGrid1Km);
		window.mapLayerManager.addLayer('grid-sub-mgrs-1', false, mgrsGrid1Km);
	}

	// UI 이벤트 핸들링
	function mainHandler() {
		document.querySelectorAll('#toolbarcontainer a:not(#tools-calculation-viewshed)').forEach(function (elem) {
			elem.addEventListener('click', function () {
				window.viewShed.destroy();
			});
		});

		document.querySelectorAll('.toolbar').forEach(function (elem) {
			elem.addEventListener('mousewheel', function (e) {
				var wheelDelta = e.wheelDelta;
				elem.scrollLeft += -wheelDelta;
			});
		})

		document.querySelectorAll('.tab-controller li').forEach(function (elem) {
			elem.addEventListener('click', function () {
				var tabName = elem.getAttribute('data-tab');
				siblings(document.querySelector('.' + tabName)).forEach(function (sElem) {
					sElem.style.display = 'none';
					sElem.classList.remove('selected');
				})
				document.querySelector('.' + tabName).style.display = 'block';
				elem.classList.add('selected');
			});
		})

		// 좌측 사이드 메뉴를 열고 닫는다.
		$('#sidemenu-controller-fold-button').on('click', function (params) {
			var DURATION = 500;

			var menuLeft = 1 * $('#sidemenu').css('left').replace('px', '');
			if (menuLeft != -280) if (menuLeft != 0) return;
			menuLeft = Math.abs(menuLeft);
			var width = $('#sidemenu-controller-fold-button').width();
			$('#sub-toolbar')
				.stop()
				.animate({ left: menuLeft + width + 'px' }, DURATION);
			$('#d2map-coord-bottom')
				.stop()
				.animate({ left: menuLeft + 10 + 'px' }, DURATION);
			$('#sub-toolbar > div')
				.stop()
				.animate({ width: window.innerWidth - (menuLeft + width) }, DURATION);
			menuLeft = menuLeft == 0 ? -280 : 0;
			$('#sidemenu')
				.stop()
				.animate({ left: menuLeft + 'px' }, DURATION);

			$(this).toggleClass('pin-on');
			$(this).toggleClass('pin-off');
		});

		// 사이드바 - SelectBox
		$('#sidemenu-controller-select').on('change', function () {
			var val = $(this).val();
			$('#sidemenu-container > div').hide();
			$('#sidemenu-' + val).show();
		});
	}

	// 툴바 요소 초기화
	function initToolbarElement() {
		// 서브 툴바 width 설정
		$('#sub-toolbar > div').css({ width: window.innerWidth - 300 });
		$(window).resize(function () {
			var toolbarLeft = $('#sub-toolbar').css('left').replace('px', '') * 1;
			$('#sub-toolbar > div').width(window.innerWidth - toolbarLeft);

			var enablePopup = $('.ui-popup:visible');
			if (enablePopup.length > 0) {
				var popupLeft = enablePopup.css('left').replace('px', '') * 1;
				var popupWidth = enablePopup.width();
				if (popupLeft > window.innerWidth - popupWidth)
					enablePopup.css('left', window.innerWidth - popupWidth);

				var popupTop = enablePopup.css('top').replace('px', '') * 1;
				var popupHeight = enablePopup.height();
				if (popupTop > window.innerHeight - popupHeight)
					enablePopup.css('top', window.innerHeight - popupHeight);
			}
		});

		// 아이콘 이미지 소스 지정
		var icons = document.querySelectorAll('#toolbarcontainer a');
		var length = icons.length;
		var style = document.createElement('style');
		document.head.appendChild(style);
		var sheet = style.sheet;

		for (var i = 0; i < length; i++) {
			var id = icons[i].id;
			if (id == '') break;
			var img = id.replace('tools-', '');
			if (img == 'calculation-distunit' || img == 'calculation-areaunit') continue;
			sheet.addRule('#' + id, 'background-image :url(./src/image/icons/' + img + '.png)');
			sheet.addRule('#' + id + ':hover', 'background-image : url(./src/image/icons/' + img + '-hover.png)');
			sheet.addRule('#' + id + '.toggle', 'background-image : url(./src/image/icons/' + img + '-on.png)');
		}
	}

	// MVT 스타일 생성
	function setupMapStyle() {
		// 세계 경계 스타일
		boundaryStyle = {
			geometry: new ol.style.Style({
				fill: new ol.style.Fill({
					color: [255, 0, 0, 1.0],
				}),
				stroke: new ol.style.Stroke({
					color: [200, 200, 200, 0.7],
					width: 2,
				}),
			}),
			label: new ol.style.Style({
				text: new ol.style.Text({
					scale: 1.0,
					fill: new ol.style.Fill({
						color: '#ffffff',
					}),
					stroke: new ol.style.Stroke({
						color: '#000000',
						width: 3,
					}),
				}),
			})
		};
	}

	// 세계 경계 스타일 반환
	function getBoundaryStyle (feature, resolution) {
		switch (feature.get('layer')) {
			case 'label':
				if (boundaryStyle.label.getText() != undefined)
					boundaryStyle.label.getText().setText(feature.properties_.Name);
				return boundaryStyle.label;
			case 'boundary':
				return boundaryStyle.geometry;
			default:
				return null;
		}
	}

	// 지도 리스트 생성
	function insertMapListHTML() {
		var layerList = document.getElementById("sidemenu-layer-list");
		for (var i = 0; i < mapConfig.MapList.length; i++ ) {
			var liNode = document.createElement("li");
			var checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.id = "layer-toggleBtn-" + mapConfig.MapList[i].id;
			checkbox.name = "layer-toggleBtn-" + mapConfig.MapList[i].id;
			checkbox.className = 'layer-toggleBtn';
			checkbox.checked = mapConfig.MapList[i].visible;
			var label = document.createElement('label')
			label.htmlFor = "layer-toggleBtn-" + mapConfig.MapList[i].id;
			label.appendChild(document.createTextNode(mapConfig.MapList[i].name));
			liNode.appendChild(checkbox);
			liNode.appendChild(label);
			layerList.appendChild(liNode);
		}
	}

	// 지도 레이어 설정
	function setupMapLayer() {

		// overView 용 지도
		var overViewWorldLayer = new ol.layer.Tile({
			source: new ol.source.XYZ({
				url: mapConfig.BaseMap.url,
				crossOrigin: 'Anonymous',
				maxZoom: 10,
				minZoom: 0,
			}),
			preload: Infinity,
			opacity: 1.0,
			visible: true,
		});
		window.mapLayerManager.addLayer('layer-sub-world', true, overViewWorldLayer);

		// FDB 심볼 이미지 경로 설정
		mapLayerManager.addMVTSymbolPath('MVTSymbolPath', mapConfig.MVTSymbolPath);


		// 지도 추가 - mapList.js에 mapConfig.mapList 배열로 지도를 추가한다.
		for (var i = mapConfig.MapList.length -1; i >= 0; i-- ) {
			var MapList = mapConfig.MapList[i];
			var layer;
			var id = 'layer-sub-' + MapList.id;

			// MVT 레이어 추가
			if (MapList.type == 'mvt') {
				layer = new ol.layer.VectorTile({
					source: new ol.source.VectorTile({
						format: new ol.format.MVT(),
						url: MapList.url,
						minZoom: MapList.minZoom,
						maxZoom: MapList.maxZoom,
						cacheSize: MapList.cacheSize? MapList.cacheSize : 16,
					}),
					minZoom: MapList.layerMinZoom? MapList.layerMinZoom : undefined,
					maxZoom: MapList.layerMaxZoom? MapList.layerMaxZoom : undefined,
					opacity: MapList.opacity? MapList.opacity : 1.0,
					visible: MapList.visible? MapList.visible : false,
					extent: MapList.extent? MapList.extent : undefined,
					renderMode: MapList.renderMode? MapList.renderMode : "hybrid",
				});

				map.addLayer(layer);
				window.mapLayerManager.addLayer(id, false, layer);
				window.mapLayerManager.addMVTLayer(id, MapList.mvtStyle, false, layer);

				if (MapList.subLayer) {
					let subInfo = MapList.subLayer;
					var subID = 'layer-sub-' + subInfo.id;
					let subLayer = new ol.layer.Tile({
						source: new ol.source.XYZ({
							crossOrigin: 'Anonymous',
							url: subInfo.url,
							minZoom: subInfo.minZoom,
							maxZoom: subInfo.maxZoom,
						}),
						minZoom: subInfo.layerMinZoom? subInfo.layerMinZoom : undefined,
						maxZoom: subInfo.layerMaxZoom? subInfo.layerMaxZoom : undefined,
						opacity: subInfo.opacity? subInfo.opacity : 1.0,
						visible: subInfo.visible? subInfo.visible : false,
						extent: subInfo.extent? subInfo.extent : undefined,
					});
					map.addLayer(subLayer);
					window.mapLayerManager.addLayer(subID, false, subLayer);
				}

				// 세계 경계레이어 가 있을 경우에만 아래 코드 추가
				if (MapList.styleFunc) {
					if (MapList.styleFunc == "getBoundaryStyle")
						layer.setStyle(getBoundaryStyle);
				}
			}

			// TMS 레이어 추가
			else if (MapList.type == 'tms') {
				layer = new ol.layer.Tile({
					source: new ol.source.XYZ({
						crossOrigin: 'Anonymous',
						url: MapList.url,
						minZoom: MapList.minZoom,
						maxZoom: MapList.maxZoom,
					}),
					minZoom: MapList.layerMinZoom? MapList.layerMinZoom : undefined,
					maxZoom: MapList.layerMaxZoom? MapList.layerMaxZoom : undefined,
					opacity: MapList.opacity? MapList.opacity : 1.0,
					visible: MapList.visible? MapList.visible : false,
					extent: MapList.extent? MapList.extent : undefined,
				});
				map.addLayer(layer);
				window.mapLayerManager.addLayer(id, false, layer);
			}

			// MapBox 레이어 추가
			else if (MapList.type == 'mapBoxStyle') {
				layer = new ol.layer.VectorTile({
					declutter: true,
					opacity: MapList.opacity? MapList.opacity : 1.0,
					visible: MapList.visible,
				});
				map.addLayer(layer);
				window.mapLayerManager.addLayer(id, false, layer);
				window.D2.Core.ol.mapBoxStyle.applyStyle(layer, MapList.url);
			}
		}

		// OverView 생성 (min, max label, clickMove)
		window.mapLayerManager.createOverview(0, 3, true);
	}

	// 서버 타입 반환
	function getServerType() {
		if (sessionStorage.getItem("setting") !== null) {
			if (sessionStorage.getItem("setting") === serverList[0]) {
				document.getElementById('btn-local').classList.toggle('toggle');
				document.getElementById('btn-server').classList.remove('toggle');
			} else {
				document.getElementById('btn-server').classList.toggle('toggle');
				document.getElementById('btn-local').classList.remove('toggle');
			}
		} else {
			sessionStorage.setItem("setting", serverList[1]);
			document.getElementById('btn-server').classList.toggle('toggle');
			document.getElementById('btn-local').classList.remove('toggle');
		}
		mapServerType = sessionStorage.getItem("setting") === null ? serverList[1] : sessionStorage.getItem("setting");

		if (mapServerType == serverList[1])
			mapConfig = mapConfigServer;
		else
			mapConfig = mapConfigLocal;
	}

})();