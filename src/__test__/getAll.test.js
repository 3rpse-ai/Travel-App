const getNewsData = require('../server/index')

describe('Test the get method', () => {
    test('It should response the GET method with a 200', () => {
        return getNewsData("https://api.aylien.com/news/autocompletes?type=source_names&term=test").then(response => {
            expect(response).toBeDefined();
        });
        //const data = await getNewsData("https://api.aylien.com/news/autocompletes?type=source_names&term=test");
        //expect(data).toBeDefined();
    });
});


