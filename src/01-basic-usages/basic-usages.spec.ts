import { occurError, sum } from "./logic";

describe("[Chapter 01] 기본적인 사용방법", () => {
    test("긍정 일치 테스트", () => {
        const actual = sum(1, 2);
        const expected = 3;

        //
        // Assert that (1 + 2 === 3)
        expect(actual).toBe(expected);
    });

    test("부정 일치 테스트", () => {
        const actual = sum(1, 2);
        const expected = "12";

        //
        // Assert that (1 + 2 !== "12")
        expect(actual).not.toBe(expected);
    });

    test("비동기 함수 테스트", async () => {
        const asyncSum = (a: number, b: number) => Promise.resolve(sum(a, b));
        const actual = await asyncSum(3, 4);
        const expected = 7;
        expect(actual).toBe(expected);
    });

    test("에러가 발생해야만 하는 동기 함수 테스트", () => {
        expect(() => occurError()).toThrow(); // 어떤 에러에도 매칭됨
        expect(() => occurError()).toThrow("My Error"); // 메세지가 "My Error"인 에러에만 매칭됨
    });

    test("에러가 발생해야만 하는 비동기 함수 테스트", async () => {
        await expect(async () => occurError()).rejects.toThrow(); // 어떤 에러에도 매칭됨
        await expect(async () => occurError()).rejects.toThrow("My Error"); // 메세지가 "My Error"인 에러에만 매칭됨
    });
});
