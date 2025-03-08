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
exports.id = "app/api/market-data/scan/route";
exports.ids = ["app/api/market-data/scan/route"];
exports.modules = {

/***/ "(rsc)/./app/api/market-data/scan/route.ts":
/*!*******************************************!*\
  !*** ./app/api/market-data/scan/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/supabase */ \"(rsc)/./lib/supabase.ts\");\n/* harmony import */ var _lib_market_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/market-data */ \"(rsc)/./lib/market-data.ts\");\n/* harmony import */ var _lib_gemini__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/gemini */ \"(rsc)/./lib/gemini.ts\");\n\n\n\n\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const { symbols } = body;\n        if (!symbols || !Array.isArray(symbols)) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Ungültige Symbole'\n            }, {\n                status: 400\n            });\n        }\n        // 1. Marktdaten für alle Symbole abrufen\n        const marketData = await Promise.all(symbols.map(async (symbol)=>{\n            const data = await (0,_lib_market_data__WEBPACK_IMPORTED_MODULE_2__.fetchMarketData)(symbol);\n            return {\n                symbol,\n                data\n            };\n        }));\n        // 2. Setup-Analyse für jedes Symbol durchführen\n        const setups = await Promise.all(marketData.map(async ({ symbol, data })=>{\n            const analysis = await (0,_lib_gemini__WEBPACK_IMPORTED_MODULE_3__.analyzeSetup)(symbol, data);\n            return {\n                symbol,\n                ...analysis\n            };\n        }));\n        // 3. Nur valide Setups mit gutem R/R zurückgeben\n        const validSetups = setups.filter((setup)=>setup.riskRewardRatio >= 2 && setup.probability > 0.6);\n        // 4. Setups in Datenbank speichern\n        const { error: dbError } = await _lib_supabase__WEBPACK_IMPORTED_MODULE_1__.supabase.from('setups').insert(validSetups.map((setup)=>({\n                symbol: setup.symbol,\n                type: setup.type,\n                entry_price: setup.entryPrice,\n                stop_loss: setup.stopLoss,\n                target: setup.target,\n                risk_reward_ratio: setup.riskRewardRatio,\n                probability: setup.probability,\n                created_at: new Date().toISOString()\n            })));\n        if (dbError) {\n            console.error('DB Error:', dbError);\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(validSetups);\n    } catch (error) {\n        console.error('Scan Error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Fehler beim Scannen der Setups'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL21hcmtldC1kYXRhL3NjYW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBd0Q7QUFDZDtBQUNVO0FBQ1I7QUFFckMsZUFBZUksS0FBS0MsR0FBZ0I7SUFDekMsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTUQsSUFBSUUsSUFBSTtRQUMzQixNQUFNLEVBQUVDLE9BQU8sRUFBRSxHQUFHRjtRQUVwQixJQUFJLENBQUNFLFdBQVcsQ0FBQ0MsTUFBTUMsT0FBTyxDQUFDRixVQUFVO1lBQ3ZDLE9BQU9SLHFEQUFZQSxDQUFDTyxJQUFJLENBQ3RCO2dCQUFFSSxPQUFPO1lBQW9CLEdBQzdCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSx5Q0FBeUM7UUFDekMsTUFBTUMsYUFBYSxNQUFNQyxRQUFRQyxHQUFHLENBQ2xDUCxRQUFRUSxHQUFHLENBQUMsT0FBT0M7WUFDakIsTUFBTUMsT0FBTyxNQUFNaEIsaUVBQWVBLENBQUNlO1lBQ25DLE9BQU87Z0JBQ0xBO2dCQUNBQztZQUNGO1FBQ0Y7UUFHRixnREFBZ0Q7UUFDaEQsTUFBTUMsU0FBUyxNQUFNTCxRQUFRQyxHQUFHLENBQzlCRixXQUFXRyxHQUFHLENBQUMsT0FBTyxFQUFFQyxNQUFNLEVBQUVDLElBQUksRUFBRTtZQUNwQyxNQUFNRSxXQUFXLE1BQU1qQix5REFBWUEsQ0FBQ2MsUUFBUUM7WUFDNUMsT0FBTztnQkFDTEQ7Z0JBQ0EsR0FBR0csUUFBUTtZQUNiO1FBQ0Y7UUFHRixpREFBaUQ7UUFDakQsTUFBTUMsY0FBY0YsT0FBT0csTUFBTSxDQUFDQyxDQUFBQSxRQUNoQ0EsTUFBTUMsZUFBZSxJQUFJLEtBQUtELE1BQU1FLFdBQVcsR0FBRztRQUdwRCxtQ0FBbUM7UUFDbkMsTUFBTSxFQUFFZCxPQUFPZSxPQUFPLEVBQUUsR0FBRyxNQUFNekIsbURBQVFBLENBQ3RDMEIsSUFBSSxDQUFDLFVBQ0xDLE1BQU0sQ0FBQ1AsWUFBWUwsR0FBRyxDQUFDTyxDQUFBQSxRQUFVO2dCQUNoQ04sUUFBUU0sTUFBTU4sTUFBTTtnQkFDcEJZLE1BQU1OLE1BQU1NLElBQUk7Z0JBQ2hCQyxhQUFhUCxNQUFNUSxVQUFVO2dCQUM3QkMsV0FBV1QsTUFBTVUsUUFBUTtnQkFDekJDLFFBQVFYLE1BQU1XLE1BQU07Z0JBQ3BCQyxtQkFBbUJaLE1BQU1DLGVBQWU7Z0JBQ3hDQyxhQUFhRixNQUFNRSxXQUFXO2dCQUM5QlcsWUFBWSxJQUFJQyxPQUFPQyxXQUFXO1lBQ3BDO1FBRUYsSUFBSVosU0FBUztZQUNYYSxRQUFRNUIsS0FBSyxDQUFDLGFBQWFlO1FBQzdCO1FBRUEsT0FBTzFCLHFEQUFZQSxDQUFDTyxJQUFJLENBQUNjO0lBRTNCLEVBQUUsT0FBT1YsT0FBTztRQUNkNEIsUUFBUTVCLEtBQUssQ0FBQyxlQUFlQTtRQUM3QixPQUFPWCxxREFBWUEsQ0FBQ08sSUFBSSxDQUN0QjtZQUFFSSxPQUFPO1FBQWlDLEdBQzFDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvc3RlZmZlbmdvdHRsZS9EZXNrdG9wL25leHRsZXZlbHRyYWRlcnMvYXBwL2FwaS9tYXJrZXQtZGF0YS9zY2FuL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBzdXBhYmFzZSB9IGZyb20gJ0AvbGliL3N1cGFiYXNlJztcbmltcG9ydCB7IGZldGNoTWFya2V0RGF0YSB9IGZyb20gJ0AvbGliL21hcmtldC1kYXRhJztcbmltcG9ydCB7IGFuYWx5emVTZXR1cCB9IGZyb20gJ0AvbGliL2dlbWluaSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKTtcbiAgICBjb25zdCB7IHN5bWJvbHMgfSA9IGJvZHk7XG5cbiAgICBpZiAoIXN5bWJvbHMgfHwgIUFycmF5LmlzQXJyYXkoc3ltYm9scykpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgICAgeyBlcnJvcjogJ1VuZ8O8bHRpZ2UgU3ltYm9sZScgfSxcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIDEuIE1hcmt0ZGF0ZW4gZsO8ciBhbGxlIFN5bWJvbGUgYWJydWZlblxuICAgIGNvbnN0IG1hcmtldERhdGEgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHN5bWJvbHMubWFwKGFzeW5jIChzeW1ib2wpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGZldGNoTWFya2V0RGF0YShzeW1ib2wpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICBkYXRhXG4gICAgICAgIH07XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyAyLiBTZXR1cC1BbmFseXNlIGbDvHIgamVkZXMgU3ltYm9sIGR1cmNoZsO8aHJlblxuICAgIGNvbnN0IHNldHVwcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgbWFya2V0RGF0YS5tYXAoYXN5bmMgKHsgc3ltYm9sLCBkYXRhIH0pID0+IHtcbiAgICAgICAgY29uc3QgYW5hbHlzaXMgPSBhd2FpdCBhbmFseXplU2V0dXAoc3ltYm9sLCBkYXRhKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzeW1ib2wsXG4gICAgICAgICAgLi4uYW5hbHlzaXNcbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIDMuIE51ciB2YWxpZGUgU2V0dXBzIG1pdCBndXRlbSBSL1IgenVyw7xja2dlYmVuXG4gICAgY29uc3QgdmFsaWRTZXR1cHMgPSBzZXR1cHMuZmlsdGVyKHNldHVwID0+IFxuICAgICAgc2V0dXAucmlza1Jld2FyZFJhdGlvID49IDIgJiYgc2V0dXAucHJvYmFiaWxpdHkgPiAwLjZcbiAgICApO1xuXG4gICAgLy8gNC4gU2V0dXBzIGluIERhdGVuYmFuayBzcGVpY2hlcm5cbiAgICBjb25zdCB7IGVycm9yOiBkYkVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxuICAgICAgLmZyb20oJ3NldHVwcycpXG4gICAgICAuaW5zZXJ0KHZhbGlkU2V0dXBzLm1hcChzZXR1cCA9PiAoe1xuICAgICAgICBzeW1ib2w6IHNldHVwLnN5bWJvbCxcbiAgICAgICAgdHlwZTogc2V0dXAudHlwZSxcbiAgICAgICAgZW50cnlfcHJpY2U6IHNldHVwLmVudHJ5UHJpY2UsXG4gICAgICAgIHN0b3BfbG9zczogc2V0dXAuc3RvcExvc3MsXG4gICAgICAgIHRhcmdldDogc2V0dXAudGFyZ2V0LFxuICAgICAgICByaXNrX3Jld2FyZF9yYXRpbzogc2V0dXAucmlza1Jld2FyZFJhdGlvLFxuICAgICAgICBwcm9iYWJpbGl0eTogc2V0dXAucHJvYmFiaWxpdHksXG4gICAgICAgIGNyZWF0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICAgICAgfSkpKTtcblxuICAgIGlmIChkYkVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdEQiBFcnJvcjonLCBkYkVycm9yKTtcbiAgICB9XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odmFsaWRTZXR1cHMpO1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignU2NhbiBFcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBlcnJvcjogJ0ZlaGxlciBiZWltIFNjYW5uZW4gZGVyIFNldHVwcycgfSxcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxuICAgICk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJzdXBhYmFzZSIsImZldGNoTWFya2V0RGF0YSIsImFuYWx5emVTZXR1cCIsIlBPU1QiLCJyZXEiLCJib2R5IiwianNvbiIsInN5bWJvbHMiLCJBcnJheSIsImlzQXJyYXkiLCJlcnJvciIsInN0YXR1cyIsIm1hcmtldERhdGEiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwic3ltYm9sIiwiZGF0YSIsInNldHVwcyIsImFuYWx5c2lzIiwidmFsaWRTZXR1cHMiLCJmaWx0ZXIiLCJzZXR1cCIsInJpc2tSZXdhcmRSYXRpbyIsInByb2JhYmlsaXR5IiwiZGJFcnJvciIsImZyb20iLCJpbnNlcnQiLCJ0eXBlIiwiZW50cnlfcHJpY2UiLCJlbnRyeVByaWNlIiwic3RvcF9sb3NzIiwic3RvcExvc3MiLCJ0YXJnZXQiLCJyaXNrX3Jld2FyZF9yYXRpbyIsImNyZWF0ZWRfYXQiLCJEYXRlIiwidG9JU09TdHJpbmciLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/market-data/scan/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/gemini.ts":
/*!***********************!*\
  !*** ./lib/gemini.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   analyzeSetup: () => (/* binding */ analyzeSetup)\n/* harmony export */ });\n/* harmony import */ var _market_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./market-data */ \"(rsc)/./lib/market-data.ts\");\n\nasync function analyzeSetup(symbol, marketData) {\n    try {\n        const { daily, hourly, current } = marketData;\n        // Standard Pivots für verschiedene Zeitrahmen berechnen\n        const dailyPivots = (0,_market_data__WEBPACK_IMPORTED_MODULE_0__.calculateStandardPivots)(daily[daily.length - 2]); // Gestern\n        const weeklyPivots = (0,_market_data__WEBPACK_IMPORTED_MODULE_0__.calculateStandardPivots)({\n            high: Math.max(...daily.slice(-5).map((d)=>d.high)),\n            low: Math.min(...daily.slice(-5).map((d)=>d.low)),\n            close: daily[daily.length - 1].close\n        });\n        // DeMark Pivots berechnen\n        const deMarkPivots = (0,_market_data__WEBPACK_IMPORTED_MODULE_0__.calculateDeMarkPivots)(daily[daily.length - 2]);\n        // Aktueller Kurs\n        const currentPrice = current.close;\n        // Long Setup prüfen\n        if (currentPrice > deMarkPivots.dmR1 && currentPrice > weeklyPivots.r1) {\n            const stopLoss = Math.min(dailyPivots.s1, deMarkPivots.dmS1);\n            const target = weeklyPivots.r2;\n            const risk = currentPrice - stopLoss;\n            const reward = target - currentPrice;\n            const riskRewardRatio = reward / risk;\n            if (riskRewardRatio >= 2) {\n                return {\n                    symbol,\n                    type: 'LONG',\n                    entryPrice: currentPrice,\n                    stopLoss,\n                    target,\n                    riskRewardRatio,\n                    probability: 0.7,\n                    reason: 'Ausbruch über DM R1 mit Weekly R1 Bestätigung'\n                };\n            }\n        }\n        // Short Setup prüfen\n        if (currentPrice < deMarkPivots.dmS1 && currentPrice < weeklyPivots.s1) {\n            const stopLoss = Math.max(dailyPivots.r1, deMarkPivots.dmR1);\n            const target = weeklyPivots.s2;\n            const risk = stopLoss - currentPrice;\n            const reward = currentPrice - target;\n            const riskRewardRatio = reward / risk;\n            if (riskRewardRatio >= 2) {\n                return {\n                    symbol,\n                    type: 'SHORT',\n                    entryPrice: currentPrice,\n                    stopLoss,\n                    target,\n                    riskRewardRatio,\n                    probability: 0.7,\n                    reason: 'Ausbruch unter DM S1 mit Weekly S1 Bestätigung'\n                };\n            }\n        }\n        return null; // Kein valides Setup gefunden\n    } catch (error) {\n        console.error(`Fehler bei der Setup-Analyse für ${symbol}:`, error);\n        return null;\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZ2VtaW5pLnRzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQStFO0FBYXhFLGVBQWVFLGFBQWFDLE1BQWMsRUFBRUMsVUFBZTtJQUNoRSxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxLQUFLLEVBQUVDLE1BQU0sRUFBRUMsT0FBTyxFQUFFLEdBQUdIO1FBRW5DLHdEQUF3RDtRQUN4RCxNQUFNSSxjQUFjUixxRUFBdUJBLENBQUNLLEtBQUssQ0FBQ0EsTUFBTUksTUFBTSxHQUFHLEVBQUUsR0FBRyxVQUFVO1FBQ2hGLE1BQU1DLGVBQWVWLHFFQUF1QkEsQ0FBQztZQUMzQ1csTUFBTUMsS0FBS0MsR0FBRyxJQUFJUixNQUFNUyxLQUFLLENBQUMsQ0FBQyxHQUFHQyxHQUFHLENBQUNDLENBQUFBLElBQUtBLEVBQUVMLElBQUk7WUFDakRNLEtBQUtMLEtBQUtNLEdBQUcsSUFBSWIsTUFBTVMsS0FBSyxDQUFDLENBQUMsR0FBR0MsR0FBRyxDQUFDQyxDQUFBQSxJQUFLQSxFQUFFQyxHQUFHO1lBQy9DRSxPQUFPZCxLQUFLLENBQUNBLE1BQU1JLE1BQU0sR0FBRyxFQUFFLENBQUNVLEtBQUs7UUFDdEM7UUFFQSwwQkFBMEI7UUFDMUIsTUFBTUMsZUFBZW5CLG1FQUFxQkEsQ0FBQ0ksS0FBSyxDQUFDQSxNQUFNSSxNQUFNLEdBQUcsRUFBRTtRQUVsRSxpQkFBaUI7UUFDakIsTUFBTVksZUFBZWQsUUFBUVksS0FBSztRQUVsQyxvQkFBb0I7UUFDcEIsSUFBSUUsZUFBZUQsYUFBYUUsSUFBSSxJQUFJRCxlQUFlWCxhQUFhYSxFQUFFLEVBQUU7WUFDdEUsTUFBTUMsV0FBV1osS0FBS00sR0FBRyxDQUFDVixZQUFZaUIsRUFBRSxFQUFFTCxhQUFhTSxJQUFJO1lBQzNELE1BQU1DLFNBQVNqQixhQUFha0IsRUFBRTtZQUM5QixNQUFNQyxPQUFPUixlQUFlRztZQUM1QixNQUFNTSxTQUFTSCxTQUFTTjtZQUN4QixNQUFNVSxrQkFBa0JELFNBQVNEO1lBRWpDLElBQUlFLG1CQUFtQixHQUFHO2dCQUN4QixPQUFPO29CQUNMNUI7b0JBQ0E2QixNQUFNO29CQUNOQyxZQUFZWjtvQkFDWkc7b0JBQ0FHO29CQUNBSTtvQkFDQUcsYUFBYTtvQkFDYkMsUUFBUTtnQkFDVjtZQUNGO1FBQ0Y7UUFFQSxxQkFBcUI7UUFDckIsSUFBSWQsZUFBZUQsYUFBYU0sSUFBSSxJQUFJTCxlQUFlWCxhQUFhZSxFQUFFLEVBQUU7WUFDdEUsTUFBTUQsV0FBV1osS0FBS0MsR0FBRyxDQUFDTCxZQUFZZSxFQUFFLEVBQUVILGFBQWFFLElBQUk7WUFDM0QsTUFBTUssU0FBU2pCLGFBQWEwQixFQUFFO1lBQzlCLE1BQU1QLE9BQU9MLFdBQVdIO1lBQ3hCLE1BQU1TLFNBQVNULGVBQWVNO1lBQzlCLE1BQU1JLGtCQUFrQkQsU0FBU0Q7WUFFakMsSUFBSUUsbUJBQW1CLEdBQUc7Z0JBQ3hCLE9BQU87b0JBQ0w1QjtvQkFDQTZCLE1BQU07b0JBQ05DLFlBQVlaO29CQUNaRztvQkFDQUc7b0JBQ0FJO29CQUNBRyxhQUFhO29CQUNiQyxRQUFRO2dCQUNWO1lBQ0Y7UUFDRjtRQUVBLE9BQU8sTUFBTSw4QkFBOEI7SUFFN0MsRUFBRSxPQUFPRSxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyxDQUFDLGlDQUFpQyxFQUFFbEMsT0FBTyxDQUFDLENBQUMsRUFBRWtDO1FBQzdELE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyIvVXNlcnMvc3RlZmZlbmdvdHRsZS9EZXNrdG9wL25leHRsZXZlbHRyYWRlcnMvbGliL2dlbWluaS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYWxjdWxhdGVTdGFuZGFyZFBpdm90cywgY2FsY3VsYXRlRGVNYXJrUGl2b3RzIH0gZnJvbSAnLi9tYXJrZXQtZGF0YSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0dXAge1xuICBzeW1ib2w6IHN0cmluZztcbiAgdHlwZTogJ0xPTkcnIHwgJ1NIT1JUJztcbiAgZW50cnlQcmljZTogbnVtYmVyO1xuICBzdG9wTG9zczogbnVtYmVyO1xuICB0YXJnZXQ6IG51bWJlcjtcbiAgcmlza1Jld2FyZFJhdGlvOiBudW1iZXI7XG4gIHByb2JhYmlsaXR5OiBudW1iZXI7XG4gIHJlYXNvbjogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYW5hbHl6ZVNldHVwKHN5bWJvbDogc3RyaW5nLCBtYXJrZXREYXRhOiBhbnkpOiBQcm9taXNlPFNldHVwIHwgbnVsbD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZGFpbHksIGhvdXJseSwgY3VycmVudCB9ID0gbWFya2V0RGF0YTtcblxuICAgIC8vIFN0YW5kYXJkIFBpdm90cyBmw7xyIHZlcnNjaGllZGVuZSBaZWl0cmFobWVuIGJlcmVjaG5lblxuICAgIGNvbnN0IGRhaWx5UGl2b3RzID0gY2FsY3VsYXRlU3RhbmRhcmRQaXZvdHMoZGFpbHlbZGFpbHkubGVuZ3RoIC0gMl0pOyAvLyBHZXN0ZXJuXG4gICAgY29uc3Qgd2Vla2x5UGl2b3RzID0gY2FsY3VsYXRlU3RhbmRhcmRQaXZvdHMoe1xuICAgICAgaGlnaDogTWF0aC5tYXgoLi4uZGFpbHkuc2xpY2UoLTUpLm1hcChkID0+IGQuaGlnaCkpLFxuICAgICAgbG93OiBNYXRoLm1pbiguLi5kYWlseS5zbGljZSgtNSkubWFwKGQgPT4gZC5sb3cpKSxcbiAgICAgIGNsb3NlOiBkYWlseVtkYWlseS5sZW5ndGggLSAxXS5jbG9zZVxuICAgIH0pO1xuXG4gICAgLy8gRGVNYXJrIFBpdm90cyBiZXJlY2huZW5cbiAgICBjb25zdCBkZU1hcmtQaXZvdHMgPSBjYWxjdWxhdGVEZU1hcmtQaXZvdHMoZGFpbHlbZGFpbHkubGVuZ3RoIC0gMl0pO1xuXG4gICAgLy8gQWt0dWVsbGVyIEt1cnNcbiAgICBjb25zdCBjdXJyZW50UHJpY2UgPSBjdXJyZW50LmNsb3NlO1xuXG4gICAgLy8gTG9uZyBTZXR1cCBwcsO8ZmVuXG4gICAgaWYgKGN1cnJlbnRQcmljZSA+IGRlTWFya1Bpdm90cy5kbVIxICYmIGN1cnJlbnRQcmljZSA+IHdlZWtseVBpdm90cy5yMSkge1xuICAgICAgY29uc3Qgc3RvcExvc3MgPSBNYXRoLm1pbihkYWlseVBpdm90cy5zMSwgZGVNYXJrUGl2b3RzLmRtUzEpO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gd2Vla2x5UGl2b3RzLnIyO1xuICAgICAgY29uc3QgcmlzayA9IGN1cnJlbnRQcmljZSAtIHN0b3BMb3NzO1xuICAgICAgY29uc3QgcmV3YXJkID0gdGFyZ2V0IC0gY3VycmVudFByaWNlO1xuICAgICAgY29uc3Qgcmlza1Jld2FyZFJhdGlvID0gcmV3YXJkIC8gcmlzaztcblxuICAgICAgaWYgKHJpc2tSZXdhcmRSYXRpbyA+PSAyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3ltYm9sLFxuICAgICAgICAgIHR5cGU6ICdMT05HJyxcbiAgICAgICAgICBlbnRyeVByaWNlOiBjdXJyZW50UHJpY2UsXG4gICAgICAgICAgc3RvcExvc3MsXG4gICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgIHJpc2tSZXdhcmRSYXRpbyxcbiAgICAgICAgICBwcm9iYWJpbGl0eTogMC43LCAvLyBCYXNpZXJlbmQgYXVmIE11bHRpLVRpbWVmcmFtZSBCZXN0w6R0aWd1bmdcbiAgICAgICAgICByZWFzb246ICdBdXNicnVjaCDDvGJlciBETSBSMSBtaXQgV2Vla2x5IFIxIEJlc3TDpHRpZ3VuZydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTaG9ydCBTZXR1cCBwcsO8ZmVuXG4gICAgaWYgKGN1cnJlbnRQcmljZSA8IGRlTWFya1Bpdm90cy5kbVMxICYmIGN1cnJlbnRQcmljZSA8IHdlZWtseVBpdm90cy5zMSkge1xuICAgICAgY29uc3Qgc3RvcExvc3MgPSBNYXRoLm1heChkYWlseVBpdm90cy5yMSwgZGVNYXJrUGl2b3RzLmRtUjEpO1xuICAgICAgY29uc3QgdGFyZ2V0ID0gd2Vla2x5UGl2b3RzLnMyO1xuICAgICAgY29uc3QgcmlzayA9IHN0b3BMb3NzIC0gY3VycmVudFByaWNlO1xuICAgICAgY29uc3QgcmV3YXJkID0gY3VycmVudFByaWNlIC0gdGFyZ2V0O1xuICAgICAgY29uc3Qgcmlza1Jld2FyZFJhdGlvID0gcmV3YXJkIC8gcmlzaztcblxuICAgICAgaWYgKHJpc2tSZXdhcmRSYXRpbyA+PSAyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3ltYm9sLFxuICAgICAgICAgIHR5cGU6ICdTSE9SVCcsXG4gICAgICAgICAgZW50cnlQcmljZTogY3VycmVudFByaWNlLFxuICAgICAgICAgIHN0b3BMb3NzLFxuICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICByaXNrUmV3YXJkUmF0aW8sXG4gICAgICAgICAgcHJvYmFiaWxpdHk6IDAuNyxcbiAgICAgICAgICByZWFzb246ICdBdXNicnVjaCB1bnRlciBETSBTMSBtaXQgV2Vla2x5IFMxIEJlc3TDpHRpZ3VuZydcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDsgLy8gS2VpbiB2YWxpZGVzIFNldHVwIGdlZnVuZGVuXG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBGZWhsZXIgYmVpIGRlciBTZXR1cC1BbmFseXNlIGbDvHIgJHtzeW1ib2x9OmAsIGVycm9yKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufSJdLCJuYW1lcyI6WyJjYWxjdWxhdGVTdGFuZGFyZFBpdm90cyIsImNhbGN1bGF0ZURlTWFya1Bpdm90cyIsImFuYWx5emVTZXR1cCIsInN5bWJvbCIsIm1hcmtldERhdGEiLCJkYWlseSIsImhvdXJseSIsImN1cnJlbnQiLCJkYWlseVBpdm90cyIsImxlbmd0aCIsIndlZWtseVBpdm90cyIsImhpZ2giLCJNYXRoIiwibWF4Iiwic2xpY2UiLCJtYXAiLCJkIiwibG93IiwibWluIiwiY2xvc2UiLCJkZU1hcmtQaXZvdHMiLCJjdXJyZW50UHJpY2UiLCJkbVIxIiwicjEiLCJzdG9wTG9zcyIsInMxIiwiZG1TMSIsInRhcmdldCIsInIyIiwicmlzayIsInJld2FyZCIsInJpc2tSZXdhcmRSYXRpbyIsInR5cGUiLCJlbnRyeVByaWNlIiwicHJvYmFiaWxpdHkiLCJyZWFzb24iLCJzMiIsImVycm9yIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/gemini.ts\n");

/***/ }),

/***/ "(rsc)/./lib/market-data.ts":
/*!****************************!*\
  !*** ./lib/market-data.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   calculateDeMarkPivots: () => (/* binding */ calculateDeMarkPivots),\n/* harmony export */   calculateStandardPivots: () => (/* binding */ calculateStandardPivots),\n/* harmony export */   fetchMarketData: () => (/* binding */ fetchMarketData)\n/* harmony export */ });\n/* harmony import */ var yahoo_finance2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! yahoo-finance2 */ \"(rsc)/./node_modules/yahoo-finance2/dist/esm/src/index-node.js\");\n\nasync function fetchMarketData(symbol) {\n    try {\n        // Tageskerzen der letzten 30 Tage abrufen\n        const dailyData = await yahoo_finance2__WEBPACK_IMPORTED_MODULE_0__[\"default\"].historical(symbol, {\n            period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),\n            period2: new Date(),\n            interval: '1d'\n        });\n        // Stunden-Kerzen des aktuellen Tages\n        const hourlyData = await yahoo_finance2__WEBPACK_IMPORTED_MODULE_0__[\"default\"].historical(symbol, {\n            period1: new Date(Date.now() - 24 * 60 * 60 * 1000),\n            period2: new Date(),\n            interval: '60m'\n        });\n        return {\n            daily: dailyData,\n            hourly: hourlyData,\n            current: hourlyData[hourlyData.length - 1]\n        };\n    } catch (error) {\n        console.error(`Fehler beim Abrufen der Marktdaten für ${symbol}:`, error);\n        throw error;\n    }\n}\n// Berechnet Standard Pivot Points\nfunction calculateStandardPivots(data) {\n    const high = data.high;\n    const low = data.low;\n    const close = data.close;\n    const pivot = (high + low + close) / 3;\n    const r1 = 2 * pivot - low;\n    const s1 = 2 * pivot - high;\n    const r2 = pivot + (high - low);\n    const s2 = pivot - (high - low);\n    return {\n        pivot,\n        r1,\n        s1,\n        r2,\n        s2\n    };\n}\n// Berechnet DeMark Pivot Points\nfunction calculateDeMarkPivots(data) {\n    const high = data.high;\n    const low = data.low;\n    const close = data.close;\n    const open = data.open;\n    let x;\n    if (close < open) {\n        x = (high + 2 * low + close) / 4;\n    } else {\n        x = (2 * high + low + close) / 4;\n    }\n    const dmR1 = x + (high - low);\n    const dmS1 = x - (high - low);\n    return {\n        x,\n        dmR1,\n        dmS1\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvbWFya2V0LWRhdGEudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUEwQztBQUVuQyxlQUFlQyxnQkFBZ0JDLE1BQWM7SUFDbEQsSUFBSTtRQUNGLDBDQUEwQztRQUMxQyxNQUFNQyxZQUFZLE1BQU1ILHNEQUFZQSxDQUFDSSxVQUFVLENBQUNGLFFBQVE7WUFDdERHLFNBQVMsSUFBSUMsS0FBS0EsS0FBS0MsR0FBRyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7WUFDbkRDLFNBQVMsSUFBSUY7WUFDYkcsVUFBVTtRQUNaO1FBRUEscUNBQXFDO1FBQ3JDLE1BQU1DLGFBQWEsTUFBTVYsc0RBQVlBLENBQUNJLFVBQVUsQ0FBQ0YsUUFBUTtZQUN2REcsU0FBUyxJQUFJQyxLQUFLQSxLQUFLQyxHQUFHLEtBQUssS0FBSyxLQUFLLEtBQUs7WUFDOUNDLFNBQVMsSUFBSUY7WUFDYkcsVUFBVTtRQUNaO1FBRUEsT0FBTztZQUNMRSxPQUFPUjtZQUNQUyxRQUFRRjtZQUNSRyxTQUFTSCxVQUFVLENBQUNBLFdBQVdJLE1BQU0sR0FBRyxFQUFFO1FBQzVDO0lBQ0YsRUFBRSxPQUFPQyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQyxDQUFDLHVDQUF1QyxFQUFFYixPQUFPLENBQUMsQ0FBQyxFQUFFYTtRQUNuRSxNQUFNQTtJQUNSO0FBQ0Y7QUFFQSxrQ0FBa0M7QUFDM0IsU0FBU0Usd0JBQXdCQyxJQUFTO0lBQy9DLE1BQU1DLE9BQU9ELEtBQUtDLElBQUk7SUFDdEIsTUFBTUMsTUFBTUYsS0FBS0UsR0FBRztJQUNwQixNQUFNQyxRQUFRSCxLQUFLRyxLQUFLO0lBRXhCLE1BQU1DLFFBQVEsQ0FBQ0gsT0FBT0MsTUFBTUMsS0FBSSxJQUFLO0lBQ3JDLE1BQU1FLEtBQUssSUFBS0QsUUFBU0Y7SUFDekIsTUFBTUksS0FBSyxJQUFLRixRQUFTSDtJQUN6QixNQUFNTSxLQUFLSCxRQUFTSCxDQUFBQSxPQUFPQyxHQUFFO0lBQzdCLE1BQU1NLEtBQUtKLFFBQVNILENBQUFBLE9BQU9DLEdBQUU7SUFFN0IsT0FBTztRQUFFRTtRQUFPQztRQUFJQztRQUFJQztRQUFJQztJQUFHO0FBQ2pDO0FBRUEsZ0NBQWdDO0FBQ3pCLFNBQVNDLHNCQUFzQlQsSUFBUztJQUM3QyxNQUFNQyxPQUFPRCxLQUFLQyxJQUFJO0lBQ3RCLE1BQU1DLE1BQU1GLEtBQUtFLEdBQUc7SUFDcEIsTUFBTUMsUUFBUUgsS0FBS0csS0FBSztJQUN4QixNQUFNTyxPQUFPVixLQUFLVSxJQUFJO0lBRXRCLElBQUlDO0lBQ0osSUFBSVIsUUFBUU8sTUFBTTtRQUNoQkMsSUFBSSxDQUFDVixPQUFRLElBQUlDLE1BQU9DLEtBQUksSUFBSztJQUNuQyxPQUFPO1FBQ0xRLElBQUksQ0FBQyxJQUFLVixPQUFRQyxNQUFNQyxLQUFJLElBQUs7SUFDbkM7SUFFQSxNQUFNUyxPQUFPRCxJQUFLVixDQUFBQSxPQUFPQyxHQUFFO0lBQzNCLE1BQU1XLE9BQU9GLElBQUtWLENBQUFBLE9BQU9DLEdBQUU7SUFFM0IsT0FBTztRQUFFUztRQUFHQztRQUFNQztJQUFLO0FBQ3pCIiwic291cmNlcyI6WyIvVXNlcnMvc3RlZmZlbmdvdHRsZS9EZXNrdG9wL25leHRsZXZlbHRyYWRlcnMvbGliL21hcmtldC1kYXRhLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB5YWhvb0ZpbmFuY2UgZnJvbSAneWFob28tZmluYW5jZTInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hNYXJrZXREYXRhKHN5bWJvbDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgLy8gVGFnZXNrZXJ6ZW4gZGVyIGxldHp0ZW4gMzAgVGFnZSBhYnJ1ZmVuXG4gICAgY29uc3QgZGFpbHlEYXRhID0gYXdhaXQgeWFob29GaW5hbmNlLmhpc3RvcmljYWwoc3ltYm9sLCB7XG4gICAgICBwZXJpb2QxOiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwKSxcbiAgICAgIHBlcmlvZDI6IG5ldyBEYXRlKCksXG4gICAgICBpbnRlcnZhbDogJzFkJ1xuICAgIH0pO1xuXG4gICAgLy8gU3R1bmRlbi1LZXJ6ZW4gZGVzIGFrdHVlbGxlbiBUYWdlc1xuICAgIGNvbnN0IGhvdXJseURhdGEgPSBhd2FpdCB5YWhvb0ZpbmFuY2UuaGlzdG9yaWNhbChzeW1ib2wsIHtcbiAgICAgIHBlcmlvZDE6IG5ldyBEYXRlKERhdGUubm93KCkgLSAyNCAqIDYwICogNjAgKiAxMDAwKSxcbiAgICAgIHBlcmlvZDI6IG5ldyBEYXRlKCksXG4gICAgICBpbnRlcnZhbDogJzYwbSdcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICBkYWlseTogZGFpbHlEYXRhLFxuICAgICAgaG91cmx5OiBob3VybHlEYXRhLFxuICAgICAgY3VycmVudDogaG91cmx5RGF0YVtob3VybHlEYXRhLmxlbmd0aCAtIDFdXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBGZWhsZXIgYmVpbSBBYnJ1ZmVuIGRlciBNYXJrdGRhdGVuIGbDvHIgJHtzeW1ib2x9OmAsIGVycm9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG4vLyBCZXJlY2huZXQgU3RhbmRhcmQgUGl2b3QgUG9pbnRzXG5leHBvcnQgZnVuY3Rpb24gY2FsY3VsYXRlU3RhbmRhcmRQaXZvdHMoZGF0YTogYW55KSB7XG4gIGNvbnN0IGhpZ2ggPSBkYXRhLmhpZ2g7XG4gIGNvbnN0IGxvdyA9IGRhdGEubG93O1xuICBjb25zdCBjbG9zZSA9IGRhdGEuY2xvc2U7XG5cbiAgY29uc3QgcGl2b3QgPSAoaGlnaCArIGxvdyArIGNsb3NlKSAvIDM7XG4gIGNvbnN0IHIxID0gKDIgKiBwaXZvdCkgLSBsb3c7XG4gIGNvbnN0IHMxID0gKDIgKiBwaXZvdCkgLSBoaWdoO1xuICBjb25zdCByMiA9IHBpdm90ICsgKGhpZ2ggLSBsb3cpO1xuICBjb25zdCBzMiA9IHBpdm90IC0gKGhpZ2ggLSBsb3cpO1xuXG4gIHJldHVybiB7IHBpdm90LCByMSwgczEsIHIyLCBzMiB9O1xufVxuXG4vLyBCZXJlY2huZXQgRGVNYXJrIFBpdm90IFBvaW50c1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZURlTWFya1Bpdm90cyhkYXRhOiBhbnkpIHtcbiAgY29uc3QgaGlnaCA9IGRhdGEuaGlnaDtcbiAgY29uc3QgbG93ID0gZGF0YS5sb3c7XG4gIGNvbnN0IGNsb3NlID0gZGF0YS5jbG9zZTtcbiAgY29uc3Qgb3BlbiA9IGRhdGEub3BlbjtcblxuICBsZXQgeDtcbiAgaWYgKGNsb3NlIDwgb3Blbikge1xuICAgIHggPSAoaGlnaCArICgyICogbG93KSArIGNsb3NlKSAvIDQ7XG4gIH0gZWxzZSB7XG4gICAgeCA9ICgoMiAqIGhpZ2gpICsgbG93ICsgY2xvc2UpIC8gNDtcbiAgfVxuXG4gIGNvbnN0IGRtUjEgPSB4ICsgKGhpZ2ggLSBsb3cpO1xuICBjb25zdCBkbVMxID0geCAtIChoaWdoIC0gbG93KTtcblxuICByZXR1cm4geyB4LCBkbVIxLCBkbVMxIH07XG59Il0sIm5hbWVzIjpbInlhaG9vRmluYW5jZSIsImZldGNoTWFya2V0RGF0YSIsInN5bWJvbCIsImRhaWx5RGF0YSIsImhpc3RvcmljYWwiLCJwZXJpb2QxIiwiRGF0ZSIsIm5vdyIsInBlcmlvZDIiLCJpbnRlcnZhbCIsImhvdXJseURhdGEiLCJkYWlseSIsImhvdXJseSIsImN1cnJlbnQiLCJsZW5ndGgiLCJlcnJvciIsImNvbnNvbGUiLCJjYWxjdWxhdGVTdGFuZGFyZFBpdm90cyIsImRhdGEiLCJoaWdoIiwibG93IiwiY2xvc2UiLCJwaXZvdCIsInIxIiwiczEiLCJyMiIsInMyIiwiY2FsY3VsYXRlRGVNYXJrUGl2b3RzIiwib3BlbiIsIngiLCJkbVIxIiwiZG1TMSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/market-data.ts\n");

/***/ }),

/***/ "(rsc)/./lib/supabase.ts":
/*!*************************!*\
  !*** ./lib/supabase.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createClientWithAuth: () => (/* binding */ createClientWithAuth),\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n\n// Supabase-Client erstellen\nconst supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;\nconst supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;\nif (!supabaseUrl || !supabaseAnonKey) {\n    console.error('Supabase Konfigurationsfehler:', {\n        url: supabaseUrl ? 'vorhanden' : 'fehlt',\n        anonKey: supabaseAnonKey ? 'vorhanden' : 'fehlt'\n    });\n    throw new Error('Supabase Umgebungsvariablen fehlen. Bitte stelle sicher, dass NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local gesetzt sind.');\n}\n// Erstelle einen Supabase Client ohne Auth (da wir Clerk für Auth verwenden)\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n    db: {\n        schema: 'public'\n    },\n    global: {\n        headers: {\n            'x-application-name': 'nextleveltraders'\n        }\n    }\n});\n// Exportiere eine Funktion, die den Supabase Client mit einem Clerk Session Token erstellt\nfunction createClientWithAuth(clerkToken) {\n    return (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n        db: {\n            schema: 'public'\n        },\n        global: {\n            headers: {\n                'x-application-name': 'nextleveltraders',\n                ...clerkToken ? {\n                    Authorization: `Bearer ${clerkToken}`\n                } : {}\n            }\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2UudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXFEO0FBbURyRCw0QkFBNEI7QUFDNUIsTUFBTUMsY0FBY0MsUUFBUUMsR0FBRyxDQUFDQyx3QkFBd0I7QUFDeEQsTUFBTUMsa0JBQWtCSCxRQUFRQyxHQUFHLENBQUNHLDZCQUE2QjtBQUVqRSxJQUFJLENBQUNMLGVBQWUsQ0FBQ0ksaUJBQWlCO0lBQ3BDRSxRQUFRQyxLQUFLLENBQUMsa0NBQWtDO1FBQzlDQyxLQUFLUixjQUFjLGNBQWM7UUFDakNTLFNBQVNMLGtCQUFrQixjQUFjO0lBQzNDO0lBQ0EsTUFBTSxJQUFJTSxNQUNSO0FBRUo7QUFFQSw2RUFBNkU7QUFDdEUsTUFBTUMsV0FBV1osbUVBQVlBLENBQVdDLGFBQWFJLGlCQUFpQjtJQUMzRVEsSUFBSTtRQUNGQyxRQUFRO0lBQ1Y7SUFDQUMsUUFBUTtRQUNOQyxTQUFTO1lBQ1Asc0JBQXNCO1FBQ3hCO0lBQ0Y7QUFDRixHQUFHO0FBRUgsMkZBQTJGO0FBQ3BGLFNBQVNDLHFCQUFxQkMsVUFBbUI7SUFDdEQsT0FBT2xCLG1FQUFZQSxDQUFXQyxhQUFhSSxpQkFBaUI7UUFDMURRLElBQUk7WUFDRkMsUUFBUTtRQUNWO1FBQ0FDLFFBQVE7WUFDTkMsU0FBUztnQkFDUCxzQkFBc0I7Z0JBQ3RCLEdBQUlFLGFBQWE7b0JBQUVDLGVBQWUsQ0FBQyxPQUFPLEVBQUVELFlBQVk7Z0JBQUMsSUFBSSxDQUFDLENBQUM7WUFDakU7UUFDRjtJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmZmVuZ290dGxlL0Rlc2t0b3AvbmV4dGxldmVsdHJhZGVycy9saWIvc3VwYWJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlQ2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL3N1cGFiYXNlLWpzJztcblxuLy8gVHlwLURlZmluaXRpb24gZsO8ciBTdXBhYmFzZS1UYWJlbGxlbiwgZGllIHdpciBzcMOkdGVyIGVyd2VpdGVybiBrw7ZubmVuXG5leHBvcnQgdHlwZSBEYXRhYmFzZSA9IHtcbiAgcHVibGljOiB7XG4gICAgVGFibGVzOiB7XG4gICAgICB3YXRjaGxpc3RzOiB7XG4gICAgICAgIFJvdzoge1xuICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgdXNlcl9pZDogc3RyaW5nO1xuICAgICAgICAgIG5hbWU6IHN0cmluZztcbiAgICAgICAgICBjcmVhdGVkX2F0OiBzdHJpbmc7XG4gICAgICAgICAgdXBkYXRlZF9hdDogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgICBJbnNlcnQ6IHtcbiAgICAgICAgICBpZD86IHN0cmluZztcbiAgICAgICAgICB1c2VyX2lkOiBzdHJpbmc7XG4gICAgICAgICAgbmFtZTogc3RyaW5nO1xuICAgICAgICAgIGNyZWF0ZWRfYXQ/OiBzdHJpbmc7XG4gICAgICAgICAgdXBkYXRlZF9hdD86IHN0cmluZztcbiAgICAgICAgfTtcbiAgICAgICAgVXBkYXRlOiB7XG4gICAgICAgICAgaWQ/OiBzdHJpbmc7XG4gICAgICAgICAgdXNlcl9pZD86IHN0cmluZztcbiAgICAgICAgICBuYW1lPzogc3RyaW5nO1xuICAgICAgICAgIHVwZGF0ZWRfYXQ/OiBzdHJpbmc7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgd2F0Y2hsaXN0X2l0ZW1zOiB7XG4gICAgICAgIFJvdzoge1xuICAgICAgICAgIGlkOiBzdHJpbmc7XG4gICAgICAgICAgd2F0Y2hsaXN0X2lkOiBzdHJpbmc7XG4gICAgICAgICAgc3ltYm9sOiBzdHJpbmc7XG4gICAgICAgICAgY3JlYXRlZF9hdDogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgICBJbnNlcnQ6IHtcbiAgICAgICAgICBpZD86IHN0cmluZztcbiAgICAgICAgICB3YXRjaGxpc3RfaWQ6IHN0cmluZztcbiAgICAgICAgICBzeW1ib2w6IHN0cmluZztcbiAgICAgICAgICBjcmVhdGVkX2F0Pzogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgICBVcGRhdGU6IHtcbiAgICAgICAgICBpZD86IHN0cmluZztcbiAgICAgICAgICB3YXRjaGxpc3RfaWQ/OiBzdHJpbmc7XG4gICAgICAgICAgc3ltYm9sPzogc3RyaW5nO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9O1xuICB9O1xufTtcblxuLy8gU3VwYWJhc2UtQ2xpZW50IGVyc3RlbGxlblxuY29uc3Qgc3VwYWJhc2VVcmwgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkw7XG5jb25zdCBzdXBhYmFzZUFub25LZXkgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWTtcblxuaWYgKCFzdXBhYmFzZVVybCB8fCAhc3VwYWJhc2VBbm9uS2V5KSB7XG4gIGNvbnNvbGUuZXJyb3IoJ1N1cGFiYXNlIEtvbmZpZ3VyYXRpb25zZmVobGVyOicsIHtcbiAgICB1cmw6IHN1cGFiYXNlVXJsID8gJ3ZvcmhhbmRlbicgOiAnZmVobHQnLFxuICAgIGFub25LZXk6IHN1cGFiYXNlQW5vbktleSA/ICd2b3JoYW5kZW4nIDogJ2ZlaGx0J1xuICB9KTtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdTdXBhYmFzZSBVbWdlYnVuZ3N2YXJpYWJsZW4gZmVobGVuLiBCaXR0ZSBzdGVsbGUgc2ljaGVyLCBkYXNzIE5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCB1bmQgTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkgaW4gLmVudi5sb2NhbCBnZXNldHp0IHNpbmQuJ1xuICApO1xufVxuXG4vLyBFcnN0ZWxsZSBlaW5lbiBTdXBhYmFzZSBDbGllbnQgb2huZSBBdXRoIChkYSB3aXIgQ2xlcmsgZsO8ciBBdXRoIHZlcndlbmRlbilcbmV4cG9ydCBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudDxEYXRhYmFzZT4oc3VwYWJhc2VVcmwsIHN1cGFiYXNlQW5vbktleSwge1xuICBkYjoge1xuICAgIHNjaGVtYTogJ3B1YmxpYydcbiAgfSxcbiAgZ2xvYmFsOiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgJ3gtYXBwbGljYXRpb24tbmFtZSc6ICduZXh0bGV2ZWx0cmFkZXJzJ1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIEV4cG9ydGllcmUgZWluZSBGdW5rdGlvbiwgZGllIGRlbiBTdXBhYmFzZSBDbGllbnQgbWl0IGVpbmVtIENsZXJrIFNlc3Npb24gVG9rZW4gZXJzdGVsbHRcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDbGllbnRXaXRoQXV0aChjbGVya1Rva2VuPzogc3RyaW5nKSB7XG4gIHJldHVybiBjcmVhdGVDbGllbnQ8RGF0YWJhc2U+KHN1cGFiYXNlVXJsLCBzdXBhYmFzZUFub25LZXksIHtcbiAgICBkYjoge1xuICAgICAgc2NoZW1hOiAncHVibGljJ1xuICAgIH0sXG4gICAgZ2xvYmFsOiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICd4LWFwcGxpY2F0aW9uLW5hbWUnOiAnbmV4dGxldmVsdHJhZGVycycsXG4gICAgICAgIC4uLihjbGVya1Rva2VuID8geyBBdXRob3JpemF0aW9uOiBgQmVhcmVyICR7Y2xlcmtUb2tlbn1gIH0gOiB7fSlcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufSJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJzdXBhYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJzdXBhYmFzZUFub25LZXkiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWSIsImNvbnNvbGUiLCJlcnJvciIsInVybCIsImFub25LZXkiLCJFcnJvciIsInN1cGFiYXNlIiwiZGIiLCJzY2hlbWEiLCJnbG9iYWwiLCJoZWFkZXJzIiwiY3JlYXRlQ2xpZW50V2l0aEF1dGgiLCJjbGVya1Rva2VuIiwiQXV0aG9yaXphdGlvbiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmarket-data%2Fscan%2Froute&page=%2Fapi%2Fmarket-data%2Fscan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmarket-data%2Fscan%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmarket-data%2Fscan%2Froute&page=%2Fapi%2Fmarket-data%2Fscan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmarket-data%2Fscan%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_steffengottle_Desktop_nextleveltraders_app_api_market_data_scan_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/market-data/scan/route.ts */ \"(rsc)/./app/api/market-data/scan/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/market-data/scan/route\",\n        pathname: \"/api/market-data/scan\",\n        filename: \"route\",\n        bundlePath: \"app/api/market-data/scan/route\"\n    },\n    resolvedPagePath: \"/Users/steffengottle/Desktop/nextleveltraders/app/api/market-data/scan/route.ts\",\n    nextConfigOutput,\n    userland: _Users_steffengottle_Desktop_nextleveltraders_app_api_market_data_scan_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZtYXJrZXQtZGF0YSUyRnNjYW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRm1hcmtldC1kYXRhJTJGc2NhbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRm1hcmtldC1kYXRhJTJGc2NhbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnN0ZWZmZW5nb3R0bGUlMkZEZXNrdG9wJTJGbmV4dGxldmVsdHJhZGVycyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGVXNlcnMlMkZzdGVmZmVuZ290dGxlJTJGRGVza3RvcCUyRm5leHRsZXZlbHRyYWRlcnMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQytCO0FBQzVHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvc3RlZmZlbmdvdHRsZS9EZXNrdG9wL25leHRsZXZlbHRyYWRlcnMvYXBwL2FwaS9tYXJrZXQtZGF0YS9zY2FuL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9tYXJrZXQtZGF0YS9zY2FuL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvbWFya2V0LWRhdGEvc2NhblwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvbWFya2V0LWRhdGEvc2Nhbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9zdGVmZmVuZ290dGxlL0Rlc2t0b3AvbmV4dGxldmVsdHJhZGVycy9hcHAvYXBpL21hcmtldC1kYXRhL3NjYW4vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmarket-data%2Fscan%2Froute&page=%2Fapi%2Fmarket-data%2Fscan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmarket-data%2Fscan%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

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

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

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

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/yahoo-finance2","vendor-chunks/@supabase","vendor-chunks/tough-cookie","vendor-chunks/psl","vendor-chunks/url-parse","vendor-chunks/requires-port","vendor-chunks/querystringify","vendor-chunks/punycode"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fmarket-data%2Fscan%2Froute&page=%2Fapi%2Fmarket-data%2Fscan%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fmarket-data%2Fscan%2Froute.ts&appDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsteffengottle%2FDesktop%2Fnextleveltraders&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();