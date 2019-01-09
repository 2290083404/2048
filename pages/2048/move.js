function Move(direction,grid){
    this.direction=direction;

    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[i].length; j++) {
            grid[i][j]['flag'] = "";
        }
    }

    this.grid = grid;
    this.init();
}

Move.prototype={
    init:function(){
        //给不为空的单元格添加移动效果样式
        var grid=this.grid;
        var direction=this.direction;
        //左1，右3，上0，下2
        var num=22;
        if (direction == 1 || direction == 3){
            for (var i = 0; i < grid.length;i++){
                grid[i] = this.combineCols(grid[i],direction);
            }
        } else if (direction == 2 || direction < 1){
            for(var i=0;i<grid[0].length;i++){
                var newRowsArr=[];
                for(var j=0;j<grid.length;j++){
                    newRowsArr[newRowsArr.length] = grid[j][i];
                }
                var fianlRowsArr=this.combineCols(newRowsArr,direction);
                for(var k=0;k<grid.length;k++){
                    grid[k][i] = fianlRowsArr[k];
                }
            }
        }
    },
    //合并行
    combineCols: function (arr,direction){
        //去掉某一个数组中的空元素
        var newArr=[];//去掉空元素的数组
        for(var i=0;i<arr.length;i++){
            if(arr[i]['num']!=""){
                newArr[newArr.length] = arr[i];
            }
        }
        
        //合并相同的数值
        if (newArr.length>0){
            var newArr1 = this.combineData(newArr, direction);
        }else{
            var newArr1=[];
        }
        
        var newArr2=[];
        for (var i = 0; i < newArr1.length; i++) {
            if (newArr1[i]['num'] != "") {
                newArr2[newArr2.length] = newArr1[i];
            }
        }
        newArr = newArr2;

        var length = 4 - newArr.length;
        var nullArr = [];
        for (var i = 0; i < length; i++) {
            nullArr.push({ num: "", flag: false });
        }
        if (direction == 1 || direction == 2){
            //左合并
            arr = nullArr.concat(newArr);
        } else if (direction == 3 || direction == 0){
            //右合并
            arr = newArr.concat(nullArr);
        }
        return arr;
    },
    
    
    //合并相同的数据
    combineData: function (newArr,direction){
        if (direction == 1 || direction == 2) {
            newArr = newArr.reverse();
        }
        for(var i=0;i<newArr.length;i++){
            for (var j = i+1; j < newArr.length; j++) {
                if (i == j-1 && newArr[i]['num'] == newArr[j]['num']){
                    newArr[i]['num'] = newArr[i]['num']*2;
                    newArr[j]['num']="";
                    break;
                }
            }
        }
        if (direction == 1 || direction == 2) {
            newArr = newArr.reverse();
        }
        
        return newArr;
    }
}

module.exports = Move;