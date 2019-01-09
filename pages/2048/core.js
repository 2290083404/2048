/**主要方法放在该文件中*/

function Core(cols,rows,num){
    this.num=num;//最开始随机出几个数值
    this.cols = cols; 
    this.rows = rows;
    this.init();
}


Core.prototype={
    //初始化
    init:function(){
        //生成几行几列的表格
        var cols=this.cols;
        var rows=this.rows;
        var grid=[];
        for(var i=1;i<=cols;i++){
            var temp=[];
            for(var j=0;j<rows;j++){
                temp[j] = { num: "", flag: false };
            }
            grid[grid.length]=temp;
        }
        this.getNumberSum(grid);
    },
    //在空余位置随机，出现2或者4
    getNumberSum: function (grid){
        var getRandomNumber = this.getRandomNumber(grid);
        var address = this.getRandomAddress(grid);
        grid[address.x][address.y].num = getRandomNumber;
        
        
        this.grid = grid;
    },
    //获取最大值
    getMaxNumber: function (grid){
        var max=0;
        for(var i=0;i<grid.length;i++){
            for(var j=0;j<grid[i].length;j++){
                if (grid[i][j].num != "" && grid[i][j].num>max){
                    max = grid[i][j].num;
                }
            }
        }
        return max;
    },

    //出现随机数值2或者4；
    getRandomNumber: function (grid){
        var maxNumber = this.getMaxNumber(grid);
        console.log(maxNumber);
        if (maxNumber >= 0 && maxNumber <=16) {
            var randomNum = 2;
        } else if (maxNumber > 16 && maxNumber <= 64){
            console.log(parseInt(Math.random() * 10));
            var randomNum = parseInt(Math.random() * 10) >= 5 ? 4 : 2;
        } else if (maxNumber > 64 && maxNumber <= 256){
            var random = [2, 2,2,2,2,4,4, 8];
            var randomNum = random[Math.floor(Math.random() * random.length)];
        } else if (maxNumber > 256 && maxNumber <= 512) {
            var random = [2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 8,8,16];
            var randomNum = random[Math.floor(Math.random() * random.length)];
        } else if (maxNumber > 512 ) {
            var random = [2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 8, 8, 16, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, 4, 4, 8, 8, 16,32];
            var randomNum = random[Math.floor(Math.random() * random.length)];
        }
        
        return randomNum;
    },
    //在空的格中随机一个出现数值（2或者4）
    getRandomAddress: function (grid){
        //获取所有的空数组
        var nullArr=[];
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].length; j++) {
                if (grid[i][j].num == "") {
                    nullArr[nullArr.length] = i*4+j;
                }
            }
        }
        var address = nullArr[Math.floor(Math.random() * nullArr.length)];
        var x = parseInt(address / 4);
        var y=address%4;
        return {x:x,y:y};
    },

    //判断游戏是否结束
    checkOver:function(grid){
        //1:判断表格中是否有空格
        var state=true;
        for(var i=0;i<grid.length;i++){
            for(var j=0;j<grid[i].length;j++){
                if (grid[i][j].num==""){
                    state=false;
                    break;
                }
            }
        }
        if(state){
            //检测是否有可合并的项目
            //1:先获取横向和纵向的数组
            var arrList=[];
            //获取横向数组
            for(var i=0;i<grid.length;i++){
                arrList[arrList.length]=grid[i];
            }
            //获取纵向数组
            for(var i=0;i<grid[0].length;i++){
                var temp=[];
                for(var j=0;j<grid.length;j++){
                    temp[temp.length] = grid[j][i];
                }
                arrList[arrList.length] = temp;
            }
            console.log(arrList);

            //2:开始检测是否有相邻2个单元格的数组是否有合并的可能
            var state=true;
            for(var i=0;i<arrList.length;i++){
                var tempState = this.checkSameNumber(arrList[i]);
                if (!tempState){
                    state = tempState;
                    break;
                }
            }
            return state;
        }else{
            return false;//没有结束
        }
    },

    //判断某个数组中是否存在相邻的2个数值
    checkSameNumber:function(arr){
        var state=true;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 1; j < arr.length; j++) {
                var absNum=i-j;
                if (arr[i].num == arr[j].num && Math.abs(absNum)==1){
                    state=false;
                }
            }
        }
        return state;
    },

    //给所有不为空单元格出现移动效果
    move: function (direction){
        console.log(direction);

    }
}
module.exports = Core;