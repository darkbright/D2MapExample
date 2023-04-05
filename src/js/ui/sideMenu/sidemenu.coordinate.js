// 사이드 메뉴 - 좌표 변환
async function initSidebarCoordinate() {
    var CoordManager = D2.Core.CoordManager;
    window.CoordManager = CoordManager;    

    $('#geo2every').on('click', function () {

        var lon = parseFloat( $('#geographic-lon').val() );
        var lat = parseFloat( $('#geographic-lat').val() );

        updateCoordinate(lon, lat);
    });

    $('#geodms2geo').on('click', function () {

        var lon = $('#geographic-dms-lon').val();
        var lat = $('#geographic-dms-lat').val();

        //입력형식 : 126°07′23″E
        //입력형식 : 37°07′23″N
        //60진법 도분초 좌표를 10진법 Degree 좌표값을 변환한다.
        var result = window.CoordManager.DMS2Geo(lon, lat).split(',');

        $('#geographic-lon').val(result[0]); //Longitude(경도)
        $('#geographic-lat').val(result[1]); //Latitude(위도)
    });

    $('#utm2geo').on('click', function () {
        var zone = $('#utm-zone').val();
        var band = $('#utm-band').val();
        var easting = $('#utm-easting').val();
        var northing = $('#utm-northing').val();

        var utm2geo = window.CoordManager.UTM2Geo_Ex(zone, band, easting, northing); //경위도 좌표값으로 변환한다.
        $('#geographic-lon').val(utm2geo.lon);
        $('#geographic-lat').val(utm2geo.lat);
    });

    $('#mgrs2geo').on('click', function () {
        var mgrs = {
            zone: $('#mgrs-zone').val(),
            band: $('#mgrs-band').val(),
            e100k: $('#mgrs-sq').val().slice(0,1),
            n100k: $('#mgrs-sq').val().slice(1,2),
            easting: $('#mgrs-easting').val(),
            northing: $('#mgrs-northing').val()
        }
        
        var mgrs2geo = window.CoordManager.MGRS2Geo(mgrs); //위경도 좌표값으로 변환한다.
        $('#geographic-lon').val(mgrs2geo.lon);
        $('#geographic-lat').val(mgrs2geo.lat);
    });

    $('#georef2geo').on('click', function () {        
        var georefVal = $('#coord-georef').val().replace(/ /g,""); // 위경도 좌표값으로 변환한다.
        var georef2geo = window.CoordManager.GeoRef2Geo(georefVal);        
        var index = georef2geo.indexOf(' ');

        $('#geographic-lon').val(georef2geo.substr(0, index));
        $('#geographic-lat').val(georef2geo.substr(index+1, georef2geo.length));
    });

    $('#gars2geo').on('click', function () {
        var garsVal = $('#coord-gars').val();
        var gars2geo = window.CoordManager.GARS2Geo(garsVal); // 위경도 좌표값으로 변환한다.
        console.log(gars2geo);
        var lon = parseFloat(gars2geo.split(',')[0]);
        var lat = parseFloat(gars2geo.split(',')[1]);
        $('#geographic-lon').val(lon);
        $('#geographic-lat').val(lat);

        //GARS 좌표로 설정된 경위도 사각형 영역값을 계산한다.        
        var offset = 0;        
        if (garsVal.length == 5)
            offset = 0.25;
        else if (garsVal.length == 6)            
            offset = 0.125;
        else if (garsVal.length == 7)
            offset = 0.083333 * 0.5;

        var bound = { minX : lon - offset, maxY : lat + offset, maxX : lon + offset, minY : lat - offset };
        $('#coord-gars2geo-minx').val(bound.minX.toFixed(7));
        $('#coord-gars2geo-maxy').val(bound.maxY.toFixed(7));
        $('#coord-gars2geo-maxx').val(bound.maxX.toFixed(7));
        $('#coord-gars2geo-miny').val(bound.minY.toFixed(7));
    });

    $('#coord-target-distance-run').on('click', function () {
        //입력 좌표값을 기준으로 방위각과 거리만큼 떨어진 지점에 좌표값을 구한다.
        var lon = parseFloat( $('#geographic-lon').val() );
        var lat = parseFloat( $('#geographic-lat').val() );
        var bearing = parseFloat($('#coord-target-bearing').val());
        var distance = parseFloat($('#coord-target-distance').val());
        var targetPosition = getTargetCoordinate(lon, lat, bearing, distance);
        //console.log(bearing, distance, lon, lat, targetPosition);
        
        $('#coord-target-lon').val(targetPosition.lon);
        $('#coord-target-lat').val(targetPosition.lat);
    });

    
    $('#pointermove-coord-sub-cb').on('click', function () {
        var value = $('#pointermove-coord-sub-cb').is(':checked');
        
        // 마우스 이동 이벤트를 활성화/비활성화 한다. (mouseMove 함수 호출)
        // 사용이 끝난경우 un 함수를 호출하여 불필요한 부하를 방지한다.
        if (value == true)             
            window.map.on('pointermove', mouseMove); 
        else 
            window.map.un('pointermove', mouseMove); 
    });
};

function mouseMove(evt) {

    var coord = D2.Core.ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'); //Convert Google Mercator to WGS84
    var normalizeLon = ((coord[0] % 360) + 360) % 360; //경도값만 정규화 실시
    if (normalizeLon > 180)
        coord[0] = normalizeLon - 360;
    else
        coord[0] = normalizeLon;

    //현재 마우스 위치값 업데이트
    updateCoordinate(coord[0], coord[1]);
};

// 현재 마우스 위치 좌표값으로부터 경위도, UTM, MGRS, GeoRef, GARS 좌표값을 UI에 표출한다.
function updateCoordinate(lon, lat) {

    $('#geographic-lon').val(lon);
    $('#geographic-lat').val(lat);

    //경위도 좌표값을 도분초로 환산한다.
    var geo2dms = window.CoordManager.Geo2DMS(lon, lat);
    var geoDMS = geo2dms.toString('dms').split(',');

    $('#geographic-dms-lon').val(geoDMS[0]);//도분초로 환산한 경도값 표시
    $('#geographic-dms-lat').val(geoDMS[1]);//도분초로 환산한 위도값 표시

    var geo2utm = window.CoordManager.Geo2UTM_Ex(lon, lat);
    $('#utm-zone').val(geo2utm.zone);
    $('#utm-band').val(geo2utm.band);
    $('#utm-easting').val(geo2utm.easting);
    $('#utm-northing').val(geo2utm.northing);

    var geo2mgrs = window.CoordManager.Geo2MGRS(lon, lat);
    $('#mgrs-zone').val(geo2utm.zone);
    $('#mgrs-band').val(geo2utm.band);
    $('#mgrs-sq').val(geo2mgrs.e100k+geo2mgrs.n100k);
    $('#mgrs-easting').val(geo2mgrs.easting);
    $('#mgrs-northing').val(geo2mgrs.northing);

    //GeoRef과 GARS는 Lat, Lon 순서로 좌표값 입력 받음
    var geo2georef = window.CoordManager.Geo2GeoRef(lat, lon);            
    $('#coord-georef').val(geo2georef);            

    //GeoRef과 GARS는 Lat, Lon 순서로 좌표값 입력 받음
    var geo2gars = window.CoordManager.Geo2GARS(lat, lon, '5');
    $('#coord-gars').val(geo2gars);


    
};

/*
경위도 좌표값을 기준으로 거리와 방위각 만큼 떨어진 지점의 좌표를 구한다.
lon - 경도(degree)
lat - 위도(degree)
bearing - 방위각(degree)
distance - 거리(m)
return 목표 지점의 lon(경도), lat(위도)값을 리턴한다.
*/
function getTargetCoordinate(lon, lat, bearing, distance) {
    return window.spatialMath.destVincenty(lon, lat, bearing, distance);
}
