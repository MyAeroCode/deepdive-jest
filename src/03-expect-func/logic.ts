export function sum(a: number, b: number) {
    return a + b;
}

export function throwOrReturn(data: any, op: "throw" | "return") {
    if (op === "throw") throw new Error(data);
    if (op === "return") return data;
    throw new Error(`${op} is invaild operator.`);
}
