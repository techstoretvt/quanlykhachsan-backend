import adminService from '../services/adminService';

const addTypeProduct = async (req, res, next) => {
    try {
        let data = await adminService.addTypeProduct({
            file: req.file,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getAllTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAllTypeProduct();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteTypeProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateTypeProductById = async (req, res, next) => {
    try {
        //call service data
        // let data = await adminService.updateTypeProductById(req.query)
        let data = await adminService.updateTypeProductById({
            file: req.file,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const addTrademark = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.addTrademark(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getAllTrademark = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAllTrademark(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteTrademarkById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteTrademarkById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
const updateTrademarkById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateTrademarkById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createNewProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const cloudinaryUpload = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.cloudinaryUpload({
            files: req.files,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListProductByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListProductByPage(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const blockProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.blockProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const editProductById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editProductById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const editImageProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editImageProduct({
            file: req.file,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const swapImageProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.swapImageProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getProductBySwapAndPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getProductBySwapAndPage(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const addPromotionByIdProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.addPromotionByIdProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const testApi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.testApi();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteErrorProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteErrorProduct(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const confirmBillById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.confirmBillById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const cancelBillById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.cancelBillById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createNewKeyWord = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewKeyWord(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createNotify_noimage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNotify_noimage(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createNotify_image = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNotify_image({
            file: req.file,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const CheckLoginAdminAccessToken = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.CheckLoginAdminAccessToken(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createNewUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createNewUserAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListUserAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const lockUserAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.lockUserAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
const createEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.createEventPromotion(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const upLoadImageCoverPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.upLoadImageCoverPromotion({
            file: req.file,
            query: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListEventPromotion();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const editEventPromotion = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editEventPromotion(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListBillByTypeAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBillByTypeAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateStatusBillAdminWeb = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdminWeb(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListVideoAdminByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListVideoAdminByPage(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteShortVideoAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteShortVideoAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListReportAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListReportAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const skipReportVideoAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.skipReportVideoAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListBlogAdminByPage = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBlogAdminByPage(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteBlogAdminById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteBlogAdminById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListReportBlogAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListReportBlogAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const skipReportBlogAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.skipReportBlogAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getStatisticalAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getStatisticalAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const StatisticalEvaluateAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.StatisticalEvaluateAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getStatisticalSale = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getStatisticalSale(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListKeyWordAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListKeyWordAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const editKeyWordSearchAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.editKeyWordSearchAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteKeyWordAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteKeyWordAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListUserTypeAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListUserTypeAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const deleteEventPromotionAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.deleteEventPromotionAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getCountBillOfMonth = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getCountBillOfMonth(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getMoneyOfMonth = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getMoneyOfMonth(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getDetailBillByIdAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getDetailBillByIdAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getInventoryByTypeProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getInventoryByTypeProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const adminLogin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.adminLogin(req.body, req.headers);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const checkLoginWithAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.checkLoginWithAdmin(
            req.body,
            req.payload
        );

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

//winform
const getListBillNoConfirm = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListBillNoConfirm();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getDetailBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getDetailBillAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListImageProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListImageProductAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getInfoProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getInfoProductAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getClassifyProductAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getClassifyProductAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getAddressBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getAddressBillAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const confirmBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.confirmBillAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateStatusBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateStatusBillAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListStatusBillAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListStatusBillAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

//end winform

//music app
const themCaSi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themCaSi({
            file: req.file,
            data: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDsCaSi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDsCaSi();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const xoaCaSi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.xoaCaSi(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const suaCaSi = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaCaSi(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themBaiHat({
            files: req.files,
            data: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDsBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDsBaiHat();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const xoaBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.xoaBaiHat(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
const suaBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaBaiHat(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const timKiemBaiHatById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.timKiemBaiHatById(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themLoiBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themLoiBaiHat(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListLoiBaiHat = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListLoiBaiHat(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const suaLoiBaiHatById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaLoiBaiHatById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const suaThoiGianBaiHatById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaThoiGianBaiHatById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const xoaLoiBaiHatById = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.xoaLoiBaiHatById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
//end music app


//khach san
const themBaiVietks = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themBaiVietks({
            file: req.file,
            data: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDanhSachBaiViet = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDanhSachBaiViet(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layNoiDungBaiVietKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layNoiDungBaiVietKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};


const suaBaiVietks = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaBaiVietks(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};


const xoaBaiVietks = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.xoaBaiVietks(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themChiNhanhKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themChiNhanhKS(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDanhSachChiNhanhKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDanhSachChiNhanhKS();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themPhongKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themPhongKS(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themAnhPhongKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themAnhPhongKS({
            files: req.files,
            data: req.query,
        });

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDanhSachPhongKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDanhSachPhongKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const datPhongKSAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datPhongKSAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const checkStatusPhongKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.checkStatusPhongKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const huyDatPhongKsAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.huyDatPhongKsAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getInfoKhachHangBySdt = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getInfoKhachHangBySdt(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDisableDateDatPhongKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDisableDateDatPhongKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDatPhongKSTheoThang = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDatPhongKSTheoThang(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const nhanPhongKs = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.nhanPhongKs(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const traPhongKsAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.traPhongKsAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const toggleKhoaPhongKSAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.toggleKhoaPhongKSAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateKhuyenMaiPhongKSAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateKhuyenMaiPhongKSAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const updateThongTinPhongKsAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.updateThongTinPhongKsAdmin(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDatPhongKSAllTheoThang = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDatPhongKSAllTheoThang(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const timKiemPhongKsUser = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.timKiemPhongKsUser(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const datPhongKSLoai1User = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datPhongKSLoai1User(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
const datPhongKSLoai2User = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datPhongKSLoai2User(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const datPhongKSLoai2UserSuccess = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datPhongKSLoai2UserSuccess(req.query);
        if (data.errCode === 0) {
            res.redirect(`${process.env.LINK_FONTEND}/thong-tin-dat-phong/${data.idKhach}`);
        } else {
            return res.status(200).json(data);
        }

    } catch (e) {
        next(e);
    }
};

const datPhongKSLoai3User = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datPhongKSLoai3User(
            {
                file: req.file,
                data: req.query,
            }
        );

        return res.status(200).json(data);

    } catch (e) {
        next(e);
    }
};

const getListDatPhongByIdKhach = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDatPhongByIdKhach(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDatPhongByIdUser = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDatPhongByIdUser(req.query, req.payload);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const guiMaHuyPhongAdmin = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.guiMaHuyPhongAdmin(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const huyPhongByUser = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.huyPhongByUser(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListChuyenKhoanLoai3 = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListChuyenKhoanLoai3(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const huyThanhToanLoai3 = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.huyThanhToanLoai3(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const xacNhanThanhToanLoai3 = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.xacNhanThanhToanLoai3(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};


const themNhanVienKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themNhanVienKS(
            {
                file: req.file,
                data: req.query,
            }
        );

        return res.status(200).json(data);

    } catch (e) {
        next(e);
    }
};


const getListNhanVienKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListNhanVienKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getBangLuongNhanVienKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getBangLuongNhanVienKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListKhachHangKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListKhachHangKS(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themDichVuKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themDichVuKS(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDsDichVu = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDsDichVu(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};


const suaDichVuKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaDichVuKS(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const datDichVuKS = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.datDichVuKS(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themDanhMucKs = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themDanhMucKs(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDanhMucDV = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDanhMucDV(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themDanhMucPhong = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themDanhMucPhong(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const layDSDanhMucPhong = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.layDSDanhMucPhong(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const themKhachHang = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.themKhachHang(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const suaKhachHang = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.suaKhachHang(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const blockHandleSuaPhong = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.blockHandleSuaPhong(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
const unBlockHandleSuaPhong = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.unBlockHandleSuaPhong(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListDichVuByIdDatPhong = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.getListDichVuByIdDatPhong(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const chinhSuaNhanVien = async (req, res, next) => {
    try {
        //call service data
        let data = await adminService.chinhSuaNhanVien(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};



module.exports = {
    addTypeProduct,
    getAllTypeProduct,
    deleteTypeProduct,
    updateTypeProductById,
    addTrademark,
    getAllTrademark,
    deleteTrademarkById,
    updateTrademarkById,
    createNewProduct,
    cloudinaryUpload,
    getListProductByPage,
    blockProduct,
    editProductById,
    editImageProduct,
    swapImageProduct,
    getProductBySwapAndPage,
    addPromotionByIdProduct,
    testApi,
    deleteErrorProduct,
    confirmBillById,
    cancelBillById,
    createNewKeyWord,
    createNotify_noimage,
    createNotify_image,
    CheckLoginAdminAccessToken,
    createNewUserAdmin,
    getListUserAdmin,
    lockUserAdmin,
    createEventPromotion,
    upLoadImageCoverPromotion,
    getListEventPromotion,
    editEventPromotion,
    getListBillByTypeAdmin,
    updateStatusBillAdminWeb,
    getListVideoAdminByPage,
    deleteShortVideoAdmin,
    getListReportAdmin,
    skipReportVideoAdmin,
    getListBlogAdminByPage,
    deleteBlogAdminById,
    getListReportBlogAdmin,
    skipReportBlogAdmin,
    getStatisticalAdmin,
    StatisticalEvaluateAdmin,
    getStatisticalSale,
    getListKeyWordAdmin,
    editKeyWordSearchAdmin,
    deleteKeyWordAdmin,
    getListUserTypeAdmin,
    deleteEventPromotionAdmin,
    getCountBillOfMonth,
    getMoneyOfMonth,
    getDetailBillByIdAdmin,
    getInventoryByTypeProduct,
    adminLogin,
    checkLoginWithAdmin,

    //music app
    themCaSi,
    layDsCaSi,
    xoaCaSi,
    suaCaSi,
    themBaiHat,
    layDsBaiHat,
    xoaBaiHat,
    suaBaiHat,
    timKiemBaiHatById,
    themLoiBaiHat,
    getListLoiBaiHat,
    suaLoiBaiHatById,
    suaThoiGianBaiHatById,
    xoaLoiBaiHatById,

    //and music app

    //winform
    getListBillNoConfirm,
    getDetailBillAdmin,
    getListImageProductAdmin,
    getInfoProductAdmin,
    getClassifyProductAdmin,
    getAddressBillAdmin,
    confirmBillAdmin,
    updateStatusBillAdmin,
    getListStatusBillAdmin,
    //end winform


    //khach san
    themBaiVietks,
    layDanhSachBaiViet,
    suaBaiVietks,
    xoaBaiVietks,
    layNoiDungBaiVietKS,
    themChiNhanhKS,
    layDanhSachChiNhanhKS,
    themPhongKS,
    themAnhPhongKS,
    layDanhSachPhongKS,
    datPhongKSAdmin,
    checkStatusPhongKS,
    huyDatPhongKsAdmin,
    getInfoKhachHangBySdt,
    getListDisableDateDatPhongKS,
    getListDatPhongKSTheoThang,
    nhanPhongKs,
    traPhongKsAdmin,
    toggleKhoaPhongKSAdmin,
    updateKhuyenMaiPhongKSAdmin,
    updateThongTinPhongKsAdmin,
    getListDatPhongKSAllTheoThang,
    timKiemPhongKsUser,
    datPhongKSLoai1User,
    datPhongKSLoai2User,
    datPhongKSLoai2UserSuccess,
    datPhongKSLoai3User,
    getListDatPhongByIdKhach,
    getListDatPhongByIdUser,
    guiMaHuyPhongAdmin,
    huyPhongByUser,
    getListChuyenKhoanLoai3,
    huyThanhToanLoai3,
    xacNhanThanhToanLoai3,
    themNhanVienKS,
    getListNhanVienKS,
    getBangLuongNhanVienKS,
    getListKhachHangKS,
    themDichVuKS,
    layDsDichVu,
    suaDichVuKS,
    datDichVuKS,
    themDanhMucKs,
    getListDanhMucDV,
    themDanhMucPhong,
    layDSDanhMucPhong,
    themKhachHang,
    suaKhachHang,
    blockHandleSuaPhong,
    unBlockHandleSuaPhong,
    getListDichVuByIdDatPhong,
    chinhSuaNhanVien
};
