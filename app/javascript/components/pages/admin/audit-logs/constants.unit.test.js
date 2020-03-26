import { expect } from "../../../../test/unit-test-helpers";

import * as constants from "./constants";

describe("<AuditLogs /> pages/admin/audit-logs/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    expect(clone).to.be.an("object");
    ["NAME", "AUDIT_LOG"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
