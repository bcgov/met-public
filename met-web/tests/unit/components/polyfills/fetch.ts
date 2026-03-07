type FetchResponse = {
    ok: boolean;
    status: number;
    json: () => Promise<unknown>;
    text: () => Promise<string>;
    headers: {
        get: (key: string) => string | null;
    };
};

const createFetchResponse = (body: unknown = {}, status = 200): FetchResponse => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
    headers: {
        get: (_key: string) => null,
    },
});

if (!global.fetch) {
    global.fetch = jest.fn(async () => createFetchResponse()) as unknown as typeof fetch;
}
