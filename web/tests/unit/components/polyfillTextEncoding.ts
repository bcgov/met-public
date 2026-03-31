// Polyfill TextEncoder/TextDecoder for Jest tests
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
    // @ts-ignore
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    // @ts-ignore
    global.TextDecoder = TextDecoder;
}
