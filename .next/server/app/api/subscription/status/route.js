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
exports.id = "app/api/subscription/status/route";
exports.ids = ["app/api/subscription/status/route"];
exports.modules = {

/***/ "(rsc)/./app/api/subscription/status/route.ts":
/*!**********************************************!*\
  !*** ./app/api/subscription/status/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @clerk/nextjs/server */ \"(rsc)/./node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! stripe */ \"(rsc)/./node_modules/stripe/esm/stripe.esm.node.js\");\n/* harmony import */ var _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/config/subscriptions */ \"(rsc)/./config/subscriptions.ts\");\n\n\n\n\n// Initialize Stripe client\nconst stripe = new stripe__WEBPACK_IMPORTED_MODULE_1__[\"default\"](process.env.STRIPE_SECRET_KEY || '', {\n    apiVersion: '2025-02-24.acacia'\n});\nasync function GET() {\n    try {\n        const session = await (0,_clerk_nextjs_server__WEBPACK_IMPORTED_MODULE_3__.auth)();\n        const userId = session?.userId;\n        if (!userId) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                plan: _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.FREE,\n                isTrialing: false,\n                trialEndsAt: null,\n                status: \"inactive\"\n            }, {\n                status: 401\n            });\n        }\n        // Search for customer by userId in metadata\n        const customers = await stripe.customers.search({\n            query: `metadata[\"userId\"]:\"${userId}\"`\n        });\n        // If no customer found\n        if (customers.data.length === 0) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                plan: _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.FREE,\n                isTrialing: false,\n                trialEndsAt: null,\n                status: \"inactive\"\n            });\n        }\n        const customer = customers.data[0];\n        // Get active subscriptions for the customer\n        const subscriptions = await stripe.subscriptions.list({\n            customer: customer.id,\n            status: 'active'\n        });\n        // If no active subscriptions found\n        if (subscriptions.data.length === 0) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                plan: _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.FREE,\n                isTrialing: false,\n                trialEndsAt: null,\n                status: \"inactive\"\n            });\n        }\n        const subscription = subscriptions.data[0];\n        const priceId = subscription.items.data[0]?.price.id;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            plan: priceId === _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.PRO ? _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.PRO : _config_subscriptions__WEBPACK_IMPORTED_MODULE_2__.SUBSCRIPTION_PLANS.FREE,\n            isTrialing: subscription.trial_end ? new Date(subscription.trial_end * 1000) > new Date() : false,\n            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,\n            status: subscription.status\n        });\n    } catch (error) {\n        console.error(\"Fehler beim Laden des Subscription-Status:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Interner Server-Fehler\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3N1YnNjcmlwdGlvbi9zdGF0dXMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBMkM7QUFDQztBQUNoQjtBQUNnQztBQUU1RCwyQkFBMkI7QUFDM0IsTUFBTUksU0FBUyxJQUFJRiw4Q0FBTUEsQ0FBQ0csUUFBUUMsR0FBRyxDQUFDQyxpQkFBaUIsSUFBSSxJQUFJO0lBQzdEQyxZQUFZO0FBQ2Q7QUFFTyxlQUFlQztJQUNwQixJQUFJO1FBQ0YsTUFBTUMsVUFBVSxNQUFNVCwwREFBSUE7UUFDMUIsTUFBTVUsU0FBU0QsU0FBU0M7UUFFeEIsSUFBSSxDQUFDQSxRQUFRO1lBQ1gsT0FBT1gscURBQVlBLENBQUNZLElBQUksQ0FDdEI7Z0JBQ0VDLE1BQU1WLHFFQUFrQkEsQ0FBQ1csSUFBSTtnQkFDN0JDLFlBQVk7Z0JBQ1pDLGFBQWE7Z0JBQ2JDLFFBQVE7WUFDVixHQUNBO2dCQUFFQSxRQUFRO1lBQUk7UUFFbEI7UUFFQSw0Q0FBNEM7UUFDNUMsTUFBTUMsWUFBWSxNQUFNZCxPQUFPYyxTQUFTLENBQUNDLE1BQU0sQ0FBQztZQUM5Q0MsT0FBTyxDQUFDLG9CQUFvQixFQUFFVCxPQUFPLENBQUMsQ0FBQztRQUN6QztRQUVBLHVCQUF1QjtRQUN2QixJQUFJTyxVQUFVRyxJQUFJLENBQUNDLE1BQU0sS0FBSyxHQUFHO1lBQy9CLE9BQU90QixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO2dCQUN2QkMsTUFBTVYscUVBQWtCQSxDQUFDVyxJQUFJO2dCQUM3QkMsWUFBWTtnQkFDWkMsYUFBYTtnQkFDYkMsUUFBUTtZQUNWO1FBQ0Y7UUFFQSxNQUFNTSxXQUFXTCxVQUFVRyxJQUFJLENBQUMsRUFBRTtRQUVsQyw0Q0FBNEM7UUFDNUMsTUFBTUcsZ0JBQWdCLE1BQU1wQixPQUFPb0IsYUFBYSxDQUFDQyxJQUFJLENBQUM7WUFDcERGLFVBQVVBLFNBQVNHLEVBQUU7WUFDckJULFFBQVE7UUFDVjtRQUVBLG1DQUFtQztRQUNuQyxJQUFJTyxjQUFjSCxJQUFJLENBQUNDLE1BQU0sS0FBSyxHQUFHO1lBQ25DLE9BQU90QixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO2dCQUN2QkMsTUFBTVYscUVBQWtCQSxDQUFDVyxJQUFJO2dCQUM3QkMsWUFBWTtnQkFDWkMsYUFBYTtnQkFDYkMsUUFBUTtZQUNWO1FBQ0Y7UUFFQSxNQUFNVSxlQUFlSCxjQUFjSCxJQUFJLENBQUMsRUFBRTtRQUMxQyxNQUFNTyxVQUFVRCxhQUFhRSxLQUFLLENBQUNSLElBQUksQ0FBQyxFQUFFLEVBQUVTLE1BQU1KO1FBRWxELE9BQU8xQixxREFBWUEsQ0FBQ1ksSUFBSSxDQUFDO1lBQ3ZCQyxNQUFNZSxZQUFZekIscUVBQWtCQSxDQUFDNEIsR0FBRyxHQUFHNUIscUVBQWtCQSxDQUFDNEIsR0FBRyxHQUFHNUIscUVBQWtCQSxDQUFDVyxJQUFJO1lBQzNGQyxZQUFZWSxhQUFhSyxTQUFTLEdBQUcsSUFBSUMsS0FBS04sYUFBYUssU0FBUyxHQUFHLFFBQVEsSUFBSUMsU0FBUztZQUM1RmpCLGFBQWFXLGFBQWFLLFNBQVMsR0FBRyxJQUFJQyxLQUFLTixhQUFhSyxTQUFTLEdBQUcsTUFBTUUsV0FBVyxLQUFLO1lBQzlGakIsUUFBUVUsYUFBYVYsTUFBTTtRQUM3QjtJQUNGLEVBQUUsT0FBT2tCLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLDhDQUE4Q0E7UUFDNUQsT0FBT25DLHFEQUFZQSxDQUFDWSxJQUFJLENBQ3RCO1lBQUV1QixPQUFPO1FBQXlCLEdBQ2xDO1lBQUVsQixRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL3N0ZWZmZW5nb3R0bGUvRGVza3RvcC9uZXh0bGV2ZWx0cmFkZXJzL2FwcC9hcGkvc3Vic2NyaXB0aW9uL3N0YXR1cy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiQGNsZXJrL25leHRqcy9zZXJ2ZXJcIjtcbmltcG9ydCBTdHJpcGUgZnJvbSAnc3RyaXBlJztcbmltcG9ydCB7IFNVQlNDUklQVElPTl9QTEFOUyB9IGZyb20gXCJAL2NvbmZpZy9zdWJzY3JpcHRpb25zXCI7XG5cbi8vIEluaXRpYWxpemUgU3RyaXBlIGNsaWVudFxuY29uc3Qgc3RyaXBlID0gbmV3IFN0cmlwZShwcm9jZXNzLmVudi5TVFJJUEVfU0VDUkVUX0tFWSB8fCAnJywge1xuICBhcGlWZXJzaW9uOiAnMjAyNS0wMi0yNC5hY2FjaWEnLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGF1dGgoKTtcbiAgICBjb25zdCB1c2VySWQgPSBzZXNzaW9uPy51c2VySWQ7XG4gICAgXG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAge1xuICAgICAgICAgIHBsYW46IFNVQlNDUklQVElPTl9QTEFOUy5GUkVFLFxuICAgICAgICAgIGlzVHJpYWxpbmc6IGZhbHNlLFxuICAgICAgICAgIHRyaWFsRW5kc0F0OiBudWxsLFxuICAgICAgICAgIHN0YXR1czogXCJpbmFjdGl2ZVwiLFxuICAgICAgICB9LFxuICAgICAgICB7IHN0YXR1czogNDAxIH1cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gU2VhcmNoIGZvciBjdXN0b21lciBieSB1c2VySWQgaW4gbWV0YWRhdGFcbiAgICBjb25zdCBjdXN0b21lcnMgPSBhd2FpdCBzdHJpcGUuY3VzdG9tZXJzLnNlYXJjaCh7XG4gICAgICBxdWVyeTogYG1ldGFkYXRhW1widXNlcklkXCJdOlwiJHt1c2VySWR9XCJgLFxuICAgIH0pO1xuXG4gICAgLy8gSWYgbm8gY3VzdG9tZXIgZm91bmRcbiAgICBpZiAoY3VzdG9tZXJzLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgICBwbGFuOiBTVUJTQ1JJUFRJT05fUExBTlMuRlJFRSxcbiAgICAgICAgaXNUcmlhbGluZzogZmFsc2UsXG4gICAgICAgIHRyaWFsRW5kc0F0OiBudWxsLFxuICAgICAgICBzdGF0dXM6IFwiaW5hY3RpdmVcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbWVyID0gY3VzdG9tZXJzLmRhdGFbMF07XG5cbiAgICAvLyBHZXQgYWN0aXZlIHN1YnNjcmlwdGlvbnMgZm9yIHRoZSBjdXN0b21lclxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBhd2FpdCBzdHJpcGUuc3Vic2NyaXB0aW9ucy5saXN0KHtcbiAgICAgIGN1c3RvbWVyOiBjdXN0b21lci5pZCxcbiAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgfSk7XG5cbiAgICAvLyBJZiBubyBhY3RpdmUgc3Vic2NyaXB0aW9ucyBmb3VuZFxuICAgIGlmIChzdWJzY3JpcHRpb25zLmRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oe1xuICAgICAgICBwbGFuOiBTVUJTQ1JJUFRJT05fUExBTlMuRlJFRSxcbiAgICAgICAgaXNUcmlhbGluZzogZmFsc2UsXG4gICAgICAgIHRyaWFsRW5kc0F0OiBudWxsLFxuICAgICAgICBzdGF0dXM6IFwiaW5hY3RpdmVcIixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbnMuZGF0YVswXTtcbiAgICBjb25zdCBwcmljZUlkID0gc3Vic2NyaXB0aW9uLml0ZW1zLmRhdGFbMF0/LnByaWNlLmlkO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIHBsYW46IHByaWNlSWQgPT09IFNVQlNDUklQVElPTl9QTEFOUy5QUk8gPyBTVUJTQ1JJUFRJT05fUExBTlMuUFJPIDogU1VCU0NSSVBUSU9OX1BMQU5TLkZSRUUsXG4gICAgICBpc1RyaWFsaW5nOiBzdWJzY3JpcHRpb24udHJpYWxfZW5kID8gbmV3IERhdGUoc3Vic2NyaXB0aW9uLnRyaWFsX2VuZCAqIDEwMDApID4gbmV3IERhdGUoKSA6IGZhbHNlLFxuICAgICAgdHJpYWxFbmRzQXQ6IHN1YnNjcmlwdGlvbi50cmlhbF9lbmQgPyBuZXcgRGF0ZShzdWJzY3JpcHRpb24udHJpYWxfZW5kICogMTAwMCkudG9JU09TdHJpbmcoKSA6IG51bGwsXG4gICAgICBzdGF0dXM6IHN1YnNjcmlwdGlvbi5zdGF0dXMsXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkZlaGxlciBiZWltIExhZGVuIGRlcyBTdWJzY3JpcHRpb24tU3RhdHVzOlwiLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogXCJJbnRlcm5lciBTZXJ2ZXItRmVobGVyXCIgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJhdXRoIiwiU3RyaXBlIiwiU1VCU0NSSVBUSU9OX1BMQU5TIiwic3RyaXBlIiwicHJvY2VzcyIsImVudiIsIlNUUklQRV9TRUNSRVRfS0VZIiwiYXBpVmVyc2lvbiIsIkdFVCIsInNlc3Npb24iLCJ1c2VySWQiLCJqc29uIiwicGxhbiIsIkZSRUUiLCJpc1RyaWFsaW5nIiwidHJpYWxFbmRzQXQiLCJzdGF0dXMiLCJjdXN0b21lcnMiLCJzZWFyY2giLCJxdWVyeSIsImRhdGEiLCJsZW5ndGgiLCJjdXN0b21lciIsInN1YnNjcmlwdGlvbnMiLCJsaXN0IiwiaWQiLCJzdWJzY3JpcHRpb24iLCJwcmljZUlkIiwiaXRlbXMiLCJwcmljZSIsIlBSTyIsInRyaWFsX2VuZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/subscription/status/route.ts\n");

/***/ }),

/***/ "(rsc)/./config/subscriptions.ts":
/*!*********************************!*\
  !*** ./config/subscriptions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   FEATURES: () => (/* binding */ FEATURES),\n/* harmony export */   FEATURE_FLAGS: () => (/* binding */ FEATURE_FLAGS),\n/* harmony export */   LIMITATIONS: () => (/* binding */ LIMITATIONS),\n/* harmony export */   PLANS: () => (/* binding */ PLANS),\n/* harmony export */   SUBSCRIPTION_PLANS: () => (/* binding */ SUBSCRIPTION_PLANS)\n/* harmony export */ });\nconst SUBSCRIPTION_PLANS = {\n    FREE: \"free\",\n    PRO: \"pro\"\n};\nconst FEATURES = {\n    pivotAnalysis: {\n        free: \"Basis Pivot-Punkt-Analyse\",\n        pro: \"Erweiterte Pivot-Analysen\"\n    },\n    marketData: {\n        free: \"15-Minuten verzögerte Daten\",\n        pro: \"Echtzeit-Daten\"\n    },\n    aiAssistant: {\n        free: false,\n        pro: \"KI-Trading-Assistent\"\n    },\n    multiTimeframe: {\n        free: false,\n        pro: \"Multi-Timeframe-Analysen\"\n    },\n    watchlists: {\n        free: \"1 Watchlist\",\n        pro: \"Unbegrenzte Watchlists\"\n    },\n    support: {\n        free: \"Community Support\",\n        pro: \"Prioritäts-Support\"\n    }\n};\nconst PLANS = {\n    [SUBSCRIPTION_PLANS.FREE]: {\n        name: \"Basis\",\n        description: \"Perfekt zum Kennenlernen der Plattform\",\n        price: 0,\n        features: Object.entries(FEATURES).map(([key, value])=>({\n                name: key,\n                value: value.free\n            }))\n    },\n    [SUBSCRIPTION_PLANS.PRO]: {\n        name: \"Pro\",\n        description: \"Vollständiger Zugriff auf alle Trading-Features\",\n        price: 2900,\n        features: Object.entries(FEATURES).map(([key, value])=>({\n                name: key,\n                value: value.pro\n            }))\n    }\n};\nconst LIMITATIONS = {\n    [SUBSCRIPTION_PLANS.FREE]: {\n        maxWatchlists: 1,\n        maxSymbolsPerWatchlist: 10,\n        dataDelay: 900\n    },\n    [SUBSCRIPTION_PLANS.PRO]: {\n        maxWatchlists: Infinity,\n        maxSymbolsPerWatchlist: Infinity,\n        dataDelay: 0\n    }\n};\nconst FEATURE_FLAGS = {\n    canAccessRealTimeData: (plan)=>plan === SUBSCRIPTION_PLANS.PRO,\n    canAccessAdvancedPivots: (plan)=>plan === SUBSCRIPTION_PLANS.PRO,\n    canAccessMultiTimeframe: (plan)=>plan === SUBSCRIPTION_PLANS.PRO,\n    canAccessAiAssistant: (plan)=>plan === SUBSCRIPTION_PLANS.PRO,\n    canCreateUnlimitedWatchlists: (plan)=>plan === SUBSCRIPTION_PLANS.PRO,\n    canAccessApi: (plan)=>plan === SUBSCRIPTION_PLANS.PRO\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9jb25maWcvc3Vic2NyaXB0aW9ucy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFPLE1BQU1BLHFCQUFxQjtJQUNoQ0MsTUFBTTtJQUNOQyxLQUFLO0FBQ1AsRUFBVztBQUlKLE1BQU1DLFdBQVc7SUFDdEJDLGVBQWU7UUFDYkMsTUFBTTtRQUNOQyxLQUFLO0lBQ1A7SUFDQUMsWUFBWTtRQUNWRixNQUFNO1FBQ05DLEtBQUs7SUFDUDtJQUNBRSxhQUFhO1FBQ1hILE1BQU07UUFDTkMsS0FBSztJQUNQO0lBQ0FHLGdCQUFnQjtRQUNkSixNQUFNO1FBQ05DLEtBQUs7SUFDUDtJQUNBSSxZQUFZO1FBQ1ZMLE1BQU07UUFDTkMsS0FBSztJQUNQO0lBQ0FLLFNBQVM7UUFDUE4sTUFBTTtRQUNOQyxLQUFLO0lBQ1A7QUFDRixFQUFXO0FBRUosTUFBTU0sUUFBUTtJQUNuQixDQUFDWixtQkFBbUJDLElBQUksQ0FBQyxFQUFFO1FBQ3pCWSxNQUFNO1FBQ05DLGFBQWE7UUFDYkMsT0FBTztRQUNQQyxVQUFVQyxPQUFPQyxPQUFPLENBQUNmLFVBQVVnQixHQUFHLENBQUMsQ0FBQyxDQUFDQyxLQUFLQyxNQUFNLEdBQU07Z0JBQ3hEUixNQUFNTztnQkFDTkMsT0FBT0EsTUFBTWhCLElBQUk7WUFDbkI7SUFDRjtJQUNBLENBQUNMLG1CQUFtQkUsR0FBRyxDQUFDLEVBQUU7UUFDeEJXLE1BQU07UUFDTkMsYUFBYTtRQUNiQyxPQUFPO1FBQ1BDLFVBQVVDLE9BQU9DLE9BQU8sQ0FBQ2YsVUFBVWdCLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEtBQUtDLE1BQU0sR0FBTTtnQkFDeERSLE1BQU1PO2dCQUNOQyxPQUFPQSxNQUFNZixHQUFHO1lBQ2xCO0lBQ0Y7QUFDRixFQUFXO0FBRUosTUFBTWdCLGNBQWM7SUFDekIsQ0FBQ3RCLG1CQUFtQkMsSUFBSSxDQUFDLEVBQUU7UUFDekJzQixlQUFlO1FBQ2ZDLHdCQUF3QjtRQUN4QkMsV0FBVztJQUNiO0lBQ0EsQ0FBQ3pCLG1CQUFtQkUsR0FBRyxDQUFDLEVBQUU7UUFDeEJxQixlQUFlRztRQUNmRix3QkFBd0JFO1FBQ3hCRCxXQUFXO0lBQ2I7QUFDRixFQUFXO0FBRUosTUFBTUUsZ0JBQWdCO0lBQzNCQyx1QkFBdUIsQ0FBQ0MsT0FBMkJBLFNBQVM3QixtQkFBbUJFLEdBQUc7SUFDbEY0Qix5QkFBeUIsQ0FBQ0QsT0FBMkJBLFNBQVM3QixtQkFBbUJFLEdBQUc7SUFDcEY2Qix5QkFBeUIsQ0FBQ0YsT0FBMkJBLFNBQVM3QixtQkFBbUJFLEdBQUc7SUFDcEY4QixzQkFBc0IsQ0FBQ0gsT0FBMkJBLFNBQVM3QixtQkFBbUJFLEdBQUc7SUFDakYrQiw4QkFBOEIsQ0FBQ0osT0FBMkJBLFNBQVM3QixtQkFBbUJFLEdBQUc7SUFDekZnQyxjQUFjLENBQUNMLE9BQTJCQSxTQUFTN0IsbUJBQW1CRSxHQUFHO0FBQzNFLEVBQVciLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmZmVuZ290dGxlL0Rlc2t0b3AvbmV4dGxldmVsdHJhZGVycy9jb25maWcvc3Vic2NyaXB0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgU1VCU0NSSVBUSU9OX1BMQU5TID0ge1xuICBGUkVFOiBcImZyZWVcIixcbiAgUFJPOiBcInByb1wiLFxufSBhcyBjb25zdDtcblxuZXhwb3J0IHR5cGUgU3Vic2NyaXB0aW9uUGxhbiA9IHR5cGVvZiBTVUJTQ1JJUFRJT05fUExBTlNba2V5b2YgdHlwZW9mIFNVQlNDUklQVElPTl9QTEFOU107XG5cbmV4cG9ydCBjb25zdCBGRUFUVVJFUyA9IHtcbiAgcGl2b3RBbmFseXNpczoge1xuICAgIGZyZWU6IFwiQmFzaXMgUGl2b3QtUHVua3QtQW5hbHlzZVwiLFxuICAgIHBybzogXCJFcndlaXRlcnRlIFBpdm90LUFuYWx5c2VuXCIsXG4gIH0sXG4gIG1hcmtldERhdGE6IHtcbiAgICBmcmVlOiBcIjE1LU1pbnV0ZW4gdmVyesO2Z2VydGUgRGF0ZW5cIixcbiAgICBwcm86IFwiRWNodHplaXQtRGF0ZW5cIixcbiAgfSxcbiAgYWlBc3Npc3RhbnQ6IHtcbiAgICBmcmVlOiBmYWxzZSxcbiAgICBwcm86IFwiS0ktVHJhZGluZy1Bc3Npc3RlbnRcIixcbiAgfSxcbiAgbXVsdGlUaW1lZnJhbWU6IHtcbiAgICBmcmVlOiBmYWxzZSxcbiAgICBwcm86IFwiTXVsdGktVGltZWZyYW1lLUFuYWx5c2VuXCIsXG4gIH0sXG4gIHdhdGNobGlzdHM6IHtcbiAgICBmcmVlOiBcIjEgV2F0Y2hsaXN0XCIsXG4gICAgcHJvOiBcIlVuYmVncmVuenRlIFdhdGNobGlzdHNcIixcbiAgfSxcbiAgc3VwcG9ydDoge1xuICAgIGZyZWU6IFwiQ29tbXVuaXR5IFN1cHBvcnRcIixcbiAgICBwcm86IFwiUHJpb3JpdMOkdHMtU3VwcG9ydFwiLFxuICB9LFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IFBMQU5TID0ge1xuICBbU1VCU0NSSVBUSU9OX1BMQU5TLkZSRUVdOiB7XG4gICAgbmFtZTogXCJCYXNpc1wiLFxuICAgIGRlc2NyaXB0aW9uOiBcIlBlcmZla3QgenVtIEtlbm5lbmxlcm5lbiBkZXIgUGxhdHRmb3JtXCIsXG4gICAgcHJpY2U6IDAsXG4gICAgZmVhdHVyZXM6IE9iamVjdC5lbnRyaWVzKEZFQVRVUkVTKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcbiAgICAgIG5hbWU6IGtleSxcbiAgICAgIHZhbHVlOiB2YWx1ZS5mcmVlLFxuICAgIH0pKSxcbiAgfSxcbiAgW1NVQlNDUklQVElPTl9QTEFOUy5QUk9dOiB7XG4gICAgbmFtZTogXCJQcm9cIixcbiAgICBkZXNjcmlwdGlvbjogXCJWb2xsc3TDpG5kaWdlciBadWdyaWZmIGF1ZiBhbGxlIFRyYWRpbmctRmVhdHVyZXNcIixcbiAgICBwcmljZTogMjkwMCwgLy8gMjkuMDAgRVVSXG4gICAgZmVhdHVyZXM6IE9iamVjdC5lbnRyaWVzKEZFQVRVUkVTKS5tYXAoKFtrZXksIHZhbHVlXSkgPT4gKHtcbiAgICAgIG5hbWU6IGtleSxcbiAgICAgIHZhbHVlOiB2YWx1ZS5wcm8sXG4gICAgfSkpLFxuICB9LFxufSBhcyBjb25zdDtcblxuZXhwb3J0IGNvbnN0IExJTUlUQVRJT05TID0ge1xuICBbU1VCU0NSSVBUSU9OX1BMQU5TLkZSRUVdOiB7XG4gICAgbWF4V2F0Y2hsaXN0czogMSxcbiAgICBtYXhTeW1ib2xzUGVyV2F0Y2hsaXN0OiAxMCxcbiAgICBkYXRhRGVsYXk6IDkwMCwgLy8gMTUgbWludXRlcyBpbiBzZWNvbmRzXG4gIH0sXG4gIFtTVUJTQ1JJUFRJT05fUExBTlMuUFJPXToge1xuICAgIG1heFdhdGNobGlzdHM6IEluZmluaXR5LFxuICAgIG1heFN5bWJvbHNQZXJXYXRjaGxpc3Q6IEluZmluaXR5LFxuICAgIGRhdGFEZWxheTogMCwgLy8gUmVhbC10aW1lXG4gIH0sXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgY29uc3QgRkVBVFVSRV9GTEFHUyA9IHtcbiAgY2FuQWNjZXNzUmVhbFRpbWVEYXRhOiAocGxhbjogU3Vic2NyaXB0aW9uUGxhbikgPT4gcGxhbiA9PT0gU1VCU0NSSVBUSU9OX1BMQU5TLlBSTyxcbiAgY2FuQWNjZXNzQWR2YW5jZWRQaXZvdHM6IChwbGFuOiBTdWJzY3JpcHRpb25QbGFuKSA9PiBwbGFuID09PSBTVUJTQ1JJUFRJT05fUExBTlMuUFJPLFxuICBjYW5BY2Nlc3NNdWx0aVRpbWVmcmFtZTogKHBsYW46IFN1YnNjcmlwdGlvblBsYW4pID0+IHBsYW4gPT09IFNVQlNDUklQVElPTl9QTEFOUy5QUk8sXG4gIGNhbkFjY2Vzc0FpQXNzaXN0YW50OiAocGxhbjogU3Vic2NyaXB0aW9uUGxhbikgPT4gcGxhbiA9PT0gU1VCU0NSSVBUSU9OX1BMQU5TLlBSTyxcbiAgY2FuQ3JlYXRlVW5saW1pdGVkV2F0Y2hsaXN0czogKHBsYW46IFN1YnNjcmlwdGlvblBsYW4pID0+IHBsYW4gPT09IFNVQlNDUklQVElPTl9QTEFOUy5QUk8sXG4gIGNhbkFjY2Vzc0FwaTogKHBsYW46IFN1YnNjcmlwdGlvblBsYW4pID0+IHBsYW4gPT09IFNVQlNDUklQVElPTl9QTEFOUy5QUk8sXG59IGFzIGNvbnN0O1xuXG5leHBvcnQgdHlwZSBGZWF0dXJlRmxhZyA9IGtleW9mIHR5cGVvZiBGRUFUVVJFX0ZMQUdTOyJdLCJuYW1lcyI6WyJTVUJTQ1JJUFRJT05fUExBTlMiLCJGUkVFIiwiUFJPIiwiRkVBVFVSRVMiLCJwaXZvdEFuYWx5c2lzIiwiZnJlZSIsInBybyIsIm1hcmtldERhdGEiLCJhaUFzc2lzdGFudCIsIm11bHRpVGltZWZyYW1lIiwid2F0Y2hsaXN0cyIsInN1cHBvcnQiLCJQTEFOUyIsIm5hbWUiLCJkZXNjcmlwdGlvbiIsInByaWNlIiwiZmVhdHVyZXMiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwia2V5IiwidmFsdWUiLCJMSU1JVEFUSU9OUyIsIm1heFdhdGNobGlzdHMiLCJtYXhTeW1ib2xzUGVyV2F0Y2hsaXN0IiwiZGF0YURlbGF5IiwiSW5maW5pdHkiLCJGRUFUVVJFX0ZMQUdTIiwiY2FuQWNjZXNzUmVhbFRpbWVEYXRhIiwicGxhbiIsImNhbkFjY2Vzc0FkdmFuY2VkUGl2b3RzIiwiY2FuQWNjZXNzTXVsdGlUaW1lZnJhbWUiLCJjYW5BY2Nlc3NBaUFzc2lzdGFudCIsImNhbkNyZWF0ZVVubGltaXRlZFdhdGNobGlzdHMiLCJjYW5BY2Nlc3NBcGkiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./config/subscriptions.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsubscription%2Fstatus%2Froute&page=%2Fapi%2Fsubscription%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsubscription%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsubscription%2Fstatus%2Froute&page=%2Fapi%2Fsubscription%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsubscription%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_steffengottle_Desktop_nextleveltraders_app_api_subscription_status_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/subscription/status/route.ts */ \"(rsc)/./app/api/subscription/status/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/subscription/status/route\",\n        pathname: \"/api/subscription/status\",\n        filename: \"route\",\n        bundlePath: \"app/api/subscription/status/route\"\n    },\n    resolvedPagePath: \"/Users/steffengottle/Desktop/nextleveltraders/app/api/subscription/status/route.ts\",\n    nextConfigOutput,\n    userland: _Users_steffengottle_Desktop_nextleveltraders_app_api_subscription_status_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzdWJzY3JpcHRpb24lMkZzdGF0dXMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnN1YnNjcmlwdGlvbiUyRnN0YXR1cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnN1YnNjcmlwdGlvbiUyRnN0YXR1cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnN0ZWZmZW5nb3R0bGUlMkZEZXNrdG9wJTJGbmV4dGxldmVsdHJhZGVycyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZzdGVmZmVuZ290dGxlJTJGRGVza3RvcCUyRm5leHRsZXZlbHRyYWRlcnMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2tDO0FBQy9HO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvc3RlZmZlbmdvdHRsZS9EZXNrdG9wL25leHRsZXZlbHRyYWRlcnMvYXBwL2FwaS9zdWJzY3JpcHRpb24vc3RhdHVzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9zdWJzY3JpcHRpb24vc3RhdHVzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvc3Vic2NyaXB0aW9uL3N0YXR1c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvc3Vic2NyaXB0aW9uL3N0YXR1cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9zdGVmZmVuZ290dGxlL0Rlc2t0b3AvbmV4dGxldmVsdHJhZGVycy9hcHAvYXBpL3N1YnNjcmlwdGlvbi9zdGF0dXMvcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsubscription%2Fstatus%2Froute&page=%2Fapi%2Fsubscription%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsubscription%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@clerk","vendor-chunks/next","vendor-chunks/crypto-js","vendor-chunks/tslib","vendor-chunks/cookie","vendor-chunks/map-obj","vendor-chunks/no-case","vendor-chunks/lower-case","vendor-chunks/snakecase-keys","vendor-chunks/snake-case","vendor-chunks/dot-case","vendor-chunks/stripe","vendor-chunks/math-intrinsics","vendor-chunks/es-errors","vendor-chunks/qs","vendor-chunks/call-bind-apply-helpers","vendor-chunks/get-proto","vendor-chunks/object-inspect","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/side-channel","vendor-chunks/side-channel-weakmap","vendor-chunks/side-channel-map","vendor-chunks/side-channel-list","vendor-chunks/hasown","vendor-chunks/get-intrinsic","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/call-bound"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsubscription%2Fstatus%2Froute&page=%2Fapi%2Fsubscription%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsubscription%2Fstatus%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();