
# 데이터 테스팅

## 원시적인 동등 비교

`toBe()`는 아래처럼 값이 완전히 일치하는 경우에만 매칭됩니다. 

+ 두 원시값이 데이터가 같음. (엄격한 비교)
+ 두 객체값의 레퍼런스가 같음.

```ts
expect(1).toBe(1); // OK
expect(1).not.toBe("1"); // 두 원시값의 타입이 다름.
expect({}).not.toBe({}); // 두 객체의 레퍼런스가 다름.
```

---

## 확장된 동등 비교

`toEqual()`은 객체를 더 이상 레퍼런스가 아닌, 구조를 고려한 동등비교(`깊은 비교`)를 수행합니다. 또한 `expect.any`, `expect.anything`, `expect.arrayContaining`과 같은 `Jest Matcher`를 사용할 수 있습니다.

**toEqual, toStringEqual :**

```ts
expect(1).toEqual(1);

//
// toEqual은 undefined 프로퍼티를 무시한다.
expect({ a: 1, b: undefined }).toEqual({ a: 1 });

//
// undefined 프로퍼티도 검사하려면 toStrictEqual을 사용할 것.
expect({ a: 1, b: undefined }).not.toStrictEqual({ a: 1 });
```

**matchers :**

```ts
//
// expect.anything()은 null과 undefined를 제외한 모든 것에 매칭된다.
expect(1).toEqual(expect.anything());
expect(null).not.toEqual(expect.anything());
expect(undefined).not.toEqual(expect.anything());

//
// expect.any(constructor)는 해당 자료형을 갖는 모든 값에 매칭된다.
expect(1).toEqual(expect.any(Number));
```

---

## 리스트 내 포함여부 판별

`toContain`은 단일 expected 요소가 actual 리스트에 포함되었는지 `엄격한 검사`를 통해 판별합니다.

```ts
const items = [1, 2, 3, "4", "5", { a: 1 }];

expect(items).toContain(1);
expect(items).not.toContain(5);
expect(items).not.toContain({ a: 1 });
```

반면에 `toContainEqual`는 `깊은 검사`를 통해 판별합니다.

```ts
const items = [1, 2, 3, "4", "5", { a: 1 }];

expect(items).toContainEqual({ a: 1 });
```

`toEqual`과 `arrayContaining` 매처를 사용하면 다중 요소의 포함여부도 판별할 수 있습니다. 객체를 만날 경우 `깊은 검사`를 수행합니다.

```ts
//
// 만약, 객체를 만나면 깊은 검사를 수행한다.
expect(items).toEqual(expect.arrayContaining([1, 2, 3]));
expect(items).toEqual(expect.arrayContaining([1, "4", { a: 1 }]));
expect(items).toEqual(expect.arrayContaining([expect.any(Number)]));
expect(items).not.toEqual(expect.arrayContaining([4, 5]));
```

✅ `equal` 키워드가 들어간 메서드는 객체를 만날 경우 `깊은 검사`를 수행합니다.

---

## 문자열 매칭

문자열이 `특정 문자열을 포함`하는지, `특정 정규식을 만족`하는지 검사할 수 있습니다.

```ts
const line = "Hello, World!";

//
// stringContaining은 문자열만 받음.
expect(line).toEqual(expect.stringContaining("Wor"));

//
// stringMatching은 문자열 또는 정규표현식을 받음.
expect(line).toEqual(expect.stringMatching("Wor"));
expect(line).toEqual(expect.stringMatching(/^Hello, [a-zA-z]+\!$/));
```

---

## 길이 검사

길이 정보(`.length`)가 있는 객체를 받아, 그 길이의 값을 엄격한 비교를 통해 검사합니다. `.length`가 없다면, 해당 테스트는 실패합니다.

```ts
expect([1, 2, 3]).toHaveLength(3);
expect("abcde").toHaveLength(5);
expect({ length: 999 }).toHaveLength(999);
```

---

## 속성 검사

어떤 객체의 프로퍼티 경로가 존재하는지 검사합니다. 두번째 인자를 주면 해당 프로퍼티의 값과 `깊은 비교`를 수행합니다.

```ts
const object = {
    x: undefined,
    y: "",
    z: {
        a: {
            b: 12345,
        },
    },
};

//
// object.xyz라는 프로퍼티는 존재하지 않음.
expect(object).not.toHaveProperty("xyz");

//
// object.x, object.y, object.z라는 프로퍼티는 존재함.
expect(object).toHaveProperty("x");
expect(object).toHaveProperty("y");
expect(object).toHaveProperty("z");

//
// object.x의 값은 null이 아니라 undefined이다.
expect(object).not.toHaveProperty("x", null);
expect(object).toHaveProperty("x", undefined);

//
// 깊게 접근할 수 있음.
expect(object).toHaveProperty("z.a.b", 12345);

//
// 객체를 만날경우 깊은 비교를 수행함.
expect(object).toHaveProperty("z", { a: { b: 12345 } });
```

---

## 실수 근사치 검사

실수의 태생적인 한계로, 두 실수가 같다고 말하려면, 두 실수의 차이가 극히 작아야 합니다. 

```ts
const actual = 0.1 + 0.2;
const expected = 0.3;

//
// 실수의 태생적인 한계 때문에 (0.1 + 0.2) !== (0.3) 이다.
expect(actual).not.toBe(expected);

//
// actual과 expected의 차이가 (10 ** -n / 2) 보다 작다면 테스트 통과.
// 두 차이의 절대값이 충분히 작다면, 둘은 같다고 봐도 되기 때문이다.
expect(actual).toBeCloseTo(expected, 5);

//
// 정수에도 적용할 수 있음. (bigint 제외)
// Math.abs(10 - 6) < 10 ** -(-1) / 2 이므로, 테스트 통과.
expect(6).toBeCloseTo(10, -1);
```

---

## 기타

```ts
//
// undefined, null, NaN 여부 검사
expect(1).toBeDefined();
expect(null).toBeDefined();
expect(undefined).toBeUndefined();
expect(null).toBeNull();
expect(NaN).toBeNaN();

//
// 참 같은 값, 거짓 같은 값
expect(1).toBeTruthy();
expect("Hello").toBeTruthy();
expect(0).toBeFalsy();
expect("").toBeFalsy();
expect(null).toBeFalsy();
expect(undefined).toBeFalsy();

//
// 대소비교 (bigint 포함)
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThan(10);
expect(5).toBeLessThanOrEqual(5);
```