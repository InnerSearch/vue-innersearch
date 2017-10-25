/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _readJSON = __webpack_require__(1);

var _readJSON2 = _interopRequireDefault(_readJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _readJSON2.default)("food.json").then(function (data) {
    var file = JSON.parse(data);
    if (file !== null) {
        var hits = file.hits.hits,
            count = 0;

        hits.forEach(function (value) {
            var obj = JSON.stringify(value["_source"], null, 4);
            var p = document.createElement("p");
            p.innerText = "POST /immobilier/batiment\n" + obj;
            document.getElementById("JSON").appendChild(p);

            if (count++ > 50) throw "Stop";
        });
    }
}).catch(function (e) {
    throw e;
});

// async function feed() {
//     let file = await readJSON("./food.json");
//     file = JSON.parse(file);
//     if (file !== null) {
//         var hits = file.hits.hits,
//             count = 0;

//         hits.forEach(function(value) {
//             var obj = JSON.stringify(value["_source"], null, 4);
//             var p = document.createElement("p");
//             p.innerText = "POST /immobilier/batiment\n" + obj;
//             document.getElementById("JSON").appendChild(p);

//             if (count++ > 50) throw("Stop");
//         });
//     }
// };

// feed();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (url) {
    return fetch(url).then(function (data) {
        return data.text();
    }).catch(function (e) {
        throw e;
    });
};

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTBhYTJiYzI5ZmI3MzlhNjY4YTMiLCJ3ZWJwYWNrOi8vLy4vdmlldy9wb3B1bGF0ZS9mZWVkLmpzIiwid2VicGFjazovLy8uL3ZpZXcvcG9wdWxhdGUvcmVhZEpTT04uanMiXSwibmFtZXMiOlsidGhlbiIsImZpbGUiLCJKU09OIiwicGFyc2UiLCJkYXRhIiwiaGl0cyIsImNvdW50IiwiZm9yRWFjaCIsInZhbHVlIiwib2JqIiwic3RyaW5naWZ5IiwicCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImlubmVyVGV4dCIsImdldEVsZW1lbnRCeUlkIiwiYXBwZW5kQ2hpbGQiLCJjYXRjaCIsImUiLCJmZXRjaCIsInVybCIsInRleHQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTs7Ozs7O0FBRUEsd0JBQVMsV0FBVCxFQUFzQkEsSUFBdEIsQ0FBMkIsZ0JBQVE7QUFDL0IsUUFBSUMsT0FBT0MsS0FBS0MsS0FBTCxDQUFXQyxJQUFYLENBQVg7QUFDSSxRQUFJSCxTQUFTLElBQWIsRUFBbUI7QUFDbkIsWUFBSUksT0FBT0osS0FBS0ksSUFBTCxDQUFVQSxJQUFyQjtBQUFBLFlBQ0lDLFFBQVEsQ0FEWjs7QUFHQUQsYUFBS0UsT0FBTCxDQUFhLFVBQVNDLEtBQVQsRUFBZ0I7QUFDekIsZ0JBQUlDLE1BQU1QLEtBQUtRLFNBQUwsQ0FBZUYsTUFBTSxTQUFOLENBQWYsRUFBaUMsSUFBakMsRUFBdUMsQ0FBdkMsQ0FBVjtBQUNBLGdCQUFJRyxJQUFJQyxTQUFTQyxhQUFULENBQXVCLEdBQXZCLENBQVI7QUFDQUYsY0FBRUcsU0FBRixHQUFjLGdDQUFnQ0wsR0FBOUM7QUFDQUcscUJBQVNHLGNBQVQsQ0FBd0IsTUFBeEIsRUFBZ0NDLFdBQWhDLENBQTRDTCxDQUE1Qzs7QUFFQSxnQkFBSUwsVUFBVSxFQUFkLEVBQWtCLE1BQU0sTUFBTjtBQUNyQixTQVBEO0FBUUg7QUFDSixDQWZELEVBZUdXLEtBZkgsQ0FlUyxhQUFLO0FBQ1YsVUFBTUMsQ0FBTjtBQUNILENBakJEOztBQW1CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVOzs7Ozs7Ozs7Ozs7O2tCQ3ZDZSxlQUFPO0FBQ2xCLFdBQU9DLE1BQU1DLEdBQU4sRUFBV3BCLElBQVgsQ0FBZ0I7QUFBQSxlQUFRSSxLQUFLaUIsSUFBTCxFQUFSO0FBQUEsS0FBaEIsRUFBcUNKLEtBQXJDLENBQTJDLGFBQUs7QUFBQyxjQUFNQyxDQUFOO0FBQVEsS0FBekQsQ0FBUDtBQUNILEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZTBhYTJiYzI5ZmI3MzlhNjY4YTMiLCJpbXBvcnQgcmVhZEpTT04gZnJvbSBcIi4vcmVhZEpTT05cIjtcblxucmVhZEpTT04oXCJmb29kLmpzb25cIikudGhlbihkYXRhID0+IHtcbiAgICBsZXQgZmlsZSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICAgIGlmIChmaWxlICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBoaXRzID0gZmlsZS5oaXRzLmhpdHMsXG4gICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgXG4gICAgICAgIGhpdHMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9iaiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlW1wiX3NvdXJjZVwiXSwgbnVsbCwgNCk7XG4gICAgICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgcC5pbm5lclRleHQgPSBcIlBPU1QgL2ltbW9iaWxpZXIvYmF0aW1lbnRcXG5cIiArIG9iajtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiSlNPTlwiKS5hcHBlbmRDaGlsZChwKTtcbiAgICBcbiAgICAgICAgICAgIGlmIChjb3VudCsrID4gNTApIHRocm93KFwiU3RvcFwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSkuY2F0Y2goZSA9PiB7XG4gICAgdGhyb3cgZVxufSk7XG5cbi8vIGFzeW5jIGZ1bmN0aW9uIGZlZWQoKSB7XG4vLyAgICAgbGV0IGZpbGUgPSBhd2FpdCByZWFkSlNPTihcIi4vZm9vZC5qc29uXCIpO1xuLy8gICAgIGZpbGUgPSBKU09OLnBhcnNlKGZpbGUpO1xuLy8gICAgIGlmIChmaWxlICE9PSBudWxsKSB7XG4vLyAgICAgICAgIHZhciBoaXRzID0gZmlsZS5oaXRzLmhpdHMsXG4vLyAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgXG4vLyAgICAgICAgIGhpdHMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuLy8gICAgICAgICAgICAgdmFyIG9iaiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlW1wiX3NvdXJjZVwiXSwgbnVsbCwgNCk7XG4vLyAgICAgICAgICAgICB2YXIgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuLy8gICAgICAgICAgICAgcC5pbm5lclRleHQgPSBcIlBPU1QgL2ltbW9iaWxpZXIvYmF0aW1lbnRcXG5cIiArIG9iajtcbi8vICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiSlNPTlwiKS5hcHBlbmRDaGlsZChwKTtcbiAgICBcbi8vICAgICAgICAgICAgIGlmIChjb3VudCsrID4gNTApIHRocm93KFwiU3RvcFwiKTtcbi8vICAgICAgICAgfSk7XG4vLyAgICAgfVxuLy8gfTtcblxuLy8gZmVlZCgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3ZpZXcvcG9wdWxhdGUvZmVlZC5qcyIsImV4cG9ydCBkZWZhdWx0IHVybCA9PiB7XG4gICAgcmV0dXJuIGZldGNoKHVybCkudGhlbihkYXRhID0+IGRhdGEudGV4dCgpKS5jYXRjaChlID0+IHt0aHJvdyBlfSlcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi92aWV3L3BvcHVsYXRlL3JlYWRKU09OLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==