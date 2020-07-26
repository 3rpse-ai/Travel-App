import { validateForm } from '../client/js/formValidator'
import { TestScheduler } from 'jest';

describe("Testing the validation functionality", () => {
    test("Testing the validateForm() function", () => {
        expect(validateForm("superLongText")).toBe(false);
    })
})

