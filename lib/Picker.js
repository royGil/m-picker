"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _PickerMixin = _interopRequireDefault(require("./PickerMixin"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

;

var Picker =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker(props) {
    var _this;

    _classCallCheck(this, Picker);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Picker).call(this, props));

    _this.scrollHanders = function () {
      var scrollY = -1;
      var lastY = 0;
      var startY = 0;
      var scrollDisabled = false;
      var isMoving = false;

      var setTransform = function setTransform(nodeStyle, value) {
        nodeStyle.transform = value;
        nodeStyle.webkitTransform = value;
      };

      var setTransition = function setTransition(nodeStyle, value) {
        nodeStyle.transition = value;
        nodeStyle.webkitTransition = value;
      };

      var scrollTo = function scrollTo(_x, y) {
        var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : .3;

        if (scrollY !== y) {
          scrollY = y;

          if (time && !_this.props.noAnimate) {
            setTransition(_this.contentRef.style, "cubic-bezier(0,0,0.2,1.15) ".concat(time, "s"));
          }

          setTransform(_this.contentRef.style, "translate3d(0,".concat(-y, "px,0)"));
          setTimeout(function () {
            _this.scrollingComplete();

            if (_this.contentRef) {
              setTransition(_this.contentRef.style, '');
            }
          }, +time * 1000);
        }
      };

      var Velocity = function () {
        var minInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
        var maxInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
        var _time = 0;
        var _y = 0;
        var _velocity = 0;
        var recorder = {
          record: function record(y) {
            var now = +new Date();
            _velocity = (y - _y) / (now - _time);

            if (now - _time >= minInterval) {
              _velocity = now - _time <= maxInterval ? _velocity : 0;
              _y = y;
              _time = now;
            }
          },
          getVelocity: function getVelocity(y) {
            if (y !== _y) {
              recorder.record(y);
            }

            return _velocity;
          }
        };
        return recorder;
      }();

      var onFinish = function onFinish() {
        isMoving = false;
        var targetY = scrollY;
        var height = (_this.props.children.length - 1) * _this.itemHeight;
        var time = .3;
        var velocity = Velocity.getVelocity(targetY) * 4;

        if (velocity) {
          targetY = velocity * 40 + targetY;
          time = Math.abs(velocity) * .1;
        }

        if (targetY % _this.itemHeight !== 0) {
          targetY = Math.round(targetY / _this.itemHeight) * _this.itemHeight;
        }

        if (targetY < 0) {
          targetY = 0;
        } else if (targetY > height) {
          targetY = height;
        }

        scrollTo(0, targetY, time < .3 ? .3 : time);

        _this.onScrollChange();
      };

      var onStart = function onStart(y) {
        if (scrollDisabled) {
          return;
        }

        isMoving = true;
        startY = y;
        lastY = scrollY;
      };

      var onMove = function onMove(y) {
        if (scrollDisabled || !isMoving) {
          return;
        }

        scrollY = lastY - y + startY;
        Velocity.record(scrollY);

        _this.onScrollChange();

        setTransform(_this.contentRef.style, "translate3d(0,".concat(-scrollY, "px,0)"));
      };

      return {
        touchstart: function touchstart(evt) {
          return onStart(evt.touches[0].pageY);
        },
        mousedown: function mousedown(evt) {
          return onStart(evt.pageY);
        },
        touchmove: function touchmove(evt) {
          evt.preventDefault();
          onMove(evt.touches[0].pageY);
        },
        mousemove: function mousemove(evt) {
          evt.preventDefault();
          onMove(evt.pageY);
        },
        touchend: function touchend() {
          return onFinish();
        },
        touchcancel: function touchcancel() {
          return onFinish();
        },
        mouseup: function mouseup() {
          return onFinish();
        },
        getValue: function getValue() {
          return scrollY;
        },
        scrollTo: scrollTo,
        setDisabled: function setDisabled() {
          var disabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
          scrollDisabled = disabled;
        }
      };
    }();

    _this.scrollTo = function (top) {
      _this.scrollHanders.scrollTo(0, top);
    };

    _this.scrollToWithoutAnimation = function (top) {
      _this.scrollHanders.scrollTo(0, top, 0);
    };

    _this.fireValueChange = function (selectedValue) {
      if (selectedValue !== _this.state.selectedValue) {
        if (!('selectedValue' in _this.props)) {
          _this.setState({
            selectedValue: selectedValue
          });
        }

        if (_this.props.onValueChange) {
          _this.props.onValueChange(selectedValue);
        }
      }
    };

    _this.onScrollChange = function () {
      var top = _this.scrollHanders.getValue();

      if (top >= 0) {
        var children = React.Children.toArray(_this.props.children);

        var index = _this.props.computeChildIndex(top, _this.itemHeight, children.length);

        if (_this.scrollValue !== index) {
          _this.scrollValue = index;
          var child = children[index];

          if (child && _this.props.onScrollChange) {
            _this.props.onScrollChange(child.props.value);
          } else if (!child && console.warn) {
            console.warn('child not found', children, index);
          }
        }
      }
    };

    _this.scrollingComplete = function () {
      var top = _this.scrollHanders.getValue();

      if (top >= 0) {
        _this.props.doScrollingComplete(top, _this.itemHeight, _this.fireValueChange);
      }
    };

    var selectedValueState;
    var _this$props = _this.props,
        selectedValue = _this$props.selectedValue,
        defaultSelectedValue = _this$props.defaultSelectedValue;

    if (selectedValue !== undefined) {
      selectedValueState = selectedValue;
    } else if (defaultSelectedValue !== undefined) {
      selectedValueState = defaultSelectedValue;
    } else {
      var children = React.Children.toArray(_this.props.children);
      selectedValueState = children && children[0] && children[0].props.value;
    }

    _this.state = {
      selectedValue: selectedValueState
    };
    return _this;
  }

  _createClass(Picker, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var contentRef = this.contentRef,
          indicatorRef = this.indicatorRef,
          maskRef = this.maskRef,
          rootRef = this.rootRef;
      var rootHeight = rootRef.getBoundingClientRect().height; // https://github.com/react-component/m-picker/issues/18

      var itemHeight = this.itemHeight = indicatorRef.getBoundingClientRect().height;
      var num = Math.floor(rootHeight / itemHeight);

      if (num % 2 === 0) {
        num--;
      }

      num--;
      num /= 2;
      contentRef.style.padding = "".concat(itemHeight * num, "px 0");
      indicatorRef.style.top = "".concat(itemHeight * num, "px");
      maskRef.style.backgroundSize = "100% ".concat(itemHeight * num, "px");
      this.scrollHanders.setDisabled(this.props.disabled);
      this.props.select(this.state.selectedValue, this.itemHeight, this.scrollTo);
      var passiveSupported = this.passiveSupported();
      var willPreventDefault = passiveSupported ? {
        passive: false
      } : false;
      var willNotPreventDefault = passiveSupported ? {
        passive: true
      } : false;
      Object.keys(this.scrollHanders).forEach(function (key) {
        if (key.indexOf('touch') === 0 || key.indexOf('mouse') === 0) {
          var pd = key.indexOf('move') >= 0 ? willPreventDefault : willNotPreventDefault;
          rootRef.addEventListener(key, _this2.scrollHanders[key], pd);
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;

      Object.keys(this.scrollHanders).forEach(function (key) {
        if (key.indexOf('touch') === 0 || key.indexOf('mouse') === 0) {
          _this3.rootRef.removeEventListener(key, _this3.scrollHanders[key]);
        }
      });
    }
  }, {
    key: "passiveSupported",
    value: function passiveSupported() {
      var passiveSupported = false;

      try {
        var options = Object.defineProperty({}, 'passive', {
          get: function get() {
            passiveSupported = true;
          }
        });
        window.addEventListener('test', null, options);
      } catch (err) {}

      return passiveSupported;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var _this4 = this;

      if ('selectedValue' in nextProps) {
        if (this.state.selectedValue !== nextProps.selectedValue) {
          this.setState({
            selectedValue: nextProps.selectedValue
          }, function () {
            _this4.props.select(nextProps.selectedValue, _this4.itemHeight, nextProps.noAnimate ? _this4.scrollToWithoutAnimation : _this4.scrollTo);
          });
        }
      }

      this.scrollHanders.setDisabled(nextProps.disabled);
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return this.state.selectedValue !== nextState.selectedValue || this.props.children !== nextProps.children;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.props.select(this.state.selectedValue, this.itemHeight, this.scrollToWithoutAnimation);
    }
  }, {
    key: "getValue",
    value: function getValue() {
      if ('selectedValue' in this.props) {
        return this.props.selectedValue;
      }

      var children = React.Children.toArray(this.props.children);
      return children && children[0] && children[0].props.value;
    }
  }, {
    key: "render",
    value: function render() {
      var _pickerCls,
          _this5 = this;

      var props = this.props;
      var prefixCls = props.prefixCls,
          itemStyle = props.itemStyle,
          indicatorStyle = props.indicatorStyle,
          _props$indicatorClass = props.indicatorClassName,
          indicatorClassName = _props$indicatorClass === void 0 ? '' : _props$indicatorClass,
          children = props.children;
      var selectedValue = this.state.selectedValue;
      var itemClassName = "".concat(prefixCls, "-item");
      var selectedItemClassName = "".concat(itemClassName, " ").concat(prefixCls, "-item-selected");

      var map = function map(item) {
        var _item$props = item.props,
            _item$props$className = _item$props.className,
            className = _item$props$className === void 0 ? '' : _item$props$className,
            style = _item$props.style,
            value = _item$props.value;
        return React.createElement("div", {
          style: _extends(_extends({}, itemStyle), style),
          className: "".concat(selectedValue === value ? selectedItemClassName : itemClassName, " ").concat(className),
          key: value
        }, item.children || item.props.children);
      }; // compatibility for preact


      var items = React.Children ? React.Children.map(children, map) : [].concat(children).map(map);
      var pickerCls = (_pickerCls = {}, _defineProperty(_pickerCls, props.className, !!props.className), _defineProperty(_pickerCls, prefixCls, true), _pickerCls);
      return React.createElement("div", {
        className: (0, _classnames["default"])(pickerCls),
        ref: function ref(el) {
          return _this5.rootRef = el;
        },
        style: this.props.style
      }, React.createElement("div", {
        className: "".concat(prefixCls, "-mask"),
        ref: function ref(el) {
          return _this5.maskRef = el;
        }
      }), React.createElement("div", {
        className: "".concat(prefixCls, "-indicator ").concat(indicatorClassName),
        ref: function ref(el) {
          return _this5.indicatorRef = el;
        },
        style: indicatorStyle
      }), React.createElement("div", {
        className: "".concat(prefixCls, "-content"),
        ref: function ref(el) {
          return _this5.contentRef = el;
        }
      }, items));
    }
  }]);

  return Picker;
}(React.Component);

Picker.defaultProps = {
  prefixCls: 'rmc-picker'
};

var _default = (0, _PickerMixin["default"])(Picker);

exports["default"] = _default;