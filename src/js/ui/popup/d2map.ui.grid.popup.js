// grid 스타일 설정
$(function () {
    const gridStyleFunction = (target) => {
        var cid = target.split('-')[1];
        var layerVisible = $('#grid-' + cid).is(':checked')
        var labelVisible = $('#grid-' + cid + '-label').is(':checked');      
        var layerColor = $('#grid-' + cid + '-color').val() || '#ffffff';
        var layerWidth = $('#grid-' + cid + '-width').val() || 1;
        var layerDistance = $('#grid-' + cid + '-distance').val();
        var gridLayer = mapLayerManager.getLayer('grid-sub-' + cid);
        if (gridLayer) {
            gridLayer.setVisible(layerVisible);
            gridLayer.styleProperty.setLabelVisible(labelVisible);    
            gridLayer.styleProperty.setGridColor(layerColor);
            gridLayer.styleProperty.setLabelColor(layerColor);
            gridLayer.styleProperty.setGridWidth(layerWidth);
            if (layerDistance != undefined) gridLayer.styleProperty.setDistanceVisible(cid, layerVisible, layerDistance, layerColor, labelVisible, layerWidth);
            gridLayer.changed();
        }
    }

    $('.grid-option input').on('change', function (e) {
        gridStyleFunction(e.target.id)
    });

    $('.grid-option select').on('change', function (e) {
        gridStyleFunction(e.target.id)
    });
});