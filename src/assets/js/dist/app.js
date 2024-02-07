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
exports.__esModule = true;
var canvas_confetti_1 = require("canvas-confetti");
var Slot_1 = require("@js/Slot");
var SoundEffects_1 = require("@js/SoundEffects");
// Initialize slot machine
(function () {
    var drawButton = document.getElementById('draw-button');
    var fullscreenButton = document.getElementById('fullscreen-button');
    var settingsButton = document.getElementById('settings-button');
    var settingsWrapper = document.getElementById('settings');
    var settingsContent = document.getElementById('settings-panel');
    var settingsSaveButton = document.getElementById('settings-save');
    var settingsCloseButton = document.getElementById('settings-close');
    var confettiCanvas = document.getElementById('confetti-canvas');
    var nameListTextArea = document.getElementById('name-list');
    var genreListTextArea = document.getElementById('genre-list');
    var styleListTextArea = document.getElementById('style-list');
    var bassListTextArea = document.getElementById('bass-list');
    var drumListTextArea = document.getElementById('drum-list');
    var removeNameFromListCheckbox = document.getElementById('remove-from-list');
    var enableSoundCheckbox = document.getElementById('enable-sound');
    // Graceful exit if necessary elements are not found
    if (!(drawButton
        && fullscreenButton
        && settingsButton
        && settingsWrapper
        && settingsContent
        && settingsSaveButton
        && settingsCloseButton
        && confettiCanvas
        && nameListTextArea
        && genreListTextArea
        && styleListTextArea
        && bassListTextArea
        && drumListTextArea
        && removeNameFromListCheckbox
        && enableSoundCheckbox)) {
        console.error('One or more Element ID is invalid. This is possibly a bug.');
        return;
    }
    if (!(confettiCanvas instanceof HTMLCanvasElement)) {
        console.error('Confetti canvas is not an instance of Canvas. This is possibly a bug.');
        return;
    }
    var soundEffects = new SoundEffects_1["default"]();
    var MAX_REEL_ITEMS = 40;
    var CONFETTI_COLORS = ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'];
    var confettiAnimationId;
    /** Confeetti animation instance */
    var customConfetti = canvas_confetti_1["default"].create(confettiCanvas, {
        resize: true,
        useWorker: true
    });
    /** Triggers cconfeetti animation until animation is canceled */
    var confettiAnimation = function () {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
        var confettiScale = Math.max(0.5, Math.min(1, windowWidth / 1100));
        customConfetti({
            particleCount: 1,
            gravity: 0.8,
            spread: 90,
            origin: { y: 0.6 },
            colors: [CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]],
            scalar: confettiScale
        });
        confettiAnimationId = window.requestAnimationFrame(confettiAnimation);
    };
    /** Function to stop the winning animation */
    var stopWinningAnimation = function () {
        if (confettiAnimationId) {
            window.cancelAnimationFrame(confettiAnimationId);
        }
    };
    /**  Function to be trigger before spinning */
    var onSpinStart = function () {
        stopWinningAnimation();
        drawButton.disabled = true;
        settingsButton.disabled = true;
        soundEffects.spin((MAX_REEL_ITEMS - 1) / 10);
    };
    /**  Functions to be trigger after spinning */
    var onSpinEnd = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confettiAnimation();
                    return [4 /*yield*/, soundEffects.win()];
                case 1:
                    _a.sent();
                    drawButton.disabled = false;
                    settingsButton.disabled = false;
                    return [2 /*return*/];
            }
        });
    }); };
    /** Slot instance */
    var slot = new Slot_1["default"]({
        reelContainerSelector: '#reel',
        reelGenreContainerSelector: '#genrereel',
        reelStyleContainerSelector: '#stylereel',
        reelBassContainerSelector: '#bassreel',
        reelDrumContainerSelector: '#drumreel',
        maxReelItems: MAX_REEL_ITEMS,
        onSpinStart: onSpinStart,
        onSpinEnd: onSpinEnd,
        onNameListChanged: stopWinningAnimation
    });
    /** To open the setting page */
    var onSettingsOpen = function () {
        nameListTextArea.value = slot.names.length ? slot.names.join('\n') : '';
        genreListTextArea.value = slot.genres.length ? slot.genres.join('\n') : '';
        styleListTextArea.value = slot.styles.length ? slot.styles.join('\n') : '';
        bassListTextArea.value = slot.basses.length ? slot.basses.join('\n') : '';
        drumListTextArea.value = slot.drums.length ? slot.drums.join('\n') : '';
        removeNameFromListCheckbox.checked = slot.shouldRemoveWinnerFromNameList;
        enableSoundCheckbox.checked = !soundEffects.mute;
        settingsWrapper.style.display = 'block';
    };
    /** To close the setting page */
    var onSettingsClose = function () {
        settingsContent.scrollTop = 0;
        settingsWrapper.style.display = 'none';
    };
    // Click handler for "Draw" button
    drawButton.addEventListener('click', function () {
        if (!slot.names.length) {
            onSettingsOpen();
            return;
        }
        slot.spin();
    });
    // Hide fullscreen button when it is not supported
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - for older browsers support
    if (!(document.documentElement.requestFullscreen && document.exitFullscreen)) {
        fullscreenButton.remove();
    }
    // Click handler for "Fullscreen" button
    fullscreenButton.addEventListener('click', function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            return;
        }
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });
    // Click handler for "Settings" button
    settingsButton.addEventListener('click', onSettingsOpen);
    // Click handler for "Save" button for setting page
    settingsSaveButton.addEventListener('click', function () {
        slot.names = nameListTextArea.value
            ? nameListTextArea.value.split(/\n/).filter(function (name) { return Boolean(name.trim()); })
            : [];
        slot.genres = nameListTextArea.value
            ? genreListTextArea.value.split(/\n/).filter(function (name) { return Boolean(name.trim()); })
            : [];
        slot.styles = nameListTextArea.value
            ? styleListTextArea.value.split(/\n/).filter(function (name) { return Boolean(name.trim()); })
            : [];
        slot.basses = nameListTextArea.value
            ? bassListTextArea.value.split(/\n/).filter(function (name) { return Boolean(name.trim()); })
            : [];
        slot.drums = nameListTextArea.value
            ? drumListTextArea.value.split(/\n/).filter(function (name) { return Boolean(name.trim()); })
            : [];
        slot.shouldRemoveWinnerFromNameList = removeNameFromListCheckbox.checked;
        soundEffects.mute = !enableSoundCheckbox.checked;
        onSettingsClose();
    });
    // Click handler for "Discard and close" button for setting page
    settingsCloseButton.addEventListener('click', onSettingsClose);
})();
