import axios from "axios";

export const googleGetter = {
    async httpGetRequest(url: string): Promise<string> {
        const res = await axios.get(url);
        return res.data;
    },

    async httpGetGoogle(subPath: string): Promise<string> {
        const fullPath = `https://google.com/${subPath}`;
        return await this.httpGetRequest(fullPath);
    },
};
