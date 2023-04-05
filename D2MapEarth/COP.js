var cop = window.cop;
var nameList = [];

//전체객체삭제
$('#unit-remove-all').on('click', function () {     
    for(var i=0; i<nameList.length; i++) //NameList 키값을 조사하여 객체 삭제
        window.cop.removeSymbol(nameList[i]);

    //Overlay 2D to 3D, 객체 모두 삭제
    window.RenderObject.removeEntity();

    cop.updateMap();        
});

//기본군대부호 추가
$('#unit-add-mssymbol').on('click', function () { 

    var startTime = Date.now();
    //기본부호코드 Randomize
    var SIDCArray = [
        "SFA-C----------",
        "SHG-IMD---H----",
        "SHG-IBAR--HI---",
        "SNG-USS5A------",
        "SUG-USS5L------",
        "SFG-UULCG--I---",
        "IFA-SCP--------",
        "OFO-M------I---",
        "EHF-IA----H----",
        "EHO-DOC---H----",
        "SFG-USAPBT-J---"
    ]

    var unitLength = 300;
    var msOptions = [];
    for(var i=0; i<unitLength; i++) {
        var name = 'MS-' + i;		
        nameList.push(name); //Name으로 키값 관리
        var lon = Math.random() * 5 + 125;
        var lat = Math.random() * 7 + 34;
        var options = {
            SIDC : SIDCArray[parseInt(Math.random() * 10) + 1],
            size: 10,
            strokeWidth: 4,
            infoColor: "RGB(255,255,0)",
            reinforcedReduced: "부대증감",
			staffComments: "군/국가구분코드",
			higherFormation: "상급부대",
            location: "127E1234,37N1234"
            //showCombatEffectivenessWaterFill: true, //전투력 물채움 표시여부 설정
            //combatEffectiveness: Math.random() * 50 + 50, //전투력 물채움 비율(녹색:100 ~ 90, 노란색:89 ~ 75 , 빨간색:74 ~ 50, 검정색:49 ~ 0)                
        }	        
        msOptions.push({ name : name, options : options,	lon : lon,	lat : lat,	height : 1000 });	
    }
    //기본군대부호 객체 추가
    cop.addTacticalSymbols(msOptions);
    cop.updateMap();
    var endTime = Date.now();

    console.log(' Unit count : ', unitLength, ' Elapsed Time : ' + (endTime - startTime).toLocaleString() + ' ms');
});

//폴리라인 객체 추가
$('#unit-add-polyline').on('click', function () { 
    
    var polylineOptions = [];
    for(var i=0; i<10; i++) {
        var name = 'PL-' + i;
        nameList.push(name); //Name으로 키값 관리
        var lon = Math.random() * 5 + 125;
        var lat = Math.random() * 7 + 34;
        var coordinates = [lon, lat, 100, lon+1, lat+1, 10000, lon+2, lat-1, 2000, lon+3, lat+1, 10000];	
        let color = [255,255,0,0.5]; //[r, g, b, alpha(0.0(transparent) ~ 1.0(opaque))]
	    let type = 'dash'; //simple, dash
        polylineOptions.push({ coordinates : coordinates, color : color, width : 3, name : name, type : type, clamp : true });
    }
    cop.addPolylines(polylineOptions);
    cop.updateMap();
});

//폴리곤 객체 추가
$('#unit-add-polygon').on('click', function () { 

    var polygonOptions = [];
    for(var i=0; i<10; i++) {
        var name = 'PL-' + i;
        nameList.push(name); //Name으로 키값 관리
        var lon = Math.random() * 4 + 125;
        var lat = Math.random() * 4 + 34;
        var coordinates = [lon, lat, 5000, lon+1, lat, 5000, lon+2, lat+1, 5000, lon+2, lat+2, 5000];	
        let lineColor = [255,0,0,0.5]; //[r, g, b, alpha(0.0(transparent) ~ 1.0(opaque))]
        let fillColor = [0,255,0,0.5]; //[r, g, b, alpha(0.0(transparent) ~ 1.0(opaque))]
	    let type = 'dash'; //simple, dash
        polygonOptions.push({ coordinates : coordinates, fillColor : fillColor, 
                            outlineColor : lineColor, width : 5, name : name, type : type, clamp : true });
    }
    cop.addPolygons(polygonOptions);
    cop.updateMap();
});

//레이블 객체 추가
$('#unit-add-label').on('click', function () { 
    
    var labelOptions = [];
    for(var i=0; i<20; i++) {
        var name = 'Text -' + i;
        nameList.push(name); //Name으로 키값 관리
        var lon = Math.random() * 5 + 125;
        var lat = Math.random() * 7 + 34;	
        let color = [255,175,58,0.5]; //[r, g, b, alpha(0.0(transparent) ~ 1.0(opaque))]
        labelOptions.push({ lon : lon, lat : lat, height : 10000, name : name, color : color });
    }
    cop.addLabels(labelOptions);
    cop.updateMap();
});

//2D 투명도(json) 파일을 3D 지형위에 중첩
$('#unit-add-overlay2dto3d').on('click', function () { 

    //방법 1. json 파일을 선택하여 3D 위에 중첩하는 방법
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = function (event) {
        processFile(event.target.files[0]);
    };
    input.click();

    function processFile(file) {
        var reader = new FileReader();
        reader.onload = function () {            
            window.RenderObject.addJSONfromString(reader.result);
        };
        reader.readAsText(file, "utf-8");
    }

    //방법 2. json이 위치한 url 경로를 넘겨 3D 위에 중첩하는 방법
    //window.RenderObject.addJSONfromURL('http://127.0.0.1:5501/D2MapEarth/graphic.json');
});

//입력 좌표로 지도 이동
$('#move-center').on('click', function () { 
    var lon = 127.1234;
    var lat = 37.1234;
    var time = 3; //이동시간(초)

    cop.flyToMoveCenter(lon, lat, time);
});