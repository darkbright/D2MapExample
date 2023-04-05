function GridStyle() {
    this.distanceVisible = undefined;
    this.labelVisible = true;
    this.label = new ol.style.Style({
        text: new ol.style.Text({
            scale: 1.3,
            fill: new ol.style.Fill({
                color: '#ffffff',
            }),
            stroke: new ol.style.Stroke({
                color: '#000000',
                width: 2
            })
        })
    });

    this.grid = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#ffffff',
            width: 1
        }),
    });


    this.setGridColor = function (color) {
        this.grid.getStroke().setColor(color);
    }

    this.setLabelColor = function (color) {
        this.label.getText().getFill().setColor(color);
    }

    this.getGridColor = function () {
        return this.grid.getStroke().getColor();
    }

    this.getLabelColor = function () {
        return this.label.getText().getFill().getColor();
    }

    this.setGridWidth = function (width) {
        this.grid.getStroke().setWidth(width);
    }

    this.getLabelWidth = function () {
        return this.grid.getStroke().getWidth();
    }

    // 2021년12월8일패치 : setLabelVisible, getLabelVisible 함수 추가
    this.setLabelVisible = function (labelVisible) {
        this.labelVisible = labelVisible;
    }

    this.getLabelVisible = function () {
        return this.labelVisible;
    }

    this.setDistanceVisible = function (cid, layerVisible, currentDistanceVisible, color, labelVisible, width) {
        if (this.distanceVisible != undefined) {
            if (this.distanceVisible == '20') {
                mapLayerManager.mapLayers[`grid-sub-${cid}`].setVisible(false)
            } else {
                mapLayerManager.mapLayers[`grid-sub-${cid}-${this.distanceVisible}`].setVisible(false) 
            }
        }
        
        this.distanceVisible = currentDistanceVisible;
        var gridDistanceLayer = (this.distanceVisible == '20' ? mapLayerManager.getLayer(`grid-sub-${cid}`) : mapLayerManager.getLayer(`grid-sub-${cid}-${this.distanceVisible}`));
        gridDistanceLayer.setVisible(layerVisible);
        gridDistanceLayer.styleProperty.setLabelVisible(labelVisible);
        gridDistanceLayer.styleProperty.setGridColor(color);
        gridDistanceLayer.styleProperty.setLabelColor(color);
        gridDistanceLayer.styleProperty.setGridWidth(width);
        gridDistanceLayer.changed();
    }
}