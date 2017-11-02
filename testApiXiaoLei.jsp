<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.*" %>
<%@page isELIgnored="false"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" type="text/css" href="../css/css.css">
<script src="js/jquery-1.9.0.js"></script>
<script>
	/* $(function(){
		alert($('#fn1').text());
	});
	
	function show(){
	 $.ajax({
				    url: 'http://localhost:8080/datahub/linkage/data',
				    type: 'POST',
				    data:{
						//传递参数
						keyword:"天翼",
						rows: 5,
						columns:'Registered_Info:legalrepresentative',
						ishighlight: "" 
				   },
				    dataType: 'json',
				    timeout: 10000,
				    error: function(e){
				    	console.log("error");
				        console.log(e);
				        console.log(e.responseText);
				    },
				    success: function(result){
				    	console.log("success!");
				    	console.log(result);
				    }
				
			});
	 
	} */
</script>
</head>
<body>
<ul></ul>
	<!-- <form action="function1" method="post">
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
			<td>列明:<input type="text" name="columns"/></td>
			<input type="submit" value="submit">
		</tr>
	</table>
	</form> -->
	
	
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
	
	<form action="job/companyjob" method="post">
	<table>
		<tr>
			<th class="style1">招聘数据测试</th>
		</tr>
		<tr>
			<td>compName:<input type="text" name="companyName" id="companyName"></td>
			<td>列明:<input type="text" name="columns"/></td>
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>
	
	
	
	
	<form action="linkage/data" method="post">
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
			<td><input type="submit" value="submit"/></td>
		</tr>
	</table>
	</form>

    	<form action="risk/getWholeCMPRatingInfo" method="post">
    		<table>
    			<th class="style1">公司全风险查询接口</th>
    			<tr><td>compName：<input type="text" name="companyName"><input type="submit" value="查询"></td></tr>
    		</table>
    	</form>	
	
	
	<!-- <button onclick="show()">ddddddddddd</button> -->
</body>
</html>