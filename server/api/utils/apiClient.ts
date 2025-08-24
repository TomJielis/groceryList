type TApiClientOptions<T> = {
    method?: string;
    headers?: Record<string, string>;
    body?: T;
};
type TApiResponse<T> = {
    data: T;
    success: boolean;
    message?: string;
};
const config = useRuntimeConfig();

export const apiClient = async <T = any>(
    endpoint: string,
    options: TApiClientOptions<T> = {},
    token: string | undefined
): Promise<TApiResponse<T>> => {
    const config = useRuntimeConfig();
    const baseUrl = config.api.url + config.api.basePath;
    const response = await fetch(baseUrl + endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};