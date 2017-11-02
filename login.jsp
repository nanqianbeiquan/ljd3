<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*" %>
<%@page isELIgnored="false"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="../css/css.css">
<script src="../js/jquery-1.9.0.js"></script>
<script>

</script>
</head>
<body>
	<form action="verify" id="verify" method="post">
		<li><input type="text" name="uname" id="uname" value="" /></li>
		<li><input type="password" name="passwd" id="passwd" value=""/></li>
		</li>
		<li style="padding-top: 10px; padding-left: 10px; color: #f00">
			${errorInfo} <sf:errors path="username" />
		</li>
		<li><input type="submit" value="登陆" /></li>
	</form>
</body>
</html>