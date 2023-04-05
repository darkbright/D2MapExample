// 사이드 메뉴 - mvt layer
async function initSidebarMVTLayer() {
	// mvt tree
	var layer = window.mapLayerManager.getMVTLayer('layer-sub-mvtG25K');
	const targetID = 'd2map_mvtTree';
	var MVTLayerTreeUI = new D2.Core.MVTLayerUI(targetID);

	var paramObj = {};
	$('.layer-toggleBtn').on('change', function (e) {
		var layerVisible = $(this).is(':checked');
		var layerName = $(this).attr('id').replace('layer-toggleBtn-', '');
		paramObj.layerName = layerName;
		paramObj.visible = layerVisible;

		if (paramObj.visible) FDBVisibleTreeUI(); // 지도가 변경되었을 경우 트리의 상태를 변경한다.
	});

	const FDBVisibleTreeUI = () => {
		var layer = mapConfig.MapList.find(element => element.id == paramObj.layerName);
		if (layer) {
			var MVTlayer = window.mapLayerManager.getMVTLayer('layer-sub-'+ paramObj.layerName);
			if (MVTlayer && layer.mvtTree) {
				MVTLayerTreeUI.setMVTLayer(MVTlayer);
				MVTLayerTreeUI.importFromUrl(layer.mvtTree);
			}
		}
	};

	$('#mvt-export').click(function () {
		let formattedJson = MVTLayerTreeUI.exportJson();
		console.log('export: string type', formattedJson);
		D2.Core.GraphicUtil.download(formattedJson, 'MVT_Layer_Tree.json', 'text/plain');
		//visible 정보
		//console.log(layer.visibleLayer._source);
	});

	$('#mvt-import').click(function () {
		let input = document.createElement("input");
		input.type = "file";
		input.id = "mvt-import_file";
		input.accept = "text/xml,.json";
		document.getElementById("mvt-import-input").appendChild(input);
		document.getElementById("mvt-import_file").click();
		input.onchange = function () {
			let importFile = input.files;

			if (importFile.length === 0) return;
			let reader = new FileReader();
			reader.onload = function (e) {

				if (importFile[0].name.substring(importFile[0].name.lastIndexOf('.') + 1) == 'json')
					MVTLayerTreeUI.importJson(e.target.result);
				else
					MVTLayerTreeUI.importXML(e.target.result);
				document.getElementById("mvt-import-input").removeChild(input);
				console.log('import: string type', e.target.result);
			}
			reader.readAsText(importFile[0]);
		}
	});

	$('#mvt-json-import').click(function () {
		let json = MVTLayerTreeUI.layerDataToJson();
		console.log('레이어,목록,source,visibility 반환:', json);
	});

	$('#mvt-zindex-reverse').click(function () {
		let layerOrderList = layer.getLayerOrderList();
		// layerOrderList 배열의 순서를 조절하여 레이어 순서를 조절한다.
		console.log(layerOrderList);
		var reverseLayerOrderList = [...layerOrderList].reverse(); // 원본 배열 복사해서 사용
		layer.setLayerOrderList(reverseLayerOrderList);
		MVTLayerTreeUI.changeOlLayer();
	});

	$('#mvt-zindex-clear').click(function () {
		layer.mvtStyle.importStyle();
	});

	$(document).on('click', '#layer-sub-mvt-featureinfo', function () {
		window.eventManager.setMapMode('mapAnalysis');
		if (layer) {
			layer.featureInfo(function (feature) {
				console.log(feature.getProperties());
			});
		}
	});

	$(document).on('click', '#layer-sub-mvt-featureclear', function () {
		window.eventManager.setMapMode('default');
	});

	var selectFeatures = {};
	var selectIndex = 0;
	document.querySelector('#layer-sub-mvt-featureanalysis').addEventListener('click', function () {
		window.eventManager.setMapMode('mapAnalysis');
		let featureAnalysis = document.querySelector('#layer-sub-mvt-featureanalysis').value;
		if (featureAnalysis === '-') return;
		if (layer) {
			//picking 된 source만 가져오기
			let pickingSource = [];
			const treeObj = window.ICOPS.TreeView.getTreeObject('d2map_mvtTree');
			const node = treeObj.getSelectedNodes();
			//console.log("picking target:", nodes);
			const forEachChildren = (array) => { // tree->folder를 클릭했을 때
				if (array == undefined)
					return;
				for (let i = 0; i < array.length; i++) {
					if (array[i].type.toLowerCase() === "layer" && array[i].source !== undefined) {
						if (array[i].source.split(',').length > 1) {
							for (let value of array[i].source.split(',')) {
								pickingSource.push(value);
							}
						} else {
							pickingSource.push(array[i].source);
						}
					} else {
						forEachChildren(array[i].children);
					}
				}
			};

			const getSource = (obj) => { // tree->file을 클릭했을 때
				if (obj.type === "layer" && obj.source !== undefined) {
					if (obj.source.split(',').length > 1) {
						for (let value of obj.source.split(',')) {
							pickingSource.push(value);
						}
					} else {
						pickingSource.push(obj.source);
					}
				}
			};
			if (node.length == 0) {
				console.info("트리에서 체크 표시된 폴더 또는 파일을 선택해주세요.");
				document.querySelector('#layer-sub-mvt-featureanalysis').value = '-';
				return;
			};

			const data = treeObj.getNodeData(node[0]);

			if (treeObj.getCheck(node[0]) === true) data.type.toLowerCase() === "group" ? forEachChildren(data.children) : getSource(data);
			pickingSource = new Set(pickingSource); // 배열 중복 값 제거
			pickingSource = [...pickingSource];

			if (pickingSource.length === 0) {
				console.info("트리에서 체크 표시된 폴더 또는 파일을 선택해주세요.");
				document.querySelector('#layer-sub-mvt-featureanalysis').value = '-';
				return;
			};

			layer.featureAnalysis(featureAnalysis, pickingSource, function (features) {
				console.log(features.length);
				if (features.length > 0) {
					layer.setSelectFeature(features[0]);
					console.log(features[0].getProperties());
					selectFeatures = features;
	 				selectIndex = 0;
				}
			});
		}
	});

	$(document).on('click', '#layer-sub-mvt-featurenext', function () {
		if (selectFeatures.length > 0) {
			if (selectFeatures.length == selectIndex)
				selectIndex = 0;

			layer.setSelectFeature(selectFeatures[selectIndex++]);
		}
	});

	$(document).on('click', '#mvt-style-export', function () {
		const result = layer.mvtStyle.exportStyle();
		console.log('export style JSON 반환:', JSON.stringify(result, null, 4));
		D2.Core.GraphicUtil.download(JSON.stringify(result, null, 4), 'MVTStyle.json', 'text/plain');
	});

	$(document).on('click', '#mvt-style-import', function () {
		let input = document.createElement("input");
		input.type = "file";
		input.id = "mvt-style-import_file";
		input.accept = "application/JSON";
		document.getElementById("mvt-style-import-input").appendChild(input);
		document.getElementById("mvt-style-import_file").click();
		input.onchange = function () {
			let importFile = input.files;
			let reader = new FileReader();
			reader.onload = function (e) {
				layer.mvtStyle.importStyle(JSON.parse(e.target.result));
				console.log(JSON.parse(e.target.result))
				console.log(e.target.result)
				document.getElementById("mvt-style-import-input").removeChild(input);
				console.log('import style JSON 반환:', e.target.result);
			}
			reader.readAsText(importFile[0]);
		}
	});

	var copyOriginal
	$(document).on('click', '#wb-style', function () {
		if ($('#layer-toggleBtn-background').prop("checked")) {
			var styleObj = {};
			const getColor = (firstLayer) => {
				if (firstLayer.stroke !== undefined) {
					return firstLayer.stroke.color
				} else if (firstLayer.fill !== undefined) {
					return firstLayer.fill.color
				} else if (firstLayer.text !== undefined) {
					return firstLayer.text.fill.color
				}
			}

			window.mapLayerManager.mapMVTLayers["layer-sub-background"].mvtStyle.originalStyleObject.style.forEach((obj) => {
				if (obj.source === "background") {
					styleObj[obj.source] = { defaultColor: getColor(obj.layer[0]), name: "background" };
				} else {
					styleObj[obj.source] = { defaultColor: getColor(obj.layer[0]), name: obj.name };
				}
			})

			console.log('Style Info:', styleObj);

			const result = layer.mvtStyle.exportStyle();
			copyOriginal = result; // 원본 스타일 복사 -> 초기화 할때 사용.

			changeStyle("boundary", "rgba(229, 173, 233, 1)");
			changeStyle("lap030_8", styleObj.lap030_8.defaultColor);
			changeStyle("lap030_7", styleObj.lap030_7.defaultColor);
			changeStyle("lap030_1", styleObj.lap030_1.defaultColor);
			changeStyle("sudo001", "rgba(241, 153, 22, 1)");
			changeStyle("sudo002", "rgba(235, 228, 41, 1)");
		} else {
			console.warn("배경 지도(COP)만 사용가능한 기능입니다.")
		}
	});


	const changeStyle = (targetSource, defaultColor) => {
		const changedStyleResult = layer.mvtStyle.exportStyle();
		const newResult = { style: JSON.parse(JSON.stringify(changedStyleResult.style)) };

		newResult.style.forEach((obj) => {
			if (obj.source === targetSource) {
				if (obj.source === targetSource) {
					for (let i = 0; i < obj.layer.length; i++) {
						if (obj.layer[i].fill !== undefined) {
							obj.layer[i].fill.color = defaultColor;
						} else if (obj.layer[i].stroke !== undefined) {
							obj.layer[i].stroke.color = defaultColor;
						} else if (obj.layer[i].image !== undefined) {
							obj.layer[i].image.fill.color = defaultColor;
						} else if (obj.layer[i].text !== undefined) {
							obj.layer[i].text.fill.color = defaultColor;
						}
					}
				}
			}
		});

		layer.mvtStyle.importStyle(newResult);
	}

	$(document).on('click', "#wb-style-clear", function () {
		$.ajax({
			// KJCCS, AKJCCS 서버 경로 세팅 필요
			//url: 'https://100.100.100.12:28081/MVTCONF/worldCOP_Style.json',
			url: urlInfo.mvtStyle.background,
			success: function (data) {
				layer.mvtStyle.importStyle(data);
			},
			fail: function (xhr, status, errorThrown) {
				console.error(`오류명 ${errorThrown}, 상태 ${status}`);
			}
		});

	});
}

