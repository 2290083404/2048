var Core = require("./core.js");
var Move=require("./move.js");
Page({ 
  data: {
    hidden: true,
    start: "开始游戏",
    num: [
        
    ],
    score: 2,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false  // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {
    
    this.gameStart();
  },
  gameStart: function() {  // 游戏开始
    var core = new Core(4, 4, 2);
    var bestScore = wx.getStorageSync("bestScore");
    this.setData({
        core: core,
        coreproto: core.__proto__,
        bestScore: bestScore,
        score:2
    });
    this.setData({
      hidden: true,
      over: false,
      num: this.data.core.grid
    }); 
  },
  gameOver: function() {  // 游戏结束
    this.setData({
      over: true 
    });
  
    if (this.data.score >= 2048) {
      this.setData({ 
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！' 
      }); 
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      }); 
    } 
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function(ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  },
  touchMove: function(ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
      
  },
  touchEnd: function() {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
          this.setData({
              start: "重新开始",
          });
          var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
          //执行移动动画效果
          var grid1=this.doAnimation(this.data.num, direction);
          this.setData({
              num: grid1
          });
          this.getNewNum(direction);
          //执行移动后的结果
          
          
          
      }      
  },
    getNewNum: function (direction){
        //清空需要移动的数据
      var that=this;
      setTimeout(function(){
          var num = that.data.num;
          var move = new Move(direction, num);
          that.setData({
              num: move.grid
          });

          //随机一个新值出来
          var core = that.data.coreproto;
          var newCell = core.getRandomAddress(num)
          num[newCell.x][newCell.y]['num'] = core.getRandomNumber(num);
          //获取当前最高分
          var score=core.getMaxNumber(num);
           //判断是否游戏结束
           if(score>=2048){
               var gameOver=true;
           }else{
               var gameOver = core.checkOver(num);
           }
          
          if (gameOver){
              if (parseInt(score) > parseInt(wx.getStorageSync('highScore'))) {
                  wx.setStorageSync('highScore', score);
                  that.setData({
                      bestScore: score,
                      score:score,
                      endMsg: '创造了新记录！！！'
                  });
              }else{
                  that.setData({
                      bestScore: wx.getStorageSync('highScore'),
                      score: score,
                      endMsg:"游戏结束"
                  });
              }
          }
          that.setData({
              num: num,
              score: score,
              over:gameOver,
          });
         
          

      },500);
  },

  //执行动画效果
    doAnimation: function (arr, direction){
      for(var i=0;i<arr.length;i++){
          for(var j=0;j<arr[i].length;j++){
              if (arr[i][j]['num']!=""){
                  arr[i][j]['flag'] = this.formatLength(i, j, direction);
              }
          }
      }
      return arr;

  },
  //计算某个单元格之间的间隔
  formatLength: function (x,y, direction){
      var grid=this.data.num;
      //左3，右1，上0，下2
      if(direction==1){
          //右1，
          var arr = grid[x];
          var lenght=0;
          //计算空格的长度
          for(var i=y;i<arr.length;i++){
              if (arr[i]['num']==""){
                  lenght = lenght+1;
              }
          }
          //计算可以合并的长度
          var temp=[];
          for (var i = y; i < arr.length; i++) {
              if (arr[i]['num'] != "" ) {
                  temp[temp.length]=arr[i];
              }
          }
          for (var i = 0; i < temp.length-1;i++){
              if (temp[i]['num'] == temp[i+1]['num']){
                  lenght = lenght + 1;
              }
          }
          return "cellMove-you-" + lenght;
      } else if (direction == 2) {
          //下
          var arr=[];
          for (var i = 0; i < grid.length;i++){
              arr[arr.length]=grid[i][y];
          }
          var lenght = 0;
          //计算空格的长度
          for (var i = x; i < arr.length; i++) {
              if (arr[i]['num'] == "") {
                  lenght = lenght + 1;
              }
          }
          //计算可以合并的长度
          var temp = [];
          for (var i = x; i < arr.length; i++) {
              if (arr[i]['num'] != "") {
                  temp[temp.length] = arr[i];
              }
          }
          for (var i = 0; i < temp.length - 1; i++) {
              if (temp[i]['num'] == temp[i + 1]['num']) {
                  lenght = lenght + 1;
              }
          }
          return "cellMove-down-" + lenght;
          
      } else if (direction == 3) {
          //左3
          var arr = grid[x];
          var lenght = 0;
          //计算空格的长度
          for (var i = 0; i < y; i++) {
              if (arr[i]['num'] == "") {
                  lenght = lenght + 1;
              }
          }
          //计算可以合并的长度
          var temp = [];
          for (var i = 0; i <=y; i++) {
              if (arr[i]['num'] != "") {
                  temp[temp.length] = arr[i];
              }
          }
          for (var i = 0; i < temp.length - 1; i++) {
              if (temp[i]['num'] == temp[i + 1]['num']) {
                  lenght = lenght + 1;
              }
          }


          
          return "cellMove-zuo-" + lenght;
      } else if (direction <1) {
          //上
          var arr = [];
          for (var i = 0; i < grid.length; i++) {
              arr[arr.length] = grid[i][y];
          }

          var lenght = 0;
          //计算空格的长度
          for (var i = 0; i < x; i++) {
              if (arr[i]['num'] == "") {
                  lenght = lenght + 1;
              }
          }
          //计算可以合并的长度
          var temp = [];
          for (var i = 0; i < x+1; i++) {
              if (arr[i]['num'] != "") {
                  temp[temp.length] = arr[i];
              }
          }
          for (var i = 0; i < temp.length - 1; i++) {
              if (temp[i]['num'] == temp[i + 1]['num']) {
                  lenght = lenght + 1;
              }
          }
          return "cellMove-up-" + lenght;
      }
      return length;
  },

  updateView(data) {
    var max = 0;
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 4; j++)
        if(data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    this.setData({
      num: data,
      score: max
    });
  },
  onShareAppMessage: function() {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})