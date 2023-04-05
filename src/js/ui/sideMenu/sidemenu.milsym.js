// 사이드 메뉴 - 상황도 구성
async function initSidebarMilSym() {
	var milSymExample = milSymLayerSample(window.map);

	let postIconStyle = new ol.style.Style({
		image: new ol.style.Icon({
			anchor: [0.5, 0.5],
			scale: 0.5,
			//II 등급
			src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAAFzCAMAAAAQdvWKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP8AABv/jSIAAAABdFJOUwBA5thmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAJVklEQVR4Xu3PMY4YSQwEwb3/f1pO2AlBxTNG6rCTBfDneZ7nf/ffX8p778HP8t578LO89x78LO+9Bz/Le+/Bz/Lee/CzvPce/CzvvQc/y3vvwc/y3nvws7z3Hvws770HP8t778HP8t4/8OBvcNK0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa054x27Qra017xmzTrqw17RmzTbuy1rRnzDbtylrTnjHbtCtrTXvGbNOurDXtGbNNu7LWtGfMNu3KWtOeMdu0K2tNe8Zs066sNe0Zs027sta0Z8w27cpa0/4eN38d770HP8t778HP8t578LO89x78LO+9Bz/Le+/Bz/Lee/CzvPce/CzvvQc/y3vvwc/y3nvws7z3Hvws770HP8t7/8CDz/M8zx/5+fkFRfOHISPO4F8AAAAASUVORK5CYII='
		})
	});

	//III 등급
	/*let postIconStyle = new ol.style.Style({
		image: new ol.style.Icon({                
			anchor: [0.5, 0.5],
			scale: 0.5,			
			//II 등급
			src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAFtCAMAAAC6K7avAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAAP8AABv/jSIAAAABdFJOUwBA5thmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAANlElEQVR4Xu3QMW4cQAwEwfP/P62k4sZpQAgOtuLmBPw8z9/69/zKe9vkvW3y3jZ5b5u8t03e2ybvbZP3tsl72+S9bfLeNnlvm7y3Td7bJu9tk/e2yXvb5L1t8t42eW+bvLdN3tsm722T97bJe9vkvW3y3jbxti84aNqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2mPGG3ajY2m3dho2iNGm3Zjo2k3Npr2iNGm3dho2o2Npj1itGk3Npp2Y6Npjxht2o2Npt3YaNojRpt2Y6NpNzaa9ojRpt3YaNqNjaY9YrRpNzaadmOjaY8YbdqNjabd2GjaI0abdmOjaTc2mvaI0abd2GjajY2mPWK0aTc2mnZjo2m/4eL50nvb5L1t8t42eW+bvLdN3tsm722T97bJe9vkvW3y3jZ5b5u8t03e2ybvbZP3tsl72+S9bfLeNnlvm7y3Td7bJu9tk/e2yXvb5L1t8t428bbnef5Xn88PbkDGUdaUkHUAAAAASUVORK5CYII='
		})
	});*/

	postIconStyle.getImage().load();

	// 아이콘 투명도 조절
	postIconStyle.getImage().setOpacity(0.6);

	milSymExample.then(function (obj) {
		$('#load-milSym').on('click', function () {
			obj.loadData();
		});

		$('#deleate-milSym').on('click', function () {
			obj.removeAll();
		});

		$('#milSym-popup-toggle').on('change', function () {
			var isChecked = $(this).is(':checked')
			obj.enableTooltip(isChecked);
		});

		$('#hide-milSym').on('click', function () {
			obj.setVisibleMilSym(false);
		});

		$('#show-milSym').on('click', function () {
			obj.setVisibleMilSym(true);
		});

		$('#selectContinuity-milSym').on('change', function () {
			obj.trackerClear();
		});

		$('#selectRectangle-milSym').on('click', function () {
			var isChecked = $('#selectContinuity-milSym').is(':checked')
			obj.selectFeature('rectangle', isChecked);
		});

		$('#selectCircle-milSym').on('click', function () {
			var isChecked = $('#selectContinuity-milSym').is(':checked')
			obj.selectFeature('circle', isChecked);
		});

		// 상세정보 종료 버튼 클릭
		$(document).on('click', '.d2map_selected-mi-close', function () {
			$('.d2map_selected-mi').css('display', 'none');
		});

		//OL 기반 Point 객체 생성 예제
		$('#create-point-milSym').on('click', function () {
			obj.createPointMilSym();
		});

		//OL 기반 Polyline 객체 생성 예제
		$('#create-polyline-milSym').on('click', function () {
			obj.createPolylineMilSym();
		});

		//OL 기반 Polygon 객체 생성 예제
		$('#create-polygon-milSym').on('click', function () {
			obj.createPolygonMilSym();
		});

		//OL 기반 Circle 객체 생성 예제
		$('#create-circle-milSym').on('click', function () {
			obj.createCircleMilSym();
		});

		//OL 기반 능력도 객체 생성 예제
		$('#create-capacity-milSym').on('click', function () {
			obj.createCapacityMilSym();
		});

		//OL 기반 비정형 군대부호 객체 생성 예제
		$('#create-tactical-milSym').on('click', function () {
			obj.createTacticalLineGraphics();
		});

		//OL 기반 Ellipse 객체 생성 예제
		$('#create-ellipse-milSym').on('click', function () {
			obj.createEllipseMilSym();
		});

		//OL 기반 Ellipse 객체 생성 예제(중심좌표, 장축, 단축표시)
		$('#create-ellipse-milSym-ex').on('click', function () {
			obj.createEllipseMilSymEx();
		});

		//OL 기반 사각형 객체 생성 예제-2(중심좌표, 장축, 단축표시)
		$('#create-rectangle-milSym').on('click', function () {
			obj.createRectangleMilSym();
		});

		//OL 기반 이미지 표시(x축, y축)
		$('#create-image-milSym').on('click', function () {
			obj.createImage();
		});

		//폴리라인 기반 등간격 좌표 추출
		$('#create-polyline-extract-coordinate').on('click', function () {
			obj.createPolylineExtractCoordinate();
		});

		//군대부호명, sidc 검색
		$('#d2map_milsymbol-sub-explorer-search').keyup(function (event) {
			const keyCode = event.charCode || event.keyCode || false;
			const treeObject = window.ICOPS.TreeView.getTreeObject('d2map_tree-container');
			const keywords = event.target.value.toLowerCase();
			if (keyCode == 13) {
				if (keywords.trim() === "") return;

				treeObject.collapseAll();
				var nodes = document.querySelector('#d2map_tree-container').querySelectorAll('.tree-leaf-content');
				nodes.forEach(element => {
					var data, lang, result;
					data = element.dataset.item;
					data = JSON.parse(data);
					result = false;
					lang = localStorage.getItem('lang') == 'ko' ? 'name' : 'eName';

					element.classList.remove('tree-node-highlight');

					if (data[lang].toLowerCase().indexOf(keywords) > -1) {
						// 군대부호 이름으로 검색
						result = true;
					} else {
						// 군대부호 코드로 검색
						var newQuery = getQuery(keywords);
						var newDataCode = getQuery(data['cd'].toLowerCase());
						if (newDataCode.indexOf(newQuery) > -1)
							result = true;
					}

					if (result) {
						element.classList.add('tree-node-highlight');
						treeObject.expandAll(element);
					}
				});
			}

			function getQuery(cd) {
				cd = cd.replaceAll('*', '-');
				return cd.substr(0, 1) + '-' + cd.substr(2);
			}
		});


		$('#postRender-toggle').on('change', function () {
			var isChecked = $(this).is(':checked')
			if (isChecked) {
				window.postComposeCtrl.setRenderCallBack(function (vectorContext, width, height, ratio) {
					// 아래의 코드는 지도가 변경될때마다 호출되므로 불필요한 (스타일 생성 등) 작업을 최소화 하여야 한다.
					let cx, cy, ct;
					// 화면 좌표 중점을 계산한다.					
					cx = width / (2 * ratio);
					cy = height / (2 * ratio);
					// 화면 좌표 중점의 지리좌표를 구하고 렌더링한다.
					ct = window.map.getCoordinateFromPixel([cx, cy]);
					vectorContext.setStyle(postIconStyle);
					vectorContext.drawGeometry(new ol.geom.Point(ct));
				});
			} else
				window.postComposeCtrl.setRenderCallBack(null);
		});

		//군대부호 코드 입력시 유형 알아보기
		$('#create-milSym-Type').on('click', function () {
			obj.getMilsymbolType();
		});

		// ~ 22.11.08 추가
		// 군대부호 중첩 객체 생성
		document.querySelector('#create-overlapObject').addEventListener('click', function () {
			obj.createOverlapObject();
		});

		// 군대부호 중첩 객체 선택
		document.querySelector('#select-overlapObject').addEventListener('click', function () {
			obj.selectOverlapObject();
		});
		// ~
	});
}