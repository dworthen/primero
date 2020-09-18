import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fromJS } from "immutable";

import { useI18n } from "../../i18n";
import Form, { FormAction, whichFormMode } from "../../form";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { ROUTES } from "../../../config";
import bindFormSubmit from "../../../libs/submit-form";
import { form } from "../admin/users-form/form";
import LoadingIndicator from "../../loading-indicator";
// import validations from "../admin/users-form/validations";

import { NAME } from "./constants";
import NAMESPACE from "./namespace";
import { fetchCurrentUser, clearCurrentUser, updateUserAccount } from "./action-creators";
import { getCurrentUser, getSavingRecord } from "./selectors";

const Container = ({ mode }) => {
  const i18n = useI18n();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();

  const currentUser = useSelector(state => getCurrentUser(state));
  const saving = useSelector(state => getSavingRecord(state));
  const formErrors = fromJS({});
  const useIdentityProviders = null;
  const providers = null;
  const identityOptions = null;
  // const validationSchema = validations(formMode, i18n, useIdentityProviders, providers, true);

  const handleSubmit = data => dispatch(updateUserAccount({ id, data, message: i18n.t("user.messages.updated") }));

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(`${ROUTES.account}/${currentUser.get("id")}`));
  };

  const saveButton = formMode.get("isEdit") && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        savingRecord={saving}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  );

  const pageHeading = currentUser?.size ? currentUser.get("full_name") : i18n.t("navigation.my_account");

  useEffect(() => {
    console.log("FETCH USER");
    dispatch(fetchCurrentUser(id));

    return () => {
      dispatch(clearCurrentUser());
    };
  }, [id]);

  return (
    <LoadingIndicator hasData type={NAMESPACE}>
      <PageContainer>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <Form
            useCancelPrompt
            mode={mode}
            formSections={form(i18n, formMode, useIdentityProviders, providers, identityOptions, true)}
            onSubmit={handleSubmit}
            ref={formRef}
            // validations={validationSchema} // TODO: Edit to take into account if account page
            initialValues={currentUser.toJS()}
            formErrors={formErrors}
          />
        </PageContent>
      </PageContainer>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
