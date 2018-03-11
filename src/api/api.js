import fetch from './fetch.js'
import apiConfig from './apiConfig.js'

var sysUser = require("./content/sysUser");
var sysRole = require("./content/sysRole");
var sysMenu = require("./content/sysMenu");
var sysResource = require("./content/sysResource");
var sysParam = require("./content/sysParam");
var cusCustomer = require("./content/customer");
var address = require("./content/address");
var cloudWare = require("./content/cloudWare");
var authWH    = require("./content/authWH");
var logistics = require("./content/logistics");
var order = require("./content/order");
var wms = require("./content/wms");
var sysMemer = require("./content/member");
var stock = require("./content/stock");
var ioStock = require("./content/ioStock");
var b2b = require("./content/B2B");
var invoice = require("./content/wbInvoice");

const login = params => {
  return fetch({
    url: apiConfig.LOGIN,
    method: 'post',
    data: params
  })
}

export const getBizProfile = params => {
  return fetch({
    url: apiConfig.BIZ_PROFILE,
    method: 'get',
  })
}

const doUserSave = sysUser.doUserSave;
const doUserList = sysUser.doUserList;
const doUserDel  = sysUser.doUserDel;
const doUserInfo  = sysUser.doUserInfo;
const doUserRoles = sysUser.doUserRoles;
const doBindRoles = sysUser.doBindRoles;
const doUserRoleInfo = sysUser.doUserRoleInfo;
const doResetPwd = sysUser.doResetPwd;
const doResetPwdLogin = sysUser.doResetPwdLogin;

const doRoleList = sysRole.doRoleList;
const doRoleInfo = sysRole.doRoleInfo;
const doRoleDel  = sysRole.doRoleDel;
const doRoleSave  = sysRole.doRoleSave;
const doRoleMenu  = sysRole.doRoleMenu;

const doRoleBindMenu = sysRole.doRoleBindMenu;
const doRoleMenuById = sysRole.doRoleMenuById;

const doMenuAll   = sysMenu.doMenuAll;
const doMenuInfo  = sysMenu.doMenuInfo;
const doMenuDel   = sysMenu.doMenuDel;
const doMenuSave  = sysMenu.doMenuSave;

const doResourceList = sysResource.doResourceList;
const doResourceSave = sysResource.doResourceSave;
const doResourceDel  = sysResource.doResourceDel;

const doParamList = sysParam.doParamList;
const doParamInfo = sysParam.doParamInfo;
const doParamDel  = sysParam.doParamDel;
const doParamSave  = sysParam.doParamSave;
const getParamCategory  = sysParam.getParamCategory;

const doCustomerList = cusCustomer.doCustomerList;
const doCustomerSave = cusCustomer.doCustomerSave;
const doCustomerDel  = cusCustomer.doCustomerDel;
const doCustomerInfo = cusCustomer.doCustomerInfo;
const doMemberSave   = cusCustomer.doMemberSave;
const doCustomerWarehouseList = cusCustomer.doCustomerWarehouseList;

const doAddressList = address.doAddressList;
const doAddressSave = address.doAddressSave;
const doAddressDel  = address.doAddressDel;
const doAddressInfo = address.doAddressInfo;
const doReceiverAddressList = address.doReceiverAddressList;


const doCloudWareSave  = cloudWare.doCloudWareSave;
const doCloudWareList  = cloudWare.doCloudWareList;
const doCloudWareDel   = cloudWare.doCloudWareDel;
const doCloudWarehouseInfo = cloudWare.doCloudWarehouseInfo;
const doWhCustomerList = cloudWare.doWhCustomerList;
const doCloudWarehouseList = cloudWare.doCloudWarehouseList;
const doWhOwnerCodeList = cloudWare.doWhOwnerCodeList;

const doAuthWhList     = authWH.doAuthWhList;
const doWarehouseCustomerUnSelectList = authWH.doWarehouseCustomerUnSelectList;
const doWhBindCus = authWH.doWhBindCus;
const doWhOwnerSelectList = authWH.doWhOwnerSelectList;
const doWareBindDel = authWH.doWareBindDel;
const doWarehouseCustomerSelectList = authWH.doWarehouseCustomerSelectList;

const doWaybillTrace = logistics.doWaybillTrace;
const doWaybillList = logistics.doWaybillList;
const updatePackageNumber = logistics.updatePackageNumber;
const updateWaybillInfo = logistics.updateWaybillInfo;
const getWaybillInfo = logistics.getWaybillInfo;
const getPickupList = logistics.getPickupList;doPickupOrder
const doPickupOrder = logistics.doPickupOrder;
const doWaybillSend = logistics.doWaybillSend;
const doPickupConfirm = logistics.doPickupConfirm;
const doWaybillPrint = logistics.doWaybillPrint;
const generatePdf = logistics.generatePdf;
const getStockOutDetails = logistics.getStockOutDetails;

const doOrderList = order.doOrderList;
const doOrderSave = order.doOrderSave;
const doOrderDel  = order.doOrderDel;
const doOrderInfo = order.doOrderInfo;
const doOrderDetailsDistributionInfo = order.doOrderDetailsDistributionInfo;
const doOrderDetailsDistributionSave = order.doOrderDetailsDistributionSave;
const doOrderDistributionInfo = order.doOrderDistributionInfo;
const doOrderDistrbutionList = order.doOrderDistrbutionList;
const doDistributionInfo = order.doDistributionInfo;
const doOrderAction = order.doOrderAction;
const doStockOut = order.doStockOut;
const checkExtOrderCode = order.checkExtOrderCode;
const doOrderInfoByCode = order.doOrderInfoByCode;
const doCancellDistributionInfo = order.doCancellDistributionInfo;
const addDistributionInfoByOrderId = order.addDistributionInfoByOrderId;
const doMyCancellRequestOrderDistrbutionList = order.doMyCancellRequestOrderDistrbutionList;
const doCancellRequestOrderDistrbutionList = order.doCancellRequestOrderDistrbutionList;
const saveDistributionCheckResult = order.saveDistributionCheckResult;

const getAllMedicineList = wms.getAllMedicineList;
const getMedicineStock = wms.getMedicineStock;
const searchMedicineStock = wms.searchMedicineStock;

const doMemberList = sysMemer.doMemberList;
const doMemberUserSave = sysMemer.doMemberUserSave;
const doMemberDel = sysMemer.doMemberDel;
const doMemberRoles = sysMemer.doMemberRoles;
const doMemberRolesBind = sysMemer.doMemberRolesBind;
const doMemberInfo = sysMemer.doMemberInfo;

const doStockList = stock.doStockList;
const doDistributeList = stock.doDistributeList;
const doWareHouseSelectList = stock.doWareHouseSelectList;
const doIoStockList = ioStock.doIoStockList;
const doIoStockDetailList = ioStock.doIoStockDetailList;
const getStockInOutDetails = stock.getStockInOutDetails;

const doB2BList = b2b.doB2BList;
const doSelectCompanyList = b2b.doSelectCompanyList;
const doBindCus = b2b.doBindCus;
const getUserRequestDetails = b2b.getUserRequestDetails;

const doWbInvoiceList = invoice.doWbInvoiceList;
const doDelInvoice  = invoice.doDelInvoice;
const doInvoiceSave = invoice.doInvoiceSave;


const doLogiticsList = logistics.doLogiticsList;
const doLogisticsSave = logistics.doLogisticsSave;
const doLogisticsDel = logistics.doLogisticsDel;

const apiList = {
  login,getBizProfile,
  doUserSave,doUserList,doUserDel,doUserInfo,doUserRoles,doBindRoles,doUserRoleInfo,doResetPwd,doResetPwdLogin,
  doRoleList, doRoleInfo, doRoleDel,doRoleSave,doRoleMenu,
  doRoleBindMenu,doRoleMenuById,
  doMenuAll, doMenuInfo, doMenuDel,doMenuSave,
  doResourceList,doResourceSave,doResourceDel,
  doParamList,doParamInfo,doParamDel,doParamSave,getParamCategory,
  doAddressList,doAddressSave,doAddressDel,doAddressInfo,doReceiverAddressList,
  doCustomerList,doCustomerSave,doCustomerDel,doCustomerInfo,doMemberSave,
  doWarehouseCustomerSelectList,doCustomerWarehouseList,
  doCloudWareSave,doCloudWareList,doCloudWareDel,doWhCustomerList,doCloudWarehouseList,doCloudWarehouseInfo,doWhOwnerCodeList,doWareBindDel,
  doAuthWhList,doWarehouseCustomerUnSelectList,doWhBindCus,doWaybillTrace,doWaybillList,updatePackageNumber,updateWaybillInfo,getWaybillInfo,
  getPickupList,doPickupOrder,doWaybillSend,doPickupConfirm,doWaybillPrint,getStockOutDetails,generatePdf,

  doOrderList,doOrderSave,doOrderDel,doOrderInfo,doOrderDetailsDistributionInfo,doOrderDetailsDistributionSave,doOrderDistributionInfo,
  doOrderDistributionInfo,doOrderDistrbutionList,doDistributionInfo,doOrderAction,doStockOut,checkExtOrderCode,doOrderInfoByCode,
  doCancellDistributionInfo,addDistributionInfoByOrderId,doCancellRequestOrderDistrbutionList,doMyCancellRequestOrderDistrbutionList,
  getAllMedicineList,getMedicineStock,searchMedicineStock,saveDistributionCheckResult,
  doMemberList,doMemberUserSave,doMemberDel,doMemberRoles,doMemberRolesBind,doMemberInfo,
  doStockList,doDistributeList,doWareHouseSelectList,doIoStockList,doIoStockDetailList,getStockInOutDetails,
  doB2BList,doSelectCompanyList,doBindCus,doWbInvoiceList,doDelInvoice,doInvoiceSave,getUserRequestDetails,
  doLogiticsList,doLogisticsSave,doLogisticsDel,doWhOwnerSelectList,
}


export default apiList



