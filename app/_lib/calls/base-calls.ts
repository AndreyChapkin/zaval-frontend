import axios from "axios";

function asEncodedParams(params: Record<string, any> | null): Record<string, any> | null {
    if (params) {
        let encodedParams = {} as Record<string, any>;
        Object.entries(params).forEach(([key, value]) => {
            encodedParams[key] = encodeURI(value);
        });
        return encodedParams;
    }
    return null;
}

function asRefinedParams(params: Record<string, any> | null): Record<string, any> | null {
    if (params) {
        let refinedParams = {} as Record<string, any>;
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                refinedParams[key] = value;
            }
        });
        return refinedParams;
    }
    return null;
}

export async function callGet<T>(url:string, params: Record<string, any> | null = null) {
    const refinedParams: Record<string, any> | null = asRefinedParams(params);
    return await axios.get<T>(url, {
        params: asEncodedParams(refinedParams),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
}

export async function callPost<T = void>(url:string, body: any) {
    return await axios.post<T>(url, body, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
}

export async function callPatch<T = void>(url:string, body: any) {
    return await axios.patch<T>(url, body, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
}

export async function callDelete<T = void>(url:string, body: any = null) {
    return await axios.delete<T>(url, {
        data: body,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    });
}