import db from '../models';
const { Op } = require('sequelize');
require('dotenv').config();
import FuzzySearch from 'fuzzy-search';
import Fuse from 'fuse.js';
import { v4 as uuidv4 } from 'uuid';
import commont from '../services/commont';
const createError = require('http-errors');

const getProductPromotionHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date().getTime();

            let products = await db.product.findAll({
                attributes: [
                    'id',
                    'nameProduct',
                    'priceProduct',
                    'isSell',
                    'sold',
                ],
                limit: 10,
                include: [
                    {
                        model: db.imageProduct,
                        as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.classifyProduct,
                        as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                        where: {
                            [Op.and]: [
                                { numberPercent: { [Op.ne]: 0 } },
                                { timePromotion: { [Op.gt]: date } },
                            ],
                        },
                    },
                ],
                order: [
                    ['id', 'ASC'],
                    [
                        { model: db.imageProduct, as: 'imageProduct-product' },
                        'STTImage',
                        'asc',
                    ],
                ],
                raw: false,
                nest: true,
            });

            let products2 = await db.product.findAll({
                attributes: [
                    'id',
                    'nameProduct',
                    'priceProduct',
                    'isSell',
                    'sold',
                ],
                limit: 10 - products.length,
                include: [
                    {
                        model: db.imageProduct,
                        as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.classifyProduct,
                        as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                        where: {
                            [Op.or]: [
                                { numberPercent: { [Op.eq]: 0 } },
                                { timePromotion: { [Op.lte]: date } },
                            ],
                        },
                    },
                ],
                order: [
                    ['id', 'ASC'],
                    [
                        { model: db.imageProduct, as: 'imageProduct-product' },
                        'STTImage',
                        'asc',
                    ],
                ],
                raw: false,
                nest: true,
            });

            products.concat(products2);

            resolve({
                errCode: 0,
                count: products.length,
                data: products,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getTopSellProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll({
                attributes: [
                    'id',
                    'nameProduct',
                    'priceProduct',
                    'isSell',
                    'sold',
                ],
                include: [
                    {
                        model: db.imageProduct,
                        as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.classifyProduct,
                        as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                ],
                order: [
                    ['sold', 'DESC'],
                    [
                        { model: db.imageProduct, as: 'imageProduct-product' },
                        'STTImage',
                        'asc',
                    ],
                ],
                limit: 20,
                raw: false,
                nest: true,
            });

            if (products && products.length > 0) {
                resolve({
                    errCode: 0,
                    data: products,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy sản phẩm nào!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getNewCollectionProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.typeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let products = await db.product.findAll({
                    attributes: [
                        'id',
                        'nameProduct',
                        'priceProduct',
                        'isSell',
                        'sold',
                    ],
                    include: [
                        {
                            model: db.imageProduct,
                            as: 'imageProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.trademark,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.typeProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                            where: {
                                nameTypeProduct: data.typeProduct.toLowerCase(),
                            },
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                        {
                            model: db.promotionProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                    ],
                    order: [
                        [
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            'STTImage',
                            'asc',
                        ],
                    ],
                    limit: 10,
                    raw: false,
                    nest: true,
                });

                if (products && products.length > 0) {
                    resolve({
                        errCode: 0,
                        data: products,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm nào!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getProductFlycam = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll({
                attributes: [
                    'id',
                    'nameProduct',
                    'priceProduct',
                    'isSell',
                    'sold',
                ],
                include: [
                    {
                        model: db.imageProduct,
                        as: 'imageProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.trademark,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                    {
                        model: db.typeProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                        where: {
                            nameTypeProduct: 'flycam',
                        },
                    },
                    {
                        model: db.classifyProduct,
                        as: 'classifyProduct-product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.promotionProduct,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id'],
                        },
                    },
                ],
                order: [
                    [
                        { model: db.imageProduct, as: 'imageProduct-product' },
                        'STTImage',
                        'asc',
                    ],
                ],
                limit: 24,
                raw: false,
                nest: true,
            });

            if (products && products.length > 0) {
                resolve({
                    errCode: 0,
                    data: products,
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Không tìm thấy sản phẩm nào!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListProductMayLike = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameTypeProduct || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let arrType = data.nameTypeProduct.split(',');

                let products = await db.product.findAll({
                    attributes: [
                        'id',
                        'nameProduct',
                        'priceProduct',
                        'isSell',
                        'sold',
                    ],
                    where: {
                        id: {
                            [Op.ne]: data.id,
                        },
                    },
                    include: [
                        {
                            model: db.imageProduct,
                            as: 'imageProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.trademark,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.typeProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                            where: {
                                nameTypeProduct: {
                                    [Op.in]: arrType,
                                },
                            },
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                        {
                            model: db.promotionProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                    ],
                    order: [
                        [
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            'STTImage',
                            'asc',
                        ],
                    ],
                    limit: 20,
                    raw: false,
                    nest: true,
                });

                if (products && products.length > 0) {
                    resolve({
                        errCode: 0,
                        data: products,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm nào!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getEvaluateByIdProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //data.fillter ís [1,2,3,4,5,all,image,video,comment]
            if (
                !data.idProduct ||
                !data.fillter ||
                !data.page ||
                !data.offset
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let amount5star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 5,
                    },
                });
                let amount4star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 4,
                    },
                });
                let amount3star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 3,
                    },
                });
                let amount2star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 2,
                    },
                });
                let amount1star = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        starNumber: 1,
                    },
                });

                let amountComment = await db.evaluateProduct.count({
                    where: {
                        idProduct: data.idProduct,
                        content: {
                            [Op.ne]: '',
                        },
                    },
                });

                let evaluateProductArr = await db.evaluateProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                    },
                });
                let amountImage = 0;
                let amountVideo = 0;
                evaluateProductArr.forEach(async (item) => {
                    let image = await db.imageEvaluateProduct.findOne({
                        where: {
                            idEvaluateProduct: item.id,
                        },
                    });
                    let video = await db.videoEvaluateProduct.findOne({
                        where: {
                            idEvaluateProduct: item.id,
                        },
                    });
                    if (image) amountImage++;
                    if (video) amountVideo++;
                });

                let avgStarArrr = await db.evaluateProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                    },
                });

                let avgStar,
                    totalStar = 0;
                avgStarArrr.forEach((item) => {
                    totalStar += item.starNumber;
                });
                if (avgStarArrr.length === 0) {
                    avgStar = 0;
                } else {
                    avgStar = totalStar / avgStarArrr.length;
                }

                if (data.fillter === 'all') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName',
                                    'lastName',
                                    'typeAccount',
                                    'avatar',
                                    'avatarGoogle',
                                    'avatarFacebook',
                                    'avatarGithub',
                                    'avatarUpdate',
                                ],
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    },
                                ],
                            },
                            {
                                model: db.imageEvaluateProduct,
                            },
                            {
                                model: db.videoEvaluateProduct,
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true,
                    });

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                        },
                    });

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar,
                    });
                } else if (
                    data.fillter !== 'all' &&
                    data.fillter !== 'comment' &&
                    data.fillter !== 'video' &&
                    data.fillter !== 'image'
                ) {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                            starNumber: +data.fillter,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName',
                                    'lastName',
                                    'typeAccount',
                                    'avatar',
                                    'avatarGoogle',
                                    'avatarFacebook',
                                    'avatarGithub',
                                    'avatarUpdate',
                                ],
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    },
                                ],
                            },
                            {
                                model: db.imageEvaluateProduct,
                            },
                            {
                                model: db.videoEvaluateProduct,
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true,
                    });

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                            starNumber: +data.fillter,
                        },
                    });

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar,
                    });
                } else if (data.fillter === 'comment') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                            content: {
                                [Op.ne]: '',
                            },
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName',
                                    'lastName',
                                    'typeAccount',
                                    'avatar',
                                    'avatarGoogle',
                                    'avatarFacebook',
                                    'avatarGithub',
                                    'avatarUpdate',
                                ],
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    },
                                ],
                            },
                            {
                                model: db.imageEvaluateProduct,
                            },
                            {
                                model: db.videoEvaluateProduct,
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true,
                    });

                    let amountEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                            content: {
                                [Op.ne]: '',
                            },
                        },
                    });

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountEvaluate,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar,
                    });
                } else if (data.fillter === 'image') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName',
                                    'lastName',
                                    'typeAccount',
                                    'avatar',
                                    'avatarGoogle',
                                    'avatarFacebook',
                                    'avatarGithub',
                                    'avatarUpdate',
                                ],
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    },
                                ],
                            },
                            {
                                model: db.imageEvaluateProduct,
                                where: {
                                    imagebase64: {
                                        [Op.ne]: '',
                                    },
                                },
                            },
                            {
                                model: db.videoEvaluateProduct,
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true,
                    });

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountImage,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar,
                    });
                } else if (data.fillter === 'video') {
                    let evaluateProduct = await db.evaluateProduct.findAll({
                        where: {
                            idProduct: data.idProduct,
                        },
                        offset: (data.page - 1) * data.offset,
                        limit: data.offset,
                        include: [
                            {
                                model: db.User,
                                attributes: [
                                    'firstName',
                                    'lastName',
                                    'typeAccount',
                                    'avatar',
                                    'avatarGoogle',
                                    'avatarFacebook',
                                    'avatarGithub',
                                    'avatarUpdate',
                                ],
                            },
                            {
                                model: db.detailBill,
                                attributes: ['id'],
                                include: [
                                    {
                                        model: db.classifyProduct,
                                        attributes: ['nameClassifyProduct'],
                                    },
                                ],
                            },
                            {
                                model: db.imageEvaluateProduct,
                            },
                            {
                                model: db.videoEvaluateProduct,
                                where: {
                                    videobase64: {
                                        [Op.ne]: '',
                                    },
                                },
                            },
                        ],
                        order: [['createdAt', 'DESC']],
                        raw: false,
                        nest: true,
                    });

                    resolve({
                        errCode: 0,

                        data: evaluateProduct,
                        amoutFiller: amountVideo,

                        amount5star,
                        amount4star,
                        amount3star,
                        amount2star,
                        amount1star,
                        amountComment,
                        amountImage,
                        amountVideo,
                        avgStar,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const searchProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let whereTrademark = () => {
                    if (!data.brand) return {};
                    let arr = data.brand.split(',');
                    return {
                        nameTrademark: {
                            [Op.or]: arr,
                        },
                    };
                };

                let whereTypeProduct = () => {
                    if (!data.facet) return {};
                    let arr = data.facet.split(',');
                    return {
                        nameTypeProduct: {
                            [Op.or]: arr,
                        },
                    };
                };

                let whereStatus = () => {
                    if (!data.status) return null;
                    return {
                        isSell: data.status === 'sell' ? 'true' : 'false',
                    };
                };

                let wherePrice = () => {
                    if (!data.minP || !data.maxP) return {};
                    return {
                        priceClassify: {
                            [Op.between]: [+data.minP, +data.maxP],
                        },
                    };
                };

                let whereRating = () => {
                    if (!data.rating) return null;

                    return {
                        starNumber: {
                            [Op.gte]: +data.rating,
                        },
                    };
                };

                let date = new Date().getTime();
                let wherePromotion = () => {
                    if (!data.promotion || data.promotion !== 'true')
                        return null;
                    return {
                        [Op.and]: [
                            {
                                numberPercent: {
                                    [Op.gt]: 0,
                                },
                            },
                            {
                                timePromotion: {
                                    [Op.gt]: date,
                                },
                            },
                        ],
                    };
                };

                // let arrOrder = () => {
                //     if (!data.order) return null

                //     if (data.order === 'latest') {
                //         return ['createdAt', 'DESC']
                //     }

                //     if (data.order === 'selling') {
                //         return ['isSell', 'DESC']
                //     }
                // }

                let arrOrder = [
                    ['nameProduct', 'asc'],
                    ['stt', 'DESC'],
                    ['isSell', 'DESC'],
                ];
                let indexOrder = !data.order
                    ? 0
                    : data.order === 'latest'
                        ? 1
                        : data.order === 'selling'
                            ? 2
                            : 0;

                if (
                    data.promotion &&
                    data.promotion === 'true' &&
                    !data.keyword
                ) {
                    let listProducts = await db.product.findAll({
                        where: whereStatus(),
                        offset: (+data.page - 1) * +data.maxProduct,
                        limit: +data.maxProduct,
                        include: [
                            {
                                model: db.trademark,
                                where: whereTrademark(),
                            },
                            {
                                model: db.typeProduct,
                                where: whereTypeProduct(),
                            },
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            {
                                model: db.classifyProduct,
                                as: 'classifyProduct-product',
                                where: wherePrice(),
                            },
                            {
                                model: db.promotionProduct,
                                where: wherePromotion(),
                            },
                            {
                                model: db.evaluateProduct,
                                where: whereRating(),
                            },
                        ],
                        order: [
                            [
                                {
                                    model: db.imageProduct,
                                    as: 'imageProduct-product',
                                },
                                'STTImage',
                                'asc',
                            ],
                            [
                                {
                                    model: db.classifyProduct,
                                    as: 'classifyProduct-product',
                                },
                                'priceClassify',
                                'asc',
                            ],
                            arrOrder[indexOrder],
                        ],
                        raw: false,
                        nest: true,
                    });

                    let count = await db.product.findAll({
                        where: whereStatus(),
                        include: [
                            {
                                model: db.trademark,
                                where: whereTrademark(),
                            },
                            {
                                model: db.typeProduct,
                                where: whereTypeProduct(),
                            },
                            // {
                            //     model: db.imageProduct, as: 'imageProduct-product'
                            // },
                            {
                                model: db.classifyProduct,
                                as: 'classifyProduct-product',
                                where: wherePrice(),
                            },
                            {
                                model: db.promotionProduct,
                                where: wherePromotion(),
                            },
                            {
                                model: db.evaluateProduct,
                                where: whereRating(),
                            },
                        ],
                        raw: false,
                        nest: true,
                    });

                    // console.log(listProducts.length);
                    // console.log('length', count.length);

                    resolve({
                        errCode: 0,
                        countProduct: count.length,
                        data: listProducts,
                    });
                    return;
                }
                if (!data.keyword) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Not found keyword',
                    });
                    return;
                }

                let listProducts = await db.product.findAll({
                    where: whereStatus(),
                    // offset: (data.page - 1) * data.maxProduct,
                    // limit: data.maxProduct,
                    include: [
                        {
                            model: db.trademark,
                            where: whereTrademark(),
                        },
                        {
                            model: db.typeProduct,
                            where: whereTypeProduct(),
                        },
                        {
                            model: db.imageProduct,
                            as: 'imageProduct-product',
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product',
                            where: wherePrice(),
                        },
                        {
                            model: db.promotionProduct,
                            where: wherePromotion(),
                        },
                        {
                            model: db.evaluateProduct,
                            where: whereRating(),
                        },
                    ],
                    order: [
                        [
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            'STTImage',
                            'asc',
                        ],
                        [
                            {
                                model: db.classifyProduct,
                                as: 'classifyProduct-product',
                            },
                            'priceClassify',
                            'asc',
                        ],
                        arrOrder[indexOrder],
                    ],
                    raw: false,
                    nest: true,
                });
                // console.log('res1', listProducts);

                const options = {
                    keys: [
                        'nameProductEn',
                        'trademark.nameTrademarkEn',
                        'typeProduct.nameTypeProductEn',
                    ],
                };

                const fuse = new Fuse(listProducts, options);

                let key = data.keyword
                    ?.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd')
                    .replace(/Đ/g, 'D');

                const result = fuse.search(key);
                // console.log('res', result);

                let start = (+data.page - 1) * data.maxProduct;
                let end = start + data.maxProduct;

                resolve({
                    errCode: 0,
                    countProduct: result.length,
                    data: result.slice(start, end),
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

//test
const GetListProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let products = await db.product.findAll();

            resolve(products);
        } catch (e) {
            reject(e);
        }
    });
};

const createProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // let product = await db.product.create({
            //     nameProduct: data.name,
            //     id: uuidv4(),
            //     idTypeProduct: 'sfsdfsd',
            //     idTrademark: 'sfsdfds',
            //     isSell: 'true',
            //     sold: 0,

            // })

            resolve({
                errCode: 0,
                mess: 'đã thêm sản phẩm',
            });
        } catch (e) {
            reject(e);
        }
    });
};
//end test

const getListBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.page || !data.maxCount) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let date = new Date().getTime();
                let arrIdBlogLike = [];

                let blogs = await db.blogs.findAll({
                    where: {
                        timePost: {
                            [Op.lt]: date,
                        },
                        editImage: {
                            [Op.ne]: 'true',
                        },
                        editVideo: {
                            [Op.ne]: 'true',
                        },
                    },
                    offset: (+data.page - 1) * data.maxCount,
                    limit: data.maxCount,
                    attributes: {
                        exclude: [
                            'createdAt',
                            'updatedAt',
                            'viewBlog',
                            'timePost',
                            'timeBlog',
                            'idUser',
                            'contentMarkdown',
                            'contentHTML',
                        ],
                    },
                    include: [
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idCloudinary',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt',
                                    'statusUser',
                                    'sdt',
                                    'pass',
                                    'keyVerify',
                                    'idGoogle',
                                    'idGithub',
                                    'idFacebook',
                                    'email',
                                    'createdAt',
                                    'birtday',
                                    'gender',
                                ],
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.blogShares,
                            as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlogShare',
                                    'idProduct',
                                    'idBlog',
                                ],
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: [
                                            'createdAt',
                                            'updatedAt',
                                            'stt',
                                            'sold',
                                            'priceProduct',
                                            'nameProductEn',
                                            'isSell',
                                            'idTypeProduct',
                                            'idTrademark',
                                            'contentMarkdown',
                                            'contentHTML',
                                        ],
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct,
                                            as: 'imageProduct-product',
                                        },
                                    ],
                                },
                                {
                                    model: db.blogs,
                                    as: 'blogs-blogShares-child',
                                    attributes: {
                                        exclude: [
                                            'createdAt',
                                            'updatedAt',
                                            'stt',
                                            'viewBlog',
                                            'timePost',
                                            'timeBlog',
                                            'idUser',
                                            'contentMarkdown',
                                        ],
                                    },
                                    include: [
                                        {
                                            model: db.User,
                                        },
                                        {
                                            model: db.imageBlogs,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true,
                });

                let countPage = await db.blogs.count({
                    where: {
                        timePost: {
                            [Op.lt]: date,
                        },
                        editImage: 'false',
                        editVideo: 'false',
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt',
                                    'statusUser',
                                    'sdt',
                                    'pass',
                                    'keyVerify',
                                    'idGoogle',
                                    'idGithub',
                                    'idFacebook',
                                    'email',
                                    'createdAt',
                                    'birtday',
                                    'gender',
                                ],
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                });

                if (data.accessToken) {
                    let decode = commont.decodeToken(
                        data.accessToken,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    if (decode !== null) {
                        let idUser = decode.id;
                        let listIdBlog = [];

                        let blogArr = await db.blogs.findAll({
                            where: {
                                timePost: {
                                    [Op.lt]: date,
                                },
                            },
                            offset: (data.page - 1) * data.maxCount,
                            limit: data.maxCount,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'viewBlog',
                                    'timePost',
                                    'timeBlog',
                                    'idUser',
                                    'contentMarkdown',
                                ],
                            },
                            include: [
                                {
                                    model: db.User,
                                    attributes: {
                                        exclude: [
                                            'updatedAt',
                                            'statusUser',
                                            'sdt',
                                            'pass',
                                            'keyVerify',
                                            'idGoogle',
                                            'idGithub',
                                            'idFacebook',
                                            'id',
                                            'email',
                                            'createdAt',
                                            'birtday',
                                            'gender',
                                        ],
                                    },
                                    where: {
                                        statusUser: {
                                            [Op.ne]: 'false',
                                        },
                                    },
                                },
                            ],
                            order: [['stt', 'DESC']],
                            raw: false,
                            nest: true,
                        });

                        blogArr.forEach((item, index) => {
                            let idBlog = { ...item }.dataValues.id;
                            listIdBlog.push(idBlog);
                        });
                        let likeBlog = await db.likeBlog.findAll({
                            where: {
                                idUser,
                                idBlog: {
                                    [Op.in]: listIdBlog,
                                },
                            },
                            attributes: ['idBlog'],
                        });

                        let listIdBlogCollection =
                            await db.collectionBlogs.findAll({
                                where: {
                                    idUser: decode.id,
                                },
                                attributes: ['idBlog'],
                            });

                        resolve({
                            errCode: 0,
                            data: blogs,
                            countPage,
                            arrIdBlogLike: likeBlog,
                            listIdBlogCollection,
                        });
                        return;
                    }
                }

                resolve({
                    errCode: 0,
                    data: blogs,
                    countPage,
                    arrIdBlogLike,
                    listIdBlogCollection: [],
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListHashTag = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listProducts = await db.product.findAll({
                attributes: ['id', 'nameProduct'],
            });

            resolve({
                errCode: 0,
                data: listProducts,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getBlogShareProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                    },
                    attributes: {
                        exclude: [
                            'updatedAt',
                            'viewBlog',
                            'timePost',
                            'timeBlog',
                            'idUser',
                            'contentMarkdown',
                        ],
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt',
                                    'statusUser',
                                    'sdt',
                                    'pass',
                                    'keyVerify',
                                    'idGoogle',
                                    'idGithub',
                                    'idFacebook',
                                    'email',
                                    'createdAt',
                                    'birtday',
                                    'gender',
                                ],
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.blogShares,
                            as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlogShare',
                                    'idProduct',
                                    'idBlog',
                                ],
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: [
                                            'createdAt',
                                            'updatedAt',
                                            'stt',
                                            'sold',
                                            'priceProduct',
                                            'nameProductEn',
                                            'isSell',
                                            'idTypeProduct',
                                            'idTrademark',
                                            'contentMarkdown',
                                            'contentHTML',
                                        ],
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct,
                                            as: 'imageProduct-product',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: blogs,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getBlogShareDefault = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                    },
                    attributes: {
                        exclude: [
                            'updatedAt',
                            'viewBlog',
                            'timePost',
                            'timeBlog',
                            'idUser',
                            'contentMarkdown',
                        ],
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt',
                                    'statusUser',
                                    'sdt',
                                    'pass',
                                    'keyVerify',
                                    'idGoogle',
                                    'idGithub',
                                    'idFacebook',
                                    'email',
                                    'createdAt',
                                    'birtday',
                                    'gender',
                                ],
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idCloudinary',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: blogs,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getBlogById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let date = new Date().getTime();
                let blogs = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                        timePost: {
                            [Op.lt]: date,
                        },
                    },
                    attributes: {
                        exclude: [
                            'updatedAt',
                            'viewBlog',
                            'timePost',
                            'timeBlog',
                            'idUser',
                            'contentMarkdown',
                        ],
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: {
                                exclude: [
                                    'updatedAt',
                                    'statusUser',
                                    'sdt',
                                    'pass',
                                    'keyVerify',
                                    'idGoogle',
                                    'idGithub',
                                    'idFacebook',
                                    'email',
                                    'createdAt',
                                    'birtday',
                                    'gender',
                                ],
                            },
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.imageBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idCloudinary',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                        {
                            model: db.videoBlogs,
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlog',
                                    '',
                                ],
                            },
                        },
                        {
                            model: db.blogShares,
                            as: 'blogs-blogShares-parent',
                            attributes: {
                                exclude: [
                                    'createdAt',
                                    'updatedAt',
                                    'stt',
                                    'idBlogShare',
                                    'idProduct',
                                    'idBlog',
                                ],
                            },
                            include: [
                                {
                                    model: db.product,
                                    attributes: {
                                        exclude: [
                                            'createdAt',
                                            'updatedAt',
                                            'stt',
                                            'sold',
                                            'priceProduct',
                                            'nameProductEn',
                                            'isSell',
                                            'idTypeProduct',
                                            'idTrademark',
                                            'contentMarkdown',
                                            'contentHTML',
                                        ],
                                    },
                                    include: [
                                        {
                                            model: db.imageProduct,
                                            as: 'imageProduct-product',
                                        },
                                    ],
                                },
                                {
                                    model: db.blogs,
                                    as: 'blogs-blogShares-child',
                                    attributes: {
                                        exclude: [
                                            'createdAt',
                                            'updatedAt',
                                            'stt',
                                            'viewBlog',
                                            'timePost',
                                            'timeBlog',
                                            'idUser',
                                            'contentMarkdown',
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (blogs) {
                    let checkLike = false;
                    let checkCollection = false;

                    // if (data.accessToken) {
                    //     let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)

                    //     if (decode !== null) {
                    //         let likeBlogUser = await db.likeBlog.findOne({
                    //             where: {
                    //                 idUser: decode.id,
                    //                 idBlog: data.idBlog
                    //             }
                    //         })
                    //         let collectionBlogs = await db.collectionBlogs.findOne({
                    //             where: {
                    //                 idBlog: data.idBlog,
                    //                 idUser: decode.id
                    //             }
                    //         })

                    //         if (likeBlogUser) checkLike = true
                    //         if (collectionBlogs) checkCollection = true
                    //     }
                    // }

                    resolve({
                        errCode: 0,
                        data: blogs,
                        checkLike,
                        checkCollection,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Not found',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getCommentBlogByIdBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let commentBlogs = await db.commentBlog.findAll({
                    where: {
                        idBlog: data.idBlog,
                    },
                    limit: 20,
                    offset: (+data.page - 1) * 20,
                    include: [
                        {
                            model: db.User,
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true,
                });

                let count = await db.commentBlog.count({
                    where: {
                        idBlog: data.idBlog,
                    },
                    include: [
                        {
                            model: db.User,
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                // if (data.accessToken) {
                //     let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                //     if (decode !== null) {
                //         resolve({
                //             errCode: 0,
                //             data: commentBlogs,
                //             idUser: decode.id,
                //             count
                //         })
                //         return
                //     }
                // }

                resolve({
                    errCode: 0,
                    data: commentBlogs,
                    count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const increaseViewBlogById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let blog = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                    },
                    raw: false,
                });

                if (blog) {
                    blog.viewBlog = blog.viewBlog + 1;
                    await blog.save();
                }

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListShortVideo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Không có truyền tham số
            if (!data._isv && !data.listIdVideo) {
                let listVideo = await db.shortVideos.findAll({
                    where: {
                        scope: 'public',
                        loadImage: 'true',
                        loadVideo: 'true',
                    },
                    attributes: [
                        'id',
                        'idDriveVideo',
                        'urlImage',
                        'content',
                        'scope',
                        'countLike',
                        'countComment',
                    ],
                    include: [
                        {
                            model: db.hashTagVideos,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.product,
                                    attributes: ['id', 'nameProduct'],
                                },
                            ],
                        },
                        {
                            model: db.User,
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'idTypeUser',
                                'typeAccount',
                                'avatar',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'statusUser',
                            ],
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                    limit: 5,
                    order: db.sequelize.random(),
                });

                resolve({
                    errCode: 0,
                    data: listVideo,
                });
            } else if (!data._isv && data.listIdVideo) {
                let listVideo = await db.shortVideos.findAll({
                    where: {
                        id: {
                            [Op.notIn]: data.listIdVideo,
                        },
                        scope: 'public',
                        loadImage: 'true',
                        loadVideo: 'true',
                    },
                    attributes: [
                        'id',
                        'idDriveVideo',
                        'urlImage',
                        'content',
                        'scope',
                        'countLike',
                        'countComment',
                    ],
                    include: [
                        {
                            model: db.hashTagVideos,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.product,
                                    attributes: ['id', 'nameProduct'],
                                },
                            ],
                        },
                        {
                            model: db.User,
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'idTypeUser',
                                'typeAccount',
                                'avatar',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'statusUser',
                            ],
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                    limit: 5,
                    order: db.sequelize.random(),
                });

                resolve({
                    errCode: 0,
                    data: listVideo,
                });
            } else if (data._isv) {
                let listVideo = await db.shortVideos.findOne({
                    where: {
                        id: data._isv,
                        scope: 'public',
                        loadImage: 'true',
                        loadVideo: 'true',
                    },
                    attributes: [
                        'id',
                        'idDriveVideo',
                        'urlImage',
                        'content',
                        'scope',
                        'countLike',
                        'countComment',
                    ],
                    include: [
                        {
                            model: db.hashTagVideos,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.product,
                                    attributes: ['id', 'nameProduct'],
                                },
                            ],
                        },
                        {
                            model: db.User,
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'idTypeUser',
                                'typeAccount',
                                'avatar',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'statusUser',
                            ],
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                    // limit: 5,
                    // order: db.sequelize.random()
                });

                if (!listVideo) {
                    resolve({
                        errCode: 1,
                    });
                    return;
                }

                resolve({
                    errCode: 0,
                    data: listVideo,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListCommentShortVideoById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idShortVideo || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let listComments = await db.commentShortVideos.findAll({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                    limit: 20,
                    offset: data.offset,
                    attributes: ['id', 'content', 'createdAt'],
                    include: [
                        {
                            model: db.User,
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'idTypeUser',
                                'typeAccount',
                                'avatar',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'statusUser',
                            ],
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    order: [['stt', 'DESC']],
                    raw: false,
                    nest: true,
                });

                let count = await db.commentShortVideos.count({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                    include: [
                        {
                            model: db.User,
                            where: {
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let idUser, User;
                if (data.accessToken) {
                    let decode = commont.decodeToken(
                        data.accessToken,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    if (decode !== null) {
                        let user = await db.User.findOne({
                            where: {
                                id: decode.id,
                                statusUser: {
                                    [Op.ne]: 'false',
                                },
                            },
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'idTypeUser',
                                'typeAccount',
                                'avatar',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'statusUser',
                            ],
                        });

                        if (user) {
                            idUser = decode.id;
                            User = user;
                        }
                    }
                }

                resolve({
                    errCode: 0,
                    data: listComments,
                    idUser,
                    count,
                    User,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListProductHashTagByIdVideo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idShortVideo) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let video = await db.shortVideos.findOne({
                    where: {
                        id: data.idShortVideo,
                    },
                    attributes: ['id'],
                    include: [
                        {
                            model: db.hashTagVideos,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.product,
                                    attributes: [
                                        'id',
                                        'nameProduct',
                                        'priceProduct',
                                        'isSell',
                                        'sold',
                                    ],
                                    include: [
                                        {
                                            model: db.imageProduct,
                                            as: 'imageProduct-product',
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.trademark,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.typeProduct,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.classifyProduct,
                                            as: 'classifyProduct-product',
                                            // attributes: {
                                            //     exclude: ['createdAt', 'updatedAt', 'id']
                                            // }
                                        },
                                        {
                                            model: db.promotionProduct,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                    ],
                                    order: [
                                        [
                                            {
                                                model: db.imageProduct,
                                                as: 'imageProduct-product',
                                            },
                                            'STTImage',
                                            'asc',
                                        ],
                                    ],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: video,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getProductById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct,
                    },
                    attributes: [
                        'id',
                        'nameProduct',
                        'priceProduct',
                        'isSell',
                        'sold',
                        'contentHTML',
                    ],
                    limit: 10,
                    include: [
                        {
                            model: db.imageProduct,
                            as: 'imageProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.trademark,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.typeProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                        {
                            model: db.promotionProduct,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'id'],
                            },
                        },
                    ],
                    order: [
                        // ['id', 'ASC'],
                        [
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            'STTImage',
                            'asc',
                        ],
                    ],
                    raw: false,
                    nest: true,
                });

                if (product) {
                    let totalEvaluate =
                        (await db.evaluateProduct.sum('starNumber', {
                            where: {
                                idProduct: data.idProduct,
                            },
                        })) || 0;
                    let countEvaluate = await db.evaluateProduct.count({
                        where: {
                            idProduct: data.idProduct,
                        },
                    });

                    resolve({
                        errCode: 0,
                        data: product,
                        countEvaluate: countEvaluate,
                        persentElevate: totalEvaluate / countEvaluate,
                    });
                    return;
                } else {
                    resolve({
                        errCode: 0,
                        data: [],
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListBlogHome = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // let date = new Date().getTime()

            let blogs = await db.blogs.findAll({
                where: {
                    typeBlog: 'default',
                },

                include: [
                    {
                        model: db.User,
                        where: {
                            statusUser: {
                                [Op.ne]: 'false',
                            },
                        },
                    },
                    {
                        model: db.imageBlogs,
                        limit: 1,
                        order: [['stt', 'asc']],
                    },
                ],
                order: [['createdAt', 'DESC']],
                limit: 5,
                raw: false,
                nest: true,
            });
            // console.log(blogs);

            resolve({
                errCode: 0,
                data: blogs,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getEventPromotionById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idEventPromotion || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let date = new Date().getTime();
                let eventPromotion = await db.eventPromotions.findOne({
                    where: {
                        id: data.idEventPromotion,
                        timeStart: {
                            [Op.lt]: date,
                        },
                        timeEnd: {
                            [Op.gt]: date,
                        },
                    },
                    attributes: {
                        exclude: ['firstContent', 'lastContent'],
                    },
                    include: [
                        {
                            model: db.productEvents,
                            include: [
                                {
                                    model: db.product,
                                    attributes: [
                                        'id',
                                        'nameProduct',
                                        'priceProduct',
                                        'isSell',
                                        'sold',
                                        'contentHTML',
                                    ],
                                    include: [
                                        {
                                            model: db.imageProduct,
                                            as: 'imageProduct-product',
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.trademark,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.typeProduct,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.classifyProduct,
                                            as: 'classifyProduct-product',
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                ],
                                            },
                                        },
                                        {
                                            model: db.promotionProduct,
                                            attributes: {
                                                exclude: [
                                                    'createdAt',
                                                    'updatedAt',
                                                    'id',
                                                ],
                                            },
                                        },
                                    ],
                                    order: [
                                        ['id', 'ASC'],
                                        [
                                            {
                                                model: db.imageProduct,
                                                as: 'imageProduct-product',
                                            },
                                            'STTImage',
                                            'asc',
                                        ],
                                    ],
                                },
                            ],
                            limit: 30,
                            offset: (+data.page - 1) * 30,
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (eventPromotion) {
                    let count = await db.productEvents.count({
                        where: {
                            idEventPromotion: data.idEventPromotion,
                        },
                    });

                    resolve({
                        errCode: 0,
                        data: eventPromotion,
                        count,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Sự kiện chưa bắt đầu hoặc đã kết thúc!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListEventPromotionHome = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date().getTime();
            let eventPromotion = await db.eventPromotions.findAll({
                where: {
                    timeStart: {
                        [Op.lt]: date,
                    },
                    timeEnd: {
                        [Op.gt]: date,
                    },
                },
                attributes: ['id', 'cover'],
                order: [['stt', 'DESC']],
            });

            resolve({
                errCode: 0,
                data: eventPromotion,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getContentEventPromotionById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idEventPromotion) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                let date = new Date().getTime();
                let eventPromotion = await db.eventPromotions.findOne({
                    where: {
                        id: data.idEventPromotion,
                        timeStart: {
                            [Op.lt]: date,
                        },
                        timeEnd: {
                            [Op.gt]: date,
                        },
                    },
                    attributes: ['firstContent', 'lastContent'],
                });

                if (eventPromotion) {
                    resolve({
                        errCode: 0,
                        data: eventPromotion,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Sự kiện chưa bắt đầu hoặc đã kết thúc!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getSuggestProductMobile = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('vao');
            // throw createError.InternalServerError();

            let discard = data.discard;
            let limit = data.limit || 10;
            if (typeof discard !== 'array' || !discard) discard = [];

            let products = await db.product.findAll({
                where: {
                    isSell: 'true',
                    id: {
                        [Op.notIn]: discard,
                    },
                },
                limit: limit,
                attributes: {
                    exclude: [
                        'createdAt',
                        'updatedAt',
                        'contentHTML',
                        'contentMarkdown',
                        'nameProductEn',
                        'idTypeProduct',
                        'stt',
                        'idTrademark',
                        'isSell',
                    ],
                },
                include: [
                    {
                        model: db.trademark,
                        attributes: ['nameTrademark'],
                    },
                    {
                        model: db.promotionProduct,
                        attributes: ['timePromotion', 'numberPercent'],
                    },
                    {
                        model: db.imageProduct,
                        as: 'imageProduct-product',
                        attributes: ['imagebase64'],
                        limit: 1,
                    },
                    {
                        model: db.classifyProduct,
                        as: 'classifyProduct-product',
                        attributes: ['nameClassifyProduct', 'priceClassify'],
                        limit: 1,
                    },
                ],
                order: db.sequelize.random(),
                raw: false,
                nest: true,
            });

            resolve({
                errCode: 0,
                data: products,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getListBlogForyouMobile = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve({
                errCode: 0,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getListKeywordSearchMobile = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data,
                });
            } else {
                // let text = commont.removeVietnameseDiacritics(data.value);
                // text = text.toLowerCase();

                let rows = await db.keywordSearchs.findAll({
                    where: {
                        keyword: {
                            [Op.like]: `%${data.value}%`,
                        },
                    },
                });

                resolve({
                    errCode: 0,
                    data: rows,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListBaiHat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let maxCount = +data.maxCount || 20;
            let page = +data.page || 1;
            let orderBy = data.orderBy || 'createdAt';
            let order_style = data.order_style || 'asc';
            let search_tenBH = data.search_tenBH || '';

            let baihats = await db.baihat.findAll({
                where: {
                    tenBaiHat: {
                        [Op.like]: `%${search_tenBH}%`,
                    },
                },
                include: [
                    {
                        model: db.baiHat_caSi,
                        include: [
                            {
                                model: db.casi
                            }
                        ]
                    },
                ],
                limit: maxCount,
                offset: (page - 1) * maxCount,
                order: [[orderBy, order_style]],
                raw: false,
                nest: true,
            });

            resolve({
                errCode: 0,
                len: baihats.length,
                data: baihats,
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
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
