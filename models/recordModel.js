const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    key: String,
    createdAt: Date,
    counts: Array
});

module.exports = mongoose.model('Records', recordSchema);