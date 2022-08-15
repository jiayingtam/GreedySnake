// 定义计分牌类
class ScorePanel{
	// 用于记录score和level的值，直接赋默认值，ts会判断类型
	score = 0 
	level = 1

	// score和level的元素，在构造函数中赋值
	scoreElement:HTMLElement
	levelElement:HTMLElement

	// 设置等级上限
	maxLevel:number
	// 设置一个变量，确认每N分升一级
	upgradeScore:number

	constructor(maxLevel:number = 10, upgradeScore: number = 10){
		this.scoreElement = document.querySelector('#score')!
		this.levelElement = document.querySelector('#level')!
		this.maxLevel = maxLevel // 设了默认值为10，不传入参数则为10级为满级
		this.upgradeScore = upgradeScore // 设了默认值为10,不传入则是每10分升一级
	}
	
	// 定义一个加分的方法
	addScore(){
		// 分数自增 
		this.score += 1
		// 显示到DOM中 => 注意innerHTML内是字符串
		// this.scoreElement.innerHTML = (this.score).toString()
		this.scoreElement.innerHTML = this.score + '' // 加上空字符串 => 强制将类型转换为 string
		// 判断分数
		if(this.score % this.upgradeScore === 0){
			// 升级条件 => 每获得N分升一级(传入参数，默认为每10分升一级)
			this.levelUp()
		}
	}

	// 定义一个升级的方法
	// 1. 等级可以设一个上限
	// 2. 升级条件(可以设成每N分升一级)
	levelUp(){
		// 满级则不再升级
		if (this.level < this.maxLevel){
			this.level++
			this.levelElement.innerHTML = this.level + '' 
		}
	}
}

// 测试代码
// 创建实例，并传入满级级数，以及每几分升一级
// const score = new ScorePanel(150, 2)
// for(let i = 0; i < 200; i++){
// 	score.addScore()
// }

export default ScorePanel