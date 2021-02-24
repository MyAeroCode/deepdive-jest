import * as logic from "./logic";

describe("[Chapter 03] 함수에 대해 테스팅하기", () => {
    const sumSpy = jest.spyOn(logic, "sum");
    const throwOrReturnSpy = jest.spyOn(logic, "throwOrReturn");

    //
    // 테스트마다 기존의 함수호출이력 삭제
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("호출인자, 호출횟수 검증", () => {
        logic.sum(10, 20);
        logic.sum(20, 40);
        logic.sum(30, 60);

        //
        // 함수가 최소 1번은 호출되었음.
        expect(sumSpy).toHaveBeenCalled();

        //
        // 함수가 정확히 3번 호출되었음.
        expect(sumSpy).toHaveBeenCalledTimes(3);

        //
        // 아래의 인자를 가지고 실행된 적이 있음.
        expect(sumSpy).toHaveBeenCalledWith(10, 20);
        expect(sumSpy).toHaveBeenCalledWith(20, 40);
        expect(sumSpy).toHaveBeenCalledWith(30, 60);

        //
        // 마지막 호출은 아래의 인자를 가지고 호출되었음.
        expect(sumSpy).toHaveBeenLastCalledWith(30, 60);

        //
        // n번째 호출은 아래의 인자를 가지고 호출되었음.
        expect(sumSpy).toHaveBeenNthCalledWith(1, 10, 20);
        expect(sumSpy).toHaveBeenNthCalledWith(2, 20, 40);
        expect(sumSpy).toHaveBeenNthCalledWith(3, 30, 60);

        //
        // spy 내부의 mock 프로퍼티를 통해서도 대체할 수 있음.
        expect(sumSpy.mock.calls).toEqual([
            [10, 20],
            [20, 40],
            [30, 60],
        ]);

        expect(sumSpy.mock.results).toEqual([
            { type: "return", value: 30 },
            { type: "return", value: 60 },
            { type: "return", value: 90 },
        ]);
    });

    test("함수의 호출결과 검증", () => {
        const params: [any, "throw" | "return"][] = [
            ["a", "throw"],
            ["b", "return"],
            ["c", "throw"],
            ["d", "return"],
        ];

        for (const param of params) {
            try {
                logic.throwOrReturn(...param);
            } catch {}
        }

        //
        // 리턴이 1번 이상 발생하였음.
        expect(throwOrReturnSpy).toHaveReturned();

        //
        // 리턴이 정확히 2번 발생하였음.
        expect(throwOrReturnSpy).toHaveReturnedTimes(2);

        //
        // "b", "d"는 리턴되었던 적이 있음.
        expect(throwOrReturnSpy).toHaveReturnedWith("b");
        expect(throwOrReturnSpy).toHaveReturnedWith("d");

        //
        // "a", "c"는 리턴되었던 적이 없음.
        expect(throwOrReturnSpy).not.toHaveReturnedWith("a");
        expect(throwOrReturnSpy).not.toHaveReturnedWith("c");

        //
        // spy 내부의 mock 프로퍼티를 통해서도 대체할 수 있음.
        expect(throwOrReturnSpy.mock.results).toEqual([
            { type: "throw", value: Error("a") },
            { type: "return", value: "b" },
            { type: "throw", value: Error("c") },
            { type: "return", value: "d" },
        ]);
    });

    test("서로다른 함수의 실행순서 검증", async () => {
        function buildTimerPromise(willResolve: () => void, ms: number) {
            return new Promise((resolve) => {
                const resolved = willResolve();
                setTimeout(() => resolve(resolved), ms);
            });
        }

        await Promise.all([
            buildTimerPromise(() => logic.sum(1, 2), 100),
            buildTimerPromise(() => logic.sum(3, 4), 200),
            buildTimerPromise(() => logic.sum(5, 6), 300),
            buildTimerPromise(() => logic.sum(7, 8), 400),
            buildTimerPromise(() => logic.throwOrReturn("x", "return"), 999),
        ]);

        //
        // sum은 4번, throwOrReturn은 1번만 실행됨.
        expect(sumSpy).toHaveBeenCalledTimes(4);
        expect(throwOrReturnSpy).toHaveBeenCalledTimes(1);

        //
        // sum과 throwOrReturn의 실행순서가 저장되어 있음.
        // 순서가 1부터 시작하지 않는 것은 jest.clearAllMock()를 실행해도 count가 초기화되지 않기 때문.
        expect(sumSpy.mock.invocationCallOrder).not.toEqual([1, 2, 3, 4]);
        expect(throwOrReturnSpy.mock.invocationCallOrder).not.toEqual([5]);

        //
        // 따라서 invocationCallOrder는 상대적으로 검증해야 함.
        // 예를 들어, 모든 sum은 throwOrReturn보다 상대적으로 먼저 실행됨.
        const maxSumOrder = Math.max(...sumSpy.mock.invocationCallOrder);
        const torOrder = throwOrReturnSpy.mock.invocationCallOrder[0];
        expect(maxSumOrder).toBeLessThan(torOrder);
    });
});
