// 引入样式
import './style/index.less'

// 引入不同的类
import GameControl from './modules/gameControl'

// 创建游戏
const game = new GameControl()
// 游戏开始
game.init()