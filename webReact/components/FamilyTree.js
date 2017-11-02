import React, { Component } from 'react'; //导入 react
import classNames from 'classnames';
import $ from 'jquery';

import d3 from 'd3'
import vv from './vv'
import radar from '../src/radarChart'; // 风险分析雷达图库
require("../src/radar-chart.css");   // 雷达图样式

import store from '../src/store';

//== 变量定义
var searchTimer = null;
var searchBoxValue;

//== 族谱图组件
class FamilyTree extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	hideLeftPanel: true, //== 显示或隐藏左边栏
	    	hideforceSettingPanel: true, //== 显示或隐藏设置面板
	    	hideCompInfoDiv: false,
	    	hideCompLawDiv: true,
	    	hideCompRiskHintDiv: true,
	    	hideCompRelatedRiskHintDiv: true,
	    	hideBox: true, //== 显示或隐藏搜索框
	    	searchValue: '', //== 绑定搜索框内容
	    	searchCompList: [], //== 绑定搜索提示列表内容
	    	hideSearchCompList: true, //== 显示或隐藏搜索提示列表
	    	compsFullName: false, //== 显示或隐藏公司全称
	    	investPercent: false, //== 显示或隐藏投资比例
	    	filterInvest: true, //== 过滤节点中的投资关系
	    	filterOwner: true, //== 过滤节点中的法人关系
	    	filterServe: true, //== 过滤节点中的任职关系
	    	radarCompName: '', //== 雷达图展示的公司名称
	    	radarRiskLevel: '', //== 风险等级
	    	basicInfo: {}, //== 工商司法信息
	    	shareholder: [], //== 公司股东
			changed: [], //== 公司变更
			keyPerson: [], //== 公司主要人员
			legalInfo: [], //== 司法文书
			courtAnnounInfo: [], //== 开庭公告
			executed: [], //== 被执行
			dishonestExecuted:[]  //== 失信被执行
	    }
	}

	componentDidMount(){

	}

	showLeftPanel(){
		this.setState({
			hideLeftPanel: !this.state.hideLeftPanel
		});
		var flag = this.state.hideLeftPanel;
		if(flag){
			$("#leftPanel").css('left', '0');
		}else{
			$("#leftPanel").css('left', '-100%');
		}

		//== 获取上一次选择的节点信息
		var d = store.getState().touchNodeInfos;
		if(!this.state.hideCompRiskHintDiv){
			if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
					this.setState({
						radarCompName: d.properties['公司名称'],
						radarRiskLevel: '风险评级:'+d.properties['风险评级']
					});
		    	//== 渲染雷达图
		    	setTimeout(function(){
			        renderRadar(d);
		    	}, 200);
		    }
		}else if(!this.state.hideCompInfoDiv){
			if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
		    	//== 获取节点信息
		    	var that = this;
		    	getNodeInfo(d,that);
		    }
		}else if(!this.state.hideCompLawDiv){
			//== 获取上一次选择的节点信息
			var d = store.getState().touchNodeInfos;
			if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
				var that = this;
		    	//== 获取司法信息
		    	getNodeLegalInfo(d,that);
		    }
		}
	}

	showCompInfoDiv(){
		this.setState({
			hideCompInfoDiv: false,
			hideCompLawDiv: true,
	    	hideCompRiskHintDiv: true,
	    	hideCompRelatedRiskHintDiv: true,
		});
		//== 获取上一次选择的节点信息
		var d = store.getState().touchNodeInfos;
		if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
	    	//== 获取节点信息
	    	var that = this;
	    	getNodeInfo(d,that);
	    }
	}
	showCompLawDiv(){
		this.setState({
			hideCompInfoDiv: true,
			hideCompLawDiv: false,
	    	hideCompRiskHintDiv: true,
	    	hideCompRelatedRiskHintDiv: true,
		});
		//== 获取上一次选择的节点信息
		var d = store.getState().touchNodeInfos;
		if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
			var that = this;
	    	//== 获取司法信息
	    	getNodeLegalInfo(d,that);
	    }

	}
	showCompRiskHintDiv(){
		this.setState({
			hideCompInfoDiv: true,
			hideCompLawDiv: true,
	    	hideCompRiskHintDiv: false,
	    	hideCompRelatedRiskHintDiv: true,
		});
		//== 获取上一次选择的节点信息
		var d = store.getState().touchNodeInfos;
		if (d.hasOwnProperty('labels')&&d.labels[0] == 'Company') {
				this.setState({
					radarCompName: d.properties['公司名称'],
					radarRiskLevel: '风险评级:'+d.properties['风险评级']
				});
	    	//== 渲染雷达图
	    	setTimeout(function(){
		        renderRadar(d);
	    	}, 200);
	    }
	}
	showCompRelatedRiskHintDiv(){
		this.setState({
			hideCompInfoDiv: true,
			hideCompLawDiv: true,
	    	hideCompRiskHintDiv: true,
	    	hideCompRelatedRiskHintDiv: false,
		});
	}

	showSearchBox(){
		this.setState({
			hideBox: !this.state.hideBox
		});
	}

	handleInputChange(event){
		var that = this;
		clearTimeout(searchTimer);
		this.setState({searchValue: event.target.value});
		searchBoxValue = event.target.value;
		if(searchBoxValue!==''){
			searchTimer = setTimeout(function(){
				that.setState({
					hideSearchCompList: false
				});
				sendKeyWordToBack(searchBoxValue,that);
			}, 300);
			// that.setState({
			// 	hideSearchCompList: false
			// });
			// sendKeyWordToBack(searchBoxValue,that);
		}else{
			that.setState({
				hideSearchCompList: true
			});
		}
	}

	getCompName(compName,that){
		// console.log('公司名称：');
		// console.log(compName);
		that.setState({
			hideBox: true,
			hideSearchCompList: true
		});
		renderSearchData(compName);
	}
	//==显示节点操作按钮
	execHideNodeOper(){
		hideNodeOper();
	}
	//==执行节点下探操作
	execLoadData(){
		// console.log('节点下探');
		//== 隐藏节点操作台
		hideNodeOper();
		//＝＝ 如果当前节点是公司，载入当前节点下探数据
		var d = store.getState().touchNodeInfos;
	    if (d.labels[0] == 'Company') {
	    	//== 节点下探
	        forceInstance.loadData(d);
	    }
	}
	//==
	execRemoveNode(){
		// console.log('删除节点');
		//== 隐藏节点操作台
		hideNodeOper();
		//== 删除节点或叶子节点
		var d = store.getState().touchNodeInfos;
		forceInstance.removeNodeOrLeafNodes(d);
	}

	forceSetting(){
		// console.log("forceSetting");
		this.setState({
			hideforceSettingPanel: !this.state.hideforceSettingPanel
		});
		var that = this;
		setTimeout(function(){
			var flag = that.state.hideforceSettingPanel;
			if(flag){
				$("#forceSettingPanel1").css('bottom', '-1rem');
				$("#forceSettingPanel2").css('right', '-1.99rem');
			}else{
				$("#forceSettingPanel1").css('bottom', '1.19rem');
				$("#forceSettingPanel2").css('right', '0.2rem');
			}
		},100)
	}
	//== 清空力图
	execClearForce(){
		clearGraphState();
	}
	//== 撤销上一步操作
	execRedoPrevOper(){
		renderGraphByRedo();
	}
	//== 显示公司全称
	execShowCompsFullName(){
		this.setState({
			compsFullName: !this.state.compsFullName
		});
		var that = this;
		setTimeout(function(){
			toggleDisplayCompanyName(that.state.compsFullName);
		}, 100);
	}
	//== 显示投资比例
	execShowInvestPercent(){
		this.setState({
			investPercent: !this.state.investPercent
		});
		var that = this;
		setTimeout(function(){
			toggleDisplayInvestPercent(that.state.investPercent);
		}, 100);
	}
	//== 智能分析
	execSmartAnalyse(){
		smartAnalyse();
	}
	//== 筛选显示
	execFilterInvest(){
		this.setState({
			filterInvest: !this.state.filterInvest
		});
		var that = this;
		setTimeout(function(){
			store.dispatch({ type: 'UPDATE_FILTERINVEST', data:that.state.filterInvest });
			renderGraphByFilter();
		}, 100);
	}
	execFilterOwner(){
		this.setState({
			filterOwner: !this.state.filterOwner
		});
		var that = this;
		setTimeout(function(){
			store.dispatch({ type: 'UPDATE_FILTEROWNER', data:that.state.filterOwner });
			renderGraphByFilter();
		}, 100);
	}
	execFilterServe(){
		this.setState({
			filterServe: !this.state.filterServe
		});
		var that = this;
		setTimeout(function(){
			store.dispatch({ type: 'UPDATE_FILTERSERVE', data:that.state.filterServe });
			renderGraphByFilter();
		}, 100);
	}

  	render() {
  		var that = this;
  		var value = this.state.searchValue;
  		var compList = this.state.searchCompList;
	    return (
	    	<section id='family-tree'>
	    		<header className='family-tree-header' id="family-tree-header">
	    			<div className='arrow-icon header-icon' onTouchEnd={this.showLeftPanel.bind(this)}>
	    				<span className={classNames({'glyphicon':true, 'glyphicon-chevron-right':this.state.hideLeftPanel, 'glyphicon glyphicon-chevron-left': !this.state.hideLeftPanel})}></span>
	    			</div>
	    			<form role="form" className={classNames({'searchFormHide':this.state.hideBox})}>
	    			  	<div className="form-group">
	    			    	<input autoComplete="off" type="text" className="form-control" id="family-tree-search" placeholder="请输入关键字" value={value} onChange={this.handleInputChange.bind(this)}/>
	    			  	</div>
	    			</form>
	    			<div className={classNames({"keywordSearchSuggest":true, 'keywordSearchSuggestHide':this.state.hideSearchCompList})} id="keywordSearchSuggest">
	    			    <ul className="list-unstyled">
	    			    	{
	    			    		compList.map(function(compName,key){
	    			    			return <li key={key} ref={'list'+key} onTouchEnd={that.getCompName.bind(this,compName,that)}>{compName}</li>;
	    			    		})
	    			    	}
	    			    </ul>
	    			</div>
	    			<div className='search-icon header-icon' onTouchEnd={this.showSearchBox.bind(this)}><span className="glyphicon glyphicon-search"></span></div>
	    		</header>
	    		<div className='main'>
	    			<div id='vizContainer'></div>
	    		</div>
	    		<div id='nodeOper'>
    				<div className="btn-group">
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execLoadData.bind(this)}><span className="glyphicon glyphicon-plus"></span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execRemoveNode.bind(this)}><span className="glyphicon glyphicon-minus"></span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execHideNodeOper.bind(this)}><span className="glyphicon glyphicon-remove"></span></button>
	    			</div>
    			</div>
	    		<div id='forceSetting' onTouchEnd={this.forceSetting.bind(this)}>
	    			<span className="glyphicon glyphicon-cog"></span>
	    		</div>
	    		<div id='forceSettingPanel1'>
    				<div className="btn-group">
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execFilterInvest.bind(this)}><span className={classNames({'glyphicon':true, 'glyphicon-eye-open':this.state.filterInvest, 'glyphicon glyphicon-eye-close': !this.state.filterInvest})}></span><span>投资</span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execFilterOwner.bind(this)}><span className={classNames({'glyphicon':true, 'glyphicon-eye-open':this.state.filterOwner, 'glyphicon glyphicon-eye-close': !this.state.filterOwner})}></span><span>法人</span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execFilterServe.bind(this)}><span className={classNames({'glyphicon':true, 'glyphicon-eye-open':this.state.filterServe, 'glyphicon glyphicon-eye-close': !this.state.filterServe})}></span><span>任职</span></button>
	    			</div>
	    		</div>
	    		<div id='forceSettingPanel2'>
	    			<div className="btn-group-vertical">
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execRedoPrevOper.bind(this)}><span className="glyphicon glyphicon-repeat"></span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execClearForce.bind(this)}><span className="glyphicon glyphicon-trash"></span></button>
	    			    <button type="button" className={classNames({'btn':true, 'btn-default':true, 'smartBtnHighLight': store.getState().smartStatus})} onTouchEnd={this.execSmartAnalyse.bind(this)}><span className="glyphicon glyphicon-flash"></span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execShowCompsFullName.bind(this)}><span className={classNames({'glyphicon':true, 'glyphicon-eye-open':this.state.compsFullName, 'glyphicon glyphicon-eye-close':!this.state.compsFullName})}></span></button>
	    			    <button type="button" className="btn btn-default" onTouchEnd={this.execShowInvestPercent.bind(this)}><span className="glyphicon glyphicon-usd"></span></button>
	    			</div>
	    		</div>
	    		<div id='leftPanel'>
	    			<ul className='leftPanelNavList'>
	    				<li className={classNames({'selectedLi':!this.state.hideCompInfoDiv})} onTouchEnd={this.showCompInfoDiv.bind(this)}>工商</li>
	    				<li className={classNames({'selectedLi':!this.state.hideCompLawDiv})} onTouchEnd={this.showCompLawDiv.bind(this)}>司法</li>
	    				<li className={classNames({'selectedLi':!this.state.hideCompRiskHintDiv})} onTouchEnd={this.showCompRiskHintDiv.bind(this)}>风险提示</li>
	    				<li className={classNames({'selectedLi':!this.state.hideCompRelatedRiskHintDiv})} onTouchEnd={this.showCompRelatedRiskHintDiv.bind(this)}>关联风险</li>
	    			</ul>
	    			
	    			<div className={classNames({'hideDiv': this.state.hideCompInfoDiv})}>
	    				<div className="panel-group accordion" id="accordion">
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne">工商登记信息</a></h4>
	    				        </div>
	    				        <div id="collapseOne" className="panel-collapse collapse in">
	    				            <div className="panel-body">
	            	    				<table className="table compinfoTable">
	            	    					<tbody>
	            	    						<tr>
	            		    						<td>公司名称</td>
	            		    						<td>{this.state.basicInfo['公司名称'] || ''}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立时间</td>
	            		    						<td>{this.state.basicInfo['成立时间'] || ''}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>登记/经营状态</td>
	            		    						<td>{this.state.basicInfo['登记状态'] || ''}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本</td>
	            		    						<td>{this.state.basicInfo['注册资本'] || ''}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册号</td>
	            		    						<td>{this.state.basicInfo['注册号'] || ''}</td>
	            		    					</tr>
	            		    				</tbody>
	            	    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo">股东</a></h4>
	    				        </div>
	    				        <div id="collapseTwo" className="panel-collapse collapse">
	    				            <div className="panel-body">
	    				            	<table className="table shareholder">
	    				            		<tbody>
						    					<tr>
						    						<td>股东类型</td>
						    						<td>股东</td>
						    					</tr>
						    					{
						    						this.state.shareholder.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['Shareholder_Info:shareholder_type']}</td>
					    										<td>{d['Shareholder_Info:shareholder_name']}</td>
					    									</tr>
					    								)
					    							})
						    					}
	    				            		</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse"data-parent="#accordion"href="#collapseThree">变更</a></h4>
	    				        </div>
	    				        <div id="collapseThree" className="panel-collapse collapse">
	    				            <div className="panel-body ">
	    				            	<table  className="table changed">
					    					<tbody>
					    						<tr>
					    							<td>变更日期</td>
					    							<td>变更事项</td>
					    						</tr>
					    						{
						    						this.state.changed.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['Changed_Announcement:changedannouncement_date']}</td>
					    										<td>{d['Changed_Announcement:changedannouncement_events']}</td>
					    									</tr>
					    								)
					    							})
						    					}
					    					</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse"data-parent="#accordion"href="#collapseFour">主要成员</a></h4>
	    				        </div>
	    				        <div id="collapseFour" className="panel-collapse collapse">
	    				            <div className="panel-body">
	    				            	<table className="table keypersonTable">
					    					<tbody>
					    						<tr>
					    							<td>姓名</td>
					    							<td>职务</td>
					    						</tr>
					    						{
					    							this.state.keyPerson.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['KeyPerson_Info:keyperson_name']}</td>
					    										<td>{d['KeyPerson_Info:keyperson_position']}</td>
					    									</tr>
					    								)
					    							})
					    						}
					    					</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				</div>
	    			</div>
	    			<div className={classNames({'hideDiv': this.state.hideCompLawDiv})}>
	    				<div className="panel-group accordion" id="accordion2">
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse" data-parent="#accordion2" href="#collapse2One">司法文书</a></h4>
	    				        </div>
	    				        <div id="collapse2One" className="panel-collapse collapse in">
	    				            <div className="panel-body">
	            	    				<table className="table legalTable">
	            	    					<tbody>
	            	    						<tr>
	            		    						<td>判决时间</td>
	            		    						<td>诉讼类型</td>
	            		    						<td>案件名称</td>
	            		    					</tr>
	            		    					{
	            		    						this.state.legalInfo.map((d,i)=>{
		            		    						return (
						    									<tr key={i}>
						    										<td>{d['判决时间']}</td>
						    										<td>{d['诉讼类型']}</td>
						    										<td>{d['案件名称']}</td>
						    									</tr>
						    								)
		            		    					})
	            		    					}
	            		    				</tbody>
	            	    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse" data-parent="#accordion2" href="#collapse2Two">开庭公告</a></h4>
	    				        </div>
	    				        <div id="collapse2Two" className="panel-collapse collapse">
	    				            <div className="panel-body">
	    				            	<table className="table courtAnnounInfo">
	    				            		<tbody>
						    					<tr>
						    						<td>公告日期</td>
						    						<td>公告内容</td>
						    					</tr>
						    					{
						    						this.state.courtAnnounInfo.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['bltin:pub_date']}</td>
					    										<td>{d['bltin:blt_content']}</td>
					    									</tr>
					    								)
					    							})
						    					}
	    				            		</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse"data-parent="#accordion2"href="#collapse2Three">被执行</a></h4>
	    				        </div>
	    				        <div id="collapse2Three" className="panel-collapse collapse">
	    				            <div className="panel-body ">
	    				            	<table  className="table executed">
					    					<tbody>
					    						<tr>
					    							<td>立案时间</td>
					    							<td>案号</td>
					    						</tr>
					    						{
						    						this.state.executed.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['beizhixing:sj']}</td>
					    										<td>{d['beizhixing:ah']}</td>
					    									</tr>
					    								)
					    							})
						    					}
					    					</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse"data-parent="#accordion2"href="#collapse2Four">失信被执行</a></h4>
	    				        </div>
	    				        <div id="collapse2Four" className="panel-collapse collapse">
	    				            <div className="panel-body">
	    				            	<table className="table dishonestExecuted">
					    					<tbody>
					    						<tr>
					    							<td>立案时间</td>
					    							<td>履行情况</td>
					    						</tr>
					    						{
					    							this.state.dishonestExecuted.map((d,i)=>{
					    								return (
					    									<tr key={i}>
					    										<td>{d['shixin:fbsj']}</td>
					    										<td>{d['shixin:lxqk']}</td>
					    									</tr>
					    								)
					    							})
					    						}
					    					</tbody>
					    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				</div>
	    			</div>
	    			<div id='riskHint' className={classNames({'hideDiv': this.state.hideCompRiskHintDiv})}>
	    				<h5>{this.state.radarCompName}</h5>
	    				<h6>{this.state.radarRiskLevel}</h6>
	    				<div id='radarContainer'></div>
	    			</div>
	    			<div className={classNames({'hideDiv': this.state.hideCompRelatedRiskHintDiv})}>
	    				<div className="panel-group accordion" id="accordion4">
	    				    <div className="panel panel-default">
	    				        <div className="panel-heading">
	    				            <h4 className="panel-title"><a data-toggle="collapse" data-parent="#accordion4" href="#collapse4One">关联风险提示</a></h4>
	    				        </div>
	    				        <div id="collapse4One" className="panel-collapse collapse in">
	    				            <div className="panel-body">
	            	    				<table className="table riskInfos">
	            	    					<tbody>
	            	    						<tr>
	            		    						<td>关联企业数量</td>
	            		    						<td>{store.getState().riskInfo.analyse['associateCompanyNumber']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本少于100万</td>
	            		    						<td>{store.getState().riskInfo.analyse['capitalLessOneMillion']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本100～500万	</td>
	            		    						<td>{store.getState().riskInfo.analyse['capitalOneToFiveMillion']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本500～1000万</td>
	            		    						<td>{store.getState().riskInfo.analyse['capitalFiveToTenMillion']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本1000万～1亿</td>
	            		    						<td>{store.getState().riskInfo.analyse['capitalTenToHunderdMillion']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>注册资本大于1亿</td>
	            		    						<td>{store.getState().riskInfo.analyse['capitalMoreThanHunderdMillion']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立1年以内</td>
	            		    						<td>{store.getState().riskInfo.analyse['underOneYear']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立1~3年	</td>
	            		    						<td>{store.getState().riskInfo.analyse['oneToThreeYear']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立3~5年	</td>
	            		    						<td>{store.getState().riskInfo.analyse['threeToFiveYear']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立5~8年	</td>
	            		    						<td>{store.getState().riskInfo.analyse['fiveToEightYear']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>成立8年以上</td>
	            		    						<td>{store.getState().riskInfo.analyse['moreThanEightYear']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>高风险企业</td>
	            		    						<td>{store.getState().riskInfo.analyse['highRisk']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>中风险企业</td>
	            		    						<td>{store.getState().riskInfo.analyse['normalRisk']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>低风险企业</td>
	            		    						<td>{store.getState().riskInfo.analyse['lowRisk']}</td>
	            		    					</tr>
	            		    					<tr>
	            		    						<td>安全企业</td>
	            		    						<td>{store.getState().riskInfo.analyse['safe']}</td>
	            		    					</tr>
	            		    				</tbody>
	            	    				</table>
	    				            </div>
	    				        </div>
	    				    </div>
	    				</div>
	    			</div>
	    		</div>
	    	</section>
	    );
  	}
}

export { FamilyTree }


/*== 发送关键词搜索公司 ==*/
function sendKeyWordToBack(keyword,that){
	$.post("../Access/linkage/data",
	   {
	       	//传递参数
	       	keyword:keyword,   //表单内需要发送的关键字
	       	rows: 5,    //需要后端返回的条数
	       	columns:'Registered_Info:enterprisename', //查询公司名称
	       	ishighlight: '', //是否高亮
	       	type: 'true'
	   },
	   function(data,status){
	       	var rawData = data.data;
	       	var searchSuggestBackData = [];
	       	for(var i=1; i<rawData.length; i++){
	            searchSuggestBackData.push(rawData[i].enterprisename);
	       	}
	       	console.log(searchSuggestBackData);
	       	that.setState({
	    		searchCompList:searchSuggestBackData
	       	});
	   },
	   'json'
	);
}

/*== start 拓扑图处理程序 ================================================================*/


/*== start 设置全局变量 =================================================================*/

//== 存储筛选功能需要的数据
var dataStore = createDataStore('dataStore');

//== 存放数据快照，每次存放一个二维数组，同时存储寄存数据对象dataStore和绘图缓冲数据对象dataSelected
var parallelStack = createDataStoreStack();

// 顶级对象，用于挂载各类全局配置参数@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var globalConfig = {};
// 是否筛选渲染模式，用于renderforce绘图函数，目的是支持合并节点的部分渲染功能
globalConfig.isFilterRenderMode = false;

var wordCloudRootNodesId; // 存储词云根节点ID
var wordCloudCoor = {
    x: 0,
    y: 0
}; // 词云节点坐标

// 公司节点全名标签的透明度，控制新载入节点
var showFullNodesLables = 0;

// 投资比例标签得透明度，控制新栽入节点
var showInvestPercent = 0;

// 投资比例标签得透明度，控制新栽入节点
var showInvestPercent = 0;

var nodesColor = {
    company: '#68BDF6',
    people: '#6DCE9E',
    other: '#ccc',
    highRisk: 'red',
    middleRisk: 'orange',
    lowRisk: '#d6dd3a',
    safe: 'green',
    invest: '#666',
    legalRepre: '#ff7567',
    serve: '#2fafc6'
}

// 棱镜一下是否高亮
var smartAnalyseDataStore = null;
var smartAnalyseHighLight = {
    yes: false,
    no: true
};
var smartPostParameter = {
    CompanyIdPersonName2PersonIdText: '',
    Old2NewText: '',
    PersonIdArr1Text: ''
}
var saveSmartAnalyseRelationship = [];

//== 节点显示操作台定时器
var nodeOperTimer = null;

//== 定义力导图的一个实例
var forceInstance = null;

/*== start 设置全局变量 =================================================================*/

/*== start 数据处理函数 ==============================================================*/

//start 数据存储器定义 ================================
function createDataStore(store) {
    // 存储力图结构数据
    var store = {};

    // properties ---------------------------------
    // 节点名字堆、关系id堆
    store.nodesIdSet = d3.set();
    store.linksIdSet = d3.set();
    // 初始节点和关系
    store.nodes = [];
    store.links = [];
    // 存储搜索的中心目标节点
    store.searchTargetNode = d3.set();
    // 记录被合并的节点和关系的id
    store.mergedNodesIdSet = d3.set();
    store.mergedLinksIdSet = d3.set();
    //  设置存储画布的缩放和偏移位置
    store.scaleTransformRecord = {};
    store.scaleTransformRecord.offsetX = 0; //初始化偏移
    store.scaleTransformRecord.offsetY = 0; //初始化偏移
    store.scaleTransformRecord.zoomScale = 1; //初始化缩放
    store.scaleTransformRecord.scaleRatio = 1; //初始化相对缩放比例

    //methonds -----------------------------------
    // 清空重置节点数据方法，通过每次搜索触发
    store.resetDataStore = resetDataStore;
    // 增加数据方法，每次搜索、探索节点触发
    store.addData = addDataStore;
    // 删除数据方法，右击节点选择菜单触发
    store.removeData = removeDataStore;
    // 清除筛选之后删除数据残留的无头关系、游离节点
    store.cleanRemoveData = cleanRemoveData;
    //  设置存储搜索的中心目标节点
    store.setSearchTargetNode = setSearchTargetNode;
    // 记录偏移量
    store.setTransformOffset = setTransformOffset;
    // 记录缩放比例
    store.setZoomScale = setZoomScale;
    // 记录相对缩放比例
    store.setScaleRatio = setScaleRatio;
    // 记录智能合并节点id
    store.addMergedNodesId = addMergedNodesId;
    // 记录智能合并关系id
    store.addMergedLinksId = addMergedLinksId;

    return store;

    // 清空重置节点数据方法，通过每次搜索触发
    function resetDataStore() {
        // 节点名字堆、关系id堆
        this.nodesIdSet = d3.set();
        this.linksIdSet = d3.set();
        // 初始节点和关系
        this.nodes = [];
        this.links = [];
        // 存储搜索的中心目标节点
        this.searchTargetNode = d3.set();
        // 清空记录被合并的节点和关系的id@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        this.mergedNodesIdSet = d3.set();
        this.mergedLinksIdSet = d3.set();
        //  设置存储画布的缩放和偏移位置
        this.scaleTransformRecord = {};
        this.scaleTransformRecord.offsetX = 0; //初始化偏移
        this.scaleTransformRecord.offsetY = 0; //初始化偏移
        this.scaleTransformRecord.zoomScale = 1; //初始化缩放
        this.scaleTransformRecord.scaleRatio = 1; //初始化相对缩放比例
    }
    // 增加数据方法，每次搜索、探索节点触发
    function addDataStore(newForceData) {
        // 闭包传不了外部this，要重新命名传入
        var thisDataStore = this; //avoid clousure problem for 'this'
        // 载入节点数据
        newForceData.nodes.forEach(function(n) {
            thisDataStore.nodes.push(n);
        });
        // 载入关系数据
        newForceData.links.forEach(function(l) {
            thisDataStore.links.push(l);
        });

        // console.log('info from dataStore addDataStore method:');
        // console.log(this);
    }
    // 删除数据方法，右击节点选择菜单触发
    function removeDataStore(idArray) {
        // 分三步实现
        // 1、删除目标节点id，过滤出剩下的节点
        // 2、根据剩下的节点，筛选出两端都存在节点的关系
        // 3、根据剩下的关系两端节点形成新节点set，删除掉游离节点

        if(idArray.length == 0) {
            return;
        }

        // 闭包传不了外部this，要重新命名传入
        var thisDataStore = this; //avoid clousure problem for 'this'
        // console.log('未删除数据之前的datastore');
        // console.log(thisDataStore);
        // console.log('links id set: ' + thisDataStore.linksIdSet.values());

        //1、删除目标节点id，过滤出剩下的节点
        // 先删除不需要的节点id
        idArray.forEach(function(removeId) {
            thisDataStore.nodesIdSet.remove(removeId);
        });
        // 根据留存的节点id过滤出剩下的节点
        var newNodeArray = thisDataStore.nodes.filter(function(node) {
            return thisDataStore.nodesIdSet.has(node.id);
        });
        // 重新定义节点数组
        thisDataStore.nodes = newNodeArray;

        // 2、根据剩下的节点，筛选出两端都存在节点的关系
        //根据节点筛选边
        var newLinkArray = thisDataStore.links.filter(function(link) {
            return thisDataStore.nodesIdSet.has(link.startNode) && thisDataStore.nodesIdSet.has(link.endNode);
        });

        // 需要从linksIdSet删除已经不存在的边 @@@@@@@@@@@@@@@@@@@@@
        var newLinksIdSet = d3.set();
        newLinkArray.forEach(function(l) {
            if (!newLinksIdSet.has(l.id)) {
                newLinksIdSet.add(l.id);
            }
        });

        // // 3、根据剩下的关系两端节点形成新节点set，删除掉游离节点，并更新idset和nodearry
        // //需要删除游离的节点@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // //根据边，如果有节点不在边的两端点形成的堆里，判定是游离节点，则删除它
        // var inConnectionNodesIdSet = d3.set();
        // newLinkArray.forEach(function(l) {
        //     if (!inConnectionNodesIdSet.has(l.id)) {
        //         inConnectionNodesIdSet.add(l.id);
        //     }
        // });
        //
        // var inConnectionNodes = newNodeArray.filter(function(node) {
        //     return inConnectionNodesIdSet.has(node.id);
        // });
        //
        // thisDataStore.nodesIdSet = inConnectionNodesIdSet;
        // thisDataStore.nodes = inConnectionNodes;

        // 重新定义LinksIdSet
        thisDataStore.linksIdSet = newLinksIdSet;
        // 重新定义节点数组
        thisDataStore.links = newLinkArray;

        // console.log('删除数据之后的datastore');
        // console.log(thisDataStore);
        // console.log('links id set: ' + thisDataStore.linksIdSet.values());
    }
    //  设置存储搜索的中心目标节点
    function setSearchTargetNode(targetNode) {
        if(targetNode) {
            // this.searchTargetNode = targetNode;
            this.searchTargetNode.add(targetNode);
        }
    }
    // 记录偏移量
    function setTransformOffset(offsetX, offsetY) {
        if (offsetX != 0 || offsetY != 0) {
            this.scaleTransformRecord.offsetX = offsetX;
            this.scaleTransformRecord.offsetY = offsetY;
        }
    }
    // 记录缩放比例
    function setZoomScale(zoomScale) {
        if (zoomScale != 1) {
            this.scaleTransformRecord.zoomScale = zoomScale;
        }
    }

    // 记录相对缩放比例
    function setScaleRatio(zoomScaleRatio) {
        if (zoomScaleRatio) {
            this.scaleTransformRecord.zoomScaleRatio = zoomScaleRatio;
        }
    }
    // 清除筛选之后删除数据残留的无头关系、游离节点
    function cleanRemoveData() {
        //not yet
    }

    // 增加被合并的节点id
    function addMergedNodesId(idArray) {
        // 闭包传不了外部this，要重新命名传入
        var thisDataStore = this; //avoid clousure problem for 'this'

        idArray.forEach(function(id) {
            if (!thisDataStore.mergedNodesIdSet.has(id)) {
                thisDataStore.mergedNodesIdSet.add(id);
            }
        })
    }

    // 增加被合并的边id
    function addMergedLinksId(idArray) {
        // 闭包传不了外部this，要重新命名传入
        var thisDataStore = this; //avoid clousure problem for 'this'

        idArray.forEach(function(id) {
            if (!thisDataStore.mergedLinksIdSet.has(id)) {
                thisDataStore.mergedLinksIdSet.add(id);
            }
        })
    }
}
//end 数据存储器定义 =============================

// start 定义堆栈存储datastore与绘图缓冲dataIndexed ========
function createDataStoreStack() {
    var dataStoreStack = {};
    // 构建堆栈
    dataStoreStack.stack = [];
    // 撤销标记，如果为真，则renderForce函数不存储数据对象
    dataStoreStack.isRedoMode = false;
    // 压入数据
    dataStoreStack.pushData = function(dataStore, renderCacheData) {
        var deepCopyedDataStore = deepCopyDataStore(dataStore);
        var deepCopyedRenderCacheData = deepCopyDataStore(renderCacheData);

        var dataStoreArray = [deepCopyedDataStore, deepCopyedRenderCacheData];

        this.stack.push(dataStoreArray);
    }

    // 计算堆栈长度
    dataStoreStack.getLength = function() {
        return this.stack.length;
    }

    // 抛出数据
    dataStoreStack.popData = function() {
        this.stack.pop();
    }

    // reset stack
    dataStoreStack.resetData = function() {
        this.stack = [];
        this.isRedoMode = false;
    }

    return dataStoreStack;
}
// end 定义堆栈存储datastore与绘图缓冲dataIndexed ========

//start 深拷贝dataStore对象，以备压入dataStoreStack =====
function deepCopyDataStore(dataStore) {
    var tmpDataStore = {};
    // 深拷贝节点id堆
    tmpDataStore.nodesIdSet = d3.set();

    var nodesIdSetArray = dataStore.nodesIdSet.values();

    nodesIdSetArray.forEach(function(nodeId) {
        tmpDataStore.nodesIdSet.add(nodeId);
    });

    tmpDataStore.linksIdSet = d3.set();

    // 深拷贝关系id堆
    var linksIdSetArray = dataStore.linksIdSet.values();

    linksIdSetArray.forEach(function(linkId) {
        tmpDataStore.linksIdSet.add(linkId);
    });

    // 合并节点id
    tmpDataStore.mergedNodesIdSet = d3.set();
    var mergedNodesIdSetArray = dataStore.mergedNodesIdSet.values();
    mergedNodesIdSetArray.forEach(function(id) {
        tmpDataStore.mergedNodesIdSet.add(id);
    });

    // 合并关系id
    tmpDataStore.mergedLinksIdSet = d3.set();
    var mergedLinksIdSetArray = dataStore.mergedLinksIdSet.values();
    mergedLinksIdSetArray.forEach(function(id) {
        tmpDataStore.mergedLinksIdSet.add(id);
    });

    // 初始节点和关系
    tmpDataStore.nodes = [];
    dataStore.nodes.forEach(function(n) {
        tmpDataStore.nodes.push(n);
    });

    tmpDataStore.links = [];
    dataStore.links.forEach(function(l) {
        tmpDataStore.links.push(l);
    });

    // 节点对应表也要更新，虽然是在datastore之外添加的属性，现在看来属于设计缺陷@@@@@@@@@@
    tmpDataStore.idNodesDict = {};
    tmpDataStore.nodes.forEach(function(n) {
        tmpDataStore.idNodesDict[n.id] = n;
    });

    // 存储搜索的中心目标节点
    tmpDataStore.searchTargetNode = dataStore.searchTargetNode;
    //  设置存储画布的缩放和偏移位置
    var scaleTransformRecord = dataStore.scaleTransformRecord;
    tmpDataStore.scaleTransformRecord = scaleTransformRecord;

    var offsetX = dataStore.scaleTransformRecord.offsetX;
    tmpDataStore.scaleTransformRecord.offsetX = offsetX; //初始化偏移

    var offsetY = dataStore.scaleTransformRecord.offsetY;
    tmpDataStore.scaleTransformRecord.offsetY = offsetY; //初始化偏移

    var zoomScale = dataStore.scaleTransformRecord.zoomScale;
    tmpDataStore.scaleTransformRecord.zoomScale = zoomScale; //初始化缩放

    var scaleRatio = dataStore.scaleTransformRecord.scaleRatio;
    tmpDataStore.scaleTransformRecord.scaleRatio = scaleRatio; //初始化相对缩放比例

    // 方法保留------------------
    //methonds -----------------------------------
    // 清空重置节点数据方法，通过每次搜索触发
    tmpDataStore.resetDataStore = dataStore.resetDataStore;
    // 增加数据方法，每次搜索、探索节点触发
    tmpDataStore.addData = dataStore.addData;
    // 删除数据方法，右击节点选择菜单触发
    tmpDataStore.removeData = dataStore.removeData;
    //  设置存储搜索的中心目标节点
    tmpDataStore.setSearchTargetNode = dataStore.setSearchTargetNode;
    // 记录偏移量
    tmpDataStore.setTransformOffset = dataStore.setTransformOffset;
    // 记录缩放比例
    tmpDataStore.setZoomScale = dataStore.setZoomScale;
    // 记录相对缩放比例
    tmpDataStore.setScaleRatio = dataStore.setScaleRatio;

    tmpDataStore.addMergedNodesId = dataStore.addMergedNodesId;
    tmpDataStore.addMergedLinksId = dataStore.addMergedLinksId;

    return tmpDataStore;
}
//end 深拷贝dataStore对象，以备压入dataStoreStack =====

// start 堆栈操作datastore ======================
function setDataStoreStack(dataStoreStack, dataStore) {
    var tmpDataStore = {};
    // var tmpDataStore = createDataStore('tmpDataStore');

    // for(var key in dataStore) {
    //     tmpDataStore[key] = dataStore[key];
    // }
    // 节点名字堆、关系id堆
    // tmpDataStore.nodesIdSet = dataStore.nodesIdSet;
    // tmpDataStore.linksIdSet = dataStore.linksIdSet;
    tmpDataStore.nodesIdSet = d3.set();
    var nodesIdSetArray = dataStore.nodesIdSet.values();
    nodesIdSetArray.forEach(function(nodeId) {
        tmpDataStore.nodesIdSet.add(nodeId);
    });

    tmpDataStore.linksIdSet = d3.set();
    var linksIdSetArray = dataStore.linksIdSet.values();
    linksIdSetArray.forEach(function(nodeId) {
        tmpDataStore.linksIdSet.add(nodeId);
    });
    // 初始节点和关系
    tmpDataStore.nodes = [];
    dataStore.nodes.forEach(function(n) {
        tmpDataStore.nodes.push(n);
    });

    // 节点对应表也要更新，虽然是在datastore之外添加的属性，现在看来属于设计缺陷@@@@@@@@@@
    tmpDataStore.idNodesDict = {};
    tmpDataStore.nodes.forEach(function(n) {
        tmpDataStore.idNodesDict[n.id] = n;
    });

    tmpDataStore.links = [];
    dataStore.links.forEach(function(n) {
        tmpDataStore.links.push(n);
    });
    // // 节点对应表也要更新，虽然是在datastore之外添加的属性，现在看来属于设计缺陷@@@@@@@@@@
    // tmpDataStore.idNodesDict = {};
    //
    // for (var key in dataStore.idNodesDict) {
    //     tmpDataStore.idNodesDict[key] = dataStore.idNodesDict[key];
    // }

    // 存储搜索的中心目标节点
    tmpDataStore.searchTargetNode = dataStore.searchTargetNode;
    //  设置存储画布的缩放和偏移位置
    var scaleTransformRecord = dataStore.scaleTransformRecord;
    tmpDataStore.scaleTransformRecord = scaleTransformRecord;
    var offsetX = dataStore.scaleTransformRecord.offsetX;
    tmpDataStore.scaleTransformRecord.offsetX = offsetX; //初始化偏移
    var offsetY = dataStore.scaleTransformRecord.offsetY;
    tmpDataStore.scaleTransformRecord.offsetY = offsetY; //初始化偏移
    var zoomScale = dataStore.scaleTransformRecord.zoomScale;
    tmpDataStore.scaleTransformRecord.zoomScale = zoomScale; //初始化缩放
    var scaleRatio = dataStore.scaleTransformRecord.scaleRatio;
    tmpDataStore.scaleTransformRecord.scaleRatio = scaleRatio; //初始化相对缩放比例

    // 方法保留------------------
    //methonds -----------------------------------
    // 清空重置节点数据方法，通过每次搜索触发
    tmpDataStore.resetDataStore = dataStore.resetDataStore;
    // 增加数据方法，每次搜索、探索节点触发
    tmpDataStore.addData = dataStore.addData;
    // 删除数据方法，右击节点选择菜单触发
    tmpDataStore.removeData = dataStore.removeData;
    //  设置存储搜索的中心目标节点
    tmpDataStore.setSearchTargetNode = dataStore.setSearchTargetNode;
    // 记录偏移量
    tmpDataStore.setTransformOffset = dataStore.setTransformOffset;
    // 记录缩放比例
    tmpDataStore.setZoomScale = dataStore.setZoomScale;
    // 记录相对缩放比例
    tmpDataStore.setScaleRatio = dataStore.setScaleRatio;

    dataStoreStack.push(tmpDataStore);
}
// end 堆栈操作datastore ======================

//start 原始数据转换为节点－边形式 =================
function iniForceData(rawData) {
    var forceData = {};
    forceData.links = [];
    forceData.nodes = [];

    forceData.nodesIdSet = d3.set();
    forceData.linksIdSet = d3.set();
    // 建立id和节点对应表
    forceData.idNodesDict = {};

    rawData.forEach(function(item) {
        // 节点原始数据组
        var rawNodesArray = item.graph.nodes;
        // console.log(rawNodesArray);
        // 将没出现过的节点压入绘图容器
        rawNodesArray.forEach(function(rawNode) {
            // console.log(rawNode.id);
            if (!forceData.nodesIdSet.has(rawNode.id)) {
                // 加入节点
                forceData.nodesIdSet.add(rawNode.id);
                forceData.nodes.push(rawNode);
                // 加入节点id对应堆
                forceData.idNodesDict[rawNode.id] = rawNode;
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

    return forceData;
}
//end 原始数据转换为节点－边形式 ===================

// start 为dataStore增加新的下探数据=====
function addExploreDataToStore(forceExploreData, dataStore) {
    // 将新下探数据压入绘图数据容器
    forceExploreData.links.forEach(function(l) {
        // 压入links到新数据对象
        if (!dataStore.linksIdSet.has(l.id)) {
            // 压入新关系数据到绘图数据容器
            dataStore.linksIdSet.add(l.id);
            dataStore.links.push(l);
        }
        // 压入links两端的nodes到新数据对象
        if (!dataStore.nodesIdSet.has(l.startNode)) {
            dataStore.nodesIdSet.add(l.startNode);

            var sourceNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                return n.id == l.startNode;
            });
            // 将节点添加到id和节点对应堆
            dataStore.idNodesDict[l.startNode] = sourceNodeFiltedArray[0];

            // console.log(sourceNodeFiltedArray[0]);
            dataStore.nodes.push(sourceNodeFiltedArray[0]);
        }
        // 压入links两端的nodes到新数据对象
        if (!dataStore.nodesIdSet.has(l.endNode)) {
            dataStore.nodesIdSet.add(l.endNode)

            var targetNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                return n.id == l.endNode;
            });

            // 将节点添加到id和节点对应堆
            dataStore.idNodesDict[l.endNode] = targetNodeFiltedArray[0];

            // console.log(targetNodeFiltedArray[0]);
            dataStore.nodes.push(targetNodeFiltedArray[0]);
        }
    });
    //判断去除游离的点
    // 获取所有连线的开始节点与结束节点的id号
    var getStartEndNodeIdSet = d3.set();
    dataStore.links.forEach(function(l){
        if(!getStartEndNodeIdSet.has(l.startNode)){
            getStartEndNodeIdSet.add(l.startNode);
        }
        if(!getStartEndNodeIdSet.has(l.endNode)){
            getStartEndNodeIdSet.add(l.endNode);
        }
    })
    dataStore.nodes = dataStore.nodes.filter(function(n){
        if(!getStartEndNodeIdSet.has(n.id)){
            dataStore.nodesIdSet.remove(n.id);
            delete dataStore.idNodesDict[n.id];
        }
        return getStartEndNodeIdSet.has(n.id);
    })
}
// end 为dataStore增加新的下探数据=====

// 为了解决节点之间有重叠关系线
// start 存储重叠关系查询表==============================
function createLinksArcTable(data, dataIndexed) {
    // 为外部存dataIndexed添加储重叠关系查询表属性
    dataIndexed.linksArcTable = {};

    data.links.forEach(function(link) {
        var startNodeNumber = +link.startNode; //数字化开始节点的id
        var endNodeNumber = +link.endNode; //数字化结束节点的id
        var linkUniqId;// 节点之间唯一的共用关系标识符，指向一个数组，数组里存储重叠关系的各个id

        if (startNodeNumber < endNodeNumber) { //用小的id连接大的id，字符串，唯一标识符
            linkUniqId = link.startNode + link.endNode;
            // console.log(linkUniqId);
        } else {
            linkUniqId = link.endNode + link.startNode;
            // console.log(linkUniqId);
        }

        if(!dataIndexed.linksArcTable[linkUniqId]) {
            // 如果重叠关系查询表没有该关系的id，创建该id记录
            dataIndexed.linksArcTable[linkUniqId] = [];
            // 将关系id存入表的数组
            dataIndexed.linksArcTable[linkUniqId].push(link.id);
        } else {
            // 将关系id存入表的数组
            dataIndexed.linksArcTable[linkUniqId].push(link.id);
        }
    });
    // console.log("dataIndexed.linksArcTable:");
    // console.log(dataIndexed.linksArcTable);
}
// end 存储重叠关系查询表==============================

// 为了解决节点之间有重叠关系线
// start 添加节点关系共用标识符========================
function createUniqRelationId(link) {
    var startNodeNumber = +link.startNode; //数字化开始节点的id
    var endNodeNumber = +link.endNode; //数字化结束节点的id
    var linkUniqId;// 节点之间唯一的共用关系标识符，指向一个数组，数组里存储重叠关系的各个id

    if (startNodeNumber < endNodeNumber) { //用小的id连接大的id，字符串，唯一标识符
        linkUniqId = link.startNode + link.endNode;
        // console.log(linkUniqId);
    } else {
        linkUniqId = link.endNode + link.startNode;
        // console.log(linkUniqId);
    }

    return linkUniqId;
}
// end 添加节点关系共用标识符========================

//start 为节点－边数据添加力图索引 =================
function addIndex(data) {
    // 临时返回数据存放对象
    var dataIndexed = {};
    dataIndexed.nodesIdSet = data.nodesIdSet;
    dataIndexed.linksIdSet = data.linksIdSet;

    var nodesArray = []; //存放node的id，用于检索links两头的位置
    var inputDataNodes = data.nodes; //nodesData
    var inputDataLinks = data.links; //linksData
    var linkIndexed;

    // 为了解决节点之间有重叠关系线@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //存储重叠关系查询表
    createLinksArcTable(data, dataIndexed);

    // // 将风险数据传回模型挂载点
    // vm.$data.riskInfo = dataIndexed.riskInfo;
    // vm.$data.riskInfo = getNodeRiskInfo(dataIndexed, data);
    // console.log(dataIndexed.riskInfo);
    //== 每次重新渲染图形时异步更新关联风险模块内容
    getNodeRiskInfo(data);
    // end 风险信息收集 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    //存放node的id，用于检索links两头的位置
    for(var keys in inputDataNodes) {
        nodesArray.push(inputDataNodes[keys].id);
    }
    // 查找边两端节点位置，创建索引
    linkIndexed = inputDataLinks.map(function(link) {
        var sourceNode = link.startNode;
        var targetNode = link.endNode;

        var sourceIndex = nodesArray.indexOf(sourceNode);
        var targetIndex = nodesArray.indexOf(targetNode);


        // console.log("index：" + sourceNode + ":" + targetNode);
        // console.log("sourceIndex:" + sourceIndex);
        // console.log("targetIndex:" + targetIndex);
        // console.log("nodesArray" + JSON.stringify(nodesArray));

        // 为了解决节点之间有重叠关系线@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // 添加节点关系唯一标识符
        var linkUniqId = createUniqRelationId(link);

        return {source: sourceIndex, target: targetIndex, id: link.id, linkUniqId:linkUniqId, type: link.type, properties: link.properties};
    });

    dataIndexed.nodes = inputDataNodes;
    dataIndexed.links = linkIndexed;

    // console.log("linkIndexed");
    // console.log(linkIndexed);
    // console.log(inputDataNodes);
    return dataIndexed;
}
//end 为节点－边数据添加力图索引  ================

//start 单个公司搜索 =============================
function renderSearchData(queryCompanyName) {

    // 设置存储搜索的中心目标节点@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    dataStore.setSearchTargetNode(queryCompanyName);
    var queryCompany = queryCompanyName;

    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";

    // 生成载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // var animationLayer = createAnimationLayer();

    $.ajax({
        url:'../Access/function1AccessAjax', //datahub使用
        data:{
            // compNameAjax是接口设定的参数名称
            compNameAjax: queryCompany
        },
        type:'post',
        timeout: 120000,
        cache:false,  
        dataType:dataType,
        success:function(data){
            // console.log("success")
            // if (status != 'success') {
            //     // 这里的status，即使传输参数错误，也是返回success
            //     // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            //     d3.select('#animationLayer').remove();
            //     alert('服务器没有响应，请稍后再试');
            //     return;
            // }
            // results[0].data是返回json对象包含的提取数据入口
            var rawData = data.results[0].data;
            // console.log(rawData);
            // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            // d3.select('#animationLayer').remove();
            // 载入图形
            loadGraphViaSearch(rawData);
        },
        error: function(error){
            console.log(error);
            // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            d3.select('#animationLayer').remove();
            // alert('网络忙，请稍后再试');
        }
    })
}
//end 单个公司搜索 =============================

export function reloadLastGraph(){
	// console.log('reloadLastGraph');
	if(dataStore.nodes.length==0){
		return;
	}
	var svgWidth = document.getElementById('vizContainer').offsetWidth;
    // console.log(graphConfig.svgWidth);
    var headerHeight = document.getElementById('family-tree-header').offsetHeight;
    var footerHeight = document.getElementById('footerNav').offsetHeight;
    var svgHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
    // console.log(svgWidth);
    // console.log(svgHeight);
    // // svg和force涉及的参数设置
    var graphConfig = {svgWidth: svgWidth, svgHeight:svgHeight};

    // //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    // 创建svg画布
    var svg = d3.select("body")
        .select('#vizContainer') //暂时写死
        .append("svg")
        .attr('id', 'svgGraph')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 绘制背景白色，为了导出图片
    svg.append('rect')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'none')
        .style('fill', '#ebebeb');

    // 绘图数据容器
    var dataSelected = createDataStore('dataSelected');
    // 存储每个节点静止后的位置，用于确定新载入节点的初始位置
    dataSelected.nodesStaticPosition = {};

    // 渲染力图
    forceInstance = new renderForce(dataStore, dataSelected, graphConfig, svg);
}

// ！！！！！！这是搜索绘图函数@@@@@@@@@@@@@@@@@@@@
//start 调用数据处理器，绘图函数 =================
function loadGraphViaSearch(rawData) {
    //关闭词云
    // d3.select('.wordCloudBubbles').remove();
    // wordCloudBubbles = null;

    var svgWidth = document.getElementById('vizContainer').offsetWidth;
    // console.log(graphConfig.svgWidth);
    var headerHeight = document.getElementById('family-tree-header').offsetHeight;
    var footerHeight = document.getElementById('footerNav').offsetHeight;
    var svgHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
    // console.log(svgWidth);
    // console.log(svgHeight);
    // // svg和force涉及的参数设置
    var graphConfig = {svgWidth: svgWidth, svgHeight:svgHeight};

    // //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    // 创建svg画布
    var svg = d3.select("body")
        .select('#vizContainer') //暂时写死
        .append("svg")
        .attr('id', 'svgGraph')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 绘制背景白色，为了导出图片
    svg.append('rect')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'none')
        .style('fill', '#ebebeb');

    // 绘图数据容器
    var dataSelected = createDataStore('dataSelected');
    // 存储每个节点静止后的位置，用于确定新载入节点的初始位置
    dataSelected.nodesStaticPosition = {};

    //原始数据转为力图未索引数据
    var forceData = iniForceData(rawData);

    // 清空dataStore\dataStoreStack @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    parallelStack.resetData();
    // 清空智能分析缓存的关系
    saveSmartAnalyseRelationship = [];
    smartPostParameter.CompanyIdPersonName2PersonIdText = '';
    smartPostParameter.Old2NewText = '';
    smartPostParameter.PersonIdArr1Text = '';
    smartAnalyseHighLight.yes = false;
    smartAnalyseHighLight.no = true;
    store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:false });
    // console.log('from loadGraphViaSearch -- parallelStack被搜索动作清空： ');
    // console.log(parallelStack);

    // dataStoreStack = [];
    // 这里需要执行为dataStore添加初始数据 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    dataStore.links = forceData.links;
    dataStore.nodes = forceData.nodes;
    dataStore.nodesIdSet = forceData.nodesIdSet;
    dataStore.linksIdSet = forceData.linksIdSet;
    dataStore.idNodesDict = forceData.idNodesDict;

    // 渲染力图
    forceInstance = new renderForce(forceData, dataSelected, graphConfig, svg);
}
//end 调用数据处理器，绘图函数=====================

//start 鼠标右击节点菜单===================
function createRightClickMenu() {
    if(d3.select('.rightClickMenu')) {
        d3.select('.rightClickMenu').remove();
    }

    var rightClickMenu = vv.ini.createMouseTooltip('rightClickMenu');
    d3.select('body').on('click', function() {
        rightClickMenu.style("opacity", 0)
            .style("left", "-100px")
            .style("top", "-100px");
    });

    return rightClickMenu;
}
//end 鼠标右击节点菜单=====================

//start 显示或隐藏公司节点的全名称字符串========
function toggleDisplayCompanyName(flag) {
	console.log(flag);
    if(!d3.selectAll('.labelFull')) {
        return;
    }

    if(flag){
        // console.log('will hide company name');
        // 操纵节点标签全部显示的全局变量，影响新成生的节点样式
        d3.selectAll('.labelFull')
        	.style('opacity',1);
    } else{
        // console.log('show company name');
        // 操纵节点标签全部显示的全局变量
        d3.selectAll('.labelFull')
            .style('opacity', 0);
    }
}

//start 显示或隐藏投资比例========
function toggleDisplayInvestPercent(flag) {
	console.log(flag);
    if(!d3.selectAll('.linksInvestPercent')) {
        return;
    }

    if (flag) {
        // console.log('show investment percent');
        // 操纵投资比例标签全部显示的全局变量，影响新成生的节点样式
        d3.selectAll('.linksInvestPercent')
            .style('opacity', 1);
    }else{
        // 操纵投资比例标签全部显示的全局变量
        d3.selectAll('.linksInvestPercent')
            .style('opacity', 0);
    }
}
//end 显示或隐藏投资比例========

//start 撤销功能，绘图触发器 =========================
function renderGraphByRedo() {
    // 启用撤销模式
    parallelStack.isRedoMode = true;

    // 防止过度撤销删图
    if (parallelStack.getLength() <= 1) {

        // alert('提示： 不存在可以撤销的操作。');
        // 停用撤销模式，因为最后不能撤销的时候，不还筛选模式原会不记录数据
        parallelStack.isRedoMode = false;

        return;
    }

    var svgWidth = document.getElementById('vizContainer').offsetWidth;
    // console.log(graphConfig.svgWidth);
    var headerHeight = document.getElementById('family-tree-header').offsetHeight;
    var footerHeight = document.getElementById('footerNav').offsetHeight;
    var svgHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
    // // svg和force涉及的参数设置
    var graphConfig = {svgWidth: svgWidth, svgHeight:svgHeight};

    // //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    // 创建svg画布
    var svg = d3.select("body")
        .select('#vizContainer') //暂时写死
        .append("svg")
        .attr('id', 'svgGraph')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 绘制背景白色，为了导出图片
    svg.append('rect')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'none')
        .style('fill', '#ebebeb');

    // // 绘图容器函数是应该在每次搜索中创建，因为每次随着搜索而销毁，不应该防在外面
    var dataSelected = createDataStore('dataSelected');
    // datastore需要用最新的副本覆盖
    // dataStore = dataStoreStack[previousDataStorePositon - 1];
    // 堆栈抛出最新数据，退回上一步快照
    parallelStack.popData();
    // console.log('from renderGraphByRedo -- 撤销后的堆栈： ');
    // console.log(parallelStack);

    //判断是否可以棱镜一下
    smartAnalyseHighLight.yes = false;
    store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:false });
    smartAnalyseHighLight.no = true;
    smartAnalyseOrNot();

    // 上一步快照引用指针
    var previousDataStorePositon = parallelStack.getLength() - 1;
    // console.log('from renderGraphByRedo -- 上次操作数据快照： ');
    // console.log(parallelStack.stack[previousDataStorePositon]);
    // 回滚datastore
    var getStackData = parallelStack.stack[previousDataStorePositon][0];
    dataStore = deepCopyDataStore(getStackData);
    // console.log("RedodataStore:");
    // console.log(dataStore);
    // 回滚当前绘图缓冲
    var forceData = parallelStack.stack[previousDataStorePositon][1];
    // 渲染力图
    forceInstance = new renderForce(forceData, dataSelected, graphConfig, svg);

    // 停用撤销模式，因为最后不能撤销的时候，不还筛选模式原会不记录数据@@@@@@@@@@@@@@@@@@@@@@@@@@@
    parallelStack.isRedoMode = false;
}
//end 撤销功能，绘图触发器 =========================

//start 清空绘图 ==============================
function clearGraphState() {
    //关闭词云
    // d3.select('.wordCloudBubbles').remove();
    // wordCloudBubbles = null;
    //remove svg
    //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    //== 删除雷达图
    // if (d3.select('#radarContainer svg')) {
    //     d3.select('#radarContainer svg').remove();
    // }
    //reset data status
    dataStore.resetDataStore();
    // dataStoreStack = [];
    // 清空平行堆栈@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    parallelStack.resetData();
    // 清空智能分析缓存的关系
    saveSmartAnalyseRelationship = [];
    smartPostParameter.CompanyIdPersonName2PersonIdText= '';
    smartPostParameter.Old2NewText= '';
    smartPostParameter.PersonIdArr1Text= '';
    smartAnalyseHighLight.yes = false;
    smartAnalyseHighLight.no = true;
    store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:false });

    // 公司节点全名标签的透明度，控制新载入节点
    showFullNodesLables = 0;
    //remove tooltip
    // 数据状态复原
    resetPanelDataStatus();
}
//end 清空绘图 ==============================

// start 数据状态复原 =======================
function resetPanelDataStatus() {
    
}
// end 数据状态复原 =======================

// start 判断是否可以智能分析 ========================
function smartAnalyseOrNot(){
    // console.log("smartAnalyseOrNot");
    //当前视图内数据应该是绘图缓冲区数据
    var currentDataStore = deepCopyDataStore(parallelStack.stack[parallelStack.stack.length - 1][1]);
    // console.log("currentDataStore");
    // console.log(currentDataStore);

    // 获取智能分析需要传递的参数
    var smartCompanySetId = d3.set(); // 存放所有公司节点id
    var postcompanyIdArr = [];
    var postcompanyIdStr = "[";

    currentDataStore.nodes.forEach(function(node) {
        if (node.labels[0] == 'Company') {
            if(!smartCompanySetId.has(node.id)){
                smartCompanySetId.add(node.id);
            }
        }
    })    

    postcompanyIdArr = smartCompanySetId.values();
    // console.log("postcompanyIdArr");
    // console.log(postcompanyIdArr);
    if(postcompanyIdArr.length>0){
        postcompanyIdArr.forEach(function(compId){
            postcompanyIdStr += "\"" + compId + "\"" + ',';
        })
        postcompanyIdStr = postcompanyIdStr.substring(0, postcompanyIdStr.lastIndexOf(","));  
    }
    postcompanyIdStr += "]";
    // console.log(postcompanyIdStr);

    // 获取合并功能数据
    getMergeData(postcompanyIdStr, smartPostParameter);

    // ajax请求合并功能数据
    function getMergeData(postPara, smartPostPara){
        // console.log("getMergeData");
        // console.log(postPara);
        // console.log(smartPostPara);
        $.ajax({
            url: '../Access/function8ForAjax',
            data: {
                companyNodeIdArrText: postPara,
                companyIdPersonName2PersonIdText: smartPostPara.CompanyIdPersonName2PersonIdText,
                old2NewText: smartPostPara.Old2NewText,
                personIdArr1Text: smartPostPara.PersonIdArr1Text
            },
            type: 'post',
            dataType: 'json',
            cache: false,  
            success: function(data,status){
                // console.log("success");
                // console.log(data);
                smartPostPara.CompanyIdPersonName2PersonIdText = JSON.stringify(data.CompanyIdPersonName2PersonIdText);
                smartPostPara.Old2NewText = JSON.stringify(data.Old2NewText);
                smartPostPara.PersonIdArr1Text = JSON.stringify(data.PersonIdArr1Text);
                // console.log(smartPostPara);
                // 获取替换关系
                var replaceNodesInfo = data.Old2NewText;
                // console.log("replaceNodesInfo");
                // console.log(replaceNodesInfo);
                // 获取可能新增的关系
                saveSmartAnalyseRelationship = saveSmartAnalyseRelationship.concat(data.RelationshipText);
                // console.log("saveSmartAnalyseRelationship: " + saveSmartAnalyseRelationship.length);
                // var newRelationsLinks = saveSmartAnalyseRelationship;
                var newRelations = {};
                newRelations.nodesIdSet = d3.set();
                newRelations.Nodes = [];
                newRelations.Links = [];
                saveSmartAnalyseRelationship.forEach(function(l){
                    l.nodes.forEach(function(n){
                        if(!newRelations.nodesIdSet.has(n.id)){
                            newRelations.nodesIdSet.add(n.id);
                            newRelations.Nodes.push(n);
                        }
                    })
                    newRelations.Links.push(l.relationships[0]);
                })

                // console.log("newRelations");
                // console.log(newRelations);
                newmergePeopleNodes(replaceNodesInfo,newRelations,currentDataStore,smartCompanySetId);
            },
            error: function(){
                console.log("error");
            }
        });        
    }

    function newmergePeopleNodes(replaceNodesInfo,newRelations,currentDataStore,smartCompanySetId){
        // console.log("replaceNodesInfo");
        // console.log(replaceNodesInfo);
        // console.log("newRelations");
        // console.log(newRelations);
        //
        var replaceNeededLinksId = [];
        var nodeIdListOfReplaced = []; // 存储oldid
        var replacedLinksArray = []; //完成替换处理的关系
        var replacedNodesArray = []; // 完成替换处理的节点
        var oldNodeIdSet = d3.set(); // 存储oldid
        var newNodeIdSet = d3.set(); // 存储newid
        // 深拷贝需要替换的关系，避免更改影响到所有关系@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        var deepCopyedstartNodeNeededReplaceLinks = [];
        var deepCopyedstartNodeNeededReplaceNodes = [];
        for(var key in replaceNodesInfo){
            // console.log(key);
            // console.log(replaceNodesInfo[key]);
            var old_people = key; //原自然人节点id
            var new_people = replaceNodesInfo[key]; //替换目标自然人节点id

            // 记录被替换的节点id
            if (old_people != new_people) {
                nodeIdListOfReplaced.push(old_people);
                // 存储oldid
                if(!oldNodeIdSet.has(old_people)){
                    oldNodeIdSet.add(old_people)
                }
            }
            if(!newNodeIdSet.has(new_people)){
                newNodeIdSet.add(new_people);
            }

            // 替换开始节点是旧节点的关系
            var startNodeNeededReplaceLinks = currentDataStore.links.filter(function(l) {
                return l.startNode == old_people;
            });
            startNodeNeededReplaceLinks.forEach(function(l) {
                var link = {};
                for (var key in l) {
                    link[key] = l[key];
                }
                deepCopyedstartNodeNeededReplaceLinks.push(link);
            });

            // 替换开始节点是旧节点的id为新的id
            var startNodeNeededReplaceNodes = currentDataStore.nodes.filter(function(n) {
                return n.id == old_people;
            });
            startNodeNeededReplaceNodes.forEach(function(n){
                var node = {};
                for(var key in n){
                    node[key] = n[key];
                }
                deepCopyedstartNodeNeededReplaceNodes.push(node);
            })
        }
        // 判断是否可以棱镜合并
        var newNodeIdSetArr = newNodeIdSet.values();
        newNodeIdSetArr.forEach(function(id){
            if(!currentDataStore.nodesIdSet.has(id)){
                // console.log("可以棱镜");
                smartAnalyseHighLight.yes = true;
                smartAnalyseHighLight.no = false;
                store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:true });
                return;
            }
        })
        if(smartAnalyseHighLight.no){
            currentDataStore.nodes.forEach(function(n){
                // if()
                if(oldNodeIdSet.has(n.id)){
                    // console.log("可以棱镜");
                    smartAnalyseHighLight.yes = true;
                    smartAnalyseHighLight.no = false;
                    store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:true });
                    return;
                }
            })  
        }

        var needLinks = newRelations.Links.filter(function(l){
            if(smartCompanySetId.has(l.endNode)){
                return oldNodeIdSet.has(l.startNode) || newNodeIdSet.has(l.startNode);
            }else{
                return false;
            }
        })
        var needNodes = newRelations.Nodes.filter(function(n){
            return newNodeIdSet.has(n.id);
        })
        // 合并老的关系与新的关系
        var tempConcatLinksArr = deepCopyedstartNodeNeededReplaceLinks.concat(needLinks);
        // 合并老的节点与新的节点
        var tempConcatNodesArr = deepCopyedstartNodeNeededReplaceNodes.concat(needNodes);
        // console.log("nodeIdListOfReplaced:");
        // console.log(nodeIdListOfReplaced);
        // console.log("relationsLinks:");
        // console.log(relationsLinks);
        // console.log("deepCopyedstartNodeNeededReplaceLinks:");
        // console.log(deepCopyedstartNodeNeededReplaceLinks);
        // console.log("tempConcatLinksArr:");
        // console.log(tempConcatLinksArr);
        // console.log("oldNodeIdSet");
        // console.log(oldNodeIdSet);

        // 数组去重
        replacedLinksArray = arrUnrepeated(tempConcatLinksArr);
        replacedNodesArray = arrUnrepeated(tempConcatNodesArr);
        // console.log("newConcatLinksArr:");
        // console.log(newConcatLinksArr);

        // 存放已经替换的node id
        var alreadyReplacedNodesIdSet = d3.set();
        for(var key in replaceNodesInfo){
            // console.log(key);
            // console.log(replaceNodesInfo[key]);
            var old_people = key; //原自然人节点id
            var new_people = replaceNodesInfo[key]; //替换目标自然人节点id

            // 已经替换的node id
            alreadyReplacedNodesIdSet.add(old_people);
            // 找到nodeid关联的连线
            var getThisNodeLinksArr = replacedLinksArray.filter(function(l) {
                return l.startNode == old_people;
            });
            getThisNodeLinksArr.forEach(function(l){
                l.startNode = new_people;
            })

            // 找到old_people这个节点将id改为new_people
            var getThisNodeArr = replacedNodesArray.filter(function(n){
                return n.id == old_people;
            })
            getThisNodeArr.forEach(function(n){
                n.id = new_people;
            })
        }
        // console.log("replacedLinksArray:");
        // console.log(replacedLinksArray);

        // 存放已经替换的link id
        var alreadyReplacedLinksIdSet = d3.set();
        replacedLinksArray.forEach(function(l) {
            alreadyReplacedLinksIdSet.add(l.id);
        });
        // console.log("alreadyReplacedLinksIdSet:");
        // console.log(alreadyReplacedLinksIdSet);
        // 记录需要合并的关系的节点@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        replaceNeededLinksId = alreadyReplacedLinksIdSet.values();

        // 不需要替换节点的关系
        var notReplaceLinks = currentDataStore.links.filter(function(l) {
            return !alreadyReplacedLinksIdSet.has(l.id);
        });

        // 不需要替换的节点
        var notReplaceNodes = currentDataStore.nodes.filter(function(n) {
            return !alreadyReplacedNodesIdSet.has(n.id);
        });
        // console.log('not replaced links: ');
        // console.log(notReplaceLinks.length);
        // console.log(notReplaceLinks);
        //合并替换之后和未替换的关系
        var mergedLinks = replacedLinksArray.concat(notReplaceLinks);
        // console.log("mergedLinks");
        // console.log(mergedLinks);
        var mergedLinksIdSet = d3.set();
        //存在在合并后关系中的节点
        var mergedNodesIdSet = d3.set();
        mergedLinks.forEach(function(l) {
            if (!mergedLinksIdSet.has(l.id)) {
                mergedLinksIdSet.add(l.id);
            }
            if (!mergedNodesIdSet.has(l.startNode)) {
                mergedNodesIdSet.add(l.startNode);
            }

            if (!mergedNodesIdSet.has(l.endNode)) {
                mergedNodesIdSet.add(l.endNode);
            }
        });

        // 合并后需要的节点
        var tempConcatNodesArr = replacedNodesArray.concat(notReplaceNodes);
        var filterUnrepeatedNodes = arrUnrepeated(tempConcatNodesArr);
        var mergedNodes = filterUnrepeatedNodes.filter(function(n) {
            return mergedNodesIdSet.has(n.id);
        });
        // console.log("mergedNodes");
        // console.log(mergedNodes);

        // mergedNodes.forEach(function(n){
        //     if(!currentDataStore.nodesIdSet.has(n.id)){
        //         currentDataStore.idNodesDict[n.id] = n;
        //         currentDataStore.nodesIdSet.add(n.id);
        //     }
        // })
        // mergedLinks.forEach(function(l){
        //     if(!currentDataStore.linksIdSet.has(l.id)){
        //         currentDataStore.linksIdSet.add(l.id);
        //     }
        // })

        // 过滤掉没有开始和结束节点的连线
        // mergedLinks = mergedLinks.filter(function(l) {
        //     var judgeLink = currentDataStore.nodesIdSet.has(l.startNode)&&currentDataStore.nodesIdSet.has(l.endNode);
        //     if(!judgeLink){
        //         currentDataStore.linksIdSet.remove(l.id);
        //     }
        //     return judgeLink;
        // });


        //==start 新增删除叶子节点逻辑 ==================================
        var filterMergedNodes = [];
        var filterMergedLinks = [];
        var NodesIdMap = d3.map();

        mergedLinks.forEach(function(link){
            if(!NodesIdMap.has(link.startNode)){
                NodesIdMap.set(link.startNode, [link.endNode]);
            }else{
                var nodeIDArr = NodesIdMap.get(link.startNode);
                if(nodeIDArr.indexOf(link.endNode) == -1){
                    nodeIDArr.push(link.endNode);
                    NodesIdMap.set(link.startNode, nodeIDArr);
                }
            } 
            if(!NodesIdMap.has(link.endNode)){
                NodesIdMap.set(link.endNode, [link.startNode]);
            }else{
                var nodeIDArr = NodesIdMap.get(link.endNode);
                if(nodeIDArr.indexOf(link.startNode) == -1){
                    nodeIDArr.push(link.startNode);
                    NodesIdMap.set(link.endNode, nodeIDArr);
                }
            }
        })

        // 过滤叶子节点
        currentDataStore.nodesIdSet = d3.set();
        currentDataStore.linksIdSet = d3.set();
        currentDataStore.idNodesDict = [];
        filterMergedNodes = mergedNodes.filter(function(n){
            var feedback = (NodesIdMap.get(n.id).length > 1)?  true : false;
            if(feedback){
                if(!currentDataStore.nodesIdSet.has(n.id)){
                    currentDataStore.idNodesDict[n.id] = n;
                    currentDataStore.nodesIdSet.add(n.id);
                }
            }
            return feedback;
        })
        // 过滤掉没有开始和结束节点的连线
        filterMergedLinks = mergedLinks.filter(function(l) {
            var judgeLink = currentDataStore.nodesIdSet.has(l.startNode)&&currentDataStore.nodesIdSet.has(l.endNode);
            return judgeLink;
        });

        filterMergedLinks.forEach(function(l){
            if(!currentDataStore.linksIdSet.has(l.id)){
                currentDataStore.linksIdSet.add(l.id);
            }
        })

        //==end 新增删除叶子节点逻辑 ====================================

        // currentDataStore.nodes = mergedNodes;
        // currentDataStore.links = mergedLinks;
        currentDataStore.nodes = filterMergedNodes;
        currentDataStore.links = filterMergedLinks;

        smartAnalyseDataStore = currentDataStore;

        //数组去重算法
        function arrUnrepeated(arr) {
            // console.log("arr");
            // console.log(arr);
            var result = [], hash = {};
            for (var i = 0, elem; i<arr.length; i++) {
                elem = arr[i]['id'];
                if (!hash[elem]) {
                    result.push(arr[i]);
                    hash[elem] = true;
                }
            }
            return result;
        }
    }
}
// end 判断是否可以智能分析 ==========================

// start 智能分析 =======================
function smartAnalyse() {
    if (smartAnalyseHighLight.no){
        return;
    }
    smartAnalyseHighLight.yes = false;
    smartAnalyseHighLight.no = true;
    store.dispatch({ type: 'UPDATE_SMARTSTATUS', data:false });

    if(smartAnalyseDataStore==null){
        // console.log("smartAnalyseDataStore:"+ smartAnalyseDataStore);
        return;
    }
    renderGraphByMerge(smartAnalyseDataStore);
}
// end 智能分析 =======================

//start 合并节点功能，绘图触发器 =========================
function renderGraphByMerge(mergedData) {
    var svgWidth = document.getElementById('vizContainer').offsetWidth;
    // console.log(graphConfig.svgWidth);
    var headerHeight = document.getElementById('family-tree-header').offsetHeight;
    var footerHeight = document.getElementById('footerNav').offsetHeight;
    var svgHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
    // // svg和force涉及的参数设置
    var graphConfig = {svgWidth: svgWidth, svgHeight:svgHeight};

    // //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    // 创建svg画布
    var svg = d3.select("body")
        .select('#vizContainer') //暂时写死
        .append("svg")
        .attr('id', 'svgGraph')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 绘制背景白色，为了导出图片
    svg.append('rect')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'none')
        .style('fill', '#ebebeb');

    // 在merge函数里已经修改了datastore
    // 更改dataStore数据，更新修改后的节点数量和关系 @@@@@@@@@@@@@@@@@@@@@@@@
    dataStore.links = mergedData.links;
    dataStore.nodes = mergedData.nodes;
    dataStore.nodesIdSet = mergedData.nodesIdSet;
    dataStore.linksIdSet = mergedData.linksIdSet;
    // 测试屏蔽游离节点@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // dataStore.nodesIdSet = mergedData.nodesIdSet;
    // dataStore.linksIdSet = mergedData.linksIdSet;
    dataStore.idNodesDict = mergedData.idNodesDict;

    // 绘图容器函数是应该在每次搜索中创建，因为每次随着搜索而销毁，不应该防在外面
    var dataSelected = createDataStore('dataSelected');
    // 存储每个节点静止后的位置，用于确定新载入节点的初始位置
    dataSelected.nodesStaticPosition = {};

    //合并后的数据来自外部合并函数
    var forceData = mergedData;
    // 渲染力图
    forceInstance = new renderForce(forceData, dataSelected, graphConfig, svg);
}
//end 合并节点功能，绘图触发器 =========================

//start 过滤存储在store中的数据 ===========
function filterStoreData(data, nodeType, relationType) {

    var filtedData = {};
    var links = data.links;
    var nodes = data.nodes;

    var idNodesDict = data.idNodesDict;// 节点id与node配对词典
    // console.log(links);
    // console.log(nodes);
    var relationTypeSet = d3.set(relationType);
    var filtedNodesIdSet = d3.set();

    var filtedLinks = links.filter(function(d) {
        if (relationTypeSet.has(d.type)) {
            var qualifyLinks;
            //start verity company node ---------
            if (nodeType == 'Company') {
                qualifyLinks = verifyNodesLabel(d, 'Company');
                return qualifyLinks;

            }
            //end verity company node ---------

            //start verity person node ---------
            else if (nodeType == 'Person') {
                qualifyLinks = verifyNodesLabel(d, 'Person');
                return qualifyLinks;
            }
            //end verity person node ---------

            //start verity all node ---------
            else {
                //选取两边的节点id endNode
                if (!filtedNodesIdSet.has(d.startNode)) {
                    filtedNodesIdSet.add(d.startNode);
                }
                if (!filtedNodesIdSet.has(d.endNode)) {
                    filtedNodesIdSet.add(d.endNode);
                }

                qualifyLinks = d;
                return qualifyLinks;
            }
            //end verity all node ---------

            //start verifyNodesLabel ---------
            function verifyNodesLabel(d, nodeLabel) {
                var isQualifyNode = false;
        
                if (idNodesDict[d.startNode].labels[0]==nodeLabel && idNodesDict[d.endNode].labels[0]==nodeLabel) {
                    isQualifyNode = true;
                }

                if (isQualifyNode) {
                    //选取两边的节点id
                    if (!filtedNodesIdSet.has(d.startNode)) {
                        filtedNodesIdSet.add(d.startNode);
                    }
                    if (!filtedNodesIdSet.has(d.endNode)) {
                        filtedNodesIdSet.add(d.endNode);
                    }

                    isQualifyNode = false;

                    return d;
                }
            }
            //end verifyNodesLabel ---------
        }
    });

    // console.log(filtedLinks);

    var filtedNodes = nodes.filter(function(d) {
        if (filtedNodesIdSet.has(d.id)) {
            return d;
        }
    });

    filtedData.nodes = filtedNodes;
    filtedData.links = filtedLinks;

    return filtedData;
}
//end 过滤存储在store中的数据 ===========

//start 筛选功能，绘图触发器 =========================
function renderGraphByFilter() {
    var svgWidth = document.getElementById('vizContainer').offsetWidth;
    // console.log(graphConfig.svgWidth);
    var headerHeight = document.getElementById('family-tree-header').offsetHeight;
    var footerHeight = document.getElementById('footerNav').offsetHeight;
    var svgHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
    // // svg和force涉及的参数设置
    var graphConfig = {svgWidth: svgWidth, svgHeight:svgHeight};

    // //删除前次搜索绘图
    if (d3.select('#vizContainer svg')) {
        d3.select('#vizContainer svg').remove();
    }
    // 创建svg画布
    var svg = d3.select("body")
        .select('#vizContainer') //暂时写死
        .append("svg")
        .attr('id', 'svgGraph')
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // 绘制背景白色，为了导出图片
    svg.append('rect')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr('x', 0)
        .attr('y', 0)
        .style('stroke', 'none')
        .style('fill', '#ebebeb');

    // 绘图容器函数是应该在每次搜索中创建，因为每次随着搜索而销毁，不应该防在外面
    var dataSelected = createDataStore('dataSelected');
    // 存储每个节点静止后的位置，用于确定新载入节点的初始位置
    dataSelected.nodesStaticPosition = {};
    // ["投资", "法定代表人", "任职"]
    console.log(store.getState());
    var filterSelectedNodesTypes = [];
    if(store.getState().filterInvest){
    	filterSelectedNodesTypes.push('投资');
    }
    if(store.getState().filterOwner){
    	filterSelectedNodesTypes.push('法定代表人');
    }
    if(store.getState().filterServe){
    	filterSelectedNodesTypes.push('任职');
    }
    //筛选数据，转为力图未索引数据
    var forceData = filterStoreData(dataStore, 'all', filterSelectedNodesTypes);
    // 渲染力图
    // // 增加一个模式指示参数，回到共用一个渲染函数模式@@@@@@@@@@@@@@@@@@@@@@@@
    globalConfig.isFilterRenderMode = true;
    forceInstance = new renderForce(forceData, dataSelected, graphConfig, svg);

    // 为兼容合并节点功能，替换原有力图渲染函数@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // renderForceForFilter(forceData, dataSelected, graphConfig, svg);
}
//end 筛选功能，绘图触发器 =========================

/*== start 单击节点显示操作按钮 =====================================================*/
//== 显示操作
function showNodeOper(top,left,d){
	// console.log('showNodeOper');
	d3.select('#nodeOper')
		.style('display', 'block')
		.style('top', top+'px')
		.style('left', left+'px');
}
//== 隐藏操作
function hideNodeOper(){
	d3.select('#nodeOper')
		.style('display', 'none')
		.style('top', -1000+'px')
		.style('left', -1000+'px');
}
/*== end 单击节点显示操作按钮 =======================================================*/

//***************************************************************************
//start 图形渲染函数
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//start 渲染力图 ================================
function renderForce(data, dataSelected, graphConfig, svg) {

    //清楚本地存储中双击节点的值
    // window.localStorage.removeItem("dblclickNodeX");
    // window.localStorage.removeItem("dblclickNodeY");
    // 生成鼠标提示框
    var mouseTooltip = vv.ini.createMouseTooltip('mouseTooltip');
    // 鼠标右击菜单
    var rightClickMenu = createRightClickMenu();
    // wordCloudBubbles.style('left', "-100px")
    //     .style('top', "-100");

    // 绘制图例
    generateLegency(svg);
    // 蓝鲸项目添加水印
    // generateWatermark(svg);

    // d3.select('svg').on('dblclick', function() {
    //     // 阻止默认双击放大事件@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //     console.log('double click!!!');
    //     d3.event.preventDefault();
    // });

    // 将初始数据装入绘图数据容器-----------
    data.nodes.forEach(function(node) {
        // console.log(node);
        // 将初始数据装入绘图数据容器
        dataSelected.nodesIdSet.add(node.id);
        dataSelected.nodes.push(node);
        // 测试是否存在风险属性
        // if (node.properties.hasOwnProperty('风险指数')) {
        //     console.log(node);
        // }
    });

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // not work yet
    // 为了修正合并功能中，保留已经存在的node id节点，防止下探出来游离节点
    // 把全部存在的节点id，放回id set，保持idset大于nodes
    // console.log(data);
    // var dataStoreNodesLength = data.nodes.length;
    // var dataStoreNodesIdSetLength = data.nodesIdSet.values().length;
    // console.log('from renderForce() compare dataStore nodes and idset length: ');
    // console.log(dataStoreNodesLength);
    // console.log(dataStoreNodesIdSetLength);
    //
    // if (dataStoreNodesIdSetLength > dataStoreNodesLength) {
    //     var dataNodesIdSetArray = data.nodesIdSet.values();
    //     dataNodesIdSetArray.forEach(function(id) {
    //         if(!dataSelected.nodesIdSet.has(id)) {
    //             dataSelected.nodesIdSet.add(id);
    //         }
    //     });
    // }
    //如果不是筛选渲染模式，支持合并节点的选择性渲染
    if(!globalConfig.isFilterRenderMode) {
        try {
            var dataNodesIdSetArray = data.nodesIdSet.values();
            dataNodesIdSetArray.forEach(function(id) {
                if(!dataSelected.nodesIdSet.has(id)) {
                    dataSelected.nodesIdSet.add(id);
                }
                // 筛选之后，还有游离节点，在寄存对象中也要屏蔽合并节点id@@@@@@@@@@
                if(!dataStore.nodesIdSet.has(id)) {
                    dataStore.nodesIdSet.add(id);
                }
            });
        } catch (e) {
            console.log('filter mode conflict with merge mode with nodesIdSet values')
        }
    } else {
        ////如果是筛选渲染模式，指标要复位
        globalConfig.isFilterRenderMode = false;
    }


    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    data.links.forEach(function(link) {
        // console.log(node);
        // 将初始数据装入绘图数据容器
        dataSelected.linksIdSet.add(link.id);
        dataSelected.links.push(link);
    });

    //存储数据堆栈@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 如果是撤销模式，则不记录当前绘图数据
    if( !parallelStack.isRedoMode ) {
        parallelStack.pushData(dataStore, dataSelected);
        // console.log('from renderForce -- parallelStack压入搜索/筛选数据： ');
        // console.log(parallelStack);
        // 撤销模式标记还原
        parallelStack.isRedoMode = false;
    }
    // console.log("parallelStack.length");
    // console.log(parallelStack.getLength());
    // console.log(parallelStack.stack);
    //判断是否可以棱镜一下
    smartAnalyseOrNot();

    // 添加力图索引
    var dataSelectedIndexed = addIndex(dataSelected);
    // console.log('dataSelectedIndexed from renderForce()');
    // console.log(dataSelectedIndexed);
    //----------------------------------

    // 节点颜色选择
    var colorScale = d3.scale.ordinal()
            .domain(['Company', 'Person', 'Unknown']) //新增未知类型
            .range(['#68BDF6', '#6DCE9E', '#ccc']);

    // 关系颜色选择
    var linkColorScale = d3.scale.ordinal()
            .domain(["投资", "法定代表人", "任职", "直系亲属"])
            .range(['#666', '#ff7567', '#2fafc6', '#fdeb6b']);

    // 动画计数器
    var tickCounter = 0;

    //缩放比例尺-------------------------
    var currentOffset = {x: 0, y: 0};
    var currentZoom = 1.0;

    var xScale = d3.scale.linear()
            .domain([0, graphConfig.svgWidth])
            .range([0, graphConfig.svgWidth]);

    var yScale = d3.scale.linear()
            .domain([0, graphConfig.svgHeight])
            .range([0, graphConfig.svgHeight]);

    var zoomScale = d3.scale.linear()
            .domain([0.3, 2])
            .range([0.3, 2])
            .clamp(true);
    //----------------------------------

    var force = d3.layout.force()
        .size([graphConfig.svgWidth, graphConfig.svgHeight])
        .nodes(dataSelectedIndexed.nodes)
        .links(dataSelectedIndexed.links)
        .linkDistance(function(d) {
            var startNodeWeight = d.source.weight;
            var endNodeWeight = d.target.weight;

            var startNodeType = d.source.labels[0];
            var endNodeType = d.target.labels[0];

            if (startNodeWeight>3 && startNodeType == 'Person') {
                return 200; //300
            } else {
                return 100; //100
            }
        })
        // .linkDistance(function(d) { //active it latter
        //     if(dataStore.mergedLinksIdSet.has(d.id)) {
        //         return 300;
        //     } else {
        //         return 100;
        //     }
        // })
        .charge(-600)  //相互之间的作用力
        .gravity(0.05) //0.05
        // .friction(0.5)
        .theta(0.1)
        .on("tick", function() {
            repositionGraph(undefined, undefined, 'tick');
        });

    // 开始力图布局计算
    force.start();

    // 画箭头----------------------------
    var arrowConfig = {
        // id: 'arrow',
        path: "M0,0 L4,2 L0,4 L0,0", //"M0,0 L4,2 L0,4 L0,0"
        markerUnits: 'strokeWidth',
        markerWidth: 6, //4
        markerHeight: 6, //4
        viewBox: "0 0 6 6", //"0 0 8 8"
        // refX: arrowXoffset, //16
        refY: 3, //2
        orient: 'auto'
    }
    // var arrow = drawArror(svg, "#888", arrowConfig, arrowXoffset); //#aaa
    var arrowF = function(color, arrowId , arrowXoffset){
        return drawArror(svg, color, arrowConfig, arrowId ,arrowXoffset);
    }
    //----------------------------------

    var nodeTouchPageY;
    var nodeTouchPageX;
    var nodeTouchMPageY;
    var nodeTouchMPageX;

    // 设置拖动方式-----------------------
    var drag = force.drag()
        .on("dragstart",function(d,i){
            d.fixed = true; //拖拽并固定节点
            // 阻止节点拖动动作冒泡为整个svg拖动
            d3.event.sourceEvent.stopPropagation();
        })
        .on("dragend",function(d,i){

        })
        .on("drag",function(d,i){

        });
    //----------------------------------

    // svg缩放与拖动----------------------
    // 移动整个svg
    svg.call( d3.behavior.drag()
        .on("drag",dragmove)
    );

    // 缩放整个svg
    svg.call(d3.behavior
        .zoom()
        .x(xScale)
        .y(yScale)
        .scaleExtent([0.3, 2])
        .on('zoom', doZoom)
    );
    //----------------------------------

    // 阻止默认双击放大事件@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // svg.call(d3.behavior.zoom()).on('dblclick.zoom', null);
    svg.on('dblclick.zoom', null);

    // 力图渲染--------------------------
    // 用于绑定节点、边与dom的对应关系，数据里有id没有key属性@@@@@@@@@@@@@@@@@@
    var bindId = function (d) {
        return d.id
    }
    //总的力图装载点
    var networkGraph = svg.append('g').attr('class', 'grpParent');

    // 节点与边的力图数据
    var nodesData = force.nodes();
    var linksData = force.links();

    // 画边
    var linksG = networkGraph.append('g').attr('id', 'linksG');
    var linksArray = linksG.selectAll(".link")
            .data(dataSelectedIndexed.links, bindId)
            .enter()
            .append("path")
            .attr('class', 'link')
            .attr("id", function(d) {
                return d.id;
            })
            .style({'fill':'none', 'stroke-width':'1px'}) //2px
            .style('stroke', function(d) {
                // return linkColorScale(d.type);
                if(d.type == '投资'){
                    return nodesColor.invest;
                }else if(d.type == '法定代表人'){
                    return nodesColor.legalRepre;
                }else{
                    return nodesColor.serve;
                }
            })
            // .attr("marker-end", 'url(#arrow)')
            .attr("marker-end", function(d){
                var arrowColor;
                if(d.type == '投资'){
                    arrowColor = nodesColor.invest;
                }else if(d.type == '法定代表人'){
                    arrowColor = nodesColor.legalRepre;
                }else{
                    arrowColor = nodesColor.serve;
                }
                var nodeWeight = d.target.weight<50 ? d.target.weight/2 : 20;
                var xOffset = 27 + nodeWeight;
                var arrow = arrowF(arrowColor, d.id, xOffset);
                return 'url(#arrow'+ d.id +')';
            })
           

    //绘制关系文字
    var linksLabelsG = networkGraph.append('g').attr('id', 'linksLabelsG');
    var linksLabelsArray = linksLabelsG.selectAll(".linksLabels")
            .data(dataSelectedIndexed.links, bindId)
            .enter()
            .append("text")
            .attr("class", "linksLabels")
            // .attr("dx", "70px")
            .attr("dy", "-3px")
            // .attr("dy", "3px")
            .attr('text-anchor', 'middle')
            .style({"font-size":'10px', 'fill': '#666'})
            .append("textPath")
            .attr("xlink:href",function(d) {
                return '#' + d.id;
            })
            .attr('startOffset', '40%')
            .text(function(d) {
                if (d.type == '任职') {
                    if (d.properties['职务']) {
                        return d.properties['职务'];
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
    //绘制投资比例
    var linksInvestPercentG = networkGraph.append('g').attr('id', 'linksInvestPercentG');
    var linksInvestPercentArray = linksLabelsG.selectAll(".linksInvestPercent")
            .data(dataSelectedIndexed.links, bindId)
            .enter()
            .append("text")
            .attr("class", "linksInvestPercent")
            // .attr("dx", "70px")
            .attr("dy", "-3px")
            .attr('text-anchor', 'middle')
            .attr('opacity', showInvestPercent) //全局变量控制，便于控制新载入节点
            .style({"font-size":'10px', 'fill': '#666'})
            .append("textPath")
            .attr("xlink:href",function(d) {
                return '#' + d.id;
            })
            .attr('startOffset', '65%')
            .text(function(d) {
                if (d.type == '投资') {
                    if (d.properties['投资占比']) {
                        var investRatio = Number(d.properties['投资占比'].substr(0, 6))*10000;
                        investRatio = Math.round(investRatio)/100;
                        if(!isNaN(d.properties['投资占比'])){
                            return '(占股' + investRatio + '%)';   
                        }else{
                            return '(占股' + d.properties['投资占比'] + ')'; 
                        }
                    }
                }
            });

    // 画节点
    var nodesG = networkGraph.append('g').attr('id', 'nodesG');
    var nodesArray = nodesG.selectAll(".nodeCircle")
            .data(dataSelectedIndexed.nodes, bindId)
            .enter()
            .append("circle")
            .attr("class", "node")
            .classed('nodeCircle', true)
            .classed('searchTargetNode', function(d) { //为目标搜索节点添加类名
                if(d.labels[0] == 'Company') {
                    if(dataStore.searchTargetNode.has(d.properties['公司名称'])) {
                        return true;
                    }
                }
            })
            .attr("r", 20)
            .style('fill', function(d) {
                // return colorScale(d.labels[0]);
                if(d.labels[0] == "Company"){
                    return nodesColor.company;
                }else if(d.labels[0] == "Person"){
                    return nodesColor.people;
                }else{
                    return nodesColor.other;
                }
            })
            // .style('stroke', '#ccc')
            // .style('stroke-width', '2px')
            .style('stroke-width', function(d) {
                if (d.properties.hasOwnProperty('风险评级')) {
                    // console.log('got risk record');
                    // console.log(d.properties['风险评级']);
                    // console.log(d.properties['风险指数']);
                    if (d.properties['风险评级'] == '无风险') {
                        return '4px';
                    } else if (d.properties['风险评级'] == '低风险') {
                        return '6px';
                    } else if (d.properties['风险评级'] == '中风险') {
                        return '6px';
                    } else if (d.properties['风险评级'] == '高风险') {
                        return '6px';
                    } else {
                        return '2px';
                    }
                } else {
                    return '2px';
                }
            })
            .style('stroke', function(d) {
                if (d.properties.hasOwnProperty('风险评级')) {
                    if (d.properties['风险评级'] == '无风险') {
                        return nodesColor.safe;
                    } else if (d.properties['风险评级'] == '低风险') {
                        return nodesColor.lowRisk;
                    } else if (d.properties['风险评级'] == '中风险') {
                        return nodesColor.middleRisk;
                    } else if (d.properties['风险评级'] == '高风险') {
                        return nodesColor.highRisk;
                    } else {
                        return '#ccc';
                    }
                } else {
                    return '#ccc';
                }
            })
            .on('touchstart', function(d) {
            	showNodeName(d);
            	// 阻止节点触摸冒泡事件的发生
            	d3.event.preventDefault();
            	// console.log(d3.event);
            	nodeTouchPageY = d3.event.touches[0].pageY;
            	nodeTouchPageX = d3.event.touches[0].pageX;
            	nodeOperTimer = setTimeout(function(){
            		// console.log("3s has arrived");
            		showNodeOper(nodeTouchPageY-60, nodeTouchPageX-60, d);
            	}, 1000);	
            })
            .on('touchmove', function(d){
            	// console.log('touchmove is happened');
            	// console.log(d3.event);

            	nodeTouchMPageY = d3.event.touches[0].pageY;
            	nodeTouchMPageX = d3.event.touches[0].pageX;

            	if(Math.abs(nodeTouchPageY-nodeTouchMPageY)>5 || Math.abs(nodeTouchPageX - nodeTouchMPageX)>5){
					clearTimeout(nodeOperTimer);
            	}
            	if(d3.select('#nodeOper').style('display') === 'block'){
            		moveNodeOper(nodeTouchMPageY-60,nodeTouchMPageX-60);
            	}
            })
            .on('touchend', function(d) {
            	clearTimeout(nodeOperTimer);
            	//== 将节点信息推入状态管理器
            	store.dispatch({ type: 'UPDATE_TOUCHNODEINFOS', data:d });
            	console.log(store.getState());
            	// hideNodeName();
            })
            .call(force.drag);

    // 高亮搜索的公司名称，方便识别 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    d3.selectAll('circle.searchTargetNode').style('fill', '#cd7bdd');

    // 绘制节点文字
    var labelsG = networkGraph.append('g').attr('id', 'labelsG');
    var labelsArray = labelsG.selectAll(".label")
            .data(dataSelectedIndexed.nodes, bindId)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr('dx', function(d) {
                if (d.labels[0] == 'Company') {
                    // 公司名称长移动多
                    return -20;
                } else if (d.labels[0] == 'Person') {
                    // 人名短移动少
                    return -15;
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型移动多，通常是公司
                    return -20;
                }
            })
            .attr('dy', 5)
            .style({"font-size":'10px', 'fill': '#fff'})
            .style('pointer-events', 'none')
            .text(function(d) {
                if (d.labels[0] == 'Company') {
                    // return d.properties['公司名称'];
                    return d.properties['公司名称'].substr(0, 4);
                } else if (d.labels[0] == 'Person') {
                    // 外国人名字也截断
                    return d.properties['姓名'].substr(0, 4);
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型
                    return d.properties['名称'].substr(0, 4);
                }
            });

    // 绘制全部长度的节点文字，供截图使用@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    var labelsFullG = networkGraph.append('g').attr('id', 'labelsFullG');
    var labelsArrayFull = labelsFullG.selectAll(".labelFull")
            .data(dataSelectedIndexed.nodes, bindId)
            .enter()
            .append("text")
            .attr("class", "labelFull")
            .attr('dy', -30)
            .attr('text-anchor', 'middle')
            .attr('opacity', showFullNodesLables) //全局变量控制，便于控制新载入节点
            .style({"font-size":'12px', 'fill': '#999'})
            .style('pointer-events', 'none')
            .text(function(d) {
                if (d.labels[0] == 'Company') {
                    // return d.properties['公司名称'];
                    return d.properties['公司名称'];
                } else if (d.labels[0] == 'Person') {
                    // 人名不显示全部字符串，因为节点已经显示
                    return '';
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型通常是公司，也要显示
                    return d.properties['名称'];
                }
            });

    // 开始力图
    // force.start();

    force.on('end', function() {
        // 记录每个节点的静态位置，建立以名字为索引的对象
        // addParentStaticPosition(dataSelected.nodesStaticPosition, nodesArray);
    });

    //通过记录的偏移量恢复上次偏移@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    var targetTransformOffset = {
        x: dataStore.scaleTransformRecord.offsetX,
        y: dataStore.scaleTransformRecord.offsetY
    }

    repositionGraph(targetTransformOffset, undefined, 'drag');

    //start 弹出右键删除节点菜单#########
    // function popRightClickMenu(rightClickMenu, d) {
    //     d3.event.preventDefault();
    //     // console.log(d);
    //     rightClickMenu.style("opacity", 1)
    //         .style('z-index', 15);

    //     // var removeNodeButtonClip = "<div class='removeNodeButtonWrapper'><button id='removeNodeButton'>删除该节点</button></div><div class='removeNodeButtonWrapper'><button id='removeNodeTreeButton'>修剪该节点</button></div><div class='removeNodeButtonWrapper investShow'><button id='allInvest'>公司股东与对外投资</button></div><div class='removeNodeButtonWrapper investShow'><button id='investCompany'>查看该节点对外投资关系</button></div><div class='removeNodeButtonWrapper investShow'><button id='InvestedByCompany'>查看该节点股东关系</button></div><div class='removeNodeButtonWrapper newsShows'><button id='viewCompanyNews'>查看该企业舆情热词</button></div>";
    //     var removeNodeButtonClip = "<div class='removeNodeButtonWrapper'><button id='removeNodeButton'>删除该节点</button></div><div class='removeNodeButtonWrapper'><button id='removeNodeTreeButton'>修剪该节点</button></div><div class='removeNodeButtonWrapper investShow'><button id='allInvest'>公司股东与对外投资</button></div><div class='removeNodeButtonWrapper newsShows'><button id='viewCompanyNews'>查看该企业舆情热词</button></div>";
    //     // var removeNodeButtonClip = "<div class='removeNodeButtonWrapper'><button id='removeNodeButton'>删除该节点</button></div><div class='removeNodeButtonWrapper'><button id='removeNodeTreeButton'>修剪该节点</button></div><div class='removeNodeButtonWrapper investShow'><button id='allInvest'>公司股东与对外投资</button></div>";

    //     rightClickMenu.html(removeNodeButtonClip)
    //         .style("left", (d3.event.pageX) + "px")
    //         .style("top", (d3.event.pageY) + "px");

    //     // 点击删除单个节点按钮
    //     d3.select('#removeNodeButton')
    //         .on('click', function(p, i) {
    //             // console.log('remove single node button hitted!');
    //             // console.log(d);
    //             rightClickMenu.style("opacity", 0)
    //                 .style("left", "-100px")
    //                 .style("top", "-100px");

    //             // 先要检测是不是能删除，联通2个以上节点就不能删除@@@@@@@@@@@@@@@@@@@@@@
    //             if (isNodeDeletable(d)) {
    //                 // 这里需要执行dataStore删除数据，通过右击菜单选项 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //                 dataStore.removeData([d.id]);
    //                 // 全局dataStore删除数据之后要本地数据对象dataSelected删除节点，渲染图像还是要用本地数据对象，这样能够保证筛选出来的效果不改变 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //                 // console.log('当前绘图数据对象: ');
    //                 // console.log(dataSelected);
    //                 // console.log('移除节点之后的绘图数据对象: ');
    //                 dataSelected.removeData([d.id]);
    //                 // console.log(dataSelected);
    //                 // 这里需要记录删除数据之后的dataStore，添加进dataStoreStack @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //                 // dataStoreStack.push(dataStore);
    //                 // setDataStoreStack(dataStoreStack, dataStore);
    //                 // console.log('detete data via remove single node: ');
    //                 // console.log(dataStoreStack);
    //                 // 添加新数据力图索引
    //                 dataSelectedIndexed = addIndex(dataSelected);
    //                 // 更新绘制力图
    //                 // refreshGraph(dataSelectedIndexed);
    //                 refreshGraph(dataSelectedIndexed, dataSelected); //多传dataSelected参数为了记录到stack
    //                 // refreshGraphDataDeleted(dataSelectedIndexed);
    //                 // 渲染剩下的节点图（有了筛选函数这个就不需要了，否则是渲染2次了）
    //                 // renderGraphByRemoveNode();
    //                 // 执行现有的过滤条件，副作用是孤立的点无法渲染，表现为摘除效果
    //                 // vm.$emit('updateGraphWithFiltedData');
    //                 // 变通：重置过滤条件
    //                 // vm.$data.selectedStatus.selectedLinksTypeList = ["投资", "法定代表人", "任职"];
    //                 // vm.$data.selectedStatus.selectedNodesType = 'All';
    //             } else {
    //                 alert('提示：限制删除当前节点');
    //                 return;
    //             }
    //         });
    //     // 点击删除子节点按钮
    //     d3.select('#removeNodeTreeButton')
    //         .on('click', function(p, i) {
    //             getDeleteNodeTreeInfo(d);
    //             rightClickMenu.style("opacity", 0)
    //                 .style("left", "-100px")
    //                 .style("top", "-100px");
    //         });

    //     //==判断右键菜单是否显示投资关系/新闻舆情 右键菜单
    //     if(d.labels[0]!='Company'){
    //         d3.selectAll('.investShow')
    //             .remove();
    //         d3.selectAll('.newsShows')
    //             .remove();
    //     }
    //     //== 点击进入投资与被投资关系圆形树图
    //     d3.select('#allInvest')
    //         .on('click', function(p, i){
    //             //== 圆形树图模态框
    //             // console.log("圆形树图模态框");
    //             $(".modal-dialog").css({"width":winWidth-200, "height":winHeight-250});
    //             $("#mymodal").modal({
    //                 keyboard: false,
    //                 backdrop: "static"
    //             })
    //             //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //             hideMouseTooltip();
    //             //清除上一次根节点记录
    //             ClusterRootNodes=[];
    //             ClusterRootNodes.push(d.properties['公司名称']);
    //             ClusterRootNodes.push(d.id);
    //             // console.log(ClusterRootNodes);
    //             rightClickMenu.style("opacity", 0)
    //                 .style("left", "-100px")
    //                 .style("top", "-100px");
    //             setTimeout(function(){
    //                 //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //                 hideMouseTooltip();
    //                 investAndBy = true;
    //                 // investRel = "invest";
    //                 fullScreenTree(); // 右键查看投资与股东关系时直接进入全屏模式
    //                 // renderCluster();
    //                 // console.log("allInvest");
    //             }, 200); //组件切换完成后才能捕获到切换过来的DIV
    //         })
    //     //== 点击进入投资关系圆形树图
    //     d3.select('#investCompany')
    //         .on('click', function(p, i){

    //             //== 圆形树图模态框
    //             // console.log("圆形树图模态框");
    //             $(".modal-dialog").css({"width":winWidth-200, "height":winHeight-250});
    //             $("#mymodal").modal({
    //                 keyboard: false,
    //                 backdrop: "static"
    //             })
    //             //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //             hideMouseTooltip();
    //             //清除上一次根节点记录
    //             ClusterRootNodes=[];
    //             ClusterRootNodes.push(d.properties['公司名称']);
    //             ClusterRootNodes.push(d.id);
    //             // console.log(ClusterRootNodes);
    //             rightClickMenu.style("opacity", 0)
    //                 .style("left", "-100px")
    //                 .style("top", "-100px");
    //             setTimeout(function(){
    //                 //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //                 hideMouseTooltip();
    //                 investRel = "invest";
    //                 fullScreenTree(); // 右键查看投资与股东关系时直接进入全屏模式
    //                 // renderCluster();
    //             }, 200); //组件切换完成后才能捕获到切换过来的DIV
    //         })
    //     //== 点击进入股东关系圆形树图
    //     d3.select('#InvestedByCompany')
    //         .on('click', function(p, i){

    //             //== 圆形树图模态框
    //             // console.log("圆形树图模态框");
    //             $(".modal-dialog").css({"width":winWidth-200, "height":winHeight-50});
    //             $("#mymodal").modal({
    //                 keyboard: false,
    //                 backdrop:"static"
    //             })
    //             //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //             hideMouseTooltip();
    //             //清除上一次根节点记录
    //             ClusterRootNodes=[];
    //             ClusterRootNodes.push(d.properties['公司名称']);
    //             ClusterRootNodes.push(d.id);
    //             // console.log(ClusterRootNodes);
    //             rightClickMenu.style("opacity", 0)
    //                 .style("left", "-100px")
    //                 .style("top", "-100px");
    //             setTimeout(function(){
    //                 //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //                 hideMouseTooltip();
    //                 investRel = "byInvested";
    //                 fullScreenTree(); // 右键查看投资与股东关系时直接进入全屏模式
    //                 // renderCluster();
    //             }, 200); //组件切换完成后才能捕获到切换过来的DIV
    //         })
    //     //== 点击进入舆情分析模态框
    //     // d3.select('#viewCompanyNews')
    //     //     .on('click', function(p,i){
    //     //         //== 舆情分析模态框
    //     //         console.log("舆情分析模态框");
    //     //         var wordCloudRootNodes = d.properties['公司名称'];
    //     //         $(".modal-dialog").css({"width":winWidth-200, "height":winHeight-50});
    //     //         $("#newsmodal").modal({
    //     //             keyboard: false,
    //     //             backdrop:"static"
    //     //         })
    //     //         //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //     //         hideMouseTooltip();
    //     //         rightClickMenu.style("opacity", 0)
    //     //             .style("left", "-100px")
    //     //             .style("top", "-100px");
    //     //         setTimeout(function(){
    //     //             //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //     //             hideMouseTooltip();
    //     //             // renderWordCloudInstance = null;
    //     //             // renderWordCloudInstance = new renderWordCloud(wordCloudRootNodes);
    //     //             renderWordCloudData(wordCloudRootNodes);
    //     //         }, 200); //组件切换完成后才能捕获到切换过来的DIV
    //     //     })
    //     d3.select('#viewCompanyNews')
    //         .on('click', function(p,i){
    //             //== 舆情分析模态框
    //             console.log("舆情分析模态框");
    //             //== 每次进入词云清楚词云节点坐标
    //             wordCloudCoor.x = 0;
    //             wordCloudCoor.y = 0;
    //             wordCloudRootNodesId = d.id;
    //             wordCloudRootNodes = d.properties['公司名称'];
    //             wordCloudBubbles = createWordCloudBubbles();
    //             leftBarWidth = document.getElementById('leftSideBar').offsetWidth;
    //             if(currentZoom>=1){
    //                 wordCloudBubbles.style('left', d.x*currentZoom + currentOffset.x + leftBarWidth + 20 +'px')
    //                     .style('top', d.y*currentZoom + currentOffset.y - 130 +'px');
    //             }else{
    //                 wordCloudBubbles.style('left', d.x*currentZoom + currentOffset.x + leftBarWidth + 20*currentZoom +'px')
    //                     .style('top', d.y*currentZoom + currentOffset.y - 110 - 20*currentZoom +'px');
    //             }
    //             setTimeout(function(){
    //                 //==切换拓扑图与集群时有时提示框会不隐藏此处将其强制隐藏
    //                 hideMouseTooltip();
    //                 // renderWordCloudInstance = null;
    //                 // renderWordCloudInstance = new renderWordCloud(wordCloudRootNodes);
    //                 renderWordCloudData(wordCloudRootNodes);
    //                 $(".bot").html("x");
    //             }, 200); //组件切换完成后才能捕获到切换过来的DIV
    //         })
    // }
    //end 弹出右键删除节点菜单#########

    //== 删除子节点或叶子节点
    this.removeNodeOrLeafNodes = function(d){
    	// 先要检测是不是能删除，联通2个以上节点就不能删除
    	if (isNodeDeletable(d)) {
    	    // 这里需要执行dataStore删除数据 
    	    dataStore.removeData([d.id]);
    	    dataSelected.removeData([d.id]);
    	    // 添加新数据力图索引
    	    dataSelectedIndexed = addIndex(dataSelected);
    	    // 更新绘制力图
    	    refreshGraph(dataSelectedIndexed, dataSelected); //多传dataSelected参数为了记录到stack
    	} else {
    		//删除叶子节点
    	    getDeleteNodeTreeInfo(d);
    	}
    }

    //start 判断单点可删除性#########
    function isNodeDeletable(d) {
        if (d.weight <=1) {
            console.log('one links');
            return true;
        } else if (d.weight > 1) {
            var connectedLinks = dataSelected.links.filter(function(l) {
                return l.startNode == d.id || l.endNode == d.id;
            });

            var connectedNodesIdSet = d3.set();
            connectedLinks.forEach(function(l) {
                if (!connectedNodesIdSet.has(l.startNode)) {
                    connectedNodesIdSet.add(l.startNode);
                }

                if (!connectedNodesIdSet.has(l.endNode)) {
                    connectedNodesIdSet.add(l.endNode);
                }
            });

            if (connectedNodesIdSet.size() <= 2) {
                console.log('many links between nodes');
                return true;
            } else {
                console.log('oops cant delete this node');
                return false;
            }
        }
    }
    //end 判断单点可删除性#########

    // start 收集删除节点所需信息，当前及所有节点、边######
    function getDeleteNodeTreeInfo(node) {
        // 生成载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // var animationLayer = createAnimationLayer();
        // 当前节点id
        var nodeId = node.id;
        var links = dataSelectedIndexed.links;
        var allRelations = '';
        var allRelationsTemArray = [];

        links.forEach(function(l) {
            var linkId = l.id;
            var sourceId = l.source.id;
            var targetId = l.target.id;
            var relation = sourceId + '-' + linkId + '-' + targetId;

            allRelationsTemArray.push(relation);
        });
        // 视图内所有关系和节点字符串拼接
        allRelations = allRelationsTemArray.join();
        // console.log(allRelations);

        $.post("../Access/function7ForAjax",
           {
               //接口设定的参数名称
               nodeId: nodeId,
               relationships: allRelations
           },
           function(data,status){
            //    console.log(data);
            //    console.log(status);
            //    console.log(data.split(','));
                if (status != 'success') {
                    // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    d3.select('#animationLayer').remove();
                    alert('服务器没有响应，请稍后再试');
                    return;
                }

               if(!data) {
                //    console.log('该节点无法修剪');
                   alert('提示：不存在可以修剪的节点。');
                   // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   d3.select('#animationLayer').remove();
                   return;
               } else {
                   var removeIdArray = data.split(',');
                   // 这里需要执行dataStore删除数据，通过右击菜单选项 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   dataStore.removeData(removeIdArray);
                   // 这里需要记录删除数据之后的dataStore，添加进dataStoreStack @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    //dataStoreStack.push(dataStore);
                    // setDataStoreStack(dataStoreStack, dataStore);
                //    console.log('detete data via remove round nodes: ');
                //    console.log(dataStoreStack);

                   // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   d3.select('#animationLayer').remove();

                   // 全局dataStore删除数据之后要本地数据对象dataSelected删除节点，渲染图像还是要用本地数据对象，这样能够保证筛选出来的效果不改变 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                   dataSelected.removeData(removeIdArray);
                   // 添加新数据力图索引
                   dataSelectedIndexed = addIndex(dataSelected);
                   // 更新绘制力图
                    //    refreshGraph(dataSelectedIndexed);
                    refreshGraph(dataSelectedIndexed, dataSelected); //多传dataSelected参数为了记录到stack
                   // 渲染剩下的节点图（不需要了）
                   //renderGraphByRemoveNode();
                   // 执行现有的过滤条件，副作用是孤立的点无法渲染，表现为摘除效果
                //    vm.$emit('updateGraphWithFiltedData');
               }
           } ,
           // 返回数据类型必需指定为text
           'text'
        );
    }
    // end 收集删除节点所需信息，当前及所有节点、边######

    // start 节点静态位置，新节点原始位置######
    function addParentStaticPosition(nodesStaticPositionContainer, nodesArray) {
        nodesArray.style('',function(d) {
            // console.log(d);
            if (d.labels[0] == 'Company') {
                // console.log(d.properties['公司名称']);
                dataSelected.nodesStaticPosition[d.properties['公司名称']] = {};
                dataSelected.nodesStaticPosition[d.properties['公司名称']].fx = d.x;
                dataSelected.nodesStaticPosition[d.properties['公司名称']].fy = d.y;
                // console.log(dataSelected.nodesStaticPosition[d.properties['公司名称']]);
            } else if (d.labels[0] == 'Person') {
                // console.log(d.properties['姓名']);
                dataSelected.nodesStaticPosition[d.properties['姓名']] = {};
                dataSelected.nodesStaticPosition[d.properties['姓名']].fx = d.x;
                dataSelected.nodesStaticPosition[d.properties['姓名']].fy = d.y;
            }
        });
        // console.log(dataSelected.nodesStaticPosition);
    }
    // end 节点静态位置，新节点原始位置######

    // start 将新节点初始化为父节点位置 #####
    function moveNewNodesToParents(tickCounter, nodesArray, labelsArray, linksArray, linksLabelsArray) {
        var stayParentTime = 25;
        if(stayParentTime < 25) {
            //节点坐标
            nodesArray.attr("cx", function(d) {
                    // console.log(d.fx);
                    var positonX = d.fx ? d.fx:d.x;
                    return positonX;
                })
                .attr("cy", function(d) {
                    var positonY = d.fy ? d.fy:d.y;
                    return positonY;
                });

            // 节点标签
            labelsArray.attr("x", function(d) {
                    var positonX = d.fx ? d.fx:d.x;
                    return positonX;
                })
                .attr("y", function(d) {
                    var positonY = d.fy ? d.fy:d.y;
                    return positonY;
                });

            linksArray.style('opacity', 0);

            // 连线标签
            linksLabelsArray.style('opacity', 0);
        } else {
            nodesArray.attr("cx", function(d) {
                    // 尝试用svg边距控制节点最大震荡幅度
                    if (d.x > 2500) {
                        return 1200;
                    } else if (d.x < -200) {
                        return -200;
                    } else {
                        return d.x;
                    }
                })
                .attr("cy", function(d) {
                    if (d.y > 2500) {
                        return 1200;
                    } else if (d.y < -200) {
                        return -200;
                    } else {
                        return d.y;
                    }
                });

            // 节点标签
            labelsArray.attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });

            linksArray.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; })
                .style('opacity', 1);

            // 连线标签
            linksLabelsArray.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
                .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; })
                .attr('transform', function(d) {
                    return rotateLinkLable(d);
                })
                .style('opacity', 1);
        }
    }
    // end 将新节点初始化为父节点位置 #####

    //start 双击节点载入新数据########
    this.loadData = function(d) {

        // 生成载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // var animationLayer = createAnimationLayer();

        // 传入公司名称，ajax载入数据
        var queryCompanyExplore = d.properties['公司名称'];
        // console.log(queryCompanyExplore);
        //接口设计有改动，需要传入所有的节点id@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        var queryInfoContainer = [];
        var targetCompanyId = d.id;
        // console.log(targetCompanyId);
        queryInfoContainer.push(targetCompanyId); //目标节点id放第一个
        dataSelected.nodesIdSet.remove(targetCompanyId); //移除目标节点id
        var allOtherNodesId = dataSelected.nodesIdSet.values();
        queryInfoContainer = queryInfoContainer.concat(allOtherNodesId);
        dataSelected.nodesIdSet.add(targetCompanyId); //加回目标节点id
        // console.log(queryInfoContainer);
        var postIdsJoined = queryInfoContainer.join(',');
        // console.log(postIdsJoined);

        var dataTypeExplore = "json";
        // $.post("http://localhost:8080/hh/index/function4ForAjax",
        // $.post("function4ForAjax",
        $.post("../Access/function10ForAjax",
            {
                // compNameAjax: queryCompanyExplore,
                // nodeIds: 'woops', //测试出错处理
                nodeIds: postIdsJoined,
                companyStr: 'All'  //更改后增加的参数
            },
            function(data,status){
                // console.log('stats is: ');
                // console.log(status);
                if (status != 'success') {
                    // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    d3.select('#animationLayer').remove();
                    alert('服务器没有响应，请稍后再试');
                    return;
                }

                // 下探原始数据入口
                var rawExploreData = data.results[0].data;
                // console.log(rawExploreData);
                // 将原始数据转换为力图未索引数据
                var forceExploreData = iniForceData(rawExploreData);
                // console.log(forceExploreData.links);
                // 这里需要执行为dataStore添加新数据 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                addExploreDataToStore(forceExploreData, dataStore);
                // 这里需要记录增加数据之后的dataStore，添加进dataStoreStack @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                // dataStoreStack.push(dataStore);
                // setDataStoreStack(dataStoreStack, dataStore);
                // console.log('add data via explore node: ');
                // console.log(dataStoreStack);

                // 将新下探数据压入绘图数据容器
                forceExploreData.links.forEach(function(l) {
                    // 压入links到新数据对象
                    // 增进合并黑名单验证@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    // if (!dataSelected.linksIdSet.has(l.id)) {
                    if (!dataSelected.linksIdSet.has(l.id) && !dataStore.mergedLinksIdSet.has(l.id)) {
                        // 如果出现没有收录的关系，激活更新图表标记
                        // enableIsUpdateForce();
                        // 压入新关系数据到绘图数据容器
                        dataSelected.linksIdSet.add(l.id);
                        dataSelected.links.push(l);
                    }
                    // 压入links两端的nodes到新数据对象
                    // 增进合并黑名单验证@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    if (!dataSelected.nodesIdSet.has(l.startNode) && !dataStore.mergedNodesIdSet.has(l.startNode)) {
                    // if (!dataSelected.nodesIdSet.has(l.startNode)) {
                        dataSelected.nodesIdSet.add(l.startNode);

                        var sourceNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                            return n.id == l.startNode;
                        });

                        // 为节点添加父节点静止位置@@@@@@@@@@@@@@@@@@@@@@@@@
                        // if (d.labels[0] == 'Company') {
                        //     sourceNodeFiltedArray[0].fx = dataSelected.nodesStaticPosition[d.properties['公司名称']].fx;
                        //     sourceNodeFiltedArray[0].fy = dataSelected.nodesStaticPosition[d.properties['公司名称']].fy;
                        // } else if (d.labels[0] == 'Person') {
                        //     sourceNodeFiltedArray[0].fx = dataSelected.nodesStaticPosition[d.properties['姓名']].fx;
                        //     sourceNodeFiltedArray[0].fy = dataSelected.nodesStaticPosition[d.properties['姓名']].fy;
                        // }
                        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                        // console.log(sourceNodeFiltedArray[0]);
                        dataSelected.nodes.push(sourceNodeFiltedArray[0]);
                    }
                    // 压入links两端的nodes到新数据对象
                    // 增进合并黑名单验证@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                    if (!dataSelected.nodesIdSet.has(l.endNode) && !dataStore.mergedNodesIdSet.has(l.endNode)) {
                    // if (!dataSelected.nodesIdSet.has(l.endNode)) {
                        dataSelected.nodesIdSet.add(l.endNode)

                        var targetNodeFiltedArray = forceExploreData.nodes.filter(function(n) {
                            return n.id == l.endNode;
                        });

                        // 为节点添加父节点静止位置@@@@@@@@@@@@@@@@@@@@@@@@@
                        // if (d.labels[0] == 'Company') {
                        //     targetNodeFiltedArray[0].fx = dataSelected.nodesStaticPosition[d.properties['公司名称']].fx;
                        //     targetNodeFiltedArray[0].fy = dataSelected.nodesStaticPosition[d.properties['公司名称']].fy;
                        // } else if (d.labels[0] == 'Person') {
                        //     targetNodeFiltedArray[0].fx = dataSelected.nodesStaticPosition[d.properties['姓名']].fx;
                        //     targetNodeFiltedArray[0].fy = dataSelected.nodesStaticPosition[d.properties['姓名']].fy;
                        // }
                        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                        // console.log(targetNodeFiltedArray[0]);
                        dataSelected.nodes.push(targetNodeFiltedArray[0]);
                    }
                });
                //判断去除游离的点
                // 获取所有连线的开始节点与结束节点的id号
                var getStartEndNodeIdSet = d3.set();
                dataSelected.links.forEach(function(l){
                    if(!getStartEndNodeIdSet.has(l.startNode)){
                        getStartEndNodeIdSet.add(l.startNode);
                    }
                    if(!getStartEndNodeIdSet.has(l.endNode)){
                        getStartEndNodeIdSet.add(l.endNode);
                    }
                })
                dataSelected.nodes = dataSelected.nodes.filter(function(n){
                    if(!getStartEndNodeIdSet.has(n.id)){
                        dataSelected.nodesIdSet.remove(n.id);
                    }
                    return getStartEndNodeIdSet.has(n.id);
                })

                // 添加新数据力图索引
                dataSelectedIndexed = addIndex(dataSelected);
                // console.log('dataSelectedIndexed from loadData()');
                // console.log(dataSelectedIndexed);
                // 移除载入动画@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                d3.select('#animationLayer').remove();
                // 更新绘制力图
                refreshGraph(dataSelectedIndexed, dataSelected); //多传dataSelected参数为了记录到stack
            },
            // 设置ajax返回数据类型为json
            dataTypeExplore
        )
    }
    //end 双击节点载入新数据########

    // //start 删除数据刷新图形 #########
    // function refreshGraphDataDeleted(dataSelectedIndexed) {
    //     var linksData = dataSelectedIndexed.links;
    //     var nodesData = dataSelectedIndexed.nodes;
    //
    //     // 绑定新增数据
    //     force.nodes(nodesData).links(linksData);
    //
    //     //绘制关系
    //     linksArray = linksArray.data(linksData);
    //     linksArray.exit().remove();
    //
    //     //绘制关系文字
    //     linksLabelsArray = linksLabelsArray.data(linksData);
    //     linksLabelsArray.exit().remove();
    //
    //     nodesArray = nodesArray.data(nodesData);
    //     nodesArray.exit().remove();
    //
    //     // 绘制节点文字
    //     labelsArray = labelsArray.data(nodesData);
    //     labelsArray.exit().remove();
    //
    //     // 绘制全部长度的节点文字，供截图使用@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //     labelsArrayFull = labelsArrayFull.data(nodesData);
    //     labelsArrayFull.exit().remove();
    // }
    // //end 删除数据刷新图形 #########

    //start 数据绑定标记函数 ######### no use any more
    var key = function(d) {
        return d.key;
    };
    //end 数据绑定标记函数 #########

    //start 载入新数据刷新图形 #########
    function refreshGraph(dataSelectedIndexed, dataSelected) {
        //存储数据堆栈@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        parallelStack.pushData(dataStore, dataSelected);
        // console.log('from refreshGraph -- parallelStack压入下探/删除数据： ');
        // console.log(parallelStack);
        //判断是否可以棱镜一下
        smartAnalyseOrNot();

        var linksData = dataSelectedIndexed.links;
        var nodesData = dataSelectedIndexed.nodes;
        // console.log('linksData: ');
        // console.log(linksData);

        // 绑定新增数据
        force.nodes(nodesData).links(linksData);
        // 开始计算布局
        force.start();

        //测试销毁删除数据之后的dom@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        //绘制关系
        // linksArray.data(linksData, key).exit().remove();
        // linksArray = linksArray.data(linksData, key);
        // linksArray.exit().remove();

        linksArray.data(linksData, bindId).exit().transition().duration(300).remove();

        // d3.selectAll('path.link').data(linksData, key).exit().remove();

        //绘制关系文字
        // linksLabelsArray = linksLabelsArray.data(linksData, bindId);
        // linksLabelsArray.exit().remove();

        linksLabelsArray.data(linksData, bindId).exit().transition().duration(300).remove();

        //绘制投资关系文字
        linksInvestPercentArray = linksInvestPercentArray.data(linksData, bindId);
        linksInvestPercentArray.exit().transition().duration(300).remove();

        nodesArray = nodesArray.data(nodesData, bindId);
        nodesArray.exit().transition().duration(300).remove();
        // nodesArray.exit().transition().duration(1000).remove();

        // 绘制节点文字
        labelsArray = labelsArray.data(nodesData, bindId);
        labelsArray.exit().transition().duration(300).remove();

        // 绘制全部长度的节点文字
        labelsArrayFull = labelsArrayFull.data(nodesData, bindId);
        labelsArrayFull.exit().transition().duration(700).remove();
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

        linksArray = linksArray.data(linksData, bindId);
        // linksArray = linksArray.data(linksData, key);
        linksArray.enter()
            // .append("line")
            .append("path")
            .attr("id", function(d) {
                return d.id;
            })
            .attr("class", "link")
            .style({'fill':'none', 'stroke-width':'1px'})
            .style('stroke', function(d) {
                // return linkColorScale(d.type);
                if(d.type == '投资'){
                    return nodesColor.invest;
                }else if(d.type == '法定代表人'){
                    return nodesColor.legalRepre;
                }else{
                    return nodesColor.serve;
                }
            })
            // .attr("marker-end", 'url(#arrow)');
            .attr("marker-end", function(d){
                var arrowColor;
                if(d.type == '投资'){
                    arrowColor = nodesColor.invest;
                }else if(d.type == '法定代表人'){
                    arrowColor = nodesColor.legalRepre;
                }else{
                    arrowColor = nodesColor.serve;
                }
                var nodeWeight = d.target.weight<50 ? d.target.weight/2 : 15;
                var xOffset = 32 + nodeWeight;
                var arrow = arrowF(arrowColor, d.id, xOffset);
                return 'url(#arrow'+ d.id +')';
            })
        // // 删除节点dom销毁
        // linksArray.exit();

        //绘制关系文字
        linksLabelsArray = linksLabelsArray.data(linksData, bindId);
        linksLabelsArray.enter()
            .append("text")
            .attr("class", "linksLabels")
            // .attr("dx", "70px")
            .attr("dy", "-3px")
            .attr('text-anchor', 'middle')
            .style({"font-size":'12px', 'fill': '#666'})
            .append("textPath")
            .attr("xlink:href",function(d) {
                return '#' + d.id;
            })
            .attr('startOffset', '40%')
            .text(function(d) {
                if (d.type == '任职') {
                    if (d.properties['职务']) {
                        return d.properties['职务'];
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
        // // 删除节点dom销毁
        // linksLabelsArray.exit();

        //绘制投资比例
        linksInvestPercentArray = linksInvestPercentArray.data(linksData, bindId);
        linksInvestPercentArray.enter()
            .append("text")
            .attr("class", "linksInvestPercent")
            // .attr("dx", "70px")
            .attr("dy", "-3px")
            .attr('text-anchor', 'middle')
            .attr('opacity', showInvestPercent) //全局变量控制，便于控制新载入节点
            .style({"font-size":'12px', 'fill': '#666'})
            .append("textPath")
            .attr("xlink:href",function(d) {
                return '#' + d.id;
            })
            .attr('startOffset', '65%')
            .text(function(d) {
                if (d.type == '投资') {
                    if (d.properties['投资占比']) {
                        var investRatio = Number(d.properties['投资占比'].substr(0, 6))*10000;
                        investRatio = Math.round(investRatio)/100;
                        if(!isNaN(d.properties['投资占比'])){
                            return '(占股' + investRatio + '%)';   
                        }else{
                            return '(占股' + d.properties['投资占比'] + ')'; 
                        }
                    }
                }
            });

        nodesArray = nodesArray.data(nodesData, bindId);
        nodesArray.enter()
            .append("circle")
            .attr("class", "node")
            .classed('nodeCircle', true)
            .classed('searchTargetNode', function(d) { //为目标搜索节点添加类名
                if(d.labels[0] == 'Company') {
                    // if(d.properties['公司名称'] == dataStore.searchTargetNode) {
                    //     return true;
                    // }
                    if(dataStore.searchTargetNode.has(d.properties['公司名称'])) {
                        return true;
                    }
                }
            })
            .attr("r", 25)
            .style('fill', function(d) {
                // return colorScale(d.labels[0]);
                if(d.labels[0] == "Company"){
                    return nodesColor.company;
                }else if(d.labels[0] == "Person"){
                    return nodesColor.people;
                }else{
                    return nodesColor.other;
                }
            })
            // .style('stroke', '#ccc')
            // .style('stroke-width', '2px')
            .style('stroke-width', function(d) {
                if (d.properties.hasOwnProperty('风险评级')) {
                    // console.log('got risk record');
                    // console.log(d.properties['风险评级']);
                    // console.log(d.properties['风险指数']);
                    if (d.properties['风险评级'] == '无风险') {
                        return '4px';
                    } else if (d.properties['风险评级'] == '低风险') {
                        return '6px';
                    } else if (d.properties['风险评级'] == '中风险') {
                        return '6px';
                    } else if (d.properties['风险评级'] == '高风险') {
                        return '6px';
                    } else {
                        return '2px';
                    }
                } else {
                    return '2px';
                }
            })
            .style('stroke', function(d) {
                if (d.properties.hasOwnProperty('风险评级')) {
                    if (d.properties['风险评级'] == '无风险') {
                        return nodesColor.safe;
                    } else if (d.properties['风险评级'] == '低风险') {
                        return nodesColor.lowRisk;
                    } else if (d.properties['风险评级'] == '中风险') {
                        return nodesColor.middleRisk;
                    } else if (d.properties['风险评级'] == '高风险') {
                        return nodesColor.highRisk;
                    } else {
                        return '#ccc';
                    }
                } else {
                    return '#ccc';
                }
            })
            .on('touchstart', function(d) {
            	showNodeName(d);
            	// 阻止节点触摸冒泡事件的发生
            	d3.event.preventDefault();
            	// console.log(d3.event);
            	nodeTouchPageY = d3.event.touches[0].pageY;
            	nodeTouchPageX = d3.event.touches[0].pageX;
            	nodeOperTimer = setTimeout(function(){
            		// console.log("3s has arrived");
            		showNodeOper(nodeTouchPageY-60, nodeTouchPageX-60, d);
            	}, 1000);	
            })
            .on('touchmove', function(d){
            	// console.log('touchmove is happened');
            	// console.log(d3.event);

            	nodeTouchMPageY = d3.event.touches[0].pageY;
            	nodeTouchMPageX = d3.event.touches[0].pageX;

            	if(Math.abs(nodeTouchPageY-nodeTouchMPageY)>5 || Math.abs(nodeTouchPageX - nodeTouchMPageX)>5){
					clearTimeout(nodeOperTimer);
            	}
            	if(d3.select('#nodeOper').style('display') === 'block'){
            		moveNodeOper(nodeTouchMPageY-60,nodeTouchMPageX-60);
            	}
            })
            .on('touchend', function(d) {
            	clearTimeout(nodeOperTimer);
            	//== 将节点信息推入状态管理器
            	store.dispatch({ type: 'UPDATE_TOUCHNODEINFOS', data:d });
            	console.log(store.getState());
            	// hideNodeName();
            })
            .call(force.drag);

        // // 高亮搜索的公司名称，方便识别 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        d3.selectAll('circle.searchTargetNode').style('fill', '#cd7bdd');


        // 绘制节点文字
        labelsArray = labelsArray.data(nodesData, bindId);
        labelsArray.enter()
            .append("text")
            .attr("class", "label")
            .attr('dx', function(d) {
                if (d.labels[0] == 'Company') {
                    // 公司名称长移动多
                    return -23;
                } else if (d.labels[0] == 'Person') {
                    // 人名短移动少
                    return -20;
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型移动多，通常是公司
                    return -23;
                }
            })
            .attr('dy', 5)
            .style({"font-size":'11px', 'fill': '#fff'})
            .style('pointer-events', 'none')
            .text(function(d) {
                if (d.labels[0] == 'Company') {
                    // return d.properties['公司名称'];
                    return d.properties['公司名称'].substr(0, 4);
                } else if (d.labels[0] == 'Person') {
                    return d.properties['姓名'].substr(0, 4);
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型
                    return d.properties['名称'].substr(0, 4);
                }
            });
        // // 删除节点dom销毁
        // labelsArray.exit();

        // 绘制全部长度的节点文字，供截图使用@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        labelsArrayFull = labelsArrayFull.data(nodesData, bindId);
        labelsArrayFull.enter()
            .append("text")
            .attr("class", "labelFull")
            .attr('dy', -30)
            .attr('text-anchor', 'middle')
            .attr('opacity', showFullNodesLables)
            .style({"font-size":'12px', 'fill': '#999'})
            .style('pointer-events', 'none')
            .text(function(d) {
                if (d.labels[0] == 'Company') {
                    // return d.properties['公司名称'];
                    return d.properties['公司名称'];
                } else if (d.labels[0] == 'Person') {
                    // 人名不显示全部字符串，因为节点已经显示
                    return '';
                } else if (d.labels[0] == 'Unknown') {
                    // 未知类型通常是公司，也要显示
                    return d.properties['名称'];
                }
            });
        // // 删除节点dom销毁
        // labelsArrayFull.exit();



        // 重置计数器
        resetTickCounter();

        // force.start();


        // //测试销毁删除数据之后的dom@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // //绘制关系
        // // linksArray.data(linksData, key).exit().remove();
        // linksArray = linksArray.data(linksData);
        // linksArray.exit().remove();
        //
        // //绘制关系文字
        // linksLabelsArray = linksLabelsArray.data(linksData);
        // linksLabelsArray.exit().remove();
        //
        // //绘制投资关系文字
        // linksInvestPercentArray = linksInvestPercentArray.data(linksData);
        // linksInvestPercentArray.exit().remove();
        //
        // nodesArray = nodesArray.data(nodesData);
        // nodesArray.exit().remove();
        // // nodesArray.exit().transition().duration(1000).remove();
        //
        // // 绘制节点文字
        // labelsArray = labelsArray.data(nodesData);
        // labelsArray.exit().remove();
        //
        // // 绘制全部长度的节点文字
        // labelsArrayFull = labelsArrayFull.data(nodesData);
        // labelsArrayFull.exit().remove();
        // //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


        // 一倍放大，解决载入数据后自动放大的问题@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        // doZoom(); //not works

    }
    //end 载入新数据刷新图形 #########

    //start 减少力图动画时间 #########
    function checkForceAniman() {
        tickCounter++;
        if (tickCounter > 150) {
            force.stop();
        }
    }
    //end 减少力图动画时间 #########

    //start 动画控制：拖动、缩放 #######
    function repositionGraph(offset, zValue, mode) {
        // if transition?
        var doTr = (mode == 'move');
        // drag
        if (offset !== undefined && (offset.x != currentOffset.x || offset.y != currentOffset.y)) {
            var g = d3.select('g.grpParent');

            if(doTr) {
                g = g.transition().duration(500);
            }

            g.attr('transform', function(d) {
                return 'translate(' + offset.x + ',' + offset.y + ')';
            });

            currentOffset.x = offset.x;
            currentOffset.y = offset.y;
            // console.log(currentOffset.x);
            // console.log(currentOffset.y);
            // 记录画图偏移量@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            dataStore.setTransformOffset(currentOffset.x, currentOffset.y);
            // console.log(dataStore.scaleTransformRecord);
            // console.log('d3.event.scale: ');
            // console.log(d3.event.scale);
            // console.log('currentZoom: ');
            // console.log(currentZoom);

            // 记录相对缩放比率
            // if (d3.event.scale && currentZoom) {
            //     var scaleTransformRatio = d3.event.scale / currentZoom;
            //     dataStore.setScaleRatio(scaleTransformRatio);
            // }

            // console.log('scaleTransformRatio: ');
            // console.log(scaleTransformRatio);
            // 记录缩放比例(d3.event.scale不能访问会报错，如果没有缩放行为过)
            // if (d3.event.scale) {
            //     dataStore.setZoomScale(d3.event.scale);
            // }
            //目的是拖动时更新词云坐标
            nodesArray.attr('fill', function(d){
                if(d.id == wordCloudRootNodesId && wordCloudBubbles!=null){
                    wordCloudCoor.x = d.x;
                    wordCloudCoor.y = d.y;
                }
                return colorScale(d.labels[0]);
            });
        }

        // zoom: new value of zoom
        if (zValue === undefined) {
            if (mode != 'tick') {
                //更新词云div坐标
                if(wordCloudCoor.x !=0 && wordCloudCoor.y !=0 && wordCloudBubbles!=null){
                    if(currentZoom>=1){
                        wordCloudBubbles.style('left', wordCloudCoor.x*currentZoom + currentOffset.x + leftBarWidth + 20 +'px')
                            .style('top', wordCloudCoor.y*currentZoom + currentOffset.y - 130 +'px');
                    }else{
                        wordCloudBubbles.style('left', wordCloudCoor.x*currentZoom + currentOffset.x + leftBarWidth + 20*currentZoom +'px')
                            .style('top', wordCloudCoor.y*currentZoom + currentOffset.y - 110 - 20*currentZoom +'px');
                    }
                }
                return;
            }
            // console.log("repositionGraph");
            zValue = currentZoom;
            // console.log('zValue is undefined and is: ' + zValue);
        } else {
            currentZoom = zValue;
            // console.log('zValue is defined and currentZoom is: ' + currentZoom);
        }

        // move links
        var allLinks = doTr ? linksArray.transition().duration(500) : linksArray;
        // allLinks.attr('x1', function(d) { return zValue*(d.source.x); })
        //     .attr('y1', function(d) { return zValue*(d.source.y); })
        //     .attr('x2', function(d) { return zValue*(d.target.x); })
        //     .attr('y2', function(d) { return zValue*(d.target.y); });
        // 更新连线坐标：弧线
        // allLinks.attr("d", linkArc);
        allLinks.attr("d", function(d) {
            return linkArc(d, zValue);
        });

        // move nodes
        var allNodes = doTr ? nodesArray.transition().duration(500) : nodesArray;
        allNodes.attr('transform', function(d) {
            //更新词云div坐标
            // console.log("repositionGraph111");
            if(d.id == wordCloudRootNodesId && wordCloudBubbles!=null){
                wordCloudCoor.x = d.x;
                wordCloudCoor.y = d.y;
                if(currentZoom>=1){
                    wordCloudBubbles.style('left', wordCloudCoor.x*currentZoom + currentOffset.x + leftBarWidth + 20 +'px')
                        .style('top', wordCloudCoor.y*currentZoom + currentOffset.y - 130 +'px');
                }else{
                    wordCloudBubbles.style('left', wordCloudCoor.x*currentZoom + currentOffset.x + leftBarWidth + 20*currentZoom +'px')
                        .style('top', wordCloudCoor.y*currentZoom + currentOffset.y - 110 - 20*currentZoom +'px');
                }
            }
            return 'translate(' + zValue*d.x + ',' + zValue*d.y + ')';
        });
        // 改变节点大小
        allNodes.attr('r', function(d) {
        	// return 20;
        	//== 节点大小可变移动端暂时不用
            var nodeWeight = d.weight<50 ? d.weight/2 : 20;
            if(zValue >= 1) {
                return 20+nodeWeight;
            } else {
                return (20+nodeWeight) * zValue;
            }
        });

        //move node text
        // 更新node文字坐标
        var allNodesLabels = doTr ? labelsArray.transition().duration(500) : labelsArray;
        allNodesLabels.attr('transform', function(d) {
            return 'translate(' + zValue*d.x + ',' + zValue*d.y + ')';
        });
        // 改变文字大小
        // allNodesLabels.style('font-size', function() {
        //     return 12 * zValue + 'px';
        // });
        // 改变文字可见性，缩小到0.5以下文字透明不可见
        allNodesLabels.style('opacity', function() {
            if (zValue < 0.7) {
                return 0;
            } else {
                return 1;
            }
        })

        // 更新供截图使用的node完整长度文字坐标
        var allNodesFullLabels = doTr ? labelsArrayFull.transition().duration(500) : labelsArrayFull;
        allNodesFullLabels.attr('transform', function(d) {
            return 'translate(' + zValue*d.x + ',' + zValue*d.y + ')';
        });

        // 改变文字大小
        // allNodesFullLabels.style('font-size', function() {
        //     return 12 * zValue + 'px';
        // });

        // nodesText.attr("x", function(d){ return d.x; })
        //     .attr("y", function(d){ return d.y; });

        //move edge text
        // 连线文字采用textpath之后，不用手动控制位置
        //更新连接线上文字的位置
        // var allLinksLabels = doTr ? linksLabelsArray.transition().duration(500) : linksLabelsArray;
        // allLinksLabels.attr('transform', function(d) {
        //     return 'translate(' + zValue*((d.source.x + d.target.x)/2) + ',' + zValue*((d.source.y + d.target.y)/2) + ')';
        // });
        // edgesText.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
        //     .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
    }
    //end 动画控制：拖动、缩放 #######

    // start 拖动图像 ###############
    function dragmove(d) {
        var offset = {
            x: currentOffset.x + d3.event.dx,
            y: currentOffset.y + d3.event.dy
        };
        repositionGraph(offset, undefined, 'drag');
    }
    // end 拖动图像 ###############

    // start 缩放图像 ###############
    function doZoom(increment) {
        var newZoom = increment === undefined ? d3.event.scale : zoomScale(currentZoom+increment);
        // console.log('d3.event.scale: ' + d3.event.scale);
        // console.log('zoomScale(currentZoom+increment): ' + zoomScale(currentZoom+increment));

        if (currentZoom == newZoom) {
            return; //no zoom change
        }

        //get current graph window size
        // s = getViewportSize();
        // width = s.w < WIDTH ? s.w : WIDTH;
        // height = s.h < HEIGHT ? s.h : HEIGHT;

        //compute new offset, so graph center wont move
        var zoomRatio = newZoom / currentZoom;
        var newOffset = {
            x: currentOffset.x*zoomRatio + graphConfig.svgWidth/2*(1-zoomRatio),
            y: currentOffset.y*zoomRatio + graphConfig.svgHeight/2*(1-zoomRatio)
        };

        // console.log('newZoom: ' + newZoom);
        //repositionGraph
        repositionGraph(newOffset, newZoom, 'zoom');
    }
    // end 缩放图像 ###############

    // start 重置力图动画计数器#####
    function resetTickCounter() {
        tickCounter = 0;
    }
    // end 重置力图动画计数器#####

    // start 弧线连线#############################
    function linkArc(d, zValue) {
        // console.log('dataSelectedIndexed from linkArc()');
        // console.log(dataSelectedIndexed);
        // 节点之间重叠关系数量
        var relationshipsDimension = dataSelectedIndexed.linksArcTable[d.linkUniqId].length;
        // 如果没有重叠关系，绘制直线
        if (relationshipsDimension == 1) {
            var beziers = getBezierWithOneLinks(d, zValue);
            return beziers.pathMiddle;
        } // 如果有2份重叠关系，绘制一对弧线
        else if (relationshipsDimension == 2) {
            var beziers = getBezierWithTwoLinks(d, zValue);
            // console.log('dataSelectedIndexed.linksArcTable[d.linkUniqId]: ')
            // console.log(dataSelectedIndexed.linksArcTable[d.linkUniqId])
            // 检测是否两家公司存在交叉持股现象@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2
            var linkOne = dataSelectedIndexed.links.filter(function(l) {
                return l.id == dataSelectedIndexed.linksArcTable[d.linkUniqId][0]
            })
 
            var linkTwo = dataSelectedIndexed.links.filter(function(l) {
                return l.id == dataSelectedIndexed.linksArcTable[d.linkUniqId][1]
            })
            // console.log(linkOne[0].target.id)
            // console.log(linkTwo[0].source.id)
            if (linkOne[0].target.id == linkTwo[0].source.id) {
                console.log('hybird invest discovered')
                return beziers.pathForward;
            }
            //如果存在交叉持股，返回一种曲线模式即可@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
            // 绘制第一条弧线
            if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 0) {
                return beziers.pathForward;
            } // 绘制第二条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 1){
                return beziers.pathBackward;
            }
        }// 如果有3份重叠关系
        else if (relationshipsDimension == 3) {
            var beziers = getBezierWithThreeLinks(d, zValue);
            // 绘制第一条弧线
            if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 0) {
                return beziers.pathForward;
            }
            // 绘制第二条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 1){
                return beziers.pathMiddle;
            }
            // 绘制第三条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 2){
                return beziers.pathBackward;
            }
        }// 如果有4份重叠关系
        else if (relationshipsDimension == 4) {
            var beziers = getBezierWithFourLinks(d, zValue);
            // 绘制第一条弧线
            if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 0) {
                return beziers.pathForward;
            }
            // 绘制第二条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 1){
                return beziers.pathForwardInner;
            }
            // 绘制第三条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 2){
                return beziers.pathBackwardInner;
            }
            // 绘制第四条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 3){
                return beziers.pathBackward;
            }
        }// 如果有5份重叠关系
        else if(relationshipsDimension == 5){
            var beziers = getBezierWithFiveLinks(d, zValue);
            // 绘制第一条弧线
            if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 0) {
                return beziers.pathForward;
            }
            // 绘制第二条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 1){
                return beziers.pathForwardInner;
            }
            // 绘制第三条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 2){
                return beziers.pathMiddle;
            }
            // 绘制第四条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 3){
                return beziers.pathBackwardInner;
            }
            // 绘制第五条弧线
            else if (dataSelectedIndexed.linksArcTable[d.linkUniqId].indexOf(d.id) == 4){
                return beziers.pathBackward;
            }
        }
    }
    // end  弧线连线#############################

    // start mouse tooltip ##############
    var nodeNameG = svg.append('g')
    	.attr('id', 'nodeCompName')
    	.append('text')
    	.attr('x', 100)
    	.attr('y', 25)
    	.style({"font-size":'12px', 'fill': 'orange'})
    	.text('')

    // 显示公司全称
    function showNodeName(d){
    	// console.log("showNodeCompName");
    	var nodeCompName = '';
    	if (d.labels[0] == 'Company') {
		    nodeCompName = d.properties['公司名称'];
		}
		else if (d.labels[0] == 'Person') {
		    nodeCompName = d.properties['姓名'];
		}
		else if (d.labels[0] == 'Unknown') {
		    nodeCompName = d.properties['名称'];
		}else{
			nodeCompName = '';
		}
		
		nodeNameG.text(nodeCompName);

    }
    // 取消显示公司全称
    function hideNodeName(){
    	// console.log("hideNodeCompName");
    }

    function moveNodeOper(top, left){
    	d3.select('#nodeOper')
    		.style('top', top+'px')
    		.style('left', left+'px');
    }

    //出现提示框
    function showMouseTooltip(d) {
        mouseTooltip.style("opacity", 1)
            .style('z-index', 10);

        mouseTooltip.html(generateMouseTooltipContent(d))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    }

    // 隐藏提示框
    function hideMouseTooltip() {
        mouseTooltip.style("opacity", 0);
    }

    //start 生成提示框内容
    function generateMouseTooltipContent (d) {
        var tooltipContent = [];
        var keyArray = [];
        var htmlContent = '';

        if (d.labels[0] == 'Company') {
            htmlContent += "<div>" + d.properties['公司名称'] + "</div>";

            // if (d.properties['注册资本']) {
            //     htmlContent += "<div>注册资本：" + d.properties['注册资本'] + "</div>";
            // }

            if (d.properties.hasOwnProperty('风险指数')) {
                // htmlContent += "<div>风险指数：" + d.properties['风险指数'] + "</div>";
                htmlContent += "<div>风险评级：" + d.properties['风险评级'] + "</div>";
            }
        }
        else if (d.labels[0] == 'Person') {
            htmlContent += "<div>" + d.properties['姓名'] + "</div>";
        }
        else if (d.labels[0] == 'Unknown') {
            htmlContent += "<div>" + d.properties['名称'] + "</div>";
        }

        return htmlContent;
    }
    //end 生成提示框内容
    // end mouse tooltip ##############

    // start 鼠标经过高亮节点################
    function mouseoverNodeHight(d) {
        // console.log(d);
        // console.log(this);
        // var circle = d3.select(this);
        // circle.transition(500)
        //     .style({"stroke-width":'4px', 'stroke': 'orange', 'stroke-opacity': '0.5'});
        // console.log(circle);

        //高亮周边一度节点标签
        linksArray.filter(function(link) {
            if ( link.source === d || link.target === d) {
                if (link.source === d) {

                } else if (link.target === d) {

                }
            }
        });
    }
    // end 鼠标经过高亮节点################

    // start 取消鼠标经过高亮节点 ##########
    function mouseoutNodeUnhight(d) {
        var circle = d3.select(this);
        circle.transition(500)
            .style({"stroke-width":'2px', 'stroke': '#ccc', 'stroke-opacity': '1'});

        //高亮周边一度节点标签
        linksArray.filter(function(link) {
            if ( link.source === d || link.target === d) {
                if (link.source === d) {

                } else if (link.target === d) {

                }
            }
        });
    }
    // end 取消鼠标经过高亮节点 ##########
}
//end 渲染力图 =================================

// start 绘制箭头 ==============================
function drawArror(svg, color, arrowConfig, arrowId, arrowXoffset) {
    var arrow_path = arrow_path || "M0,0 L6,3 L0,6 L0,0"; //"M0,0 L4,2 L0,4 L0,0"
    var xOffset = arrowXoffset || 32;

    var svg = svg || d3.select('svg');

    var defsG = svg.append('g');
    var defs = defsG.append("defs");
    var arrowMarker = defs.append("marker")
        .attr(arrowConfig)
        .attr('id', 'arrow'+arrowId)
        .attr('refX',xOffset);

    arrowMarker.append("path")
        // .attr('class', 'arrowColor')
        .attr("d",arrow_path)
        .style("fill", color);
}
// end 绘制箭头 ==============================

// start 旋转关系连线文本 =====================
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
        } else {
            return 'rotate(' + (rotateAngle) + " " + rotateCenterX + ',' + rotateCenterY + ')';
        }
    }
}
// end 旋转关系连线文本 ======================

//start 有5重叠关系，绘制4条贝塞尔曲线===========
function getBezierWithFiveLinks(d, zValue) {
    // var angleStep = 40; //out curve angle
    // var angleStepInner = 25; //inner cureve angle

    var x1 = zValue*d.source.x, y1 = zValue*d.source.y;
    var x2 = zValue*d.target.x, y2 = zValue*d.target.y;

    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    var linkDistance = Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance, 2));
    // var squareLinkDistance = linkDistance*Math.sin(45/180*Math.PI);

    // 为了弧线变长的时候，两条曲线之间距离不至于太大，需要将角度变小 @@@@@@@@@@@@@@@@@@@@
    var iniDistance = 100; //force预设长度100
    var angleStep = iniDistance / linkDistance * 80;
    var angleStepInner = iniDistance / linkDistance * 40;

    var squareLinkDistance = linkDistance/2/Math.cos(angleStep/180*Math.PI);
    var squareLinkDistanceInner = linkDistance/2/Math.cos(angleStepInner/180*Math.PI);

    var angle = Math.atan(yDistance/xDistance)/Math.PI*180;
    // console.log('angle:' + angle);
    // 位于第三或第四象限，则加180度
    if ((x1>x2 && y1<y2) || (x1>x2 && y1>y2)) {
        angle += 180;
    }
    //forward
    var angleForward = angle + angleStep;
    var xMoveForward = squareLinkDistance * Math.cos(angleForward/180*Math.PI);
    var yMoveForward = squareLinkDistance * Math.sin(angleForward/180*Math.PI);
    var xForwardPosition = x1 + xMoveForward;
    var yForwardPosition = y1 + yMoveForward;
    //backward
    var angleBackward = angle - angleStep;
    var xMoveBackward = squareLinkDistance * Math.cos(angleBackward/180*Math.PI);
    var yMoveBackward = squareLinkDistance * Math.sin(angleBackward/180*Math.PI);
    var xBackwardPosition = x1 + xMoveBackward;
    var yBackwardPosition = y1 + yMoveBackward;

    // console.log('forward: '+ xForwardPosition + ',' + yForwardPosition);
    // console.log('backward: '+ xBackwardPosition + ',' + yBackwardPosition);

    //inner forward
    var angleForwardInner = angle + angleStepInner;
    var xMoveForwardInner = squareLinkDistanceInner * Math.cos(angleForwardInner/180*Math.PI);
    var yMoveForwardInner = squareLinkDistanceInner * Math.sin(angleForwardInner/180*Math.PI);
    var xForwardPositionInner = x1 + xMoveForwardInner;
    var yForwardPositionInner = y1 + yMoveForwardInner;
    //inner backward
    var angleBackwardInner = angle - angleStepInner;
    var xMoveBackwardInner = squareLinkDistanceInner * Math.cos(angleBackwardInner/180*Math.PI);
    var yMoveBackwardInner = squareLinkDistanceInner * Math.sin(angleBackwardInner/180*Math.PI);
    var xBackwardPositionInner = x1 + xMoveBackwardInner;
    var yBackwardPositionInner = y1 + yMoveBackwardInner;

    //out curve
    var pathForward = "M" + x1 + "," + y1 + " Q" + xForwardPosition + "," + yForwardPosition + " " + x2 + "," + y2;
    var pathBackward = "M" + x1 + "," + y1 + " Q" + xBackwardPosition + "," + yBackwardPosition + " " + x2 + "," + y2;

    //inner curve
    var pathForwardInner = "M" + x1 + "," + y1 + " Q" + xForwardPositionInner + "," + yForwardPositionInner + " " + x2 + "," + y2;
    var pathBackwardInner = "M" + x1 + "," + y1 + " Q" + xBackwardPositionInner + "," + yBackwardPositionInner + " " + x2 + "," + y2;
    var pathMiddle = "M" + x1 + "," + y1 + " T" + x2 + "," + y2;

    var beziers = {};
    beziers.pathForward = pathForward;
    beziers.pathBackward = pathBackward;
    beziers.pathForwardInner = pathForwardInner;
    beziers.pathBackwardInner = pathBackwardInner;
    beziers.pathMiddle = pathMiddle;

    return beziers;
}
//end 有5重叠关系，绘制4条贝塞尔曲线===========

//start 有4重叠关系，绘制4条贝塞尔曲线===========
function getBezierWithFourLinks(d, zValue) {
    // var angleStep = 40; //out curve angle
    // var angleStepInner = 25; //inner cureve angle

    var x1 = zValue*d.source.x, y1 = zValue*d.source.y;
    var x2 = zValue*d.target.x, y2 = zValue*d.target.y;

    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    var linkDistance = Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance, 2));
    // var squareLinkDistance = linkDistance*Math.sin(45/180*Math.PI);

    // 为了弧线变长的时候，两条曲线之间距离不至于太大，需要将角度变小 @@@@@@@@@@@@@@@@@@@@
    var iniDistance = 100; //force预设长度100
    var angleStep = iniDistance / linkDistance * 60;
    var angleStepInner = iniDistance / linkDistance * 25;

    var squareLinkDistance = linkDistance/2/Math.cos(angleStep/180*Math.PI);
    var squareLinkDistanceInner = linkDistance/2/Math.cos(angleStepInner/180*Math.PI);

    var angle = Math.atan(yDistance/xDistance)/Math.PI*180;
    // console.log('angle:' + angle);
    // 位于第三或第四象限，则加180度
    if ((x1>x2 && y1<y2) || (x1>x2 && y1>y2)) {
        angle += 180;
    }
    //forward
    var angleForward = angle + angleStep;
    var xMoveForward = squareLinkDistance * Math.cos(angleForward/180*Math.PI);
    var yMoveForward = squareLinkDistance * Math.sin(angleForward/180*Math.PI);
    var xForwardPosition = x1 + xMoveForward;
    var yForwardPosition = y1 + yMoveForward;
    //backward
    var angleBackward = angle - angleStep;
    var xMoveBackward = squareLinkDistance * Math.cos(angleBackward/180*Math.PI);
    var yMoveBackward = squareLinkDistance * Math.sin(angleBackward/180*Math.PI);
    var xBackwardPosition = x1 + xMoveBackward;
    var yBackwardPosition = y1 + yMoveBackward;

    // console.log('forward: '+ xForwardPosition + ',' + yForwardPosition);
    // console.log('backward: '+ xBackwardPosition + ',' + yBackwardPosition);

    //inner forward
    var angleForwardInner = angle + angleStepInner;
    var xMoveForwardInner = squareLinkDistanceInner * Math.cos(angleForwardInner/180*Math.PI);
    var yMoveForwardInner = squareLinkDistanceInner * Math.sin(angleForwardInner/180*Math.PI);
    var xForwardPositionInner = x1 + xMoveForwardInner;
    var yForwardPositionInner = y1 + yMoveForwardInner;
    //inner backward
    var angleBackwardInner = angle - angleStepInner;
    var xMoveBackwardInner = squareLinkDistanceInner * Math.cos(angleBackwardInner/180*Math.PI);
    var yMoveBackwardInner = squareLinkDistanceInner * Math.sin(angleBackwardInner/180*Math.PI);
    var xBackwardPositionInner = x1 + xMoveBackwardInner;
    var yBackwardPositionInner = y1 + yMoveBackwardInner;

    //out curve
    var pathForward = "M" + x1 + "," + y1 + " Q" + xForwardPosition + "," + yForwardPosition + " " + x2 + "," + y2;
    var pathBackward = "M" + x1 + "," + y1 + " Q" + xBackwardPosition + "," + yBackwardPosition + " " + x2 + "," + y2;

    //inner curve
    var pathForwardInner = "M" + x1 + "," + y1 + " Q" + xForwardPositionInner + "," + yForwardPositionInner + " " + x2 + "," + y2;
    var pathBackwardInner = "M" + x1 + "," + y1 + " Q" + xBackwardPositionInner + "," + yBackwardPositionInner + " " + x2 + "," + y2;

    var beziers = {};
    beziers.pathForward = pathForward;
    beziers.pathBackward = pathBackward;
    beziers.pathForwardInner = pathForwardInner;
    beziers.pathBackwardInner = pathBackwardInner;

    return beziers;
}
//end 有4重叠关系，绘制4条贝塞尔曲线===========

//start 有3重叠关系，绘制2条贝塞尔曲线和一条直线===========
function getBezierWithThreeLinks(d, zValue) {
    // var angleStep = 30;
    // var angleStep = 15;

    var x1 = zValue*d.source.x, y1 = zValue*d.source.y;
    var x2 = zValue*d.target.x, y2 = zValue*d.target.y;

    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    var linkDistance = Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance, 2));

    // 为了弧线变长的时候，两条曲线之间距离不至于太大，需要将角度变小 @@@@@@@@@@@@@@@@@@@@
    var iniDistance = 100; //force预设长度100
    var angleStep = iniDistance / linkDistance * 30;

    var squareLinkDistance = linkDistance/2/Math.cos(angleStep/180*Math.PI);

    var angle = Math.atan(yDistance/xDistance)/Math.PI*180;
    // console.log('angle:' + angle);
    // 位于第三或第四象限，则加180度
    if ((x1>x2 && y1<y2) || (x1>x2 && y1>y2)) {
        angle += 180;
    }
    //forward
    var angleForward = angle + angleStep;
    var xMoveForward = squareLinkDistance * Math.cos(angleForward/180*Math.PI);
    var yMoveForward = squareLinkDistance * Math.sin(angleForward/180*Math.PI);
    var xForwardPosition = x1 + xMoveForward;
    var yForwardPosition = y1 + yMoveForward;
    //backward
    var angleBackward = angle - angleStep;
    var xMoveBackward = squareLinkDistance * Math.cos(angleBackward/180*Math.PI);
    var yMoveBackward = squareLinkDistance * Math.sin(angleBackward/180*Math.PI);
    var xBackwardPosition = x1 + xMoveBackward;
    var yBackwardPosition = y1 + yMoveBackward;

    // console.log('forward: '+ xForwardPosition + ',' + yForwardPosition);
    // console.log('backward: '+ xBackwardPosition + ',' + yBackwardPosition);

    var pathForward = "M" + x1 + "," + y1 + " Q" + xForwardPosition + "," + yForwardPosition + " " + x2 + "," + y2;
    var pathBackward = "M" + x1 + "," + y1 + " Q" + xBackwardPosition + "," + yBackwardPosition + " " + x2 + "," + y2;
    var pathMiddle = "M" + x1 + "," + y1 + " T" + x2 + "," + y2;

    var beziers = {};
    beziers.pathForward = pathForward;
    beziers.pathBackward = pathBackward;
    beziers.pathMiddle = pathMiddle;
    return beziers;
}
//end 有3重叠关系，绘制2条贝塞尔曲线和一条直线===========

//start 有2重叠关系，绘制2条贝塞尔曲线===========
function getBezierWithTwoLinks(d, zValue) {
    // var angleStep = 30;

    var x1 = zValue*d.source.x, y1 = zValue*d.source.y;
    var x2 = zValue*d.target.x, y2 = zValue*d.target.y;

    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    var linkDistance = Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance, 2));
    // var squareLinkDistance = linkDistance*Math.sin(45/180*Math.PI);

    // 为了弧线变长的时候，两条曲线之间距离不至于太大，需要将角度变小 @@@@@@@@@@@@@@@@@@@@
    var iniDistance = 100; //force预设长度100
    var angleStep = iniDistance / linkDistance * 30;

    var squareLinkDistance = linkDistance/2/Math.cos(angleStep/180*Math.PI);

    var angle = Math.atan(yDistance/xDistance)/Math.PI*180;
    // console.log('angle:' + angle);
    // 位于第三或第四象限，则加180度
    if ((x1>x2 && y1<y2) || (x1>x2 && y1>y2)) {
        angle += 180;
    }
    //forward
    var angleForward = angle + angleStep;
    var xMoveForward = squareLinkDistance * Math.cos(angleForward/180*Math.PI);
    var yMoveForward = squareLinkDistance * Math.sin(angleForward/180*Math.PI);
    var xForwardPosition = x1 + xMoveForward;
    var yForwardPosition = y1 + yMoveForward;
    //backward
    var angleBackward = angle - angleStep;
    var xMoveBackward = squareLinkDistance * Math.cos(angleBackward/180*Math.PI);
    var yMoveBackward = squareLinkDistance * Math.sin(angleBackward/180*Math.PI);
    var xBackwardPosition = x1 + xMoveBackward;
    var yBackwardPosition = y1 + yMoveBackward;

    // console.log('forward: '+ xForwardPosition + ',' + yForwardPosition);
    // console.log('backward: '+ xBackwardPosition + ',' + yBackwardPosition);

    var pathForward = "M" + x1 + "," + y1 + " Q" + xForwardPosition + "," + yForwardPosition + " " + x2 + "," + y2;
    var pathBackward = "M" + x1 + "," + y1 + " Q" + xBackwardPosition + "," + yBackwardPosition + " " + x2 + "," + y2;
    // var pathMiddle = "M" + x1 + "," + y1 + " T" + x2 + "," + y2;

    var beziers = {};
    beziers.pathForward = pathForward;
    beziers.pathBackward = pathBackward;
    // beziers.pathMiddle = pathMiddle;
    return beziers;
}
//end 有2重叠关系，绘制2条贝塞尔曲线===========

//start 没有重叠关系，绘制一条直线===========
function getBezierWithOneLinks(d, zValue) {
    var x1 = zValue*d.source.x, y1 = zValue*d.source.y;
    var x2 = zValue*d.target.x, y2 = zValue*d.target.y;
    var pathMiddle = "M" + x1 + "," + y1 + " T" + x2 + "," + y2;

    var beziers = {};
    beziers.pathMiddle = pathMiddle;

    return beziers;
}
//end 没有重叠关系，绘制一条直线===========

//start 画图例 =======================
function generateLegency(svg) {
    var legencyG = svg.append('g')
        .attr('id', 'legencyG')
        .attr('transform', 'translate(10, 20)');

    var circleCompanyLegendConfig = { r: 6, cx: 0, cy: 0, class:'circleCompanyLegend', styleClass: {'stroke': 'none', 'fill': nodesColor.company}};
    drawCircle(legencyG, circleCompanyLegendConfig);
    var textCompanyLegendConfig = {x: 10, y: 3, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '公司'};
    drawText(legencyG, textCompanyLegendConfig);

    var circlePersonLegendConfig = { r: 6, cx: 0, cy: 20, class:'circlePersonLegend', styleClass:  {'stroke': 'none', 'fill': nodesColor.people}};
    drawCircle(legencyG, circlePersonLegendConfig);
    var textPersonLegendConfig = {x: 10, y: 23, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '自然人'};
    drawText(legencyG, textPersonLegendConfig);

    var circleUnknownLegendConfig = { r: 6, cx: 0, cy: 40, class:'circleUnknownLegend', styleClass:  {'stroke': 'none', 'fill': nodesColor.other}};
    drawCircle(legencyG, circleUnknownLegendConfig);
    var textUnknownLegendConfig = {x: 10, y: 43, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '其他类型'};
    drawText(legencyG, textUnknownLegendConfig);

    var circleHighRiskLegendConfig = { r: 5, cx: 0, cy: 60, class:'circleHighRiskLegend', styleClass: {'stroke': nodesColor.highRisk, 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleHighRiskLegendConfig);
    var textHighRiskLegendConfig = {x: 10, y: 63, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：高'};
    drawText(legencyG, textHighRiskLegendConfig);

    var circleNormalRiskLegendConfig = { r: 5, cx: 0, cy: 80, class:'circleNormalRiskLegend', styleClass: {'stroke': nodesColor.middleRisk, 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleNormalRiskLegendConfig);
    var textNormalRiskLegendConfig = {x: 10, y: 83, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：中'};
    drawText(legencyG, textNormalRiskLegendConfig);

    var circleLowRiskLegendConfig = { r: 5, cx: 0, cy: 100, class:'circleLowRiskLegend', styleClass: {'stroke': nodesColor.lowRisk, 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleLowRiskLegendConfig);
    var textLowRiskLegendConfig = {x: 10, y: 103, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：低'};
    drawText(legencyG, textLowRiskLegendConfig);

    var circleSafeLegendConfig = { r: 5, cx: 0, cy: 120, class:'circleSafeLegend', styleClass: {'stroke': nodesColor.safe, 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleSafeLegendConfig);
    var textSafeLegendConfig = {x: 10, y: 123, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：安全'};
    drawText(legencyG, textSafeLegendConfig);

    var lineInvestLegendConfig = {x1: -4, y1: 140, x2: 30, y2: 140, class:'lineInvestLegend', styleClass: {'stroke': nodesColor.invest, 'stroke-width': '2px', 'fill': 'none'}};
    drawLine(legencyG, lineInvestLegendConfig);
    var textInvestLegendConfig = {x: 40, y: 143, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '投资关系'};
    drawText(legencyG, textInvestLegendConfig);

    var lineOwnerLegendConfig = {x1: -4, y1: 160, x2: 30, y2: 160, class:'lineOwnerLegend', styleClass: {'stroke': nodesColor.legalRepre, 'stroke-width': '2px', 'fill': 'none'}};
    drawLine(legencyG, lineOwnerLegendConfig);
    var textOwnerLegendConfig = {x: 40, y: 163, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '法人关系'};
    drawText(legencyG, textOwnerLegendConfig);

    var lineJobLegendConfig = {x1: -4, y1: 180, x2: 30, y2: 180, class:'lineJobLegend', styleClass: {'stroke': nodesColor.serve, 'stroke-width': '2px', 'fill': 'none'}};
    drawLine(legencyG, lineJobLegendConfig);
    var textJobLegendConfig = {x: 40, y: 183, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '任职关系'};
    drawText(legencyG, textJobLegendConfig);

    return legencyG;
}
//end 画图例 =======================

//start 画图例投资关系圆形树图 =======================
function generateLegencyForCluster(svg) {
    var legencyG = svg.append('g')
        .attr('id', 'legencyG')
        .attr('transform', 'translate(10, 10)');

    var circleCompanyLegendConfig = { r: 6, cx: 0, cy: 0, styleClass: {'stroke': 'none', 'fill': '#68BDF6'}};
    drawCircle(legencyG, circleCompanyLegendConfig);
    var textCompanyLegendConfig = {x: 10, y: 3, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '公司'};
    drawText(legencyG, textCompanyLegendConfig);

    var circlePersonLegendConfig = { r: 6, cx: 0, cy: 20, styleClass:  {'stroke': 'none', 'fill': '#6DCE9E'}};
    drawCircle(legencyG, circlePersonLegendConfig);
    var textPersonLegendConfig = {x: 10, y: 23, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '自然人'};
    drawText(legencyG, textPersonLegendConfig);

    var circleUnknownLegendConfig = { r: 6, cx: 0, cy: 40, styleClass:  {'stroke': 'none', 'fill': '#ccc'}};
    drawCircle(legencyG, circleUnknownLegendConfig);
    var textUnknownLegendConfig = {x: 10, y: 43, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '其他类型'};
    drawText(legencyG, textUnknownLegendConfig);

    var circleHighRiskLegendConfig = { r: 5, cx: 0, cy: 60, styleClass: {'stroke': 'red', 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleHighRiskLegendConfig);
    var textHighRiskLegendConfig = {x: 10, y: 63, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：高'};
    drawText(legencyG, textHighRiskLegendConfig);

    var circleNormalRiskLegendConfig = { r: 5, cx: 0, cy: 80, styleClass: {'stroke': 'orange', 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleNormalRiskLegendConfig);
    var textNormalRiskLegendConfig = {x: 10, y: 83, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：中'};
    drawText(legencyG, textNormalRiskLegendConfig);

    var circleLowRiskLegendConfig = { r: 5, cx: 0, cy: 100, styleClass: {'stroke': '#d6dd3a', 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleLowRiskLegendConfig);
    var textLowRiskLegendConfig = {x: 10, y: 103, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：低'};
    drawText(legencyG, textLowRiskLegendConfig);

    var circleSafeLegendConfig = { r: 5, cx: 0, cy: 120, styleClass: {'stroke': 'green', 'stroke-width': '2px', 'fill': 'none'}};
    drawCircle(legencyG, circleSafeLegendConfig);
    var textSafeLegendConfig = {x: 10, y: 123, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '风险评级：安全'};
    drawText(legencyG, textSafeLegendConfig);

    var lineInvestLegendConfig = {x1: -4, y1: 140, x2: 30, y2: 140, styleClass: {'stroke': '#cd7bdd', 'stroke-width': '2px', 'fill': 'none'}};
    drawLine(legencyG, lineInvestLegendConfig);
    var textInvestLegendConfig = {x: 40, y: 143, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '对外投资'};
    drawText(legencyG, textInvestLegendConfig);

    var lineOwnerLegendConfig = {x1: -4, y1: 160, x2: 30, y2: 160, styleClass: {'stroke': '#019fde', 'stroke-width': '2px', 'fill': 'none'}};
    drawLine(legencyG, lineOwnerLegendConfig);
    var textOwnerLegendConfig = {x: 40, y: 163, styleClass: {'font-size': '10px', 'font-family': 'Microsoft Yahei', 'fill': '#666'}, content: '股东关系'};
    drawText(legencyG, textOwnerLegendConfig);

    return legencyG;
}
//end 画图例投资关系圆形树图 =======================

//start 画圆 =======================
function drawCircle(container, circleConfig) {
    var g = container.append('g');

    var circleConfig = circleConfig || { r: 100, cx: 0, cy: 0, styleClass: ''};

    var circle = g.append('circle')
        .attr('r', circleConfig.r)
        .attr('cx', circleConfig.cx)
        .attr('cy', circleConfig.cy);

    if (circleConfig.styleClass) {
        circle.style(circleConfig.styleClass);
    }

    if(circleConfig.class){
        circle.attr('class', circleConfig.class);
    }

    return circle;
}
//end 画圆 =======================

//start 画文字 =======================
function drawText(container, textConfig) {
    var g = container.append('g');

    var textConfig = textConfig || {x: 0, y: 0, styleClass: '', content: 'text place holder'};

    var text = g.append('text')
        .attr('x', textConfig.x)
        .attr('y', textConfig.y)
        .text(textConfig.content);

    if (textConfig.styleClass) {
        text.style(textConfig.styleClass);
    }

    return text;
}
//end 画文字 =======================

//start 画线 =======================
function drawLine(container, lineConfig) {
    var g = container.append('g');

    var lineConfig = lineConfig || {x1: 0, y1: 0, x2: 100, y2: 0, styleClass: ''};

    var line = g.append('line')
        .attr('x1', lineConfig.x1)
        .attr('y1', lineConfig.y1)
        .attr('x2', lineConfig.x2)
        .attr('y2', lineConfig.y2);

    if (lineConfig.styleClass) {
        line.style(lineConfig.styleClass);
    }

    if(lineConfig.class){
        line.attr('class', lineConfig.class);
    }

    return line;
}
//end 画线 =======================

/*== start 点击节点获取节点信息 ===========================================================*/
// 按对象属性排序比较函数
function compare(propertyName) { 
    return function (object1, object2) { 
        var value1 = object1[propertyName]; 
        var value2 = object2[propertyName]; 
        if (value2 < value1) { 
            return -1; 
        }else if (value2 > value1) { 
            return 1; 
        }else { 
            return 0; 
        } 
    } 
} 
// 挂载模型上的包装函数
function getNodeInfo(d,that) {
    //个人节点不抽取信息
    if (d.labels[0] == 'Person' || d.labels[0] == 'Unknown') { //新增未知节点类型判断
        return;
    } else {
        // 异步载入工商信息
        getNodeGSData(d, d.properties["公司名称"],that);
    }
}

function getNodeLegalInfo(d,that){
	//个人节点不抽取信息
    if (d.labels[0] == 'Person' || d.labels[0] == 'Unknown') { //新增未知节点类型判断
        return;
    } else {
        // 异步载入司法信息
        getNodeLegalData(d.properties["公司名称"], that);
        getNodeCourtAnnounData(d.properties["公司名称"], that);
        getNodeExecutedData(d.properties["公司名称"], that);
        getNodeDishonestExecutedData(d.properties["公司名称"], that);
    }
}

// end 鼠标点击获取公司节点信息 ===================

//start 点击获取公司工商信息 =====================
function getNodeGSData(node, queryCompanyName,that){
	// console.log("getNodeGSData");
	var nodeInfoOnModel = {};
	nodeInfoOnModel.basicInfo = {};
    // 初始化，避免空节点被前一个节点填补
    nodeInfoOnModel.basicInfo["公司名称"] = '';
    nodeInfoOnModel.basicInfo["成立时间"] = '';
    nodeInfoOnModel.basicInfo["登记状态"] = '';
    nodeInfoOnModel.basicInfo["注册资本"] = '';
    nodeInfoOnModel.basicInfo["注册号"] = '';
    nodeInfoOnModel.basicInfo["风险评级"] = '';

    if (node.properties["公司名称"]) {
        nodeInfoOnModel.basicInfo["公司名称"] = node.properties["公司名称"];
    }

    if (node.properties["风险评级"]) {
        nodeInfoOnModel.basicInfo["风险评级"] = node.properties["风险评级"];
    }

    var queryCompany = queryCompanyName;
    var businessInfoColumns = 'establishmentdate,registrationstatus,registeredcapital,registrationno,entstatus,';
    var shareholderColumns = 'shareholder_type,shareholder_name,shareholder_certificationtype,subscripted_capital,actualpaid_capital,';
    var changeColumns = 'changedannouncement_date,changedannouncement_events,changedannouncement_before,changedannouncement_after,';
    var keyPersonColumns = 'keyperson_name,keyperson_position';
    var queryColumns = businessInfoColumns + shareholderColumns + changeColumns + keyPersonColumns;
    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";
     $.post("../Access/gs/companyinfo",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany,
            columns: queryColumns
        },
        function(data,status){

            // 将节点信息挂载到模型上
            var RegisteredInfo = {};
            if(data.data['Registered_Info']){
                RegisteredInfo = data.data['Registered_Info'][0];
            }
            nodeInfoOnModel.basicInfo["成立时间"] = RegisteredInfo['Registered_Info:establishmentdate'] || '';
            nodeInfoOnModel.basicInfo["登记状态"] = RegisteredInfo['Registered_Info:registrationstatus'] || RegisteredInfo['Registered_Info:entstatus'] ||'';
            var registeredcapital = RegisteredInfo['Registered_Info:registeredcapital'] || '';
            nodeInfoOnModel.basicInfo["注册资本"] = registeredcapital != ''? registeredcapital+'万元': registeredcapital;
            nodeInfoOnModel.basicInfo["注册号"] = RegisteredInfo['Registered_Info:registrationno'] || '';

            // 将节点股东信息挂载到模型上
            var shareholderInfo = data.data['Shareholder_Info'] || [];
            nodeInfoOnModel.shareholder = shareholderInfo;

            // 将节点变更信息挂载到模型上
            var changedInfo = data.data['Changed_Announcement'] || [];
            nodeInfoOnModel.changed = changedInfo.sort(compare("Changed_Announcement:changedannouncement_date"));

            // 将节点主要成员信息挂载到模型上
            var keyPersonInfo = data.data['KeyPerson_Info'] || [];
            nodeInfoOnModel.keyPerson = keyPersonInfo;
            //== 更新组件状态
        	that.setState({
				basicInfo: nodeInfoOnModel.basicInfo,
				shareholder: nodeInfoOnModel.shareholder,
				changed: nodeInfoOnModel.changed,
				keyPerson: nodeInfoOnModel.keyPerson
			});
        },
        // 返回数据类型必须设定为json
        dataType
    );
}
//end 点击获取公司工商信息 =======================

//start 点击获取公司司法信息 =====================
function getNodeLegalData(queryCompanyName,that) {
    // var queryCompany = "BC教育咨询（北京）有限公司";
    var queryCompany = queryCompanyName;
    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";
     $.post("../Access/sf/sfws",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany
        },
        function(data,status){
            var legalInfo = data.data['案件信息'].sort(compare("判决时间"));
            console.log('legalInfo');
            console.log(legalInfo);
            //== 更新组件状态
        	that.setState({
				legalInfo: legalInfo
			});
        },
        // 返回数据类型必须设定为json
        dataType
    );
}
//end 点击获取公司司法信息 =====================

//== start 点击获取公司司法开庭公告信息 ================
function getNodeCourtAnnounData(queryCompanyName,that) {
    var queryCompany = queryCompanyName;
    // console.log(queryCompany);
    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";
     $.post("../Access/sf/sfOther",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany,
            columns:'bltin:pub_date,bltin:crt_name,bltin:blt_content,bltin:blt_type,bltin:rld_prn'
        },
        function(data,status){
            // console.log("data:");
            // console.log(data);
            var courtAnnounInfo = data.data.sort(compare("bltin:pub_date"));

            //== 更新组件状态
        	that.setState({
				courtAnnounInfo: courtAnnounInfo
			});
        },
        // 返回数据类型必须设定为json
        dataType
    );
}
//== end 点击获取公司司法开庭公告信息 ==================

//== start 点击获取公司司法被执行信息 ================
function getNodeExecutedData(queryCompanyName,that) {
    var queryCompany = queryCompanyName;
    // console.log(queryCompany);
    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";
     $.post("../Access/sf/sfOther",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany,
            columns:'beizhixing:mc,beizhixing:sj,beizhixing:zxbd,beizhixing:ah,beizhixing:dm,beizhixing:zxfy'
        },
        function(data,status){
            // console.log("data:");
            // console.log(data);
            var executed = data.data.sort(compare("beizhixing:sj"));

            //== 更新组件状态
        	that.setState({
				executed: executed
			});
        },
        // 返回数据类型必须设定为json
        dataType
    );
}
//== end 点击获取公司司法被执行信息 ==================

//== start 点击获取公司司法失信被执行信息 ================
function getNodeDishonestExecutedData(queryCompanyName,that) {
    var queryCompany = queryCompanyName;
    // console.log(queryCompany);
    // 返回数据类型必须设定为json，默认是string字符串
    var dataType = "json";
     $.post("../Access/sf/sfOther",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany,
            columns:'shixin:lasj,shixin:lxqk,shixin:xq_mc,shixin:xqck,shixin:sxjtqk,shixin:fbsj,shixin:mc'
        },
        function(data,status){
            // console.log("data:");
            // console.log(data);
            var dishonestExecuted = data.data.sort(compare("shixin:fbsj"));

            //== 更新组件状态
        	that.setState({
				dishonestExecuted: dishonestExecuted
			});
        },
        // 返回数据类型必须设定为json
        dataType
    );
}
//== end 点击获取公司司法失信被执行信息 ==================

/*== end 点击节点获取节点信息 =============================================================*/

//start 节点信息处理，注册资本、成立时间 ==============================================
function getNodeRiskInfo(dataStore) {
    // start 风险信息收集 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    // 原风险预警面板数据收集
    var dataIndexed = {};
    dataIndexed.riskInfo = {}; //风险企业信息
    dataIndexed.riskInfo.highRisk = [];
    dataIndexed.riskInfo.normalRisk = [];
    dataIndexed.riskInfo.lowRisk = [];
    // 现风险分析面板数据收集
    dataIndexed.riskInfo.analyse = {}; //分析总挂载点
    dataIndexed.riskInfo.analyse.associateCompanyNumber = 0; //关联企业总数初始化0
    dataIndexed.riskInfo.analyse.averageCapital = 0; //平均注册资本初始化0
    dataIndexed.riskInfo.analyse.capitalLessOneMillion = 0; //注册资本100万及以下
    dataIndexed.riskInfo.analyse.capitalOneToFiveMillion = 0; //注册资本100-500万
    dataIndexed.riskInfo.analyse.capitalFiveToTenMillion = 0; //注册资本500-1000万
    dataIndexed.riskInfo.analyse.capitalTenToHunderdMillion = 0; //注册资本1000-10000万
    dataIndexed.riskInfo.analyse.capitalMoreThanHunderdMillion = 0; //注册资本>10000万
    dataIndexed.riskInfo.analyse.averageYear = 0; //平均成立年限初始化0
    dataIndexed.riskInfo.analyse.underOneYear = 0; //<1年
    dataIndexed.riskInfo.analyse.oneToThreeYear = 0; //1~3年
    dataIndexed.riskInfo.analyse.threeToFiveYear = 0; //3~5年
    dataIndexed.riskInfo.analyse.fiveToEightYear = 0; //5~8年
    dataIndexed.riskInfo.analyse.moreThanEightYear = 0; //>8年
    dataIndexed.riskInfo.analyse.highRisk = 0; //高风险企业数量
    dataIndexed.riskInfo.analyse.normalRisk = 0; //中风险企业数量
    dataIndexed.riskInfo.analyse.lowRisk = 0; //低风险企业数量
    dataIndexed.riskInfo.analyse.safe = 0; //安全企业数量

    // 临时数据存放变量
    var associateCompanyNumber = 0; //公司总量计数器@@@@@@@@@@@@@@@@@@@@@@@@@@@

    var totalCompanyCapital = 0; //所有公司注册资本合计
    var capitalLessOneMillion = 0; //注册资本100万及以下
    var capitalOneToFiveMillion = 0; //注册资本100-500万
    var capitalFiveToTenMillion = 0; //注册资本500-1000万
    var capitalTenToHunderdMillion = 0; //注册资本1000-10000万
    var capitalMoreThanHunderdMillion = 0; //注册资本>10000万

    var averageYear = 0; //平均成立年限初始化0
    var underOneYear = 0; //<1年
    var oneToThreeYear = 0; //1~3年
    var threeToFiveYear = 0; //3~5年
    var fiveToEightYear = 0; //5~8年
    var moreThanEightYear = 0; //>8年

    //获取所有公司名称
    // console.log("getNodeRiskInfo:");
    // console.log(dataStore);
    var compNamesStr = '';
    dataStore.nodes.forEach(function(d){
        if(d.labels[0]=='Company'){
            // 拼接公司名称字符串用于ajax请求
            compNamesStr += d.properties['公司名称'] + ',';
            //公司数量计数
            associateCompanyNumber++; 
            // 风险评级分类
            if (d.properties.hasOwnProperty('风险评级')) {
                // console.log(d);
                if (d.properties['风险评级']=='高风险') {
                    // console.log(d);
                    dataIndexed.riskInfo.highRisk.push(d);
                } else if (d.properties['风险评级']=='中风险') {
                    // console.log(d);
                    dataIndexed.riskInfo.normalRisk.push(d);
                } else if (d.properties['风险评级']=='低风险') {
                    // console.log(d);
                    dataIndexed.riskInfo.lowRisk.push(d);
                }
            }
        }
    })
    // console.log('compNamesStr:');
    // console.log(compNamesStr);
    if(compNamesStr!=''){
        var dataType = "json";
        //== 异步获取界面所有公司基本信息
        // http://localhost:8080/lengjing/relativeRisk
        $.post("../Access/relativeRisk",
            {
                companyNames: compNamesStr,
            },
            function(data,status){
                //== 
                // console.log('ajax data');
                // console.log(data);
                data.forEach(function(d){
                    // 注册资本分类信息
                    if (d.registeredcapital) {
                        var singleCompanyCapital = +d.registeredcapital; //字符串转数字
                        totalCompanyCapital += singleCompanyCapital; //累加注册资本

                        if (singleCompanyCapital < 100) {
                            capitalLessOneMillion++;
                        } else if (singleCompanyCapital >= 100 && singleCompanyCapital < 500) {
                            capitalOneToFiveMillion++;
                        } else if (singleCompanyCapital >= 500 && singleCompanyCapital < 1000) {
                            capitalFiveToTenMillion++;
                        } else if (singleCompanyCapital >= 1000 && singleCompanyCapital < 10000) {
                            capitalTenToHunderdMillion++;
                        } else if (singleCompanyCapital >= 10000) {
                            capitalMoreThanHunderdMillion++;
                        }
                    }
                    // 成立时间分类
                    if (d.establishmentdate) {
                        var establishedYears = getCompanyEstablishedYears(d.establishmentdate);
                        // 计算所有公司成立年数加总
                        averageYear += establishedYears;

                        if (establishedYears > 8) {
                            moreThanEightYear++;
                        } else if (establishedYears <= 8 && establishedYears > 5) {
                            fiveToEightYear++;
                        } else if (establishedYears <= 5 && establishedYears > 3) {
                            threeToFiveYear++;
                        } else if (establishedYears <= 3 && establishedYears > 1) {
                            oneToThreeYear++;
                        } else if (establishedYears <= 1) {
                            underOneYear++;
                        }
                    }
                })
                //公司总量
                dataIndexed.riskInfo.analyse.associateCompanyNumber = associateCompanyNumber + '家';
                //平均注册资本
                dataIndexed.riskInfo.analyse.averageCapital = Math.floor(totalCompanyCapital/associateCompanyNumber) + '家';
                // 注册资本分类计数
                dataIndexed.riskInfo.analyse.capitalLessOneMillion = capitalLessOneMillion + '家'; //注册资本100万及以下
                dataIndexed.riskInfo.analyse.capitalOneToFiveMillion = capitalOneToFiveMillion + '家'; //注册资本100-500万
                dataIndexed.riskInfo.analyse.capitalFiveToTenMillion = capitalFiveToTenMillion + '家'; //注册资本500-1000万
                dataIndexed.riskInfo.analyse.capitalTenToHunderdMillion = capitalTenToHunderdMillion + '家'; //注册资本1000-10000万
                dataIndexed.riskInfo.analyse.capitalMoreThanHunderdMillion = capitalMoreThanHunderdMillion + '家'; //注册资本>10000万

                dataIndexed.riskInfo.analyse.averageYear = (averageYear / associateCompanyNumber).toFixed(1) + '家'; //平均成立年限初始化0
                dataIndexed.riskInfo.analyse.underOneYear = underOneYear + '家'; //<1年
                dataIndexed.riskInfo.analyse.oneToThreeYear = oneToThreeYear + '家'; //1~3年
                dataIndexed.riskInfo.analyse.threeToFiveYear = threeToFiveYear + '家'; //3~5年
                dataIndexed.riskInfo.analyse.fiveToEightYear = fiveToEightYear + '家'; //5~8年
                dataIndexed.riskInfo.analyse.moreThanEightYear = moreThanEightYear + '家'; //>8年

                //高风险企业数量
                dataIndexed.riskInfo.analyse.highRisk = dataIndexed.riskInfo.highRisk.length + '家';
                //中风险企业数量
                dataIndexed.riskInfo.analyse.normalRisk = dataIndexed.riskInfo.normalRisk.length + '家';
                //低风险企业数量
                dataIndexed.riskInfo.analyse.lowRisk = dataIndexed.riskInfo.lowRisk.length + '家';
                //安全企业数量
                dataIndexed.riskInfo.analyse.safe = associateCompanyNumber - dataIndexed.riskInfo.highRisk.length - dataIndexed.riskInfo.normalRisk.length - dataIndexed.riskInfo.lowRisk.length + '家';

                //== 将数据更新进状态管理器中统一管理
            	store.dispatch({ type: 'UPDATE_RISKINFO', data:dataIndexed.riskInfo});
            },
            dataType
        );
    }else{
        //== 将数据更新进状态管理器中统一管理
        store.dispatch({ type: 'UPDATE_RISKINFO', data:dataIndexed.riskInfo});
    }
}

// start 计算日期间隔，以年为单位 ==
function getCompanyEstablishedYears(establishedDate) {
    var currentDate = new Date();
    var processedEstablishedDate = new Date(establishedDate);
    var establishedYears = (currentDate - processedEstablishedDate)/(1000*60*60*24*365);

    return establishedYears;
}
// end 计算日期间隔，以年为单位 ===

//end 节点信息处理，注册资本、成立时间 =================================================

//== start 渲染风险分析分值雷达图 ===============
function renderRadar(node){
    //== start 预留处理节点数据位置----
    //== end 预留处理节点数据位置------
    if (node.labels[0] == 'Person' || node.labels[0] == 'Unknown') { //新增未知节点类型判断
        return;
    }

    var radarContainerWidth = document.getElementById("radarContainer").offsetWidth;
    $("#radarContainer").css("height", radarContainerWidth+20);
    var radarContainerHeight = parseInt($("#radarContainer").css("height"));

    var dataType = 'json';
    //== 风险分析数据接口
    var queryCompany = node.properties['公司名称'];
    //==
    // var testString = "工商,司法,招聘,新闻(正面),新闻(负面)|Hodor,19,10,17,4,10";
    // var testString = "工商,司法,招聘,新闻(正面),新闻(负面)|Hodor,1,1,1,1,1";
    // var testString = "工商,司法,招聘,新闻(正面),新闻(负面)";
    var testString = "背景,司法,经营,舆情(正面),舆情(负面)";
    //== 获取当前日期
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var mouth = nowDate.getMonth()+1;
    var date = nowDate.getDate();
    //== 将日期处理为“0000-00-00”格式
    var mouthStr;
    var dateStr;
    var nowDateStr;
    if(mouth < 10){
        mouthStr = '0' + mouth;
    }else{
        mouthStr = mouth.toString();
    }
    if(date < 10){
        dateStr = '0' + date;
    }else{
        dateStr = date.toString();
    }
    nowDateStr = year + "-" + mouthStr + "-" + dateStr;
    var yestoday_milliseconds = nowDate.getTime() - 1000*60*60*24*2;
    var yestoday = new Date();
    yestoday.setTime(yestoday_milliseconds);
    var yestodayYear = yestoday.getFullYear();
    var yestodayMouth = yestoday.getMonth()+1;
    var yestodayDate = yestoday.getDate();
    var yestodayStr;
    var yestodayMouthStr;
    var yestodayDateStr;
    if(yestodayMouth < 10){
        yestodayMouthStr = '0' + yestodayMouth;
    }else{
        yestodayMouthStr = yestodayMouth.toString();
    }
    if(yestodayDate < 10){
        yestodayDateStr = '0' + yestodayDate;
    }else{
        yestodayDateStr = yestodayDate.toString();
    }
    yestodayStr = yestodayYear + '-' + yestodayMouthStr + '-' + yestodayDateStr;
    // console.log("nowDateStr:");
    // console.log(nowDateStr);
    // console.log("yestodayStr:");
    // console.log(yestodayStr);
    // console.log(queryCompany);
    $.post("../Access/leida",
        // $.post("errorApi",
        {
            // compNameAjax是接口设定的参数名称
            companyName: queryCompany,
            startTime: yestodayStr,
            // startTime:"2016-07-22",//==暂时给定默认日期
            stopTime:nowDateStr
        },
        function(data,status){
            // console.log(status);
            if (status != 'success') {
                alert('服务器没有响应，请稍后再试');
                return;
            }
            // data[i].colsValue是返回json对象包含的提取数据入口
            var radarRawData;
            var radarCompanyName;
            var radarCompanyRiskLevel;
            var radarRawDataAarry;
            // var radarRawDataObj = {
            //     "工商":1,
            //     "司法":1,
            //     "招聘":1,
            //     "正面舆情":1,
            //     "负面舆情":1,
            // }
            var radarRawDataObj = {
                "背景":{value:6, riskLevel: 0},
                "司法":{value:6, riskLevel: 0},
                "经营":{value:6, riskLevel: 0},
                "正面舆情":{value:6, riskLevel: 0},
                "负面舆情":{value:6, riskLevel: 0},
            }
            if(data.length>0){
                radarCompanyName = data[0].companyName;
                radarCompanyRiskLevel = data[0].riskratefixed;
                radarRawData = data[0].colsValue;

                // 载入图形
                // console.log("data:");
                // console.log(data);
                // console.log("radarRawData:");
                // console.log(radarRawData);
                radarRawDataAarry = radarRawData.split(',');
                // console.log("radarRawDataAarry:");
                // console.log(radarRawDataAarry);
                for(var i=0; i<radarRawDataAarry.length; i++){
                    if(radarRawDataAarry[i].indexOf('工商') != -1){
                        radarRawDataObj['背景'].value = +radarRawDataAarry[i].substr(radarRawDataAarry[i].lastIndexOf(':')+1) + 6;
                        radarRawDataObj['背景'].riskLevel = +radarRawDataAarry[i].substr(radarRawDataAarry[i].indexOf(':')+1, 1);
                    }else if(radarRawDataAarry[i].indexOf('司法') != -1){
                        radarRawDataObj['司法'].value = +radarRawDataAarry[i].substr(radarRawDataAarry[i].lastIndexOf(':')+1)+ 6;
                        radarRawDataObj['司法'].riskLevel = +radarRawDataAarry[i].substr(radarRawDataAarry[i].indexOf(':')+1, 1);
                    }else if(radarRawDataAarry[i].indexOf('招聘') != -1){
                        radarRawDataObj['经营'].value = +radarRawDataAarry[i].substr(radarRawDataAarry[i].lastIndexOf(':')+1)+ 6;
                        radarRawDataObj['经营'].riskLevel = +radarRawDataAarry[i].substr(radarRawDataAarry[i].indexOf(':')+1, 1);
                    }else if(radarRawDataAarry[i].indexOf('正面舆情') != -1){
                        // radarRawDataObj['正面舆情'].value = Math.abs(+radarRawDataAarry[i].substr(radarRawDataAarry[i].lastIndexOf(':')+1))+ 6;
                        radarRawDataObj['正面舆情'].value = 0 + 6;
                        radarRawDataObj['正面舆情'].riskLevel = +radarRawDataAarry[i].substr(radarRawDataAarry[i].indexOf(':')+1, 1);
                    }else if(radarRawDataAarry[i].indexOf('负面舆情') != -1){
                        radarRawDataObj['负面舆情'].value = Math.abs(+radarRawDataAarry[i].substr(radarRawDataAarry[i].lastIndexOf(':')+1))+ 6;
                        radarRawDataObj['负面舆情'].riskLevel = +radarRawDataAarry[i].substr(radarRawDataAarry[i].indexOf(':')+1, 1);
                        // radarRawDataObj['负面舆情'] = + "-9";
                    }
                }
            }
            // console.log("radarRawDataObj:");
            // console.log(radarRawDataObj);
            var radarRawDataString = radarCompanyName;
            for(var j=0; j<5; j++){
                switch(j){
                    case 0: radarRawDataString += "---" +  radarRawDataObj['背景'].value; break;
                    case 1: radarRawDataString += "---" +  radarRawDataObj['司法'].value; break;
                    case 2: radarRawDataString += "---" +  radarRawDataObj['经营'].value; break;
                    case 3: radarRawDataString += "---" +  radarRawDataObj['正面舆情'].value; break;
                    case 4: radarRawDataString += "---" +  radarRawDataObj['负面舆情'].value; break;
                }
            }
            // console.log(radarRawDataString);
            testString += "|" + radarRawDataString;
            // console.log(testString);
            startRenderRadar(testString, radarRawDataObj, radarCompanyRiskLevel);
        },
        dataType
    );
    // var testString = "背景,司法,经营,专利,新闻(正面),新闻(负面)|Hodor,19,2,4,4,7|Jon Snow,14,15,18,14,7|Tyrion Lannister,8,19,7,5,10|Eddard Stark,12,13,17,12,0";
    // var testString = "背景,司法,经营,新闻(正面),新闻(负面)|Hodor,19,10,17,4,10";

    function startRenderRadar(str, getRiskLevel,companyRiskLevel){
        // console.log("getRiskLevel");
        // console.log(getRiskLevel);
        var radarData = [];
        var chart = radar.RadarChart.chart();
      
        var radarSvgWidth = radarContainerWidth-20;
        var radarSvgHeight = radarSvgWidth;
        var csv = testString.split("\|").map(function(d,i){
            if(i==0){
                return d.split(",");
            }else{
                return d.split("---");
            }
        });
        var radarHeaders = [];

        // console.log("csv:");
        // console.log(csv);

        csv.forEach(function(item, i){
            if(i==0){
                radarHeaders = item;
            }else{
                var newSeries = {};
                item.forEach( function(v, j){
                    if(j==0){
                        newSeries.className = v;
                        newSeries.axes = [];
                    }else{
                        var radarHeadersType = radarHeaders[j-1];
                        // console.log(radarHeadersType);
                        switch(radarHeadersType){
                            case "背景": newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v), "riskLevel": getRiskLevel['背景'].riskLevel});break;
                            case "司法": newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v), "riskLevel": getRiskLevel['司法'].riskLevel});break;
                            case "经营": newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v), "riskLevel": getRiskLevel['经营'].riskLevel});break;
                            case "舆情(正面)": newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v), "riskLevel": getRiskLevel['正面舆情'].riskLevel});break;
                            case "舆情(负面)": newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v), "riskLevel": getRiskLevel['负面舆情'].riskLevel});break;
                        }
                        // newSeries.axes.push({"axis":[radarHeaders[j-1]], "value": parseFloat(v)});
                    }
                });
                radarData.push(newSeries);
            }
        })
        radarData[0]['companyRiskLevel'] = companyRiskLevel;
        // console.log("radarData:");
        // console.log(radarData);

       radar.RadarChart.defaultConfig.radius = 3;
       radar.RadarChart.defaultConfig.w = radarSvgWidth;
       radar.RadarChart.defaultConfig.h = radarSvgHeight;
       radar.RadarChart.draw("#radarContainer", radarData);
    } 
}
//== end 渲染风险分析分值雷达图 =================



/*== end 拓扑图处理程序 ==================================================================*/

