const moment = require('moment')

const date = moment()
date.add(1, 'year').subtract(9, 'months')
console.log(date.format('MMM Do, YYYY'))

// equivalent to new Date().getTime()
const someTimestamp = moment().valueOf()
console.log(someTimestamp)

const createdAt = 1234
// pass a timestamp to moment so it uses THAT time instead of the current time
const newDate = moment(createdAt)
console.log(newDate.format('h:mm a'))

