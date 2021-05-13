window.onload=function(){
	// 加载动画
	let mask=document.getElementById('mask');
	let maskTop=document.querySelector('#mask .maskTop');
	let maskBottom=document.querySelector('#mask .maskBottom');
	let maskLine=document.querySelector('#mask .maskLine');
	function loading(){
		// 图片张数表示变量，用过记录当前加载完成的图片数量
		let imgFlag=0;
		// 图片路径数组
		let arr=['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg',
		'about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg',
		'worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
		arr.forEach((item,index)=>{
			// 创建图片对象
			let imgNode=new Image();
			imgNode.src='img/'+arr[index];
			imgNode.addEventListener('load',()=>{
				imgFlag++;
				maskLine.style.width=imgFlag/arr.length*100+'%';
			});
		});
		// transitionend：用于监听过渡执行完成
		// 会根据过渡样式的个数来决定回调的执行次数
		maskLine.addEventListener('transitionend',()=>{
			maskTop.style.height='0';
			maskBottom.style.height='0';
			maskLine.style.display='none';
		});
		// 加载完毕
		maskTop.addEventListener('transitionend',()=>{
			// 第一屏的入场动画
			animationArr[0]['inAin']();
			// 第一屏的3D轮播
			home3D();
			// 移除遮罩
			mask.remove();
		});
	};
	loading();
	
	
	// 头部布局
	let arrow=document.querySelector('#header .arrow');// 小三角
	let upNodes=document.querySelectorAll('#header .headerMain .nav ul li .up');// up层文字
	let liNodes=document.querySelectorAll('#header .headerMain .nav ul li');// 头部导航
	let menuBarLi=document.querySelectorAll('#content .menuBar>li');// 侧边导航
	// 头部初始化
	function headerBind(){
		// 第一个up的宽度
		upNodes[0].style.width='100%';
		// 初始化小三角的位置
		arrow.style.left=liNodes[0].getBoundingClientRect().left+liNodes[0].offsetWidth/2-arrow.offsetWidth/2+'px';
		for(let i=0;i<liNodes.length;i++){
			// 给所有的li添加index属性
			liNodes[i].index=i;
			// 给所有的li绑定单击事件
			liNodes[i].addEventListener("click",function(){
				// // 清空所有up的宽度
				// for(let item of upNodes){
				// 	item.style.width='';// 解决宽度权重问题
				// }
				// // 设置当前up的宽度
				// upNodes[this.index].style.width='100%';
				// // 更新小三角的位置
				// arrow.style.left=liNodes[this.index].getBoundingClientRect().left+liNodes[this.index].offsetWidth/2-arrow.offsetWidth/2+'px';
				
				// 记录上一页
				preIndex=now;
				// 点击实现翻页(不能直接将this.index传入move)
				now=this.index;
				// 如果上一页和当前页是同一页则不执行move
				if(preIndex==now){
					return;
				}
				move(now);
			});
		}
		// 侧边导航
		for (let i=0;i<menuBarLi.length;i++){
			menuBarLi[i].index=i;
			menuBarLi[i].addEventListener("click",function(){
				// 记录上一页
				preIndex=now;
				// 点击侧导航实现翻页
				now=this.index;
				// 如果上一页和当前页是同一页则不执行move
				if(preIndex==now){
					return;
				}
				move(now);
			});
		}

	};
	headerBind();


	// 主体布局
	let content=document.getElementById('content');
	let header=document.getElementById('header');
	let contentLi=document.querySelectorAll('#content .list>li');// 选择器bug

	// 内容初始化
	function contentBind(){
		content.style.height=document.documentElement.clientHeight-header.offsetHeight+'px';
		for(let item of contentLi){
			item.style.height=document.documentElement.clientHeight-header.offsetHeight+'px';
		}
	};
	contentBind();

	// 屏幕滑动
	let contentList=document.querySelector('#content .list');// ul
	let now=0; // 【标识变量】当前屏幕是第几屏
	let preIndex=0;// 【标识变量】记录上一屏
	let timer=null;// 滚轮降频定时器
	document.addEventListener("mousewheel",(event)=>{
		clearTimeout(timer);
		timer=setTimeout(()=>{
			fun(event);
		},200);
	});

	// 滚轮事件
	// 解决兼容问题
	// document.onmousewheel=fun;
	if(document.addEventListener){
		document.addEventListener("DOMMouseScroll",()=>{
			clearTimeout(timer);
			timer=setTimeout(()=>{
				fun(event);
			},200);
		});
	}
	// 屏幕滑动handler
	function fun(event){
		event=event||window.event; 
		let flag='';// 【标识变量】记录滚轮方向
		if(event.wheelDelta){
			if(event.wheelDelta>0){
				flag='up';// 向上
			}else{
				flag="down";// 向下
			}
		}else if(event.detail){
			// 兼容firefox
			if(event.detail<0){
				flag='up';// 向上
			}else{
				flag="down";// 向下
			}
		}
		
		// 记录上一页
		preIndex=now;
		// 第一屏向上,最后一屏向下,则不翻页
		if(preIndex==0&&flag=='up'||preIndex==liNodes.length-1&&flag=='down'){
			return;
		}

		switch(flag){
			case 'up':
			// 去执行向上的逻辑
				if(now>0){
					now--;
				}
				move(now);
				break;
			case 'down':
			// 去执行向下的逻辑
				if(now<liNodes.length-1){
					now++;
				}
				move(now);
				break;
		}
		// 取消默认行为
		// event.preventDefault&&event.preventDefault();
		// return false;
	};
	// 滑动handler
	function move(now){
		// 导航部分高亮显示
		for(let item of upNodes){
			item.style.width='';
		}
		upNodes[now].style.width='100%';
		// 更新小三角位置
		arrow.style.left=liNodes[now].getBoundingClientRect().left+liNodes[now].offsetWidth/2-arrow.offsetWidth/2+'px';
		// 屏幕切换：当前所在第几屏 *（视口高度 - header高度）
		contentList.style.top=-now*(document.documentElement.clientHeight-header.offsetHeight)+'px';
		
		// 更新侧边导航小圆点
		for(let item of menuBarLi){
			item.className='';
		}
		menuBarLi[now].className='active';
		
		// 入场动画
		animationArr[now]['inAin']();
		// 出场动画:给上一次显示的页面添加
		animationArr[preIndex]['outAin']();
	};
	// move();


	// 第四屏
	let aboutUl=document.querySelectorAll("#content .list .about .about3>.item>ul");
	
	// 图片特效
	function picBoom(){
		for(let item of aboutUl){
			changImg(item);
		}
		// 图片改变handler
		function changImg(ul){
			// li的宽高都是ul的一半
			let w=ul.offsetWidth/2;
			let h=ul.offsetHeight/2;
			// 获取ul的data-src属性
			let imgSrc=ul.dataset.src;
			// 创建4个li用以实现图片特效
			for(let i=0;i<4;i++){
				let liNode=document.createElement("li");
				let imgNode=new Image();
				liNode.style.width=w+'px';
				liNode.style.height=h+'px';
				// 加载图片
				imgNode.src=imgSrc;
				imgNode.style.top=-Math.floor(i/2)*h+'px';// Math.floor返回小于等于x的最大整数
				imgNode.style.left=-(i%2)*w+'px';
				ul.appendChild(liNode);
				liNode.appendChild(imgNode);
			}
			// 获取每个小图片
			let imgNodes=ul.querySelectorAll('img');
			// 绑定移入移出事件
			ul.addEventListener("mouseenter",()=>{
				imgNodes[0].style.top=h+'px';
				imgNodes[1].style.left=-2*w+'px';
				imgNodes[2].style.left=w+'px';
				imgNodes[3].style.top=-2*h+'px';

			});
			ul.addEventListener("mouseleave",()=>{
				imgNodes[0].style.top=0+'px';
				imgNodes[1].style.left=-w+'px';
				imgNodes[2].style.left=0+'px';
				imgNodes[3].style.top=-h+'px';
			});
		}
	};
	picBoom();


	// 第一屏
	let homeLi1=document.querySelectorAll('#content .list .home .homeList>li');
	let homeLi2=document.querySelectorAll('#content .list .home .homeIcon>li');

	function home3D(){
		// 用于存储上一次的索引
		let oldIndex=0;
		// 绑定index属性
		for(let i=0;i<homeLi2.length;i++){
			homeLi2[i].index=i;
			homeLi2[i].addEventListener('click',function(){
				// 清除定时器，防止冲突
				clearInterval(homeTimer);
				// 清除所有小圆点的active，给当前点击的小圆点添加active
				for(let item of homeLi2){
					item.className='';
				}
				this.className='active';
				// 根据点击索引与旧索引值判断点击小圆球的方向，添加对应的动画
				// 点击左侧：左边的隐藏leftHide，右边的显示rightShow
				// 点击右侧：左边的显示leftShow，右边的隐藏rightHide
				if(oldIndex<this.index){
					homeLi1[oldIndex].className='leftHide';
					homeLi1[this.index].className='rightShow';
				}else if(oldIndex>this.index){
					homeLi1[this.index].className='leftShow';
					homeLi1[oldIndex].className='rightHide';
				}
				// 更新索引值
				oldIndex=this.index;
				// 更新自动轮播标识变量
				autoIndex=this.index;
				// 重启定时器
				auto();
			});
		}
		// 自动轮播
		let autoIndex=0;// 标识变量
		function auto(){
			homeTimer=setInterval(()=>{
				autoIndex++;
				// 临界值处理
				if(autoIndex==homeLi2.length){
					autoIndex=0;
				}
				// 一直执行点击右侧的逻辑
				homeLi1[oldIndex].className='leftHide';
				homeLi1[autoIndex].className='rightShow';
				// 更新小圆点
				for(let item of homeLi2){
					item.className='';
				}
				homeLi2[autoIndex].className='active';
				// 更新下标
				oldIndex=autoIndex;
			},5000);
		};
		auto();
	};
	// home3D(); 等加载动画执行完毕后再触发


	// 侧边导航
	// 在头部初始化中完成


	// 出入场动画
	let animationArr=[{
		// 第一屏
		inAin(){
			// 操作homeList和homeIcon
			let homeList=document.querySelector('#content .list .home .homeList');
			let homeIcon=document.querySelector('#content .list .home .homeIcon');
			homeList.style.transform='translateY(0px)';
			homeIcon.style.transform='translate(-50%,0px)';
			homeList.style.opacity='1';
			homeIcon.style.opacity='1';

		},
		outAin(){
			let homeList=document.querySelector('#content .list .home .homeList');
			let homeIcon=document.querySelector('#content .list .home .homeIcon');
			homeList.style.transform='translateY(-200px)';
			homeIcon.style.transform='translate(-50%,200px)';
			homeList.style.opacity='0';
			homeIcon.style.opacity='0';
		}
	},{
		// 第二屏
		inAin(){
			let plane1=document.querySelector('#content .course .plane1');
			let plane2=document.querySelector('#content .course .plane2');
			let plane3=document.querySelector('#content .course .plane3');
			plane1.style.transform='translate(0px,0px)';
			plane2.style.transform='translate(0px,0px)';
			plane3.style.transform='translate(0px,0px)';
		},
		outAin(){
			let plane1=document.querySelector('#content .course .plane1');
			let plane2=document.querySelector('#content .course .plane2');
			let plane3=document.querySelector('#content .course .plane3');
			plane1.style.transform='translate(-200px,-200px)';
			plane2.style.transform='translate(-200px,200px)';
			plane3.style.transform='translate(200px,-200px)';
		}
	},{
		// 第三屏
		inAin(){
			let pencel1=document.querySelector('#content .works .pencel1');
			let pencel2=document.querySelector('#content .works .pencel2');
			let pencel3=document.querySelector('#content .works .pencel3');
			pencel1.style.transform='translateY(0px)';
			pencel2.style.transform='translateY(0px)';
			pencel3.style.transform='translateY(0px)';
		},
		outAin(){
			let pencel1=document.querySelector('#content .works .pencel1');
			let pencel2=document.querySelector('#content .works .pencel2');
			let pencel3=document.querySelector('#content .works .pencel3');
			pencel1.style.transform='translateY(-200px)';
			pencel2.style.transform='translateY(200px)';
			pencel3.style.transform='translateY(200px)';
		}
	},{
		// 第四屏
		inAin(){
			let item1=document.querySelectorAll('#content .list .about3>.item')[0];
			let item2=document.querySelectorAll('#content .list .about3>.item')[1];
			item1.style.transform='rotate(0deg)';
			item2.style.transform='rotate(0deg)';
		},
		outAin(){
			let item1=document.querySelectorAll('#content .list .about3>.item')[0];
			let item2=document.querySelectorAll('#content .list .about3>.item')[1];
			item1.style.transform='rotate(45deg)';
			item2.style.transform='rotate(-45deg)';
		}
	},{
		// 第五屏
		inAin(){
			let team1=document.querySelector('#content .list .team .team1');
			let team2=document.querySelector('#content .list .team .team2');
			team1.style.transform='translateX(0px)';
			team2.style.transform='translateX(0px)';
		},
		outAin(){
			let team1=document.querySelector('#content .list .team .team1');
			let team2=document.querySelector('#content .list .team .team2');
			team1.style.transform='translateX(-200px)';
			team2.style.transform='translateX(200px)';
		}
	}];
	// 出入场动画初始化（测试）
	// 所有屏幕都处于出场状态
	for(let i=0;i<5;i++){
		animationArr[i]['outAin']();
	}
	// animationArr[0]['outAin']();
	// setTimeout(()=>{
	// 	animationArr[0]['inAin']();
	// },2000);
	

	// 当窗口尺寸发生变化时
	window.onresize=function(){
		// 重新计算内容区域高度
		contentBind();
		// 重新计算小三角的位置
		arrow.style.left=liNodes[now].getBoundingClientRect().left+liNodes[now].offsetWidth/2-arrow.offsetWidth/2+'px';
		// 重新计算滚动距离
		contentList.style.top=-now*(document.documentElement.clientHeight-header.offsetHeight)+'px';
	};
}