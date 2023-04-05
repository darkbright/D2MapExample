// 사이드 메뉴 - 측정관리
async function initSidebarMeasurement() {    
    
    $('#measurement-distance-remove').on('click', function () {         
        console.log('거리측정 객체 삭제');    

        var length = window.distance.getSegmentLength(); //거리측정시 세그먼트 갯수를 리턴한다.
        var str = '거리측정 객체수는 ' + length + '개 입니다.\n첫번째 객체를 삭제합니다.';
        alert(str);
		if(length > 0) {
            //거리측정 세그먼트 중 0번째 인덱스 객체를 삭제한다.
            //n번째 인덱스 입력시 해당 객체가 삭제된다.
			window.distance.setSegmentRemove(0); 
        }
    });

    $('#measurement-distance-removeall').on('click', function () {         
        console.log('거리측정 객체 전체삭제');    

        var length = window.distance.getSegmentLength(); //거리측정시 세그먼트 갯수를 리턴한다.
        var str = '거리측정 객체수는 ' + length + '개 입니다.\n전체 객체를 삭제합니다.';
        alert(str);
		if(length > 0) {            
			window.distance.setSegmentRemoveAll(); 
        }
    });

    $('#measurement-distance-color').on('click', function () {         
        console.log('거리측정 색상 설정');
        //rgba(255, 0, 0, 0.5), #ff0000로 색상처리 모두 가능
        window.distance.setLineColor('#ff0000'); //빨간색으로 설정
    });

    var distanceLineVisible = true;
    $('#measurement-distance-linevisible').on('click', function () {         
        console.log('거리측정 라인 표시');
        distanceLineVisible = !distanceLineVisible;
        window.distance.setLineVisible(distanceLineVisible); 
    });

    var distanceTextVisible = true;
    $('#measurement-distance-textvisible').on('click', function () {         
        console.log('거리측정 텍스트 표시');
        distanceTextVisible = !distanceTextVisible;
        window.distance.setTextVisible(distanceTextVisible); 
    });

    var segmentTextVisible = false;
    $('#measurement-distance-segmenttextvisible').on('click', function () {         
        console.log('총합 및 구간거리 표시');
        segmentTextVisible = !segmentTextVisible;
        window.distance.setSegmentTextVisible(segmentTextVisible); //구간거리 표시 여부
    });


    $('#measurement-area-remove').on('click', function () {         
        console.log('면적측정 객체 삭제');   

        var length = window.area.getSegmentLength(); //면적측정시 세그먼트 갯수를 리턴한다.
        var str = '면적측정 객체수는 ' + length + '개 입니다.\n첫번째 객체를 삭제합니다.';
        alert(str);
		if(length > 0) {
            //거리측정 세그먼트 중 0번째 인덱스 객체를 삭제한다.
            //n번째 인덱스 입력시 해당 객체가 삭제된다.
			window.area.setSegmentRemove(0); 
        } 
    });

    $('#measurement-area-removeall').on('click', function () {         
        console.log('면적측정 객체 전체삭제');    

        var length = window.area.getSegmentLength(); //면적측정시 세그먼트 갯수를 리턴한다.
        var str = '면적측정 객체수는 ' + length + '개 입니다.\n전체 객체를 삭제합니다.';
        alert(str);
		if(length > 0) {            
			window.area.setSegmentRemoveAll(); 
        }
    });

    $('#measurement-area-linecolor').on('click', function () {         
        console.log('면적측정 선색상 설정');
        //rgba(255, 0, 0, 0.5), #ff0000로 색상처리 모두 가능
        window.area.setLineColor('rgba(255, 0, 0, 0.8)'); 
    });
    
    $('#measurement-area-fillcolor').on('click', function () {         
        console.log('면적측정 채움색상 설정');
        //rgba(255, 0, 0, 0.5), #ff0000로 색상처리 모두 가능
        window.area.setFillColor('rgba(255, 0, 0, 0.5)');
    });

    var areaVisible = true;
    $('#measurement-area-linevisible').on('click', function () {         
        console.log('면적측정 표시 설정');
        areaVisible = !areaVisible;
        window.area.setVisible(areaVisible);
    });

    var areaTextVisible = true;
    $('#measurement-area-textvisible').on('click', function () {         
        console.log('면적측정 텍스트 표시');
        areaTextVisible = !areaTextVisible;
        window.area.setTextVisible(areaTextVisible); 
    });

}
