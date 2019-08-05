
function Page(opt){
	this.warp = document.getElementById(opt.warp);
	this.ol = document.getElementById(opt.foot_ol);
	this.prve = document.getElementById(opt.prve);
	this.next = document.getElementById(opt.next);

	this.bookdata = null;

	//每页显示五条数据
	this.pageCount = 5;

	//最大页数
	this.maxPage = null;
	//当前页数

	this.pageIndex = 1;

	this.init();
}

Page.prototype = {
	constructor : Page,
	init : function(){
		//进行一次请求

		$ajax({
			url : "book.json",
		}).then((data) => {
			console.log(data);
			this.bookdata = data;
			this.maxPage = Math.ceil( this.bookdata.length / this.pageCount);
			this.warp.innerHTML =  this.fillData(data,0);
		});

		//绑定事件
		this.bindEvent();
	},

	//点击按钮,切换
	bindEvent : function(){

		var self = this;

		this.ol.onclick = function(){
			var li = event.target;

			if(li.tagName == "LI"){
				for(var i = 0;i < self.ol.children.length; i++ ){
					self.ol.children[i].classList.remove("item_active");
				}

				li.classList.add("item_active");

				//更新 self.pageIndex

				self.pageIndex = li.innerHTML * 1;

				//1  0-5
				//2  5-10
				//3  10-15

				self.warp.innerHTML = self.fillData(self.bookdata , (li.innerHTML - 1) * 5);


				//修改下面的页码
				//给 页码赋值
				if(li.innerHTML >= 4 && li.innerHTML <= self.maxPage - 2 ){
					self.ol.innerHTML =  self.fillFootData(li.innerHTML - 2,li.innerHTML);
				}else if(li.innerHTML > self.maxPage - 2){
					self.ol.innerHTML = self.fillFootData(self.maxPage - 4,li.innerHTML);
				}else{
					self.ol.innerHTML =  self.fillFootData(1,li.innerHTML);
				}
			}


			if(li.tagName == "SPAN"){
				if(li.id == "next"){
					//下一页
					//2  5-10
					//3  10-15
					//4  ...
					self.pageIndex += 1;
					self.pageIndex = self.pageIndex > self.maxPage ? self.maxPage : self.pageIndex;
					self.warp.innerHTML = self.fillData(self.bookdata , (self.pageIndex - 1) * 5);

					var index = 0;

					if(self.pageIndex < 4){
						index = 1;
					}
					if(self.pageIndex >= 4 && self.pageIndex <= self.maxPage - 2){
						index = self.pageIndex - 2;
					}
					if(self.pageIndex > self.maxPage - 2){
						index = self.maxPage - 4;
					}
					self.ol.innerHTML =  self.fillFootData(index,self.pageIndex);
				}

				if(li.id == "prve"){
					//上一页
					self.pageIndex -= 1;
					self.pageIndex = self.pageIndex <= 1 ? 1 : self.pageIndex;
					self.warp.innerHTML = self.fillData(self.bookdata , (self.pageIndex - 1) * 5);

					var index = 0;

					if(self.pageIndex < 4){
						index = 1;
					}
					if(self.pageIndex >= 4 && self.pageIndex <= self.maxPage - 2){
						index = self.pageIndex - 2;
					}
					if(self.pageIndex > self.maxPage - 2){
						index = self.maxPage - 4;
					}
					self.ol.innerHTML =  self.fillFootData(index,self.pageIndex);
				}

			}
		}


	},

	fillFootData : function(start,index){
		var str = "";
		for(var i = start; i < start + 5; i++){
			var li = `<li>${i}</li>`
			if(i == index){
				li = `<li class = "item_active">${i}</li>`;
			}
			str += li;
		}
		return `<li class="span"><span id="prve">上一页</span></li>` 
			+ str + 
			`<li  class="span"><span id="next">下一页</span></li>`;
	},


	fillData : function(data,start){
		//data 里面有40条数据
		//获取五条数据,
		var bookStr = "";
		for(var i = start ;i < start + 5 ; i++){
			if(i >= data.length){
				return "<ul>" + bookStr + "</ul>";
			}
			bookStr += `<li>
							<dl>
								<dt><img src=${data[i].book_img} ></dt>
								<dd>
									<p>${data[i].book_name}</p>
									<p>${data[i].book_publish}</p>
									<p>${data[i].book_author}</p>
								</dd>
							</dl>
						</li>`;
		}

		return "<ul>" + bookStr + "</ul>";
	},//////////////////////////////////////////////////////////
}

function $ajax(opt){

	return new Promise((resolve,reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('get', opt.url, true);
		xhr.send(null);
		xhr.onreadystatechange = function(){
			if(xhr.readyState !=  4){
				return;
			}
			if(xhr.status == 200){
				resolve(eval("("+ xhr.responseText+")"));
			}else{
				reject("请求错误");
			}
		}
	});
}


