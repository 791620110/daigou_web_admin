import dashboard from "../pages/dashboard.vue";
import NotFoundView from "../components/404.vue";
import menuList from "../pages/sys/menu.vue";
import role from "../pages/sys/role.vue";
import resource from "../pages/sys/resource.vue";
import login from "../pages/login.vue";
import app from "../App.vue";
import sysUser from "../pages/sys/user.vue";
import resetPwd from "../pages/resetPwd.vue";
//import customerList from "../pages/customer/customerList.vue";
// import cloudWarehouse from "../pages/warehouse/cloudWarehouse.vue";
// import cusAuditing from "../pages/customer/cusAuditing.vue";
// import member from "../pages/base/member.vue";
// import address from "../pages/base/address.vue";
// import logistics from "../pages/base/logistics.vue";
//import wbInvoice from "../pages/base/wbInvoice.vue";
//import warehourseCustomer from "../pages/warehouse/warehourseCustomer.vue";
const customerList = () => import('../pages/customer/customerList.vue')
const cloudWarehouse = () => import('../pages/warehouse/cloudWarehouse.vue')
const cusAuditing = () => import('../pages/customer/cusAuditing.vue')
const member = () => import('../pages/base/member.vue')
const address = () => import('../pages/base/address.vue')
const logistics = () => import('../pages/base/logistics.vue')
const wbInvoice = () => import('../pages/base/wbInvoice.vue')
const warehourseCustomer = () => import('../pages/warehouse/warehourseCustomer.vue')
//import orderList from "../pages/order/orderList.vue";
// import order from "../pages/order/order.vue";
// import confirmedOrderList from "../pages/order/confirmedOrderList.vue";
// import distributedOrderList from "../pages/order/distributedOrderList.vue";
// import recallOrderList from "../pages/order/recallOrderList.vue";
// import recallOrderCheckList from "../pages/order/recallOrderCheckList.vue";
const orderList = () => import('../pages/order/orderList.vue')
const order = () => import('../pages/order/order.vue')
const confirmedOrderList = () => import('../pages/order/confirmedOrderList.vue')
const distributedOrderList = () => import('../pages/order/distributedOrderList.vue')
const recallOrderList = () => import('../pages/order/recallOrderList.vue')
const recallOrderCheckList = () => import('../pages/order/recallOrderCheckList.vue')
//import deliveryorder from "../pages/order/deliveryorder.vue"
//import B2B from "../pages/order/B2B.vue";
//import wHOrderList from "../pages/order/recOrderList.vue";
//import batchorder from "../pages/order/batchorder.vue";
//import ordertimeline from "../pages/order/ordertimeline.vue"
//import allOrderList from "../pages/order/allOrderList.vue";
//import readyOrderList from "../pages/order/readyOrderList.vue";
//import recOrderList from "../pages/order/recOrderList.vue";
//import sucOrderList from "../pages/order/sucOrderList.vue";
// import params from "../pages/sys/params.vue";
// import transportList from  "../pages/transport/transportList.vue";
// import transportAdd from  "../pages/transport/transportAdd.vue";
// import medicineList from "../pages/medicine/medicineList.vue";
// import accountInfo from "../pages/account/accountInfo.vue";
// import chamberList from "../pages/chamber/chamberList.vue";
// import medFactoryList from "../pages/medFactory/medFactoryList.vue";

const params = () => import('../pages/sys/params.vue')
const transportList = () => import('../pages/transport/transportList.vue')
const transportAdd = () => import('../pages/transport/transportAdd.vue')
const medicineList = () => import('../pages/medicine/medicineList.vue')
const accountInfo = () => import('../pages/account/accountInfo.vue')
const chamberList = () => import('../pages/chamber/chamberList.vue')
const medFactoryList = () => import('../pages/medFactory/medFactoryList.vue')

// import wbPrint from "../pages/waybill/wbPrint.vue";
// import wbTrace from "../pages/waybill/wbTrace.vue";
// import wbReceiving from "../pages/waybill/wbReceiving.vue";
// import wbSendOut from "../pages/waybill/wbSendOut.vue";
// import wbDelivery from "../pages/waybill/wbDelivery.vue";
// import stockList from "../pages/stock/stockList.vue";
// import ioStockList from "../pages/stock/ioStockList.vue";


const wbPrint = () => import('../pages/waybill/wbPrint.vue')
const wbTrace = () => import('../pages/waybill/wbTrace.vue')
const wbReceiving = () => import('../pages/waybill/wbReceiving.vue')
const wbSendOut = () => import('../pages/waybill/wbSendOut.vue')
const wbDelivery = () => import('../pages/waybill/wbDelivery.vue')
const stockList = () => import('../pages/stock/stockList.vue')
const ioStockList = () => import('../pages/stock/ioStockList.vue')

// Routes
const routes = [
  {path: '/login', component: login},
  {path: '/test', component: app, children: [{path: '*', component: NotFoundView}]},
  {
    path: '', component: app, children: [
    {path: '/resetPwd', component: resetPwd},
    {path: '/index', component: dashboard},
    {path: '/sys/menuList', component: menuList},
    {path: '/sys/roleList', component: role},
    {path: '/sys/userList', component: sysUser},
    {path: '/sys/resourceList', component: resource},
    {path: '/wareHouse/cloudWarehouse', component: cloudWarehouse},
    {path: '/customer/customerList', component: customerList},
    {path: '/customer/cusAuditing', component: cusAuditing},
    {path: '/base/member', component: member},
    {path: '/base/address', component: address},
    {path: '/base/logistics', component: logistics},
    {path: '/base/wbInvoice', component: wbInvoice},
    {path: '/wareHouse/warehourseCustomer', component: warehourseCustomer},
    {path: '/sys/params', component: params},


    {path: '/order/orderList', component: orderList},
    {path: '/order/confirmedOrderList', component: confirmedOrderList},
    {path: '/order/distributedOrderList', component: distributedOrderList},
    {path: '/order/order', component: order},
    {path: '/order/recallOrderList', component: recallOrderList},
    {path: '/order/recallOrderCheckList', component: recallOrderCheckList},
    {path: '/transport/transportList', component: transportList},
    {path: '/transport/transportAdd', component: transportAdd},
    {path: '/medicine/medicineList', component: medicineList},
    {path: '/account/accountInfo', component: accountInfo},

    {path: '/chamber/chamberList', component: chamberList},
    {path: '/medFactory/medFactoryList', component: medFactoryList},
    {path: '/waybill/wbPrint', component: wbPrint},
    {path: '/waybill/wbTrace', component: wbTrace},
    {path: '/waybill/wbSendOut', component: wbSendOut},
    {path: '/waybill/wbDelivery', component: wbDelivery},
    {path: '/waybill/wbReceiving', component: wbReceiving},

    {path: '/stock/stockList', component: stockList},
    {path: '/stock/ioStockList', component: ioStockList},
  ]
  },

  {path: '*', component: NotFoundView}
]


export default routes

