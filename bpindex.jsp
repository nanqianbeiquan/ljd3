<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8" import="java.util.*" %>
<%@page isELIgnored="false"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <title>商标专利查询</title>
    <link rel="stylesheet" href="./Font-Awesome/css/font-awesome.min.css">
    <style media="screen">
        
    </style>
</head>
<body>
	<!-- 登陆 -->
    <Signin></Signin>
    <!-- 导航栏 -->
    <Indexnav></Indexnav>
    <!-- 分类搜索 -->
    <Bpsearch :search-Form='searchForm'></Bpsearch>
    <!-- 关于 -->
    <Indexabout></Indexabout>
    <script src="js/bpindex.js"></script>
</body>
</html>
