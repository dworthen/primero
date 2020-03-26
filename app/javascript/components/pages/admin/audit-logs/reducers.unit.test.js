import { fromJS } from "immutable";

import { expect } from "../../../../test";

import actions from "./actions";
import { reducers } from "./reducers";

describe("<AuditLogs /> - pages/admin/audit-logs/reducers", () => {
  it("should handle FETCH_AUDIT_LOGS_STARTED", () => {
    const expected = fromJS({
      loading: true,
      errors: false
    });

    const action = {
      type: actions.FETCH_AUDIT_LOGS_STARTED,
      payload: true
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AUDIT_LOGS_SUCCESS", () => {
    const data = [
      {
        id: 1,
        display_id: 1,
        record_type: "User",
        user_name: "primero",
        action: "create",
        resource_url: "http://localhost:3000/api/v2/tokens",
        timestamp: "2020-03-03T16:40:37.370Z",
        log_message: "Creating User '1' by user 'primero'",
        metadata: {
          user_name: "primero"
        }
      }
    ];
    const expected = fromJS({
      data,
      metadata: { per: 20 }
    });

    const action = {
      type: actions.FETCH_AUDIT_LOGS_SUCCESS,
      payload: { data, metadata: { per: 20 } }
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AUDIT_LOGS_FAILURE", () => {
    const expected = fromJS({
      loading: false,
      errors: true
    });

    const action = {
      type: actions.FETCH_AUDIT_LOGS_FAILURE
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_AUDIT_LOGS_FINISHED", () => {
    const expected = fromJS({
      loading: false,
      errors: false
    });

    const action = {
      type: actions.FETCH_AUDIT_LOGS_FINISHED
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_PERFORMED_BY_SUCCESS", () => {
    const data = [
      {
        id: 1,
        full_name: "User Test",
        email: "user_test@primero.com",
        module_unique_ids: ["primeromodule-test"],
        user_name: "user_test"
      }
    ];
    const expected = fromJS({
      filters: {
        performed_by: {
          data,
          metadata: { per: 20 }
        }
      }
    });

    const action = {
      type: actions.FETCH_PERFORMED_BY_SUCCESS,
      payload: { data, metadata: { per: 20 } }
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_PERFORMED_BY_FAILURE", () => {
    const expected = fromJS({
      filters: {
        performed_by: {
          loading: false,
          errors: true
        }
      }
    });

    const action = {
      type: actions.FETCH_PERFORMED_BY_FAILURE
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });

  it("should handle FETCH_PERFORMED_BY_FINISHED", () => {
    const expected = fromJS({
      filters: {
        performed_by: {
          loading: false,
          errors: false
        }
      }
    });

    const action = {
      type: actions.FETCH_PERFORMED_BY_FINISHED
    };

    const newState = reducers(fromJS({}), action);

    expect(newState).to.deep.equal(expected);
  });
});
