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
