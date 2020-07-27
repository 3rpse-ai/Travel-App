const getData = require('../server/server')



describe('Test the get method', () => {
    test('It should response the GET method with a 200', () => {
        return getData("https://postman-echo.com/get?foo1=bar1&foo2=bar2").then(function(data){
        expect(data).toBeDefined();
    });
})});
