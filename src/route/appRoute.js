import express from 'express';
import userController from '../controllers/userController';
import adminController from '../controllers/adminController';
import appController from '../controllers/appController';
const fileUploader = require('../config/cloudinary.config');
import multer from 'multer';
import path from 'path';
import { routes } from '../services/commont';

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

const initAppRoute = (app) => {
    router.get('/', (req, res, next) => {
        res.send(
            `Hello backend -- Link frontend: <a href="${process.env.LINK_FONTEND}">go to the website</a>`
        );
    });
    router.get('/account', userController.accountVerifyPage);
    router.get('/verify-email', userController.verifyEmail);
    router.get('/api/v1/check-start-server', appController.checkStartServer);

    //app api
    router.get(
        routes.getProductPromotionHome,
        appController.getProductPromotionHome
    );
    router.get(routes.getTopSellProduct, appController.getTopSellProduct);
    router.get(
        routes.getNewCollectionProduct,
        appController.getNewCollectionProduct
    );
    router.get(routes.getProductFlycam, appController.getProductFlycam);
    router.get(
        routes.getListProductMayLike,
        appController.getListProductMayLike
    );
    router.get(
        routes.getEvaluateByIdProduct,
        appController.getEvaluateByIdProduct
    );
    router.get(routes.searchProduct, appController.searchProduct);
    router.get(routes.getListBlog, appController.getListBlog);
    router.get(routes.getListHashTag, appController.getListHashTag);
    router.get(routes.getBlogShareProduct, appController.getBlogShareProduct);
    router.get(routes.getBlogShareDefault, appController.getBlogShareDefault);
    router.get(routes.getBlogById, appController.getBlogById);
    router.get(
        routes.getCommentBlogByIdBlog,
        appController.getCommentBlogByIdBlog
    );
    router.get(routes.getListShortVideo, appController.getListShortVideo);
    router.get(
        routes.getListCommentShortVideoById,
        appController.getListCommentShortVideoById
    );
    router.get(
        routes.getListProductHashTagByIdVideo,
        appController.getListProductHashTagByIdVideo
    );
    router.get(routes.getProductById, appController.getProductById);
    router.get(routes.getListBlogHome, appController.getListBlogHome);
    router.get(
        routes.getEventPromotionById,
        appController.getEventPromotionById
    );
    router.get(
        routes.getListEventPromotionHome,
        appController.getListEventPromotionHome
    );
    router.get(
        routes.getContentEventPromotionById,
        appController.getContentEventPromotionById
    );
    router.get(
        routes.getSuggestProductMobile,
        appController.getSuggestProductMobile
    );
    router.get(
        routes.getListBlogForyouMobile,
        appController.getListBlogForyouMobile
    );
    router.get(
        routes.getListKeywordSearchMobile,
        appController.getListKeywordSearchMobile
    );

    router.get(routes.getListBaiHat, appController.getListBaiHat);

    router.put(routes.increaseViewBlogById, appController.increaseViewBlogById);

    //test
    router.get('/api/test-api', adminController.testApi);

    router.get('/api/v1/get-list-product', appController.GetListProduct);
    router.get('/api/v1/create-product', appController.createProduct);

    return app.use('/', router);
};

export default initAppRoute;
