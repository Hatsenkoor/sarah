const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// console.log(Schema);
// Create Schema
const MetadataSchema = new Schema({
   metadata: {
       type: Object       
   },
   id: {
       type: Schema.Types.ObjectId
   }
});

module.exports = Metadata = mongoose.model("metadata", MetadataSchema);
