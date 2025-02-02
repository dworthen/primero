# frozen_string_literal: true

# Note: Currently this concern contains logic / fields specific to Child/Case.
# Note: This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
module Workflow
  extend ActiveSupport::Concern

  WORKFLOW_NEW = 'new'
  WORKFLOW_CLOSED = 'closed'
  WORKFLOW_REOPENED = 'reopened'
  WORKFLOW_SERVICE_PROVISION = 'service_provision' # Note, this status is deprecated
  WORKFLOW_SERVICE_IMPLEMENTED = 'services_implemented'
  WORKFLOW_CASE_PLAN = 'case_plan'
  WORKFLOW_ASSESSMENT = 'assessment'

  LOOKUP_RESPONSE_TYPES = 'lookup-service-response-type'

  included do
    store_accessor :data, :workflow
    alias_method :workflow_status, :workflow

    searchable do
      string :workflow_status, as: 'workflow_status_sci'
      string :workflow, as: 'workflow_sci'
    end

    before_create :set_workflow_new
    before_save :calculate_workflow
  end

  def set_workflow_new
    self.workflow ||= WORKFLOW_NEW
  end

  def calculate_workflow
    if status == Record::STATUS_OPEN
      if workflow_case_reopened?
        self.workflow = WORKFLOW_REOPENED
      elsif workflow_services_implemented?
        self.workflow = WORKFLOW_SERVICE_IMPLEMENTED
      elsif workflow_service_response?
        most_recent_service = self.most_recent_service(Serviceable::SERVICE_NOT_IMPLEMENTED)
        self.workflow = most_recent_service['service_response_type'] if most_recent_service.present?
      elsif workflow_case_plan?
        self.workflow = WORKFLOW_CASE_PLAN
      elsif workflow_assessment?
        self.workflow = WORKFLOW_ASSESSMENT
      end
    elsif status == Record::STATUS_CLOSED
      self.workflow = WORKFLOW_CLOSED
    end
  end

  def workflow_case_reopened?
    (changes_to_save_for_record.key?('case_status_reopened') ||
      changes_to_save_for_record.key?('status')) && case_status_reopened
  end

  def workflow_services_implemented?
    changes_to_save_for_record.key?('services_section') &&
      services_status == Serviceable::SERVICES_ALL_IMPLEMENTED &&
      self.module.use_workflow_service_implemented
  end

  def workflow_service_response?
    changes_to_save_for_record.key?('services_section') &&
      services_section.present?
  end

  def workflow_case_plan?
    changes_to_save_for_record.key?('date_case_plan') &&
      date_case_plan.present? &&
      self.module.use_workflow_case_plan
  end

  def workflow_assessment?
    changes_to_save_for_record.key?('assessment_requested_on') &&
      assessment_requested_on.present? &&
      self.module.use_workflow_assessment
  end

  # Class methods
  module ClassMethods
    def workflow_statuses(modules = [], lookups = nil)
      lookup = lookup_response_types(lookups)

      I18n.available_locales.map do |locale|
        status_list = []
        status_list << workflow_key_value(WORKFLOW_NEW, locale)
        status_list << workflow_key_value(WORKFLOW_REOPENED, locale)
        modules&.any?(&:use_workflow_assessment) &&
          (status_list << workflow_key_value(WORKFLOW_ASSESSMENT, locale))
        modules&.any?(&:use_workflow_case_plan) &&
          status_list << workflow_key_value(WORKFLOW_CASE_PLAN, locale)
        status_list += lookup&.lookup_values(locale) || []
        modules&.any?(&:use_workflow_service_implemented) &&
          status_list << workflow_key_value(WORKFLOW_SERVICE_IMPLEMENTED, locale)
        status_list << workflow_key_value(WORKFLOW_CLOSED, locale)
        { locale => status_list }
      end.inject(&:merge)
    end

    def lookup_response_types(lookups = nil)
      lookup = lookups&.find { |lkp| lkp.unique_id == LOOKUP_RESPONSE_TYPES }
      lookup || Lookup.find_by(unique_id: LOOKUP_RESPONSE_TYPES)
    end

    private

    def workflow_key_value(status, locale = I18n.locale)
      {
        'id' => status,
        'display_text' => I18n.t("case.workflow.#{status}", locale: locale)
      }
    end
  end
end
