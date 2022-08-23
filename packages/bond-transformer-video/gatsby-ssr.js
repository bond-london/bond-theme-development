var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function onRenderBody(_ref) {
  var setHeadComponents = _ref.setHeadComponents;
  setHeadComponents([/*#__PURE__*/React__default["default"].createElement("style", {
    key: "gatsby-video-style",
    dangerouslySetInnerHTML: {
      __html: "\n.gatsby-video-wrapper {\n    position: relative;\n    overflow: hidden;\n}      \n.gatsby-video-wrapper video {\n    bottom: 0;\n    height: 100%;\n    left:0;\n    margin: 0;\n    max-width: none;\n    padding: none;\n    position: absolute;\n    right: 0;\n    top: 0;\n    width: 100%;\n    object-fit: cover;\n}\n\n.gatsby-video-wrapper-constrained {\n    display: inline-block;\n    vertical-align: top;\n}\n      "
    }
  })]);
}

exports.onRenderBody = onRenderBody;
