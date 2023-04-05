$(function () {
    // Cross section Popup close 버튼 클릭
	$(document).on('click', '.d2map_selected-cs-close', function () {
		window.crossSection.destroy();
		window.eventManager.setMapMode('default');
        window.eventManager.setCursor('Default');
        $('#tools-calculation-crosschart').removeClass();
	});
});