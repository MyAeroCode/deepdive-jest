# 함수 테스팅

## 기존의 함수를 스파이로 만들기

`jest.spyOn(obj, funcName)`을 사용해야 어떤 함수의 이력을 추적할 수 있습니다.

**./logic.ts :**

```ts
export function func_a() {
    //
}

export function func_b() {
    //
}
```

**./logic.spec.ts :**

```ts
import * as logic from "./logic";

describe("something", () => {
    const aSpy = jest.spyOn(logic, "func_a");
    const bSpy = jest.spyOn(logic, "func_b");
});
```

---

## 호출된 횟수와 파라미터 검증

```ts
const sumSpy = jest.spyOn(logic, "sum");

logic.sum(10, 20);
logic.sum(20, 40);
logic.sum(30, 60);

//
// 함수가 최소 1번호출되었음.
expect(sumSpytoHaveBeenCalled();

//
// 함수가 정확히 3호출되었음.
expect(sumSpy).toHaveBeenCalledTimes(3);

//
// 아래의 인자를 가지실행된 적이 있음.
expect(sumSpytoHaveBeenCalledWi(10, 20);
expect(sumSpytoHaveBeenCalledWi(20, 40);
expect(sumSpytoHaveBeenCalledWi(30, 60);

//
// 마지막 호출은 아래인자를 가지고 호출되었음.
expect(sumSpy).toHaveBeenLastCalledWith(30, 60);

//
// n번째 호출은 아래의인자가지고 호출되었음.
expect(sumSptoHaveBeenNthCalledWit(110, 20);
expect(sumSptoHaveBeenNthCalledWit(220, 40);
expect(sumSptoHaveBeenNthCalledWit(3, 30, 60);
```

`toHaveBeen`은 `toBe`로 바꿔써도 괜찮습니다. 별명이거든요.

```ts
//
// 아래 두개는 같은 동작을 수행한다.
expect(sumSpy).toHaveBeenCalled();
expect(sumSpy).toBeCalled();
```

호출이력은 `SpyObject.mock`에 저장됩니다. 이 프로퍼티를 검증에 사용할 수 있습니다.

```ts
//
// spy 내부의 mock 프로퍼티를 통해서도 대체 할 수 있음.
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
```

---

## 함수의 호출결과 검증

`jest`에서 함수의 호출 결과는 아래의 3개로 분류합니다.

-   `return` : 값이 반환됨
-   `throw` : 익셉션이 발생함
-   `incomplete` : 아직 함수가 진행중임.

**logic :**

```ts
function throwOrReturn(data: any, op: "throw" | "return") {
    if (op === "throw") throw new Error(data);
    if (op === "return") return data;
    throw new Error(`${op} is invaild operator.`);
}
```

**logic.spec.ts :**

```ts
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
```

호출이력은 `SpyObject.mock`에 저장됩니다. 이 프로퍼티를 검증에 사용할 수 있습니다.

```ts
//
// spy 내부의 mock 프로퍼티를 통해서도 대체할 수 있음.
expect(throwOrReturnSpy.mock.results).toEqual([
    { type: "throw", value: Error("a") },
    { type: "return", value: "b" },
    { type: "throw", value: Error("c") },
    { type: "return", value: "d" },
]);
```

---

## 두 개 이상의 함수의 실행순서 검증

`jest`는 함수의 실행순서를 추적할 수 있는 카운터를 가지고 있습니다. 함수가 호출될 때 마다 카운터가 증가되며, 호출된 함수의 `mock.invocationCallOrder`프로퍼티에 `push_back`합니다.

이 때 중요한 것은 함수 이력을 초기화하더라도 `invocationCallOrder`은 빈 배열이 될지언정 `카운터를 초기화할 방법은 없다`는 것 입니다. 즉, 절대적인 순번이 아닌 상대적인 순번으로 `invocationCallOrder`를 이용해야 합니다.

```ts
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
```
