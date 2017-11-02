<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8" import="java.util.*" %>
<%@page isELIgnored="false"%>

<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	<title>棱镜征信：司法信息查询</title>
	<link rel="stylesheet" href="./Font-Awesome/css/font-awesome.min.css">
	<style type="text/css">
		ul li{
			list-style: none;
		}
	</style>
	<script type="text/javascript" src="LengjingMonitor/js/jquery.min.js"></script>
</head>
<body>
	<div id="container">
		<!-- 导航栏 -->
		<div class="navContainer">
			<Navbtp :search-Form='searchForm'></Navbtp>
		</div>
	    <div class="container-fluid" id="container-fluid-main">
	        <div class="row">
	            <div class="col-xs-12 col-sm-1 col-md-1 col-lg-1 sidebar" id="leftSideBar">
	                <div id="sidepanel">
	                	<!-- <h5>棱镜征信:司法剖析</h5> -->
	                    <ul>
	                    	<!-- 使用指令 v-link 进行导航。 -->
	                    	<!-- 司法统计 -->
	                    	<li id="goOverview"><span class="glyphicon glyphicon-signal" aria-hidden="true"></span></li>
	                    	<!-- 司法分析 -->
	                    	<!-- <li id="goMain"><span class="glyphicon glyphicon-home" aria-hidden="true"></span></li> -->
	                    	<!-- 司法详情 -->
	                    	<!-- <li id="goList"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></li> -->
	                    	<!-- <li id="goBar"><span class="glyphicon glyphicon-th-large" aria-hidden="true"></span></li> -->
	                    	<!-- <li id="goFoo"><span class="glyphicon glyphicon-cloud" aria-hidden="true"></span></li> -->
	                    </ul>
	                </div>
	            </div>
	            <div class="col-xs-12 col-sm-11 col-sm-offset-1 col-md-11 col-md-offset-1 col-lg-11 col-lg-offset-1 main">
					<div class="mainContainer">
						<!-- 路由外链 -->
						<router-view></router-view>
					</div>
				</div>
	        </div>
	    </div>
    </div>
	<!--<script type="text/javascript" src="js/develop2.js"></script>-->
	<script type="text/javascript" src="LengjingMonitor2/js/app/develop2.js"></script>
</body>
</html>