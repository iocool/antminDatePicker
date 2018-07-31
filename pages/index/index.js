// 引入基础初始
import datePicker from '../../components/dateTimePicker/datePickerBase'

Page({
  data: {
    // 日期组件的初始数据
    datePicker: {
      title: '时间选择',  // picker 的标题
      visible:false,  // 初始隐藏
      class:[], // 样式名
      defaultValue:[0, 0] // 默认参数,用来初始的时候用,传入数据是 picker 的索引值,默认(0,0),即 默认选中两列 picker 的第一项
    },
    // 选择后的时间字符串信息
    dateStr: '请选择日期'
  },

  // 显示日期选择 picker
  showPicker () {
    datePicker.show()
  },

  // 关闭日期选择 picker
  hidePicker() {
    datePicker.hide()
  },

  /** 点击日期 picker 确定后的事件
   *  @param date   // 返回的选中时间 字符串 
   */
  onConfirm(date){
    
    this.setData({
      dateStr: date
    })

  },

  onLoad() {
   
    // 日期组件初始
    datePicker.init()
  }
});
