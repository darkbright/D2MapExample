const URL_HEADER = 'https://d2map.com:7443';

var map3DConfig = {
    DEM_PATH: URL_HEADER + '/TarTerrain/Terrain_L15/',
    MapList: [
        {
            name: 'd2mapearth_layer-sub-world',
            url: URL_HEADER + '/TARTMS/World_TMS/',
            maximumLevel: 10,
            visible: true
        },
        {
            name: 'd2mapearth_layer-sub-spectrum',
            url: URL_HEADER + '/TARTMS/Spectrum_TMS/L{z}/{y}/{x}.png',
            maximumLevel: 19,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-hillshade',
            url: URL_HEADER + '/TARTMS/HillShade_TMS/L{z}/{y}/{x}.png',
            maximumLevel: 19,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-hillshade-custom',
            url: URL_HEADER + '/TARTMS/HillShadeCustom_TMS/L{z}/{y}/{x}.png',
            maximumLevel: 19,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-arirang',
            url: URL_HEADER + '/TARTMS/Arirang_TMS/L{z}/{y}/{x}.png',
            maximumLevel: 17,
            visible: true
        },
        {
            name: 'd2mapearth_layer-sub-land1M',
            url: URL_HEADER + '/TARTMS/G1M_HILLSHADE_TMS/',
            maximumLevel: 11,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-land500k',
            url: URL_HEADER + '/TARTMS/G500K_HILLSHADE_TMS/',
            maximumLevel: 12,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-land250k',
            url: URL_HEADER + '/TARTMS/G250K_HILLSHADE_TMS/',
            maximumLevel: 13,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-land100k',
            url: URL_HEADER + '/TARTMS/G100K_HILLSHADE_TMS/',
            maximumLevel: 14,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-land50k',
            url: URL_HEADER + '/TARTMS/G50K_HILLSHADE_TMS/',
            maximumLevel: 16,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-osm',
            url: URL_HEADER + '/TARTMS/OSM_TMS/',
            maximumLevel: 17,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-vworld',
            url: URL_HEADER + '/TMS/VWORLD_BASE_TMS/{z}/{x}/{y}.png',
            type: "xyz",
            maximumLevel: 19,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-vworld-hybrid',
            url: URL_HEADER + '/TMS/VWORLD_HYBRID_TMS/{z}/{x}/{y}.png',
            type: "xyz",
            maximumLevel: 19,
            visible: false
        },
        {
            name: 'd2mapearth_layer-sub-world-label',
            url: URL_HEADER + '/TARTMS/World_LABEL_TMS/',
            maximumLevel: 10,
            visible: false
        }
    ]
}