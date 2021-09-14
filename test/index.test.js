const request = require('supertest');
const app = require('../app.js')
describe('Test getRecords', () => {
    test('It should response the POST method', () => {
        return request(app).post("/getRecords").then(response => {
            expect(response.statusCode).toBe(200)
            expect(response.body.code).toBe(0);
            expect(response.body.msg).toBe('Success');

        }).catch(err => {
            console.log(err);
        })
    });

    test('It should not response the GET method', () => {
        return request(app).get("/getRecords").then(response => {
            expect(response.statusCode).toBe(404)
        }).catch(err => {
            console.log(err);
        })
    });

    test('It should minCount and maxCount required number', () => {
        return request(app).post("/getRecords").send({"minCount": "3000", "maxCount": "3500"}).then(response => {
            expect(response.body.code).toBe(11);         
        }).catch(err => {
            console.log(err);
        })
    });


    test('It startDate and endDate should be YYYY-MM-DD format', () => {
        return request(app).post("/getRecords").send({"startDate": "01-26-2016", "endDate": "02-02-2018"}).then(response => {
            expect(response.body.code).toBe(11);         
        }).catch(err => {
            console.log(err);
        })
    });


    test('It should greater or equal 3000 and less than or equal 3500 response the POST method', () => {
        return request(app).post("/getRecords").send({"minCount": 3000, "maxCount": 3500}).then(response => {
            if(response.body.records){
                response.body.records.map(record=> {
                    expect(record.totalCount).toBeLessThanOrEqual(3500);
                    expect(record.totalCount).toBeGreaterThanOrEqual(3000);
                });
            }
        }).catch(err => {
            console.log(err);
        })

    });

})
