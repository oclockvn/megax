const uniqueId = require('lodash/uniqueId')

const uid = () => {
  return Number(uniqueId())
}

export default {
  uid,
}
