window.onload = function () {
    var map = new AMap.Map('container', {
        resizeEnable: true,
        zoom: 12,
        center: [118.756376, 32.052573]
    });
//地图内容
    map.setFeatures(['bg', 'building', 'road', 'point']);
//地图空间
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.MapType'],
        function () {
            map.addControl(new AMap.ToolBar());

            map.addControl(new AMap.Scale());
        });
//覆盖物
    var marker = new AMap.Marker({
        position: [118.756376, 32.052573]
    });
    marker.setMap(map);
    var circle = new AMap.Circle({
        center: [118.756376, 32.052573],
        radius: 100,
        fillOpacity: 0.2,
        strokeWeight: 1
    });
    circle.setMap(map);
//自定义窗体
    var infowindow;
    var infoWindowContent = '<div class="infowindow-content"><h3>欢迎下载本地图插件</h3><p>基于高德地图API</p><span style="color:red;font-size:12px;">(此处文字可修改)</span></div>';
    map.plugin('AMap.AdvancedInfoWindow', function () {
        infowindow = new AMap.AdvancedInfoWindow({
            panel: 'panel',
            placeSearch: true,
            asOrigin: true,
            asDestination: true,
            content: infoWindowContent
        });
        infowindow.open(map, [118.756376, 32.052573]);
    });

//汽车路线规划
    $('#car').on('click', function () {
        $('.pageShow').slideToggle();
        clearMarker();
        AMap.plugin('AMap.Driving', function () {
            var drving = new AMap.Driving({
                map: map,
                panel: "panel"
            });
            drving.search([
                {keyword: $('#star').val()},
                {keyword: $('#end').val()}
            ]);
        })
    });
//步行路线规划
    $("#riding").on('click', function () {
        $('.pageShow').slideToggle();
        clearMarker();
        var walking = new AMap.Walking({
            map: map,
            panel: "panel"
        });
        walking.search([
            {keyword: $('#cStar').val()},
            {keyword: $('#cEnd').val()}
        ]);
    });
//骑行路线规划
    $('#walk').on('click', function () {
        $('.pageShow').slideToggle();
        clearMarker();
        var riding = new AMap.Riding({
            map: map,
            panel: "panel"
        });
        riding.search([
            {keyword: $('#wStar').val()},
            {keyword: $('#wEnd').val()}
        ]);
    });

    function clearMarker() {
        if (marker) {
            marker.setMap(null);
            marker = null;
        }
        if (infowindow) {
            infowindow.close()
        }
    }

//输入提示
    var autoOptions = new AMap.Autocomplete({
        input: "tipinput"
    });
//城市搜索
    var auto = new AMap.Autocomplete(autoOptions);
    var placeSearch = new AMap.PlaceSearch({
        map: map
    });  //构造地点查询类
    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
    function select(e) {
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
    }

    $('#show').on('click', function () {
        clearMarker()
        $('.pageShow').slideToggle();
    })

    $('#box').on('click', function () {
        clearMarker()
        $('.pageShow').slideToggle();
        var rectOptions = {
            strokeStyle: "dashed",
            strokeColor: "#333",
            fillColor: "#333",
            fillOpacity: 0.3,
            strokeOpacity: 1,
            strokeWeight: 1
        };
        map.plugin(["AMap.MouseTool"], function () {
            var mouseTool = new AMap.MouseTool(map);
            //通过rectOptions更改拉框放大时鼠标绘制的矩形框样式
            mouseTool.rectZoomIn(rectOptions);
        });
    })
    $('#meter').on('click', function () {
        $('.pageShow').slideToggle();
        map.plugin(["AMap.RangingTool"], function () {
            ruler1 = new AMap.RangingTool(map);
            AMap.event.addListener(ruler1, "end", function (e) {
                ruler1.turnOff();
            });
            var sMarker = {
                icon: new AMap.Icon({
                    size: new AMap.Size(19, 31),//图标大小
                    image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png"
                })
            };
            var eMarker = {
                icon: new AMap.Icon({
                    size: new AMap.Size(19, 31),//图标大小
                    image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png"
                }),
                offset: new AMap.Pixel(-9, -31)
            };
            var lOptions = {
                strokeStyle: "solid",
                strokeColor: "#FF33FF",
                strokeOpacity: 1,
                strokeWeight: 2
            };
            var rulerOptions = {startMarkerOptions: sMarker, endMarkerOptions: eMarker, lineOptions: lOptions};
            ruler2 = new AMap.RangingTool(map, rulerOptions);
        });
        //启用自定义样式测距

       ruler1.turnOff();
       ruler2.turnOn();
    })
}
