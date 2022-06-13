export default function prettify(Class, radio: boolean = false) {
    Object.defineProperty(Class.prototype, 'checkboxClasses', {
        get() {
            const options = this.checkboxOptions;
            return `pretty ${options.type} ${options.shape} ${options.thick}`;
        },
    });

    Object.defineProperty(Class.prototype, 'stateClasses', {
        get() {
            const options = this.checkboxOptions;
            return `state ${options.state}`;
        },
    });

    Object.defineProperty(Class.prototype, 'isIcon', {
        get() {
            const options = this.checkboxOptions;
            return !!options.icon;
        },
    });

    Object.defineProperty(Class.prototype, 'iconClasses', {
        get() {
            const options = this.checkboxOptions;
            return `icon fa fa-${options.icon}`;
        },
    });

    Object.defineProperty(Class.prototype, 'checkboxOptions', {
        get() {
            if (this._checkboxOptions) {
                return this._checkboxOptions;
            }
            this._checkboxOptions = {
                type: 'p-default',
                state: 'p-primary',
                shape: radio ? 'p-round' : '',
                thick: '',
                icon: '',
            };
            const iconPrefix = 'icon-';
            if (this.component.customClass) {
                const matches = this.component.customClass.match(/p-([^\s]+)/g);
                if (matches && matches.length) {
                    matches.forEach((match) => {
                        switch (match) {
                            case 'p-switch':
                                this._checkboxOptions.type = match;
                                return '';
                            case 'p-round':
                            case 'p-curve':
                                this._checkboxOptions.shape = match;
                                return '';
                            case 'p-fill':
                            case 'p-thick':
                                this._checkboxOptions.thick = match;
                                return '';
                            case 'p-none':
                                this._checkboxOptions.state = '';
                                return '';
                            case 'p-primary':
                            case 'p-warning':
                            case 'p-success':
                            case 'p-info':
                            case 'p-danger':
                                this._checkboxOptions.state = match;
                                return '';
                        }
                    });
                }

                const classes = this.component.customClass.split(' ');
                const icon = classes.find((cls: string) => cls.startsWith(iconPrefix));
                if (icon) {
                    const iconClass = icon.substring(iconPrefix.length);
                    if (iconClass) {
                        this._checkboxOptions.type = 'p-icon';
                        this._checkboxOptions.icon = iconClass;
                    }
                }
            }
            return this._checkboxOptions;
        },
    });
}