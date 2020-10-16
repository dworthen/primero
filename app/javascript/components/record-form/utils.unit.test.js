import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<RecordForms /> - utils", () => {
  describe("compactValues", () => {
    it("returns object of values that changed", () => {
      const initialValues = {
        name: "John",
        phone: "555-555-5555",
        sex: null,
        un_no: null,
        caregiver_name: "",
        caregiver_number: "234-323-2353",
        services: [
          {
            unique_id: "123",
            un_id: "2134"
          }
        ],
        locations: ["loc-1"],
        past_locations: ["loc-2", "loc-3"],
        test_locations: ["loc-4"],
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          },
          {
            uncle_name: "Jimmy",
            unique_id: "125",
            phone: ""
          }
        ]
      };

      const values = {
        name: "John",
        phone: "555-555-5556",
        sex: null,
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        locations: ["loc-1", "loc-2"],
        past_locations: ["loc-3"],
        future_locations: [],
        test_locations: [],
        caregiver_number: "",
        incident_details: [
          {
            cp_incident_perpetrator_national_id_no: "",
            cp_incident_perpetrator_nationality: "",
            cp_incident_perpetrator_occupation: "",
            cp_incident_perpetrator_other_id_no: ""
          }
        ],
        relatives: [
          {
            unique_id: "234",
            father_name: "Joe"
          },
          {
            mother_name: "James"
          },
          {
            uncle_name: "Jimmy",
            unique_id: "125",
            phone: "555-333-5534"
          }
        ]
      };

      const expected = {
        caregiver_number: "",
        phone: "555-555-5556",
        services: [
          {
            _destroy: true,
            unique_id: "123"
          }
        ],
        locations: ["loc-1", "loc-2"],
        past_locations: ["loc-3"],
        relatives: [
          {
            mother_name: "James"
          },
          {
            unique_id: "125",
            uncle_name: "Jimmy",
            phone: "555-333-5534"
          }
        ]
      };

      expect(utils.compactValues(values, initialValues)).to.deep.equal(expected);
    });
  });

  describe("emptyValues", () => {
    it("should return true if all of the object's values are empty", () => {
      const testObject = {
        a: [],
        b: {},
        c: false
      };

      expect(utils.emptyValues(testObject)).to.be.true;
    });
    it("should return false if any of the object's values are not empty", () => {
      const testObject = {
        a: [],
        b: "Test 2"
      };

      expect(utils.emptyValues(testObject)).to.be.false;
    });
  });

  describe("getRedirectPath", () => {
    it("should return the path to the case id if there is a incidentFromCase", () => {
      expect(utils.getRedirectPath({ isNew: true }, {}, fromJS({ incident_case_id: "case-id-1" }))).to.equal(
        "/cases/case-id-1"
      );
    });

    it("should return the path to the incident id if is not new", () => {
      expect(
        utils.getRedirectPath({ isEdit: true }, { recordType: "incidents", id: "incident-id-1" }),
        fromJS({})
      ).to.equal("/incidents/incident-id-1");
    });

    it("should return the path to incidents if is new", () => {
      expect(
        utils.getRedirectPath({ isNew: true }, { recordType: "incidents", id: "incident-id-1" }, fromJS({}))
      ).to.equal("/incidents");
    });
  });
});
