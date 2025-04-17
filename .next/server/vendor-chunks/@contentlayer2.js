"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@contentlayer2";
exports.ids = ["vendor-chunks/@contentlayer2"];
exports.modules = {

/***/ "(rsc)/./node_modules/@contentlayer2/client/dist/guards.js":
/*!***********************************************************!*\
  !*** ./node_modules/@contentlayer2/client/dist/guards.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   guards: () => (/* binding */ guards),\n/* harmony export */   isType: () => (/* binding */ isType)\n/* harmony export */ });\nfunction is(typeName, _) {\n    if (_) {\n        if (Array.isArray(typeName)) {\n            // TODO make type field name dynamic (probably will require to code-gen the guard function)\n            return typeName.some((typeName_) => _?.type === typeName_);\n        }\n        else {\n            return typeName === _?.type;\n        }\n    }\n    else {\n        return (_) => is(typeName, _);\n    }\n}\nconst isType = is;\nconst guards = {\n    is,\n    // isType,\n    // hasAllFields,\n    // allFields,\n    hasField,\n    // withField,\n};\nfunction hasField(_, property) {\n    return _.hasOwnProperty(property);\n}\n//# sourceMappingURL=guards.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY2xpZW50L2Rpc3QvZ3VhcmRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluY29udHJvbC8uL25vZGVfbW9kdWxlcy9AY29udGVudGxheWVyMi9jbGllbnQvZGlzdC9ndWFyZHMuanM/ZTE0ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpcyh0eXBlTmFtZSwgXykge1xuICAgIGlmIChfKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHR5cGVOYW1lKSkge1xuICAgICAgICAgICAgLy8gVE9ETyBtYWtlIHR5cGUgZmllbGQgbmFtZSBkeW5hbWljIChwcm9iYWJseSB3aWxsIHJlcXVpcmUgdG8gY29kZS1nZW4gdGhlIGd1YXJkIGZ1bmN0aW9uKVxuICAgICAgICAgICAgcmV0dXJuIHR5cGVOYW1lLnNvbWUoKHR5cGVOYW1lXykgPT4gXz8udHlwZSA9PT0gdHlwZU5hbWVfKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlTmFtZSA9PT0gXz8udHlwZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChfKSA9PiBpcyh0eXBlTmFtZSwgXyk7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IGlzVHlwZSA9IGlzO1xuZXhwb3J0IGNvbnN0IGd1YXJkcyA9IHtcbiAgICBpcyxcbiAgICAvLyBpc1R5cGUsXG4gICAgLy8gaGFzQWxsRmllbGRzLFxuICAgIC8vIGFsbEZpZWxkcyxcbiAgICBoYXNGaWVsZCxcbiAgICAvLyB3aXRoRmllbGQsXG59O1xuZnVuY3Rpb24gaGFzRmllbGQoXywgcHJvcGVydHkpIHtcbiAgICByZXR1cm4gXy5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ndWFyZHMuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/@contentlayer2/client/dist/guards.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/@contentlayer2/client/dist/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@contentlayer2/client/dist/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   guards: () => (/* reexport safe */ _guards_js__WEBPACK_IMPORTED_MODULE_0__.guards),\n/* harmony export */   isType: () => (/* reexport safe */ _guards_js__WEBPACK_IMPORTED_MODULE_0__.isType),\n/* harmony export */   pick: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_1__.pick)\n/* harmony export */ });\n/* harmony import */ var _guards_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./guards.js */ \"(rsc)/./node_modules/@contentlayer2/client/dist/guards.js\");\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ \"(rsc)/./node_modules/@contentlayer2/client/dist/utils.js\");\n\n\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY2xpZW50L2Rpc3QvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBNEI7QUFDRDtBQUMzQiIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmNvbnRyb2wvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY2xpZW50L2Rpc3QvaW5kZXguanM/ZmYyMSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL2d1YXJkcy5qcyc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzLmpzJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/@contentlayer2/client/dist/index.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/@contentlayer2/client/dist/utils.js":
/*!**********************************************************!*\
  !*** ./node_modules/@contentlayer2/client/dist/utils.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pick: () => (/* binding */ pick)\n/* harmony export */ });\nconst pick = (obj, keys) => {\n    return keys.reduce((acc, key) => {\n        acc[key] = obj[key];\n        return acc;\n    }, {});\n};\n//# sourceMappingURL=utils.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY2xpZW50L2Rpc3QvdXRpbHMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSyxJQUFJO0FBQ1Q7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmNvbnRyb2wvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY2xpZW50L2Rpc3QvdXRpbHMuanM/MDc4MiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgcGljayA9IChvYmosIGtleXMpID0+IHtcbiAgICByZXR1cm4ga2V5cy5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gb2JqW2tleV07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXV0aWxzLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/@contentlayer2/client/dist/utils.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/@contentlayer2/core/dist/client.js":
/*!*********************************************************!*\
  !*** ./node_modules/@contentlayer2/core/dist/client.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getMDXComponent: () => (/* reexport safe */ mdx_bundler_client_index_js__WEBPACK_IMPORTED_MODULE_0__.getMDXComponent)\n/* harmony export */ });\n/* harmony import */ var mdx_bundler_client_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mdx-bundler/client/index.js */ \"mdx-bundler/client/index.js\");\n/* harmony import */ var mdx_bundler_client_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mdx_bundler_client_index_js__WEBPACK_IMPORTED_MODULE_0__);\n\n//# sourceMappingURL=client.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvQGNvbnRlbnRsYXllcjIvY29yZS9kaXN0L2NsaWVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEQ7QUFDOUQiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5jb250cm9sLy4vbm9kZV9tb2R1bGVzL0Bjb250ZW50bGF5ZXIyL2NvcmUvZGlzdC9jbGllbnQuanM/ZmZmZiJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgeyBnZXRNRFhDb21wb25lbnQgfSBmcm9tICdtZHgtYnVuZGxlci9jbGllbnQvaW5kZXguanMnO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y2xpZW50LmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/@contentlayer2/core/dist/client.js\n");

/***/ })

};
;