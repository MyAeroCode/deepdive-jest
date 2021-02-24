import * as getter from "./httpGetter";
import calc from "./calc";

//
// "./calc" defaultExport의 모든 멤버함수를 모조화함.
jest.mock("./calc");

describe("[Chapter 04] 모조품 다루기", () => {
    //
    // 매 테스트 이후에 호출이력이 초기화되어야 한다.
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("모조 함수를 생성하는 방법", () => {
        //
        // 비어있는 모조함수 생성
        const emptyMockFunc = jest.fn();
        expect(emptyMockFunc).toHaveProperty("mock");

        //
        // 기존의 함수로 모조함수 생성
        const spyMockFunc = jest.spyOn(getter.googleGetter, "httpGetRequest");
        expect(spyMockFunc).toHaveProperty("mock");
    });

    test("모조 함수에 구현 덮어씌우기", async () => {
        const mockFunc = jest.fn();

        //
        // 모조함수를 실행하면, 내부에 저장된 로직이 실행됩니다.
        // 이 때, 비어있는 모조함수를 실행하면 undefined가 반환됩니다.
        mockFunc();
        expect(mockFunc).toHaveLastReturnedWith(undefined);

        //
        // 값을 계산하는 로직으로 덮어씌울 수 있습니다.
        // once는 큐로 관리되며, 우선적으로 처리됩니다.
        mockFunc.mockImplementation(() => "a");
        mockFunc.mockImplementationOnce(() => "a-1");
        mockFunc.mockImplementationOnce(() => "a-2");
        expect(mockFunc()).toBe("a-1");
        expect(mockFunc()).toBe("a-2");
        expect(mockFunc()).toBe("a");
        expect(mockFunc()).toBe("a");

        //
        // 값을 반환하는 로직으로 덮어씌울 수 있습니다.
        // once는 큐로 관리되며, 우선적으로 처리됩니다.
        mockFunc.mockReturnValue("b");
        mockFunc.mockReturnValueOnce("b-1");
        mockFunc.mockReturnValueOnce("b-2");
        expect(mockFunc()).toBe("b-1");
        expect(mockFunc()).toBe("b-2");
        expect(mockFunc()).toBe("b");
        expect(mockFunc()).toBe("b");

        //
        // 눈치채셨겠지만 영속적인 로직 설정을 반복하면,
        // 후행 기록으로 덮어쓰여집니다.
        mockFunc.mockImplementation(() => "c");
        mockFunc.mockReturnValue("d");
        expect(mockFunc()).toBe("d");
        expect(mockFunc()).toBe("d");

        //
        // 일시적인 로직 설정을 반복하면,
        // 큐에 저장된 순서대로 실행됩니다.
        mockFunc.mockImplementationOnce(() => "e-1");
        mockFunc.mockReturnValueOnce("e-2");
        expect(mockFunc()).toBe("e-1");
        expect(mockFunc()).toBe("e-2");

        //
        // 비동기도 가능합니다.
        mockFunc.mockResolvedValueOnce("f-resolved");
        mockFunc.mockRejectedValueOnce("f-rejected");
        await expect(mockFunc()).resolves.toBe("f-resolved");
        await expect(mockFunc()).rejects.toBe("f-rejected");

        //
        // MockFunc.mockReset()은 영속적인 로직, 일시적인 로직, 호출 이력을 모두 제거합니다.
        mockFunc.mockImplementation(() => "g-1");
        mockFunc.mockImplementationOnce(() => "g-2");
        mockFunc.mockImplementationOnce(() => "g-3");
        mockFunc.mockReset();
        expect(mockFunc()).toBe(undefined);
    });

    test("어떤 객체의 특정 멤버함수를 모조품으로 대체하기", async () => {
        //
        // httpGetRequest를 axios를 사용하지 않는 대체 로직으로 변경한다.
        // 단, 모조할 함수는 최상위여서는 안된다.
        const httpGetRequestSpy = jest
            .spyOn(getter.googleGetter, "httpGetRequest")
            .mockImplementation(async (url) => `mock[${url}]`);

        //
        // httpGetGoogle은 모조된 httpGetRequest를 사용한다.
        await expect(getter.googleGetter.httpGetGoogle("gmail")).resolves.toBe(
            `mock[https://google.com/gmail]`,
        );

        //
        // 모조된 함수이므로 호출이력을 추적할 수 있다.
        expect(getter.googleGetter.httpGetRequest).toBeCalled();

        //
        // mockRestore()을 사용하면 원래 로직으로 복구된다.
        httpGetRequestSpy.mockRestore();
        await expect(
            getter.googleGetter.httpGetGoogle("gmail"),
        ).resolves.not.toBe(`mock[https://google.com/gmail]`);
    });

    test("어떤 모듈의 함수들을 전부 빈 모조함수로 변환하기", () => {
        //
        // 최상단에서 jset.mock(moduleName)을 입력하면,
        // 해당 모듈의 defaultExport된 객체에 존재하는 모든 멤버함수가 빈 모조함수로 변환됨.
        expect(calc.sum).toHaveProperty("mock");
        expect(calc.sum(1, 5)).toBe(undefined);

        //
        // 깊이 있는 멤버함수도 변환됨.
        expect(calc.advanced.log2).toHaveProperty("mock");
        expect(calc.advanced.log2(10)).toBe(undefined);

        //
        // 익명함수도 예외는 아님.
        expect(calc.advanced.lambdaLog2).toHaveProperty("mock");
        expect(calc.advanced.lambdaLog2(10)).toBe(undefined);
    });
});
