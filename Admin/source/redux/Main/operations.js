import actions from './actions';

const updatedUserInformation = info => {
  return dispatch => {
    return dispatch(actions.updateUserInformation(info));
  };
};

const updateCustomerInformation = info => {
  return dispatch => {
    return dispatch(actions.updateCustomerInformation(info));
  };
};

const updateCustomerBasicInformation = info => {
  return dispatch => {
    return dispatch(actions.updateCustomerBasicInformation(info));
  };
};

const updateCustomerCurrentPlan = info => {
  return dispatch => {
    return dispatch(actions.updateCustomerCurrentPlan(info));
  };
};

const updatePageNo = info => {
  return dispatch => {
    return dispatch(actions.updatePageNo(info));
  };
};

const updateProfilePicUri = info => {
  return dispatch => {
    return dispatch(actions.updateProfilePicUri(info));
  };
};

const updatePlanDetails = info => {
  return dispatch => {
    return dispatch(actions.updatePlanDetails(info));
  };
};

const updateIDProofUri = info => {
  return dispatch => {
    return dispatch(actions.updateIDProofUri(info));
  };
};

const updateAddressProofUri = info => {
  return dispatch => {
    return dispatch(actions.updateAddressProofUri(info));
  };
};

const updateSignatureProofUri = info => {
  return dispatch => {
    return dispatch(actions.updateSignatureProofUri(info));
  };
};

const updateCustomerKYC = info => {
  return dispatch => {
    return dispatch(actions.updateCustomerKYC(info));
  };
};

const updateAuthentication = info => {
  return dispatch => {
    return dispatch(actions.updateAuthentication(info));
  };
};

export default {
  updatedUserInformation,
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
