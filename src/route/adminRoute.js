import express from 'express';
import adminController from '../controllers/adminController';
import multer from 'multer';
import path from 'path';
import { routes } from '../services/commont';
import { verifyAccessTokenAdmin, verifyAccessToken } from '../helpers/JWT_service';

const fileUploader = require('../config/cloudinary.config');
import cloudinary_product from '../utils/cloudinary/cloudinary_product';
import cloudinary_typePoduct from '../utils/cloudinary/cloudinary_typeProduct';
import cloudinary_notify from '../utils/cloudinary/cloudinary_notify';
import cloudinary_eventPromotion from '../utils/cloudinary/cloudinary_eventPromotion';
import cloudinary_music from '../utils/cloudinary/cloudinary_musicapp';
import cloudinary_khachsan from '../utils/cloudinary/cloudinary_qlkhachsan'

let router = express.Router();

let appRoot = require('app-root-path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/videoTam/');
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

let upload = multer({
    storage,
    limits: { fileSize: 104857600 },
});

const initAdminRoute = (app) => {
    //admin api
    router.get(routes.getAllTypeProduct, adminController.getAllTypeProduct);
    router.get(
        routes.getAllTrademark,
        verifyAccessTokenAdmin,
        adminController.getAllTrademark
    );
    router.get(
        routes.getListProductByPage,
        verifyAccessTokenAdmin,
        adminController.getListProductByPage
    );
    router.get(
        routes.getProductBySwapAndPage,
        verifyAccessTokenAdmin,
        adminController.getProductBySwapAndPage
    );
    router.get(
        routes.getListUserAdmin,
        verifyAccessTokenAdmin,
        adminController.getListUserAdmin
    );
    router.get(
        routes.getListEventPromotion,
        verifyAccessTokenAdmin,
        adminController.getListEventPromotion
    );
    router.get(
        routes.getListBillByTypeAdmin,
        verifyAccessTokenAdmin,
        adminController.getListBillByTypeAdmin
    );
    router.get(
        routes.getListVideoAdminByPage,
        verifyAccessTokenAdmin,
        adminController.getListVideoAdminByPage
    );
    router.get(
        routes.getListReportAdmin,
        verifyAccessTokenAdmin,
        adminController.getListReportAdmin
    );
    router.get(
        routes.getListBlogAdminByPage,
        verifyAccessTokenAdmin,
        adminController.getListBlogAdminByPage
    );
    router.get(
        routes.getListReportBlogAdmin,
        verifyAccessTokenAdmin,
        adminController.getListReportBlogAdmin
    );
    router.get(
        routes.getStatisticalAdmin,
        verifyAccessTokenAdmin,
        adminController.getStatisticalAdmin
    );
    router.get(
        routes.StatisticalEvaluateAdmin,
        verifyAccessTokenAdmin,
        adminController.StatisticalEvaluateAdmin
    );
    router.get(
        routes.getStatisticalSale,
        verifyAccessTokenAdmin,
        adminController.getStatisticalSale
    );
    router.get(
        routes.getListKeyWordAdmin,
        verifyAccessTokenAdmin,
        adminController.getListKeyWordAdmin
    );
    router.get(
        routes.getListUserTypeAdmin,
        verifyAccessTokenAdmin,
        adminController.getListUserTypeAdmin
    );
    router.get(
        routes.getCountBillOfMonth,
        verifyAccessTokenAdmin,
        adminController.getCountBillOfMonth
    );
    router.get(
        routes.getMoneyOfMonth,
        verifyAccessTokenAdmin,
        adminController.getMoneyOfMonth
    );
    router.get(
        routes.getDetailBillByIdAdmin,
        verifyAccessTokenAdmin,
        adminController.getDetailBillByIdAdmin
    );
    router.get(
        routes.getInventoryByTypeProduct,
        verifyAccessTokenAdmin,
        adminController.getInventoryByTypeProduct
    );
    router.get(
        routes.layDsCaSi,
        verifyAccessTokenAdmin,
        adminController.layDsCaSi
    );
    router.get(
        routes.layDsBaiHat,
        verifyAccessTokenAdmin,
        adminController.layDsBaiHat
    );
    router.get(
        routes.timKiemBaiHatById,
        adminController.timKiemBaiHatById
    );

    router.get(
        routes.getListLoiBaiHat,
        adminController.getListLoiBaiHat
    );

    //winform
    router.get(
        routes.getListBillNoConfirm,
        verifyAccessTokenAdmin,
        adminController.getListBillNoConfirm
    );
    router.get(
        routes.getDetailBillAdmin,
        verifyAccessTokenAdmin,
        adminController.getDetailBillAdmin
    );
    router.get(
        routes.getListImageProductAdmin,
        verifyAccessTokenAdmin,
        adminController.getListImageProductAdmin
    );
    router.get(
        routes.getInfoProductAdmin,
        verifyAccessTokenAdmin,
        adminController.getInfoProductAdmin
    );
    router.get(
        routes.getClassifyProductAdmin,
        verifyAccessTokenAdmin,
        adminController.getClassifyProductAdmin
    );
    router.get(
        routes.getAddressBillAdmin,
        verifyAccessTokenAdmin,
        adminController.getAddressBillAdmin
    );
    router.get(
        routes.confirmBillAdmin,
        verifyAccessTokenAdmin,
        adminController.confirmBillAdmin
    );
    router.get(
        routes.updateStatusBillAdmin,
        verifyAccessTokenAdmin,
        adminController.updateStatusBillAdmin
    );
    router.get(
        routes.getListStatusBillAdmin,
        verifyAccessTokenAdmin,
        adminController.getListStatusBillAdmin
    );
    //end winform

    router.post(
        routes.addTrademark,
        verifyAccessTokenAdmin,
        adminController.addTrademark
    );
    router.post(
        routes.addTypeProduct,
        verifyAccessTokenAdmin,
        cloudinary_typePoduct.single('file'),
        adminController.addTypeProduct
    );
    router.post(
        routes.cloudinaryUpload,
        verifyAccessTokenAdmin,
        cloudinary_product.array('file'),
        adminController.cloudinaryUpload
    );
    router.post(
        routes.createNewProduct,
        verifyAccessTokenAdmin,
        adminController.createNewProduct
    );
    router.post(
        routes.addPromotionByIdProduct,
        verifyAccessTokenAdmin,
        adminController.addPromotionByIdProduct
    );
    router.post(
        routes.swapImageProduct,
        verifyAccessTokenAdmin,
        adminController.swapImageProduct
    );
    router.post(
        routes.createNewKeyWord,
        verifyAccessTokenAdmin,
        adminController.createNewKeyWord
    );
    router.post(
        routes.createNotify_noimage,
        verifyAccessTokenAdmin,
        adminController.createNotify_noimage
    );
    router.post(
        routes.createNotify_image,
        verifyAccessTokenAdmin,
        cloudinary_notify.single('file'),
        adminController.createNotify_image
    );
    router.post(
        routes.CheckLoginAdminAccessToken,
        verifyAccessTokenAdmin,
        adminController.CheckLoginAdminAccessToken
    );
    router.post(
        routes.createNewUserAdmin,
        verifyAccessTokenAdmin,
        adminController.createNewUserAdmin
    );
    router.post(
        routes.createEventPromotion,
        verifyAccessTokenAdmin,
        adminController.createEventPromotion
    );
    router.post(
        routes.upLoadImageCoverPromotion,
        verifyAccessTokenAdmin,
        cloudinary_eventPromotion.single('file'),
        adminController.upLoadImageCoverPromotion
    );
    router.post(routes.adminLogin, adminController.adminLogin);
    router.post(
        routes.checkLoginWithAdmin,
        verifyAccessTokenAdmin,
        adminController.checkLoginWithAdmin
    );
    router.post(
        routes.themCaSi,
        verifyAccessTokenAdmin,
        cloudinary_music.single('file'),
        adminController.themCaSi
    );
    router.post(
        routes.themBaiHat,
        verifyAccessTokenAdmin,
        cloudinary_music.array('file'),
        adminController.themBaiHat
    );

    router.post(
        routes.themLoiBaiHat,
        verifyAccessTokenAdmin,
        adminController.themLoiBaiHat
    );




    router.put(
        routes.confirmBillById,
        verifyAccessTokenAdmin,
        adminController.confirmBillById
    );
    router.put(
        routes.cancelBillById,
        verifyAccessTokenAdmin,
        adminController.cancelBillById
    );
    router.put(
        routes.updateTypeProductById,
        verifyAccessTokenAdmin,
        cloudinary_typePoduct.single('file'),
        adminController.updateTypeProductById
    );
    router.put(
        routes.updateTrademarkById,
        verifyAccessTokenAdmin,
        adminController.updateTrademarkById
    );
    router.put(
        routes.editProductById,
        verifyAccessTokenAdmin,
        adminController.editProductById
    );
    router.put(
        routes.blockProduct,
        verifyAccessTokenAdmin,
        adminController.blockProduct
    );
    router.put(
        routes.editImageProduct,
        verifyAccessTokenAdmin,
        cloudinary_product.single('file'),
        adminController.editImageProduct
    );
    router.put(
        routes.lockUserAdmin,
        verifyAccessTokenAdmin,
        adminController.lockUserAdmin
    );
    router.put(
        routes.editEventPromotion,
        verifyAccessTokenAdmin,
        adminController.editEventPromotion
    );
    router.put(
        routes.updateStatusBillAdminWeb,
        verifyAccessTokenAdmin,
        adminController.updateStatusBillAdminWeb
    );
    router.put(
        routes.skipReportVideoAdmin,
        verifyAccessTokenAdmin,
        adminController.skipReportVideoAdmin
    );
    router.put(
        routes.skipReportBlogAdmin,
        verifyAccessTokenAdmin,
        adminController.skipReportBlogAdmin
    );
    router.put(
        routes.editKeyWordSearchAdmin,
        verifyAccessTokenAdmin,
        adminController.editKeyWordSearchAdmin
    );

    router.put(routes.suaCaSi, verifyAccessTokenAdmin, adminController.suaCaSi);
    router.put(
        routes.suaBaiHat,
        verifyAccessTokenAdmin,
        adminController.suaBaiHat
    );
    router.put(
        routes.suaLoiBaiHatById,
        verifyAccessTokenAdmin,
        adminController.suaLoiBaiHatById
    );

    router.put(
        routes.suaThoiGianBaiHatById,
        verifyAccessTokenAdmin,
        adminController.suaThoiGianBaiHatById
    );

    router.delete(
        routes.deleteTypeProduct,
        verifyAccessTokenAdmin,
        adminController.deleteTypeProduct
    );
    router.delete(
        routes.deleteTrademarkById,
        verifyAccessTokenAdmin,
        adminController.deleteTrademarkById
    );
    router.delete(
        routes.deleteErrorProduct,
        verifyAccessTokenAdmin,
        adminController.deleteErrorProduct
    );
    router.delete(
        routes.deleteShortVideoAdmin,
        verifyAccessTokenAdmin,
        adminController.deleteShortVideoAdmin
    );
    router.delete(
        routes.deleteBlogAdminById,
        verifyAccessTokenAdmin,
        adminController.deleteBlogAdminById
    );
    router.delete(
        routes.deleteKeyWordAdmin,
        verifyAccessTokenAdmin,
        adminController.deleteKeyWordAdmin
    );
    router.delete(
        routes.deleteEventPromotionAdmin,
        verifyAccessTokenAdmin,
        adminController.deleteEventPromotionAdmin
    );
    router.delete(
        routes.xoaCaSi,
        verifyAccessTokenAdmin,
        adminController.xoaCaSi
    );
    router.delete(
        routes.xoaBaiHat,
        verifyAccessTokenAdmin,
        adminController.xoaBaiHat
    );

    router.delete(
        routes.xoaLoiBaiHatById,
        verifyAccessTokenAdmin,
        adminController.xoaLoiBaiHatById
    );



    //khach san
    router.post(
        routes.themBaiVietks,
        verifyAccessTokenAdmin,
        cloudinary_khachsan.single('file'),
        adminController.themBaiVietks
    );

    router.get(
        routes.layDanhSachBaiViet,
        adminController.layDanhSachBaiViet
    );

    router.get(
        routes.layNoiDungBaiVietKS,
        adminController.layNoiDungBaiVietKS
    );

    router.put(
        routes.suaBaiVietks,
        verifyAccessTokenAdmin,
        adminController.suaBaiVietks
    );

    router.delete(
        routes.xoaBaiVietks,
        verifyAccessTokenAdmin,
        adminController.xoaBaiVietks
    );

    router.post(
        routes.themChiNhanhKS,
        verifyAccessTokenAdmin,
        adminController.themChiNhanhKS
    );

    router.get(
        routes.layDanhSachChiNhanhKS,
        adminController.layDanhSachChiNhanhKS
    );


    router.post(
        routes.themPhongKS,
        verifyAccessTokenAdmin,
        adminController.themPhongKS
    );

    router.post(
        routes.themAnhPhongKS,
        verifyAccessTokenAdmin,
        cloudinary_khachsan.array('file'),
        adminController.themAnhPhongKS
    );

    router.get(
        routes.layDanhSachPhongKS,
        adminController.layDanhSachPhongKS
    );

    router.post(
        routes.datPhongKSAdmin,
        verifyAccessTokenAdmin,
        adminController.datPhongKSAdmin
    );

    router.get(
        routes.checkStatusPhongKS,
        adminController.checkStatusPhongKS
    );

    router.put(
        routes.huyDatPhongKsAdmin,
        verifyAccessTokenAdmin,
        adminController.huyDatPhongKsAdmin
    );

    router.get(
        routes.getInfoKhachHangBySdt,
        adminController.getInfoKhachHangBySdt
    );

    router.get(
        routes.getListDisableDateDatPhongKS,
        adminController.getListDisableDateDatPhongKS
    );

    router.get(
        routes.getListDatPhongKSTheoThang,
        adminController.getListDatPhongKSTheoThang
    );

    router.put(
        routes.nhanPhongKs,
        verifyAccessTokenAdmin,
        adminController.nhanPhongKs
    );

    router.put(
        routes.traPhongKsAdmin,
        verifyAccessTokenAdmin,
        adminController.traPhongKsAdmin
    );


    router.put(
        routes.toggleKhoaPhongKSAdmin,
        verifyAccessTokenAdmin,
        adminController.toggleKhoaPhongKSAdmin
    );

    router.put(
        routes.updateKhuyenMaiPhongKSAdmin,
        verifyAccessTokenAdmin,
        adminController.updateKhuyenMaiPhongKSAdmin
    );

    router.put(
        routes.updateThongTinPhongKsAdmin,
        verifyAccessTokenAdmin,
        adminController.updateThongTinPhongKsAdmin
    );

    router.get(
        routes.getListDatPhongKSAllTheoThang,
        adminController.getListDatPhongKSAllTheoThang
    );

    router.get(
        routes.timKiemPhongKsUser,
        adminController.timKiemPhongKsUser
    );

    router.post(
        routes.datPhongKSLoai1User,
        adminController.datPhongKSLoai1User
    );

    router.post(
        routes.datPhongKSLoai2User,
        adminController.datPhongKSLoai2User
    );
    router.get(
        routes.datPhongKSLoai2UserSuccess,
        adminController.datPhongKSLoai2UserSuccess
    );

    router.get(
        routes.getListDatPhongByIdKhach,
        adminController.getListDatPhongByIdKhach
    );

    router.get(
        routes.getListDatPhongByIdUser,
        verifyAccessToken,
        adminController.getListDatPhongByIdUser
    );

    router.get(
        routes.getListDatPhongByIdKhach,
        adminController.getListDatPhongByIdKhach
    );

    router.get(
        routes.guiMaHuyPhongAdmin,
        adminController.guiMaHuyPhongAdmin
    );

    router.put(
        routes.huyPhongByUser,
        adminController.huyPhongByUser
    );

    router.post(
        routes.datPhongKSLoai3User,
        cloudinary_khachsan.single('file'),
        adminController.datPhongKSLoai3User
    );

    router.get(
        routes.getListChuyenKhoanLoai3,
        adminController.getListChuyenKhoanLoai3
    );

    router.put(
        routes.huyThanhToanLoai3,
        verifyAccessTokenAdmin,
        adminController.huyThanhToanLoai3
    );

    router.put(
        routes.xacNhanThanhToanLoai3,
        verifyAccessTokenAdmin,
        adminController.xacNhanThanhToanLoai3
    );

    router.post(
        routes.themNhanVienKS,
        verifyAccessTokenAdmin,
        cloudinary_khachsan.single('file'),
        adminController.themNhanVienKS
    );

    router.get(
        routes.getListNhanVienKS,
        adminController.getListNhanVienKS
    );

    router.get(
        routes.getBangLuongNhanVienKS,
        verifyAccessTokenAdmin,
        adminController.getBangLuongNhanVienKS
    );

    router.get(
        routes.getListKhachHangKS,
        verifyAccessTokenAdmin,
        adminController.getListKhachHangKS
    );


    router.post(
        routes.themDichVuKS,
        verifyAccessTokenAdmin,
        adminController.themDichVuKS
    );

    router.get(
        routes.layDsDichVu,
        adminController.layDsDichVu
    );

    router.put(
        routes.suaDichVuKS,
        verifyAccessTokenAdmin,
        adminController.suaDichVuKS
    );

    router.post(
        routes.datDichVuKS,
        verifyAccessTokenAdmin,
        adminController.datDichVuKS
    );

    router.post(
        routes.themDanhMucKs,
        verifyAccessTokenAdmin,
        adminController.themDanhMucKs
    );

    router.get(
        routes.getListDanhMucDV,
        adminController.getListDanhMucDV
    );

    router.post(
        routes.themDanhMucPhong,
        verifyAccessTokenAdmin,
        adminController.themDanhMucPhong
    );

    router.get(
        routes.layDSDanhMucPhong,
        adminController.layDSDanhMucPhong
    );


    router.post(
        routes.themKhachHang,
        verifyAccessTokenAdmin,
        adminController.themKhachHang
    );

    router.put(
        routes.suaKhachHang,
        verifyAccessTokenAdmin,
        adminController.suaKhachHang
    );

    router.post(
        routes.blockHandleSuaPhong,
        verifyAccessTokenAdmin,
        adminController.blockHandleSuaPhong
    );
    router.post(
        routes.unBlockHandleSuaPhong,
        verifyAccessTokenAdmin,
        adminController.unBlockHandleSuaPhong
    );

    router.get(
        routes.getListDichVuByIdDatPhong,
        adminController.getListDichVuByIdDatPhong
    );

    return app.use('/', router);
};

export default initAdminRoute;
