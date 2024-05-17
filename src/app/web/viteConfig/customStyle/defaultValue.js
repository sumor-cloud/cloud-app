export default vars => {
  const defaultVars = {
    'color-blue': '#50a1ff',
    'color-indigo': '#6610f2',
    'color-purple': '#926dde',
    'color-pink': '#e83e8c',
    'color-red': '#ff4954',
    'color-orange': '#ffbe00',
    'color-yellow': '#ffba00',
    'color-green': '#3cd458',
    'color-teal': '#20c997',
    'color-cyan': '#17a2b8',
    'color-white': '#fff',
    'color-gray': '#868e96',
    'color-gray-dark': '#343a40',
    'color-primary': '#50a1ff',
    'color-secondary': '#e9ecf0',
    'color-success': '#3cd458',
    'color-info': '#926dde',
    'color-warning': '#ffba00',
    'color-danger': '#ff4954',
    'color-light': '#f8f9fa',
    'color-dark': '#273343',
    'color-background': '#f8f8f8',
    'font-size': '14px',
    'font-size-small': '12px',
    'font-size-large': '16px',
    'border-radius': '2px'
  }
  const autoFixValues = {
    'border-radius-small': '1px'
  }
  try {
    const radiusBase = parseInt(vars['border-radius'].replace('px', ''), 10)
    autoFixValues['border-radius-small'] = `${parseInt(radiusBase / 2, 10)}px`
  } catch (e) {
    // not required
  }
  return { ...defaultVars, ...vars, ...autoFixValues }
}
