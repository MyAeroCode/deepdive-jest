# Mock

## 모조 함수

### 모조 함수를 생성하기

비어있는 모조함수를 생성하려면 `jest.fn()`을 사용하고, 기존의 함수 위치에 모조함수를 생성하려면 `jest.spyOn()`을 사용합니다.

```ts
//
// 비어있는 모조함수 생성
const emptyMockFunc = jest.fn();
expect(emptyMockFunc).toHaveProperty("mock");

//
// 기존의 함수로 모조함수 생성
const spyMockFunc = jest.spyOn(obj, "httpGetRequest");
expect(spyMockFunc).toHaveProperty("mock");
```

### 모조 함수에 구현 덮어 씌우기

모조 함수를 호출하면 내부에 구현된 로직의 결과값을 반환합니다. 비어있는 모조 함수는 구현된 로직이 없기에 `undefined`가 반환됩니다.

```ts
const emptyMockFunc = jest.fn();
expect(emptyMockFunc()).toBe(undefined);
```

`MockFunc.mockImplementation(newImpl)`을 사용하면 다음부터 모조함수는 해당 로직의 결과값을 반환합니다.

```ts
const myMockFunc = jest.fn();
myMockFunc.mockImplementation(() => "Hello, World!");
expect(myMockFunc()).toBe("Hello, World!");
```

`MockFunc.mockImplementationOnce(newImpl)`은 한번 실행되면 사라집니다.

```ts
const myMockFunc = jest.fn();
myMockFunc.mockImplementationOnce(() => "Hello, World!");
expect(myMockFunc()).toBe("Hello, World!");
expect(myMockFunc()).toBe(undefined);
```

여러개의 `once`를 실행해야 한다면, 큐로 관리된다는 사실만 기억하세요.

```ts
myMockFunc.mockImplementationOnce(() => "a");
myMockFunc.mockImplementationOnce(() => "b");
expect(myMockFunc()).toBe("a");
expect(myMockFunc()).toBe("b");
```

기타 중요한 사항은 다음과 같습니다.

-   이외에도 여러가지 로직지정 함수가 있습니다.
    -   `mockReturnValue` / `mockReturnValueOnce`
    -   `mockResolvedValue` / `mockResolvedValueOnce`
    -   `mockRejectedValue` / `mockRejectedValueOnce`
-   모든 `once`는 종류가 달라도 하나의 큐에서 관리됩니다.
-   남아있는 `once`가 있다면 `non-once`보다 먼저 실행됩니다.

---

## 모조 객체

`jest.spyOn`을 사용하여 외부 환경에 의존적인 특정 멤버함수를 모조함수로 대체할 수 있습니다.

```ts
const somethingService = {
    checkAuth(id: string, pw: string) {
        if (Math.random() < 0.5) {
            return true;
        }
        return false;
    },

    process(id: string, pw: string) {
        if (this.checkAuth(id, pw)) {
            return "ok";
        } else {
            return "oops";
        }
    },
};
```

위의 코드에서 `checkAuth`가 불안정한 인터넷 통신의 영향으로 실패할 수 있다고 가정해봅시다. 테스트는 외부 환경의 영향을 받으면 안되므로 `checkAuth`를 모조함수로 대체해야 합니다.

```ts
//
// process()는 모조된 authCheck()를 호출한다.
// 즉,인가체크가 항상 통과된다.
jest.spyOn(somethingService, "checkAuth").mockResolvedValue(true);
expect(somethingService.process("id", "pw")).toBe("ok");
```

주의해야 할 점은 이 기능은 모조되는 대상이 `멤버함수`인 경우에만 동작한다는 것입니다. 최상위 함수에 `spyOn`을 적용해도 모조함수가 실행되지 않습니다. 예를 들어, 다음은 의도된 대로 동작하지 않습니다.

```ts
//
// checkAuth는 멤버함수가 아니므로,
// 모조함수가 되더라도 process()는 항상 실제 로직을 실행함.
function checkAuth(id: string, pw: string) {
    if (Math.random() < 0.5) {
        return true;
    }
    return false;
}

const somethingService = {
    process(id: string, pw: string) {
        if (this.checkAuth(id, pw)) {
            return "ok";
        } else {
            return "oops";
        }
    },
};
```

---

## 모조 모듈

`jest.mock(moduleName)`을 최상단에 입력하면, 해당 모듈의 `default export object`의 모든 멤버함수가 모조함수로 변환됩니다.

```ts
import myModule from "./myModule";
jest.mock("./myModule");
```
