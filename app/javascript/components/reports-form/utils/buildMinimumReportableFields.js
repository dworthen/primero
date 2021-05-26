import uniqBy from "lodash/uniqBy";

import { displayNameHelper } from "../../../libs";

export default (i18n, forms, fieldsByParentForm) => {
  const result = Object.entries(fieldsByParentForm).reduce((accumulator, current) => {
    const [key, fields] = current;

    const filteredForms = forms.filter(form => form.get("parent_form") === key);

    const onlyFields = filteredForms.map(filteredForm => {
      return filteredForm.fields
        .filter(field => fields.includes(field.name))
        .map(field => {
          return {
            id: field.get("name"),
            display_text: displayNameHelper(field.get("display_name"), i18n.locale),
            formSection: i18n.t("minimum_reportable_fields", { record_type: key }),
            type: field.get("type"),
            option_strings_source: field.get("option_strings_source")?.replace(/lookup /, ""),
            option_strings_text: field.get("option_strings_text"),
            tick_box_label: field.getIn(["tick_box_label", i18n.locale])
          };
        });
    });

    return { ...accumulator, [key]: [...uniqBy(onlyFields.toJS().flat(), "id")] };
  }, {});

  return result;
};
