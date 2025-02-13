/**
 * jscolor - JavaScript Color Picker
 *
 * @link    http://jscolor.com
 * @license For open source use: GPLv3
 *          For commercial use: JSColor Commercial License
 * @author  Jan Odvarko - East Desire
 * @version 2.5.2
 *
 * See usage examples at http://jscolor.com/examples/
 */ !(function (e, t) {
	"use strict";
	if ("object" == typeof module && "object" == typeof module.exports) {
		module.exports = e.document
			? t(e)
			: function (e) {
					if (!e.document) throw Error("jscolor needs a window with document");
					return t(e);
				};
		return;
	}
	t(e);
})("undefined" != typeof window ? window : this, function (e) {
	"use strict";
	var t,
		r,
		n,
		i,
		o =
			(((i = {
				initialized: !1,
				instances: [],
				readyQueue: [],
				register: function () {
					void 0 !== e &&
						e.document &&
						("loading" !== e.document.readyState ? i.pub.init() : e.document.addEventListener("DOMContentLoaded", i.pub.init, !1));
				},
				installBySelector: function (t, r) {
					if (!(r = r ? i.node(r) : e.document)) throw Error("Missing root node");
					for (
						var n = r.querySelectorAll(t), o = RegExp("(^|\\s)(" + i.pub.lookupClass + ")(\\s*(\\{[^}]*\\})|\\s|$)", "i"), a = 0;
						a < n.length;
						a += 1
					)
						if (
							(!n[a].jscolor || !(n[a].jscolor instanceof i.pub)) &&
							(void 0 === n[a].type || "color" != n[a].type.toLowerCase() || !i.isColorAttrSupported) &&
							(null !== (s = i.getDataAttr(n[a], "jscolor")) || (n[a].className && (l = n[a].className.match(o))))
						) {
							var s,
								l,
								d = n[a],
								h = "";
							null !== s
								? (h = s)
								: l &&
									(console.warn('Installation using class name is DEPRECATED. Use data-jscolor="" attribute instead.' + i.docsRef),
									l[4] && (h = l[4]));
							var p = null;
							if (h.trim())
								try {
									p = i.parseOptionsStr(h);
								} catch (c) {
									console.warn(c + "\n" + h);
								}
							try {
								new i.pub(d, p);
							} catch (u) {
								console.warn(u);
							}
						}
				},
				parseOptionsStr: function (e) {
					var t = null;
					try {
						t = JSON.parse(e);
					} catch (r) {
						if (i.pub.looseJSON)
							try {
								t = Function("var opts = (" + e + '); return typeof opts === "object" ? opts : {};')();
							} catch (n) {
								throw Error("Could not evaluate jscolor options: " + n);
							}
						else throw Error("Could not parse jscolor options as JSON: " + r);
					}
					return t;
				},
				getInstances: function () {
					for (var e = [], t = 0; t < i.instances.length; t += 1) i.instances[t] && i.instances[t].targetElement && e.push(i.instances[t]);
					return e;
				},
				createEl: function (t) {
					var r = e.document.createElement(t);
					return i.setData(r, "gui", !0), r;
				},
				node: function (t) {
					if (!t) return null;
					if ("string" == typeof t) {
						var r = t,
							n = null;
						try {
							n = e.document.querySelector(r);
						} catch (o) {
							return console.warn(o), null;
						}
						return n || console.warn("No element matches the selector: %s", r), n;
					}
					return i.isNode(t) ? t : (console.warn("Invalid node of type %s: %s", typeof t, t), null);
				},
				isNode: function (e) {
					return "object" == typeof Node
						? e instanceof Node
						: e && "object" == typeof e && "number" == typeof e.nodeType && "string" == typeof e.nodeName;
				},
				nodeName: function (e) {
					return !!e && !!e.nodeName && e.nodeName.toLowerCase();
				},
				removeChildren: function (e) {
					for (; e.firstChild; ) e.removeChild(e.firstChild);
				},
				isTextInput: function (e) {
					return e && "input" === i.nodeName(e) && "text" === e.type.toLowerCase();
				},
				isButton: function (e) {
					if (!e) return !1;
					var t = i.nodeName(e);
					return "button" === t || ("input" === t && ["button", "submit", "reset"].indexOf(e.type.toLowerCase()) > -1);
				},
				isButtonEmpty: function (e) {
					switch (i.nodeName(e)) {
						case "input":
							return !e.value || "" === e.value.trim();
						case "button":
							return "" === e.textContent.trim();
					}
					return null;
				},
				isPassiveEventSupported: (function () {
					var t = !1;
					try {
						var r = Object.defineProperty({}, "passive", {
							get: function () {
								t = !0;
							},
						});
						e.addEventListener("testPassive", null, r), e.removeEventListener("testPassive", null, r);
					} catch (n) {}
					return t;
				})(),
				isColorAttrSupported:
					!!(t = e.document.createElement("input")).setAttribute && (t.setAttribute("type", "color"), "color" == t.type.toLowerCase()),
				dataProp: "_data_jscolor",
				setData: function () {
					var e = arguments[0];
					if (3 === arguments.length) {
						var t = e.hasOwnProperty(i.dataProp) ? e[i.dataProp] : (e[i.dataProp] = {}),
							r = arguments[1],
							n = arguments[2];
						return (t[r] = n), !0;
					}
					if (2 === arguments.length && "object" == typeof arguments[1]) {
						var t = e.hasOwnProperty(i.dataProp) ? e[i.dataProp] : (e[i.dataProp] = {}),
							o = arguments[1];
						for (var r in o) o.hasOwnProperty(r) && (t[r] = o[r]);
						return !0;
					}
					throw Error("Invalid arguments");
				},
				removeData: function () {
					var e = arguments[0];
					if (!e.hasOwnProperty(i.dataProp)) return !0;
					for (var t = 1; t < arguments.length; t += 1) {
						var r = arguments[t];
						delete e[i.dataProp][r];
					}
					return !0;
				},
				getData: function (e, t, r) {
					if (!e.hasOwnProperty(i.dataProp)) {
						if (void 0 === r) return;
						e[i.dataProp] = {};
					}
					var n = e[i.dataProp];
					return n.hasOwnProperty(t) || void 0 === r || (n[t] = r), n[t];
				},
				getDataAttr: function (e, t) {
					return e.getAttribute("data-" + t);
				},
				setDataAttr: function (e, t, r) {
					e.setAttribute("data-" + t, r);
				},
				_attachedGroupEvents: {},
				attachGroupEvent: function (e, t, r, n) {
					i._attachedGroupEvents.hasOwnProperty(e) || (i._attachedGroupEvents[e] = []),
						i._attachedGroupEvents[e].push([t, r, n]),
						t.addEventListener(r, n, !1);
				},
				detachGroupEvents: function (e) {
					if (i._attachedGroupEvents.hasOwnProperty(e)) {
						for (var t = 0; t < i._attachedGroupEvents[e].length; t += 1) {
							var r = i._attachedGroupEvents[e][t];
							r[0].removeEventListener(r[1], r[2], !1);
						}
						delete i._attachedGroupEvents[e];
					}
				},
				preventDefault: function (e) {
					e.preventDefault && e.preventDefault(), (e.returnValue = !1);
				},
				triggerEvent: function (t, r, n, o) {
					if (t) {
						var a = null;
						return (
							"function" == typeof Event
								? (a = new Event(r, { bubbles: n, cancelable: o }))
								: (a = e.document.createEvent("Event")).initEvent(r, n, o),
							!!a && (i.setData(a, "internal", !0), t.dispatchEvent(a), !0)
						);
					}
				},
				triggerInputEvent: function (e, t, r, n) {
					e && i.isTextInput(e) && i.triggerEvent(e, t, r, n);
				},
				eventKey: function (e) {
					var t = { 9: "Tab", 13: "Enter", 27: "Escape" };
					return "string" == typeof e.code ? e.code : void 0 !== e.keyCode && t.hasOwnProperty(e.keyCode) ? t[e.keyCode] : null;
				},
				strList: function (e) {
					return e ? e.replace(/^\s+|\s+$/g, "").split(/\s+/) : [];
				},
				hasClass: function (e, t) {
					return (
						!!t && (void 0 !== e.classList ? e.classList.contains(t) : -1 != (" " + e.className.replace(/\s+/g, " ") + " ").indexOf(" " + t + " "))
					);
				},
				addClass: function (e, t) {
					var r = i.strList(t);
					if (void 0 !== e.classList) {
						for (var n = 0; n < r.length; n += 1) e.classList.add(r[n]);
						return;
					}
					for (var n = 0; n < r.length; n += 1) i.hasClass(e, r[n]) || (e.className += (e.className ? " " : "") + r[n]);
				},
				removeClass: function (e, t) {
					var r = i.strList(t);
					if (void 0 !== e.classList) {
						for (var n = 0; n < r.length; n += 1) e.classList.remove(r[n]);
						return;
					}
					for (var n = 0; n < r.length; n += 1) {
						var o = RegExp("^\\s*" + r[n] + "\\s*|\\s*" + r[n] + "\\s*$|\\s+" + r[n] + "(\\s+)", "g");
						e.className = e.className.replace(o, "$1");
					}
				},
				getCompStyle: function (t) {
					var r = e.getComputedStyle ? e.getComputedStyle(t) : t.currentStyle;
					return r || {};
				},
				setStyle: function (e, t, r, n) {
					var o = r ? "important" : "",
						a = null;
					for (var s in t)
						if (t.hasOwnProperty(s)) {
							var l = null;
							null === t[s]
								? (a || (a = i.getData(e, "origStyle")), a && a.hasOwnProperty(s) && (l = a[s]))
								: (n && (a || (a = i.getData(e, "origStyle", {})), a.hasOwnProperty(s) || (a[s] = e.style[s])), (l = t[s])),
								null !== l && e.style.setProperty(s, l, o);
						}
				},
				appendCss: function (e) {
					var t = document.querySelector("head"),
						r = document.createElement("style");
					(r.innerText = e), t.appendChild(r);
				},
				appendDefaultCss: function (e) {
					i.appendCss(
						".jscolor-wrap, .jscolor-wrap div, .jscolor-wrap canvas { position:static; display:block; visibility:visible; overflow:visible; margin:0; padding:0; border:none; border-radius:0; outline:none; z-index:auto; float:none; width:auto; height:auto; left:auto; right:auto; top:auto; bottom:auto; min-width:0; min-height:0; max-width:none; max-height:none; background:none; clip:auto; opacity:1; transform:none; box-shadow:none; box-sizing:content-box; }\n.jscolor-wrap { clear:both; }\n.jscolor-wrap .jscolor-picker { position:relative; }\n.jscolor-wrap .jscolor-shadow { position:absolute; left:0; top:0; width:100%; height:100%; }\n.jscolor-wrap .jscolor-border { position:relative; }\n.jscolor-wrap .jscolor-palette { position:absolute; }\n.jscolor-wrap .jscolor-palette-sw { position:absolute; display:block; cursor:pointer; }\n.jscolor-wrap .jscolor-btn { position:absolute; overflow:hidden; white-space:nowrap; font:13px sans-serif; text-align:center; cursor:pointer; }",
					);
				},
				hexColor: function (e, t, r) {
					return (
						"#" +
						(
							("0" + Math.round(e).toString(16)).slice(-2) +
							("0" + Math.round(t).toString(16)).slice(-2) +
							("0" + Math.round(r).toString(16)).slice(-2)
						).toUpperCase()
					);
				},
				hexaColor: function (e, t, r, n) {
					return (
						"#" +
						(
							("0" + Math.round(e).toString(16)).slice(-2) +
							("0" + Math.round(t).toString(16)).slice(-2) +
							("0" + Math.round(r).toString(16)).slice(-2) +
							("0" + Math.round(255 * n).toString(16)).slice(-2)
						).toUpperCase()
					);
				},
				rgbColor: function (e, t, r) {
					return "rgb(" + Math.round(e) + "," + Math.round(t) + "," + Math.round(r) + ")";
				},
				rgbaColor: function (e, t, r, n) {
					return "rgba(" + Math.round(e) + "," + Math.round(t) + "," + Math.round(r) + "," + Math.round((null == n ? 1 : n) * 100) / 100 + ")";
				},
				linearGradient:
					((r = (function t() {
						for (
							var r = "linear-gradient", n = ["", "-webkit-", "-moz-", "-o-", "-ms-"], i = e.document.createElement("div"), o = 0;
							o < n.length;
							o += 1
						) {
							var a = n[o] + r,
								s = a + "(to right, rgba(0,0,0,0), rgba(0,0,0,0))";
							if (((i.style.background = s), i.style.background)) return a;
						}
						return r;
					})()),
					function () {
						return r + "(" + Array.prototype.join.call(arguments, ", ") + ")";
					}),
				setBorderRadius: function (e, t) {
					i.setStyle(e, { "border-radius": t || "0" });
				},
				setBoxShadow: function (e, t) {
					i.setStyle(e, { "box-shadow": t || "none" });
				},
				getElementPos: function (e, t) {
					var r = 0,
						n = 0,
						o = e.getBoundingClientRect();
					if (((r = o.left), (n = o.top), !t)) {
						var a = i.getViewPos();
						(r += a[0]), (n += a[1]);
					}
					return [r, n];
				},
				getElementSize: function (e) {
					return [e.offsetWidth, e.offsetHeight];
				},
				getAbsPointerPos: function (e) {
					var t = 0,
						r = 0;
					return (
						void 0 !== e.changedTouches && e.changedTouches.length
							? ((t = e.changedTouches[0].clientX), (r = e.changedTouches[0].clientY))
							: "number" == typeof e.clientX && ((t = e.clientX), (r = e.clientY)),
						{ x: t, y: r }
					);
				},
				getRelPointerPos: function (e) {
					var t = (e.target || e.srcElement).getBoundingClientRect(),
						r = 0,
						n = 0,
						i = 0,
						o = 0;
					return (
						void 0 !== e.changedTouches && e.changedTouches.length
							? ((i = e.changedTouches[0].clientX), (o = e.changedTouches[0].clientY))
							: "number" == typeof e.clientX && ((i = e.clientX), (o = e.clientY)),
						{ x: (r = i - t.left), y: (n = o - t.top) }
					);
				},
				getViewPos: function () {
					var t = e.document.documentElement;
					return [(e.pageXOffset || t.scrollLeft) - (t.clientLeft || 0), (e.pageYOffset || t.scrollTop) - (t.clientTop || 0)];
				},
				getViewSize: function () {
					var t = e.document.documentElement;
					return [e.innerWidth || t.clientWidth, e.innerHeight || t.clientHeight];
				},
				RGB_HSV: function (e, t, r) {
					r /= 255;
					var n = Math.min(Math.min((e /= 255), (t /= 255)), r),
						i = Math.max(Math.max(e, t), r),
						o = i - n;
					if (0 === o) return [null, 0, 100 * i];
					var a = e === n ? 3 + (r - t) / o : t === n ? 5 + (e - r) / o : 1 + (t - e) / o;
					return [60 * (6 === a ? 0 : a), 100 * (o / i), 100 * i];
				},
				HSV_RGB: function (e, t, r) {
					var n = 255 * (r / 100);
					if (null === e) return [n, n, n];
					t /= 100;
					var i = Math.floor((e /= 60)),
						o = n * (1 - t),
						a = n * (1 - t * (i % 2 ? e - i : 1 - (e - i)));
					switch (i) {
						case 6:
						case 0:
							return [n, a, o];
						case 1:
							return [a, n, o];
						case 2:
							return [o, n, a];
						case 3:
							return [o, a, n];
						case 4:
							return [a, o, n];
						case 5:
							return [n, o, a];
					}
				},
				parseColorString: function (e) {
					var t = { rgba: null, format: null };
					if ((r = e.match(/^\W*([0-9A-F]{3,8})\W*$/i))) {
						if (8 === r[1].length)
							(t.format = "hexa"),
								(t.rgba = [
									parseInt(r[1].slice(0, 2), 16),
									parseInt(r[1].slice(2, 4), 16),
									parseInt(r[1].slice(4, 6), 16),
									parseInt(r[1].slice(6, 8), 16) / 255,
								]);
						else if (6 === r[1].length)
							(t.format = "hex"),
								(t.rgba = [parseInt(r[1].slice(0, 2), 16), parseInt(r[1].slice(2, 4), 16), parseInt(r[1].slice(4, 6), 16), null]);
						else {
							if (3 !== r[1].length) return !1;
							(t.format = "hex"),
								(t.rgba = [
									parseInt(r[1].charAt(0) + r[1].charAt(0), 16),
									parseInt(r[1].charAt(1) + r[1].charAt(1), 16),
									parseInt(r[1].charAt(2) + r[1].charAt(2), 16),
									null,
								]);
						}
						return t;
					}
					if ((r = e.match(/^\W*rgba?\(([^)]*)\)\W*$/i))) {
						var r,
							n,
							i,
							o,
							a,
							s = r[1].split(","),
							l = /^\s*(\d+|\d*\.\d+|\d+\.\d*)\s*$/;
						if (s.length >= 3 && (n = s[0].match(l)) && (i = s[1].match(l)) && (o = s[2].match(l)))
							return (
								(t.format = "rgb"),
								(t.rgba = [parseFloat(n[1]) || 0, parseFloat(i[1]) || 0, parseFloat(o[1]) || 0, null]),
								s.length >= 4 && (a = s[3].match(l)) && ((t.format = "rgba"), (t.rgba[3] = parseFloat(a[1]) || 0)),
								t
							);
					}
					return !1;
				},
				parsePaletteValue: function (e) {
					var t = [];
					"string" == typeof e
						? e.replace(/#[0-9A-F]{3}\b|#[0-9A-F]{6}([0-9A-F]{2})?\b|rgba?\(([^)]*)\)/gi, function (e) {
								t.push(e);
							})
						: Array.isArray(e) && (t = e);
					for (var r = [], n = 0; n < t.length; n++) {
						var o = i.parseColorString(t[n]);
						o && r.push(o);
					}
					return r;
				},
				containsTranparentColor: function (e) {
					for (var t = 0; t < e.length; t++) {
						var r = e[t].rgba[3];
						if (null !== r && r < 1) return !0;
					}
					return !1;
				},
				isAlphaFormat: function (e) {
					switch (e.toLowerCase()) {
						case "hexa":
						case "rgba":
							return !0;
					}
					return !1;
				},
				scaleCanvasForHighDPR: function (t) {
					var r = e.devicePixelRatio || 1;
					(t.width *= r), (t.height *= r), t.getContext("2d").scale(r, r);
				},
				genColorPreviewCanvas: function (e, t, r, n) {
					var o = Math.round(i.pub.previewSeparator.length),
						a = i.pub.chessboardSize,
						s = i.pub.chessboardColor1,
						l = i.pub.chessboardColor2,
						d = r || 2 * a,
						h = 2 * a,
						p = i.createEl("canvas"),
						c = p.getContext("2d");
					(p.width = d), (p.height = h), n && i.scaleCanvasForHighDPR(p), (c.fillStyle = s), c.fillRect(0, 0, d, h), (c.fillStyle = l);
					for (var u = 0; u < d; u += 2 * a) c.fillRect(u, 0, a, a), c.fillRect(u + a, a, a, a);
					e && ((c.fillStyle = e), c.fillRect(0, 0, d, h));
					var g = null;
					switch (t) {
						case "left":
							(g = 0), c.clearRect(0, 0, o / 2, h);
							break;
						case "right":
							(g = d - o), c.clearRect(d - o / 2, 0, o / 2, h);
					}
					if (null !== g) {
						c.lineWidth = 1;
						for (var f = 0; f < i.pub.previewSeparator.length; f += 1)
							c.beginPath(), (c.strokeStyle = i.pub.previewSeparator[f]), c.moveTo(0.5 + g + f, 0), c.lineTo(0.5 + g + f, h), c.stroke();
					}
					return { canvas: p, width: d, height: h };
				},
				genColorPreviewGradient: function (e, t, r) {
					var n = [];
					return (
						(n =
							t && r
								? [
										"to " + { left: "right", right: "left" }[t],
										e + " 0%",
										e + " " + r + "px",
										"rgba(0,0,0,0) " + (r + 1) + "px",
										"rgba(0,0,0,0) 100%",
									]
								: ["to right", e + " 0%", e + " 100%"]),
						i.linearGradient.apply(this, n)
					);
				},
				redrawPosition: function () {
					if (i.picker && i.picker.owner) {
						var t = i.picker.owner;
						if (t.container !== e.document.body) i._drawPosition(t, 0, 0, "relative", !1);
						else {
							t.fixed
								? ((r = i.getElementPos(t.targetElement, !0)), (n = [0, 0]))
								: ((r = i.getElementPos(t.targetElement)), (n = i.getViewPos()));
							var r,
								n,
								o,
								a,
								s,
								l = i.getElementSize(t.targetElement),
								d = i.getViewSize(),
								h = i.getPickerDims(t),
								p = [h.borderW, h.borderH];
							switch (t.position.toLowerCase()) {
								case "left":
									(o = 1), (a = 0), (s = -1);
									break;
								case "right":
									(o = 1), (a = 0), (s = 1);
									break;
								case "top":
									(o = 0), (a = 1), (s = -1);
									break;
								default:
									(o = 0), (a = 1), (s = 1);
							}
							var c = (l[a] + p[a]) / 2;
							if (t.smartPosition)
								var u = [
									-n[o] + r[o] + p[o] > d[o] && -n[o] + r[o] + l[o] / 2 > d[o] / 2 && r[o] + l[o] - p[o] >= 0 ? r[o] + l[o] - p[o] : r[o],
									-n[a] + r[a] + l[a] + p[a] - c + c * s > d[a]
										? -n[a] + r[a] + l[a] / 2 > d[a] / 2 && r[a] + l[a] - c - c * s >= 0
											? r[a] + l[a] - c - c * s
											: r[a] + l[a] - c + c * s
										: r[a] + l[a] - c + c * s >= 0
											? r[a] + l[a] - c + c * s
											: r[a] + l[a] - c - c * s,
								];
							else var u = [r[o], r[a] + l[a] - c + c * s];
							var g = u[o],
								f = u[a],
								v = t.fixed ? "fixed" : "absolute",
								$ = (u[0] + p[0] > r[0] || u[0] < r[0] + l[0]) && u[1] + p[1] < r[1] + l[1];
							i._drawPosition(t, g, f, v, $);
						}
					}
				},
				_drawPosition: function (e, t, r, n, o) {
					var a = o ? 0 : e.shadowBlur;
					(i.picker.wrap.style.position = n),
						(Math.round(parseFloat(i.picker.wrap.style.left)) !== Math.round(t) ||
							Math.round(parseFloat(i.picker.wrap.style.top)) !== Math.round(r)) &&
							((i.picker.wrap.style.left = t + "px"), (i.picker.wrap.style.top = r + "px")),
						i.setBoxShadow(i.picker.boxS, e.shadow ? new i.BoxShadow(0, a, e.shadowBlur, 0, e.shadowColor) : null);
				},
				getPickerDims: function (e) {
					var t = 2 * e.controlBorderWidth + e.width,
						r = 2 * e.controlBorderWidth + e.height,
						n = 2 * e.controlBorderWidth + 2 * i.getControlPadding(e) + e.sliderSize;
					i.getSliderChannel(e) && (t += n), e.hasAlphaChannel() && (t += n);
					var o = i.getPaletteDims(e, t);
					o.height && (r += o.height + e.padding), e.closeButton && (r += 2 * e.controlBorderWidth + e.padding + e.buttonHeight);
					var a = t + 2 * e.padding,
						s = r + 2 * e.padding;
					return { contentW: t, contentH: r, paddedW: a, paddedH: s, borderW: a + 2 * e.borderWidth, borderH: s + 2 * e.borderWidth, palette: o };
				},
				getPaletteDims: function (e, t) {
					var r = 0,
						n = 0,
						i = 0,
						o = 0,
						a = 0,
						s = e._palette ? e._palette.length : 0;
					return (
						s &&
							((n = (r = e.paletteCols) > 0 ? Math.ceil(s / r) : 0),
							(i = Math.max(1, Math.floor((t - (r - 1) * e.paletteSpacing) / r))),
							(o = e.paletteHeight ? Math.min(e.paletteHeight, i) : i)),
						n && (a = n * o + (n - 1) * e.paletteSpacing),
						{ cols: r, rows: n, cellW: i, cellH: o, width: t, height: a }
					);
				},
				getControlPadding: function (e) {
					return Math.max(e.padding / 2, 2 * e.pointerBorderWidth + e.pointerThickness - e.controlBorderWidth);
				},
				getPadYChannel: function (e) {
					return "v" === e.mode.charAt(1).toLowerCase() ? "v" : "s";
				},
				getSliderChannel: function (e) {
					if (e.mode.length > 2)
						switch (e.mode.charAt(2).toLowerCase()) {
							case "s":
								return "s";
							case "v":
								return "v";
						}
					return null;
				},
				triggerCallback: function (e, t) {
					if (e[t]) {
						var r = null;
						if ("string" == typeof e[t])
							try {
								r = Function(e[t]);
							} catch (n) {
								console.error(n);
							}
						else r = e[t];
						r && r.call(e);
					}
				},
				triggerGlobal: function (e) {
					for (var t = i.getInstances(), r = 0; r < t.length; r += 1) t[r].trigger(e);
				},
				_pointerMoveEvent: { mouse: "mousemove", touch: "touchmove" },
				_pointerEndEvent: { mouse: "mouseup", touch: "touchend" },
				_pointerOrigin: null,
				onDocumentKeyUp: function (e) {
					-1 !== ["Tab", "Escape"].indexOf(i.eventKey(e)) && i.picker && i.picker.owner && i.picker.owner.tryHide();
				},
				onWindowResize: function (e) {
					i.redrawPosition();
				},
				onWindowScroll: function (e) {
					i.redrawPosition();
				},
				onParentScroll: function (e) {
					i.picker && i.picker.owner && i.picker.owner.tryHide();
				},
				onDocumentMouseDown: function (e) {
					var t = e.target || e.srcElement;
					t.jscolor && t.jscolor instanceof i.pub
						? t.jscolor.showOnClick && !t.disabled && t.jscolor.show()
						: i.getData(t, "gui")
							? i.getData(t, "control") && i.onControlPointerStart(e, t, i.getData(t, "control"), "mouse")
							: i.picker && i.picker.owner && i.picker.owner.tryHide();
				},
				onPickerTouchStart: function (e) {
					var t = e.target || e.srcElement;
					i.getData(t, "control") && i.onControlPointerStart(e, t, i.getData(t, "control"), "touch");
				},
				onControlPointerStart: function (t, r, n, o) {
					var a = i.getData(r, "instance");
					i.preventDefault(t);
					var s = function (e, a) {
						i.attachGroupEvent("drag", e, i._pointerMoveEvent[o], i.onDocumentPointerMove(t, r, n, o, a)),
							i.attachGroupEvent("drag", e, i._pointerEndEvent[o], i.onDocumentPointerEnd(t, r, n, o));
					};
					if ((s(e.document, [0, 0]), e.parent && e.frameElement)) {
						var l = e.frameElement.getBoundingClientRect(),
							d = [-l.left, -l.top];
						s(e.parent.window.document, d);
					}
					var h = i.getAbsPointerPos(t),
						p = i.getRelPointerPos(t);
					switch (((i._pointerOrigin = { x: h.x - p.x, y: h.y - p.y }), n)) {
						case "pad":
							"v" === i.getSliderChannel(a) && 0 === a.channels.v && a.fromHSVA(null, null, 100, null), i.setPad(a, t, 0, 0);
							break;
						case "sld":
							i.setSld(a, t, 0);
							break;
						case "asld":
							i.setASld(a, t, 0);
					}
					a.trigger("input");
				},
				onDocumentPointerMove: function (e, t, r, n, o) {
					return function (e) {
						var n = i.getData(t, "instance");
						switch (r) {
							case "pad":
								i.setPad(n, e, o[0], o[1]);
								break;
							case "sld":
								i.setSld(n, e, o[1]);
								break;
							case "asld":
								i.setASld(n, e, o[1]);
						}
						n.trigger("input");
					};
				},
				onDocumentPointerEnd: function (e, t, r, n) {
					return function (e) {
						var r = i.getData(t, "instance");
						i.detachGroupEvents("drag"), r.trigger("input"), r.trigger("change");
					};
				},
				onPaletteSampleClick: function (e) {
					var t = e.currentTarget,
						r = i.getData(t, "instance"),
						n = i.getData(t, "color");
					"any" !== r.format.toLowerCase() || (r._setFormat(n.format), i.isAlphaFormat(r.getFormat()) || (n.rgba[3] = 1)),
						null === n.rgba[3] && (!0 === r.paletteSetsAlpha || ("auto" === r.paletteSetsAlpha && r._paletteHasTransparency)) && (n.rgba[3] = 1),
						r.fromRGBA.apply(r, n.rgba),
						r.trigger("input"),
						r.trigger("change"),
						r.hideOnPaletteClick && r.hide();
				},
				setPad: function (e, t, r, n) {
					var o = i.getAbsPointerPos(t),
						a = r + o.x - i._pointerOrigin.x - e.padding - e.controlBorderWidth,
						s = n + o.y - i._pointerOrigin.y - e.padding - e.controlBorderWidth,
						l = a * (360 / (e.width - 1)),
						d = 100 - s * (100 / (e.height - 1));
					switch (i.getPadYChannel(e)) {
						case "s":
							e.fromHSVA(l, d, null, null);
							break;
						case "v":
							e.fromHSVA(l, null, d, null);
					}
				},
				setSld: function (e, t, r) {
					var n = 100 - (r + i.getAbsPointerPos(t).y - i._pointerOrigin.y - e.padding - e.controlBorderWidth) * (100 / (e.height - 1));
					switch (i.getSliderChannel(e)) {
						case "s":
							e.fromHSVA(null, n, null, null);
							break;
						case "v":
							e.fromHSVA(null, null, n, null);
					}
				},
				setASld: function (e, t, r) {
					var n = 1 - (r + i.getAbsPointerPos(t).y - i._pointerOrigin.y - e.padding - e.controlBorderWidth) * (1 / (e.height - 1));
					if (n < 1) {
						var o = e.getFormat();
						"any" !== e.format.toLowerCase() || i.isAlphaFormat(o) || e._setFormat("hex" === o ? "hexa" : "rgba");
					}
					e.fromHSVA(null, null, null, n);
				},
				createPadCanvas: function () {
					var e = { elm: null, draw: null },
						t = i.createEl("canvas"),
						r = t.getContext("2d"),
						n = function (e, n, i) {
							(t.width = e), (t.height = n), r.clearRect(0, 0, t.width, t.height);
							var o = r.createLinearGradient(0, 0, t.width, 0);
							o.addColorStop(0, "#F00"),
								o.addColorStop(1 / 6, "#FF0"),
								o.addColorStop(2 / 6, "#0F0"),
								o.addColorStop(0.5, "#0FF"),
								o.addColorStop(4 / 6, "#00F"),
								o.addColorStop(5 / 6, "#F0F"),
								o.addColorStop(1, "#F00"),
								(r.fillStyle = o),
								r.fillRect(0, 0, t.width, t.height);
							var a = r.createLinearGradient(0, 0, 0, t.height);
							switch (i.toLowerCase()) {
								case "s":
									a.addColorStop(0, "rgba(255,255,255,0)"), a.addColorStop(1, "rgba(255,255,255,1)");
									break;
								case "v":
									a.addColorStop(0, "rgba(0,0,0,0)"), a.addColorStop(1, "rgba(0,0,0,1)");
							}
							(r.fillStyle = a), r.fillRect(0, 0, t.width, t.height);
						};
					return (e.elm = t), (e.draw = n), e;
				},
				createSliderGradient: function () {
					var e = { elm: null, draw: null },
						t = i.createEl("canvas"),
						r = t.getContext("2d"),
						n = function (e, n, i, o) {
							(t.width = e), (t.height = n), r.clearRect(0, 0, t.width, t.height);
							var a = r.createLinearGradient(0, 0, 0, t.height);
							a.addColorStop(0, i), a.addColorStop(1, o), (r.fillStyle = a), r.fillRect(0, 0, t.width, t.height);
						};
					return (e.elm = t), (e.draw = n), e;
				},
				createASliderGradient: function () {
					var e = { elm: null, draw: null },
						t = i.createEl("canvas"),
						r = t.getContext("2d"),
						n = function (e, n, o) {
							(t.width = e), (t.height = n), r.clearRect(0, 0, t.width, t.height);
							var a = t.width / 2,
								s = i.pub.chessboardColor1,
								l = i.pub.chessboardColor2;
							if (((r.fillStyle = s), r.fillRect(0, 0, t.width, t.height), a > 0))
								for (var d = 0; d < t.height; d += 2 * a) (r.fillStyle = l), r.fillRect(0, d, a, a), r.fillRect(a, d + a, a, a);
							var h = r.createLinearGradient(0, 0, 0, t.height);
							h.addColorStop(0, o), h.addColorStop(1, "rgba(0,0,0,0)"), (r.fillStyle = h), r.fillRect(0, 0, t.width, t.height);
						};
					return (e.elm = t), (e.draw = n), e;
				},
				BoxShadow:
					(((n = function (e, t, r, n, i, o) {
						(this.hShadow = e), (this.vShadow = t), (this.blur = r), (this.spread = n), (this.color = i), (this.inset = !!o);
					}).prototype.toString = function () {
						var e = [
							Math.round(this.hShadow) + "px",
							Math.round(this.vShadow) + "px",
							Math.round(this.blur) + "px",
							Math.round(this.spread) + "px",
							this.color,
						];
						return this.inset && e.push("inset"), e.join(" ");
					}),
					n),
				flags: { leaveValue: 1, leaveAlpha: 2, leavePreview: 4 },
				enumOpts: {
					format: ["auto", "any", "hex", "hexa", "rgb", "rgba"],
					previewPosition: ["left", "right"],
					mode: ["hsv", "hvs", "hs", "hv"],
					position: ["left", "right", "top", "bottom"],
					alphaChannel: ["auto", !0, !1],
					paletteSetsAlpha: ["auto", !0, !1],
				},
				deprecatedOpts: {
					styleElement: "previewElement",
					onFineChange: "onInput",
					overwriteImportant: "forceStyle",
					closable: "closeButton",
					insetWidth: "controlBorderWidth",
					insetColor: "controlBorderColor",
					refine: null,
				},
				docsRef: " See https://jscolor.com/docs/",
				pub: function (t, r) {
					var n = this;
					function o(e, t) {
						if ("string" != typeof e) throw Error("Invalid value for option name: " + e);
						if (i.enumOpts.hasOwnProperty(e) && ("string" == typeof t && (t = t.toLowerCase()), -1 === i.enumOpts[e].indexOf(t)))
							throw Error("Option '" + e + "' has invalid value: " + t);
						if (i.deprecatedOpts.hasOwnProperty(e)) {
							var r = e,
								o = i.deprecatedOpts[e];
							if (o) console.warn("Option '%s' is DEPRECATED, using '%s' instead." + i.docsRef, r, o), (e = o);
							else throw Error("Option '" + e + "' is DEPRECATED");
						}
						var a = "set__" + e;
						if ("function" == typeof n[a]) return n[a](t), !0;
						if (e in n) return (n[e] = t), !0;
						throw Error("Unrecognized configuration option: " + e);
					}
					function a() {
						n._processParentElementsInDOM(),
							i.picker ||
								((i.picker = {
									owner: null,
									wrap: i.createEl("div"),
									box: i.createEl("div"),
									boxS: i.createEl("div"),
									boxB: i.createEl("div"),
									pad: i.createEl("div"),
									padB: i.createEl("div"),
									padM: i.createEl("div"),
									padCanvas: i.createPadCanvas(),
									cross: i.createEl("div"),
									crossBY: i.createEl("div"),
									crossBX: i.createEl("div"),
									crossLY: i.createEl("div"),
									crossLX: i.createEl("div"),
									sld: i.createEl("div"),
									sldB: i.createEl("div"),
									sldM: i.createEl("div"),
									sldGrad: i.createSliderGradient(),
									sldPtrS: i.createEl("div"),
									sldPtrIB: i.createEl("div"),
									sldPtrMB: i.createEl("div"),
									sldPtrOB: i.createEl("div"),
									asld: i.createEl("div"),
									asldB: i.createEl("div"),
									asldM: i.createEl("div"),
									asldGrad: i.createASliderGradient(),
									asldPtrS: i.createEl("div"),
									asldPtrIB: i.createEl("div"),
									asldPtrMB: i.createEl("div"),
									asldPtrOB: i.createEl("div"),
									pal: i.createEl("div"),
									btn: i.createEl("div"),
									btnT: i.createEl("div"),
								}),
								i.picker.pad.appendChild(i.picker.padCanvas.elm),
								i.picker.padB.appendChild(i.picker.pad),
								i.picker.cross.appendChild(i.picker.crossBY),
								i.picker.cross.appendChild(i.picker.crossBX),
								i.picker.cross.appendChild(i.picker.crossLY),
								i.picker.cross.appendChild(i.picker.crossLX),
								i.picker.padB.appendChild(i.picker.cross),
								i.picker.box.appendChild(i.picker.padB),
								i.picker.box.appendChild(i.picker.padM),
								i.picker.sld.appendChild(i.picker.sldGrad.elm),
								i.picker.sldB.appendChild(i.picker.sld),
								i.picker.sldB.appendChild(i.picker.sldPtrOB),
								i.picker.sldPtrOB.appendChild(i.picker.sldPtrMB),
								i.picker.sldPtrMB.appendChild(i.picker.sldPtrIB),
								i.picker.sldPtrIB.appendChild(i.picker.sldPtrS),
								i.picker.box.appendChild(i.picker.sldB),
								i.picker.box.appendChild(i.picker.sldM),
								i.picker.asld.appendChild(i.picker.asldGrad.elm),
								i.picker.asldB.appendChild(i.picker.asld),
								i.picker.asldB.appendChild(i.picker.asldPtrOB),
								i.picker.asldPtrOB.appendChild(i.picker.asldPtrMB),
								i.picker.asldPtrMB.appendChild(i.picker.asldPtrIB),
								i.picker.asldPtrIB.appendChild(i.picker.asldPtrS),
								i.picker.box.appendChild(i.picker.asldB),
								i.picker.box.appendChild(i.picker.asldM),
								i.picker.box.appendChild(i.picker.pal),
								i.picker.btn.appendChild(i.picker.btnT),
								i.picker.box.appendChild(i.picker.btn),
								i.picker.boxB.appendChild(i.picker.box),
								i.picker.wrap.appendChild(i.picker.boxS),
								i.picker.wrap.appendChild(i.picker.boxB),
								i.picker.wrap.addEventListener("touchstart", i.onPickerTouchStart, !!i.isPassiveEventSupported && { passive: !1 }));
						var e,
							t,
							r = i.picker,
							o = !!i.getSliderChannel(n),
							a = n.hasAlphaChannel(),
							h = i.getPickerDims(n),
							p = 2 * n.pointerBorderWidth + n.pointerThickness + 2 * n.crossSize,
							c = i.getControlPadding(n),
							u = Math.min(n.borderRadius, Math.round(n.padding * Math.PI));
						(r.wrap.className = "jscolor-wrap"),
							(r.wrap.style.width = h.borderW + "px"),
							(r.wrap.style.height = h.borderH + "px"),
							(r.wrap.style.zIndex = n.zIndex),
							(r.box.className = "jscolor-picker"),
							(r.box.style.width = h.paddedW + "px"),
							(r.box.style.height = h.paddedH + "px"),
							(r.boxS.className = "jscolor-shadow"),
							i.setBorderRadius(r.boxS, u + "px"),
							(r.boxB.className = "jscolor-border"),
							(r.boxB.style.border = n.borderWidth + "px solid"),
							(r.boxB.style.borderColor = n.borderColor),
							(r.boxB.style.background = n.backgroundColor),
							i.setBorderRadius(r.boxB, u + "px"),
							(r.padM.style.background = "rgba(255,0,0,.2)"),
							(r.sldM.style.background = "rgba(0,255,0,.2)"),
							(r.asldM.style.background = "rgba(0,0,255,.2)"),
							(r.padM.style.opacity = r.sldM.style.opacity = r.asldM.style.opacity = "0"),
							(r.pad.style.position = "relative"),
							(r.pad.style.width = n.width + "px"),
							(r.pad.style.height = n.height + "px"),
							r.padCanvas.draw(n.width, n.height, i.getPadYChannel(n)),
							(r.padB.style.position = "absolute"),
							(r.padB.style.left = n.padding + "px"),
							(r.padB.style.top = n.padding + "px"),
							(r.padB.style.border = n.controlBorderWidth + "px solid"),
							(r.padB.style.borderColor = n.controlBorderColor),
							(r.padM.style.position = "absolute"),
							(r.padM.style.left = "0px"),
							(r.padM.style.top = "0px"),
							(r.padM.style.width = n.padding + 2 * n.controlBorderWidth + n.width + c + "px"),
							(r.padM.style.height = 2 * n.controlBorderWidth + 2 * n.padding + n.height + "px"),
							(r.padM.style.cursor = "crosshair"),
							i.setData(r.padM, { instance: n, control: "pad" }),
							(r.cross.style.position = "absolute"),
							(r.cross.style.left = r.cross.style.top = "0"),
							(r.cross.style.width = r.cross.style.height = p + "px"),
							(r.crossBY.style.position = r.crossBX.style.position = "absolute"),
							(r.crossBY.style.background = r.crossBX.style.background = n.pointerBorderColor),
							(r.crossBY.style.width = r.crossBX.style.height = 2 * n.pointerBorderWidth + n.pointerThickness + "px"),
							(r.crossBY.style.height = r.crossBX.style.width = p + "px"),
							(r.crossBY.style.left = r.crossBX.style.top = Math.floor(p / 2) - Math.floor(n.pointerThickness / 2) - n.pointerBorderWidth + "px"),
							(r.crossBY.style.top = r.crossBX.style.left = "0"),
							(r.crossLY.style.position = r.crossLX.style.position = "absolute"),
							(r.crossLY.style.background = r.crossLX.style.background = n.pointerColor),
							(r.crossLY.style.height = r.crossLX.style.width = p - 2 * n.pointerBorderWidth + "px"),
							(r.crossLY.style.width = r.crossLX.style.height = n.pointerThickness + "px"),
							(r.crossLY.style.left = r.crossLX.style.top = Math.floor(p / 2) - Math.floor(n.pointerThickness / 2) + "px"),
							(r.crossLY.style.top = r.crossLX.style.left = n.pointerBorderWidth + "px"),
							(r.sld.style.overflow = "hidden"),
							(r.sld.style.width = n.sliderSize + "px"),
							(r.sld.style.height = n.height + "px"),
							r.sldGrad.draw(n.sliderSize, n.height, "#000", "#000"),
							(r.sldB.style.display = o ? "block" : "none"),
							(r.sldB.style.position = "absolute"),
							(r.sldB.style.left = n.padding + n.width + 2 * n.controlBorderWidth + 2 * c + "px"),
							(r.sldB.style.top = n.padding + "px"),
							(r.sldB.style.border = n.controlBorderWidth + "px solid"),
							(r.sldB.style.borderColor = n.controlBorderColor),
							(r.sldM.style.display = o ? "block" : "none"),
							(r.sldM.style.position = "absolute"),
							(r.sldM.style.left = n.padding + n.width + 2 * n.controlBorderWidth + c + "px"),
							(r.sldM.style.top = "0px"),
							(r.sldM.style.width = n.sliderSize + 2 * c + 2 * n.controlBorderWidth + (a ? 0 : Math.max(0, n.padding - c)) + "px"),
							(r.sldM.style.height = 2 * n.controlBorderWidth + 2 * n.padding + n.height + "px"),
							(r.sldM.style.cursor = "default"),
							i.setData(r.sldM, { instance: n, control: "sld" }),
							(r.sldPtrIB.style.border = r.sldPtrOB.style.border = n.pointerBorderWidth + "px solid " + n.pointerBorderColor),
							(r.sldPtrOB.style.position = "absolute"),
							(r.sldPtrOB.style.left = -(2 * n.pointerBorderWidth + n.pointerThickness) + "px"),
							(r.sldPtrOB.style.top = "0"),
							(r.sldPtrMB.style.border = n.pointerThickness + "px solid " + n.pointerColor),
							(r.sldPtrS.style.width = n.sliderSize + "px"),
							(r.sldPtrS.style.height = i.pub.sliderInnerSpace + "px"),
							(r.asld.style.overflow = "hidden"),
							(r.asld.style.width = n.sliderSize + "px"),
							(r.asld.style.height = n.height + "px"),
							r.asldGrad.draw(n.sliderSize, n.height, "#000"),
							(r.asldB.style.display = a ? "block" : "none"),
							(r.asldB.style.position = "absolute"),
							(r.asldB.style.left =
								n.padding + n.width + 2 * n.controlBorderWidth + c + (o ? n.sliderSize + 3 * c + 2 * n.controlBorderWidth : 0) + "px"),
							(r.asldB.style.top = n.padding + "px"),
							(r.asldB.style.border = n.controlBorderWidth + "px solid"),
							(r.asldB.style.borderColor = n.controlBorderColor),
							(r.asldM.style.display = a ? "block" : "none"),
							(r.asldM.style.position = "absolute"),
							(r.asldM.style.left =
								n.padding + n.width + 2 * n.controlBorderWidth + c + (o ? n.sliderSize + 2 * c + 2 * n.controlBorderWidth : 0) + "px"),
							(r.asldM.style.top = "0px"),
							(r.asldM.style.width = n.sliderSize + 2 * c + 2 * n.controlBorderWidth + Math.max(0, n.padding - c) + "px"),
							(r.asldM.style.height = 2 * n.controlBorderWidth + 2 * n.padding + n.height + "px"),
							(r.asldM.style.cursor = "default"),
							i.setData(r.asldM, { instance: n, control: "asld" }),
							(r.asldPtrIB.style.border = r.asldPtrOB.style.border = n.pointerBorderWidth + "px solid " + n.pointerBorderColor),
							(r.asldPtrOB.style.position = "absolute"),
							(r.asldPtrOB.style.left = -(2 * n.pointerBorderWidth + n.pointerThickness) + "px"),
							(r.asldPtrOB.style.top = "0"),
							(r.asldPtrMB.style.border = n.pointerThickness + "px solid " + n.pointerColor),
							(r.asldPtrS.style.width = n.sliderSize + "px"),
							(r.asldPtrS.style.height = i.pub.sliderInnerSpace + "px"),
							(r.pal.className = "jscolor-palette"),
							(r.pal.style.display = h.palette.rows ? "block" : "none"),
							(r.pal.style.left = n.padding + "px"),
							(r.pal.style.top = 2 * n.controlBorderWidth + 2 * n.padding + n.height + "px"),
							(r.pal.innerHTML = "");
						for (var g = i.genColorPreviewCanvas("rgba(0,0,0,0)"), f = 0, v = 0; v < h.palette.rows; v++)
							for (var $ = 0; $ < h.palette.cols && f < n._palette.length; $++, f++) {
								var m = n._palette[f],
									b = i.rgbaColor.apply(null, m.rgba),
									w = i.createEl("div");
								(w.style.width = h.palette.cellW - 2 * n.controlBorderWidth + "px"),
									(w.style.height = h.palette.cellH - 2 * n.controlBorderWidth + "px"),
									(w.style.backgroundColor = b);
								var y = i.createEl("div");
								(y.className = "jscolor-palette-sw"),
									(y.style.left =
										(h.palette.cols <= 1 ? 0 : Math.round(10 * ($ * ((h.contentW - h.palette.cellW) / (h.palette.cols - 1)))) / 10) + "px"),
									(y.style.top = v * (h.palette.cellH + n.paletteSpacing) + "px"),
									(y.style.border = n.controlBorderWidth + "px solid"),
									(y.style.borderColor = n.controlBorderColor),
									null !== m.rgba[3] &&
										m.rgba[3] < 1 &&
										((y.style.backgroundImage = "url('" + g.canvas.toDataURL() + "')"),
										(y.style.backgroundRepeat = "repeat"),
										(y.style.backgroundPosition = "center center")),
									i.setData(y, { instance: n, control: "palette-sw", color: m }),
									y.addEventListener("click", i.onPaletteSampleClick, !1),
									y.appendChild(w),
									r.pal.appendChild(y);
							}
						(r.btn.className = "jscolor-btn jscolor-btn-close"),
							(r.btn.style.display = n.closeButton ? "block" : "none"),
							(r.btn.style.left = n.padding + "px"),
							(r.btn.style.bottom = n.padding + "px"),
							(r.btn.style.padding = "0 15px"),
							(r.btn.style.maxWidth = h.contentW - 2 * n.controlBorderWidth - 30 + "px"),
							(r.btn.style.height = n.buttonHeight + "px"),
							(r.btn.style.border = n.controlBorderWidth + "px solid"),
							(t = (e = n.controlBorderColor.split(/\s+/)).length < 2 ? e[0] : e[1] + " " + e[0] + " " + e[0] + " " + e[1]),
							(r.btn.style.borderColor = t),
							(r.btn.style.color = n.buttonColor),
							(r.btn.onmousedown = function () {
								n.hide();
							}),
							(r.btnT.style.display = "inline"),
							(r.btnT.style.lineHeight = n.buttonHeight + "px"),
							(r.btnT.innerText = n.closeText),
							s(),
							l(),
							d(),
							i.picker.owner && i.picker.owner !== n && i.removeClass(i.picker.owner.targetElement, i.pub.activeClassName),
							(i.picker.owner = n),
							i.redrawPosition(),
							r.wrap.parentNode !== n.container && n.container.appendChild(r.wrap),
							i.addClass(n.targetElement, i.pub.activeClassName);
					}
					function s() {
						var e = i.getPadYChannel(n),
							t = Math.round((n.channels.h / 360) * (n.width - 1)),
							r = Math.round((1 - n.channels[e] / 100) * (n.height - 1)),
							o = -Math.floor((2 * n.pointerBorderWidth + n.pointerThickness + 2 * n.crossSize) / 2);
						switch (((i.picker.cross.style.left = t + o + "px"), (i.picker.cross.style.top = r + o + "px"), i.getSliderChannel(n))) {
							case "s":
								var a = i.HSV_RGB(n.channels.h, 100, n.channels.v),
									s = i.HSV_RGB(n.channels.h, 0, n.channels.v),
									l = "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")",
									d = "rgb(" + Math.round(s[0]) + "," + Math.round(s[1]) + "," + Math.round(s[2]) + ")";
								i.picker.sldGrad.draw(n.sliderSize, n.height, l, d);
								break;
							case "v":
								var h = i.HSV_RGB(n.channels.h, n.channels.s, 100),
									l = "rgb(" + Math.round(h[0]) + "," + Math.round(h[1]) + "," + Math.round(h[2]) + ")",
									d = "#000";
								i.picker.sldGrad.draw(n.sliderSize, n.height, l, d);
						}
						i.picker.asldGrad.draw(n.sliderSize, n.height, n.toHEXString());
					}
					function l() {
						var e = i.getSliderChannel(n);
						if (e) {
							var t = Math.round((1 - n.channels[e] / 100) * (n.height - 1));
							i.picker.sldPtrOB.style.top = t - (2 * n.pointerBorderWidth + n.pointerThickness) - Math.floor(i.pub.sliderInnerSpace / 2) + "px";
						}
						i.picker.asldGrad.draw(n.sliderSize, n.height, n.toHEXString());
					}
					function d() {
						var e = Math.round((1 - n.channels.a) * (n.height - 1));
						i.picker.asldPtrOB.style.top = e - (2 * n.pointerBorderWidth + n.pointerThickness) - Math.floor(i.pub.sliderInnerSpace / 2) + "px";
					}
					function h() {
						return i.picker && i.picker.owner === n;
					}
					if (
						(r || (r = {}),
						(this.channels = { r: 255, g: 255, b: 255, h: 0, s: 0, v: 100, a: 1 }),
						(this.format = "auto"),
						(this.value = void 0),
						(this.alpha = void 0),
						(this.random = !1),
						(this.onChange = void 0),
						(this.onInput = void 0),
						(this.valueElement = void 0),
						(this.alphaElement = void 0),
						(this.previewElement = void 0),
						(this.previewPosition = "left"),
						(this.previewSize = 32),
						(this.previewPadding = 8),
						(this.required = !0),
						(this.hash = !0),
						(this.uppercase = !0),
						(this.forceStyle = !0),
						(this.width = 181),
						(this.height = 101),
						(this.mode = "HSV"),
						(this.alphaChannel = "auto"),
						(this.position = "bottom"),
						(this.smartPosition = !0),
						(this.showOnClick = !0),
						(this.hideOnLeave = !0),
						(this.palette = []),
						(this.paletteCols = 10),
						(this.paletteSetsAlpha = "auto"),
						(this.paletteHeight = 16),
						(this.paletteSpacing = 4),
						(this.hideOnPaletteClick = !1),
						(this.sliderSize = 16),
						(this.crossSize = 8),
						(this.closeButton = !1),
						(this.closeText = "Close"),
						(this.buttonColor = "rgba(0,0,0,1)"),
						(this.buttonHeight = 18),
						(this.padding = 12),
						(this.backgroundColor = "rgba(255,255,255,1)"),
						(this.borderWidth = 1),
						(this.borderColor = "rgba(187,187,187,1)"),
						(this.borderRadius = 8),
						(this.controlBorderWidth = 1),
						(this.controlBorderColor = "rgba(187,187,187,1)"),
						(this.shadow = !0),
						(this.shadowBlur = 15),
						(this.shadowColor = "rgba(0,0,0,0.2)"),
						(this.pointerColor = "rgba(76,76,76,1)"),
						(this.pointerBorderWidth = 1),
						(this.pointerBorderColor = "rgba(255,255,255,1)"),
						(this.pointerThickness = 2),
						(this.zIndex = 5e3),
						(this.container = void 0),
						(this.minS = 0),
						(this.maxS = 100),
						(this.minV = 0),
						(this.maxV = 100),
						(this.minA = 0),
						(this.maxA = 1),
						(this.option = function () {
							if (!arguments.length) throw Error("No option specified");
							if (1 === arguments.length && "string" == typeof arguments[0]) {
								try {
									return (function e(t) {
										if ("string" != typeof t) throw Error("Invalid value for option name: " + t);
										if (i.deprecatedOpts.hasOwnProperty(t)) {
											var r = t,
												o = i.deprecatedOpts[t];
											if (o) console.warn("Option '%s' is DEPRECATED, using '%s' instead." + i.docsRef, r, o), (t = o);
											else throw Error("Option '" + t + "' is DEPRECATED");
										}
										var a = "get__" + t;
										if ("function" == typeof n[a]) return n[a](value);
										if (t in n) return n[t];
										throw Error("Unrecognized configuration option: " + t);
									})(arguments[0]);
								} catch (e) {
									console.warn(e);
								}
								return !1;
							}
							if (arguments.length >= 2 && "string" == typeof arguments[0]) {
								try {
									if (!o(arguments[0], arguments[1])) return !1;
								} catch (t) {
									return console.warn(t), !1;
								}
								return this.redraw(), this.exposeColor(), !0;
							}
							if (1 === arguments.length && "object" == typeof arguments[0]) {
								var r = arguments[0],
									a = !0;
								for (var s in r)
									if (r.hasOwnProperty(s))
										try {
											o(s, r[s]) || (a = !1);
										} catch (l) {
											console.warn(l), (a = !1);
										}
								return this.redraw(), this.exposeColor(), a;
							}
							throw Error("Invalid arguments");
						}),
						(this.channel = function (e, t) {
							if ("string" != typeof e) throw Error("Invalid value for channel name: " + e);
							if (void 0 === t)
								return this.channels.hasOwnProperty(e.toLowerCase())
									? this.channels[e.toLowerCase()]
									: (console.warn("Getting unknown channel: " + e), !1);
							var r = !1;
							switch (e.toLowerCase()) {
								case "r":
									r = this.fromRGBA(t, null, null, null);
									break;
								case "g":
									r = this.fromRGBA(null, t, null, null);
									break;
								case "b":
									r = this.fromRGBA(null, null, t, null);
									break;
								case "h":
									r = this.fromHSVA(t, null, null, null);
									break;
								case "s":
									r = this.fromHSVA(null, t, null, null);
									break;
								case "v":
									r = this.fromHSVA(null, null, t, null);
									break;
								case "a":
									r = this.fromHSVA(null, null, null, t);
									break;
								default:
									return console.warn("Setting unknown channel: " + e), !1;
							}
							return !!r && (this.redraw(), !0);
						}),
						(this.trigger = function (e) {
							for (var t = i.strList(e), r = 0; r < t.length; r += 1) {
								var n = t[r].toLowerCase(),
									o = null;
								switch (n) {
									case "input":
										o = "onInput";
										break;
									case "change":
										o = "onChange";
								}
								o && i.triggerCallback(this, o), i.triggerInputEvent(this.valueElement, n, !0, !0);
							}
						}),
						(this.fromHSVA = function (e, t, r, n, o) {
							if ((void 0 === e && (e = null), void 0 === t && (t = null), void 0 === r && (r = null), void 0 === n && (n = null), null !== e)) {
								if (isNaN(e)) return !1;
								this.channels.h = Math.max(0, Math.min(360, e));
							}
							if (null !== t) {
								if (isNaN(t)) return !1;
								this.channels.s = Math.max(0, Math.min(100, this.maxS, t), this.minS);
							}
							if (null !== r) {
								if (isNaN(r)) return !1;
								this.channels.v = Math.max(0, Math.min(100, this.maxV, r), this.minV);
							}
							if (null !== n) {
								if (isNaN(n)) return !1;
								this.channels.a = this.hasAlphaChannel() ? Math.max(0, Math.min(1, this.maxA, n), this.minA) : 1;
							}
							var a = i.HSV_RGB(this.channels.h, this.channels.s, this.channels.v);
							return (this.channels.r = a[0]), (this.channels.g = a[1]), (this.channels.b = a[2]), this.exposeColor(o), !0;
						}),
						(this.fromRGBA = function (e, t, r, n, o) {
							if ((void 0 === e && (e = null), void 0 === t && (t = null), void 0 === r && (r = null), void 0 === n && (n = null), null !== e)) {
								if (isNaN(e)) return !1;
								e = Math.max(0, Math.min(255, e));
							}
							if (null !== t) {
								if (isNaN(t)) return !1;
								t = Math.max(0, Math.min(255, t));
							}
							if (null !== r) {
								if (isNaN(r)) return !1;
								r = Math.max(0, Math.min(255, r));
							}
							if (null !== n) {
								if (isNaN(n)) return !1;
								this.channels.a = this.hasAlphaChannel() ? Math.max(0, Math.min(1, this.maxA, n), this.minA) : 1;
							}
							var a = i.RGB_HSV(null === e ? this.channels.r : e, null === t ? this.channels.g : t, null === r ? this.channels.b : r);
							null !== a[0] && (this.channels.h = Math.max(0, Math.min(360, a[0]))),
								0 !== a[2] && (this.channels.s = Math.max(0, this.minS, Math.min(100, this.maxS, a[1]))),
								(this.channels.v = Math.max(0, this.minV, Math.min(100, this.maxV, a[2])));
							var s = i.HSV_RGB(this.channels.h, this.channels.s, this.channels.v);
							return (this.channels.r = s[0]), (this.channels.g = s[1]), (this.channels.b = s[2]), this.exposeColor(o), !0;
						}),
						(this.fromHSV = function (e, t, r, n) {
							return console.warn("fromHSV() method is DEPRECATED. Using fromHSVA() instead." + i.docsRef), this.fromHSVA(e, t, r, null, n);
						}),
						(this.fromRGB = function (e, t, r, n) {
							return console.warn("fromRGB() method is DEPRECATED. Using fromRGBA() instead." + i.docsRef), this.fromRGBA(e, t, r, null, n);
						}),
						(this.fromString = function (e, t) {
							if (!this.required && "" === e.trim()) return this.setPreviewElementBg(null), this.setValueElementValue(""), !0;
							var r = i.parseColorString(e);
							return (
								!!r &&
								("any" !== this.format.toLowerCase() || (this._setFormat(r.format), i.isAlphaFormat(this.getFormat()) || (r.rgba[3] = 1)),
								this.fromRGBA(r.rgba[0], r.rgba[1], r.rgba[2], r.rgba[3], t),
								!0)
							);
						}),
						(this.randomize = function (e, t, r, n, i, o, a, s) {
							void 0 === e && (e = 0),
								void 0 === t && (t = 100),
								void 0 === r && (r = 0),
								void 0 === n && (n = 100),
								void 0 === i && (i = 0),
								void 0 === o && (o = 359),
								void 0 === a && (a = 1),
								void 0 === s && (s = 1),
								this.fromHSVA(
									i + Math.floor(Math.random() * (o - i + 1)),
									r + Math.floor(Math.random() * (n - r + 1)),
									e + Math.floor(Math.random() * (t - e + 1)),
									(100 * a + Math.floor(Math.random() * (100 * (s - a) + 1))) / 100,
								);
						}),
						(this.toString = function (e) {
							switch ((void 0 === e && (e = this.getFormat()), e.toLowerCase())) {
								case "hex":
									return this.toHEXString();
								case "hexa":
									return this.toHEXAString();
								case "rgb":
									return this.toRGBString();
								case "rgba":
									return this.toRGBAString();
							}
							return !1;
						}),
						(this.toHEXString = function () {
							return i.hexColor(this.channels.r, this.channels.g, this.channels.b);
						}),
						(this.toHEXAString = function () {
							return i.hexaColor(this.channels.r, this.channels.g, this.channels.b, this.channels.a);
						}),
						(this.toRGBString = function () {
							return i.rgbColor(this.channels.r, this.channels.g, this.channels.b);
						}),
						(this.toRGBAString = function () {
							return i.rgbaColor(this.channels.r, this.channels.g, this.channels.b, this.channels.a);
						}),
						(this.toGrayscale = function () {
							return 0.213 * this.channels.r + 0.715 * this.channels.g + 0.072 * this.channels.b;
						}),
						(this.toCanvas = function () {
							return i.genColorPreviewCanvas(this.toRGBAString()).canvas;
						}),
						(this.toDataURL = function () {
							return this.toCanvas().toDataURL();
						}),
						(this.toBackground = function () {
							return i.pub.background(this.toRGBAString());
						}),
						(this.isLight = function () {
							return this.toGrayscale() > 127.5;
						}),
						(this.hide = function () {
							h() &&
								(i.removeClass(n.targetElement, i.pub.activeClassName),
								i.picker.wrap.parentNode.removeChild(i.picker.wrap),
								delete i.picker.owner);
						}),
						(this.show = function () {
							a();
						}),
						(this.redraw = function () {
							h() && a();
						}),
						(this.getFormat = function () {
							return this._currentFormat;
						}),
						(this._setFormat = function (e) {
							this._currentFormat = e.toLowerCase();
						}),
						(this.hasAlphaChannel = function () {
							return "auto" === this.alphaChannel
								? "any" === this.format.toLowerCase() ||
										i.isAlphaFormat(this.getFormat()) ||
										void 0 !== this.alpha ||
										void 0 !== this.alphaElement
								: this.alphaChannel;
						}),
						(this.processValueInput = function (e) {
							this.fromString(e) || this.exposeColor();
						}),
						(this.processAlphaInput = function (e) {
							this.fromHSVA(null, null, null, parseFloat(e)) || this.exposeColor();
						}),
						(this.exposeColor = function (e) {
							var t = this.toString(),
								r = this.getFormat();
							if (
								(i.setDataAttr(this.targetElement, "current-color", t),
								!(e & i.flags.leaveValue) &&
									this.valueElement &&
									(("hex" !== r && "hexa" !== r) || (this.uppercase || (t = t.toLowerCase()), this.hash || (t = t.replace(/^#/, ""))),
									this.setValueElementValue(t)),
								!(e & i.flags.leaveAlpha) && this.alphaElement)
							) {
								var n = Math.round(100 * this.channels.a) / 100;
								this.setAlphaElementValue(n);
							}
							if (!(e & i.flags.leavePreview) && this.previewElement) {
								var o = null;
								(i.isTextInput(this.previewElement) || (i.isButton(this.previewElement) && !i.isButtonEmpty(this.previewElement))) &&
									(o = this.previewPosition),
									this.setPreviewElementBg(this.toRGBAString());
							}
							h() && (s(), l(), d());
						}),
						(this.setPreviewElementBg = function (e) {
							if (this.previewElement) {
								var t = null,
									r = null;
								(i.isTextInput(this.previewElement) || (i.isButton(this.previewElement) && !i.isButtonEmpty(this.previewElement))) &&
									((t = this.previewPosition), (r = this.previewSize));
								var n = [];
								if (e) {
									n.push({
										image: i.genColorPreviewGradient(e, t, r ? r - i.pub.previewSeparator.length : null),
										position: "left top",
										size: "auto",
										repeat: t ? "repeat-y" : "repeat",
										origin: "padding-box",
									});
									var o = i.genColorPreviewCanvas("rgba(0,0,0,0)", t ? { left: "right", right: "left" }[t] : null, r, !0);
									n.push({
										image: "url('" + o.canvas.toDataURL() + "')",
										position: (t || "left") + " top",
										size: o.width + "px " + o.height + "px",
										repeat: t ? "repeat-y" : "repeat",
										origin: "padding-box",
									});
								} else n.push({ image: "none", position: "left top", size: "auto", repeat: "no-repeat", origin: "padding-box" });
								for (var a = { image: [], position: [], size: [], repeat: [], origin: [] }, s = 0; s < n.length; s += 1)
									a.image.push(n[s].image),
										a.position.push(n[s].position),
										a.size.push(n[s].size),
										a.repeat.push(n[s].repeat),
										a.origin.push(n[s].origin);
								var l = {
									"background-image": a.image.join(", "),
									"background-position": a.position.join(", "),
									"background-size": a.size.join(", "),
									"background-repeat": a.repeat.join(", "),
									"background-origin": a.origin.join(", "),
								};
								i.setStyle(this.previewElement, l, this.forceStyle);
								var d = { left: null, right: null };
								t && (d[t] = this.previewSize + this.previewPadding + "px");
								var l = { "padding-left": d.left, "padding-right": d.right };
								i.setStyle(this.previewElement, l, this.forceStyle, !0);
							}
						}),
						(this.setValueElementValue = function (e) {
							this.valueElement &&
								("input" === i.nodeName(this.valueElement) ? (this.valueElement.value = e) : (this.valueElement.innerHTML = e));
						}),
						(this.setAlphaElementValue = function (e) {
							this.alphaElement &&
								("input" === i.nodeName(this.alphaElement) ? (this.alphaElement.value = e) : (this.alphaElement.innerHTML = e));
						}),
						(this._processParentElementsInDOM = function () {
							if (!this._parentElementsProcessed) {
								this._parentElementsProcessed = !0;
								var e = this.targetElement;
								do {
									var t = i.getCompStyle(e);
									t.position && "fixed" === t.position.toLowerCase() && (this.fixed = !0),
										e === this.targetElement ||
											i.getData(e, "hasScrollListener") ||
											(e.addEventListener("scroll", i.onParentScroll, !1), i.setData(e, "hasScrollListener", !0));
								} while ((e = e.parentNode) && "body" !== i.nodeName(e));
							}
						}),
						(this.tryHide = function () {
							this.hideOnLeave && this.hide();
						}),
						(this.set__palette = function (e) {
							(this.palette = e),
								(this._palette = i.parsePaletteValue(e)),
								(this._paletteHasTransparency = i.containsTranparentColor(this._palette));
						}),
						i.pub.options)
					) {
						for (var p in i.pub.options)
							if (i.pub.options.hasOwnProperty(p))
								try {
									o(p, i.pub.options[p]);
								} catch (c) {
									console.warn(c);
								}
					}
					var u = [];
					r.preset &&
						("string" == typeof r.preset
							? (u = r.preset.split(/\s+/))
							: Array.isArray(r.preset)
								? (u = r.preset.slice())
								: console.warn("Unrecognized preset value")),
						-1 === u.indexOf("default") && u.push("default");
					for (var g = u.length - 1; g >= 0; g -= 1) {
						var f = u[g];
						if (f) {
							if (!i.pub.presets.hasOwnProperty(f)) {
								console.warn("Unknown preset: %s", f);
								continue;
							}
							for (var p in i.pub.presets[f])
								if (i.pub.presets[f].hasOwnProperty(p))
									try {
										o(p, i.pub.presets[f][p]);
									} catch (v) {
										console.warn(v);
									}
						}
					}
					var $ = ["preset"];
					for (var p in r)
						if (r.hasOwnProperty(p) && -1 === $.indexOf(p))
							try {
								o(p, r[p]);
							} catch (m) {
								console.warn(m);
							}
					if ((void 0 === this.container ? (this.container = e.document.body) : (this.container = i.node(this.container)), !this.container))
						throw Error("Cannot instantiate color picker without a container element");
					if (((this.targetElement = i.node(t)), !this.targetElement)) {
						if ("string" == typeof t && /^[a-zA-Z][\w:.-]*$/.test(t)) {
							var b = t;
							throw Error("If '" + b + "' is supposed to be an ID, please use '#" + b + "' or any valid CSS selector.");
						}
						throw Error("Cannot instantiate color picker without a target element");
					}
					if (this.targetElement.jscolor && this.targetElement.jscolor instanceof i.pub)
						throw Error("Color picker already installed on this element");
					if (
						((this.targetElement.jscolor = this),
						i.addClass(this.targetElement, i.pub.className),
						i.instances.push(this),
						i.isButton(this.targetElement) &&
							("button" !== this.targetElement.type.toLowerCase() && (this.targetElement.type = "button"), i.isButtonEmpty(this.targetElement)) &&
							(i.removeChildren(this.targetElement),
							this.targetElement.appendChild(e.document.createTextNode("\xa0")),
							(parseFloat(i.getCompStyle(this.targetElement)["min-width"]) || 0) < this.previewSize &&
								i.setStyle(this.targetElement, { "min-width": this.previewSize + "px" }, this.forceStyle)),
						void 0 === this.valueElement
							? i.isTextInput(this.targetElement) && (this.valueElement = this.targetElement)
							: null === this.valueElement || (this.valueElement = i.node(this.valueElement)),
						this.alphaElement && (this.alphaElement = i.node(this.alphaElement)),
						void 0 === this.previewElement
							? (this.previewElement = this.targetElement)
							: null === this.previewElement || (this.previewElement = i.node(this.previewElement)),
						this.valueElement && i.isTextInput(this.valueElement))
					) {
						var w = { onInput: this.valueElement.oninput };
						(this.valueElement.oninput = null),
							this.valueElement.addEventListener(
								"keydown",
								function e(t) {
									"Enter" === i.eventKey(t) && (n.valueElement && n.processValueInput(n.valueElement.value), n.tryHide());
								},
								!1,
							),
							this.valueElement.addEventListener(
								"change",
								function e(t) {
									if (!i.getData(t, "internal")) {
										var r = n.valueElement.value;
										n.processValueInput(n.valueElement.value),
											i.triggerCallback(n, "onChange"),
											n.valueElement.value !== r && i.triggerInputEvent(n.valueElement, "change", !0, !0);
									}
								},
								!1,
							),
							this.valueElement.addEventListener(
								"input",
								function e(t) {
									!i.getData(t, "internal") &&
										(n.valueElement && n.fromString(n.valueElement.value, i.flags.leaveValue), i.triggerCallback(n, "onInput"));
								},
								!1,
							),
							w.onInput && this.valueElement.addEventListener("input", w.onInput, !1),
							this.valueElement.setAttribute("autocomplete", "off"),
							this.valueElement.setAttribute("autocorrect", "off"),
							this.valueElement.setAttribute("autocapitalize", "off"),
							this.valueElement.setAttribute("spellcheck", !1);
					}
					this.alphaElement &&
						i.isTextInput(this.alphaElement) &&
						(this.alphaElement.addEventListener(
							"keydown",
							function e(t) {
								"Enter" === i.eventKey(t) && (n.alphaElement && n.processAlphaInput(n.alphaElement.value), n.tryHide());
							},
							!1,
						),
						this.alphaElement.addEventListener(
							"change",
							function e(t) {
								if (!i.getData(t, "internal")) {
									var r = n.alphaElement.value;
									n.processAlphaInput(n.alphaElement.value),
										i.triggerCallback(n, "onChange"),
										i.triggerInputEvent(n.valueElement, "change", !0, !0),
										n.alphaElement.value !== r && i.triggerInputEvent(n.alphaElement, "change", !0, !0);
								}
							},
							!1,
						),
						this.alphaElement.addEventListener(
							"input",
							function e(t) {
								!i.getData(t, "internal") &&
									(n.alphaElement && n.fromHSVA(null, null, null, parseFloat(n.alphaElement.value), i.flags.leaveAlpha),
									i.triggerCallback(n, "onInput"),
									i.triggerInputEvent(n.valueElement, "input", !0, !0));
							},
							!1,
						),
						this.alphaElement.setAttribute("autocomplete", "off"),
						this.alphaElement.setAttribute("autocorrect", "off"),
						this.alphaElement.setAttribute("autocapitalize", "off"),
						this.alphaElement.setAttribute("spellcheck", !1));
					var y = "FFFFFF";
					void 0 !== this.value ? (y = this.value) : this.valueElement && void 0 !== this.valueElement.value && (y = this.valueElement.value);
					var _ = void 0;
					if (
						(void 0 !== this.alpha
							? (_ = "" + this.alpha)
							: this.alphaElement && void 0 !== this.alphaElement.value && (_ = this.alphaElement.value),
						(this._currentFormat = null),
						["auto", "any"].indexOf(this.format.toLowerCase()) > -1)
					) {
						var C = i.parseColorString(y);
						this._currentFormat = C ? C.format : "hex";
					} else this._currentFormat = this.format.toLowerCase();
					this.processValueInput(y),
						void 0 !== _ && this.processAlphaInput(_),
						this.random && this.randomize.apply(this, Array.isArray(this.random) ? this.random : []);
				},
			}).pub.className = "jscolor"),
			(i.pub.activeClassName = "jscolor-active"),
			(i.pub.looseJSON = !0),
			(i.pub.presets = {}),
			(i.pub.presets.default = {}),
			(i.pub.presets.light = { backgroundColor: "rgba(255,255,255,1)", controlBorderColor: "rgba(187,187,187,1)", buttonColor: "rgba(0,0,0,1)" }),
			(i.pub.presets.dark = { backgroundColor: "rgba(51,51,51,1)", controlBorderColor: "rgba(153,153,153,1)", buttonColor: "rgba(240,240,240,1)" }),
			(i.pub.presets.small = { width: 101, height: 101, padding: 10, sliderSize: 14, paletteCols: 8 }),
			(i.pub.presets.medium = { width: 181, height: 101, padding: 12, sliderSize: 16, paletteCols: 10 }),
			(i.pub.presets.large = { width: 271, height: 151, padding: 12, sliderSize: 24, paletteCols: 15 }),
			(i.pub.presets.thin = { borderWidth: 1, controlBorderWidth: 1, pointerBorderWidth: 1 }),
			(i.pub.presets.thick = { borderWidth: 2, controlBorderWidth: 2, pointerBorderWidth: 2 }),
			(i.pub.sliderInnerSpace = 3),
			(i.pub.chessboardSize = 8),
			(i.pub.chessboardColor1 = "#666666"),
			(i.pub.chessboardColor2 = "#999999"),
			(i.pub.previewSeparator = ["rgba(255,255,255,.65)", "rgba(128,128,128,.65)"]),
			(i.pub.init = function () {
				if (!i.initialized)
					for (
						e.document.addEventListener("mousedown", i.onDocumentMouseDown, !1),
							e.document.addEventListener("keyup", i.onDocumentKeyUp, !1),
							e.addEventListener("resize", i.onWindowResize, !1),
							e.addEventListener("scroll", i.onWindowScroll, !1),
							i.appendDefaultCss(),
							i.pub.install(),
							i.initialized = !0;
						i.readyQueue.length;

					)
						i.readyQueue.shift()();
			}),
			(i.pub.install = function (e) {
				var t = !0;
				try {
					i.installBySelector("[data-jscolor]", e);
				} catch (r) {
					(t = !1), console.warn(r);
				}
				if (i.pub.lookupClass)
					try {
						i.installBySelector("input." + i.pub.lookupClass + ", button." + i.pub.lookupClass, e);
					} catch (n) {}
				return t;
			}),
			(i.pub.ready = function (e) {
				return "function" != typeof e ? (console.warn("Passed value is not a function"), !1) : (i.initialized ? e() : i.readyQueue.push(e), !0);
			}),
			(i.pub.trigger = function (e) {
				var t = function () {
					i.triggerGlobal(e);
				};
				i.initialized ? t() : i.pub.ready(t);
			}),
			(i.pub.hide = function () {
				i.picker && i.picker.owner && i.picker.owner.hide();
			}),
			(i.pub.chessboard = function (e) {
				return e || (e = "rgba(0,0,0,0)"), i.genColorPreviewCanvas(e).canvas.toDataURL();
			}),
			(i.pub.background = function (e) {
				var t = [];
				return (
					t.push(i.genColorPreviewGradient(e)),
					t.push(["url('" + i.genColorPreviewCanvas().canvas.toDataURL() + "')", "left top", "repeat"].join(" ")),
					t.join(", ")
				);
			}),
			(i.pub.options = {}),
			(i.pub.lookupClass = "jscolor"),
			(i.pub.installByClassName = function () {
				return console.error('jscolor.installByClassName() is DEPRECATED. Use data-jscolor="" attribute instead of a class name.' + i.docsRef), !1;
			}),
			i.register(),
			i.pub);
	return void 0 === e.jscolor && (e.jscolor = e.JSColor = o), o;
});
