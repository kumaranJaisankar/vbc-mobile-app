import types from './types';

const updateUserInformation = info => ({
  type: types.USER_INFO,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateCustomerInformation = info => ({
  type: types.CUSTOMER,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateCustomerBasicInformation = info => ({
  type: types.CUSTOMER_BASIC_INFO,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateCustomerCurrentPlan = info => ({
  type: types.CUSTOMER_CURRENT_PLAN,
  status: 'success',
  payload: {
    info: info,
  },
});

const updatePageNo = info => ({
  type: types.PAGE_NO,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateProfilePicUri = info => ({
  type: types.PROFILE_PIC_URI,
  status: 'success',
  payload: {
    info: info,
  },
});

const updatePlanDetails = info => ({
  type: types.PLAN_DETAILS,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateIDProofUri = info => ({
  type: types.ID_PROOF_URI,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateAddressProofUri = info => ({
  type: types.ADDRESS_PROOF_URI,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateSignatureProofUri = info => ({
  type: types.SIGNATURE_PROOF_URI,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateCustomerKYC = info => ({
  type: types.CUSTOMER_KYC,
  status: 'success',
  payload: {
    info: info,
  },
});

const updateAuthentication = info => ({
  type: types.IS_AUTHENTICATED,
  status: 'success',
  payload: {
    info: info,
  },
});

export default {
  updateUserInformation,
  updateCustomerInformation,
  updateCustomerBasicInformation,
  updateCustomerCurrentPlan,
  updatePageNo,
  updateProfilePicUri,
  updatePlanDetails,
  updateIDProofUri,
  updateAddressProofUri,
  updateSignatureProofUri,
  updateCustomerKYC,
  updateAuthentication,
};
