/* @ds-bundle: {"format":4,"namespace":"RejuveluxeDesignSystem_0fe2c7","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ProductCard","sourcePath":"components/display/ProductCard.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"ToastStack","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Input.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"d1ce55c78967","components/actions/IconButton.jsx":"d3ad8b5bdc7d","components/display/Badge.jsx":"4f357a4a2351","components/display/Card.jsx":"ae158768d5e1","components/display/ProductCard.jsx":"e4a14be02b46","components/display/Tag.jsx":"05aec5e0eb5a","components/feedback/Dialog.jsx":"c0f43aec1ba1","components/feedback/Toast.jsx":"b8a0edf9718a","components/feedback/Tooltip.jsx":"d907385ba5bf","components/forms/Checkbox.jsx":"773c1cc3e84d","components/forms/Input.jsx":"4f3da651f0ef","components/forms/Radio.jsx":"b311b10f0b12","components/forms/Select.jsx":"490af763989f","components/forms/Switch.jsx":"a66ed72e934e","components/icon/Icon.jsx":"942a85a75ba6","components/navigation/Tabs.jsx":"c97b118a1d65","ui_kits/website/Cart.jsx":"f54007c9a79a","ui_kits/website/Home.jsx":"d7bc7f7b1bcb","ui_kits/website/Nav.jsx":"3e55653b5ef7","ui_kits/website/ProductDetail.jsx":"bba72943906a","ui_kits/website/Showcase.jsx":"4b433daa6090","ui_kits/website/Story.jsx":"cbee990ca45b","ui_kits/website/data.jsx":"e936c29e9665"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RejuveluxeDesignSystem_0fe2c7 = window.RejuveluxeDesignSystem_0fe2c7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  letterSpacing: 'var(--tracking-caps)',
  textTransform: 'uppercase',
  border: '1px solid transparent',
  borderRadius: 'var(--radius-xs)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), opacity var(--dur-fast)',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  boxSizing: 'border-box'
};
const sizes = {
  sm: {
    height: 'var(--control-h-sm)',
    padding: '0 18px',
    fontSize: 'var(--text-2xs)'
  },
  md: {
    height: 'var(--control-h-md)',
    padding: '0 26px',
    fontSize: 'var(--text-xs)'
  },
  lg: {
    height: 'var(--control-h-lg)',
    padding: '0 34px',
    fontSize: 'var(--text-sm)'
  }
};
const variants = {
  primary: {
    bg: 'var(--action-primary)',
    fg: 'var(--action-primary-text)',
    bc: 'var(--action-primary)',
    hbg: 'var(--action-primary-hover)',
    hfg: 'var(--action-primary-text)',
    hbc: 'var(--action-primary-hover)'
  },
  outline: {
    bg: 'transparent',
    fg: 'var(--text-primary)',
    bc: 'var(--border-strong)',
    hbg: 'var(--action-primary)',
    hfg: 'var(--action-primary-text)',
    hbc: 'var(--action-primary)'
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--text-primary)',
    bc: 'transparent',
    hbg: 'transparent',
    hfg: 'var(--text-accent)',
    hbc: 'transparent'
  },
  gold: {
    bg: 'var(--accent)',
    fg: '#fff',
    bc: 'var(--accent)',
    hbg: 'var(--accent-hover)',
    hfg: '#fff',
    hbc: 'var(--accent-hover)'
  },
  inverse: {
    bg: 'var(--bone-100)',
    fg: 'var(--ink-900)',
    bc: 'var(--bone-100)',
    hbg: 'var(--gold-200)',
    hfg: 'var(--ink-900)',
    hbc: 'var(--gold-200)'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  fullWidth,
  iconLeft,
  iconRight,
  as = 'button',
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const v = variants[variant] || variants.primary;
  const Tag = as;
  const s = {
    ...base,
    ...sizes[size],
    background: hover && !disabled ? v.hbg : v.bg,
    color: hover && !disabled ? v.hfg : v.fg,
    borderColor: hover && !disabled ? v.hbc : v.bc,
    opacity: disabled ? 'var(--opacity-disabled)' : down ? 'var(--opacity-hover)' : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : undefined,
    ...(variant === 'ghost' ? {
      padding: '0 4px'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: s,
    disabled: disabled,
    "aria-disabled": disabled,
    onMouseEnter: e => {
      setHover(true);
      onMouseEnter && onMouseEnter(e);
    },
    onMouseLeave: e => {
      setHover(false);
      setDown(false);
      onMouseLeave && onMouseLeave(e);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  children,
  label,
  variant = 'ghost',
  size = 'md',
  badge,
  disabled,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const d = size === 'sm' ? 32 : size === 'lg' ? 52 : 44;
  const vs = {
    ghost: {
      bg: 'transparent',
      fg: hover ? 'var(--text-accent)' : 'var(--text-primary)',
      bc: 'transparent'
    },
    outline: {
      bg: hover ? 'var(--action-primary)' : 'transparent',
      fg: hover ? 'var(--action-primary-text)' : 'var(--text-primary)',
      bc: 'var(--border-strong)'
    },
    filled: {
      bg: hover ? 'var(--action-primary-hover)' : 'var(--action-primary)',
      fg: 'var(--action-primary-text)',
      bc: 'transparent'
    },
    inverse: {
      bg: 'transparent',
      fg: hover ? 'var(--gold-300)' : 'var(--bone-100)',
      bc: 'transparent'
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      width: d,
      height: d,
      borderRadius: '50%',
      border: `1px solid ${vs.bc}`,
      background: vs.bg,
      color: vs.fg,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      transition: 'all var(--dur-fast) var(--ease-out)',
      padding: 0,
      ...style
    }
  }, rest), children, badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 4,
      right: 2,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 999,
      background: 'var(--accent)',
      color: '#fff',
      font: 'var(--type-caption)',
      fontSize: 10,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    bg: 'var(--bone-300)',
    fg: 'var(--ink-700)'
  },
  ink: {
    bg: 'var(--ink-900)',
    fg: 'var(--bone-100)'
  },
  gold: {
    bg: 'var(--gold-500)',
    fg: '#fff'
  },
  success: {
    bg: 'var(--status-success-soft)',
    fg: 'var(--status-success)'
  },
  warning: {
    bg: 'var(--status-warning-soft)',
    fg: 'var(--status-warning)'
  },
  error: {
    bg: 'var(--status-error-soft)',
    fg: 'var(--status-error)'
  },
  info: {
    bg: 'var(--status-info-soft)',
    fg: 'var(--status-info)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  style
}) {
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 20,
      padding: '0 8px',
      background: t.bg,
      color: t.fg,
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      borderRadius: 'var(--radius-xs)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  padding = 24,
  inverse,
  interactive,
  eyebrow,
  title,
  footer,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: inverse ? 'var(--surface-inverse)' : 'var(--surface-card)',
      color: inverse ? 'var(--text-inverse)' : 'var(--text-primary)',
      border: `1px solid ${hover && interactive ? inverse ? 'var(--gold-400)' : 'var(--border-strong)' : inverse ? 'var(--ink-700)' : 'var(--border-subtle)'}`,
      borderRadius: 0,
      padding,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'border-color var(--dur-fast) var(--ease-out)',
      cursor: interactive ? 'pointer' : undefined,
      boxSizing: 'border-box',
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--gold-300)' : 'var(--text-accent)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)'
    }
  }, title), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 12,
      borderTop: `1px solid ${inverse ? 'var(--ink-700)' : 'var(--border-subtle)'}`,
      font: 'var(--type-body-sm)',
      color: inverse ? 'var(--ink-300)' : 'var(--text-secondary)'
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/ProductCard.jsx
try { (() => {
function ProductCard({
  product,
  onAdd,
  onOpen,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const p = product;
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface-card)',
      border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
      transition: 'border-color var(--dur-fast) var(--ease-out)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      position: 'relative',
      aspectRatio: '1',
      background: p.tin,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: onOpen ? 'pointer' : 'default',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: p.name,
    style: {
      width: '78%',
      transform: hover ? 'translateY(-6px)' : 'none',
      transition: 'transform var(--dur-slow) var(--ease-out)',
      filter: 'drop-shadow(0 28px 28px rgba(20,19,17,.35))'
    }
  }), p.badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: p.badgeTone || 'ink',
    style: {
      position: 'absolute',
      top: 14,
      left: 14
    }
  }, p.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    }
  }, p.category), /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      font: 'var(--type-h3)',
      fontStyle: 'italic',
      cursor: onOpen ? 'pointer' : 'default'
    }
  }, p.name), p.tagline && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)'
    }
  }, p.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-price)'
    }
  }, p.price, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "/ ", p.weight)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    variant: hover ? 'primary' : 'outline',
    onClick: onAdd
  }, "Add"))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  side = 'top',
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%,-8px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%,8px)'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translate(-8px,-50%)'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translate(8px,-50%)'
    }
  }[side];
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      background: 'var(--ink-900)',
      color: 'var(--bone-100)',
      font: 'var(--type-caption)',
      padding: '6px 10px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: show ? 1 : 0,
      transition: 'opacity var(--dur-fast) var(--ease-out)',
      zIndex: 50
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Field({
  label,
  hint,
  error,
  required,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      font: 'var(--type-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: error ? 'var(--status-error)' : 'var(--text-secondary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, " *")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--status-error)' : 'var(--text-tertiary)'
    }
  }, error || hint));
}
function Input({
  label,
  hint,
  error,
  required,
  size = 'md',
  prefix,
  suffix,
  style,
  disabled,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement(Field, {
    label: label,
    hint: hint,
    error: error,
    required: required,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: h,
      border: `1px solid ${error ? 'var(--status-error)' : focus ? 'var(--border-strong)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xs)',
      background: disabled ? 'var(--bone-300)' : 'var(--surface-raised)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)',
      padding: '0 14px',
      gap: 10,
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      boxSizing: 'border-box'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      font: 'var(--type-body-sm)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 0,
      outline: 0,
      background: 'transparent',
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      padding: 0
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      display: 'inline-flex'
    }
  }, suffix)));
}
Object.assign(__ds_scope, { Field, Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  name,
  value,
  label,
  description,
  checked,
  onChange,
  disabled,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      gap: 12,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      flex: 'none',
      marginTop: 2,
      borderRadius: '50%',
      border: `1px solid ${checked ? 'var(--border-strong)' : 'var(--border-default)'}`,
      background: 'var(--surface-raised)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--action-primary)',
      transform: checked ? 'scale(1)' : 'scale(0)',
      transition: 'transform var(--dur-fast) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, description)));
}
function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  direction = 'column',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? 24 : 12,
      ...style
    }
  }, options.map(o => /*#__PURE__*/React.createElement(Radio, {
    key: o.value,
    name: name,
    value: o.value,
    label: o.label,
    description: o.description,
    checked: value === o.value,
    onChange: onChange,
    disabled: o.disabled
  })));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    style: {
      display: 'inline-flex',
      gap: 12,
      alignItems: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    style: {
      width: 40,
      height: 22,
      borderRadius: 999,
      border: `1px solid ${on ? 'var(--border-strong)' : 'var(--border-default)'}`,
      background: on ? 'var(--action-primary)' : 'var(--bone-300)',
      position: 'relative',
      transition: 'all var(--dur-fast) var(--ease-out)',
      flex: 'none',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: on ? 18 : 2,
      width: 16,
      height: 16,
      borderRadius: '50%',
      background: on ? 'var(--gold-300)' : 'var(--surface-raised)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-fast) var(--ease-out), background var(--dur-fast)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useEffect,
  useRef
} = React; // Lucide via CDN. Loads the UMD once; renders inline SVG with stroke 1.5.
let lucidePromise = null;
function loadLucide() {
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!lucidePromise) lucidePromise = new Promise(res => {
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js';
    s.onload = () => res(window.lucide);
    document.head.appendChild(s);
  });
  return lucidePromise;
}
function Icon({
  name,
  size = 18,
  strokeWidth = 1.5,
  color = 'currentColor',
  style,
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    loadLucide().then(lucide => {
      if (!alive || !ref.current || !lucide) return;
      const pascal = name.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('');
      const node = lucide.icons[pascal] || lucide[pascal];
      if (!node) return;
      const svg = lucide.createElement(node);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      svg.setAttribute('stroke', color);
      ref.current.replaceChildren(svg);
    });
    return () => {
      alive = false;
    };
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      flex: 'none',
      lineHeight: 0,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  selected,
  onClick,
  onRemove,
  tint,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const interactive = !!onClick;
  const bg = selected ? 'var(--action-primary)' : hover && interactive ? 'var(--bone-300)' : 'transparent';
  const fg = selected ? 'var(--action-primary-text)' : tint || 'var(--text-primary)';
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      height: 30,
      padding: '0 14px',
      border: `1px solid ${selected ? 'var(--border-strong)' : tint || 'var(--border-default)'}`,
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      font: 'var(--type-body-sm)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'all var(--dur-fast) var(--ease-out)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, children, onRemove && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      border: 0,
      background: 'transparent',
      color: 'inherit',
      padding: 0,
      margin: '0 -4px 0 2px',
      display: 'inline-flex',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  footer,
  width = 520,
  side,
  style
}) {
  React.useEffect(() => {
    if (!open) return;
    const k = e => e.key === 'Escape' && onClose && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  if (!open) return null;
  const panel = {
    background: 'var(--surface-card)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-float)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    animation: `rjx-${side ? 'slide' : 'rise'} var(--dur-slow) var(--ease-out)`,
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      zIndex: 100,
      display: 'flex',
      alignItems: side ? 'stretch' : 'center',
      justifyContent: side === 'right' ? 'flex-end' : side === 'left' ? 'flex-start' : 'center',
      padding: side ? 0 : 24
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes rjx-rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@keyframes rjx-slide{from{transform:translateX(${side === 'left' ? '-' : ''}24px);opacity:0}to{transform:none;opacity:1}}`), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      ...panel,
      width: side ? width : '100%',
      maxWidth: side ? undefined : width,
      height: side ? '100%' : undefined,
      maxHeight: side ? undefined : '90vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '28px 32px 0',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-accent)',
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h2)'
    }
  }, title)), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "Close",
    size: "sm",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 32px',
      flex: 1,
      overflow: 'auto',
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 32px 28px',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const icons = {
  neutral: 'leaf',
  success: 'check',
  error: 'x',
  warning: 'minus'
};
function Toast({
  title,
  description,
  tone = 'neutral',
  action,
  onDismiss,
  style
}) {
  const accent = {
    neutral: 'var(--gold-300)',
    success: 'var(--status-success)',
    error: 'var(--status-error)',
    warning: 'var(--status-warning)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      minWidth: 300,
      maxWidth: 420,
      padding: '16px 18px',
      background: 'var(--surface-inverse)',
      color: 'var(--text-inverse)',
      boxShadow: 'var(--shadow-float)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent,
      display: 'inline-flex',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icons[tone] || 'leaf',
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)'
    }
  }, title), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--ink-300)'
    }
  }, description), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement("button", {
    "aria-label": "Dismiss",
    onClick: onDismiss,
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--ink-400)',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
function ToastStack({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 24,
      right: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      zIndex: 200,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Toast, ToastStack });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  description,
  style
}) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    setInner(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: e => {
      e.preventDefault();
      toggle();
    },
    style: {
      display: 'inline-flex',
      gap: 12,
      alignItems: 'flex-start',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    style: {
      width: 18,
      height: 18,
      flex: 'none',
      marginTop: 2,
      border: `1px solid ${on ? 'var(--border-strong)' : 'var(--border-default)'}`,
      background: on ? 'var(--action-primary)' : 'var(--surface-raised)',
      color: 'var(--bone-100)',
      borderRadius: 'var(--radius-xs)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-out)',
      boxSizing: 'border-box'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 12,
    strokeWidth: 2
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  required,
  options = [],
  size = 'md',
  style,
  disabled,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const h = size === 'sm' ? 'var(--control-h-sm)' : size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement(__ds_scope.Field, {
    label: label,
    hint: hint,
    error: error,
    required: required,
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: h,
      border: `1px solid ${error ? 'var(--status-error)' : focus ? 'var(--border-strong)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-xs)',
      background: 'var(--surface-raised)',
      boxShadow: focus ? 'var(--shadow-focus)' : 'none',
      transition: 'all var(--dur-fast) var(--ease-out)',
      opacity: disabled ? 'var(--opacity-disabled)' : 1,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: '100%',
      border: 0,
      outline: 0,
      background: 'transparent',
      font: 'var(--type-body)',
      color: 'var(--text-primary)',
      padding: '0 40px 0 14px',
      cursor: 'pointer'
    }
  }, rest), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      pointerEvents: 'none',
      color: 'var(--text-secondary)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'pill',
  inverse,
  style
}) {
  const [inner, setInner] = React.useState(defaultValue ?? (items[0] && items[0].value));
  const cur = value ?? inner;
  const set = v => {
    setInner(v);
    onChange && onChange(v);
  };
  const fg = inverse ? 'var(--bone-100)' : 'var(--text-primary)';
  const bc = inverse ? 'var(--ink-600)' : 'var(--border-default)';
  if (variant === 'underline') {
    return /*#__PURE__*/React.createElement("div", {
      role: "tablist",
      style: {
        display: 'flex',
        gap: 32,
        borderBottom: `1px solid ${inverse ? 'var(--ink-700)' : 'var(--border-subtle)'}`,
        ...style
      }
    }, items.map(it => {
      const on = it.value === cur;
      return /*#__PURE__*/React.createElement("button", {
        key: it.value,
        role: "tab",
        "aria-selected": on,
        onClick: () => set(it.value),
        style: {
          background: 'transparent',
          border: 0,
          borderBottom: `1px solid ${on ? inverse ? 'var(--gold-300)' : 'var(--border-strong)' : 'transparent'}`,
          marginBottom: -1,
          padding: '12px 0',
          font: 'var(--type-eyebrow)',
          letterSpacing: 'var(--tracking-caps)',
          textTransform: 'uppercase',
          color: on ? fg : inverse ? 'var(--ink-400)' : 'var(--text-tertiary)',
          cursor: 'pointer',
          transition: 'all var(--dur-fast) var(--ease-out)'
        }
      }, it.label);
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      border: `1px solid ${bc}`,
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      gap: 2,
      ...style
    }
  }, items.map(it => {
    const on = it.value === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => set(it.value),
      style: {
        height: 30,
        padding: '0 16px',
        borderRadius: 'var(--radius-pill)',
        border: 0,
        background: on ? inverse ? 'var(--bone-100)' : 'var(--action-primary)' : 'transparent',
        color: on ? inverse ? 'var(--ink-900)' : 'var(--action-primary-text)' : fg,
        font: 'var(--type-eyebrow)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-out)'
      }
    }, it.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Cart.jsx
try { (() => {
const {
  Button,
  Icon,
  Dialog,
  Switch,
  Input
} = window.RejuveluxeDesignSystem_0fe2c7;
function CartDrawer({
  open,
  onClose,
  items,
  setItems,
  onCheckout
}) {
  const total = items.reduce((s, it) => s + it.product.priceNum * it.qty, 0);
  const setQty = (id, q) => setItems(items.map(it => it.product.id === id ? {
    ...it,
    qty: q
  } : it).filter(it => it.qty > 0));
  const count = items.reduce((s, it) => s + it.qty, 0);
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    side: "right",
    width: 480,
    eyebrow: "Your cart",
    title: count ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Empty',
    footer: items.length ? /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        font: 'var(--type-body-sm)',
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Shipping"), /*#__PURE__*/React.createElement("span", null, total >= 1500 ? 'Complimentary' : '₹120')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-caps)',
        textTransform: 'uppercase',
        fontSize: 11
      }
    }, "Total"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-price)',
        fontSize: 26
      }
    }, fmt(total + (total >= 1500 ? 0 : 120)))), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      fullWidth: true,
      onClick: onCheckout
    }, "Checkout")) : null
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 0',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-h3)',
      fontStyle: 'italic',
      margin: '0 0 16px',
      color: 'var(--text-primary)'
    }
  }, "Nothing here yet."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: onClose
  }, "Browse teas")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, items.map(({
    product: p,
    qty
  }) => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'grid',
      gridTemplateColumns: '84px 1fr auto',
      gap: 16,
      padding: '18px 0',
      borderBottom: 'var(--rule)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 84,
      height: 84,
      background: p.tin,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: "",
    style: {
      width: '76%',
      filter: 'drop-shadow(0 10px 10px rgba(20,19,17,.35))'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    }
  }, p.category), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)',
      fontStyle: 'italic',
      color: 'var(--text-primary)',
      margin: '4px 0 6px'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid var(--border-default)',
      height: 30,
      borderRadius: 'var(--radius-xs)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(p.id, qty - 1),
    style: {
      width: 30,
      height: '100%',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      textAlign: 'center',
      font: 'var(--type-body-sm)',
      color: 'var(--text-primary)'
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(p.id, qty + 1),
    style: {
      width: 30,
      height: '100%',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center',
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 12
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-price)',
      color: 'var(--text-primary)'
    }
  }, fmt(p.priceNum * qty)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(p.id, 0),
    "aria-label": "Remove",
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text-tertiary)',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  })))))), items.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Gift wrap \xB7 hand-tied ribbon"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Note for the recipient",
    placeholder: "Optional, up to 120 characters"
  })));
}
Object.assign(window, {
  CartDrawer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  Button,
  Icon,
  ProductCard,
  Card
} = window.RejuveluxeDesignSystem_0fe2c7;
const eyebrow = {
  font: 'var(--type-eyebrow)',
  letterSpacing: 'var(--tracking-caps)',
  textTransform: 'uppercase',
  color: 'var(--text-accent)'
};
const frameBox = {
  border: '1px solid var(--border-strong)',
  padding: '14px 18px',
  font: 'var(--type-body-sm)',
  color: 'var(--text-secondary)',
  background: 'var(--bg-page)'
};
function Home({
  setPage,
  onAdd,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "fade",
    "data-screen-label": "Home hero",
    style: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 'calc(var(--nav-h) + 40px) var(--gutter-lg) 64px',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 'min(1040px, 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...frameBox,
      position: 'absolute',
      top: -20,
      right: 120,
      padding: '8px 16px',
      ...eyebrow,
      background: 'var(--bg-page)'
    }
  }, "Assam \xB7 Single origin"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border-strong)',
      padding: '56px 64px 48px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontSize: 'clamp(48px, 6.4vw, 96px)',
      margin: 0,
      letterSpacing: 'var(--tracking-tight)',
      textWrap: 'balance'
    }
  }, "Earned,", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, "not"), " indulged.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '260px 300px 1fr',
      gap: 0,
      alignItems: 'start',
      marginTop: -1,
      marginLeft: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: frameBox
  }, "India doesn't need better tea. India needs better access to its best tea."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...frameBox,
      marginLeft: -1
    }
  }, "Rare Silver Needle and Matcha, Golden Tips, premium Green Tea and exceptional CTC \u2014 a collection for people who understand quality."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => setPage('products'),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 16
    })
  }, "Browse teas")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      ...eyebrow,
      color: 'var(--text-tertiary)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, "Scroll ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14
  }))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Home collection",
    style: {
      padding: '0 var(--gutter-lg) var(--section-gap)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingBottom: 28,
      borderBottom: 'var(--rule)',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "The Collection"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      margin: '12px 0 0'
    }
  }, "Taste, Character & Craft")), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      maxWidth: 380,
      margin: 0,
      textAlign: 'right'
    }
  }, "Three signature expressions of Assam, each with its own identity. One uncompromising standard.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, PRODUCTS.map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    onAdd: () => onAdd(p),
    onOpen: () => onOpen(p)
  })))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Home craft",
    style: {
      background: 'var(--bg-inverse)',
      color: 'var(--text-inverse)',
      padding: 'var(--section-gap) var(--gutter-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...eyebrow,
      color: 'var(--gold-300)'
    }
  }, "The Craft"), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-h1)',
      margin: '12px 0 20px'
    }
  }, "Nothing rushed, nothing skipped."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--ink-300)',
      margin: 0
    }
  }, "Three teas. Three distinct journeys. Different leaves. Different craftsmanship. One origin: Assam.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, PRODUCTS.slice(0, 3).map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    inverse: true,
    eyebrow: p.descriptor,
    title: /*#__PURE__*/React.createElement("span", {
      style: {
        fontStyle: 'italic'
      }
    }, p.name),
    padding: 24
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      font: 'var(--type-body-sm)',
      color: 'var(--ink-300)'
    }
  }, p.craft.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-400)',
      font: 'var(--type-caption)',
      width: 18
    }
  }, String(i + 1).padStart(2, '0')), s)))))))), /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Home story teaser",
    style: {
      padding: 'var(--section-gap) var(--gutter-lg)',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "Our Story"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-h2)',
      fontStyle: 'italic',
      margin: '20px 0 28px',
      textWrap: 'balance'
    }
  }, "\"We searched. We tasted. We rejected. And we searched again.\""), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setPage('story')
  }, "Read the story"))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
const {
  Tabs,
  IconButton,
  Icon
} = window.RejuveluxeDesignSystem_0fe2c7;
function Wordmark({
  inverse,
  size = 22,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 4,
      cursor: onClick ? 'pointer' : 'default',
      color: inverse ? 'var(--bone-100)' : 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "wordmark",
    style: {
      font: 'var(--type-wordmark)',
      fontSize: size,
      letterSpacing: 'var(--tracking-wordmark)',
      textTransform: 'uppercase'
    }
  }, "Rejuveluxe"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      fontSize: 8,
      letterSpacing: 'var(--tracking-caps-wide)',
      textTransform: 'uppercase',
      color: inverse ? 'var(--gold-300)' : 'var(--text-accent)'
    }
  }, "\u25C6 Earned not indulged \u25C6"));
}
function Nav({
  page,
  setPage,
  cartCount,
  onCart,
  inverse
}) {
  const items = [{
    value: 'home',
    label: 'Tea store'
  }, {
    value: 'products',
    label: 'Our products'
  }, {
    value: 'story',
    label: 'Our story'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-h)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: '0 var(--gutter-lg)',
      zIndex: 20,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: items,
    value: ['home', 'products', 'story'].includes(page) ? page : 'products',
    onChange: setPage,
    inverse: inverse
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    inverse: inverse,
    onClick: () => setPage('home')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Cart",
    variant: inverse ? 'inverse' : 'ghost',
    badge: cartCount || undefined,
    onClick: onCart
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-bag",
    size: 20
  }))));
}
function Footer({
  setPage
}) {
  const col = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    font: 'var(--type-body-sm)',
    color: 'var(--ink-300)'
  };
  const h = {
    font: 'var(--type-eyebrow)',
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    color: 'var(--gold-300)',
    marginBottom: 6
  };
  const link = {
    color: 'var(--ink-300)',
    cursor: 'pointer'
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--bg-inverse)',
      color: 'var(--text-inverse)',
      padding: '80px var(--gutter-lg) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 48,
      paddingBottom: 56,
      borderBottom: '1px solid var(--ink-700)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wordmark, {
    inverse: true,
    size: 26
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--ink-400)',
      maxWidth: 300,
      marginTop: 20
    }
  }, "Three expressions. One origin. From the tea gardens of Assam, each leaf is selected for its distinctive character.")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Collection"), PRODUCTS.slice(0, 5).map(p => /*#__PURE__*/React.createElement("a", {
    key: p.id,
    style: link,
    onClick: () => setPage('products')
  }, p.name))), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "House"), /*#__PURE__*/React.createElement("a", {
    style: link,
    onClick: () => setPage('story')
  }, "Our story"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "The craft"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Journal"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Gifting")), /*#__PURE__*/React.createElement("div", {
    style: col
  }, /*#__PURE__*/React.createElement("div", {
    style: h
  }, "Service"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Shipping"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Returns"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "Contact"), /*#__PURE__*/React.createElement("a", {
    style: link
  }, "FSSAI"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 24,
      font: 'var(--type-caption)',
      color: 'var(--ink-500)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Rejuveluxe. Assam, India."), /*#__PURE__*/React.createElement("span", null, "Earned, not indulged.")));
}
Object.assign(window, {
  Wordmark,
  Nav,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProductDetail.jsx
try { (() => {
const {
  Button,
  Icon,
  Tabs,
  Select,
  Card,
  Badge,
  Tag,
  Tooltip
} = window.RejuveluxeDesignSystem_0fe2c7;
function ProductDetail({
  product: p,
  onAdd,
  onBack,
  related,
  onOpen
}) {
  const [tab, setTab] = React.useState('taste');
  const [qty, setQty] = React.useState(1);
  const [weight, setWeight] = React.useState(p.weight);
  const eyebrow = {
    font: 'var(--type-eyebrow)',
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    color: 'var(--text-accent)'
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Product detail",
    className: "fade"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      height: '100vh',
      background: p.tin,
      display: 'grid',
      placeItems: 'center',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '40%',
      height: '26%',
      background: p.ink
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: p.name,
    style: {
      width: '70%',
      maxWidth: 520,
      position: 'relative',
      filter: 'drop-shadow(0 60px 50px rgba(20,19,17,.5))'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      position: 'absolute',
      left: 'var(--gutter-lg)',
      top: 'calc(var(--nav-h) + 16px)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'transparent',
      border: 0,
      cursor: 'pointer',
      ...eyebrow,
      color: p.id === 'golden' || p.id === 'ctc' ? 'var(--gold-300)' : 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  }), " All teas")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'calc(var(--nav-h) + 48px) var(--gutter-lg) 80px',
      maxWidth: 560,
      boxSizing: 'content-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: eyebrow
  }, p.category, " \xB7 ", p.descriptor), p.badge && /*#__PURE__*/React.createElement(Badge, {
    tone: p.badgeTone
  }, p.badge)), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontStyle: 'italic',
      fontSize: 56,
      margin: '14px 0 12px'
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-secondary)',
      margin: '0 0 24px'
    }
  }, p.description), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-h3)',
      fontStyle: 'italic',
      margin: '0 0 32px',
      paddingLeft: 16,
      borderLeft: 'var(--rule-gold)'
    }
  }, p.tagline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 140px',
      gap: 16,
      alignItems: 'end',
      paddingBottom: 24,
      borderBottom: 'var(--rule)'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Weight",
    value: weight,
    onChange: e => setWeight(e.target.value),
    options: ['50 g', '100 g', '250 g']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...eyebrow,
      color: 'var(--text-secondary)'
    }
  }, "Quantity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 'var(--control-h-md)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--surface-raised)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(Math.max(1, qty - 1)),
    style: {
      width: 40,
      height: '100%',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "minus",
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'center',
      font: 'var(--type-body)'
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(qty + 1),
    style: {
      width: 40,
      height: '100%',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 14
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 0 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-price)',
      fontSize: 30
    }
  }, fmt(p.priceNum * qty), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "/ ", weight, qty > 1 ? ` × ${qty}` : '')), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onAdd(p, qty)
  }, "Add to cart")), /*#__PURE__*/React.createElement(Tabs, {
    variant: "underline",
    items: [{
      value: 'taste',
      label: 'Taste'
    }, {
      value: 'craft',
      label: 'Craft'
    }, {
      value: 'brew',
      label: 'Brewing'
    }],
    value: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '28px 0 0'
    }
  }, tab === 'taste' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, Object.entries(p.notes).map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      marginBottom: 10
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, v.map(x => /*#__PURE__*/React.createElement(Tag, {
    key: x,
    tint: p.ink
  }, x)))))), /*#__PURE__*/React.createElement(Card, {
    eyebrow: `Why ${p.name.split(' ').slice(-1)[0] === 'Tea' ? p.name : p.name.replace('Assam ', '')}`
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, p.why)), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      margin: 0
    }
  }, "Compounds such as ", /*#__PURE__*/React.createElement(Tooltip, {
    content: "Epigallocatechin gallate"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      borderBottom: '1px dotted',
      cursor: 'help'
    }
  }, "EGCG")), " and theaflavins reflect general tea science; not medical claims.")), tab === 'craft' && /*#__PURE__*/React.createElement("ol", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column'
    }
  }, p.craft.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s,
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr',
      padding: '14px 0',
      borderBottom: 'var(--rule)',
      font: 'var(--type-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-accent)',
      paddingTop: 3
    }
  }, String(i + 1).padStart(2, '0')), s))), tab === 'brew' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, Object.entries({
    Water: p.brew.temp,
    Leaf: p.brew.dose,
    Time: p.brew.time
  }).map(([k, v]) => /*#__PURE__*/React.createElement(Card, {
    key: k,
    eyebrow: k,
    padding: 20
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h3)'
    }
  }, v))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px var(--gutter-lg) var(--section-gap)',
      borderTop: 'var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...eyebrow,
      marginBottom: 24
    }
  }, "Also from Assam"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, related.map(r => /*#__PURE__*/React.createElement(ProductCardHost, {
    key: r.id,
    product: r,
    onOpen: () => onOpen(r),
    onAdd: () => onAdd(r, 1)
  })))));
}
const ProductCardHost = props => React.createElement(window.RejuveluxeDesignSystem_0fe2c7.ProductCard, props);
Object.assign(window, {
  ProductDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Showcase.jsx
try { (() => {
const {
  Button,
  Icon
} = window.RejuveluxeDesignSystem_0fe2c7;
// Full-viewport split-panel product showcase, after the reference video: colour panel + floating tin left, framed copy right, dot pagination, dark wipe between products.
function Showcase({
  onAdd,
  onOpen,
  start = 0
}) {
  const [idx, setIdx] = React.useState(start);
  const [wipe, setWipe] = React.useState('idle'); // idle | in | out
  const lock = React.useRef(false);
  const go = n => {
    const next = (n + PRODUCTS.length) % PRODUCTS.length;
    if (lock.current || next === idx) return;
    lock.current = true;
    setWipe('in');
    setTimeout(() => {
      setIdx(next);
      setWipe('out');
    }, 460);
    setTimeout(() => {
      setWipe('idle');
      lock.current = false;
    }, 960);
  };
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') go(idx - 1);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  const wheelT = React.useRef(0);
  const onWheel = e => {
    const now = Date.now();
    if (now - wheelT.current < 1100 || Math.abs(e.deltaY) < 20) return;
    wheelT.current = now;
    go(idx + (e.deltaY > 0 ? 1 : -1));
  };
  const p = PRODUCTS[idx];
  const frame = {
    border: '1px solid var(--border-strong)',
    background: 'var(--bg-page)'
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "Products showcase",
    onWheel: onWheel,
    style: {
      position: 'relative',
      height: '100vh',
      display: 'grid',
      gridTemplateColumns: '46fr 54fr',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: p.tin,
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '38%',
      height: '30%',
      background: p.ink,
      transition: 'background var(--dur-base)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '62%',
      height: '30%',
      background: 'var(--ink-900)',
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("img", {
    key: p.id,
    className: "tin-in",
    src: p.image,
    alt: p.name,
    onClick: () => onOpen(p),
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: '72%',
      maxWidth: 560,
      transform: 'translate(-50%,-50%)',
      filter: 'drop-shadow(0 60px 50px rgba(20,19,17,.5))',
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--bg-page)',
      padding: '0 var(--gutter-lg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 280,
      height: 160,
      background: 'radial-gradient(ellipse at 80% 0%, var(--bone-400), transparent 70%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    key: p.id,
    className: "copy-in",
    style: {
      position: 'relative',
      maxWidth: 620,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...frame,
      display: 'inline-block',
      padding: '8px 16px',
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      position: 'relative',
      top: 16,
      left: 48,
      zIndex: 1
    }
  }, p.category, " \xB7 ", p.descriptor), /*#__PURE__*/React.createElement("div", {
    style: {
      ...frame,
      padding: '44px 40px 36px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontStyle: 'italic',
      fontSize: 'clamp(40px, 4.6vw, 68px)',
      margin: 0,
      textAlign: 'center',
      textWrap: 'balance'
    }
  }, p.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      marginTop: -1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...frame,
      padding: '20px 24px',
      font: 'var(--type-body-sm)',
      color: 'var(--text-secondary)',
      lineHeight: 1.6
    }
  }, p.description), /*#__PURE__*/React.createElement("div", {
    style: {
      ...frame,
      marginLeft: -1,
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)'
    }
  }, Object.entries(p.notes).map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: '18px 14px',
      borderLeft: i ? '1px solid var(--border-subtle)' : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      marginBottom: 8
    }
  }, k), v.map(x => /*#__PURE__*/React.createElement("div", {
    key: x,
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      lineHeight: 1.6
    }
  }, x)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => onOpen(p),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 12
    })
  }, "Full details"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 'var(--gutter-lg)',
      bottom: 40,
      font: 'var(--type-price)',
      fontSize: 26
    },
    key: 'price' + p.id,
    className: "copy-in"
  }, p.price, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "/ ", p.weight)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 'var(--gutter-lg)',
      bottom: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onAdd(p)
  }, "Add to cart"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      zIndex: 3
    }
  }, PRODUCTS.map((q, i) => /*#__PURE__*/React.createElement("button", {
    key: q.id,
    "aria-label": q.name,
    onClick: () => go(i),
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      padding: 0,
      border: `1px solid ${p.ink === 'var(--tea-silver-ink)' || p.id === 'silver' ? 'var(--gold-500)' : 'var(--bone-100)'}`,
      background: i === idx ? p.id === 'silver' ? 'var(--gold-500)' : 'var(--bone-100)' : 'transparent',
      cursor: 'pointer',
      transition: 'all var(--dur-fast)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 'calc(var(--gutter-lg) + 190px)',
      bottom: 40,
      display: 'flex',
      gap: 6,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    style: {
      width: 44,
      padding: 0
    },
    onClick: () => go(idx - 1),
    "aria-label": "Previous"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 14
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    style: {
      width: 44,
      padding: 0
    },
    onClick: () => go(idx + 1),
    "aria-label": "Next"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 14
  }))), /*#__PURE__*/React.createElement("div", {
    className: 'wipe ' + wipe,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--ink-900)',
      zIndex: 5,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 'var(--gutter-lg)',
      top: 'calc(var(--nav-h) + 12px)',
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      letterSpacing: 'var(--tracking-caps)'
    }
  }, String(idx + 1).padStart(2, '0'), " / ", String(PRODUCTS.length).padStart(2, '0')));
}
Object.assign(window, {
  Showcase
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Showcase.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Story.jsx
try { (() => {
const {
  Button
} = window.RejuveluxeDesignSystem_0fe2c7;
function Story({
  setPage
}) {
  const eyebrow = {
    font: 'var(--type-eyebrow)',
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    color: 'var(--text-accent)'
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-screen-label": "Our story",
    className: "fade"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      minHeight: '70vh',
      display: 'grid',
      placeItems: 'center',
      padding: 'calc(var(--nav-h) + 64px) var(--gutter-lg) 64px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: eyebrow
  }, "Our Story"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-display)',
      fontSize: 'clamp(44px,5.6vw,80px)',
      margin: '20px 0 0',
      textWrap: 'balance'
    }
  }, "India doesn't need better tea. India needs better access to its best tea."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 var(--gutter-lg) var(--section-gap)',
      display: 'grid',
      gridTemplateColumns: '1fr min(640px, 100%) 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      font: 'var(--type-body-lg)',
      color: 'var(--text-secondary)'
    }
  }, STORY.map((t, i) => /*#__PURE__*/React.createElement("p", {
    key: i,
    style: {
      margin: 0,
      ...(i === 0 ? {
        color: 'var(--text-primary)',
        font: 'var(--type-h3)',
        lineHeight: 1.5
      } : null)
    }
  }, t)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 24,
      borderTop: 'var(--rule-gold)',
      font: 'var(--type-eyebrow)',
      letterSpacing: 'var(--tracking-caps-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-primary)'
    }
  }, "Rejuveluxe. Earned, not indulged.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)'
    }
  }, "This is not the destination \u2014 this is the beginning.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setPage('products')
  }, "See the collection")))));
}
Object.assign(window, {
  Story
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Story.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.jsx
try { (() => {
const base = '../../assets/products/';
const PRODUCTS = [{
  id: 'matcha',
  name: 'Assam Matcha',
  descriptor: 'Focus',
  category: 'Matcha',
  tin: 'var(--tea-matcha-tin)',
  ink: 'var(--tea-matcha-ink)',
  image: base + 'matcha.png',
  price: '₹1,450',
  priceNum: 1450,
  weight: '50 g',
  badge: 'New',
  badgeTone: 'gold',
  tagline: 'Naturally vibrant. Rich in catechins. Crafted for focus.',
  description: 'Vividly green, fresh, and grassy — with a whole-leaf intensity that infused tea can\'t match, because with Matcha, you consume the leaf itself, not just its infusion.',
  why: 'Naturally rich in catechins and EGCG, with naturally occurring caffeine and L-theanine — a concentrated whole-leaf experience crafted for energy, alertness, and mindful focus. Grown under heavy canopy shade, it develops a distinctive chlorophyll richness alongside its natural sweetness.',
  notes: {
    Taste: ['Grassy', 'Sweet', 'Umami'],
    Aroma: ['Fresh cut leaf', 'Sea air'],
    Mouthfeel: ['Creamy', 'Whole-leaf']
  },
  craft: ['Leaf Selection', 'Shading', 'Harvesting', 'Steaming', 'Cooling & Drying', 'Deveining', 'Fine Grinding', 'Quality Screening & Packaging'],
  brew: {
    temp: '75 °C',
    dose: '2 g · 70 ml',
    time: 'Whisk 20 s'
  }
}, {
  id: 'silver',
  name: 'Silver Needle',
  descriptor: 'Elegance',
  category: 'White tea',
  tin: 'var(--tea-silver-tin)',
  ink: 'var(--tea-silver-ink)',
  image: base + 'silver-needle-white-tea.png',
  price: '₹2,200',
  priceNum: 2200,
  weight: '50 g',
  badge: 'Rare',
  badgeTone: 'ink',
  tagline: 'Youngest buds. Minimal intervention. Extraordinary elegance.',
  description: 'Made almost entirely from young, tender buds, minimally processed to preserve every delicate note. Pale in the cup, soft on the palate — a slow tea, for slow mornings.',
  why: 'Crafted from tender young buds and gently processed, Silver Needle is naturally rich in tea polyphenols and catechins, offering a refined cup with a naturally elegant character.',
  notes: {
    Taste: ['Honeysuckle', 'Melon', 'Soft'],
    Aroma: ['Hay', 'White flowers'],
    Mouthfeel: ['Silky', 'Light']
  },
  craft: ['Bud Selection', 'Gentle Handling', 'Withering', 'Minimal Oxidation', 'Drying', 'Sorting & Grading, then Packaging'],
  brew: {
    temp: '80 °C',
    dose: '3 g · 200 ml',
    time: '4–5 min'
  }
}, {
  id: 'golden',
  name: 'Golden Tips',
  descriptor: 'Legacy',
  category: 'Black tea',
  tin: 'var(--tea-golden-tin)',
  ink: 'var(--tea-golden-ink)',
  image: base + 'golden-tips.png',
  price: '₹1,850',
  priceNum: 1850,
  weight: '100 g',
  tagline: 'Rare golden tips. Deep character. Assam heritage.',
  description: 'A refined expression of Assam black tea, built from carefully selected golden tips. Controlled oxidation gives it a rich, complex cup with real depth and body.',
  why: 'Naturally rich in tea polyphenols and theaflavins, with naturally occurring caffeine, Golden Tips carries Assam\'s heritage into a sophisticated daily ritual.',
  notes: {
    Taste: ['Malty', 'Honey', 'Dried fruit'],
    Aroma: ['Cocoa', 'Toasted grain'],
    Mouthfeel: ['Full', 'Rounded']
  },
  craft: ['Selective Harvesting', 'Withering', 'Rolling', 'Oxidation', 'Drying / Firing', 'Sorting, Grading & Sensory Evaluation'],
  brew: {
    temp: '95 °C',
    dose: '2.5 g · 200 ml',
    time: '3–4 min'
  }
}, {
  id: 'green',
  name: 'Premium Green Tea',
  descriptor: 'Clarity',
  category: 'Green tea',
  tin: 'var(--tea-green-tin)',
  ink: 'var(--tea-green-ink)',
  image: base + 'green-tea.png',
  price: '₹950',
  priceNum: 950,
  weight: '100 g',
  tagline: 'Clean. Grassy. Unadorned.',
  description: 'Clean, grassy, and unadorned — the leaf, done properly, with nothing extra required.',
  why: 'Naturally rich in catechins with naturally occurring caffeine, our Green Tea is the everyday expression of the Assam leaf, done properly.',
  notes: {
    Taste: ['Grassy', 'Clean', 'Light sweetness'],
    Aroma: ['Green leaf', 'Steam'],
    Mouthfeel: ['Crisp', 'Brisk']
  },
  craft: ['Leaf Selection', 'Withering', 'Steaming', 'Rolling', 'Drying', 'Sorting & Packaging'],
  brew: {
    temp: '80 °C',
    dose: '2.5 g · 200 ml',
    time: '2–3 min'
  }
}, {
  id: 'ctc',
  name: 'CTC Tea',
  descriptor: 'Strength',
  category: 'Black tea',
  tin: 'var(--tea-ctc-tin)',
  ink: 'var(--tea-ctc-ink)',
  image: base + 'ctc-tea.png',
  price: '₹650',
  priceNum: 650,
  weight: '250 g',
  tagline: 'Bold. Malty. Without apology.',
  description: 'Crush, Tear, Curl — built for strength without apology. Bold, malty, and deep amber in the cup; the foundation of a proper cup of chai, for those who take their standards strong.',
  why: 'Naturally rich in theaflavins and thearubigins with naturally occurring caffeine, CTC gives chai its strength and colour.',
  notes: {
    Taste: ['Malty', 'Bold', 'Brisk'],
    Aroma: ['Toasted', 'Molasses'],
    Mouthfeel: ['Robust', 'Deep amber']
  },
  craft: ['Selective Harvesting', 'Withering', 'Crush, Tear, Curl', 'Oxidation', 'Drying', 'Sorting & Packaging'],
  brew: {
    temp: '100 °C',
    dose: '3 g · 200 ml',
    time: 'Boil with milk'
  }
}, {
  id: 'ube',
  name: 'Ube',
  descriptor: 'Comfort',
  category: 'Blend',
  tin: 'var(--tea-ube-tin)',
  ink: 'var(--tea-ube-ink)',
  image: base + 'ube.png',
  price: '₹1,200',
  priceNum: 1200,
  weight: '100 g',
  badge: 'Limited',
  badgeTone: 'gold',
  tagline: 'Copy to be supplied.',
  description: 'Product copy for Ube was not included in the website content document. Placeholder text.',
  why: 'Placeholder — awaiting copy.',
  notes: {
    Taste: ['—'],
    Aroma: ['—'],
    Mouthfeel: ['—']
  },
  craft: ['—'],
  brew: {
    temp: '—',
    dose: '—',
    time: '—'
  }
}];
const STORY = ['It started with a question: why does the world come to India for some of its finest teas, while India so often settles for less at home?', 'We have extraordinary estates. Exceptional leaves. Generations of craftsmanship. What was missing was a brand that brought the best of it together — worthy of the people who have earned the finer things in life.', 'So we went to the source. We searched. We tasted. We rejected. And we searched again — until we found teas that made one thing clear: India doesn\'t need better tea. India needs better access to its best tea.', 'That belief became RejuveLuxe. From rare Silver Needle and Matcha to Golden Tips, premium Green Tea and exceptional CTC, we are building a collection for people who understand quality — and expect nothing less. Not for the excess. For the earned.'];
const fmt = n => '₹' + n.toLocaleString('en-IN');
Object.assign(window, {
  PRODUCTS,
  STORY,
  fmt
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.ToastStack = __ds_scope.ToastStack;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
