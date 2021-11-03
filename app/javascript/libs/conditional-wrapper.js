import PropTypes from "prop-types";

/* eslint-disable import/prefer-default-export, import/exports-last */
export const ConditionalWrapper = ({ condition, wrapper: Wrapper, children, ...rest }) => {
  if (condition) {
    return typeof Wrapper === "function" ? Wrapper({ children, ...rest }) : <Wrapper {...rest}>{children}</Wrapper>;
  }

  return children;
};

ConditionalWrapper.propTypes = {
  children: PropTypes.oneOf([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  condition: PropTypes.bool,
  wrapper: PropTypes.oneOf([PropTypes.func, PropTypes.elementType])
};

ConditionalWrapper.displayName = "ConditionalWrapper";
