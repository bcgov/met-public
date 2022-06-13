export default function prettify(Class, radio) {
    if (radio === void 0) { radio = false; }
    Object.defineProperty(Class.prototype, 'checkboxClasses', {
        get: function () {
            var options = this.checkboxOptions;
            return "pretty ".concat(options.type, " ").concat(options.shape, " ").concat(options.thick);
        },
    });
    Object.defineProperty(Class.prototype, 'stateClasses', {
        get: function () {
            var options = this.checkboxOptions;
            return "state ".concat(options.state);
        },
    });
    Object.defineProperty(Class.prototype, 'isIcon', {
        get: function () {
            var options = this.checkboxOptions;
            return !!options.icon;
        },
    });
    Object.defineProperty(Class.prototype, 'iconClasses', {
        get: function () {
            var options = this.checkboxOptions;
            return "icon fa fa-".concat(options.icon);
        },
    });
    Object.defineProperty(Class.prototype, 'checkboxOptions', {
        get: function () {
            var _this = this;
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
            var iconPrefix = 'icon-';
            if (this.component.customClass) {
                var matches = this.component.customClass.match(/p-([^\s]+)/g);
                if (matches && matches.length) {
                    matches.forEach(function (match) {
                        switch (match) {
                            case 'p-switch':
                                _this._checkboxOptions.type = match;
                                return '';
                            case 'p-round':
                            case 'p-curve':
                                _this._checkboxOptions.shape = match;
                                return '';
                            case 'p-fill':
                            case 'p-thick':
                                _this._checkboxOptions.thick = match;
                                return '';
                            case 'p-none':
                                _this._checkboxOptions.state = '';
                                return '';
                            case 'p-primary':
                            case 'p-warning':
                            case 'p-success':
                            case 'p-info':
                            case 'p-danger':
                                _this._checkboxOptions.state = match;
                                return '';
                        }
                    });
                }
                var classes = this.component.customClass.split(' ');
                var icon = classes.find(function (cls) { return cls.startsWith(iconPrefix); });
                if (icon) {
                    var iconClass = icon.substring(iconPrefix.length);
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
