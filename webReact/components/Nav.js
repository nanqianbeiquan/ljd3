import React, { Component } from 'react'; //导入 react
import { Router, Route, Link, hashHistory, browserHistory } from 'react-router'; // 导入路由 react-router
import classNames from 'classnames';

import {reloadLastGraph} from './FamilyTree';

class Nav extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	Nav1IsSelected: true, 
	    	Nav2IsSelected: false, 
	    	Nav3IsSelected: false, 
	    	Nav4IsSelected: false 
	    }
	}

	componentDidMount() {
		// console.log(location);
	}

	routeSwitch1(e){
		hashHistory.push('/');
		this.setState({
			Nav1IsSelected: true, 
	    	Nav2IsSelected: false, 
	    	Nav3IsSelected: false, 
	    	Nav4IsSelected: false 
		})
	}
	routeSwitch2(e){
		hashHistory.push('/familyTree');
		this.setState({
			Nav1IsSelected: false, 
	    	Nav2IsSelected: true, 
	    	Nav3IsSelected: false, 
	    	Nav4IsSelected: false 
		})
		setTimeout(function(){
			reloadLastGraph();
		}, 100);
	}
	routeSwitch3(e){
		hashHistory.push('/dynamicMonitor');
		this.setState({
			Nav1IsSelected: false, 
	    	Nav2IsSelected: false, 
	    	Nav3IsSelected: true, 
	    	Nav4IsSelected: false 
		})
	}
	routeSwitch4(e){
		hashHistory.push('/ownInfos');
		this.setState({
			Nav1IsSelected: false, 
	    	Nav2IsSelected: false, 
	    	Nav3IsSelected: false, 
	    	Nav4IsSelected: true 
		})
	}


	render() {
	    return (
	    	<div>
	    		<ul>
	    			<li className={classNames({'Nav1':true, 'isSelected':this.state.Nav1IsSelected})} onTouchEnd={this.routeSwitch1.bind(this)}><p>查询</p></li>
	    			<li className={classNames({'Nav2':true, 'isSelected':this.state.Nav2IsSelected})} onTouchEnd={this.routeSwitch2.bind(this)}><p>族谱</p></li>
	    			<li className={classNames({'Nav3':true, 'isSelected':this.state.Nav3IsSelected})} onTouchEnd={this.routeSwitch3.bind(this)}><p>监控</p></li>
	    			<li className={classNames({'Nav4':true, 'isSelected':this.state.Nav4IsSelected})} onTouchEnd={this.routeSwitch4.bind(this)}><p>我的</p></li>
	    		</ul>
	    	</div>
	    );
	}
}

export { Nav }

