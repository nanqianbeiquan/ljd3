﻿<%@ page language="java" contentType="text/html; charset=UTF-8"
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
	$(function(){
		alert($('#fn1').text());
	});
</script>
</head>
<body>
<ul></ul>
	<form action="function1" method="post">
	<table>
		<tr>
			<th class="style1" id="fn1">function1:公司一度关系</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName" id="compName"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function1ForAjax" method="post">
	<table>
		<tr>
			<th class="style1" id="fn1">function1:公司一度关系AJAX</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compNameAjax" id="compNameAjax"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function2" method="post">
	<table>
		<tr>
			<th class="style1">function2:两个公司关系查询，关系限定在5度以内</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName21" id="compName21">","<input type="text" name="compName22" id="compName22"></td>
			<td>depth:<input type="text" name="depth2" id="depth2"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function2ForAjax" method="post">
	<table>
		<tr>
			<th class="style1">function2:两个公司关系查询，关系限定在5度以内AJAX</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName21Ajax" id="compName21Ajax">","<input type="text" name="compName22Ajax" id="compName22Ajax"></td>
			<td>depth:<input type="text" name="depth2Ajax" id="depth2Ajax"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function3" method="post">
	<table>
		<tr>
			<th class="style1">function3:多个公司关系查询，关系限定在5度以内</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName3" id="compName3"></td>
			<td>depth:<input type="text" name="depth3" id="depth3"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function3ForAjax" method="post">
	<table>
		<tr>
			<th class="style1">function3:多个公司关系查询，关系限定在5度以内AJAX</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName3Ajax" id="compName3Ajax"></td>
			<td>depth:<input type="text" name="depth3Ajax" id="depth3Ajax"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function4" method="post">
	<table>
		<tr>
			<th class="style1">function4:公司节点下探功能</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName4" id="compName4"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
	
	<form action="function4ForAjax" method="post">
	<table>
		<tr>
			<th class="style1">function4:公司节点下探功能ajax</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="compName4Ajax" id="compName4Ajax"></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form>
</body>
</html>