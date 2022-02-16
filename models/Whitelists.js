const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// console.log(Schema);
// Create Schema
const WhitelistSchema = new Schema({   
   wallet: {
       type: String,
       require: true
   },
   email: {
       type: String,
       require: true
   },
   confirmed: {
       type: Number,
       default: 0
   }
});

module.exports = Whitelists = mongoose.model("whitelist", WhitelistSchema);
