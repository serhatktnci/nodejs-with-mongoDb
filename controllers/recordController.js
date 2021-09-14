var Record = require("../models/recordModel");
var moment = require("moment-timezone");
var ServiceResult = require("../utils/serviceResult");
const dateFormat = 'YYYY-MM-DD';


module.exports.getRecords = function(req, res, next) {
  var sr = new ServiceResult();
  var dateCriteria = {};
  var countCriteria = {};
  var aggregation = [];
  try {
      if(validateReq(req, sr)) {
        if ( typeof req.body.startDate !== "undefined" || typeof req.body.endDate !== "undefined" ) {
            dateCriteria.$match = { "createdAt": {}};
          if (typeof req.body.startDate !== "undefined") {
            dateCriteria.$match.createdAt.$gte = moment.tz(req.body.startDate, 'Europe/London').startOf("day").toDate()
          }
          if (typeof req.body.endDate !== "undefined") {
            dateCriteria.$match.createdAt.$lte = moment.tz(req.body.endDate, 'Europe/London').endOf("day").toDate()
          }
          aggregation.push(dateCriteria);
        }
        aggregation.push({ "$unwind": "$counts" });
        aggregation.push({
            "$group": {
                "_id": "$_id", 
                "totalCount": {
                    "$sum": "$counts"
                },
                "createdAt": {
                    "$max": "$createdAt"
                }
                ,
                "key": {
                    "$max": "$key"
                }
            }
        });
        
        if ( typeof req.body.minCount !== "undefined" || typeof req.body.maxCount !== "undefined" ) {
            countCriteria.$match = { totalCount: {}};
          if (typeof req.body.minCount !== "undefined") {
            countCriteria.$match.totalCount.$gte = req.body.minCount;
          }
          if (typeof req.body.maxCount !== "undefined") {
            countCriteria.$match.totalCount.$lte = req.body.maxCount;
          }
          aggregation.push(countCriteria);
        }
        aggregation.push({ 
            "$project": {
            "_id" : 0,
            "totalCount": 1,
            "createdAt": 1,
            "key": 1
        }} );
        Record.aggregate(aggregation).then(results => {
                sr.records = results;
                res.json(sr);
        }).catch(err => {
            sr.code = ServiceResult.ERROR_SYSTEM;
            sr.msg = err;
        });
      } else {
          res.status(400).json(sr);
      }
    
  } catch (error) {
      sr.code = ServiceResult.ERROR_SYSTEM;
      sr.msg = 'Unexpected Error';
      res.status(503).json(sr);
  }
};


function validateReq(req, sr) {
    if(req.body.startDate && moment(req.body.startDate, dateFormat).format(dateFormat) !== req.body.startDate) {
        sr.code = ServiceResult.ERROR_INVALID_PARAMETER
        sr.msg = 'startDate should be ' + dateFormat + ' format'
        return false;
    }
    if(req.body.endDate && moment(req.body.endDate, dateFormat).format(dateFormat) !== req.body.endDate) {
        sr.code = ServiceResult.ERROR_INVALID_PARAMETER
        sr.msg = 'endDate should be ' + dateFormat + ' format'
        return false;

    }
    if((req.body.minCount && typeof req.body.minCount !== 'number') && (req.body.maxCount && typeof req.body.maxCount !== 'number')) {
        sr.code = ServiceResult.ERROR_INVALID_PARAMETER
        sr.msg = 'minCount and maxCount should be number'
        return false;

    }
    if(req.body.minCount && typeof req.body.minCount !== 'number') {
        sr.code = ServiceResult.ERROR_INVALID_PARAMETER
        sr.msg = 'minCount should be number'
        return false;

    }
    if(req.body.maxCount && typeof req.body.maxCount !== 'number') {
        sr.code = ServiceResult.ERROR_INVALID_PARAMETER
        sr.msg = 'maxCount should be number'
        return false;

    }
    return true;
}