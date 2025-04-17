"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "@prisma/client/runtime/library":
/*!*************************************************!*\
  !*** external "@prisma/client/runtime/library" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Cwww%5Cfincontrol-web%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cwww%5Cfincontrol-web&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Cwww%5Cfincontrol-web%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cwww%5Cfincontrol-web&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_www_fincontrol_web_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"C:\\\\www\\\\fincontrol-web\\\\app\\\\api\\\\auth\\\\[...nextauth]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_www_fincontrol_web_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDd3d3JTVDZmluY29udHJvbC13ZWIlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUN3d3clNUNmaW5jb250cm9sLXdlYiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDZ0I7QUFDN0Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maW5jb250cm9sLz83OTJkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXHd3d1xcXFxmaW5jb250cm9sLXdlYlxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLm5leHRhdXRoXVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFx3d3dcXFxcZmluY29udHJvbC13ZWJcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5uZXh0YXV0aF1cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Cwww%5Cfincontrol-web%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cwww%5Cfincontrol-web&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/[...nextauth]/route.ts":
/*!*********************************************!*\
  !*** ./app/api/auth/[...nextauth]/route.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/auth */ \"(rsc)/./auth.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_1___default()(_auth__WEBPACK_IMPORTED_MODULE_0__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFxQztBQUNKO0FBRWpDLE1BQU1FLFVBQVVELGdEQUFRQSxDQUFDRCw4Q0FBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmNvbnRyb2wvLi9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50cz9jOGE0Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSBcIkAvYXV0aFwiO1xyXG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xyXG5cclxuY29uc3QgaGFuZGxlciA9IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcclxuXHJcbmV4cG9ydCB7IGhhbmRsZXIgYXMgR0VULCBoYW5kbGVyIGFzIFBPU1QgfTtcclxuIl0sIm5hbWVzIjpbImF1dGhPcHRpb25zIiwiTmV4dEF1dGgiLCJoYW5kbGVyIiwiR0VUIiwiUE9TVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./auth.config.ts":
/*!************************!*\
  !*** ./auth.config.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authConfig: () => (/* binding */ authConfig)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/lib/index.mjs\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n\n\n\n\nconst authConfig = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            async authorize (credentials) {\n                const parsedCredentials = zod__WEBPACK_IMPORTED_MODULE_3__.z.object({\n                    email: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().email(),\n                    password: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().min(6)\n                }).safeParse(credentials);\n                if (!parsedCredentials.success) return null;\n                const { email, password } = parsedCredentials.data;\n                const user = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.db.users.findUnique({\n                    where: {\n                        email\n                    }\n                });\n                if (!user || !await (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.compare)(password, user.password)) return null;\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role === \"ADMIN\" ? \"admin\" : \"user\",\n                    phone: user.phone,\n                    stripe_customer_id: user.stripe_customer_id ?? null,\n                    stripe_subscription_id: user.stripe_subscription_id ?? null,\n                    stripe_price_id: user.stripe_price_id ?? null,\n                    stripe_current_period_end: user.stripe_current_period_end ?? null,\n                    image: null,\n                    token: user.id\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async session ({ session, token }) {\n            session.user = {\n                ...session.user,\n                id: token.id,\n                name: token.name,\n                email: token.email,\n                role: token.role,\n                phone: token.phone,\n                stripe_customer_id: token.stripe_customer_id,\n                stripe_subscription_id: token.stripe_subscription_id,\n                stripe_price_id: token.stripe_price_id,\n                stripe_current_period_end: token.stripe_current_period_end\n            };\n            return session;\n        },\n        async jwt ({ token, user }) {\n            if (user) {\n                token = {\n                    ...token,\n                    ...user\n                };\n            }\n            return token;\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hdXRoLmNvbmZpZy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFtQztBQUV1QjtBQUNsQztBQUVNO0FBRXZCLE1BQU1JLGFBQWE7SUFDeEJDLFdBQVc7UUFDVEosMkVBQVdBLENBQUM7WUFDVixNQUFNSyxXQUFVQyxXQUFXO2dCQUN6QixNQUFNQyxvQkFBb0JOLGtDQUFDQSxDQUN4Qk8sTUFBTSxDQUFDO29CQUFFQyxPQUFPUixrQ0FBQ0EsQ0FBQ1MsTUFBTSxHQUFHRCxLQUFLO29CQUFJRSxVQUFVVixrQ0FBQ0EsQ0FBQ1MsTUFBTSxHQUFHRSxHQUFHLENBQUM7Z0JBQUcsR0FDaEVDLFNBQVMsQ0FBQ1A7Z0JBRWIsSUFBSSxDQUFDQyxrQkFBa0JPLE9BQU8sRUFBRSxPQUFPO2dCQUV2QyxNQUFNLEVBQUVMLEtBQUssRUFBRUUsUUFBUSxFQUFFLEdBQUdKLGtCQUFrQlEsSUFBSTtnQkFDbEQsTUFBTUMsT0FBTyxNQUFNZCx1Q0FBRUEsQ0FBQ2UsS0FBSyxDQUFDQyxVQUFVLENBQUM7b0JBQUVDLE9BQU87d0JBQUVWO29CQUFNO2dCQUFFO2dCQUMxRCxJQUFJLENBQUNPLFFBQVEsQ0FBRSxNQUFNakIsaURBQU9BLENBQUNZLFVBQVVLLEtBQUtMLFFBQVEsR0FBSSxPQUFPO2dCQUUvRCxPQUFPO29CQUNMUyxJQUFJSixLQUFLSSxFQUFFO29CQUNYQyxNQUFNTCxLQUFLSyxJQUFJO29CQUNmWixPQUFPTyxLQUFLUCxLQUFLO29CQUNqQmEsTUFBTU4sS0FBS00sSUFBSSxLQUFLLFVBQVUsVUFBVTtvQkFDeENDLE9BQU9QLEtBQUtPLEtBQUs7b0JBQ2pCQyxvQkFBb0JSLEtBQUtRLGtCQUFrQixJQUFJO29CQUMvQ0Msd0JBQXdCVCxLQUFLUyxzQkFBc0IsSUFBSTtvQkFDdkRDLGlCQUFpQlYsS0FBS1UsZUFBZSxJQUFJO29CQUN6Q0MsMkJBQTJCWCxLQUFLVyx5QkFBeUIsSUFBSTtvQkFDN0RDLE9BQU87b0JBQ1BDLE9BQU9iLEtBQUtJLEVBQUU7Z0JBQ2hCO1lBQ0Y7UUFDRjtLQUNEO0lBQ0RVLFdBQVc7UUFDVCxNQUFNQyxTQUFRLEVBQUVBLE9BQU8sRUFBRUYsS0FBSyxFQUFFO1lBQzlCRSxRQUFRZixJQUFJLEdBQUc7Z0JBQ2IsR0FBR2UsUUFBUWYsSUFBSTtnQkFDZkksSUFBSVMsTUFBTVQsRUFBRTtnQkFDWkMsTUFBTVEsTUFBTVIsSUFBSTtnQkFDaEJaLE9BQU9vQixNQUFNcEIsS0FBSztnQkFDbEJhLE1BQU1PLE1BQU1QLElBQUk7Z0JBQ2hCQyxPQUFPTSxNQUFNTixLQUFLO2dCQUNsQkMsb0JBQW9CSyxNQUFNTCxrQkFBa0I7Z0JBQzVDQyx3QkFBd0JJLE1BQU1KLHNCQUFzQjtnQkFDcERDLGlCQUFpQkcsTUFBTUgsZUFBZTtnQkFDdENDLDJCQUNFRSxNQUFNRix5QkFBeUI7WUFDbkM7WUFDQSxPQUFPSTtRQUNUO1FBQ0EsTUFBTUMsS0FBSSxFQUFFSCxLQUFLLEVBQUViLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSYSxRQUFRO29CQUFFLEdBQUdBLEtBQUs7b0JBQUUsR0FBR2IsSUFBSTtnQkFBQztZQUM5QjtZQUNBLE9BQU9hO1FBQ1Q7SUFDRjtJQUNBSSxPQUFPO1FBQ0xDLFFBQVE7SUFDVjtBQUNGLEVBQTJCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluY29udHJvbC8uL2F1dGguY29uZmlnLnRzPzQzMDgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcGFyZSB9IGZyb20gXCJiY3J5cHRqc1wiO1xyXG5pbXBvcnQgdHlwZSB7IE5leHRBdXRoQ29uZmlnIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xyXG5pbXBvcnQgQ3JlZGVudGlhbHMgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcclxuaW1wb3J0IHsgeiB9IGZyb20gXCJ6b2RcIjtcclxuXHJcbmltcG9ydCB7IGRiIH0gZnJvbSBcIkAvbGliL2RiXCI7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0aENvbmZpZyA9IHtcclxuICBwcm92aWRlcnM6IFtcclxuICAgIENyZWRlbnRpYWxzKHtcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgY29uc3QgcGFyc2VkQ3JlZGVudGlhbHMgPSB6XHJcbiAgICAgICAgICAub2JqZWN0KHsgZW1haWw6IHouc3RyaW5nKCkuZW1haWwoKSwgcGFzc3dvcmQ6IHouc3RyaW5nKCkubWluKDYpIH0pXHJcbiAgICAgICAgICAuc2FmZVBhcnNlKGNyZWRlbnRpYWxzKTtcclxuXHJcbiAgICAgICAgaWYgKCFwYXJzZWRDcmVkZW50aWFscy5zdWNjZXNzKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IHBhcnNlZENyZWRlbnRpYWxzLmRhdGE7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IGRiLnVzZXJzLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBlbWFpbCB9IH0pO1xyXG4gICAgICAgIGlmICghdXNlciB8fCAhKGF3YWl0IGNvbXBhcmUocGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpKSkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBpZDogdXNlci5pZCxcclxuICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcclxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxyXG4gICAgICAgICAgcm9sZTogdXNlci5yb2xlID09PSBcIkFETUlOXCIgPyBcImFkbWluXCIgOiBcInVzZXJcIixcclxuICAgICAgICAgIHBob25lOiB1c2VyLnBob25lLFxyXG4gICAgICAgICAgc3RyaXBlX2N1c3RvbWVyX2lkOiB1c2VyLnN0cmlwZV9jdXN0b21lcl9pZCA/PyBudWxsLFxyXG4gICAgICAgICAgc3RyaXBlX3N1YnNjcmlwdGlvbl9pZDogdXNlci5zdHJpcGVfc3Vic2NyaXB0aW9uX2lkID8/IG51bGwsXHJcbiAgICAgICAgICBzdHJpcGVfcHJpY2VfaWQ6IHVzZXIuc3RyaXBlX3ByaWNlX2lkID8/IG51bGwsXHJcbiAgICAgICAgICBzdHJpcGVfY3VycmVudF9wZXJpb2RfZW5kOiB1c2VyLnN0cmlwZV9jdXJyZW50X3BlcmlvZF9lbmQgPz8gbnVsbCxcclxuICAgICAgICAgIGltYWdlOiBudWxsLFxyXG4gICAgICAgICAgdG9rZW46IHVzZXIuaWQsIC8vIEFkZGVkIHRva2VuIGZpZWxkIHRvIG1hdGNoIFVzZXIgaW50ZXJmYWNlXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICBzZXNzaW9uLnVzZXIgPSB7XHJcbiAgICAgICAgLi4uc2Vzc2lvbi51c2VyLFxyXG4gICAgICAgIGlkOiB0b2tlbi5pZCBhcyBzdHJpbmcsXHJcbiAgICAgICAgbmFtZTogdG9rZW4ubmFtZSBhcyBzdHJpbmcsXHJcbiAgICAgICAgZW1haWw6IHRva2VuLmVtYWlsIGFzIHN0cmluZyxcclxuICAgICAgICByb2xlOiB0b2tlbi5yb2xlIGFzIFwiYWRtaW5cIiB8IFwidXNlclwiLFxyXG4gICAgICAgIHBob25lOiB0b2tlbi5waG9uZSBhcyBzdHJpbmcsXHJcbiAgICAgICAgc3RyaXBlX2N1c3RvbWVyX2lkOiB0b2tlbi5zdHJpcGVfY3VzdG9tZXJfaWQgYXMgc3RyaW5nIHwgbnVsbCxcclxuICAgICAgICBzdHJpcGVfc3Vic2NyaXB0aW9uX2lkOiB0b2tlbi5zdHJpcGVfc3Vic2NyaXB0aW9uX2lkIGFzIHN0cmluZyB8IG51bGwsXHJcbiAgICAgICAgc3RyaXBlX3ByaWNlX2lkOiB0b2tlbi5zdHJpcGVfcHJpY2VfaWQgYXMgc3RyaW5nIHwgbnVsbCxcclxuICAgICAgICBzdHJpcGVfY3VycmVudF9wZXJpb2RfZW5kOlxyXG4gICAgICAgICAgdG9rZW4uc3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZCBhcyBEYXRlIHwgbnVsbCxcclxuICAgICAgfTtcclxuICAgICAgcmV0dXJuIHNlc3Npb247XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuID0geyAuLi50b2tlbiwgLi4udXNlciB9O1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH0sXHJcbiAgfSxcclxuICBwYWdlczoge1xyXG4gICAgc2lnbkluOiBcIi9sb2dpblwiLFxyXG4gIH0sXHJcbn0gc2F0aXNmaWVzIE5leHRBdXRoQ29uZmlnO1xyXG4iXSwibmFtZXMiOlsiY29tcGFyZSIsIkNyZWRlbnRpYWxzIiwieiIsImRiIiwiYXV0aENvbmZpZyIsInByb3ZpZGVycyIsImF1dGhvcml6ZSIsImNyZWRlbnRpYWxzIiwicGFyc2VkQ3JlZGVudGlhbHMiLCJvYmplY3QiLCJlbWFpbCIsInN0cmluZyIsInBhc3N3b3JkIiwibWluIiwic2FmZVBhcnNlIiwic3VjY2VzcyIsImRhdGEiLCJ1c2VyIiwidXNlcnMiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpZCIsIm5hbWUiLCJyb2xlIiwicGhvbmUiLCJzdHJpcGVfY3VzdG9tZXJfaWQiLCJzdHJpcGVfc3Vic2NyaXB0aW9uX2lkIiwic3RyaXBlX3ByaWNlX2lkIiwic3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZCIsImltYWdlIiwidG9rZW4iLCJjYWxsYmFja3MiLCJzZXNzaW9uIiwiand0IiwicGFnZXMiLCJzaWduSW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./auth.config.ts\n");

/***/ }),

/***/ "(rsc)/./auth.ts":
/*!*****************!*\
  !*** ./auth.ts ***!
  \*****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   auth: () => (/* binding */ auth),\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   getAuth: () => (/* binding */ getAuth)\n/* harmony export */ });\n/* harmony import */ var _auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @auth/prisma-adapter */ \"(rsc)/./node_modules/@auth/prisma-adapter/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _auth_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./auth.config */ \"(rsc)/./auth.config.ts\");\n\n\n\n\n\nif (!process.env.NEXTAUTH_SECRET) {\n    throw new Error(\"NEXTAUTH_SECRET must be set\");\n}\nconst authOptions = {\n    adapter: (0,_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_0__.PrismaAdapter)(_lib_db__WEBPACK_IMPORTED_MODULE_3__.db),\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60,\n        updateAge: 24 * 60 * 60\n    },\n    providers: _auth_config__WEBPACK_IMPORTED_MODULE_4__.authConfig.providers,\n    pages: _auth_config__WEBPACK_IMPORTED_MODULE_4__.authConfig.pages,\n    callbacks: {\n        async session ({ session, token }) {\n            if (session?.user) {\n                session.user = {\n                    ...session.user,\n                    id: token.id,\n                    name: token.name,\n                    email: token.email,\n                    role: token.role,\n                    phone: token.phone,\n                    stripe_customer_id: token.stripe_customer_id,\n                    stripe_subscription_id: token.stripe_subscription_id,\n                    stripe_price_id: token.stripe_price_id,\n                    stripe_current_period_end: token.stripe_current_period_end\n                };\n            }\n            // Verificação e atualização dos dados da sessão\n            if (token.id) {\n                try {\n                    const dbUser = await _lib_db__WEBPACK_IMPORTED_MODULE_3__.db.users.findUnique({\n                        where: {\n                            id: token.id\n                        },\n                        select: {\n                            name: true,\n                            email: true,\n                            role: true\n                        }\n                    });\n                    if (dbUser && (dbUser.name !== token.name || dbUser.email !== token.email)) {\n                        session.user.name = dbUser.name;\n                        session.user.email = dbUser.email;\n                        session.user.role = dbUser.role === \"ADMIN\" ? \"admin\" : \"user\";\n                    }\n                } catch (error) {\n                    console.error(\"Erro ao verificar dados atualizados do usu\\xe1rio:\", error);\n                }\n            }\n            return session;\n        },\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.name = user.name;\n                token.email = user.email;\n                token.role = user.role;\n                token.phone = user.phone;\n                token.stripe_customer_id = user.stripe_customer_id;\n                token.stripe_subscription_id = user.stripe_subscription_id;\n                token.stripe_price_id = user.stripe_price_id;\n                token.stripe_current_period_end = user.stripe_current_period_end;\n            }\n            return token;\n        }\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_1___default()(authOptions));\nconst auth = (options)=>getAuth(options ?? {});\n// Função para obter a sessão atual\nasync function getAuth(options = {}) {\n    const session = await (0,next_auth_next__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(authOptions);\n    return session;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQyxVQUFrQkMsUUFBUUQsV0FBVyxDQUFDLEdBQUc7QUFFOUQsbUNBQW1DO0FBQzVCLGVBQWVDLFFBQVFELFVBQWUsQ0FBQyxDQUFDO0lBQzdDLE1BQU01QixVQUFVLE1BQU1ULGdFQUFnQkEsQ0FBQ087SUFDdkMsT0FBT0U7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmNvbnRyb2wvLi9hdXRoLnRzPzkyMzgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gXCJAYXV0aC9wcmlzbWEtYWRhcHRlclwiO1xyXG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xyXG5pbXBvcnQgdHlwZSB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gXCJuZXh0LWF1dGhcIjtcclxuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gXCJuZXh0LWF1dGgvbmV4dFwiO1xyXG5cclxuaW1wb3J0IHsgZGIgfSBmcm9tIFwiQC9saWIvZGJcIjtcclxuXHJcbmltcG9ydCB7IGF1dGhDb25maWcgfSBmcm9tIFwiLi9hdXRoLmNvbmZpZ1wiO1xyXG5cclxuaWYgKCFwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoXCJORVhUQVVUSF9TRUNSRVQgbXVzdCBiZSBzZXRcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIoZGIpIGFzIGFueSxcclxuICBzZXNzaW9uOiB7XHJcbiAgICBzdHJhdGVneTogXCJqd3RcIixcclxuICAgIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAsIC8vIDMwIGRheXNcclxuICAgIHVwZGF0ZUFnZTogMjQgKiA2MCAqIDYwLCAvLyBGb3LDp2EgYXR1YWxpemHDp8OjbyBhIGNhZGEgMjQgaG9yYXNcclxuICB9LFxyXG4gIHByb3ZpZGVyczogYXV0aENvbmZpZy5wcm92aWRlcnMsXHJcbiAgcGFnZXM6IGF1dGhDb25maWcucGFnZXMsXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICBpZiAoc2Vzc2lvbj8udXNlcikge1xyXG4gICAgICAgIHNlc3Npb24udXNlciA9IHtcclxuICAgICAgICAgIC4uLnNlc3Npb24udXNlcixcclxuICAgICAgICAgIGlkOiB0b2tlbi5pZCBhcyBzdHJpbmcsXHJcbiAgICAgICAgICBuYW1lOiB0b2tlbi5uYW1lIGFzIHN0cmluZyxcclxuICAgICAgICAgIGVtYWlsOiB0b2tlbi5lbWFpbCBhcyBzdHJpbmcsXHJcbiAgICAgICAgICByb2xlOiB0b2tlbi5yb2xlIGFzIFwiYWRtaW5cIiB8IFwidXNlclwiLFxyXG4gICAgICAgICAgcGhvbmU6IHRva2VuLnBob25lIGFzIHN0cmluZyxcclxuICAgICAgICAgIHN0cmlwZV9jdXN0b21lcl9pZDogdG9rZW4uc3RyaXBlX2N1c3RvbWVyX2lkIGFzIHN0cmluZyB8IG51bGwsXHJcbiAgICAgICAgICBzdHJpcGVfc3Vic2NyaXB0aW9uX2lkOiB0b2tlbi5zdHJpcGVfc3Vic2NyaXB0aW9uX2lkIGFzIHN0cmluZyB8IG51bGwsXHJcbiAgICAgICAgICBzdHJpcGVfcHJpY2VfaWQ6IHRva2VuLnN0cmlwZV9wcmljZV9pZCBhcyBzdHJpbmcgfCBudWxsLFxyXG4gICAgICAgICAgc3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZDpcclxuICAgICAgICAgICAgdG9rZW4uc3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZCBhcyBEYXRlIHwgbnVsbCxcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBWZXJpZmljYcOnw6NvIGUgYXR1YWxpemHDp8OjbyBkb3MgZGFkb3MgZGEgc2Vzc8Ojb1xyXG4gICAgICBpZiAodG9rZW4uaWQpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgY29uc3QgZGJVc2VyID0gYXdhaXQgZGIudXNlcnMuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgICAgIHdoZXJlOiB7IGlkOiB0b2tlbi5pZCBhcyBzdHJpbmcgfSxcclxuICAgICAgICAgICAgc2VsZWN0OiB7IG5hbWU6IHRydWUsIGVtYWlsOiB0cnVlLCByb2xlOiB0cnVlIH0sXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIGRiVXNlciAmJlxyXG4gICAgICAgICAgICAoZGJVc2VyLm5hbWUgIT09IHRva2VuLm5hbWUgfHwgZGJVc2VyLmVtYWlsICE9PSB0b2tlbi5lbWFpbClcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBzZXNzaW9uLnVzZXIubmFtZSA9IGRiVXNlci5uYW1lO1xyXG4gICAgICAgICAgICBzZXNzaW9uLnVzZXIuZW1haWwgPSBkYlVzZXIuZW1haWw7XHJcbiAgICAgICAgICAgIHNlc3Npb24udXNlci5yb2xlID0gZGJVc2VyLnJvbGUgPT09IFwiQURNSU5cIiA/IFwiYWRtaW5cIiA6IFwidXNlclwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICAgICBcIkVycm8gYW8gdmVyaWZpY2FyIGRhZG9zIGF0dWFsaXphZG9zIGRvIHVzdcOhcmlvOlwiLFxyXG4gICAgICAgICAgICBlcnJvcixcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gc2Vzc2lvbjtcclxuICAgIH0sXHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgdG9rZW4uaWQgPSB1c2VyLmlkO1xyXG4gICAgICAgIHRva2VuLm5hbWUgPSB1c2VyLm5hbWU7XHJcbiAgICAgICAgdG9rZW4uZW1haWwgPSB1c2VyLmVtYWlsO1xyXG4gICAgICAgIHRva2VuLnJvbGUgPSB1c2VyLnJvbGU7XHJcbiAgICAgICAgdG9rZW4ucGhvbmUgPSB1c2VyLnBob25lO1xyXG4gICAgICAgIHRva2VuLnN0cmlwZV9jdXN0b21lcl9pZCA9IHVzZXIuc3RyaXBlX2N1c3RvbWVyX2lkO1xyXG4gICAgICAgIHRva2VuLnN0cmlwZV9zdWJzY3JpcHRpb25faWQgPSB1c2VyLnN0cmlwZV9zdWJzY3JpcHRpb25faWQ7XHJcbiAgICAgICAgdG9rZW4uc3RyaXBlX3ByaWNlX2lkID0gdXNlci5zdHJpcGVfcHJpY2VfaWQ7XHJcbiAgICAgICAgdG9rZW4uc3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZCA9IHVzZXIuc3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBOZXh0QXV0aChhdXRoT3B0aW9ucyk7XHJcbmV4cG9ydCBjb25zdCBhdXRoID0gKG9wdGlvbnM/OiBhbnkpID0+IGdldEF1dGgob3B0aW9ucyA/PyB7fSk7XHJcblxyXG4vLyBGdW7Dp8OjbyBwYXJhIG9idGVyIGEgc2Vzc8OjbyBhdHVhbFxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXV0aChvcHRpb25zOiBhbnkgPSB7fSkge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcclxuICByZXR1cm4gc2Vzc2lvbjtcclxufVxyXG4iXSwibmFtZXMiOlsiUHJpc21hQWRhcHRlciIsIk5leHRBdXRoIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImRiIiwiYXV0aENvbmZpZyIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJFcnJvciIsImF1dGhPcHRpb25zIiwiYWRhcHRlciIsInNlc3Npb24iLCJzdHJhdGVneSIsIm1heEFnZSIsInVwZGF0ZUFnZSIsInByb3ZpZGVycyIsInBhZ2VzIiwiY2FsbGJhY2tzIiwidG9rZW4iLCJ1c2VyIiwiaWQiLCJuYW1lIiwiZW1haWwiLCJyb2xlIiwicGhvbmUiLCJzdHJpcGVfY3VzdG9tZXJfaWQiLCJzdHJpcGVfc3Vic2NyaXB0aW9uX2lkIiwic3RyaXBlX3ByaWNlX2lkIiwic3RyaXBlX2N1cnJlbnRfcGVyaW9kX2VuZCIsImRiVXNlciIsInVzZXJzIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwic2VsZWN0IiwiZXJyb3IiLCJjb25zb2xlIiwiand0Iiwic2VjcmV0IiwiYXV0aCIsIm9wdGlvbnMiLCJnZXRBdXRoIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   db: () => (/* binding */ db)\n/* harmony export */ });\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n\nif (!_prisma__WEBPACK_IMPORTED_MODULE_0__.prisma) {\n    throw new Error(\"Falha ao iniciar Prisma client\");\n}\nconst db = _prisma__WEBPACK_IMPORTED_MODULE_0__.prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBa0M7QUFFbEMsSUFBSSxDQUFDQSwyQ0FBTUEsRUFBRTtJQUNYLE1BQU0sSUFBSUMsTUFBTTtBQUNsQjtBQUVPLE1BQU1DLEtBQUtGLDJDQUFNQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmluY29udHJvbC8uL2xpYi9kYi50cz8xZGYwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByaXNtYSB9IGZyb20gXCIuL3ByaXNtYVwiO1xyXG5cclxuaWYgKCFwcmlzbWEpIHtcclxuICB0aHJvdyBuZXcgRXJyb3IoXCJGYWxoYSBhbyBpbmljaWFyIFByaXNtYSBjbGllbnRcIik7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkYiA9IHByaXNtYTtcclxuIl0sIm5hbWVzIjpbInByaXNtYSIsIkVycm9yIiwiZGIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst prismaClientSingleton = ()=>{\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n        log: [\n            \"error\"\n        ]\n    });\n};\nconst prisma = globalThis.prisma ?? prismaClientSingleton();\nif (true) {\n    globalThis.prisma = prisma;\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxNQUFNQyx3QkFBd0I7SUFDNUIsT0FBTyxJQUFJRCx3REFBWUEsQ0FBQztRQUN0QkUsS0FBSztZQUFDO1NBQVE7SUFDaEI7QUFDRjtBQU1BLE1BQU1DLFNBQVNDLFdBQVdELE1BQU0sSUFBSUY7QUFFcEMsSUFBSUksSUFBcUMsRUFBRTtJQUN6Q0QsV0FBV0QsTUFBTSxHQUFHQTtBQUN0QjtBQUVrQiIsInNvdXJjZXMiOlsid2VicGFjazovL2ZpbmNvbnRyb2wvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XHJcblxyXG5jb25zdCBwcmlzbWFDbGllbnRTaW5nbGV0b24gPSAoKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBQcmlzbWFDbGllbnQoe1xyXG4gICAgbG9nOiBbXCJlcnJvclwiXSxcclxuICB9KTtcclxufTtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICB2YXIgcHJpc21hOiB1bmRlZmluZWQgfCBSZXR1cm5UeXBlPHR5cGVvZiBwcmlzbWFDbGllbnRTaW5nbGV0b24+O1xyXG59XHJcblxyXG5jb25zdCBwcmlzbWEgPSBnbG9iYWxUaGlzLnByaXNtYSA/PyBwcmlzbWFDbGllbnRTaW5nbGV0b24oKTtcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIpIHtcclxuICBnbG9iYWxUaGlzLnByaXNtYSA9IHByaXNtYTtcclxufVxyXG5cclxuZXhwb3J0IHsgcHJpc21hIH07XHJcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWFDbGllbnRTaW5nbGV0b24iLCJsb2ciLCJwcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/zod","vendor-chunks/@opentelemetry","vendor-chunks/@babel","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/@auth","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=C%3A%5Cwww%5Cfincontrol-web%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cwww%5Cfincontrol-web&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();