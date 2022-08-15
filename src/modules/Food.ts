// 定义 Food 类
class Food{
	element: HTMLElement
	constructor(){
		// 在最后加上！表示该元素一定不为空 => 避免报错
		// 获取页面中的food元素，并赋值给element
		this.element = document.querySelector(".food")!
	}
	/* 
		思考：food的功能？
		 1. 如何判断蛇吃到了食物 => 蛇的坐标与食物的一致
		//  2. food的位置移动 => 蛇吃完食物后，food移动到哪里？ 随机位置 Math.random
	*/
	// 需求一：获取食物所在页面坐标 (getter方法)
	// 获取food在页面的x坐标
	get foodX(){
		return this.element.offsetLeft
	}
	// 获取food在页面的y坐标
	get foodY(){
		return this.element.offsetTop
	}

	// 需求二： 随机移动food的位置
	change(){
		/* 生成一个随机位置，有两个注意的地方：
			1. 移动有范围，不能飞出舞台： 0 <= left和top <= 300-10 (food元素的width)
			2. 蛇每移动一格是10px，food坐标的移动也需要是10的倍数，否则会出现蛇永远吃不到食物的情况
			生成0-290随机数（且为10的倍数）
			Math.random() * 30 => 生成 大于0小于30 的随机数
			Math.floor 向下取整 => 取到0-29的整数，再*10，确保得到一个随机的0-290且为10的倍数的整数
		*/
		// 生成随机的 x , y 坐标
		let x = Math.floor(Math.random() * 30) * 10
		let y = Math.floor(Math.random() * 30) * 10
		// 赋值移动，记得加 px
		this.element.style.left = x + 'px'
		this.element.style.top = y + 'px'
	}
}

// 测试代码
// const food = new Food()
// console.log(food.foodX, food.foodY);
// // 调用food.change() 移动food的位置
// food.change()
// console.log(food.foodX, food.foodY);

export default Food