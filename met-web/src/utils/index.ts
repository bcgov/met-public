export function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj;
}

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
}

export function checkEmail(email: string) {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
        return false;
    } else {
        return true;
    }
}
