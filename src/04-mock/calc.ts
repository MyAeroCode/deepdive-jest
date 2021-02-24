const calc = {
    sum(a: number, b: number) {
        return a + b;
    },

    advanced: {
        log2(n: number) {
            return Math.log2(n);
        },

        lambdaLog2: (n: number) => {
            return Math.log2(n);
        },
    },
};
export default calc;
