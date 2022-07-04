export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj;
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}
