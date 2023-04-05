// 22.11.10 추가
// 좌표 표시 노출
var evtObject;

async function showCoordinate() {
    window.map.on('pointermove', pointerMoveHandler); //마우스 위치에 따른 좌표값 표시
    window.map.on('moveend', function () {
        pointerMoveHandler(evtObject);
    }); //지도 축척 표시
}

function pointerMoveHandler(evt) {
    if (evt === undefined) return;

    var olProj = ol.proj;
    evtObject = evt;
    var coord = olProj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); //Convert Google Mercator to WGS84
    var normalizeLon = ((coord[0] % 360) + 360) % 360; //경도값만 정규화 실시
    if (normalizeLon > 180)
        coord[0] = normalizeLon - 360;
    else
        coord[0] = normalizeLon;

    if (coord !== undefined) {
        var coordinateStr = '';
        var lonZone, latZone;

        var lon = coord[0];
        lon > 0 ? (lonZone = 'E') : (lonZone = 'W');
        var lat = coord[1];
        lat > 0 ? (latZone = 'N') : (latZone = 'S');

        var lonStr = Math.abs(lon).toFixed(6) + lonZone;
        var latStr = Math.abs(lat).toFixed(6) + latZone;
        var middleLine = ' | ';

        // 지도 축척 표시
        if (document.querySelector('input[id="d2map_coord-sub-scale"]').checked) {
            var value = 'Scale:' + window.spatialMath.getMapScale();
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }
        // Geographic 좌표계
        if (document.querySelector('input[id="d2map_coord-sub-geographic"]').checked) {
            var value = 'Geo:' + lonStr.slice(0) + ', ' + latStr.slice(0);
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-geographic-dms"]').checked) {
            var value = 'Geo:' + CoordManager.Geo2DMS(lon, lat);
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-utm"]').checked) {
            var geo2utm = CoordManager.Geo2UTM_Ex(lon, lat);
            var utmStr =
                String(geo2utm.zone) +
                String(geo2utm.band) +
                ' ' +
                String(parseInt(geo2utm.easting)) +
                ' ' +
                String(parseInt(geo2utm.northing));
            var value = 'UTM:' + utmStr;
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-mgrs"]').checked) {
            var geo2mgrs = CoordManager.Geo2MGRS(lon, lat);
            var value = 'MGRS:' + geo2mgrs;
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-georef"]').checked) {
            var value = 'GeoRef:' + CoordManager.Geo2GeoRef(lat, lon);
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-gars"]').checked) {
            var value = 'GARS:' + CoordManager.Geo2GARS(lat, lon, '5');
            if (!coordinateStr == '') value = middleLine + value;
            coordinateStr += value;
        }

        if (document.querySelector('input[id="d2map_coord-sub-elevation"]').checked) {
            const zoomLevel = parseInt(window.map.getView().getZoom());
            window.Coordinate.gt2Provider.getHeight(evt.coordinate[0], evt.coordinate[1], zoomLevel, function (height) {
                if (height) {
                    var value = 'Elev:' + (height).toFixed(1) + 'm';
                    if (!coordinateStr == '')
                        value = middleLine + value;
                    coordinateStr += value;
                }
                coordinateStr += window.distance.getDistance();
                coordinateStr += window.slopeDistance.getDistance();
                coordinateStr += window.area.getArea();
                document.getElementById(
                    'd2map-coord-bottom'
                ).innerHTML = coordinateStr;
            });
        } else {
            //값이 존재하면 추가한다.
            coordinateStr += window.distance.getDistance();
            coordinateStr += window.slopeDistance.getDistance();
            coordinateStr += window.area.getArea();

            document.getElementById(
                'd2map-coord-bottom'
            ).innerHTML = coordinateStr;
        }
    }
}
