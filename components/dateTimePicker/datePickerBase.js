class datePicker {

  // 组件初始
  init() {
    this.page = getCurrentPages()[getCurrentPages().length - 1]
    const setData = this.page.setData.bind(this.page)
    this.setData = setData;
  }

  // 组件显示
  show() {
    this.setData({
      'datePicker.visible':true,
      'datePicker.class':['datepicker-animation-fade-in','datepicker-animation-slide-up']
    })
  }

  // 隐藏
  hide() {
    this.setData({
      'datePicker.class':['datepicker-animation-fade-out','datepicker-animation-slide-down']
    })
    
    let _this = this;
    setTimeout(()=>{
      _this.setData({
        'datePicker.visible':false
      })
    },300)
  }

}

export default new datePicker()
