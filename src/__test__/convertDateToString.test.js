import { convertDateToString } from '../client/js/app'

describe("Testing the convertDate functionality", () => {
    test("Testing the convertDateToString() function", () => {
        expect(convertDateToString(new Date("2000-07-14"))).toBe("2000-07-14");
    })
})

