"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
var types_1 = require("../types");
var communication_1 = require("@blank/background/utils/types/communication");
var safe_event_emitter_1 = require("@metamask/safe-event-emitter");
var eth_rpc_errors_1 = require("eth-rpc-errors");
var site_1 = require("../utils/site");
var ethereum_1 = require("@blank/background/utils/types/ethereum");
var errors_1 = require("../utils/errors");
var loglevel_1 = require("loglevel");
var MAX_EVENT_LISTENERS = 100;
/**
 * Blank Provider
 *
 */
var BlankProvider = /** @class */ (function (_super) {
    __extends(BlankProvider, _super);
    function BlankProvider() {
        var _this = _super.call(this) || this;
        /**
         * Public method to check if the provider is connected
         *
         */
        _this.isConnected = function () {
            return _this._state.isConnected;
        };
        /**
         * Public request method
         *
         * @param args Request arguments
         * @returns Request response
         */
        _this.request = function (args) { return __awaiter(_this, void 0, Promise, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this._state.isConnected) {
                    throw eth_rpc_errors_1.ethErrors.provider.disconnected();
                }
                if (!args || typeof args !== 'object' || Array.isArray(args)) {
                    throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                        message: 'Expected a single, non-array, object argument.',
                        data: args,
                    });
                }
                method = args.method, params = args.params;
                if (typeof method !== 'string' || method.length === 0) {
                    throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                        message: "'method' property must be a non-empty string.",
                        data: args,
                    });
                }
                if (params !== undefined &&
                    !Array.isArray(params) &&
                    (typeof params !== 'object' || params === null)) {
                    throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                        message: "'params' property must be an object or array if provided.",
                        data: args,
                    });
                }
                return [2 /*return*/, this._postMessage(communication_1.Messages.EXTERNAL.REQUEST, args)];
            });
        }); };
        /**
         * Response handler
         *
         */
        _this.handleResponse = function (data) {
            var handler = _this._handlers[data.id];
            if (!handler) {
                loglevel_1.default.error('Unknown response', data);
                return;
            }
            if (!handler.subscriber) {
                delete _this._handlers[data.id];
            }
            if (data.subscription) {
                handler.subscriber(data.subscription);
            }
            else if (data.error) {
                var err = (0, errors_1.validateError)(data.error);
                handler.reject(err);
            }
            else {
                handler.resolve(data.response);
            }
        };
        _this.enable = function () { return __awaiter(_this, void 0, Promise, function () {
            var accounts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.deprecationWarning('ethereum.enable(...)', true);
                        return [4 /*yield*/, this._postMessage(communication_1.Messages.EXTERNAL.REQUEST, {
                                method: ethereum_1.JSONRPCMethod.eth_requestAccounts,
                            })];
                    case 1:
                        accounts = (_a.sent());
                        return [2 /*return*/, accounts];
                }
            });
        }); };
        /* ----------------------------------------------------------------------------- */
        /* Provider setup
        /* ----------------------------------------------------------------------------- */
        /**
         * Provider setup
         *
         */
        _this._setupProvider = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, accounts, chainId, networkVersion;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this._postMessage(communication_1.Messages.EXTERNAL.SETUP_PROVIDER)];
                    case 1:
                        _a = _b.sent(), accounts = _a.accounts, chainId = _a.chainId, networkVersion = _a.networkVersion;
                        if (chainId !== undefined && networkVersion !== undefined) {
                            this.networkVersion = networkVersion;
                            this.chainId = chainId;
                            this._connect({ chainId: chainId });
                        }
                        this._accountsChanged(accounts);
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Subscribes to events updates
         *
         * @param cb update handler
         */
        _this._eventSubscription = function (cb) { return __awaiter(_this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._postMessage(communication_1.Messages.EXTERNAL.EVENT_SUBSCRIPTION, undefined, cb)];
            });
        }); };
        /**
         * Set favicon url
         */
        _this._setIcon = function () { return __awaiter(_this, void 0, void 0, function () {
            var iconURL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, site_1.getIconData)()];
                    case 1:
                        iconURL = _a.sent();
                        if (iconURL) {
                            this._postMessage(communication_1.Messages.EXTERNAL.SET_ICON, {
                                iconURL: iconURL,
                            });
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        /* ----------------------------------------------------------------------------- */
        /* Requests utils
        /* ----------------------------------------------------------------------------- */
        /**
         * Post a message using the window object, to be listened by the content script
         *
         * @param message External method to use
         * @param request Request parameters
         * @param subscriber Subscription callback
         * @returns Promise with the response
         */
        _this._postMessage = function (message, request, subscriber) {
            return new Promise(function (resolve, reject) {
                var id = "".concat(Date.now(), ".").concat(++_this._requestId);
                _this._handlers[id] = { reject: reject, resolve: resolve, subscriber: subscriber };
                window.postMessage({
                    id: id,
                    message: message,
                    origin: communication_1.Origin.PROVIDER,
                    request: request || {},
                }, window.location.href);
            });
        };
        /**
         * Synchronous RPC request
         *
         */
        _this._sendJSONRPCRequest = function (request) {
            var response = {
                jsonrpc: '2.0',
                id: request.id,
            };
            response.result = _this._handleSynchronousMethods(request);
            if (response.result === undefined) {
                throw new Error("Please provide a callback parameter to call ".concat(request.method, " ") +
                    'asynchronously.');
            }
            return response;
        };
        _this._sendMultipleRequestsAsync = function (requests) {
            return Promise.all(requests.map(function (r) { return _this._sendRequestAsync(r); }));
        };
        _this._sendRequestAsync = function (request) {
            return new Promise(function (resolve, reject) {
                _this._handleAsynchronousMethods(request)
                    .then(function (res) {
                    resolve(res);
                })
                    .catch(function (err) { return reject(err); });
            });
        };
        /**
         * Synchronous methods handler
         *
         */
        _this._handleSynchronousMethods = function (request) {
            var method = request.method;
            switch (method) {
                case ethereum_1.JSONRPCMethod.eth_accounts:
                    return _this.selectedAddress ? [_this.selectedAddress] : [];
                case ethereum_1.JSONRPCMethod.eth_coinbase:
                    return _this.selectedAddress || null;
                case ethereum_1.JSONRPCMethod.net_version:
                    return _this.networkVersion || null;
                default:
                    return undefined;
            }
        };
        /**
         * Asynchronous methods handler
         *
         */
        _this._handleAsynchronousMethods = function (request) { return __awaiter(_this, void 0, Promise, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        response = {
                            jsonrpc: '2.0',
                            id: request.id,
                        };
                        _a = response;
                        return [4 /*yield*/, this._postMessage(communication_1.Messages.EXTERNAL.REQUEST, {
                                method: request.method,
                                params: request.params,
                            })];
                    case 1:
                        _a.result = _b.sent();
                        return [2 /*return*/, response];
                }
            });
        }); };
        /* ----------------------------------------------------------------------------- */
        /* Events
        /* ----------------------------------------------------------------------------- */
        _this._eventHandler = function (_a) {
            var eventName = _a.eventName, payload = _a.payload;
            switch (eventName) {
                case types_1.ProviderEvents.connect:
                    _this._connect(payload);
                    break;
                case types_1.ProviderEvents.disconnect:
                    _this._disconnect(payload);
                    break;
                case types_1.ProviderEvents.chainChanged:
                    _this._chainChanged(payload);
                    break;
                case types_1.ProviderEvents.accountsChanged:
                    _this._accountsChanged(payload);
                    break;
                case types_1.ProviderEvents.message:
                    _this._emitSubscriptionMessage(payload);
                    break;
                default:
                    break;
            }
        };
        _this._connect = function (connectInfo) {
            _this._state.isConnected = true;
            _this.emit(types_1.ProviderEvents.connect, connectInfo);
        };
        _this._disconnect = function (error) {
            if (error === void 0) { error = eth_rpc_errors_1.ethErrors.provider.disconnected(); }
            _this._state.isConnected = false;
            _this.emit(types_1.ProviderEvents.disconnect, error);
            /**
             * @deprecated Alias of disconnect
             */
            _this.emit(types_1.ProviderEvents.close, error);
        };
        _this._chainChanged = function (_a) {
            var chainId = _a.chainId, networkVersion = _a.networkVersion;
            _this._connect({ chainId: chainId });
            if (chainId !== _this.chainId) {
                _this.chainId = chainId;
                _this.networkVersion = networkVersion;
                _this.emit(types_1.ProviderEvents.chainChanged, chainId);
                /**
                 * @deprecated This was previously used with networkId instead of chainId,
                 * we keep the interface but we enforce chainId anyways
                 */
                _this.emit(types_1.ProviderEvents.networkChanged, chainId);
                /**
                 * @deprecated Alias of chainChanged
                 */
                _this.emit(types_1.ProviderEvents.chainIdChanged, chainId);
            }
        };
        _this._accountsChanged = function (accounts) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (accounts.length !== this._state.accounts.length ||
                    !accounts.every(function (val, index) { return val === _this._state.accounts[index]; })) {
                    this._state.accounts = accounts;
                    if (this.selectedAddress !== accounts[0]) {
                        this.selectedAddress = accounts[0] || null;
                    }
                    this.emit(types_1.ProviderEvents.accountsChanged, accounts);
                }
                return [2 /*return*/];
            });
        }); };
        /**
         * Emits to the consumers the message received via a previously
         * initiated subscription.
         *
         * @param message The received subscription message
         */
        _this._emitSubscriptionMessage = function (message) {
            _this.emit(types_1.ProviderEvents.message, message);
            // Emit events for legacy API
            var web3LegacyResponse = {
                jsonrpc: '2.0',
                method: 'eth_subscription',
                params: {
                    result: message.data.result,
                    subscription: message.data.subscription,
                },
            };
            _this.emit(types_1.ProviderEvents.data, web3LegacyResponse);
            _this.emit(types_1.ProviderEvents.notification, web3LegacyResponse.params.result);
        };
        _this._state = {
            accounts: [],
            isConnected: false,
        };
        _this.chainId = null;
        _this.selectedAddress = null;
        _this.networkVersion = null;
        _this.isBlockWallet = (0, site_1.isCompatible)();
        _this._handlers = {};
        _this._requestId = 0;
        // Metamask compatibility
        _this.isMetaMask = !_this.isBlockWallet;
        _this.autoRefreshOnNetworkChange = false;
        _this._metamask = {
            isEnabled: function () { return true; },
            isApproved: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); }); },
            isUnlocked: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, true];
            }); }); },
        };
        // Bind non arrow functions
        _this.send = _this.send.bind(_this);
        _this.sendAsync = _this.sendAsync.bind(_this);
        // Setup provider
        _this._setupProvider();
        // Subscribe to state updates
        _this._eventSubscription(_this._eventHandler);
        // Set maximum amount of event listeners
        _this.setMaxListeners(MAX_EVENT_LISTENERS);
        // Set site icon
        _this._setIcon();
        return _this;
    }
    BlankProvider.prototype.send = function (requestOrMethod, callbackOrParams) {
        var _this = this;
        this.deprecationWarning('ethereum.send(...)', true);
        // send<T>(method, params): Promise<T>
        if (typeof requestOrMethod === 'string') {
            var method = requestOrMethod;
            var params = Array.isArray(callbackOrParams)
                ? callbackOrParams
                : callbackOrParams !== undefined
                    ? [callbackOrParams]
                    : [];
            var request = {
                method: method,
                params: params,
            };
            var response = this._postMessage(communication_1.Messages.EXTERNAL.REQUEST, request);
            return response;
        }
        // send(JSONRPCRequest | JSONRPCRequest[], callback): void
        if (typeof callbackOrParams === 'function') {
            var request = requestOrMethod;
            var callback = callbackOrParams;
            return this.sendAsync(request, callback);
        }
        // send(JSONRPCRequest[]): JSONRPCResponse[]
        if (Array.isArray(requestOrMethod)) {
            var requests = requestOrMethod;
            return requests.map(function (r) { return _this._sendJSONRPCRequest(r); });
        }
        // send(JSONRPCRequest): JSONRPCResponse
        var req = requestOrMethod;
        return this._sendJSONRPCRequest(req);
    };
    BlankProvider.prototype.sendAsync = function (request, callback) {
        this.deprecationWarning('ethereum.sendAsync(...)', true);
        if (typeof callback !== 'function') {
            throw eth_rpc_errors_1.ethErrors.rpc.invalidRequest({
                message: 'A callback is required',
            });
        }
        // send(JSONRPCRequest[], callback): void
        if (Array.isArray(request)) {
            var arrayCb_1 = callback;
            this._sendMultipleRequestsAsync(request)
                .then(function (responses) { return arrayCb_1(null, responses); })
                .catch(function (err) { return arrayCb_1(err, null); });
            return;
        }
        // send(JSONRPCRequest, callback): void
        var cb = callback;
        this._sendRequestAsync(request)
            .then(function (response) { return cb(null, response); })
            .catch(function (err) { return cb(err, null); });
    };
    /**
     * Prints a console.warn message to warn the user about usage of a deprecated API
     * @param eventName The eventName
     */
    BlankProvider.prototype.deprecationWarning = function (methodName, force) {
        if (force === void 0) { force = false; }
        var deprecatedMethods = [
            'close',
            'data',
            'networkChanged',
            'chainIdChanged',
            'notification',
        ];
        if (deprecatedMethods.includes(methodName) || force) {
            loglevel_1.default.warn("BlockWallet: '".concat(methodName, "' is deprecated and may be removed in the future. See: https://eips.ethereum.org/EIPS/eip-1193"));
        }
    };
    /// EventEmitter overrides
    BlankProvider.prototype.addListener = function (eventName, listener) {
        this.deprecationWarning(eventName);
        return _super.prototype.addListener.call(this, eventName, listener);
    };
    BlankProvider.prototype.on = function (eventName, listener) {
        this.deprecationWarning(eventName);
        return _super.prototype.on.call(this, eventName, listener);
    };
    BlankProvider.prototype.once = function (eventName, listener) {
        this.deprecationWarning(eventName);
        return _super.prototype.once.call(this, eventName, listener);
    };
    BlankProvider.prototype.prependListener = function (eventName, listener) {
        this.deprecationWarning(eventName);
        return _super.prototype.prependListener.call(this, eventName, listener);
    };
    BlankProvider.prototype.prependOnceListener = function (eventName, listener) {
        this.deprecationWarning(eventName);
        return _super.prototype.prependOnceListener.call(this, eventName, listener);
    };
    return BlankProvider;
}(safe_event_emitter_1.default));
exports.default = BlankProvider;
