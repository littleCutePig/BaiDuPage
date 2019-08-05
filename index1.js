//创建一个分页对象

function Page(opt){

	//获取 ul
	this.book_ul = document.getElementById(opt.book_ul);

	//获取 ol
	this.page_ol = document.getElementById(opt.foot_ol);

	//定义一个变量,来控制每一页显示的数据数量
	this.dataCount = 5;

	//定义一个变量, 计算数据一共能分多少页
	this.pageCount = 0;

	//定义一个全局的数据
	this.data = null;

	//定义一个下标
	this.index = 0;

	this.init();
}

Page.prototype = {
	constructor : Page,
	//初始化方法,相当于程序的主入口

	init : function() {

		var _this = this;
		//第一步请求数据
		//调用 ajax 方法
		ajax({
			url : "book.json",
			success : function(data){
				console.log(data);

				//初始化数据
				_this.data = data;

				_this.pageCount = Math.ceil(_this.data.length / _this.dataCount);

				//过滤数据
				var arr = _this.filterData(1);
				//渲染页面 ,渲染前五条数据	
				_this.fillData(arr);

			}
		});
		//调用添加事件方法

		this.bindEvent();

	},
	//绑定事件
	bindEvent : function (){

		var _this = this;

		//给每一下标添加点击事件,使用事件委托
		this.page_ol.onclick = function (){
			var ele = event.target;
			//12345..
			if(ele.tagName == "LI"){
				//过滤数据
				var arr =  _this.filterData( ele.innerHTML * 1 );
				//填充数据
				_this.fillData(arr);

				_this.index = ele.innerHTML * 1;

				//循环清空 li 的样式

				var lis = _this.page_ol.children;

				for(var i = 1;i < lis.length-1; i++){
					lis[i].classList.remove("item_active");
				}
				ele.classList.add("item_active");
				_this.footFillData(ele.innerHTML * 1);
			}

			if(ele.tagName == "SPAN"){
				if(ele.id == "prve"){
					//上一页
					_this.index -= 1;
					if(_this.index <= 1){
						_this.index = 1;
					}
					
				}
				if(ele.id == "next"){
					//下一页
					_this.index += 1;
					if(_this.index >= _this.pageCount){
						_this.index = _this.pageCount;
					}
				}
				//过滤数据
				var arr = _this.filterData(_this.index);
				//填充数据
				_this.fillData(arr);
				_this.footFillData(_this.index);
			}
		}
	},

	//填充数据
	fillData : function(dataArr){
		var html = "";

		//参数是一个数组,里面放着我们想要的五条数据
		dataArr.forEach( function(element) {
			html += `<li>
					<dl>
						<dt><img src="${element.book_img}" ></dt>
						<dd>
							<p>${element.book_name}</p>
							<p>${element.book_author}</p>
							<p>${element.book_publish}</p>
						</dd>
					</dl>
				</li>`;
		});
		//进行复制
		this.book_ul.innerHTML = html;
	},

	//给分页填充数据
	footFillData : function(n) {
		// n = 1 , 2 ,3   li  1 - 5
		// n = 4       	  li  2 - 6
		// n = 5 		  li  3 - 7
		// n = 6 		  li  4 - 8
		// n = 7 , 8      li  4 - 8

		var html = '<li class="span"><span id="prve" >上一页</span></li>';
			
		// n = 1,2,3
		if(n <= 3 ){
			//li 1 - 5
			var start = 1;
			var end = 6;
		}
		// n = 4,5
		if(n > 3 && n < this.pageCount - 2){

			var start = n - 2;
			var end = n + 3;
		}
		// n = 6 ,7 ,8
		if(n >= this.pageCount - 2){
			var start = this.pageCount - 4;
			var end = start + 5;
		}
		for(var i = start ; i < end ;i++){
			if(i == n){
				html += `<li class = "item_active">${i}</li>`;
			}else{
				html += `<li>${i}</li>`;
			}
		}

		html = html + '<li class="span"><span id="next" >下一页</span></li>';
		//给 ol 进行赋值

		this.page_ol.innerHTML = html;
	},


	//过滤数据的方法
	filterData : function (n){
		//过滤谁? 怎么过滤?
		//n == 1  0 - 4  (n-1)*5
		//n == 2  5 - 9  (n-1)*5
			
		var arr = [];

		var start = (n-1) * this.dataCount;
		//表示每页五条数据
		var end = start + this.dataCount;

		//遍历所有的数据	
		for(var i = 0;i<this.data.length;i++){
			if( i >= start && i < end){
				arr.push(this.data[i]);
			}
		}
		//返回数据
		return arr;
	}
}

function ajax(opt){
	var xhr = new XMLHttpRequest();
	xhr.open("get", opt.url, true);
	xhr.send(null);
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			opt.success(eval("("+ xhr.responseText +")"));
		}
	}
}