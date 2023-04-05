const SERVER_URL_HEADER = 'https://d2map.com:7443';
const LOCAL_URL_HEADER = 'https://d2map.com:7443';

var mapConfig = {}

var mapConfigServer = {
    ViewMaxZoom: 17,
    BaseMap: {
        url: SERVER_URL_HEADER + '/TARTMS/World_TMS/{z}/{x}/{-y}.png',
        minZoom: 0,
		maxZoom: 10
    },
    MapList: [
        // cop
        {
            id: "cop",
            name: "COP 지도",
            type: "mvt",
            url: SERVER_URL_HEADER + '/TARTMS/COP_MVT/L{z}/{y}/{x}.pbf',
            minZoom: 1,
			maxZoom: 10,
            visible: false,
            opacity: 0.9,
            mvtStyle: SERVER_URL_HEADER + '/MVTCONF/WorldCOP_STYLE.json',
            mvtTree: SERVER_URL_HEADER + '/MVTCONF/WorldCOP_Visibility.json',
            reverseVisible: "baseMap"
        },
        // arirang (K2)
        {
            id: "arirang",
            name: "위성 영상",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/Arirang_TMS/L{z}/{y}/{x}.png',
            minZoom: 0,
			maxZoom: 17,
            visible: false,
        },
        // 육도 100만
        {
            id: "land1m",
            name: "육도 100만",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/G1M_HILLSHADE_TMS/{z}/{x}/{-y}.png',
            minZoom: 0,
			maxZoom: 10,
            visible: false,
        },
        // 육도 50만
        {
            id: "land500k",
            name: "육도 50만",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/G500K_HILLSHADE_TMS/{z}/{x}/{-y}.png',
            minZoom: 0,
			maxZoom: 11,
            visible: false,
        },
        // 육도 25만
        {
            id: "land250k",
            name: "육도 25만",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/G250K_HILLSHADE_TMS/{z}/{x}/{-y}.png',
            minZoom: 0,
			maxZoom: 12,
            visible: false,
        },
        // 육도 10만
        {
            id: "land100kLayer",
            name: "육도 10만",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/G100K_HILLSHADE_TMS/{z}/{x}/{-y}.png',
            minZoom: 0,
			maxZoom: 13,
            visible: false,
        },
        // 육도 5만
        {
            id: "land50k",
            name: "육도 5만",
            type: "tms",
            url: SERVER_URL_HEADER + '/TARTMS/G50K_HILLSHADE_TMS/{z}/{x}/{-y}.png',
            minZoom: 0,
			maxZoom: 15,
            visible: false,
        }
    ],
    MVTSymbolPath: SERVER_URL_HEADER + '/MVTCONF/GSSSymbol/',
    D2MSPath: SERVER_URL_HEADER + '/D2MS/',
    GRAPHIC_StdXSD: SERVER_URL_HEADER + '/GRAPHIC/Overlay.xsd',
    DEMPath: SERVER_URL_HEADER + '/TarTerrain/Terrain_L16/',
    GT2Path: SERVER_URL_HEADER +  '/TARTMS/DEM_GT2/L{z}/{y}/{x}.gt2',
    GRID_URL : {
        gars: SERVER_URL_HEADER + '/TARTMS/GRID_GARS_MVT/L{z}/{y}/{x}.pbf',
        mgrs20: SERVER_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_20KM/L{z}/{y}/{x}.pbf',
        mgrs10: SERVER_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_10KM/L{z}/{y}/{x}.pbf',
        mgrs5: SERVER_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_5KM/L{z}/{y}/{x}.pbf',
        mgrs1: SERVER_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_1KM/L{z}/{y}/{x}.pbf',
        utm20: SERVER_URL_HEADER + '/TARTMS/GRID_UTM_MVT_20KM/L{z}/{y}/{x}.pbf',
        utm10: SERVER_URL_HEADER + '/TARTMS/GRID_UTM_MVT_10KM/L{z}/{y}/{x}.pbf',
        utm5: SERVER_URL_HEADER + '/TARTMS/GRID_UTM_MVT_5KM/L{z}/{y}/{x}.pbf',
        utm1: SERVER_URL_HEADER + '/TARTMS/GRID_UTM_MVT_1KM/L{z}/{y}/{x}.pbf',
        geographic: SERVER_URL_HEADER + '/TARTMS/GRID_Geographic_MVT/L{z}/{y}/{x}.pbf',
        georef: SERVER_URL_HEADER + '/TARTMS/GRID_GeoRef_MVT/L{z}/{y}/{x}.pbf',
        mgrs: SERVER_URL_HEADER + '/TARTMS/GRID_MGRS_MVT/L{z}/{y}/{x}.pbf'
    }
}

var mapConfigLocal = {
    ViewMaxZoom: 17,
    BaseMap: {
        url: LOCAL_URL_HEADER + '/TARTMS/World_TMS/{z}/{x}/{-y}.png',
        minZoom: 0,
		maxZoom: 10
    },
    MapList: [
        // world-boundary
        {
            id: "world-boundary",
            name: "세계 경계",
            type: "mvt",
            url: LOCAL_URL_HEADER + '/TARTMS/World_Boundary_MVT/L{z}/{y}/{x}.pbf',
            minZoom: 1,
			maxZoom: 10,
            visible: false,
            styleFunc: "getBoundaryStyle"
        },
        // cop
        {
            id: "cop",
            name: "COP 지도",
            type: "mvt",
            url: LOCAL_URL_HEADER + '/TARTMS/COP_MVT/L{z}/{y}/{x}.pbf',
            minZoom: 1,
			maxZoom: 10,
            visible: false,
            opacity: 0.9,
            mvtStyle: LOCAL_URL_HEADER + '/MVTCONF/WorldCOP_STYLE.json',
            mvtTree: LOCAL_URL_HEADER + '/MVTCONF/WorldCOP_Visibility.json',
            reverseVisible: "baseMap"
        }
    ],
    MVTSymbolPath: LOCAL_URL_HEADER + '/MVTCONF/GSSSymbol/',
    D2MSPath: SERVER_URL_HEADER + '/D2MS/',
    GRAPHIC_StdXSD: LOCAL_URL_HEADER + '/GRAPHIC/Overlay.xsd',
    DEMPath: LOCAL_URL_HEADER + '/tilesets/srtm/',
    GT2Path: LOCAL_URL_HEADER +  '/TARTMS/DEM_GT2/L{z}/{y}/{x}.gt2',
    GRID_URL : {
        gars: LOCAL_URL_HEADER + '/TARTMS/GRID_GARS_MVT/L{z}/{y}/{x}.pbf',
        mgrs20: LOCAL_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_20KM/L{z}/{y}/{x}.pbf',
        mgrs10: LOCAL_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_10KM/L{z}/{y}/{x}.pbf',
        mgrs5: LOCAL_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_5KM/L{z}/{y}/{x}.pbf',
        mgrs1: LOCAL_URL_HEADER + '/TARTMS/GRID_MGRS_MVT_1KM/L{z}/{y}/{x}.pbf',
        utm20: LOCAL_URL_HEADER + '/TARTMS/GRID_UTM_MVT_20KM/L{z}/{y}/{x}.pbf',
        utm10: LOCAL_URL_HEADER + '/TARTMS/GRID_UTM_MVT_10KM/L{z}/{y}/{x}.pbf',
        utm5: LOCAL_URL_HEADER + '/TARTMS/GRID_UTM_MVT_5KM/L{z}/{y}/{x}.pbf',
        utm1: LOCAL_URL_HEADER + '/TARTMS/GRID_UTM_MVT_1KM/L{z}/{y}/{x}.pbf',
        geographic: LOCAL_URL_HEADER + '/TARTMS/GRID_Geographic_MVT/L{z}/{y}/{x}.pbf',
        georef: LOCAL_URL_HEADER + '/TARTMS/GRID_GeoRef_MVT/L{z}/{y}/{x}.pbf',
        mgrs: LOCAL_URL_HEADER + '/TARTMS/GRID_MGRS_MVT/L{z}/{y}/{x}.pbf'
    }
}