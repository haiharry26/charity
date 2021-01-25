import { environment } from '../../environments/environment';

const GATEWAY = environment.api;

export const ApiConstant = {
  SEARCH_FILTER_CONTROLLER: '',
  GET_USER_PHOTO: '',
  CONIGURABLE_COLUMN_CONTROLLER: '',
  IMAGE_PATH: '',

  getAllCharityMasterDataURL: `${GATEWAY}/charity/all`,
  saveCharityMasterDataURL: `${GATEWAY}/charity/create-update`,
  deleteCharityMasterDataURL: `${GATEWAY}/charity/delete`,
  deleteAllCharityMasterDataURL: `${GATEWAY}/charity/delete-all`,
  filterByCharityMasterIdURL: `${GATEWAY}/charity/multiplenames`,
  getCharityMasterDataByIdURL: `${GATEWAY}/charity/detail`,
  getCharityNameForFilterURL: `${GATEWAY}/charity/allidnames`,

  getAllCharityTransactionsDataURL: `${GATEWAY}/trans/all`,
  saveCharityTransactionsDataURL: `${GATEWAY}/trans/create-update`,
  deleteCharityTransactionsDataURL: `${GATEWAY}/trans/delete`,
  findMultipleTransFilter: `${GATEWAY}/trans/findMultipleTransFilter`,
  getCharityTransactionsDataByIdURL: `${GATEWAY}/trans/detail`,
  getListTrans: `${GATEWAY}/trans/listTrans`,
  sendTranEmail: `${GATEWAY}/trans/findandSendEmail`,

  getSummaryYear: `${GATEWAY}/finyear`, 
  getAllLedger: `${GATEWAY}/ledger/all`,
  findMultipleLedgerFilter: `${GATEWAY}/ledger/findMultipleLedgerFilter`,
  saveLedgerDetails: `${GATEWAY}/ledger/create-update`,

  getAllProposalReviewMeetingURL: `${GATEWAY}/proposalReviewMeeting/all-proposal-review-meeting-details`,
  saveProposalReviewMeetingDetailsURL: `${GATEWAY}/proposalReviewMeeting/saveProposalReviewMeetingDetails`,
  filterProposalReviewMeetingByPropRevMeetingIdURL: `${GATEWAY}/proposalReviewMeeting/filterByProposalReviewMeetingId`,
  filterProposalReviewMeetingByClientIdURL: `${GATEWAY}/proposalReviewMeeting/filterByProposalReviewMeetingClientId`,
  deleteProposalReviewMeetingDetailsURL: `${GATEWAY}/proposalReviewMeeting/delete-proposalReviewMeetingDetails`,

  getAllSiteKickOfMeetingURL: `${GATEWAY}/skom/all-skom-data`,
  saveSiteKickOfMeetingDetailsURL: `${GATEWAY}/skom/saveClientData`,
  filterSiteKickOfMeetingBySiteKickMeetingIdURL: `${GATEWAY}/skom/filterBySkomId`,
  filterSiteKickOfMeetingByClientIdURL: `${GATEWAY}/skom/filterByClientId`,
  deleteSiteKickOfMeetingDetailsURL: `${GATEWAY}/skom/delete-skomData`,

  geAllPPAExecutionDetails: `${GATEWAY}/ppaExecution/all-PPAExecution-details`,
  savePPAExecutionDetails: `${GATEWAY}/ppaExecution/save-PPAExecution-details`,
  filterByPPAExecutionId: `${GATEWAY}/ppaExecution/filterByPPAExecutionId`,
  filterByPPAExecutionClientId: `${GATEWAY}/ppaExecution/filterByPPAExecutionClientId`,
  deletePPAExecutionDetails: `${GATEWAY}/ppaExecution/delete-PPAExecution-details`,
  uploadPPAExecutionFile: `${GATEWAY}/ppaExecution/uploadFile`,

  getAllJoinSurveyDetails: `${GATEWAY}/joinSurveyDetails/allJoinSurveyDetails`,
  saveJoinSurveyDetails: `${GATEWAY}/joinSurveyDetails/saveJoinSurveyDetails`,
  deleteJoinSurveyDetails: `${GATEWAY}/joinSurveyDetails/delete-JoinSurveyDetails`,
  filterByJoinSurveyId: `${GATEWAY}/joinSurveyDetails/filterByJoinSurveyId`,
  filterJointSurveyReportByClientId: `${GATEWAY}/joinSurveyDetails/filterByJoinSurveyClientId`,
  uploadJointSurveyReportFile: `${GATEWAY}/joinSurveyDetails/uploadFile`,

  getAllInstallationActivityDetails: `${GATEWAY}/installationActivity/all-installationActivity-details`,
  deleteInstallationActivityDetails: `${GATEWAY}/installationActivity/delete-installationActivity-details`,
  filterInstallationActivityByClientId: `${GATEWAY}/installationActivity/filterByInstallationActivityClientId`,
  filterByInstallationActivityId: `${GATEWAY}/installationActivity/filterByInstallationActivityId`,
  savelInstallationActivityDetails: `${GATEWAY}/installationActivity/save-installationActivity-details`,
  uploadInstallationActivityFile: `${GATEWAY}/installationActivity/uploadFile`,
  filterByInstallationActivityMountType: `${GATEWAY}/installationActivity/filterByInstallationActivityMountType`,

  getAllStepActivitiesDetails: `${GATEWAY}/step1to23Activities/all-step1to23Activities-details`,
  deleteStepActivitiesDetails: `${GATEWAY}/step1to23Activities/delete-step1to23Activities-details`,
  filterStepActivitiesByClientId: `${GATEWAY}/step1to23Activities/filterByStep1to23ActivitiesClientId`,
  filterStepActivitiesByActivitiesId: `${GATEWAY}/step1to23Activities/filterByStep1to23ActivitiesId`,
  filterStepActivitiesByStepNo: `${GATEWAY}/step1to23Activities/filterByStep1to23ActivitiesStepNo`,
  saveStepActivitiesDetails: `${GATEWAY}/step1to23Activities/save-step1to23Activities-details`,
  uploadStepActivitiesFile: `${GATEWAY}/step1to23Activities/uploadFile`,
  filterByStep1to23ActivitiesStepNo: `${GATEWAY}/step1to23Activities/filterByStep1to23ActivitiesStepNo`,

  allFeasibilitySurvey: `${GATEWAY}/feasibilitySurvey/all-feasibilitySurvey-details`,
  filterByFeasibSurveyId: `${GATEWAY}/feasibilitySurvey/filterByFeasibSurveyId`,
  filterByFeasibSurveyClientId: `${GATEWAY}/feasibilitySurvey/filterByFeasibSurveyClientId`,
  deleteFeasibilitySurveyDetails: `${GATEWAY}/feasibilitySurvey/deleteFeasibilitySurveyDetails`,
  downloadFeasibilitySurveyFile: `${GATEWAY}/feasibilitySurvey/downloadFile/`,
  saveFeasibilitySurveyDetails: `${GATEWAY}/feasibilitySurvey/saveFeasibilitySurveyDetails`,
  uploadFileImageFeasibilitySurvey: `${GATEWAY}/feasibilitySurvey/uploadFileImage`,
  uploadFilePDFFeasibilitySurvey: `${GATEWAY}/feasibilitySurvey/uploadFilePDF`,

  getAllProposalsDataURL: `${GATEWAY}/proposals/all-proposals-details`,
  filterByProposalsId: `${GATEWAY}/proposals/filterByProposalsId`,
  saveProposalDetails: `${GATEWAY}/proposals/save-proposals-details`,
  deleteProposalsDetails: `${GATEWAY}/proposals/delete-proposals-details`,
  filterByProposalsClientId: `${GATEWAY}/proposals/filterByProposalsClientId`,
  uploadYmpProposals: `${GATEWAY}/proposals/uploadFile`,

  allPreliminaryDesign: `${GATEWAY}/preliminaryDesign/all-preliminary-design-details`,
  filterByPreliDesignId: `${GATEWAY}/preliminaryDesign/filterByPreliminaryDesignId`,
  savePreliminaryDesignDetails: `${GATEWAY}/preliminaryDesign/save-preliminary-design-details`,
  deletePreliminaryDesignDetails: `${GATEWAY}/preliminaryDesign/delete-preliminary-design-details`,
  uploadPreliminaryDesign: `${GATEWAY}/preliminaryDesign/uploadFile`,
  filterByPreliminaryDesignClientId: `${GATEWAY}/preliminaryDesign/filterByPreliminaryDesignClientId`,

  filterByVendorId: `${GATEWAY}/vendorallocation/filterByVendorAllocationId`,
  getAllVendorAllocationDataURL: `${GATEWAY}/vendorallocation/all-vendor_allocation`,
  deleteVendorAllocationDetails: `${GATEWAY}/vendorallocation/delete-vendor_allocation`,
  saveVendorAllocationDetails: `${GATEWAY}/vendorallocation/save-vendor_allocation`,
  filterByVendorAllocationClientId: `${GATEWAY}/vendorallocation/filterByVendorAllocationClientId`,

  getAllCommericialFeasibilty: `${GATEWAY}/commercialFeasibility/all-commercial-feasibility`,
  filterByCommFeasibilityClientId: `${GATEWAY}/commercialFeasibility/filterByCommFeasibilityClientId`,
  deleteCommercialFeasibility: `${GATEWAY}/commercialFeasibility/deleteCommercialFeasibility`,
  saveCommercialFeasibility: `${GATEWAY}/commercialFeasibility/saveCommercialFeasibility`,
  filterByCommFeasibilityId: `${GATEWAY}/commercialFeasibility/filterByCommFeasibilityId`,

  allPartyDetails: `${GATEWAY}/partyInterested/all-party-details`,
  savePartyInterestedDetails: `${GATEWAY}/partyInterested/savePartyInterestedDetails`,
  deletePartyDetails: `${GATEWAY}/partyInterested/delete-partyDetails`,
  filterByIdPartyDetails: `${GATEWAY}/partyInterested/filterById`,
  filterByClientIdPartyDetails: `${GATEWAY}/partyInterested/filterByClientId`,


  filterByEngineerAllocationId: `${GATEWAY}/engineer_allocation/filterByEngineerAllocationId`,
  getAllEngineerAllocationDataURL: `${GATEWAY}/engineer_allocation/all-engineer-allocation`,
  deleteEngineerAllocationDetails: `${GATEWAY}/engineer_allocation/delete-engineer-allocation`,
  saveEngineerAllocationDetails: `${GATEWAY}/engineer_allocation/save-engineer-allocation`,
  filterByEngineerAllocationClientId: `${GATEWAY}/engineer_allocation/filterByEngineerAllocationClientId`,


  filterByBomId: `${GATEWAY}/bom/filterByBomId`,
  getAllBomDataURL: `${GATEWAY}/bom/all-bom-details`,
  deleteBomDetails: `${GATEWAY}/bom/delete-bom-details`,
  saveBomDetails: `${GATEWAY}/bom/save-bom-details`,
  filterByBomClientId: `${GATEWAY}/bom/filterByBomClientId`,
  uploadBomFile: `${GATEWAY}/bom/uploadFile`,


  login: `${GATEWAY}/emp/loginEmp`,

  getAllUsers: `${GATEWAY}/users/all-user-data`,
  filterByUserId: `${GATEWAY}/users/getUser`,
  saveUser: `${GATEWAY}/users/registerUser`,
  getAllRoles: `${GATEWAY}/roles/all-role-details`,

  filterOrgClientDetailsByStepId: `${GATEWAY}/client/filterOrgClientDetailsByStepId`,


  getAllPPASummaryData: `${GATEWAY}/ppa-summary/all-ppa-summary-details`,
  savePPASummaryDataURL: `${GATEWAY}/ppa-summary/savePPASummaryDetails`,
  filterByPPASummaryId: `${GATEWAY}/ppa-summary/filterByPPASummaryId`,
  filterByPPASummaryClientId: `${GATEWAY}/ppa-summary/filterByPPASummaryClientId`,
  uploadPPASummaryURL: `${GATEWAY}/ppa-summary/uploadFile`,
  // downloadFactSheetURL: `${GATEWAY}/factSheet/downloadFile/`,
  deletePPASummaryDetails: `${GATEWAY}/ppa-summary/delete-PPASummaryDetails`,


  allDigitalSurvey: `${GATEWAY}/digitalsurvey/all-digitalSurveyr-details`,
  filterByDigitalSurveyId: `${GATEWAY}/digitalsurvey/filterByDigitalSurveyId`,
  filterByDigitalClientId: `${GATEWAY}/digitalsurvey/filterByDigitalSurveyClientId`,
  deleteDigitalDetails: `${GATEWAY}/digitalsurvey/deleteDigitalSurveyrDetails`,
  downloadDigitalSurveyFile: `${GATEWAY}/digitalsurvey/downloadFile/`,
  saveDigitalSurveyDetails: `${GATEWAY}/digitalsurvey/saveDigitalSurveyrDetails`,
  uploadFileImageDigitalSurvey: `${GATEWAY}/digitalsurvey/uploadFileImage`,
  uploadFilePDFDigitalSurvey: `${GATEWAY}/digitalsurvey/uploadFilePDF`,


  allPreliminaryProposalPresentation: `${GATEWAY}/preliminaryPraposalPresentation/all-preliminary-praposalpresentation-details`,
  filterByPreliminaryProposalPresentationId: `${GATEWAY}/preliminaryPraposalPresentation/filterByPreliminaryPraposalPresentationId`,
  savePreliminaryProposalPresentation: `${GATEWAY}/preliminaryPraposalPresentation/save-preliminary-praposal-presentation-details`,
  deletePreliminaryProposalPresentation: `${GATEWAY}/preliminaryPraposalPresentation/delete-preliminary-praposal-presentation-details`,
  uploadPreliminaryProposalPresentation: `${GATEWAY}/preliminaryPraposalPresentation/uploadFile`,
  filterByPreliminaryProposalPresentationClientId: `${GATEWAY}/preliminaryPraposalPresentation/filterByPreliminaryPraposalPresentationClientId`,


  geAllTermSheetDetails: `${GATEWAY}/termSheetProcess/all-TermSheetProcess-details`,
  saveTermSheetDetails: `${GATEWAY}/termSheetProcess/save-TermSheetProcess-details`,
  filterByTermSheetId: `${GATEWAY}/termSheetProcess/filterByTermSheetProcessId`,
  filterByTermSheetClientId: `${GATEWAY}/termSheetProcess/filterByTermSheetProcessClientId`,
  deleteTermSheetDetails: `${GATEWAY}/termSheetProcess/delete-TermSheetProcess-details`,
  uploadTermSheetFile: `${GATEWAY}/termSheetProcess/uploadFile`,

};

