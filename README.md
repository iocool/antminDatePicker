# 支付宝小程序日期选择组件

最近在做支付宝小程序(以下简称小程序)开发,发现小程序的日期选择组件很不好用,比如安卓和IOS设备上,样式明显不同,因为小程序调用该组件是调用系统原生组件,所以会有一定的差异,另外,小程序提供的日期组件并不满足我当前的业务需求:


1. 该日期为快递上门时间.

2. 用户只可选择的日期范围,当日往后 `2` 天(即 `今天`, `明天` )的日期,并且时间选择为早上 `9` 点至下午 `18` 点间的 `10` 个小时整点时间.

3. 由于是快递上门,所以可选择的时间点为当前时间点 `2` 小时后(比如,现在时间是11点,用户可选择的最早时间为13点).

4. 如果当前时间晚于下午 `18` 点,则用户应该可以看到 `明天` 及 `后天` `2` 天的时间点.


针对以上需求,借助小程序的 `picker-view` 组件,进行了二次封装.

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

