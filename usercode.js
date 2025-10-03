// usercode.js
const { handle } = require('./wrap');   // ваш робочий wrap.js з бізнес-логікою
exports.handle = handle;                // варіант 1
module.exports = { handle };            // варіант 2 (обидва лишаємо)