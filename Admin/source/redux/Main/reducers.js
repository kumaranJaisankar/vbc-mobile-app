import {combineReducers} from 'redux';
import types from './types';

let dataState = {
  userInfo: {},
  customer: {},
  customerBasicInfo: {},
  customerCurrentPlan: {},
  pageNo: 1,
  profilePicUri: '',
  planDetails: {},
  addressProofUri: '',
  idProofUri: '',
  signatureProofUri: '',
  customerKYC: {},
  isAuthenticated: false,
};

const main = (state = dataState, action) => {
  switch (action.type) {
    case types.USER_INFO:
      return Object.assign({}, state, {userInfo: action.payload.info});
    case types.CUSTOMER:
      return Object.assign({}, state, {customer: action.payload.info});
    case types.CUSTOMER_BASIC_INFO:
      return Object.assign({}, state, {customerBasicInfo: action.payload.info});
    case types.CUSTOMER_CURRENT_PLAN:
      return Object.assign({}, state, {
        customerCurrentPlan: action.payload.info,
      });
    case types.PAGE_NO:
      return Object.assign({}, state, {
        pageNo: action.payload.info,
      });
    case types.PROFILE_PIC_URI:
      return Object.assign({}, state, {
        profilePicUri: action.payload.info,
      });
    case types.PLAN_DETAILS:
      return Object.assign({}, state, {
        planDetails: action.payload.info,
      });
    case types.ID_PROOF_URI:
      return Object.assign({}, state, {
        idProofUri: action.payload.info,
      });
    case types.ADDRESS_PROOF_URI:
      return Object.assign({}, state, {
        addressProofUri: action.payload.info,
      });
    case types.SIGNATURE_PROOF_URI:
      return Object.assign({}, state, {
        signatureProofUri: action.payload.info,
      });
    case types.CUSTOMER_KYC:
      return Object.assign({}, state, {
        customerKYC: action.payload.info,
      });
    case types.IS_AUTHENTICATED:
      return Object.assign({}, state, {
        isAuthenticated: action.payload.info,
      });
    default:
      return state;
  }
};

const reducers = combineReducers({
  main,
});

export default reducers;
