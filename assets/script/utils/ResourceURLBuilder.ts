import { URLParams } from "./URLParams";

export class ResourceURLBuilder {
    constructor(baseurl: string) {
        this.baseUrl = baseurl;
    }

    public appendParam(key: string, value: string | number | boolean) {
        this.queryParams.append(key, value.toString());
    }

    public build(): string {
        let url = this.baseUrl;
        let queryString = this.queryParams.toString();
        if (queryString.length > 0) {
            url += '?' + queryString;
        }
        return url;
    }
    
    baseUrl: string;
    queryParams = new URLParams();
}
