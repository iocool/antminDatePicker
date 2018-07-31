# 支付宝小程序日期选择组件datePicker封装

最近在做支付宝小程序(以下简称小程序)开发,发现小程序的日期选择组件很不好用,比如安卓和IOS设备上,样式明显不同,因为小程序调用该组件是调用系统原生组件,所以会有一定的差异,另外,小程序提供的日期组件并不满足我当前的业务需求:

1. 该日期为快递上门时间.

2. 用户只可选择的日期范围,当日往后 `2` 天(即 `今天`, `明天` )的日期,并且时间选择为早上 `9` 点至下午 `18` 点间的 `10` 个小时整点时间.

3. 由于是快递上门,所以可选择的时间点为当前时间点 `2` 小时后(比如,现在时间是11点,用户可选择的最早时间为13点).

4. 如果当前时间晚于下午 `18` 点,则用户应该可以看到 `明天` 及 `后天` `2` 天的时间点.


针对以上需求,借助小程序的 `picker-view` 组件,进行了二次封装,以下是封装后的组件.

### 示例

<p align="center"><img src="https://user-gold-cdn.xitu.io/2018/7/31/164f01df6240d3e6?w=338&h=600&f=gif&s=471765" /></p>

### 项目结构

```
.
├── README.md
├── app.acss
├── app.js
├── app.json
├── components                      // 组件目录
│   └── dateTimePicker              // 日期组件目录
│       ├── datePickerBase.js       // 基础 js 文件,需在使用文件中引入
│       ├── dateTimePicker.acss     // 组件默认样式,除非特殊需要,一般不用修改
│       ├── dateTimePicker.axml     // 组件默认结构
│       ├── dateTimePicker.js       // 组件 js 
│       ├── dateTimePicker.json     // 组件配置信息
│       └── js
│           ├── handleDateArr.js    // 日期数组处理的 js ,用以生成所需的日期数组
│           └── moment.min.js       // 时间生成使用 moment.js
│
└── pages                         // 示例目录
    └── index
        ├── index.acss
        ├── index.axml
        ├── index.js
        └── index.json

```

### 使用说明

支付宝小程序的组件引用方法,及使用说明,可参照 支付宝 [使用自定义组件](https://docs.alipay.com/mini/framework/use-custom-component) 查看,也可参照本示例中 `pages/index` 下的使用方法.


`pages/index/index.json` 需配置 `usingComponents`, 填写组件路径

```json
{
    "defaultTitle": "日期选择picker demo",
    "usingComponents": {
        "picker": "../../components/dateTimePicker/dateTimePicker"
    }
}
```

`pages/index/index.js` 引入基础文件,详细配置及使用说明,参照 `js` 文件内容

```js

// 引入基础初始
import datePicker from '../../components/dateTimePicker/datePickerBase'

```

`pages/index/index.axml` 使用 `picker` 组件

```html
<picker
        title="{{datePicker.title}}"
        class="{{datePicker.class}}"
        visible="{{datePicker.visible}}"
        onHidePicker="hidePicker"
        onConfirm="onConfirm"
        pickerValue="{{datePicker.defaultValue}}"
/>
```

其中


```
title           // 组件标题
class           // 组件样式,可以自定义
visible         // 组件显示/隐藏
onHidePicker    // 隐藏该组件的事件
onConfirm       // 点击组件弹窗确定后的事件,onConfirm(str),其中 str 为最终回调的参数,可取到 picker 的值
pickerValue     // 默认参数,用来初始的时候用,传入数据是 picker 的索引值,默认(0,0),即 默认选中两列 picker 的第一项
```


### 一些其他的说明

1. 组件的封装过程中,由于采用的是支付宝的 `picker-view` 所以在界面上没有花过多的时间,主要可能还是日期时间数组的生成需要处理一下,借助了 `moment.js` 库,对于时间处理上还是很方便的,以下是对处理日期数组 `handleDateArr.js` 的代码说明.

```js

// 依赖于 moment.js
const Moment = require('./moment.min')

/**
 * 生成日期时间数组
 * @param dayLength // 要生成的天数时长,不传的话,默认生成 1 天
 * @param timeSection // 时间区间,默认 10 , 可下单区间早上9点到下午6点,可下单时间在当前小时后2小时
 */
function getDaysArr(dayLength, timeSection){
  let _daysArr = [[],[]]
  let _dayLength = dayLength || 1
  const _timeSection = timeSection || 10
  const _nowHour = Moment().format('HH')  // 当前时间 小时
  const _expressHour = parseInt(_nowHour) + 2 // 可下单时间,当前时间 +2
  const _earlyHour = 9  // 最早时间
  const _endHour = 19 // 截止时间

  for(let i = 0; i < _dayLength; i++){

    // 当天时间处理
    if( i === 0){

      if(_expressHour <= _earlyHour ){

        // 早于早上 9点时
        _daysArr[1].push(getHoursArr(_earlyHour, _timeSection))

        // 处理日期
        _daysArr[0].push(Moment().add(i, 'days').format('YYYY-MM-DD'))

      } else if( _expressHour > _earlyHour && _expressHour < _endHour){

        // 晚于早上 9 点, 早于下午 18 点之前
        _daysArr[1].push(getHoursArr(_expressHour, (_endHour - _expressHour)))
        // 处理日期
        _daysArr[0].push(Moment().add(i, 'days').format('YYYY-MM-DD'))
      } else if ( _expressHour >= _endHour && _expressHour < 24){

        // 超过晚上 19 点之后,日期天数增加一天
        _dayLength++

      }

    } else {
      // 其他日期时间处理

      // 早于早上 9点时
      _daysArr[1].push(getHoursArr(_earlyHour, _timeSection))
      // 处理日期
      _daysArr[0].push(Moment().add(i, 'days').format('YYYY-MM-DD'))
    }

  }

  /**
   * 获取小时时间数组
   * @param nowHour // 当前小时
   * @param hoursLength // 小时区间长度
   */
  function getHoursArr(nowHour, hoursLength) {
    let _hoursArr = []
    for(let j = 0 ; j < hoursLength; j++){
      _hoursArr.push(`${nowHour + j}:00:00`)
    }
    return _hoursArr
  }

  return _daysArr
}

module.exports = {
  getDaysArr
}

```

2. 在 `dateTimePicker.js` 文件中使用 `handleDateArr.js` 的方法

```js

...

const { getDaysArr } = require('./js/handleDateArr');   // 引入处理函数

Component({
  data: {
    ...
  },
  methods: {

    // 获取日期数据
    doGetDaysArr() {
      this.setData({
        dateTimeData: getDaysArr(2)     // 传入参数,需返回的日期天数,2天
      });
    }
  }
});
...

```

以上就是该组件的基本说明,代码相对比较简单,觉得可以给目前在做支付宝小程序并有相关需要的童鞋参考一下.

