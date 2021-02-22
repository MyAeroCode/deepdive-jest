
# 기본적인 사용방법

## 시나리오 분류

### 1. 긍정/부정 테스트

**긍정 테스트:**

`expect()`객체에 있는 메소드를 사용하여 긍정 테스트를 진행할 수 있다.

```ts
expect(1).toBe(1);
expect(1).toBeLessThan(3);
```

**부정 테스트:**

`expect().not`객체에 있는 메소드를 사용하여 부정 테스트를 진행할 수 있다. 

```ts
expect(1).not.toBe(2);
expect(1).not.toBeLessThan(-1);
```

---

### 2. 동기/비동기 테스트

**동기 테스트:**

`test`에 들어가는 함수를 동기 함수로 작성한다.

```ts
function sum(a:number, b:number){
    return a + b;
}

test("동기 함수 테스트", () => {
    const actual = sum(1, 2);
    const expected = 3;
    expect(actual).toBe(expected);
});
```

**비동기 테스트:**

`test`에 들어가는 함수를 비동기 함수로 작성하고, `await`키워드로 동기처럼 작성한다.

```ts
function asyncSum(a:number, b:number){
    return a + b;
}

test("비동기 함수 테스트", async () => {
    const actual = await asyncSum(1, 2);
    const expected = 3;
    expect(actual).toBe(expected);
})
```

---

### 3. 성공/실패 테스트

**동기 실패 테스트:**

중간에 에러가 발생할 수 있는 로직은 함수화하여 `test`에 전달하고 `toThrow` 또는 `toThrowError`를 사용한다.

```ts
function occurError(){
    throw new Error("My Error");
}

//
// 모든 익셉션에 매칭됨.
expect(() => occurError()).toThrow();

//
// 메세지가 "My Error"인 익셉션에만 매칭됨.
expect(() => occurError()).toThrow("My Error");
```

**비동기 실패 테스트:**

`expect`에 비동기 함수를 전달하면 `expect` 자체가 `Promise`를 반환하므로 `await expect()`형태로 작성해야 한다.

```ts
function occurError(){
    throw new Error("My Error");
}

//
// 모든 익셉션에 매칭됨.
await expect(async () => occurError()).rejects.toThrow();

//
// 메세지가 "My Error"인 익셉션에만 매칭됨.
await expect(async () => occurError()).rejects.toThrow("My Error");
```