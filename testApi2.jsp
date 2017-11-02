<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8" import="java.util.*" %>
<%@page isELIgnored="false"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
<style media="screen">
    .userTip {
        font-size: 12px;
    }

    .label {
        pointer-events: none;
    }
</style>
<script src='http://cdn.bootcss.com/jquery/2.2.1/jquery.js'></script>
<script src='http://cdn.bootcss.com/d3/3.5.16/d3.min.js'></script>
</head>
<body>
    <div class="userTip">
        <input type="text" id='queryCompanyName'>
        <button id="loaderButton" type="button">单个公司搜索</button>
        <div class="userTip">
            <p>测试案例：中央汇金投资有限责任公司</p>
        </div>

        公司甲：<input type="text" id='queryFirstCompany'>
        公司乙：<input type="text" id='querySecondCompany'>
        关联维度：<input type="text" id='relationshipsDepth'>
        <button id="loaderAssociateButton" type="button">关联公司搜索</button>
        <div class="userTip">
            <p>测试案例：中央汇金投资有限责任公司 + 中国投融资担保有限公司</p>
        </div>

        公司名单：<input type="text" id='queryCompanyNameList'>
        关联维度：<input type="text" id='listRelationshipsDepth'>
        <button id="loaderCompanyListButton" type="button">批量公司搜索</button>
        <div>
            <p>测试案例：山东蓝黄基业股权投资管理有限公司,山东蓝黄科技开发有限公司,宁夏回药集团股份有限公司,青岛新宏海国际物流有限公司,深圳市兆驰软件技术有限公司</p>
        </div>
    </div>
    
    <div id="hbaseInterface">
    <h1>数据部分</h1>
    	<form action="getCompanyInfo" method="post">
    		<table>
    			<tr><td>公司名：<input type="text" name="compName"><input type="submit" value="查询"></td></tr>
    		</table>
    	</form>
    </div>
    
     <h1>数据部分2  <a href="logout">登出</a></h1>
    	<form action="getJudgmentInfo" method="post">
    		<table>
    			<tr><td>公司名：<input type="text" name="judgmentId"><input type="submit" value="查询"></td></tr>
    		</table>
    	</form>
    	
    <form action="linkage/dataForTest" method="post">
	<table>
		<tr>
			<th class="style1">搜索数据</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="keyword" id="keyword"></td>
			<td>rows:<input type="text" name="rows" id="rows"></td>
			<td>type:<input type="text" name="type" id="type"></td>
			<td>columns:<input type="text" name="columns" id="columns"></td>
			<td>ishighlight:<input type="text" name="ishighlight" id="ishighlight"></td>
			<td>mm:<input type="text" name="mm" id="mm"></td>
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
		<h1>动态监控接口</h1>
    	<form action="getWholeCMPRatingInfo" method="post">
    		<table>
    			<tr><td>公司名：<input type="text" name="companyName"><input type="submit" value="查询"></td></tr>
    		</table>
    	</form>	
    	
    	
    	<form action="gs/companyinfo" method="post">
	<table>
		<tr>
			<th class="style1">工商数据测试</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>列明:<input type="text" name="columns"/></td>
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
	<form action="sf/sfws" method="post">
	<table>
		<tr>
			<th class="style1">司法数据测试</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>列明:<input type="text" name="columns"/></td>
			<td>id:<input type="text" name="id" id="id"></td>
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>	
	
	
	<form action="leidaTest" method="post">
	<table>
		<tr>
			<th class="style1">雷达图测试</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>起始时间:<input type="text" name="startTime" id="startTime"></td>
			<td>结束时间:<input type="text" name="stopTime" id="stopTime"></td>
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>	
	
	<form action="initSolrConf" method="post">
	<table>
		<tr>
			<th class="style1">修改solr配置</th>
		</tr>
		<tr>
			<td>mm:<input type="text" name="mm" id="mm">collectionName:<input type="text" name="collectionName" id="collectionName">
			sort:<input type="text" name="sort" id="sort"> 所有字段传空值则不变化，如果要把sort字段制空则传入"no"值（不需要传引号）
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>	
	
	<form action="showSolrConf" method="post">
	<table>
		<tr>
			<th class="style1">显示solr配置</th>
		</tr>
		<tr>
			<td>
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>	
	
	<form action="news/getCompanyNews" method="post">
	<table>
		<tr>
			<th class="style1">新闻接口</th>
		</tr>
		<tr>
			<td>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>cols:<input type="text" name="cols" id="cols"></td>
			<td>startTime:<input type="text" name="startTime" id="startTime"></td>
			<td>stopTime:<input type="text" name="stopTime" id="stopTime"></td>
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>	
	
	<form action="test/getWordCloud" method="post">
	<table>
		<tr>
			<th class="style1">词云接口</th>
		</tr>
		<tr>
			<td>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>num:<input type="text" name="num" id="num"></td>
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
	<form action="test/getWordCloudList" method="post">
	<table>
		<tr>
			<th class="style1">词云列表</th>
		</tr>
		<tr>
			<td>
			<td>companyName:<input type="text" name="companyName" id="companyName"></td>
			<td>key:<input type="text" name="key" id="key"></td>
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
	<form action="test/getWordCloudNewsDetail" method="post">
	<table>
		<tr>
			<th class="style1">词云新闻详情</th>
		</tr>
		<tr>
			<td>
			<td>key:<input type="text" name="key" id="key"></td>
			<input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
    </div>
    
    
    <div id="vizContainer">
    </div>
    <script>
    // 测试关联搜索接口
    // var queryFirstCompany = "中央汇金投资有限责任公司";
    // var querySecondCompany = "中国投融资担保有限公司";
    // var relationshipsDepth = 4;
    // var dataType = "json";
    // $.post("/function2ForAjax", //本地路径
    //     {
    //         compName21Ajax: queryFirstCompany,
    //         compName22Ajax: querySecondCompany,
    //         depthAjax: relationshipsDepth
    //     },
    //     function(data,status){
    //      // var nodeProperties = data.results[0].data[0].graph.nodes[0].properties;
    //         // console.log(data.results[0].data);
    //         console.log("use /function2ForAjax");
    //         console.log(data);
    //         console.log(status);
    //     },
    //     dataType
    // );

    // // 测试批量搜索接口
    // var queryCompanyList = "山东蓝黄基业股权投资管理有限公司,山东蓝黄科技开发有限公司,宁夏回药集团股份有限公司,青岛新宏海国际物流有限公司,深圳市兆驰软件技术有限公司";
    // var listRelationshipsDepth = 3;
    // renderAssociateSearchData(queryCompanyList, listRelationshipsDepth);
    // var dataTypeQueryCompanyList = "json";
    // $.post("http://localhost:8080/hh/index/function3ForAjax",
    //     {
    //         compNameAjax: queryCompanyList,
    //         depthAjax: listRelationshipsDepth
    //     },
    //     function(data,status){
    //      // var nodeProperties = data.results[0].data[0].graph.nodes[0].properties;
    //         // console.log(data.results[0].data);
    //         console.log(data);
    //         console.log(status);
    //     },
    //     dataTypeQueryCompanyList
    // );



    // 测试下探接口
    // var queryCompanyExplore = "中央汇金投资有限责任公司";
    // var dataTypeExplore = "json";
    // $.post("http://localhost:8080/hh/index/function1ForAjax",
    //     {
    //         compNameAjax: queryCompanyExplore
    //     },
    //     function(data,status){
    //      var nodeProperties = data.results[0].data[0].graph.nodes[0].properties;
    //      // for(key in nodeProperties) {
    //      //     alert("key: "+ key + ", " + "value: " + nodeProperties[key]);
    //      // }
    //      //
    //         console.log(data.results[0].data);
    //         //console.log(data.results[0].data[0].graph.nodes[0].properties);
    //         //console.log(status);
    //     },
    //     dataTypeExplore
    // );


    $(document).ready(function(){
        // 单个公司搜索
        $("#loaderButton").click(function(){
            //将文本输入框的公司名字传入
            var queryCompanyName = $("#queryCompanyName").val();
            // 渲染单公司搜索图形
            renderSearchData(queryCompanyName);
        });
        // 关联公司搜索
        $("#loaderAssociateButton").click(function(){
            //将文本输入框的公司名字传入
            var queryFirstCompany = $("#queryFirstCompany").val();
            var querySecondCompany = $("#querySecondCompany").val();
            var relationshipsDepth = $("#relationshipsDepth").val();
            // 渲染关联搜索图形
            renderAssociateSearchData(queryFirstCompany, querySecondCompany, relationshipsDepth);
        });
        // 批量公司搜索
        $("#loaderCompanyListButton").click(function(){
            //将文本输入框的公司名字传入
            var queryCompanyList = $("#queryCompanyNameList").val();
            var listRelationshipsDepth = $("#listRelationshipsDepth").val();
            // 渲染关联搜索图形
            renderListSearchData(queryCompanyList, listRelationshipsDepth);
        });
    });

    // 单个公司搜索
    //start renderSearchData =========================================
    function renderSearchData(queryCompanyName) {
        // var queryCompany = "BC教育咨询（北京）有限公司";
        var queryCompany = queryCompanyName;
        // 返回数据类型必须设定为json，默认是string字符串
        var dataType = "json";
        // $.post("http://localhost:8080/hh/index/function1ForAjax",
         $.post("function1ForAjax",
            {
                // compNameAjax是接口设定的参数名称
                compNameAjax: queryCompany
            },
            function(data,status){
                // results[0].data是返回json对象包含的提取数据入口
                var rawData = data.results[0].data;
                // 载入图形
                loadGraphViaSearch(rawData);
            },
            // 返回数据类型必须设定为json
            dataType
        );
    }
    //start renderSearchData =========================================

    // 关联公司搜索
    //start renderAssociateSearchData =========================================
    function renderAssociateSearchData(queryFirstCompany, querySecondCompany, relationshipsDepth) {
        var queryFirstCompany = queryFirstCompany;
        var querySecondCompany = querySecondCompany;
        var relationshipsDepth = relationshipsDepth;
        var dataType = "json";
        // $.post("http://localhost:8080/hh/index/function2ForAjax",
        $.post("function2ForAjax",
            {
                compName21Ajax: queryFirstCompany,
                compName22Ajax: querySecondCompany,
                depthAjax: relationshipsDepth
            },
            function(data,status){
                // results[0].data是返回json对象包含的提取数据入口
                var rawData = data.results[0].data;
                // 载入图形
                loadGraphViaSearch(rawData);
            },
            dataType
        );
    }
    //start renderAssociateSearchData =========================================

    // 批量公司搜索
    //start renderListSearchData =========================================
    function renderListSearchData(queryCompanyList, listRelationshipsDepth) {
        // var queryCompany = "BC教育咨询（北京）有限公司";
        var queryCompanyList = queryCompanyList;
        var listRelationshipsDepth = listRelationshipsDepth;
        // 返回数据类型必须设定为json，默认是string字符串
        var dataType = "json";
        // $.post("http://localhost:8080/hh/index/function3ForAjax",
        $.post("function3ForAjax",
            {
                // compNameAjax是接口设定的参数名称
                compNameAjax: queryCompanyList,
                depthAjax: listRelationshipsDepth
            },
            function(data,status){
                // results[0].data是返回json对象包含的提取数据入口
                var rawData = data.results[0].data;
                // 载入图形
                loadGraphViaSearch(rawData);
            },
            // 返回数据类型必须设定为json
            dataType
        );
    }
    //start renderListSearchData =========================================

    //start loadGraphViaSearch =========================================
    function loadGraphViaSearch(rawData) {
        // svg和force涉及的参数设置
        var graphConfig = {width: 800, height:600}
        //删除前次搜索绘图
        if (d3.select('svg')) {
            d3.select('svg').remove();
        }
        // 创建svg画布
        var svg = d3.select("body")
            .select('#vizContainer') //暂时写死
            .append("svg")
            .attr("width", graphConfig.width)
            .attr("height", graphConfig.height);

        // 绘图数据容器
        var dataSelected = {};
        // 节点名字堆、关系id堆
        dataSelected.nodesIdSet = d3.set();
        dataSelected.linksIdSet = d3.set();
        // 初始节点和关系
        dataSelected.nodes = [];
        dataSelected.links = [];

        //原始数据转为力图未索引数据
        var forceData = iniForceData(rawData);
        // 渲染力图
        renderForce(forceData, dataSelected, graphConfig, svg);

    }
    //end loadGraphViaSearch ===========================================

    //start iniForceData ===============================================
    function iniForceData(rawData) {
        var forceData = {};
        forceData.links = [];
        forceData.nodes = [];

        forceData.nodesIdSet = d3.set();
        forceData.linksIdSet = d3.set();

        rawData.forEach(function(item) {
            // 节点原始数据组
            var rawNodesArray = item.graph.nodes;
            // console.log(rawNodesArray);
            // 将没出现过的节点压入绘图容器
            rawNodesArray.forEach(function(rawNode) {
                // console.log(rawNode.id);
                if (!forceData.nodesIdSet.has(rawNode.id)) {
                    forceData.nodesIdSet.add(rawNode.id);
                    forceData.nodes.push(rawNode);
                }
            });
            // 将没出现过的边压入绘图容器
            var rawRelationshipsArray = item.graph.relationships;
            // console.log(rawRelationshipsArray);
            if (rawRelationshipsArray.length) {
                rawRelationshipsArray.forEach(function(rawLink) {
                    // console.log(rawLink.id);
                    if (!forceData.linksIdSet.has(rawLink.id)) {
                        forceData.linksIdSet.add(rawLink.id);
                        forceData.links.push(rawLink);
                    }
                });
            } else {
                // console.log('isolate nodes without links');
            }

        });
        // console.log(forceData);
        return forceData;
    }
    //end iniForceData ===============================================

    //start addIndex =================================================
    function addIndex(data) {
        // 临时返回数据存放对象
        var dataIndexed = {};
        dataIndexed.nodesIdSet = data.nodesIdSet;
        dataIndexed.linksIdSet = data.linksIdSet;

        var nodesArray = []; //存放node的id，用于检索links两头的位置
        var inputDataNodes = data.nodes; //nodesData
        var inputDataLinks = data.links; //linksData
        var linkIndexed;

        //存放node的id，用于检索links两头的位置
        for(keys in inputDataNodes) {
            nodesArray.push(inputDataNodes[keys].id);
        }
        // 查找边两端节点位置，创建索引
        linkIndexed = inputDataLinks.map(function(link) {
            var sourceNode = link.startNode;
            var targetNode = link.endNode;

            var sourceIndex = nodesArray.indexOf(sourceNode);
            var targetIndex = nodesArray.indexOf(targetNode);

            return {source: sourceIndex, target: targetIndex, id: link.id, type: link.type, properties: link.properties};
        });

        dataIndexed.nodes = inputDataNodes;
        dataIndexed.links = linkIndexed;

        // console.log(dataIndexed);
        return dataIndexed;
    }
    //start addIndex =================================================

    // start drawArror ##############
    function drawArror(svg, color, arrowConfig) {
        var arrow_path = arrow_path || "M0,0 L4,2 L0,4 L0,0";

        var svg = svg || d3.select('svg');

        var defsG = svg.append('g');
        var defs = defsG.append("defs");
        var arrowMarker = defs.append("marker")
            .attr(arrowConfig);

        arrowMarker.append("path")
            .attr("d",arrow_path)
            .attr("fill",color);
    }
    // end drawArror ##############

    // start rotateLinkLable ##############
    function rotateLinkLable(d) {
        var rotateCenterX = (d.source.x + d.target.x) / 2;
        var rotateCenterY = (d.source.y + d.target.y) / 2;
        var legX = Math.abs(d.source.x - d.target.x);
        var legY = Math.abs(d.source.y - d.target.y);
        var rotateAngle = Math.atan(legY/legX) * 180 / Math.PI;
        // console.log(rotateAngle);
        if (d.target.x >= d.source.x) {
            if (d.target.y >= d.source.y) { //when target x > source x
                return 'rotate(' + (rotateAngle) + " " + rotateCenterX + ',' + rotateCenterY + ')';
            } else {
                return 'rotate(' + -rotateAngle + " " + rotateCenterX + ',' + rotateCenterY + ')';
            }
        } else { //when target x < source x
             if (d.target.y >= d.source.y) { //when target x > source x
                return 'rotate(' + -rotateAngle + " " + rotateCenterX + ',' + rotateCenterY + ')';
            }else{
                return 'rotate(' + (rotateAngle) + " " + rotateCenterX + ',' + rotateCenterY + ')';
            } 
        }
    }
    // end rotateLinkLable ##############

    //renderForce ====================================================
    function renderForce(data, dataSelected, graphConfig, svg) {
        data.nodes.forEach(function(node) {
            // console.log(node);
            // 将初始数据装入绘图数据容器
            dataSelected.nodesIdSet.add(node.id);  //replace nodesNameSet
            dataSelected.nodes.push(node);
        });
        data.links.forEach(function(link) {
            // console.log(node);
            // 将初始数据装入绘图数据容器
            dataSelected.linksIdSet.add(link.id);
            dataSelected.links.push(link);
        });
        // 添加力图索引
        var dataSelectedIndexed = addIndex(dataSelected);
        // console.log(dataSelectedIndexed);
        // 节点颜色选择
        var colorScale = d3.scale.ordinal()
                .domain(['Company', 'Person'])
                .range(['#68BDF6', '#6DCE9E']);

        // 动画计数器
        var tickCounter = 0;

        var force = d3.layout.force()
            .size([graphConfig.width, graphConfig.height])
            .nodes(dataSelectedIndexed.nodes)
            .links(dataSelectedIndexed.links)
            .linkDistance(80)
            .charge(-600)  //相互之间的作用力
            .gravity(0.05)
            .on("tick", tick);

        // 开始力图
        // force.start();

        // 节点与边的力图数据
        var nodesData = force.nodes();
        var linksData = force.links();

        // 画箭头
        var arrowConfig = {
            id: 'arrow',
            path: "M0,0 L4,2 L0,4 L0,0",
            markerUnits: 'strokeWidth',
            markerWidth: 4,
            markerHeight: 4,
            viewBox: "0 0 4 4",
            refX: 16,
            refY: 2,
            orient: 'auto'
        }
        var arrow = drawArror(svg, "#aaa", arrowConfig);
        // 画边
        var linksG = svg.append('g').attr('id', 'linksG');
        var linksArray = linksG.selectAll(".link")
                .data(dataSelectedIndexed.links)
                .enter()
                .append("line")
                // .append("path")
                .classed('link', true)
                .style('stroke', '#aaa')
                .style('stroke-width', '2px')
                .attr("marker-end", 'url(#arrow)');
                // .attr("class", "link");
        // 画节点
        var nodesG = svg.append('g').attr('id', 'nodesG');
        var nodesArray = nodesG.selectAll(".nodeCircle")
                .data(dataSelectedIndexed.nodes)
                .enter()
                .append("circle")
                .attr("class", "node")
                .classed('nodeCircle', true)
                .attr("r", 25)
                .style('fill', function(d) {
                    return colorScale(d.labels[0]);
                })
                .style('stroke', '#ccc')
                .style('stroke-width', '2px')
                .on('mouseover', function(d) {
                    // displayExplorableMark(d);
                })
                .on('mouseout', function() {
                    // hideExplorableMark();
                })
                .on('dblclick', function(d) {
                    // 隐藏下探提示标记
                    // hideExplorableMark();
                    // 双击固定位置
                    d.fixed = true;
                    // 如果当前节点是公司，载入当前节点下探数据
                    if (d.labels[0] == 'Company') {
                        loadData(d);
                    }
                })
                .call(force.drag);

            // 绘制节点文字
            var labelsG = svg.append('g').attr('id', 'labelsG');
            var labelsArray = labelsG.selectAll(".label")
                    .data(dataSelectedIndexed.nodes)
                    .enter()
                    .append("text")
                    .attr("class", "label")
                    .attr('dx', -25)
                    .attr('dy', 5)
                    .style({"font-size":'12px', 'fill': '#666'})
                    .text(function(d) {
                        if (d.labels[0] == 'Company') {
                            // return d.properties['公司名称'];
                            return d.properties['公司名称'].substr(0, 4)+'...';
                        } else if (d.labels[0] == 'Person') {
                            return d.properties['姓名'];
                        }
                    });

            //绘制关系文字
            var linksLabelsG = svg.append('g').attr('id', 'linksLabelsG');
            var linksLabelsArray = linksLabelsG.selectAll(".linksLabels")
                    .data(dataSelectedIndexed.links)
                    .enter()
                    .append("text")
                    .attr("class", "linksLabels")
                    // .attr('dx', -5)
                    // .attr('dy', -12)
                    .style({"font-size":'12px', 'fill': '#666'})
                    .text(function(d) {
                        if (d.type == '任职') {
                            if (d.properties['职位']) {
                                return d.properties['职位'];
                            }else {
                                return '任职';
                            }
                        } else if (d.type == '投资') {
                            if (d.properties['认缴出资']) {
                                return '投资' + d.properties['认缴出资'];
                            }else {
                                return '投资';
                            }
                        } else {
                            return d.type;
                        }
                    });

        // 开始力图
        force.start();

        force.on('end', function() {
            // console.log('end');
            // nodesArray.style('',function(d) {
            //     console.log(d);
            //     d.fixed = true;
            // });
        });

        function tick() {
            // 更新连线坐标
            linksArray.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            // 更新连线标签坐标
            linksLabelsArray.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
                .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; })
                .attr('transform', function(d) {
                    return rotateLinkLable(d);
                });

            // 更新连线坐标：弧线
            // linksArray.attr("d", linkArc);

            // 更新节点标签坐标
            labelsArray.attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });

            // 更新节点坐标
            nodesArray.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });

            // 设定时间停止force图，缩短force晃动时间
            checkForceAniman();
        }

        //start  refreshGraph #######################
        function refreshGraph(dataSelectedIndexed) {
            var linksData = dataSelectedIndexed.links;
            var nodesData = dataSelectedIndexed.nodes;

            // 绑定新增数据
            force.nodes(nodesData).links(linksData);

            linksArray = linksArray.data(linksData);
            linksArray.enter()
                .append("line")
                // .append("path")
                .attr("class", "link")
                .style('stroke', '#aaa')
                .style('stroke-width', '2px')
                .attr("marker-end", 'url(#arrow)');

            nodesArray = nodesArray.data(nodesData);
            nodesArray.enter()
                .append("circle")
                .attr("class", "node")
                .classed('nodeCircle', true)
                .attr("r", 25)
                .style('fill', function(d) {
                    return colorScale(d.labels[0]);
                })
                .style('stroke', '#ccc')
                .style('stroke-width', '2px')
                .on('mouseover', function(d) {
                    // displayExplorableMark(d);
                })
                .on('mouseout', function() {
                    // hideExplorableMark();
                })
                .on('dblclick', function(d) {
                    // 隐藏下探提示标记
                    // hideExplorableMark();
                    // 双击固定位置
                    d.fixed = true;
                    // 如果当前节点是公司，载入当前节点下探数据
                    if (d.labels[0] == 'Company') {
                        loadData(d);
                    }
                })
                .call(force.drag);

            // 绘制节点文字
            labelsArray = labelsArray.data(nodesData);
            labelsArray.enter()
                .append("text")
                .attr("class", "label")
                .attr('dx', -25)
                .attr('dy', 5)
                .style({"font-size":'12px', 'fill': '#666'})
                .text(function(d) {
                    if (d.labels[0] == 'Company') {
                        // return d.properties['公司名称'];
                        return d.properties['公司名称'].substr(0, 4)+'...';
                    } else if (d.labels[0] == 'Person') {
                        return d.properties['姓名'];
                    }
                });

            //绘制关系文字
            linksLabelsArray = linksLabelsArray.data(linksData);
            linksLabelsArray.enter()
                .append("text")
                .attr("class", "linksLabels")
                // .attr('dx', -5)
                // .attr('dy', -12)
                .style({"font-size":'12px', 'fill': '#666'})
                .text(function(d) {
                    if (d.type == '任职') {
                        if (d.properties['职位']) {
                            return d.properties['职位'];
                        }else {
                            return '任职';
                        }
                    } else if (d.type == '投资') {
                        if (d.properties['认缴出资']) {
                            return '投资' + d.properties['认缴出资'];
                        }else {
                            return '投资';
                        }
                    } else {
                        return d.type;
                    }
                });

            force.start();
            // 重置计数器
            resetTickCounter();
        }
        //end  refreshGraph #######################

        //start  loadData(d) ###################
        function loadData(d) {
            var dataSelectedIndexed;
            // 传入公司名称，ajax载入数据
            var queryCompanyExplore = d.properties['公司名称'];
            console.log(queryCompanyExplore);
            var dataTypeExplore = "json";
            // $.post("http://localhost:8080/hh/index/function4ForAjax",
            $.post("function4ForAjax",
                {
                    compNameAjax: queryCompanyExplore
                },
                function(data,status){
                    // 下探原始数据入口
                    var rawExploreData = data.results[0].data;
                    // console.log(rawExploreData);
                    // 将原始数据转换为力图未索引数据
                    var forceExploreData = iniForceData(rawExploreData);
                    // console.log(forceExploreData.links);
                    // 将新下探数据压入绘图数据容器
                    forceExploreData.links.forEach(function(l) {
                        // 压入links到新数据对象
                        if (!dataSelected.linksIdSet.has(l.id)) {
                            // 如果出现没有收录的关系，激活更新图表标记
                            // enableIsUpdateForce();
                            // 压入新关系数据到绘图数据容器
                            dataSelected.linksIdSet.add(l.id);
                            dataSelected.links.push(l);
                        }
                        // 压入links两端的nodes到新数据对象
                        if (!dataSelected.nodesIdSet.has(l.startNode)) {
                            dataSelected.nodesIdSet.add(l.startNode);

                            var sourceNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                                return n.id == l.startNode;
                            });
                            // console.log(sourceNodeFiltedArray[0]);
                            dataSelected.nodes.push(sourceNodeFiltedArray[0]);
                        }
                        // 压入links两端的nodes到新数据对象
                        if (!dataSelected.nodesIdSet.has(l.endNode)) {
                            dataSelected.nodesIdSet.add(l.endNode)

                            var targetNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                                return n.id == l.endNode;
                            });
                            // console.log(targetNodeFiltedArray[0]);
                            dataSelected.nodes.push(targetNodeFiltedArray[0]);
                        }
                    });
                    // 添加新数据力图索引
                    dataSelectedIndexed = addIndex(dataSelected);
                    // 更新绘制力图
                    refreshGraph(dataSelectedIndexed);
                },
                // 设置ajax返回数据类型为json
                dataTypeExplore
            );
        }
        //end  loadData(d) ###################

        function checkForceAniman() {
            tickCounter++;
            if (tickCounter > 150) {
                force.stop();
            }
        }

        // tick计数器重置
        function resetTickCounter() {
            tickCounter = 0;
        }

        // start 弧线连线###################
        // 二次贝塞尔曲线容易控制中间的位置，可以知道文本放置位置和旋转角度
        function linkArc(d) {
            if (true) {

            } else {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);

                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            }
        }
        // end  弧线连线###################
    }
    //renderForce======================================================
    </script>
</body>
</html>
