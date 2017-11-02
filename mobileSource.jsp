<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8" import="java.util.*" %>
<%@page isELIgnored="false"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="UTF-8">
    <title>基准页：转跳页面传递参数</title>
</head>
<body>
    <form class="" action="mobileTarget.jsp" method="get">
        <label for="">公司</label>
        <input type="text" name="singleCompany" value="">
        <input type="submit" name="" value="单独搜索">
    </form>

    <form class="" action="mobileTarget.jsp" method="get">
        <label for="">公司</label>
        <input type="text" name="firstCompany" value="">
        <label for="">关联公司</label>
        <input type="text" name="secondCompany" value="">
        <label for="">数据维度</label>
        <input type="text" name="searchDimension" value="">
        <input type="submit" name="" value="关联搜索">
    </form>

    <%-- <form class="" action="mobileTarget.jsp" method="get">
        <input type="text" name="company" value="请输入公司名称">
        <input type="submit" name="" value="搜索">
    </form> --%>
</body>
</html>
