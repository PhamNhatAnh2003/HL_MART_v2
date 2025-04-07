import Home from "./Home";
import Cart from "./Cart/Default";
import Step2 from "./Cart/Step/Step2";
import Step3 from "./Cart/Step/Step3";
import ProductDetail from "./ProductDetail";
import UserInfor from "./UserInfor";
import CategoryProduct from "./CategoryProduct";
import ProductList from "./ProductList";
// import Favorite from "./Favorite";

const user = {
    home: Home,
    productDetail: ProductDetail,
    userInfor: UserInfor,
    categoryProduct: CategoryProduct,
    productList: ProductList,
    cart: Cart,
    step2: Step2,
    step3: Step3,
};

export default user;
