
import { addDays } from '../client/js/app'

describe("Testing the addDate functionality", () => {
    test("Testing the addDays(date) function", () => {
        let today = new Date();
        let tmrw = new Date(today);
        tmrw.setDate(tmrw.getDate() + 1)
        expect(addDays(today, 1)).toEqual(tmrw);
    })
})