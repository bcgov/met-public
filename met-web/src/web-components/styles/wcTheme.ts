import { createTheme } from '@mui/material';
import { BaseTheme } from '../../styles/Theme';

export default function createWcTheme(shadowRoot: HTMLElement) {
    const wcTheme = createTheme(BaseTheme, {
        components: {
            MuiPopover: {
                defaultProps: {
                    container: shadowRoot,
                },
            },
            MuiPopper: {
                defaultProps: {
                    container: shadowRoot,
                },
            },
            MuiModal: {
                defaultProps: {
                    container: shadowRoot,
                },
            },
        },
    });
    return wcTheme;
}
