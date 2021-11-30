const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// console.log(Schema);
// Create Schema
const AssetSchema = new Schema({
   data: {
       type: Object       
   },
   id: {
       type: Schema.Types.ObjectId
   }
});

module.exports = Assets = mongoose.model("assets", AssetSchema);
