webpackHotUpdate_N_E("pages/view-team/user/[[...id]]",{

/***/ "./src/components/DirectMessageContainer.tsx":
/*!***************************************************!*\
  !*** ./src/components/DirectMessageContainer.tsx ***!
  \***************************************************/
/*! exports provided: DirectMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DirectMessage\", function() { return DirectMessage; });\n/* harmony import */ var _home_shriram_Downloads_slack_clone_web_node_modules_next_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/helpers/esm/toConsumableArray */ \"./node_modules/next/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js\");\n/* harmony import */ var _home_shriram_Downloads_slack_clone_web_node_modules_next_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/next/node_modules/@babel/runtime/helpers/esm/defineProperty */ \"./node_modules/next/node_modules/@babel/runtime/helpers/esm/defineProperty.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @chakra-ui/react */ \"./node_modules/@chakra-ui/react/dist/esm/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var react_waypoint__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-waypoint */ \"./node_modules/react-waypoint/es/index.js\");\n/* harmony import */ var _generated_graphql__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../generated/graphql */ \"./src/generated/graphql.tsx\");\n\n\n\n\nvar _jsxFileName = \"/home/shriram/Downloads/slack clone/web/src/components/DirectMessageContainer.tsx\",\n    _this = undefined,\n    _s = $RefreshSig$();\n\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }\n\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { Object(_home_shriram_Downloads_slack_clone_web_node_modules_next_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }\n\n\n\n\n\n\nvar Chats = function Chats(_ref) {\n  var message = _ref.message;\n  var url = message.url,\n      text = message.text,\n      fileType = message.fileType;\n\n  if (url) {\n    if (fileType.startsWith('image/')) {\n      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"img\", {\n        src: url,\n        alt: \"\"\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 13,\n        columnNumber: 14\n      }, _this);\n    } else if (fileType === 'text/plain') {\n      //@ts-ignore\n      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(RenderText, {\n        url: url\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 16,\n        columnNumber: 14\n      }, _this);\n    } else if (fileType.startsWith('audio/')) {\n      return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"div\", {\n        children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"audio\", {\n          controls: true,\n          children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(\"source\", {\n            src: url,\n            type: fileType\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 21,\n            columnNumber: 13\n          }, _this)\n        }, void 0, false, {\n          fileName: _jsxFileName,\n          lineNumber: 20,\n          columnNumber: 11\n        }, _this)\n      }, void 0, false, {\n        fileName: _jsxFileName,\n        lineNumber: 19,\n        columnNumber: 9\n      }, _this);\n    }\n  }\n\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n    children: text\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 27,\n    columnNumber: 10\n  }, _this);\n};\n\n_c = Chats;\nvar DirectMessage = function DirectMessage(_ref2) {\n  _s();\n\n  var teamId = _ref2.teamId,\n      receiverId = _ref2.receiverId;\n\n  var _useDirectMessageQuer = Object(_generated_graphql__WEBPACK_IMPORTED_MODULE_6__[\"useDirectMessageQuery\"])({\n    variables: {\n      receiverId: receiverId,\n      teamId: teamId\n    },\n    fetchPolicy: 'network-only'\n  }),\n      data = _useDirectMessageQuer.data,\n      loading = _useDirectMessageQuer.loading,\n      subscribeToMore = _useDirectMessageQuer.subscribeToMore,\n      fetchMore = _useDirectMessageQuer.fetchMore;\n\n  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_4__[\"useState\"])(),\n      element = _useState[0],\n      setScroll = _useState[1];\n\n  Object(react__WEBPACK_IMPORTED_MODULE_4__[\"useEffect\"])(function () {\n    // this starts the subscription\n    var unsubscribe = subscribeToMore({\n      document: _generated_graphql__WEBPACK_IMPORTED_MODULE_6__[\"NewDirectMessageDocument\"],\n      variables: {\n        receiverId: receiverId,\n        teamId: teamId\n      },\n      updateQuery: function updateQuery(prev, _ref3) {\n        var subscriptionData = _ref3.subscriptionData;\n\n        if (!subscriptionData.data) {\n          return prev;\n        } //@ts-ignore\n\n\n        var newDirectMessage = subscriptionData.data.newDirectMessage; // prev is a data with __typename and Message\n\n        var newData = _objectSpread(_objectSpread({}, prev), {}, {\n          Messages: _objectSpread(_objectSpread({}, prev.DirectMessages), {}, {\n            Messages: [newDirectMessage].concat(Object(_home_shriram_Downloads_slack_clone_web_node_modules_next_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(prev.DirectMessages.Messages))\n          }) //FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!!!!!!!!!1. DON'T FORGET TO CHANGE THE DirectMessages FIELD NAME ACCORDING TO YOUR NEEDS\n\n        });\n\n        return newData;\n      }\n    });\n\n    if (unsubscribe) {\n      return function () {\n        return unsubscribe();\n      }; // this function will execute when the component gets disassociated.\n    }\n  }, [subscribeToMore, receiverId, teamId]);\n\n  if (loading) {\n    return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n      children: \"loading\"\n    }, void 0, false, {\n      fileName: _jsxFileName,\n      lineNumber: 76,\n      columnNumber: 12\n    }, _this);\n  }\n\n  return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n    gridColumn: \"3\",\n    gridRow: \"2\",\n    backgroundColor: \"#e6e6e6\",\n    overflowY: \"auto\",\n    display: \"flex\",\n    flexDirection: \"column-reverse\",\n    ref: function ref(scroll) {\n      return setScroll(scroll);\n    },\n    pl: 3,\n    pt: 4,\n    children: /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n      display: \"flex\",\n      flexDirection: \"column\",\n      children: [' ', data !== null && data !== void 0 && data.DirectMessages ? data.DirectMessages.Messages.slice().reverse().map(function (u, i) {\n        return /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n          mb: 4,\n          children: [/*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Box\"], {\n            fontSize: \"19px\",\n            fontFamily: \"sans-serif\",\n            fontWeight: \"bold\",\n            children: [u.sender.username, /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_3__[\"Text\"], {\n              ml: 2,\n              display: \"inline\",\n              fontSize: \"13px\",\n              fontFamily: \"sans-serif\",\n              color: \"#958993\",\n              children: u.createdAt\n            }, void 0, false, {\n              fileName: _jsxFileName,\n              lineNumber: 105,\n              columnNumber: 21\n            }, _this)]\n          }, void 0, true, {\n            fileName: _jsxFileName,\n            lineNumber: 99,\n            columnNumber: 19\n          }, _this), /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(Chats, {\n            message: u\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 115,\n            columnNumber: 19\n          }, _this), i === 10 && data.DirectMessages.hasMore ? /*#__PURE__*/Object(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__[\"jsxDEV\"])(react_waypoint__WEBPACK_IMPORTED_MODULE_5__[\"Waypoint\"], {\n            onEnter: function onEnter() {\n              console.log(i);\n              return fetchMore({\n                variables: {\n                  receiverId: receiverId,\n                  teamId: teamId,\n                  cursor: data.DirectMessages.Messages[data.DirectMessages.Messages.length - 1].createdAt\n                }\n              });\n            }\n          }, void 0, false, {\n            fileName: _jsxFileName,\n            lineNumber: 117,\n            columnNumber: 21\n          }, _this) : null]\n        }, \"directMessage-\".concat(u.id), true, {\n          fileName: _jsxFileName,\n          lineNumber: 98,\n          columnNumber: 17\n        }, _this);\n      }) : null]\n    }, void 0, true, {\n      fileName: _jsxFileName,\n      lineNumber: 90,\n      columnNumber: 7\n    }, _this)\n  }, void 0, false, {\n    fileName: _jsxFileName,\n    lineNumber: 79,\n    columnNumber: 5\n  }, _this);\n};\n\n_s(DirectMessage, \"bt7XZsJyE5LEtCtUxTxgV2ZdOaM=\", false, function () {\n  return [_generated_graphql__WEBPACK_IMPORTED_MODULE_6__[\"useDirectMessageQuery\"]];\n});\n\n_c2 = DirectMessage;\n\nvar _c, _c2;\n\n$RefreshReg$(_c, \"Chats\");\n$RefreshReg$(_c2, \"DirectMessage\");\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.i);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/next/dist/compiled/webpack/harmony-module.js */ \"./node_modules/next/dist/compiled/webpack/harmony-module.js\")(module)))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvRGlyZWN0TWVzc2FnZUNvbnRhaW5lci50c3g/Mjc0NyJdLCJuYW1lcyI6WyJDaGF0cyIsIm1lc3NhZ2UiLCJ1cmwiLCJ0ZXh0IiwiZmlsZVR5cGUiLCJzdGFydHNXaXRoIiwiRGlyZWN0TWVzc2FnZSIsInRlYW1JZCIsInJlY2VpdmVySWQiLCJ1c2VEaXJlY3RNZXNzYWdlUXVlcnkiLCJ2YXJpYWJsZXMiLCJmZXRjaFBvbGljeSIsImRhdGEiLCJsb2FkaW5nIiwic3Vic2NyaWJlVG9Nb3JlIiwiZmV0Y2hNb3JlIiwidXNlU3RhdGUiLCJlbGVtZW50Iiwic2V0U2Nyb2xsIiwidXNlRWZmZWN0IiwidW5zdWJzY3JpYmUiLCJkb2N1bWVudCIsIk5ld0RpcmVjdE1lc3NhZ2VEb2N1bWVudCIsInVwZGF0ZVF1ZXJ5IiwicHJldiIsInN1YnNjcmlwdGlvbkRhdGEiLCJuZXdEaXJlY3RNZXNzYWdlIiwibmV3RGF0YSIsIk1lc3NhZ2VzIiwiRGlyZWN0TWVzc2FnZXMiLCJzY3JvbGwiLCJzbGljZSIsInJldmVyc2UiLCJtYXAiLCJ1IiwiaSIsInNlbmRlciIsInVzZXJuYW1lIiwiY3JlYXRlZEF0IiwiaGFzTW9yZSIsImNvbnNvbGUiLCJsb2ciLCJjdXJzb3IiLCJsZW5ndGgiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFLQSxJQUFNQSxLQUFLLEdBQUcsU0FBUkEsS0FBUSxPQUFpQjtBQUFBLE1BQWRDLE9BQWMsUUFBZEEsT0FBYztBQUFBLE1BQ3JCQyxHQURxQixHQUNHRCxPQURILENBQ3JCQyxHQURxQjtBQUFBLE1BQ2hCQyxJQURnQixHQUNHRixPQURILENBQ2hCRSxJQURnQjtBQUFBLE1BQ1ZDLFFBRFUsR0FDR0gsT0FESCxDQUNWRyxRQURVOztBQUU3QixNQUFJRixHQUFKLEVBQVM7QUFDUCxRQUFJRSxRQUFRLENBQUNDLFVBQVQs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QUFOLElBQVl2QixJQUFJLENBQUNpQixjQUFMLENBQW9CVSxPQUFoQyxnQkFDQyxxRUFBQyx1REFBRDtBQUNFLG1CQUFPLEVBQUUsbUJBQU07QUFDYkMscUJBQU8sQ0FBQ0MsR0FBUixDQUFZTixDQUFaO0FBQ0EscUJBQU9wQixTQUFTLENBQUM7QUFDZkwseUJBQVMsRUFBRTtBQUNURiw0QkFBVSxFQUFWQSxVQURTO0FBRVRELHdCQUFNLEVBQU5BLE1BRlM7QUFHVG1DLHdCQUFNLEVBQ0o5QixJQUFJLENBQUNpQixjQUFMLENBQW9CRCxRQUFwQixDQUNFaEIsSUFBSSxDQUFDaUIsY0FBTCxDQUFvQkQsUUFBcEIsQ0FBNkJlLE1BQTdCLEdBQXNDLENBRHhDLEVBRUVMO0FBTks7QUFESSxlQUFELENBQWhCO0FBVUQ7QUFiSDtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQURELEdBZ0JHLElBbENOO0FBQUEsbUNBQWtDSixDQUFDLENBQUNVLEVBQXBDO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBREc7QUFBQSxPQUZQLENBREgsR0F5Q0csSUE3Q047QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQURGO0FBNkRELENBeEdNOztHQUFNdEMsYTtVQUkyQ0csd0U7OztNQUozQ0gsYSIsImZpbGUiOiIuL3NyYy9jb21wb25lbnRzL0RpcmVjdE1lc3NhZ2VDb250YWluZXIudHN4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm94LCBUZXh0IH0gZnJvbSAnQGNoYWtyYS11aS9yZWFjdCdcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBXYXlwb2ludCB9IGZyb20gJ3JlYWN0LXdheXBvaW50J1xuaW1wb3J0IHtcbiAgTmV3RGlyZWN0TWVzc2FnZURvY3VtZW50LFxuICB1c2VEaXJlY3RNZXNzYWdlUXVlcnksXG59IGZyb20gJy4uL2dlbmVyYXRlZC9ncmFwaHFsJ1xuXG5jb25zdCBDaGF0cyA9ICh7IG1lc3NhZ2UgfSkgPT4ge1xuICBjb25zdCB7IHVybCwgdGV4dCwgZmlsZVR5cGUgfSA9IG1lc3NhZ2VcbiAgaWYgKHVybCkge1xuICAgIGlmIChmaWxlVHlwZS5zdGFydHNXaXRoKCdpbWFnZS8nKSkge1xuICAgICAgcmV0dXJuIDxpbWcgc3JjPXt1cmx9IGFsdD1cIlwiIC8+XG4gICAgfSBlbHNlIGlmIChmaWxlVHlwZSA9PT0gJ3RleHQvcGxhaW4nKSB7XG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHJldHVybiA8UmVuZGVyVGV4dCB1cmw9e3VybH0gLz5cbiAgICB9IGVsc2UgaWYgKGZpbGVUeXBlLnN0YXJ0c1dpdGgoJ2F1ZGlvLycpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxhdWRpbyBjb250cm9scz5cbiAgICAgICAgICAgIDxzb3VyY2Ugc3JjPXt1cmx9IHR5cGU9e2ZpbGVUeXBlfSAvPlxuICAgICAgICAgIDwvYXVkaW8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH1cbiAgfVxuICByZXR1cm4gPEJveD57dGV4dH08L0JveD5cbn1cblxuaW50ZXJmYWNlIE1lc3NhZ2VQcm9wcyB7XG4gIHRlYW1JZDogbnVtYmVyXG4gIHJlY2VpdmVySWQ6IG51bWJlclxufVxuXG5leHBvcnQgY29uc3QgRGlyZWN0TWVzc2FnZTogUmVhY3QuRkM8TWVzc2FnZVByb3BzPiA9ICh7XG4gIHRlYW1JZCxcbiAgcmVjZWl2ZXJJZCxcbn0pID0+IHtcbiAgY29uc3QgeyBkYXRhLCBsb2FkaW5nLCBzdWJzY3JpYmVUb01vcmUsIGZldGNoTW9yZSB9ID0gdXNlRGlyZWN0TWVzc2FnZVF1ZXJ5KHtcbiAgICB2YXJpYWJsZXM6IHtcbiAgICAgIHJlY2VpdmVySWQsXG4gICAgICB0ZWFtSWQsXG4gICAgfSxcbiAgICBmZXRjaFBvbGljeTogJ25ldHdvcmstb25seScsXG4gIH0pXG4gIGNvbnN0IFtlbGVtZW50LCBzZXRTY3JvbGxdID0gdXNlU3RhdGU8SFRNTERpdkVsZW1lbnQ+KClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHRoaXMgc3RhcnRzIHRoZSBzdWJzY3JpcHRpb25cbiAgICBsZXQgdW5zdWJzY3JpYmUgPSBzdWJzY3JpYmVUb01vcmUoe1xuICAgICAgZG9jdW1lbnQ6IE5ld0RpcmVjdE1lc3NhZ2VEb2N1bWVudCxcbiAgICAgIHZhcmlhYmxlczogeyByZWNlaXZlcklkLCB0ZWFtSWQgfSxcbiAgICAgIHVwZGF0ZVF1ZXJ5OiAocHJldiwgeyBzdWJzY3JpcHRpb25EYXRhIH0pID0+IHtcbiAgICAgICAgaWYgKCFzdWJzY3JpcHRpb25EYXRhLmRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gcHJldlxuICAgICAgICB9XG4gICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCB7IG5ld0RpcmVjdE1lc3NhZ2UgfSA9IHN1YnNjcmlwdGlvbkRhdGEuZGF0YVxuICAgICAgICAvLyBwcmV2IGlzIGEgZGF0YSB3aXRoIF9fdHlwZW5hbWUgYW5kIE1lc3NhZ2VcbiAgICAgICAgbGV0IG5ld0RhdGEgPSB7XG4gICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICBNZXNzYWdlczoge1xuICAgICAgICAgICAgLi4ucHJldi5EaXJlY3RNZXNzYWdlcyxcbiAgICAgICAgICAgIE1lc3NhZ2VzOiBbbmV3RGlyZWN0TWVzc2FnZSwgLi4ucHJldi5EaXJlY3RNZXNzYWdlcy5NZXNzYWdlc10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAvL0ZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVDSyEhISEhISEhISEhISEhISEhISEhISEhISEhISExLiBET04nVCBGT1JHRVQgVE8gQ0hBTkdFIFRIRSBEaXJlY3RNZXNzYWdlcyBGSUVMRCBOQU1FIEFDQ09SRElORyBUTyBZT1VSIE5FRURTXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0RhdGFcbiAgICAgIH0sXG4gICAgfSlcbiAgICBpZiAodW5zdWJzY3JpYmUpIHtcbiAgICAgIHJldHVybiAoKSA9PiB1bnN1YnNjcmliZSgpIC8vIHRoaXMgZnVuY3Rpb24gd2lsbCBleGVjdXRlIHdoZW4gdGhlIGNvbXBvbmVudCBnZXRzIGRpc2Fzc29jaWF0ZWQuXG4gICAgfVxuICB9LCBbc3Vic2NyaWJlVG9Nb3JlLCByZWNlaXZlcklkLCB0ZWFtSWRdKVxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiA8Qm94PmxvYWRpbmc8L0JveD5cbiAgfVxuICByZXR1cm4gKFxuICAgIDxCb3hcbiAgICAgIGdyaWRDb2x1bW49XCIzXCJcbiAgICAgIGdyaWRSb3c9XCIyXCJcbiAgICAgIGJhY2tncm91bmRDb2xvcj1cIiNlNmU2ZTZcIlxuICAgICAgb3ZlcmZsb3dZPVwiYXV0b1wiXG4gICAgICBkaXNwbGF5PVwiZmxleFwiXG4gICAgICBmbGV4RGlyZWN0aW9uPVwiY29sdW1uLXJldmVyc2VcIlxuICAgICAgcmVmPXsoc2Nyb2xsKSA9PiBzZXRTY3JvbGwoc2Nyb2xsKX1cbiAgICAgIHBsPXszfVxuICAgICAgcHQ9ezR9XG4gICAgPlxuICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIj5cbiAgICAgICAgeycgJ31cbiAgICAgICAgey8qIGNvbHVtbi1yZXZlcnNlOiB0byBoYXZlIG5ldyBtZXNzYWdlcyBpbiB0aGUgZnJvbnRcbiAgICAgICAgb3ZlckZsb3dZOiBmb3Igc2Nyb2xsIGJhciAqL31cbiAgICAgICAge2RhdGE/LkRpcmVjdE1lc3NhZ2VzXG4gICAgICAgICAgPyBkYXRhLkRpcmVjdE1lc3NhZ2VzLk1lc3NhZ2VzLnNsaWNlKClcbiAgICAgICAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAgICAgICAubWFwKCh1LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPEJveCBtYj17NH0ga2V5PXtgZGlyZWN0TWVzc2FnZS0ke3UuaWR9YH0+XG4gICAgICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplPVwiMTlweFwiXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk9XCJzYW5zLXNlcmlmXCJcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodD1cImJvbGRcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dS5zZW5kZXIudXNlcm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIDxUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgbWw9ezJ9XG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT1cImlubGluZVwiXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU9XCIxM3B4XCJcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5PVwic2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I9XCIjOTU4OTkzXCJcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgIHt1LmNyZWF0ZWRBdH1cbiAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8Q2hhdHMgbWVzc2FnZT17dX0gLz5cbiAgICAgICAgICAgICAgICAgIHtpID09PSAxMCAmJiBkYXRhLkRpcmVjdE1lc3NhZ2VzLmhhc01vcmUgPyAoXG4gICAgICAgICAgICAgICAgICAgIDxXYXlwb2ludFxuICAgICAgICAgICAgICAgICAgICAgIG9uRW50ZXI9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGkpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmV0Y2hNb3JlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjZWl2ZXJJZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5EaXJlY3RNZXNzYWdlcy5NZXNzYWdlc1tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5EaXJlY3RNZXNzYWdlcy5NZXNzYWdlcy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLmNyZWF0ZWRBdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgIDwvQm94PlxuICAgIDwvQm94PlxuICApXG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/components/DirectMessageContainer.tsx\n");

/***/ })

})