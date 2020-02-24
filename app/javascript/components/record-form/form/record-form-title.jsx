import { IconButton } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import React from "react";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/styles/makeStyles";

import styles from "./styles.css";

const RecordFormTitle = ({ displayText, handleToggleNav, mobileDisplay }) => {
  const css = makeStyles(styles)();

  if (!mobileDisplay) {
    return null;
  }

  return (
    <div className={css.formTitle}>
      <IconButton onClick={handleToggleNav}>
        <ArrowBackIosIcon />
      </IconButton>
      <h1 className={css.formHeading}>{displayText}</h1>
    </div>
  );
}

RecordFormTitle.displayName = "RecordFormTitle";

RecordFormTitle.propTypes = {
  displayText: PropTypes.string.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default RecordFormTitle;
