import { format } from 'date-fns';
import { postAPI, getAPI, patchAPI, putAPI } from './api';
import config from './api/config';
const urlParams = [];

//Auth
export const postLogin = data => postAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/token`, {}, data, true);

//Complaints
export const getComplaintsData = () =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/create/options/ticket`, {}, true); // Need To Be Changed
// export const postComplaint = data =>
//   postAPI(`${config.REACT_APP_API_URL_HELPDESK}/create/ticket`, {}, data, true);
export const postComplaint = data => postAPI(`${config.REACT_APP_API_URL_HELPDESK}/enh/create`, {}, data, true);

export const getComplaintsListData = (limit, page, search, status) =>
  getAPI(
    `${config.REACT_APP_API_URL_HELPDESK}/v2/enh/list?limit=${limit}&page=${page}${search ? `&open_for=${search}` : ''
    }${status ? `&status=${status}` : ''}`,
    {},
    true,
  );

export const getComplaintsListDataDateWise = (limit, page, opn, rslv) =>
  getAPI(
    `${config.REACT_APP_API_URL_HELPDESK}/enh/list?limit=${limit}&page=${page}&open_date=${opn}&resolved_date_end=${rslv}`,
    {},
    true,
  );
export const getAssignUsers = () =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/display/users/mobile`, {}, true);
export const getAssignUsersV3 = () =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/display/users`, {}, true);
export const getAssignUsersV2 = () => getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/staff`, {}, true);

export const getBranchDateWiseComplaintsData = () =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/analytics`, {}, true); // Need To Be Chnaged
export const getAssignedToUser = userID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/user/${userID}/details/ticket/populate`, {}, true);
// export const editTicket = (ticketID, data) =>
//   patchAPI(`${config.REACT_APP_API_URL_HELPDESK}/rud/${ticketID}/ticket`, {}, data, true);
export const editTicket = (ticketID, data) =>
  patchAPI(`${config.REACT_APP_API_URL_HELPDESK}/enh/${ticketID}`, {}, data, true);
export const getNAS = branchID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/nas/filter?branch=${branchID}`, {}, true);
export const getOLT = nasID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/filter?parent_nas__id=${nasID}`, {}, true);
export const getDP = oltID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/childdp/${oltID}/filter`, {}, true);
export const getPort = dpID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdpport/${dpID}/filter`, {}, true);
export const sendOTP = data => postAPI(`${config.REACT_APP_API_URL_HELPDESK}/send/otp`, {}, data, true);
export const verifyOTP = data => postAPI(`${config.REACT_APP_API_URL_HELPDESK}/otp/verify`, {}, data, true);

export const verifyProvisioningOTP = data =>
  patchAPI(`${config.REACT_APP_API_URL_HELPDESK}/security/deposit/otp/verify`, {}, data, true);

export const getSubCat = catID =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/sub/ticketcategory/${catID}`, {}, true);
//Leads
export const getLeads = (
  limit,
  page,
  search,
  status,
  source,
  fromDate,
  toDate,
) =>
  getAPI(
    `/radius/v2/lead/display?page=${page}&page_size=${limit}${search ? `&search=${search}` : ''
    }${status ? `&status=${status}` : ''}${source ? `&lead_source=${source}` : ''
    }${fromDate ? `&created=${fromDate}` : ''}${toDate ? `&created_end=${toDate}` : ''
    }`,
    {},
    false,
  );
export const getLeadOptions = () => getAPI('/radius/lead/options', {}, false);
export const getLeadAssignTo = ID => getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/lead/${ID}`, {}, true);
export const getroleData = () => getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/options/all`, {}, true);


export const addLead = data =>
  postAPI('/radius/lead/create/partial', {}, data, false);

//Network
// export const getNASList = () => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/nas/v2/list`, {}, true);
export const getNASList = (limit, page) =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/nas/enh/list?limit=${limit}&page=${page}`, {}, true);

// export const getOLTList = () => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/v2/list`, {}, true);
export const getOLTList = (limit, page) =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/enh/list?limit=${limit}&page=${page}`, {}, true);

export const getNASBranchList = () =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/branch/dropdown`, {}, true);
export const addNAS = data =>
  postAPI(`${config.REACT_APP_API_URL_NETWORK}/network/nas/create`, {}, data, true);

export const updateNas = data =>
  putAPI(`${config.REACT_APP_API_URL_NETWORK}/network/nas/update/${data.id}`, {}, data, true);

export const getOLTZone = () =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/loggedin/zones`, {}, true);
// get area fot olt
export const getOLTarea = (zone, franc) =>
  getAPI(
    `${config.REACT_APP_API_URL_ADMIN}/accounts/zone/${zone}/${franc ? franc : 0}/operatingareas`,
    {},
    true,
  );

export const getfilteredNasList = (branch, franchise, area, zone, limit = 10, page = 1) => {
  const urlParams = [
    limit && `limit=${encodeURIComponent(limit)}`,
    page && `page=${encodeURIComponent(page)}`,
    branch && `branch=${encodeURIComponent(branch)}`,
    franchise && `franchise=${encodeURIComponent(franchise)}`,
    area && `area=${encodeURIComponent(area)}`,
    zone && `zone=${encodeURIComponent(zone)}`,
  ]
    .filter(Boolean)
    .join('&');

  return getAPI(
    // `${config.REACT_APP_API_URL_NETWORK}/network/nas/display${urlParams ? `?${urlParams}` : ''}`,
    `${config.REACT_APP_API_URL_NETWORK}/network/nas/enh/list${urlParams ? `?${urlParams}` : ''}`,
    {},
    true,
  );
};
export const searchNetworkList = (networkType,limit = 10, page = 1,serial_no) => {
  const urlParams = [
    limit && `limit=${encodeURIComponent(limit)}`,
    page && `page=${encodeURIComponent(page)}`,
    serial_no && `serial_no=${encodeURIComponent(serial_no)}`,
  ]
    .filter(Boolean)
    .join('&');

  return getAPI(
    // `${config.REACT_APP_API_URL_NETWORK}/network/nas/display${urlParams ? `?${urlParams}` : ''}`,
    `${config.REACT_APP_API_URL_NETWORK}/network/${networkType}/enh/list${urlParams ? `?${urlParams}` : ''}`,
    {},
    true,
  );
};
export const getfilteredOltList = (branch, franchise, area, zone) => {
  const urlParams = [
    branch && `branch=${encodeURIComponent(branch)}`,
    franchise && `franchise=${encodeURIComponent(franchise)}`,
    area && `area=${encodeURIComponent(area)}`,
    zone && `zone=${encodeURIComponent(zone)}`,
  ]
    .filter(Boolean)
    .join('&');

  return getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/olt/display${urlParams ? `?${urlParams}` : ''}`,
    {},
    true,
  );
};

export const getfilteredCpeList = (branch, franchise, area, zone) => {
  const urlParams = [
    branch && `branch=${encodeURIComponent(branch)}`,
    franchise && `franchise=${encodeURIComponent(franchise)}`,
    area && `area=${encodeURIComponent(area)}`,
    zone && `zone=${encodeURIComponent(zone)}`,
  ]
    .filter(Boolean)
    .join('&');

  return getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/cpe/display${urlParams ? `?${urlParams}` : ''}`,
    {},
    true,
  );
};

// network preview detail page api's start

export const getNasById = id => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/nas`, {}, true);

export const getOltById = id => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/olt`, {}, true);

export const getParentDPbyId = id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/parentdp`, {}, true);

export const getChildDPbyId = id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/childdp`, {}, true);

export const getCPEById = id => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/cpe`, {}, true);

// network detail api end=======

// parent serial olt
export const getParentNASSerialNo = areaID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/olt/${areaID}/slno`, {}, true);

export const getDPParentSerialNo = areaID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/pdp/${areaID}/slno`, {}, true);

export const getDPChildSerialNo = areaID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/cdp/${areaID}/slno`, {}, true);

export const getCPEParentSerialNo = (zone, franc) =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/cpe/${zone}/${franc ? franc : 0}/slno`, {}, true);
export const getParentNASId = sNo =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/search/${sNo}`, {}, true);

export const addOLT = data =>
  postAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/create`, {}, data, true);

export const updateOLT = data =>
  putAPI(`${config.REACT_APP_API_URL_NETWORK}/network/olt/update/${data.id}`, {}, data, true);

export const getpDPList = (limit, page) =>
  // getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/parentdp/v2/list?page=${page}`, {}, true);
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/parentdp/enh/list?limit=${limit}&page=${page}`,
    {},
    true,
  );

export const getcDPList = (limit, page) =>
  // getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdp/v2/list?page=${page}`, {}, true);
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdp/enh/list?limit=${limit}&page=${page}`, {}, true);

// export const getCPEList = () => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/cpe/v2/list`, {}, true);
export const getCPEList = (limit, page) =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/cpe/enh/list?limit=${limit}&page=${page}`, {}, true);

// https://dev.vbc.cloudtaru.com:7012/network/cpe/enh/list?limit=${limit}&page=${page}
export const addPDP = data =>
  postAPI(`${config.REACT_APP_API_URL_NETWORK}/network/parentdp/create`, {}, data, true);
export const addCDP = data =>
  postAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdp/create`, {}, data, true);

export const updatePDP = data =>
  putAPI(`${config.REACT_APP_API_URL_NETWORK}/network/parentdp/update/${data.id}`, {}, data, true);

export const updateCDP = data =>
  putAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdp/update/${data.id}`, {}, data, true);

export const getCustomerCPEDetails = () =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/ins`, {}, true);
// export const getCustomerCPEDetails = user =>
//   getAPI(`customers/v3/list?username=${user}`, {}, true);
export const addCPE = data =>
  postAPI(`${config.REACT_APP_API_URL_NETWORK}/network/cpe/create`, {}, data, true);

export const updateCPE = data =>
  putAPI(`${config.REACT_APP_API_URL_NETWORK}/network/cpe/update/${data.id}`, {}, data, true);

//Customer KYC
export const getCustomersListData = (limit, page, search) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}${search ? `&username=${search}` : ''
    }`,
    {},
    true,
  );

export const getFilterCustomerData = query => getAPI(query, {}, true);

export const getAreaListData = () =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/loggedin/areas`, {}, true);
export const getPlanListData = areaID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/area/${areaID}/plans`, {}, true);

export const getPaymentMethodListData = area =>
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh/area/${area}/gateways`, {}, true); // New APi

export const makePayment = data => postAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh`, {}, data, true); // New APi

export const createCustomer = data =>
  postAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/create`, {}, data, true);

// online plan renew

export const makeOnlineRenew = (id, data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/onl/plan/renew/${id}`, {}, data, true);
// online plan change
export const makeOnlineChange = (id, data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/onl/plan/update/${id}`, {}, data, true);

//Customer360Info
export const getCustomerBasicInfo = userID =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/v2/list/basicinfo/${userID}`, {}, true);
export const changePassword = data =>
  postAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/otp/reset/password`, {}, data, true);
export const getCustomerDocs = userID =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/get/documents/${userID}`, {}, true);
export const deactivateUser = userName =>
  postAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/customer/${userName}/deactivate`, {}, null, true);
export const buffer = id =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/status/update/${id}`, {}, null, true);
export const hold = (userID, data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/hold/${userID}`, {}, data, true);
export const Unhold = (userID, data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/hold/${userID}/release`, {}, true);
export const updateBasicInfo = (id, data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/rud/${id}`, {}, data, true);
export const getComplaintsInfo = username =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/customer/${username}/tickets`, {}, true); // need to be changed
export const getCustomerCurrentPlan = id =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/plan/update/${id}`, {}, true);
export const getCustomerChangePlans = (areaID, planID, customerID) =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/area/${areaID}/otherplans/${planID}/${customerID}`, {}, true);
export const getCustomerUpgradePlans = (areaID, planID) =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/loggedin/${areaID}/plans/${planID}`, {}, true);
export const checkWalletInfo = data =>
  postAPI(`${config.REACT_APP_API_URL_ADMIN}/wallet/priorcheck`, {}, data, true);
export const getSessionInfo = (username, user) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v2/list/onlssninfo/customer/${user}/${username}`,
    {},
    true,
  );
export const getRadiusInfo = customer_id =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/v2/list/radiusinfo/${customer_id}`, {}, true);
export const getWalletInfo = userID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/wallet/customer/${userID}`, {}, true);
export const getPaymentOptions = () => getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/options`, {}, true);
export const makeOfflineRenew = (data, customerID) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/off/plan/renew/${customerID}`, {}, data, true);
export const changeOfflinePlan = (data, customerID) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/off/plan/change/${customerID}`, {}, data, true);

export const makeOfflinePayment = data =>
  postAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh/offline`, {}, data, true); // New API

// customer Dashboard
export const getCustomerDasboardInfo = () =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/analytics`, {}, true);

// total payments dashboard
export const getPaymentDasboardInfo = () =>
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/v2/analytics`, {}, true);
// temporary renewal
export const getTemprorayRenewal = (id, data) =>
  patchAPI(`customers/v3/buffer/renew/${id}`, {}, data, true);
// in renewal ippools
export const getIpPoolData = areaID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/ippool/${areaID}/get`, {}, true);
// remaining ippool list
export const getReaminingIPs = poolId =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/ippool/used_ips/${poolId}`, {}, true);

//get zone and branch
export const getBranchZone = areaID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/franchise/area/${areaID}/zone/branch`, {}, true);
  export const getFranchiseAreas = (franchiseId,areaID) =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/franchise/areas/${franchiseId}/${areaID}`, {}, true);
// get franchise by branch id
export const getFranchiseByBranchId = branchID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/franchise/${branchID}/branch`, {}, true);

// get zone by franchise id
export const getZoneByFranchiseId = franchiseID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/franchise/${franchiseID}/zones`, {}, true);

// get area by zone id
export const getAreaByZoneId = zoneID =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/zone/${zoneID}/areas`, {}, true);

//Expiry Customer
export const getExpCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=exp`,
    {},
    true,
  );

// Active Customer
export const getActCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=act`,
    {},
    true,
  );

// Online Customer
export const getOnlineCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&line_status=online`,
    {},
    true,
  );

// Suspeneded Customer
export const getSuspendCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=spd`,
    {},
    true,
  );

export const getProvCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=spd`,
    {},
    true,
  );

export const getHoldCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=hld`,
    {},
    true,
  );

export const getDeactiveCustomersListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/new?limit=${limit}&page=${page}&account_status=dct`,
    {},
    true,
  );

//Check renewal date
export const checkRenewalDate = planID =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/check/customer/${planID}/plan/date`, {}, true);

// technician list
export const technicianList = () => getAPI(`${config.REACT_APP_API_URL_HELPDESK}/technician/list`, {}, true);

// Get Work Note
export const getWorkNote = ticketID =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/ticket/${ticketID}/worknote`, {}, true);

// Save Work Note
export const workNotesSave = (ticketID, data) =>
  postAPI(`${config.REACT_APP_API_URL_HELPDESK}/ru/${ticketID}/worknote`, {}, data, true);

// Network Module

//get parent olt
export const parentOLTData = areaID =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/area/olts/for/cpe?area=${areaID}`, {}, true);

// get OLT port
export const OLTPortsData = Id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/oltport/${Id}/filter`, {}, true);

// Get Parent dp
export const parentDpsData = Id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/oltport/parentdps?parent_oltport=${Id}`, {}, true);

// Get Parent Dp Ports
export const parentDpPortsData = Id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/parentdpport/${Id}/filter`, {}, true);

// Get Child dp
export const childDpsData = Id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/oltport/childdps?parent_oltport=${Id}`, {}, true);

// Get Child Dp Ports
export const childDpPortsData = Id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/childdpport/${Id}/filter`, {}, true);

// Dashboard Data

// customer card

export const getCustomerData = Id =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list/count?tabs=act,exp,spd,prov,hld,dct`,
    {},
    true,
  );

// customer card

export const getAnalytics = () =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/analytics/customercard2`, {}, true);

// Payment
export const getPaymentInfo = (start_date, end_date) =>
  getAPI(
    `${config.REACT_APP_API_URL_BILLING}/payment/enh/dashboard?start_date=${start_date}&end_date=${end_date}&`,
    {},
    true,
  );
// Network
export const getNetworkInfo = (start_date, end_date) =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/enh/dashboard?created_end=${end_date}&created=${start_date}`,
    {},
    true,
  );
// Tickets
// Payment

export const getTicketsInfoDash = (start_date, end_date) =>
  getAPI(
    `${config.REACT_APP_API_URL_HELPDESK}/v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&created_date=${start_date}&created_date_end=${end_date}&`,
    {},
    true,
  );
export const getTicketsInfoDashAll = () =>
  getAPI(`${config.REACT_APP_API_URL_HELPDESK}/v2/enh/list/count?tabs=opn,asn,cld,inp,rsl`, {}, true);
// enc

// User Info
export const customerInfoData = (Id, username) =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/360/${Id}/${username}`, {}, true);

// Get Current Plan
export const currentPlanInfoData = Id =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/plan/data/${Id}`, {}, true);

// Upgrade Plan
export const customerUpgradePlan = (areaID, planID) =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/loggedin/${areaID}/speedplans/${planID}`, {}, true);

// Change Plan
export const customerChangePlan = planID =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/plan/data/${planID}`, {}, true);

export const changeOfflinePlanEnc = (data, customerID) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/off/plan/update/${customerID}`, {}, data, true);

// OTP in complaints
export const verifyOTPEnc = data =>
  postAPI(`${config.REACT_APP_API_URL_HELPDESK}/enh/otp/verify`, {}, data, true);

// Expiring Today
export const getExpToday = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?expiry_date=${start_date}&expiry_date_end=${end_date}&limit=${limit}&page=${page}&account_status=act`,
    {},
    true,
  );

// Expired Today
export const getExpiredToday = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?expiry_date=${start_date}&expiry_date_end=${end_date}&limit=${limit}&page=${page}&account_status=exp`,
    {},
    true,
  );

// Activation Today
export const getActivationToday = (start_date, end_date, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?created=${start_date}&created_end=${end_date}&page=${page}`,
    {},
    true,
  );

// Activation Yesterday
export const getActivationYesterday = (start_date, end_date, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?created=${start_date}&created_end=${end_date}&page=${page}`,
    {},
    true,
  );

// Activation Yesterday
export const getExpiredYesterday = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?expiry_date=${start_date}&expiry_date_end=${end_date}&limit=${limit}&page=${page}`,
    {},
    true,
  );

// Expired Next day
export const getExpiredNextDay = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/v3/list?expiry_date=${start_date}&expiry_date_end=${end_date}&limit=${limit}&page=${page}
    `,
    {},
    true,
  );

// Get Traffic Report
export const getTrafficReport = (uid, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/data/${uid}/consumption
    `,
    {},
    true,
  );

export const reconnect = (uid, data) =>
  postAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/radius/revise/${uid}`, {}, data, true);

export const getExpandPayment = date =>
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh/amount/display?date=${date}`, {}, true);

export const walletReloadOff = data =>
  postAPI(`${config.REACT_APP_API_URL_ADMIN}/wallet/deposit/offline`, {}, data, true);

export const getAuthReport = uid =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/enh/auth/report/${uid}`, {}, true);

export const expandUser = date =>
  getAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/users/count?date=${date}`, {}, true);

export const getBillingHistory = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${start_date}&end_date=${end_date}`,
    {},
    true,
  );

export const getBillingHistorySuccess = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${start_date}&end_date=${end_date}&status=1`,
    {},
    true,
  );
export const getBillingHistoryPending = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${start_date}&end_date=${end_date}&status=2`,
    {},
    true,
  );
export const getBillingHistoryFailed = (start_date, end_date, limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${start_date}&end_date=${end_date}&status=3`,
    {},
    true,
  );

export const renewAmountCalculations = (cid, data) =>
  postAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/get/renew/amount/${cid}`, {}, data, true);

export const changeUpgradeAmountCalculations = (cid, data) =>
  postAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/get/update/amount/${cid}`, {}, data, true);

export const checkAmount = (cid, data) =>
  postAPI(`${config.REACT_APP_API_URL_ADMIN}/wallet/walletcheck/${cid}`, {}, data, true);

export const KycCheckAmount = data =>
  postAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/get/create/amount`, {}, data, true);

export const branchList = () => getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/branch/list`, {}, true);

export const filterList = query => getAPI(query, {}, true);

export const paymentMethodList = () =>
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/method/list`, {}, true);

export const takeUp = data =>
  postAPI(`${config.REACT_APP_API_URL_STAFF}/user/takeup/ticket`, {}, data, true);

export const takeUpUpdate = data =>
  patchAPI(`${config.REACT_APP_API_URL_STAFF}/user/takeup/ticket`, {}, data, true);

export const pdfPreviewAPI = data =>
  postAPI(`${config.REACT_APP_API_URL_BILLING}/payment/inv/preview`, {}, data, true);
export const pdfDownloadAPIAPI = data =>
  postAPI(`${config.REACT_APP_API_URL_BILLING}/payment/inv/download`, {}, data, true);

export const getSecurityGroupReports = query => getAPI(query, {}, true);

export const getOLTInfo = id => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/olt`, {}, true);

export const getPDPInfo = id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/parentdp`, {}, true);
export const getCDPInfo = id =>
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/childdp`, {}, true);
export const getCPEInfo = id => getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/get/${id}/cpe`, {}, true);

// Ledger report api
export const getLedgerListData = (limit, page) =>
  getAPI(`${config.REACT_APP_API_URL_ADMIN}/accounts/reports/ledger?limit=${limit}&page=${page}`, {}, true);

// Revenue Reports and invoice reports
export const getRevenueListData = (limit, page, startDate, endDate) =>
  // getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}&start_date=${format(startDate || new Date(), 'yyyy-MM-dd')}&end_date=${
  //   format(endDate || new Date(), 'yyyy-MM-dd') }`, {}, true);
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/enh/list?limit=${limit}&page=${page}`, {}, true);

// Franchise Reports

export const getFranchiseListData = (limit, page) =>
  getAPI(
    `${config.REACT_APP_API_URL_ADMIN}/accounts/reports/franchise?limit=${limit}&page=${page}`,
    {},
    true,
  );


// Overall Nas info
export const getNasLocations = () =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/nas/gis/info`,
    {},
    true,
  );


// Overall Olt info
export const getOltLocations = () =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/olt/gis/info`,
    {},
    true,
  );


// Overall Dp info
export const getPdpLocations = () =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/parentdp/gis/info`,
    {},
    true,
  );

export const getCdpLocations = () =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/childdp/gis/info`,
    {},
    true,
  );

// Overall Cpe info
export const getCpeLocations = () =>
  getAPI(
    `${config.REACT_APP_API_URL_NETWORK}/network/cpes/gis/info`,
    {},
    true,
  );


export const getLeadsAndRegistrationCount = (endDate, createdDate ) => getAPI(
  `/radius/lead/dashboard/v2?created_end=${endDate}&created=${createdDate}`,
  {},
  false,
);
  
export const networkInformation = (serialNo) => 
  getAPI(`${config.REACT_APP_API_URL_NETWORK}/network/search/${serialNo}`, {}, true);
  
  export const extendDaysUpdate = (id,data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/plan/extension/${id}`, {}, data, true);

  export const areaToAreaShifting = (id,data) =>
  patchAPI(`${config.REACT_APP_API_URL_CUSTOMER}/customers/off/areashift/${id}`, {}, data, true);

  export const getPaymentGatewayMethods = id =>
  getAPI(`${config.REACT_APP_API_URL_BILLING}/payment/cstmr/payment/gateways/${id}`, {}, true); // New APi

  export const getFranchiseOptions = () => getAPI(`${config.REACT_APP_API_URL_ADMIN}/franchise/options`, {}, true);