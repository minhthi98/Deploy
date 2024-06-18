
import Login from "../component/layouts/account/Login/Login"
import ForgetPassword from "../component/layouts/account/ForgetPassword/ForgetPassword"
import OTP from "../component/layouts/account/OTP/OTP"
import ResetPassword from "../component/layouts/account/ResetPassword/ResetPassword"
import Home from '../component/layouts/yumhub/Home/Home'

import DefaultLayout from "../component/layouts/defaultLayout/defaultLayout"
import NewMerchant from '../component/layouts/yumhub/NewMerchant/NewMerchant'
import AllMerchant from '../component/layouts/yumhub/AllMerchant/AllMerchant'
import AllVoucher from "../component/layouts/yumhub/AllVoucher/AllVoucher"
import AddVoucher from "../component/layouts/yumhub/AddVoucher/AddVoucher"
import AllShipper from "../component/layouts/yumhub/AllShipper/AllShipper"
import AddShipper from "../component/layouts/yumhub/AddShipper/AddShipper"
import Infomation from "../component/layouts/yumhub/Infomation/Info"
import ChangePassword from "../component/layouts/yumhub/ChangePassword/ChangePassword"
import AllCustomer from "../component/layouts/yumhub/AllCustomer/AllCustomer"
import FoodRequest from "../component/layouts/yumhub/FoodRequest/FoodRequest"
import DeletedShipper from "../component/layouts/yumhub/DeletedShipper/DeletedShipper"
import Employee from "../component/layouts/yumhub/Employee/Employee"
import EmployeeDetails from "../component/layouts/yumhub/Employee/EmployeeDetails"
import AddAdmin from "../component/layouts/yumhub/Employee/AddAdmin"
import DeletedMerchant from "../component/layouts/yumhub/DeletedMerchants/DeletedMerchants"
import Orders from "../component/layouts/yumhub/Order/Order"
import Settings from "../component/layouts/defaultLayout/header/Setting/Setting"



// public routes
const publicRoutes = [
    { path: "/", component: Login, layout: null },
    { path: '/forgetPassword', component: ForgetPassword, layout: null  }, 
    { path: '/otp', component: OTP, layout: null }, 
    { path: '/resetPassword', component: ResetPassword, layout: null }, 

]

const privateRoutes = [
    { path: "/home", component: Home, layout: DefaultLayout },
    { path: "/all-vouchers", component: AllVoucher, layout: DefaultLayout },
    { path: "/add-voucher", component: AddVoucher, layout: DefaultLayout },
    { path: '/new-merchant', component: NewMerchant, layout: DefaultLayout  },
    { path: '/all-merchants', component: AllMerchant, layout: DefaultLayout  },
    { path: '/all-shippers', component: AllShipper, layout: DefaultLayout  },
    { path: '/new-shipper', component: AddShipper, layout: DefaultLayout  },
    { path: '/infomation', component: Infomation, layout: DefaultLayout  },
    { path: '/change-password', component: ChangePassword, layout: DefaultLayout },
    { path: '/all-customers', component: AllCustomer, layout: DefaultLayout },
    { path: '/food-request', component: FoodRequest, layout: DefaultLayout },
    { path: '/deleted-merchants', component: DeletedMerchant, layout: DefaultLayout },

    { path: '/order', component: Orders, layout: DefaultLayout },
    { path: '/deleted-shippers', component: DeletedShipper, layout: DefaultLayout },
    { path: '/employee', component: Employee, layout: DefaultLayout },
    { path: '/employee/:id', component: EmployeeDetails, layout: DefaultLayout },
    { path: '/add-admin', component: AddAdmin, layout: DefaultLayout },
    { path: '/settings', component: Settings, layout: DefaultLayout },
]

export { publicRoutes, privateRoutes } 