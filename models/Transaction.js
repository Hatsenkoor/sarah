const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// console.log(Schema);
// Create Schema
const TransactionSchema = new Schema({
   operation: {
       type: String,
       required: true
   },
   outputs: {
       type: Array
   },
   inputs: {
        type: Array
   },
   id: {
       type: Schema.Types.ObjectId
   }
});

module.exports = Transaction = mongoose.model("transactions", TransactionSchema);
