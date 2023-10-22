import appService from '../services/appService';

const checkStartServer = async (req, res, next) => {
    try {
        return res.status(200).json({
            errCode: 0,
        });
    } catch (e) {
        next(e);
    }
};

const getProductPromotionHome = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getProductPromotionHome();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getTopSellProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getTopSellProduct();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getNewCollectionProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getNewCollectionProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getProductFlycam = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getProductFlycam(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListProductMayLike = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListProductMayLike(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getEvaluateByIdProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getEvaluateByIdProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const searchProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.searchProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
//test
const GetListProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.GetListProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const createProduct = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.createProduct();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};
//end test

const getListBlog = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListBlog(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListHashTag = async (req, res, next) => {
    try {
        //call service data
        let data = await appService.getListHashTag();

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getBlogShareProduct = async (req, res, next) => {
    try {
        let data = await appService.getBlogShareProduct(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getBlogShareDefault = async (req, res, next) => {
    try {
        let data = await appService.getBlogShareDefault(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getBlogById = async (req, res, next) => {
    try {
        let data = await appService.getBlogById(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getCommentBlogByIdBlog = async (req, res, next) => {
    try {
        let data = await appService.getCommentBlogByIdBlog(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const increaseViewBlogById = async (req, res, next) => {
    try {
        let data = await appService.increaseViewBlogById(req.body);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListShortVideo = async (req, res, next) => {
    try {
        let data = await appService.getListShortVideo(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListCommentShortVideoById = async (req, res, next) => {
    try {
        let data = await appService.getListCommentShortVideoById(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListProductHashTagByIdVideo = async (req, res, next) => {
    try {
        let data = await appService.getListProductHashTagByIdVideo(req.query);

        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getProductById = async (req, res, next) => {
    try {
        let data = await appService.getProductById(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListBlogHome = async (req, res, next) => {
    try {
        let data = await appService.getListBlogHome();
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getEventPromotionById = async (req, res, next) => {
    try {
        let data = await appService.getEventPromotionById(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListEventPromotionHome = async (req, res, next) => {
    try {
        let data = await appService.getListEventPromotionHome();
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getContentEventPromotionById = async (req, res, next) => {
    try {
        let data = await appService.getContentEventPromotionById(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getSuggestProductMobile = async (req, res, next) => {
    try {
        let data = await appService.getSuggestProductMobile(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListBlogForyouMobile = async (req, res, next) => {
    try {
        let data = await appService.getListBlogForyouMobile(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListKeywordSearchMobile = async (req, res, next) => {
    try {
        let data = await appService.getListKeywordSearchMobile(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

const getListBaiHat = async (req, res, next) => {
    try {
        let data = await appService.getListBaiHat(req.query);
        return res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

module.exports = {
    checkStartServer,
    getProductPromotionHome,
    getTopSellProduct,
    getNewCollectionProduct,
    getProductFlycam,
    getListProductMayLike,
    getEvaluateByIdProduct,
    searchProduct,
    GetListProduct,
    createProduct,
    getListBlog,
    getListHashTag,
    getBlogShareProduct,
    getBlogShareDefault,
    getBlogById,
    getCommentBlogByIdBlog,
    increaseViewBlogById,
    getListShortVideo,
    getListCommentShortVideoById,
    getListProductHashTagByIdVideo,
    getProductById,
    getListBlogHome,
    getEventPromotionById,
    getListEventPromotionHome,
    getContentEventPromotionById,
    getSuggestProductMobile,
    getListBlogForyouMobile,
    getListKeywordSearchMobile,
    getListBaiHat,
};
