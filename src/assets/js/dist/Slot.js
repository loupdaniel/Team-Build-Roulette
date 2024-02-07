"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
/** Class for doing random name pick and animation */
var Slot = /** @class */ (function () {
    /**
     * Constructor of Slot
     * @param maxReelItems  Maximum item inside a reel
     * @param removeWinner  Whether winner should be removed from name list
     * @param reelContainerSelector  The element ID of reel items to be appended
     * @param reelGenreContainerSelector
     * @param reelStyleContainerSelector
     * @param onSpinStart  Callback function that runs before spinning reel
     * @param onNameListChanged  Callback function that runs when user updates the name list
     */
    function Slot(_a) {
        var _b = _a.maxReelItems, maxReelItems = _b === void 0 ? 30 : _b, _c = _a.removeWinner, removeWinner = _c === void 0 ? true : _c, reelContainerSelector = _a.reelContainerSelector, reelGenreContainerSelector = _a.reelGenreContainerSelector, reelStyleContainerSelector = _a.reelStyleContainerSelector, onSpinStart = _a.onSpinStart, onSpinEnd = _a.onSpinEnd, onNameListChanged = _a.onNameListChanged;
        this.nameList = [];
        this.genreList = [];
        this.styleList = [];
        this.havePreviousWinner = false;
        this.reelContainer = document.querySelector(reelContainerSelector);
        this.reelGenreContainer = document.querySelector(reelGenreContainerSelector);
        this.reelStyleContainer = document.querySelector(reelStyleContainerSelector);
        this.maxReelItems = maxReelItems;
        this.shouldRemoveWinner = removeWinner;
        this.onSpinStart = onSpinStart;
        this.onSpinEnd = onSpinEnd;
        this.onNameListChanged = onNameListChanged;
        // Separate animations for name, genre, and style
        this.reelAnimation = this.createReelAnimation(this.reelContainer);
        this.reelGenreAnimation = this.createReelAnimation(this.reelGenreContainer);
        this.reelStyleAnimation = this.createReelAnimation(this.reelStyleContainer);
    }
    Slot.prototype.createReelAnimation = function (container) {
        return container === null || container === void 0 ? void 0 : container.animate([
            { transform: 'none', filter: 'blur(0)' },
            { filter: 'blur(1px)', offset: 0.5 },
            // Here we transform the reel to move up and stop at the top of last item
            // "(Number of item - 1) * height of reel item" of wheel is the amount of pixel to move up
            // 7.5rem * 16 = 120px, which equals to reel item height
            { transform: "translateY(-" + (this.maxReelItems - 1) * (7.5 * 16) + "px)", filter: 'blur(0)' }
        ], {
            duration: this.maxReelItems * 100,
            easing: 'ease-in-out',
            iterations: 1
        });
    };
    Object.defineProperty(Slot.prototype, "names", {
        /** Getter for name list */
        get: function () {
            return this.nameList;
        },
        /**
         * Setter for name list
         * @param names  List of names to draw a winner from
         */
        set: function (names) {
            var _a;
            this.nameList = names;
            var reelItemsToRemove = ((_a = this.reelContainer) === null || _a === void 0 ? void 0 : _a.children) ? Array.from(this.reelContainer.children)
                : [];
            reelItemsToRemove
                .forEach(function (element) { return element.remove(); });
            this.havePreviousWinner = false;
            if (this.onNameListChanged) {
                this.onNameListChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "genres", {
        /** Getter for name list */
        get: function () {
            return this.genreList;
        },
        /**
         * Setter for name list
         * @param genres  List of names to draw a winner from
         */
        set: function (genres) {
            var _a;
            this.genreList = genres;
            var reelItemsToRemove = ((_a = this.reelGenreContainer) === null || _a === void 0 ? void 0 : _a.children) ? Array.from(this.reelGenreContainer.children)
                : [];
            reelItemsToRemove
                .forEach(function (element) { return element.remove(); });
            this.havePreviousWinner = false;
            if (this.onNameListChanged) {
                this.onNameListChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "styles", {
        /** Getter for name list */
        get: function () {
            return this.styleList;
        },
        /**
         * Setter for name list
         * @param styles  List of names to draw a winner from
         */
        set: function (styles) {
            var _a;
            this.styleList = styles;
            var reelItemsToRemove = ((_a = this.reelStyleContainer) === null || _a === void 0 ? void 0 : _a.children) ? Array.from(this.reelStyleContainer.children)
                : [];
            reelItemsToRemove
                .forEach(function (element) { return element.remove(); });
            this.havePreviousWinner = false;
            if (this.onNameListChanged) {
                this.onNameListChanged();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Slot.prototype, "shouldRemoveWinnerFromNameList", {
        /** Getter for shouldRemoveWinner */
        get: function () {
            return this.shouldRemoveWinner;
        },
        /**
         * Setter for shouldRemoveWinner
         * @param removeWinner  Whether the winner should be removed from name list
         */
        set: function (removeWinner) {
            this.shouldRemoveWinner = removeWinner;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns a new array where the items are shuffled
     * @template T  Type of items inside the array to be shuffled
     * @param array  The array to be shuffled
     * @returns The shuffled array
     */
    Slot.shuffleNames = function (array) {
        var keys = Object.keys(array);
        var result = [];
        for (var k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
            // eslint-disable-next-line no-bitwise
            var i = Math.random() * n | 0;
            var key = keys[i];
            result.push(array[key]);
            n -= 1;
            var tmp = keys[n];
            keys[n] = key;
            keys[i] = tmp;
        }
        return result;
    };
    /**
     * Function for spinning the slot
     * @returns Whether the spin is completed successfully
     */
    Slot.prototype.spin = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a, reelContainer, reelGenreContainer, reelStyleContainer, reelAnimation, reelGenreAnimation, reelStyleAnimation, shouldRemoveWinner, randomNames, randomGenres, randomStyles, nameFragment, genreFragment, styleFragment, animationPromise;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.nameList.length) {
                            console.error('Name List is empty. Cannot start spinning.');
                            return [2 /*return*/, false];
                        }
                        if (this.onSpinStart) {
                            this.onSpinStart();
                        }
                        _a = this, reelContainer = _a.reelContainer, reelGenreContainer = _a.reelGenreContainer, reelStyleContainer = _a.reelStyleContainer, reelAnimation = _a.reelAnimation, reelGenreAnimation = _a.reelGenreAnimation, reelStyleAnimation = _a.reelStyleAnimation, shouldRemoveWinner = _a.shouldRemoveWinner;
                        if ((!reelContainer || !reelAnimation)
                            && (!reelGenreContainer || !reelGenreAnimation)
                            && (!reelStyleContainer || !reelStyleAnimation)) {
                            return [2 /*return*/, false];
                        }
                        randomNames = Slot.shuffleNames(this.nameList);
                        while (randomNames.length && randomNames.length < this.maxReelItems) {
                            randomNames = __spreadArrays(randomNames, randomNames);
                        }
                        randomNames = randomNames.slice(0, this.maxReelItems - Number(this.havePreviousWinner));
                        randomGenres = Slot.shuffleNames(this.genreList);
                        while (randomGenres.length && randomGenres.length < this.maxReelItems) {
                            randomGenres = __spreadArrays(randomGenres, randomGenres);
                        }
                        randomGenres = randomGenres.slice(0, this.maxReelItems - Number(this.havePreviousWinner));
                        randomStyles = Slot.shuffleNames(this.styleList);
                        while (randomStyles.length && randomStyles.length < this.maxReelItems) {
                            randomStyles = __spreadArrays(randomStyles, randomStyles);
                        }
                        randomStyles = randomStyles.slice(0, this.maxReelItems - Number(this.havePreviousWinner));
                        nameFragment = document.createDocumentFragment();
                        randomNames.forEach(function (name) {
                            var newReelItem = document.createElement('div');
                            newReelItem.innerHTML = name;
                            nameFragment.appendChild(newReelItem);
                        });
                        reelContainer.appendChild(nameFragment);
                        genreFragment = document.createDocumentFragment();
                        randomGenres.forEach(function (genre) {
                            var newGenreReelItem = document.createElement('div');
                            newGenreReelItem.innerHTML = genre;
                            genreFragment.appendChild(newGenreReelItem);
                        });
                        reelGenreContainer.appendChild(genreFragment);
                        styleFragment = document.createDocumentFragment();
                        randomStyles.forEach(function (style) {
                            var newStyleReelItem = document.createElement('div');
                            newStyleReelItem.innerHTML = style;
                            styleFragment.appendChild(newStyleReelItem);
                        });
                        reelStyleContainer.appendChild(styleFragment);
                        console.log('Displayed items: ', randomNames);
                        console.log('Winner: ', randomNames[randomNames.length - 1]);
                        // Remove winner form name list if necessary
                        if (shouldRemoveWinner) {
                            this.nameList.splice(this.nameList.findIndex(function (name) { return name === randomNames[randomNames.length - 1]; }), 1);
                            this.genreList.splice(this.genreList.findIndex(function (genre) { return genre === randomGenres[randomGenres.length - 1]; }), 1);
                            this.styleList.splice(this.styleList.findIndex(function (style) { return style === randomStyles[randomStyles.length - 1]; }), 1);
                        }
                        console.log('Remaining: ', this.nameList);
                        animationPromise = new Promise(function (resolve) {
                            var onAnimationFinish = function () {
                                reelAnimation === null || reelAnimation === void 0 ? void 0 : reelAnimation.removeEventListener('finish', onAnimationFinish);
                                reelGenreAnimation === null || reelGenreAnimation === void 0 ? void 0 : reelGenreAnimation.removeEventListener('finish', onAnimationFinish);
                                reelStyleAnimation === null || reelStyleAnimation === void 0 ? void 0 : reelStyleAnimation.removeEventListener('finish', onAnimationFinish);
                                resolve();
                            };
                            reelAnimation === null || reelAnimation === void 0 ? void 0 : reelAnimation.addEventListener('finish', onAnimationFinish);
                            reelGenreAnimation === null || reelGenreAnimation === void 0 ? void 0 : reelGenreAnimation.addEventListener('finish', onAnimationFinish);
                            reelStyleAnimation === null || reelStyleAnimation === void 0 ? void 0 : reelStyleAnimation.addEventListener('finish', onAnimationFinish);
                            reelAnimation === null || reelAnimation === void 0 ? void 0 : reelAnimation.play();
                            reelGenreAnimation === null || reelGenreAnimation === void 0 ? void 0 : reelGenreAnimation.play();
                            reelStyleAnimation === null || reelStyleAnimation === void 0 ? void 0 : reelStyleAnimation.play();
                        });
                        return [4 /*yield*/, animationPromise];
                    case 1:
                        _b.sent();
                        // Sets the current playback time to the end of the animation
                        // Fix issue for animation not playing after the initial play on Safari
                        reelAnimation === null || reelAnimation === void 0 ? void 0 : reelAnimation.finish();
                        reelGenreAnimation === null || reelGenreAnimation === void 0 ? void 0 : reelGenreAnimation.finish();
                        reelStyleAnimation === null || reelStyleAnimation === void 0 ? void 0 : reelStyleAnimation.finish();
                        Array.from(reelContainer.children)
                            .slice(0, reelContainer.children.length - 1)
                            .forEach(function (element) { return element.remove(); });
                        Array.from(reelGenreContainer.children)
                            .slice(0, reelGenreContainer.children.length - 1)
                            .forEach(function (element) { return element.remove(); });
                        Array.from(reelStyleContainer.children)
                            .slice(0, reelStyleContainer.children.length - 1)
                            .forEach(function (element) { return element.remove(); });
                        this.havePreviousWinner = true;
                        if (this.onSpinEnd) {
                            this.onSpinEnd();
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return Slot;
}());
exports["default"] = Slot;
