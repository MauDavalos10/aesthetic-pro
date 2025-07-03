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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./lib/supabase.js":
/*!*************************!*\
  !*** ./lib/supabase.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getCurrentUser: () => (/* binding */ getCurrentUser),\n/* harmony export */   signInWithGoogle: () => (/* binding */ signInWithGoogle),\n/* harmony export */   signOut: () => (/* binding */ signOut),\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"@supabase/auth-helpers-nextjs\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__);\n\nconst supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_0__.createClientComponentClient)();\n// Función para autenticación con Google\nconst signInWithGoogle = async ()=>{\n    const { data, error } = await supabase.auth.signInWithOAuth({\n        provider: \"google\",\n        options: {\n            redirectTo: `${window.location.origin}/dashboard`\n        }\n    });\n    return {\n        data,\n        error\n    };\n};\n// Función para cerrar sesión\nconst signOut = async ()=>{\n    const { error } = await supabase.auth.signOut();\n    return {\n        error\n    };\n};\n// Función para obtener el usuario actual\nconst getCurrentUser = async ()=>{\n    const { data: { user }, error } = await supabase.auth.getUser();\n    return {\n        user,\n        error\n    };\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2UuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTRFO0FBRXJFLE1BQU1DLFdBQVdELDBGQUEyQkEsR0FBRztBQUV0RCx3Q0FBd0M7QUFDakMsTUFBTUUsbUJBQW1CO0lBQzlCLE1BQU0sRUFBRUMsSUFBSSxFQUFFQyxLQUFLLEVBQUUsR0FBRyxNQUFNSCxTQUFTSSxJQUFJLENBQUNDLGVBQWUsQ0FBQztRQUMxREMsVUFBVTtRQUNWQyxTQUFTO1lBQ1BDLFlBQVksQ0FBQyxFQUFFQyxPQUFPQyxRQUFRLENBQUNDLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDbkQ7SUFDRjtJQUNBLE9BQU87UUFBRVQ7UUFBTUM7SUFBTTtBQUN2QixFQUFFO0FBRUYsNkJBQTZCO0FBQ3RCLE1BQU1TLFVBQVU7SUFDckIsTUFBTSxFQUFFVCxLQUFLLEVBQUUsR0FBRyxNQUFNSCxTQUFTSSxJQUFJLENBQUNRLE9BQU87SUFDN0MsT0FBTztRQUFFVDtJQUFNO0FBQ2pCLEVBQUU7QUFFRix5Q0FBeUM7QUFDbEMsTUFBTVUsaUJBQWlCO0lBQzVCLE1BQU0sRUFDSlgsTUFBTSxFQUFFWSxJQUFJLEVBQUUsRUFDZFgsS0FBSyxFQUNOLEdBQUcsTUFBTUgsU0FBU0ksSUFBSSxDQUFDVyxPQUFPO0lBQy9CLE9BQU87UUFBRUQ7UUFBTVg7SUFBTTtBQUN2QixFQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYWVzdGhldGljLXByby8uL2xpYi9zdXBhYmFzZS5qcz8xNTk4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCB9IGZyb20gXCJAc3VwYWJhc2UvYXV0aC1oZWxwZXJzLW5leHRqc1wiO1xuXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnRDb21wb25lbnRDbGllbnQoKTtcblxuLy8gRnVuY2nDs24gcGFyYSBhdXRlbnRpY2FjacOzbiBjb24gR29vZ2xlXG5leHBvcnQgY29uc3Qgc2lnbkluV2l0aEdvb2dsZSA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduSW5XaXRoT0F1dGgoe1xuICAgIHByb3ZpZGVyOiBcImdvb2dsZVwiLFxuICAgIG9wdGlvbnM6IHtcbiAgICAgIHJlZGlyZWN0VG86IGAke3dpbmRvdy5sb2NhdGlvbi5vcmlnaW59L2Rhc2hib2FyZGAsXG4gICAgfSxcbiAgfSk7XG4gIHJldHVybiB7IGRhdGEsIGVycm9yIH07XG59O1xuXG4vLyBGdW5jacOzbiBwYXJhIGNlcnJhciBzZXNpw7NuXG5leHBvcnQgY29uc3Qgc2lnbk91dCA9IGFzeW5jICgpID0+IHtcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5zaWduT3V0KCk7XG4gIHJldHVybiB7IGVycm9yIH07XG59O1xuXG4vLyBGdW5jacOzbiBwYXJhIG9idGVuZXIgZWwgdXN1YXJpbyBhY3R1YWxcbmV4cG9ydCBjb25zdCBnZXRDdXJyZW50VXNlciA9IGFzeW5jICgpID0+IHtcbiAgY29uc3Qge1xuICAgIGRhdGE6IHsgdXNlciB9LFxuICAgIGVycm9yLFxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKCk7XG4gIHJldHVybiB7IHVzZXIsIGVycm9yIH07XG59O1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCIsInN1cGFiYXNlIiwic2lnbkluV2l0aEdvb2dsZSIsImRhdGEiLCJlcnJvciIsImF1dGgiLCJzaWduSW5XaXRoT0F1dGgiLCJwcm92aWRlciIsIm9wdGlvbnMiLCJyZWRpcmVjdFRvIiwid2luZG93IiwibG9jYXRpb24iLCJvcmlnaW4iLCJzaWduT3V0IiwiZ2V0Q3VycmVudFVzZXIiLCJ1c2VyIiwiZ2V0VXNlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/supabase.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @mui/material/styles */ \"@mui/material/styles\");\n/* harmony import */ var _mui_material_styles__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @mui/material/CssBaseline */ \"@mui/material/CssBaseline\");\n/* harmony import */ var _mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @supabase/auth-helpers-react */ \"@supabase/auth-helpers-react\");\n/* harmony import */ var _supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _lib_supabase__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/supabase */ \"./lib/supabase.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\n// Tema Material UI personalizado\nconst theme = (0,_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.createTheme)({\n    palette: {\n        primary: {\n            main: \"#6366f1\"\n        },\n        secondary: {\n            main: \"#ec4899\"\n        },\n        background: {\n            default: \"#f8fafc\",\n            paper: \"#ffffff\"\n        }\n    },\n    typography: {\n        fontFamily: '\"Inter\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif',\n        h1: {\n            fontWeight: 700\n        },\n        h2: {\n            fontWeight: 600\n        }\n    },\n    shape: {\n        borderRadius: 12\n    },\n    components: {\n        MuiButton: {\n            styleOverrides: {\n                root: {\n                    textTransform: \"none\",\n                    borderRadius: 8,\n                    padding: \"10px 24px\"\n                }\n            }\n        },\n        MuiCard: {\n            styleOverrides: {\n                root: {\n                    boxShadow: \"0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)\"\n                }\n            }\n        }\n    }\n});\nfunction App({ Component, pageProps }) {\n    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_6__.useState)(()=>new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClient({\n            defaultOptions: {\n                queries: {\n                    staleTime: 5 * 60 * 1000\n                }\n            }\n        }));\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_supabase_auth_helpers_react__WEBPACK_IMPORTED_MODULE_4__.SessionContextProvider, {\n        supabaseClient: _lib_supabase__WEBPACK_IMPORTED_MODULE_5__.supabase,\n        initialSession: pageProps.initialSession,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_mui_material_styles__WEBPACK_IMPORTED_MODULE_1__.ThemeProvider, {\n                theme: theme,\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_mui_material_CssBaseline__WEBPACK_IMPORTED_MODULE_2___default()), {}, void 0, false, {\n                        fileName: \"/Users/mauriciodavalos/Documents/business/aesthetic-pro/pages/_app.js\",\n                        lineNumber: 74,\n                        columnNumber: 11\n                    }, this),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/Users/mauriciodavalos/Documents/business/aesthetic-pro/pages/_app.js\",\n                        lineNumber: 75,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/mauriciodavalos/Documents/business/aesthetic-pro/pages/_app.js\",\n                lineNumber: 73,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/mauriciodavalos/Documents/business/aesthetic-pro/pages/_app.js\",\n            lineNumber: 72,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/mauriciodavalos/Documents/business/aesthetic-pro/pages/_app.js\",\n        lineNumber: 68,\n        columnNumber: 5\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFrRTtBQUNkO0FBQ3FCO0FBQ0g7QUFDM0I7QUFDVjtBQUVqQyxpQ0FBaUM7QUFDakMsTUFBTVEsUUFBUVAsaUVBQVdBLENBQUM7SUFDeEJRLFNBQVM7UUFDUEMsU0FBUztZQUNQQyxNQUFNO1FBQ1I7UUFDQUMsV0FBVztZQUNURCxNQUFNO1FBQ1I7UUFDQUUsWUFBWTtZQUNWQyxTQUFTO1lBQ1RDLE9BQU87UUFDVDtJQUNGO0lBQ0FDLFlBQVk7UUFDVkMsWUFBWTtRQUNaQyxJQUFJO1lBQ0ZDLFlBQVk7UUFDZDtRQUNBQyxJQUFJO1lBQ0ZELFlBQVk7UUFDZDtJQUNGO0lBQ0FFLE9BQU87UUFDTEMsY0FBYztJQUNoQjtJQUNBQyxZQUFZO1FBQ1ZDLFdBQVc7WUFDVEMsZ0JBQWdCO2dCQUNkQyxNQUFNO29CQUNKQyxlQUFlO29CQUNmTCxjQUFjO29CQUNkTSxTQUFTO2dCQUNYO1lBQ0Y7UUFDRjtRQUNBQyxTQUFTO1lBQ1BKLGdCQUFnQjtnQkFDZEMsTUFBTTtvQkFDSkksV0FDRTtnQkFDSjtZQUNGO1FBQ0Y7SUFDRjtBQUNGO0FBRWUsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsRCxNQUFNLENBQUNDLFlBQVksR0FBRzNCLCtDQUFRQSxDQUM1QixJQUNFLElBQUlKLDhEQUFXQSxDQUFDO1lBQ2RnQyxnQkFBZ0I7Z0JBQ2RDLFNBQVM7b0JBQ1BDLFdBQVcsSUFBSSxLQUFLO2dCQUN0QjtZQUNGO1FBQ0Y7SUFHSixxQkFDRSw4REFBQ2hDLGdGQUFzQkE7UUFDckJpQyxnQkFBZ0JoQyxtREFBUUE7UUFDeEJpQyxnQkFBZ0JOLFVBQVVNLGNBQWM7a0JBRXhDLDRFQUFDbkMsc0VBQW1CQTtZQUFDb0MsUUFBUU47c0JBQzNCLDRFQUFDbEMsK0RBQWFBO2dCQUFDUSxPQUFPQTs7a0NBQ3BCLDhEQUFDTixrRUFBV0E7Ozs7O2tDQUNaLDhEQUFDOEI7d0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Flc3RoZXRpYy1wcm8vLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGhlbWVQcm92aWRlciwgY3JlYXRlVGhlbWUgfSBmcm9tIFwiQG11aS9tYXRlcmlhbC9zdHlsZXNcIjtcbmltcG9ydCBDc3NCYXNlbGluZSBmcm9tIFwiQG11aS9tYXRlcmlhbC9Dc3NCYXNlbGluZVwiO1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCI7XG5pbXBvcnQgeyBTZXNzaW9uQ29udGV4dFByb3ZpZGVyIH0gZnJvbSBcIkBzdXBhYmFzZS9hdXRoLWhlbHBlcnMtcmVhY3RcIjtcbmltcG9ydCB7IHN1cGFiYXNlIH0gZnJvbSBcIi4uL2xpYi9zdXBhYmFzZVwiO1xuaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcblxuLy8gVGVtYSBNYXRlcmlhbCBVSSBwZXJzb25hbGl6YWRvXG5jb25zdCB0aGVtZSA9IGNyZWF0ZVRoZW1lKHtcbiAgcGFsZXR0ZToge1xuICAgIHByaW1hcnk6IHtcbiAgICAgIG1haW46IFwiIzYzNjZmMVwiLCAvLyBJbmRpZ28gbW9kZXJub1xuICAgIH0sXG4gICAgc2Vjb25kYXJ5OiB7XG4gICAgICBtYWluOiBcIiNlYzQ4OTlcIiwgLy8gUm9zYSB2aWJyYW50ZVxuICAgIH0sXG4gICAgYmFja2dyb3VuZDoge1xuICAgICAgZGVmYXVsdDogXCIjZjhmYWZjXCIsXG4gICAgICBwYXBlcjogXCIjZmZmZmZmXCIsXG4gICAgfSxcbiAgfSxcbiAgdHlwb2dyYXBoeToge1xuICAgIGZvbnRGYW1pbHk6ICdcIkludGVyXCIsIFwiUm9ib3RvXCIsIFwiSGVsdmV0aWNhXCIsIFwiQXJpYWxcIiwgc2Fucy1zZXJpZicsXG4gICAgaDE6IHtcbiAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICB9LFxuICAgIGgyOiB7XG4gICAgICBmb250V2VpZ2h0OiA2MDAsXG4gICAgfSxcbiAgfSxcbiAgc2hhcGU6IHtcbiAgICBib3JkZXJSYWRpdXM6IDEyLFxuICB9LFxuICBjb21wb25lbnRzOiB7XG4gICAgTXVpQnV0dG9uOiB7XG4gICAgICBzdHlsZU92ZXJyaWRlczoge1xuICAgICAgICByb290OiB7XG4gICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJub25lXCIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiA4LFxuICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAyNHB4XCIsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgTXVpQ2FyZDoge1xuICAgICAgc3R5bGVPdmVycmlkZXM6IHtcbiAgICAgICAgcm9vdDoge1xuICAgICAgICAgIGJveFNoYWRvdzpcbiAgICAgICAgICAgIFwiMCAxcHggM3B4IDAgcmdiKDAgMCAwIC8gMC4xKSwgMCAxcHggMnB4IC0xcHggcmdiKDAgMCAwIC8gMC4xKVwiLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3QgW3F1ZXJ5Q2xpZW50XSA9IHVzZVN0YXRlKFxuICAgICgpID0+XG4gICAgICBuZXcgUXVlcnlDbGllbnQoe1xuICAgICAgICBkZWZhdWx0T3B0aW9uczoge1xuICAgICAgICAgIHF1ZXJpZXM6IHtcbiAgICAgICAgICAgIHN0YWxlVGltZTogNSAqIDYwICogMTAwMCwgLy8gNSBtaW51dG9zXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8U2Vzc2lvbkNvbnRleHRQcm92aWRlclxuICAgICAgc3VwYWJhc2VDbGllbnQ9e3N1cGFiYXNlfVxuICAgICAgaW5pdGlhbFNlc3Npb249e3BhZ2VQcm9wcy5pbml0aWFsU2Vzc2lvbn1cbiAgICA+XG4gICAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgICAgPFRoZW1lUHJvdmlkZXIgdGhlbWU9e3RoZW1lfT5cbiAgICAgICAgICA8Q3NzQmFzZWxpbmUgLz5cbiAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDwvVGhlbWVQcm92aWRlcj5cbiAgICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgICA8L1Nlc3Npb25Db250ZXh0UHJvdmlkZXI+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiVGhlbWVQcm92aWRlciIsImNyZWF0ZVRoZW1lIiwiQ3NzQmFzZWxpbmUiLCJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJTZXNzaW9uQ29udGV4dFByb3ZpZGVyIiwic3VwYWJhc2UiLCJ1c2VTdGF0ZSIsInRoZW1lIiwicGFsZXR0ZSIsInByaW1hcnkiLCJtYWluIiwic2Vjb25kYXJ5IiwiYmFja2dyb3VuZCIsImRlZmF1bHQiLCJwYXBlciIsInR5cG9ncmFwaHkiLCJmb250RmFtaWx5IiwiaDEiLCJmb250V2VpZ2h0IiwiaDIiLCJzaGFwZSIsImJvcmRlclJhZGl1cyIsImNvbXBvbmVudHMiLCJNdWlCdXR0b24iLCJzdHlsZU92ZXJyaWRlcyIsInJvb3QiLCJ0ZXh0VHJhbnNmb3JtIiwicGFkZGluZyIsIk11aUNhcmQiLCJib3hTaGFkb3ciLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJxdWVyeUNsaWVudCIsImRlZmF1bHRPcHRpb25zIiwicXVlcmllcyIsInN0YWxlVGltZSIsInN1cGFiYXNlQ2xpZW50IiwiaW5pdGlhbFNlc3Npb24iLCJjbGllbnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "@mui/material/CssBaseline":
/*!********************************************!*\
  !*** external "@mui/material/CssBaseline" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@mui/material/CssBaseline");

/***/ }),

/***/ "@mui/material/styles":
/*!***************************************!*\
  !*** external "@mui/material/styles" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@mui/material/styles");

/***/ }),

/***/ "@supabase/auth-helpers-nextjs":
/*!************************************************!*\
  !*** external "@supabase/auth-helpers-nextjs" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("@supabase/auth-helpers-nextjs");

/***/ }),

/***/ "@supabase/auth-helpers-react":
/*!***********************************************!*\
  !*** external "@supabase/auth-helpers-react" ***!
  \***********************************************/
/***/ ((module) => {

module.exports = require("@supabase/auth-helpers-react");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("@tanstack/react-query");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();