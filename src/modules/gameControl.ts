// 游戏控制器，控制其他所有类

// 引入其他类
import Snake from './Snake';
import Food from './Food';
import ScorePanel from './ScorePanel';

class GameControl {
  // 定义属性，整合其他几个类
  snake: Snake;
  food: Food;
  scorePanel: ScorePanel;
  // 存储按下键盘的按键
  direction: string = '';
  // 创建一个属性 记录蛇是否还活着（用于判断游戏是否结束）
  isLive: Boolean = true;

  constructor() {
    // 生成实例
    this.snake = new Snake();
    this.food = new Food();
    this.scorePanel = new ScorePanel(10, 2);
    // 实例创建后，游戏立刻开始
    // this.init()
  }

  // 游戏初始化方法，调用即游戏开始
  init() {
    // 绑定事件回调，键盘按下回调事件
    /* 		
			this.keydownHandler 这个this原本代表的是document，因为是document调用的这个函数
			但是由于该回调需要将GameComtrol内的direction属性修改，因此需要使用bind()将事件对象this绑定为当前GameControl实例对象
			- bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。 
			参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
		*/
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    // 调用run() 让蛇在页面中根据玩家按下的方向移动
    this.run();
  }

  // 单独定义一个键盘事件回调，需要时直接调用
  keydownHandler(event: KeyboardEvent) {
    // 赋值之前需要校验用户按下的按键是否是方向按键，检查event.key是否合法
    console.log(event.key);
    // 储存用户按下的按键方向，修改direction属性值
    this.direction = event.key;
  }

  // 定义控制蛇移动的方法（即改变蛇头的偏移量）
  run() {
    // 获取蛇的当前的坐标（由于已经创建了Snake的实例snake，因此可以直接调用Snake类内的方法，这里是读取蛇当前坐标使用了Snake中的getter）
    let X = this.snake.snakeX;
    let Y = this.snake.snakeY;

    // 根据玩家按下的按钮方向，对蛇头的坐标进行修改
    /* 
			向上 top -10
			向下 top +10
			向左 left -10
			向右 right +10
		*/
    // 根据不同的情况，计算新的x，y坐标值（还没实现在页面中移动）
    switch (this.direction) {
      case 'ArrowUp':
      case 'Up':
        Y -= 10;
        break;
      case 'ArrowDown':
      case 'Down':
        Y += 10;
        break;
      case 'ArrowLeft':
      case 'Left':
        X -= 10;
        break;
      case 'ArrowRight':
      case 'Rights':
        X += 10;
        break;
    }

	// 确认是否吃到了食物，调一下checkEat()
	this.checkEat(X,Y)

    // 调用Snake类内的改变坐标的方法(Snake的setter)，将新的x,y坐标值改为蛇头新的坐标（令蛇在页面中移动）
    // 需要校验新坐标 (使用try catch捕获异常)
    try {
	  // 调用snake内的setter
      this.snake.snakeX = X;
      this.snake.snakeY = Y;
    } catch (error:unknown) {
      // 进入了catch 证明运行有异常
      alert(error);
      // 游戏结束
      this.isLive = false;
    }

    // 开启定时器
    // 使用bind()将this绑定为当前的GameControl，每个300ms调一次run()，实现游戏开始之后蛇一直动
    // 300 - (this.scorePanel.level - 1) * 30 => 使间隔的时间随level的升高而加快，可以自行设
    // 当蛇还活着的时候，蛇才继续运动
    this.isLive && setTimeout(this.run.bind(this), 300 - (this.scorePanel.level - 1) * 30);
  }

	// 定义一个方法(传入蛇的新坐标)确认蛇是否吃到了食物，进行以下步骤：
	/* 
		1. 判断坐标：蛇的新坐标与食物的坐标一致，则是吃到了食物
		2. 蛇吃到了食物，则食物需要调用change()来更改食物坐标
		3. 计分牌加分
		4. 蛇的身体增加一节 
		用到哪个类的方法就找哪个类即可，OOP真的比较方便整洁 => 遵循谁的动作找谁设置方法的原则
	*/
	checkEat(X:number, Y:number){
		// return this.food.foodX === X && this.food.foodY === Y
		// 判断蛇和食物的坐标是否一致
		if (this.food.foodX === X && this.food.foodY === Y){
			// 如果food和snake的坐标一致，即吃到了食物
			console.log('吃到了食物');
			// 计分牌加分
			this.scorePanel.addScore()
			// 食物位置移动
			this.food.change()
			// 蛇加长一节
			this.snake.addBody()
		}
	}
}

export default GameControl;
