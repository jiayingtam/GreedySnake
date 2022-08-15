class Snake {
	// 表示蛇头元素
	head: HTMLElement
	// 表示蛇身元素（包括蛇头）
	body: HTMLCollection
	// 获取蛇容器
	snakeContainer: HTMLElement

	// 给 head 和 body 赋值
	constructor(){
		// 蛇容器
		this.snakeContainer = document.getElementById('snake')!
		// 蛇下的第一个div为蛇头 （querySelector只会取到第一个符合条件的元素) 并直接断言为HTMLElement
		this.head = document.querySelector('#snake>div') as HTMLElement
		// 蛇容器下的所有div为整条蛇（包括蛇头）
		this.body = this.snakeContainer.getElementsByTagName('div')
	}

	// 获取蛇的坐标 （其实就是头的坐标）
	// x轴坐标
	get snakeX():number{
		return this.head.offsetLeft
	}
	// y轴坐标
	get snakeY():number{
		return this.head.offsetTop
	}

	// 更改蛇头的坐标（这个跟事件有关系，需要触发事件去更改蛇的坐标）
	/* 
		注意蛇头的坐标范围：
		1. x,y轴坐标不能超过游戏stage范围（0-290）
		2. 坐标均为10的倍数
		3. 坐标为随机生成 Math.random 
		4. 在本游戏中，蛇每次移动其实只会移动x或y其中一个值，而不会同时修改x和y（蛇不会斜着走）
 	*/
	set snakeX(newX:number){
		// 传入的newX值 === 原来的x值就不需要再往下执行，蛇每次只移动x或者移动y
		if(this.snakeX === newX) return 
		// 校验newX的范围是否合法, 符合才可以修改，否则就是蛇撞墙了
		if (newX < 0 || newX > 290){
			// 蛇撞墙 游戏结束
			throw new Error('蛇撞墙了')
		}

		// 禁止水平方向上掉头
		/* 
			如何判断蛇掉头了？
			- (这时蛇在左右移动，只有x轴坐标在动，y轴坐标是不动的)，如果传进来的新x坐标（即第一节新的蛇头x坐标）与body的第二节x坐标一致了 => 证明蛇在往回走
			- 注意排除只有一个蛇头时的情况（只有蛇头时是可以随便移动的）
		*/
		if (this.body.length > 1 && (this.body[1]as HTMLElement).offsetLeft === newX){
			// this.body.length > 1 将只有蛇头的这个情况给排出在外，或也可以写成 this.body[1] => 即有蛇的第二节身体的情况
			// console.log('蛇在水平方向上掉头');
			// 如果发生了掉头，让蛇往反方向（原来的方向）继续移动，注意往右走是x增大，往左走是x减小
			if(newX > this.snakeX){
				// 如果是在向左走的过程中向右掉头的情况（传入的newX就会大于原来的蛇头位置） 
				newX = this.snakeX - 10 // 新的位置 = 蛇头原来的位置 - 10 => 实现禁止掉头，继续往左走
			} else {
				// 反之如果是在向右走的过程中，往左掉头，传入的newX就会小于原来的位置
				newX = this.snakeX + 10 // 增大传入newX坐标，继续向右走
			}
		}

		// 移动身体
		this.moveBody()
		// 更新蛇头的X坐标
		this.head.style.left = newX + 'px'
		// 在蛇头的坐标更新之后，判断蛇头有无撞到自己身体
		this.checkHeadBody()
	}
	
	set snakeY(newY:number){
		// 同x
		if (this.snakeY === newY) return 
		// 校验newX的范围是否合法, 符合才可以修改，否则就是蛇撞墙了
		if (newY < 0 || newY > 290){
			// 蛇撞墙 游戏结束
			throw new Error('蛇撞墙了')
		}

		// 禁止垂直方向上的掉头 (原理同禁止水平方向掉头)
		if (this.body.length > 1 && (this.body[1]as HTMLElement).offsetTop === newY){
			if(newY > this.snakeY){
				newY = this.snakeY - 10
			} else {
				newY = this.snakeY + 10
			}
		}
		// 先移动身体再移动头（从后往前移，最后移动头，如果先移动头再移动身体，则会第二节身体与蛇头坐标重叠）
		this.moveBody()
		// 更新蛇头的Y坐标
		this.head.style.top = newY + 'px'
		// 在蛇头的坐标更新之后，判断蛇头有无撞到自己身体
		this.checkHeadBody()
	}

	// 吃了食物之后会增加一格蛇body
	/* 
		！！insertAdjacentHTML() 方法将指定的文本解析为 Element 元素，并将结果节点插入到 DOM 树中的指定位置。
		语法：element.insertAdjacentHTML(position, text);
		position => 元素需要添加到什么位置
		text => HTML元素text
		参考： https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentHTML
	*/
	addBody(){
		// 向蛇容器中添加div(加到snake容器的最后，即beforeend)
		this.snakeContainer.insertAdjacentHTML('beforeend', '<div></div>')
	}

	// 添加一个整条蛇移动的方法
	/* 
		注意：从后往前移动，从最后一节往前移，否则蛇会断开。。。 
		原则：后面一节找到前面一节的位置，后面一节移动到前面一节的位置，一节一节往前移	
	*/
	moveBody(){
		// 遍历所有身体（从后往前遍历）头不需要改，因为前面单独设了蛇头位置的更高方法
		// 什么时候调用？在蛇头移动的同时移动身体，在setter内调
		// for 循环从最后一节往前遍历， i为index，最后一位的index为body.length - 1, 注意不是body.length
		for(let i = this.body.length - 1; i > 0; i--){
			// 获取前面一节身体的位置
			let X = (this.body[i-1] as HTMLElement).offsetLeft;
			let Y = (this.body[i-1] as HTMLElement).offsetTop;
			// 将该x y 设置给当前的一节蛇身(即后一节),使后面的一节蛇身往前面一节的位置移动(记得加‘px’，将number转为string)
			(this.body[i] as HTMLElement).style.left = X +'px';
			(this.body[i] as HTMLElement).style.top = Y +'px';
		}
	}

	// 检查头和身体坐标有无重合（蛇是否撞自己）
	checkHeadBody(){
		// 获取所有身体，检查是否与蛇头的坐标重合
		for(let i = 1; i < this.body.length; i++){
			// 从第二节开始遍历，第一节为蛇头
			// 获取每一节的 X,Y坐标
			let X  = (this.body[i] as HTMLElement).offsetLeft
			let Y  = (this.body[i] as HTMLElement).offsetTop
			// 每一节body(可以简化code)
			// let body = this.body[i] as HTMLElement
			if(this.snakeX === X  && this.snakeY === Y){
				// 相撞了，通知GameControl游戏结束
				throw new Error('蛇自撞！GAME OVER!')
			}
		}
	}
}


// 小细节问题：
/* 
	1. 蛇移动的顺序，从后往前移动，最后移动头
	2. 禁止蛇掉头 => 蛇在向左移动时不能往右走（按键不能是ArrowRight），其他方向同理
	3. 蛇碰到自己身体则游戏停止 => 检查蛇头的坐标有无跟蛇身体的坐标重合
*/

export default Snake