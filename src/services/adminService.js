import Verifier from "email-verifier";
import FuzzySearch from 'fuzzy-search';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { signAccessToken, signRefreshToken } from '../helpers/JWT_service';
import { handleEmit } from '../index';
import db from '../models';
import commont, {
    decodeToken,
    hashPassword,
    sendEmail
} from './commont';
import provinces from './provinces.json';
var cloudinary = require('cloudinary');
const { Op } = require('sequelize');
require('dotenv').config();
const { google } = require('googleapis');
const createError = require('http-errors');
const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

let verifier_email = new Verifier(process.env.API_KEY_VERIFY_EMAIL, {
    checkCatchAll: false,
    checkDisposable: false,
    checkFree: false,
    validateDNS: false,
    validateSMTP: true,
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client,
});

let GG_Drive = {
    setFilePublic: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink',
            });

            return getUrl;
        } catch (error) {
            console.error(error);
        }
    },
    uploadFile: async (name, idForder = '') => {
        try {
            let date = new Date().getTime();

            const createFile = await drive.files.create({
                requestBody: {
                    name: `Video-${date}`,
                    mimeType: 'video/*',
                    parents: [idForder],
                },
                media: {
                    mimeType: 'video/*',
                    body: fs.createReadStream(
                        path.join(__dirname, `../public/videoTam/${name}`)
                    ),
                },
            });
            const fileId = createFile.data.id;
            const getUrl = await GG_Drive.setFilePublic(fileId);

            return {
                url: getUrl.data.webViewLink,
                id: createFile.data.id,
            };
        } catch (error) {
            console.error('Loi tu upload', error);
        }
    },
    deleteFile: async (fileId) => {
        try {
            const deleteFile = await drive.files.delete({
                fileId: fileId,
            });
        } catch (error) {
            console.error(error);
        }
    },
};

const checkLoginAdmin = async (accessToken) => {
    try {
        let decoded = decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (decoded === null) return false;

        let user = await db.User.findOne({
            where: {
                id: decoded.id,
                idTypeUser: {
                    [Op.or]: ['1', '2'],
                },
            },
        });
        if (!user) return false;
        return true;
    } catch (e) {
        return false;
    }
};

const addTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.query.nameTypeProduct || !data.file) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                //
                let isLogin = await checkLoginAdmin(data.query.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let [typeProduct, created] = await db.typeProduct.findOrCreate({
                    where: {
                        nameTypeProduct:
                            data.query.nameTypeProduct.toLowerCase(),
                    },
                    defaults: {
                        imageTypeProduct: data.file.path,
                        id: uuidv4(),
                        nameTypeProductEn: data.query.nameTypeProduct
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D'),
                    },
                    raw: false,
                });

                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Loại sản phẩm đã tồn tại!',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllTypeProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let typeProducts = await db.typeProduct.findAll({
                order: [['id', 'ASC']],
            });
            // let typeProducts = await db.typeProduct.findAll({
            //     order: db.sequelize.random()
            // });
            if (typeProducts && typeProducts.length > 0) {
                resolve({
                    errCode: 0,
                    data: typeProducts,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Not found data',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: +data.idType },
                    raw: false,
                });
                if (typeProduct) {
                    let idCloudinary = typeProduct.imageTypeProduct
                        .split('/')
                        .pop()
                        .split('.')[0];
                    cloudinary.v2.uploader.destroy(idCloudinary);

                    await typeProduct.destroy();

                    let restrademark = await db.trademark.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false,
                    });
                    if (restrademark) {
                        await restrademark.destroy();
                    }

                    let products = await db.product.findAll({
                        where: { idTypeProduct: +data.idType },
                        raw: false,
                    });
                    if (products) {
                        await products.destroy();
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'Xóa loại sản phẩm thành công!',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Loại sản phẩm không còn tồn tại!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateTypeProductById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (!data.query.idTypeProduct || !data.query.nameTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let typeProduct = await db.typeProduct.findOne({
                    where: { id: data.query.idTypeProduct },
                    raw: false,
                });

                if (!typeProduct) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy loại sản phẩm này!',
                    });
                } else {
                    let isLogin = await checkLoginAdmin(data.query.accessToken);
                    if (!isLogin) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Chưa có đăng nhập!',
                        });
                        return;
                    }

                    let check = await db.typeProduct.findOne({
                        where: {
                            nameTypeProduct:
                                data.query.nameTypeProduct.toLowerCase(),
                        },
                        raw: false,
                    });
                    if (check && check.id !== typeProduct.id) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tên loại sản phẩm đã tồn tại!',
                        });
                    } else {
                        typeProduct.nameTypeProduct =
                            data.query.nameTypeProduct.toLowerCase();
                        typeProduct.nameTypeProductEn =
                            data.query.nameTypeProduct
                                .toLowerCase()
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/đ/g, 'd')
                                .replace(/Đ/g, 'D');
                        if (data.file) {
                            let idCloudinary = typeProduct.imageTypeProduct
                                .split('/')
                                .pop()
                                .split('.')[0];
                            cloudinary.v2.uploader.destroy(
                                `type_product/${idCloudinary}`
                            );
                            typeProduct.imageTypeProduct = data.file.path;
                        }
                        await typeProduct.save();

                        resolve({
                            errCode: 0,
                            errMessage:
                                'Đã thay đổi tên loại sản phẩm thành công!',
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const addTrademark = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idTypeProduct || !data.nameTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }
                let [trademark, created] = await db.trademark.findOrCreate({
                    where: {
                        nameTrademark: data.nameTrademark.trim().toLowerCase(),
                        idTypeProduct: data.idTypeProduct,
                    },
                    defaults: {
                        id: uuidv4(),
                        nameTrademarkEn: data.nameTrademark
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D'),
                    },
                });

                if (!created) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Thương hiệu đã tồn tại!',
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAllTrademark = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const trademarks = await db.trademark.findAll({
                include: [
                    {
                        model: db.typeProduct,
                        attributes: ['id', 'nameTypeProduct'],
                    },
                ],
                order: [
                    ['idTypeProduct', 'ASC'],
                    ['id', 'ASC'],
                ],
                raw: true,
                nest: true,
            });

            if (trademarks && trademarks.length > 0) {
                resolve({
                    errCode: 0,
                    data: trademarks,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Không tìm thấy thương hiệu nào!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteTrademarkById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let resTrademark = await db.trademark.findOne({
                    where: {
                        id: +data.idTrademark,
                    },
                    raw: false,
                });
                if (!resTrademark) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy thương hiệu này!',
                    });
                } else {
                    await resTrademark.destroy();
                    let products = await db.product.findAll({
                        where: {
                            idTrademark: +data.idTrademark,
                        },
                        raw: false,
                    });
                    if (products && products.length > 0) {
                        await products.destroy();
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateTrademarkById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.idTypeProduct || !data.nameTrademark) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }
                let trademarkEdit = await db.trademark.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });
                if (trademarkEdit) {
                    let check = await db.trademark.findOne({
                        where: {
                            idTypeProduct: data.idTypeProduct,
                            nameTrademark: data.nameTrademark.toLowerCase(),
                        },
                        raw: false,
                    });

                    if (check) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Thương hiệu này đã tồn tại!',
                        });
                    } else {
                        trademarkEdit.nameTrademark =
                            data.nameTrademark.toLowerCase();
                        trademarkEdit.nameTrademarkEn = data.nameTrademark
                            .toLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '')
                            .replace(/đ/g, 'd')
                            .replace(/Đ/g, 'D');
                        trademarkEdit.idTypeProduct = data.idTypeProduct;
                        await trademarkEdit.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'ok',
                        });
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy thương hiệu này!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createNewProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.nameProduct ||
                !data.priceProduct ||
                !data.idTypeProduct ||
                !data.idTrademark ||
                !data.contentHTML ||
                !data.contentMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }
                let product = await db.product.create({
                    nameProduct: data.nameProduct.toLowerCase(),
                    nameProductEn: data.nameProduct
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D'),
                    priceProduct: data.priceProduct,
                    idTypeProduct: data.idTypeProduct,
                    idTrademark: data.idTrademark,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    isSell: 'true',
                    sold: 0,
                    id: uuidv4(),
                });

                // console.log('product: ', product.dataValues);
                await db.promotionProduct.create({
                    idProduct: product.dataValues.id,
                    timePromotion: 0,
                    numberPercent: 0,
                    id: uuidv4(),
                });

                let date = new Date();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();

                if (data.listClassify?.length > 0) {
                    let money = 0;

                    data.listClassify.forEach(async (item, index) => {
                        money =
                            money + item.amount * (item.priceClassify * 0.95);
                        let classifyProduct = await db.classifyProduct.create({
                            idProduct: product.dataValues.id,
                            amount: item.amount,
                            nameClassifyProduct:
                                item.nameClassify.toLowerCase() !== 'default'
                                    ? item.nameClassify.toLowerCase()
                                    : 'Mặt định',
                            STTImg: item.STTImg ? +item.STTImg : -1,
                            priceClassify: +item.priceClassify,
                            id: uuidv4(),
                        });
                    });

                    let moneyBill = await db.moneyBills.findOne({
                        where: {
                            month,
                            year,
                            type: 'nhap',
                        },
                        raw: false,
                    });

                    if (moneyBill) {
                        moneyBill.money = moneyBill.money + money;
                        await moneyBill.save();
                    } else {
                        await db.moneyBills.create({
                            id: uuidv4(),
                            year,
                            month,
                            type: 'nhap',
                            money,
                        });
                    }
                } else {
                    let classifyProduct = await db.classifyProduct.create({
                        idProduct: product.dataValues.id,
                        amount: +data.sl,
                        nameClassifyProduct: 'default',
                        STTImg: -1,
                        id: uuidv4(),
                    });

                    let moneyBill = await db.moneyBills.findOne({
                        where: {
                            month,
                            year,
                            type: 'nhap',
                        },
                        raw: false,
                    });

                    if (moneyBill) {
                        moneyBill.money =
                            moneyBill.money +
                            +product.priceProduct * 0.95 * +data.sl;
                        await moneyBill.save();
                    } else {
                        await db.moneyBills.create({
                            id: uuidv4(),
                            year,
                            month,
                            type: 'nhap',
                            money: +product.priceProduct * 0.95 * +data.sl,
                        });
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Create a new product success!',
                    idProduct: product.dataValues.id,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const cloudinaryUpload = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.files || !data.query.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let array = data.files.map((item, index) => {
                    return {
                        id: uuidv4(),
                        imagebase64: item.path,
                        idProduct: data.query.idProduct,
                        STTImage: index + 1,
                    };
                });

                await db.imageProduct.bulkCreate(array, {
                    individualHooks: true,
                });
                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListProductByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                // let whereType = data.idTypeProduct !== 'all' || !data.idTypeProduct ? {
                //     idTypeProduct: data.idTypeProduct
                // } : null

                // let wherename = data?.nameProduct ? {
                //     nameProduct: {
                //         [Op.substring]: data?.nameProduct
                //     }
                // } : null

                let where;
                if (
                    (!data.idTypeProduct || data.idTypeProduct === 'all') &&
                    !data?.nameProduct
                ) {
                    where = null;
                } else if (
                    data?.idTypeProduct &&
                    data?.idTypeProduct !== 'all' &&
                    data?.nameProduct
                ) {
                    let name = data?.nameProduct?.toLowerCase().trim();
                    where = {
                        idTypeProduct: data.idTypeProduct,
                        nameProduct: {
                            [Op.substring]: name,
                        },
                    };
                } else if (
                    data?.idTypeProduct &&
                    data?.idTypeProduct !== 'all' &&
                    !data?.nameProduct
                ) {
                    where = {
                        idTypeProduct: data.idTypeProduct,
                    };
                } else if (
                    (!data.idTypeProduct || data.idTypeProduct === 'all') &&
                    data?.nameProduct
                ) {
                    let name = data?.nameProduct?.toLowerCase().trim();
                    console.log('name: ', name);
                    where = {
                        nameProduct: {
                            [Op.substring]: name,
                        },
                    };
                }

                let page = +data.page;
                let products = await db.product.findAll({
                    where: where,
                    offset: (page - 1) * 5,
                    limit: 5,
                    include: [
                        {
                            model: db.typeProduct,
                            attributes: ['id', 'nameTypeProduct'],
                        },
                        {
                            model: db.trademark,
                            attributes: ['id', 'nameTrademark'],
                        },
                        {
                            model: db.imageProduct,
                            as: 'imageProduct-product',
                        },
                        {
                            model: db.classifyProduct,
                            as: 'classifyProduct-product',
                        },
                        {
                            model: db.promotionProduct,
                        },
                    ],
                    order: [
                        ['stt', 'DESC'],
                        [
                            {
                                model: db.imageProduct,
                                as: 'imageProduct-product',
                            },
                            'STTImage',
                            'asc',
                        ],
                    ],
                    nest: true,
                    raw: false,
                });

                const count = await db.product.count({ where: where });

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data: products,
                    count: count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const blockProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.isSell || !data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct,
                    },
                    raw: false,
                });

                if (!product) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm này!',
                    });
                } else {
                    product.isSell = data.isSell;
                    await product.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Đã khóa sản phẩm!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const editProductById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.nameProduct ||
                !data.priceProduct ||
                !data.idTypeProduct ||
                !data.idTrademark ||
                !data.contentHTML ||
                !data.contentMarkdown ||
                !data.idProduct
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct,
                    },
                    raw: false,
                });

                if (!product) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy sản phẩm này!',
                    });
                } else {
                    //update tien nhap hang

                    let date = new Date(product.createdAt);
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();

                    let moneyBill = await db.moneyBills.findOne({
                        where: {
                            year,
                            month,
                            type: 'nhap',
                        },
                        raw: false,
                    });

                    if (moneyBill) {
                        let listClassifyOld = await db.classifyProduct.findAll({
                            where: {
                                idProduct: data.idProduct,
                            },
                        });

                        listClassifyOld.forEach((item) => {
                            if (item.nameClassifyProduct === 'default') {
                                moneyBill.money =
                                    moneyBill.money -
                                    +product.priceProduct * 0.95 * item.amount;
                            } else {
                                moneyBill.money =
                                    moneyBill.money -
                                    +item.priceClassify * 0.95 * item.amount;
                            }
                        });

                        // await moneyBill.save()
                    }

                    product.nameProduct = data.nameProduct.toLowerCase();
                    product.nameProductEn = data.nameProduct
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/đ/g, 'd')
                        .replace(/Đ/g, 'D');
                    product.priceProduct = data.priceProduct;
                    product.idTypeProduct = data.idTypeProduct;
                    product.idTrademark = data.idTrademark;
                    product.contentHTML = data.contentHTML;
                    product.contentMarkdown = data.contentMarkdown;

                    await product.save();

                    if (data.listClassify.length === 0) {
                        await db.classifyProduct.destroy({
                            where: {
                                idProduct: data.idProduct,
                            },
                        });

                        await db.classifyProduct.create({
                            idProduct: data.idProduct,
                            amount: +data.sl,
                            nameClassifyProduct: 'default',
                            STTImg: -1,
                            id: uuidv4(),
                        });

                        moneyBill.money =
                            moneyBill.money +
                            +data.priceProduct * 0.95 * +data.sl;
                        await moneyBill.save();
                    } else {
                        await db.classifyProduct.destroy({
                            where: {
                                idProduct: data.idProduct,
                            },
                        });

                        let arrClassify = data.listClassify.map(
                            (item, index) => {
                                moneyBill.money =
                                    moneyBill.money +
                                    +item.priceClassify * 0.95 * +item.amount;
                                return {
                                    idProduct: data.idProduct,
                                    amount: +item.amount,
                                    nameClassifyProduct:
                                        item.nameClassify.toLowerCase(),
                                    STTImg: item.STTImg ? +item.STTImg : -1,
                                    priceClassify: item.priceClassify,
                                    id: uuidv4().toString(),
                                };
                            }
                        );
                        await db.classifyProduct.bulkCreate(arrClassify, {
                            individualHooks: true,
                        });
                        await moneyBill.save();
                    }

                    await db.cart.destroy({
                        where: {
                            idProduct: data.idProduct,
                        },
                    });

                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const editImageProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.file || !data.query.num || !data.query.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let imageProduct = await db.imageProduct.findOne({
                    where: {
                        idProduct: data.query.idProduct,
                        STTImage: +data.query.num,
                    },
                    raw: false,
                });

                if (imageProduct) {
                    console.log('xoa 2');
                    let idCloudinary = imageProduct.imagebase64
                        .split('/')
                        .pop()
                        .split('.')[0];
                    cloudinary.v2.uploader
                        .destroy(`Image_product/${idCloudinary}`)
                        .then((res) => {
                            console.log('res: ', res);
                        });

                    imageProduct.imagebase64 = data.file.path;
                    await imageProduct.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                } else {
                    await db.imageProduct.create({
                        idProduct: data.query.idProduct,
                        imagebase64: data.file.path,
                        STTImage: +data.query.num,
                        id: uuidv4(),
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const swapImageProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.imageProducts || !data.idProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let arrImg = data.imageProducts.map((item) => item.url);
                let listImage = await db.imageProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                        imagebase64: {
                            [Op.notIn]: arrImg,
                        },
                    },
                });
                listImage.forEach(async (item) => {
                    console.log('xoa 1');
                    let idCloudinary = item.imagebase64
                        .split('/')
                        .pop()
                        .split('.')[0];
                    console.log('idcloud', idCloudinary);
                    cloudinary.v2.uploader.destroy(idCloudinary);
                });

                await db.imageProduct.destroy({
                    where: {
                        idProduct: data.idProduct,
                        imagebase64: {
                            [Op.notIn]: arrImg,
                        },
                    },
                });
                // let arrImageProduct = data.imageProducts.map((item) => {
                //     return {
                //         idProduct: data.idProduct,
                //         imagebase64: item.url,
                //         STTImage: +item.num,
                //         id: uuidv4()
                //     }
                // })
                // await db.imageProduct.bulkCreate(arrImageProduct, { individualHooks: true })
                resolve({
                    errCode: 0,
                    errMessage: 'Sắp xếp ảnh thành công!',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getProductBySwapAndPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.currentPage || !data.typeSwap) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let arr = [
                    ['stt', 'DESC'],
                    ['stt', 'ASC'],
                    ['nameProduct', 'ASC'],
                    ['nameProduct', 'DESC'],
                ];
                let page = +data.currentPage;
                let products = await db.product.findAll({
                    offset: (page - 1) * 10,
                    limit: 10,
                    attributes: ['id', 'nameProduct', 'stt'],
                    include: [
                        {
                            model: db.typeProduct,
                            attributes: ['id', 'nameTypeProduct'],
                        },
                        {
                            model: db.trademark,
                            attributes: ['id', 'nameTrademark'],
                        },
                        {
                            model: db.promotionProduct,
                            attributes: ['timePromotion', 'numberPercent'],
                        },
                    ],
                    order: [arr[+data.typeSwap - 1]],
                    nest: true,
                    raw: false,
                });

                if (products) {
                    let count = await db.product.count();

                    resolve({
                        errCode: 0,
                        errMessage: 'ok!',
                        data: products,
                        count: count,
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

const addPromotionByIdProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idProduct ||
                !data.timePromotion ||
                !data.persentPromotion
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let [promotion, created] =
                    await db.promotionProduct.findOrCreate({
                        where: {
                            idProduct: data.idProduct,
                        },
                        defaults: {
                            timePromotion: data.timePromotion + '',
                            numberPercent: +data.persentPromotion,
                            id: uuidv4(),
                        },
                        raw: false,
                    });
                if (created) {
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                    });
                } else {
                    promotion.timePromotion = data.timePromotion;
                    promotion.numberPercent = +data.persentPromotion;
                    await promotion.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'ok',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const testApi = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let datas = await db.typeProduct.findAll({
                include: [{ model: db.trademark }],
                // nest: true,
                // raw: false
            });

            resolve({
                data: datas,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteErrorProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                await db.product.destroy({
                    where: {
                        id: data.id,
                    },
                });

                await db.classifyProduct.destroy({
                    where: {
                        idProduct: data.id,
                    },
                });

                await db.imageProduct.destroy({
                    where: {
                        idProduct: data.id,
                    },
                });

                resolve({
                    errCode: 0,
                    errMessage: 'da xoa all',
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const confirmBillById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (bill) {
                    bill.idStatusBill = '2';
                    await bill.save();

                    //update amount product
                    let detailBill = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id,
                        },
                    });

                    let classifyProduct = await db.classifyProduct.findAll({
                        include: [
                            {
                                model: db.detailBill,
                                where: {
                                    idBill: bill.id,
                                },
                            },
                        ],
                        raw: false,
                        nest: true,
                    });
                    let check = true;
                    detailBill.forEach((item, index) => {
                        if (classifyProduct[index].amount < item.amount)
                            check = false;
                    });

                    if (!check) {
                        resolve({
                            errCode: 3,
                            errMessage:
                                'Số lượng sản phẩm trong kho không còn đủ!',
                        });
                        return;
                    } else {
                        detailBill.forEach(async (item, index) => {
                            classifyProduct[index].amount =
                                classifyProduct[index].amount - item.amount;
                            await classifyProduct[index].save();
                        });
                    }

                    //send email
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.id,
                                },
                            },
                        ],
                        raw: false,
                        nest: true,
                    });

                    let date =
                        new Date().getDate() +
                        '/' +
                        (new Date().getMonth() + 1) +
                        '/' +
                        new Date().getFullYear();

                    let contentHTML = `
                    <div style="margin: 20px auto 0;width: min(100%,500px);padding: 10px;border: 1px solid #000;">
        <img src="https://res.cloudinary.com/dultkpqjp/image/upload/v1676188615/logo-full_yrga3v.png" alt="logo"
            style="width: min(50%,120px);margin: 0 auto;display: block;" />

        <br>
        <div>Xin chào ${user.firstName + ' ' + user.lastName},</div>
        <br>
        <div>
            Đơn hàng
            <span style="color: red;text-transform: uppercase;"> #${bill.id
                        } </span>
            của bạn đã được duyệt và đang tiến hành giao hàng ngày ${date}.
        </div>
        <br>
        <div>
            Vui lòng đăng nhập TechStoreTvT để xem thông tin đơn hàng. Vui lòng kiểm tra cuộc gọi từ Shipper để nhận
            hàng trong thời gian sắp tới. Xin cảm ơn quý khách.
        </div>

        <a href="${process.env.LINK_FONTEND
                        }" style="margin: 0 auto;display: block;background-color: red;color: #fff;border: none;
        padding: 10px 20px;border-radius: 4px;cursor: pointer;width: fit-content;text-decoration: none;">Ghé thăm
            website</a>

    </div>
                    `;

                    if (user && user.typeAccount === 'web') {
                        console.log('giong');
                        sendEmail(
                            user.email,
                            'Đơn hàng của bạn đã được xác nhận và đang tiến hành giao hàng',
                            contentHTML
                        );
                    }
                    resolve({
                        errCode: 0,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bill not found!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const cancelBillById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (bill) {
                    bill.idStatusBill = '4';
                    bill.noteCancel = data.note;
                    await bill.save();

                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.id,
                                },
                            },
                        ],
                        raw: false,
                        nest: true,
                    });
                    let date =
                        new Date().getDate() +
                        '/' +
                        (new Date().getMonth() + 1) +
                        '/' +
                        new Date().getFullYear();

                    let contentHTML = `
                    <div style="margin: 20px auto 0;width: min(100%,500px);padding: 10px;border: 1px solid #000;">
        <img src="https://res.cloudinary.com/dultkpqjp/image/upload/v1676188615/logo-full_yrga3v.png" alt="logo"
            style="width: min(50%,120px);margin: 0 auto;display: block;" />

        <br>
        <div>Xin chào ${user.firstName + ' ' + user.lastName},</div>
        <br>
        <div>
            Đơn hàng
            <span style="color: red;text-transform: uppercase;"> #${bill.id
                        } </span>
            của bạn đã bị hủy ngày ${date}.
        </div>
        <br>
        <div>
            <b>Với lý do: </b>
            ${data.note}
        </div>
        <br>
        <div>
            TechStoreTvT rất tiếc vì không thể phục vụ quý khác đúng như mong đợi, cảm ơn quý khác đã ghé thắm và tin
            tưởng sử dụng dịch vụ của chúng tôi. Xin cảm ơn.
        </div>

    </div>
                    `;

                    if (user && user.typeAccount === 'web') {
                        console.log('giong');
                        sendEmail(
                            user.email,
                            'Đơn hàng của bạn đã bị hủy',
                            contentHTML
                        );
                    }

                    resolve({
                        errCode: 0,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bill not found!',
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createNewKeyWord = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.nameKeyword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let [keyword, created] = await db.keywordSearchs.findOrCreate({
                    where: {
                        keyword: data.nameKeyword.toLowerCase(),
                    },
                    defaults: {
                        amount: 1,
                        id: uuidv4(),
                    },
                    raw: false,
                });

                if (!created) {
                    keyword.amount = keyword.amount + 1;
                    await keyword.save();

                    resolve({
                        errCode: 0,
                    });
                } else {
                    resolve({
                        errCode: 0,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createNotify_noimage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.title ||
                !data.content ||
                !data.link ||
                !data.typeNotify
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                if (!data.timePost || +data.timePost === 0) {
                    let users = await db.User.findAll({
                        where: {
                            statusUser: {
                                [Op.ne]: 'false',
                            },
                        },
                    });
                    let date = new Date().getTime();
                    users = users.filter((item) => {
                        return (
                            item.statusUser === 'true' ||
                            item.statusUser * 1 < date
                        );
                    });
                    let arr = users.map((item) => {
                        return {
                            id: uuidv4(),
                            title: data.title,
                            content: data.content,
                            redirect_to: data.link,
                            idUser: item.id,
                            typeNotify: data.typeNotify,
                            timeCreate: date,
                        };
                    });
                    await db.notifycations.bulkCreate(arr, {
                        individualHooks: true,
                    });
                    handleEmit('new-notify-all', {
                        title: data.title,
                        content: data.content,
                    });
                } else {
                    await db.timerNotifys.create({
                        id: uuidv4(),
                        title: data.title,
                        content: data.content,
                        redirect_to: data.link,
                        typeNotify: data.typeNotify,
                        status: 'false',
                        timer: +data.timePost,
                    });
                }

                // setTimeout(async () => {
                //     let arr = users.map(item => {
                //         return {
                //             id: uuidv4(),
                //             title: data.title,
                //             content: data.content,
                //             redirect_to: data.link,
                //             idUser: item.id,
                //             typeNotify: data.typeNotify,
                //             timeCreate: date,
                //         }
                //     })
                //     await db.notifycations.bulkCreate(arr, { individualHooks: true })
                //     handleEmit('new-notify-all', { title: data.title, content: data.content })

                // }, data.timePost * 1 - date > 0 ? data.timePost * 1 - date : 0);

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createNotify_image = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.file ||
                !data.query.title ||
                !data.query.content ||
                !data.query.link ||
                !data.query.typeNotify
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let isLogin = await checkLoginAdmin(data.query.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }
                // console.log(data);

                if (!data.query.timePost || +data.query.timePost === 0) {
                    let users = await db.User.findAll({
                        where: {
                            statusUser: {
                                [Op.ne]: 'false',
                            },
                        },
                    });
                    let date = new Date().getTime();
                    users = users.filter((item) => {
                        return (
                            item.statusUser === 'true' ||
                            item.statusUser * 1 < date
                        );
                    });
                    let arr = users.map((item) => {
                        return {
                            id: uuidv4(),
                            title: data.query.title,
                            content: data.query.content,
                            redirect_to: data.query.link,
                            idUser: item.id,
                            typeNotify: data.query.typeNotify,
                            timeCreate: date,
                            urlImage: data.file.path,
                        };
                    });
                    await db.notifycations.bulkCreate(arr, {
                        individualHooks: true,
                    });
                    handleEmit('new-notify-all', {
                        title: data.query.title,
                        content: data.query.content,
                    });
                } else {
                    await db.timerNotifys.create({
                        id: uuidv4(),
                        title: data.query.title,
                        content: data.query.content,
                        redirect_to: data.query.link,
                        typeNotify: data.query.typeNotify,
                        status: 'false',
                        urlImage: data.file.path,
                        timer: +data.query.timePost,
                    });
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

const CreateToken = (user) => {
    const { id, idGoogle, firstName, idTypeUser } = user;
    const accessToken = jwt.sign(
        { id, idGoogle, firstName, idTypeUser },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '60m',
        }
    );
    const refreshToken = jwt.sign(
        { id, idGoogle, firstName, idTypeUser },
        process.env.REFESH_TOKEN_SECRET,
        {
            expiresIn: '7d',
        }
    );

    return { accessToken, refreshToken };
};

const CheckLoginAdminAccessToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let decode = decodeToken(
                    data.accessToken,
                    data.type === 'accessToken'
                        ? process.env.ACCESS_TOKEN_SECRET
                        : process.env.REFESH_TOKEN_SECRET
                );
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage:
                            'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode,
                    });
                } else {
                    let type = data.typeUser === 'root' ? ['1'] : ['1', '2'];

                    let user = await db.User.findOne({
                        where: {
                            id: decode.id,
                            idTypeUser: {
                                [Op.or]: type,
                            },
                        },
                    });
                    if (user) {
                        let tokens;
                        if (data?.type === 'refreshToken') {
                            tokens = CreateToken(user);
                        }

                        resolve({
                            errCode: 0,
                            data: tokens,
                        });
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found user!',
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createNewUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.username || !data.pass) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                });
            } else {
                let decode = decodeToken(
                    data.accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage:
                            'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode,
                    });
                } else {
                    let passHash = hashPassword(data.pass);
                    let [user, create] = await db.User.findOrCreate({
                        where: {
                            email: data.username,
                        },
                        defaults: {
                            id: uuidv4(),
                            pass: passHash,
                            firstName: 'Admin',
                            typeAccount: 'web',
                            idTypeUser: '2',
                            statusUser: 'true',
                            avatarUpdate: `${process.env.LINK_FONTEND}/images/user/avatar_admin.png`,
                        },
                    });
                    if (create) {
                        resolve({
                            errCode: 0,
                        });
                        return;
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tài khoản này đã tồn tại!',
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || data.nameUser === undefined) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data,
                });
            } else {
                let decode = decodeToken(
                    data.accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage:
                            'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode,
                    });
                } else {
                    if (data.nameUser === '') {
                        let listUsers = await db.User.findAll({
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'sdt',
                                'gender',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'typeAccount',
                                'statusUser',
                            ],
                            where: {
                                idTypeUser: {
                                    [Op.notIn]: ['1', '2'],
                                },
                            },
                            limit: 50,
                        });

                        resolve({
                            errCode: 0,
                            data: listUsers,
                        });
                    } else {
                        let listUsers = await db.User.findAll({
                            attributes: [
                                'id',
                                'firstName',
                                'lastName',
                                'sdt',
                                'gender',
                                'avatarGoogle',
                                'avatarFacebook',
                                'avatarGithub',
                                'avatarUpdate',
                                'typeAccount',
                                'statusUser',
                            ],
                            where: {
                                idTypeUser: {
                                    [Op.notIn]: ['1', '2'],
                                },
                            },
                        });

                        const searcher = new FuzzySearch(
                            listUsers,
                            ['firstName'],
                            {
                                caseSensitive: false,
                                sort: true,
                            }
                        );
                        // let key = args.keyword.normalize('NFD')
                        //     .replace(/[\u0300-\u036f]/g, '')
                        //     .replace(/đ/g, 'd').replace(/Đ/g, 'D');

                        const result = searcher.search(data.nameUser);

                        resolve({
                            errCode: 0,
                            data: result,
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const lockUserAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idUser || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data,
                });
            } else {
                let decode = decodeToken(
                    data.accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage:
                            'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode,
                    });
                } else {
                    let user = await db.User.findOne({
                        where: {
                            id: data.idUser,
                        },
                        raw: false,
                    });

                    if (!user) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy tài khoản này!',
                        });
                        return;
                    } else {
                        user.statusUser = data.status;
                        await user.save();

                        if (data.status !== 'true')
                            handleEmit(`khoa_tai_khoan_${user.id}`, '');

                        resolve({
                            errCode: 0,
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createEventPromotion = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.accessToken ||
                !data.nameEvent ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.arrProduct
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let arrProduct = JSON.parse(data?.arrProduct);
                if (arrProduct?.length < 5) {
                    resolve({
                        errCode: 3,
                        errMessage:
                            'Vui lòng chọn ít nhất 5 sản phẩm cho sự kiện!',
                    });
                    return;
                }

                let idEventPromotion = uuidv4();

                await db.eventPromotions.create({
                    id: idEventPromotion,
                    nameEvent: data.nameEvent,
                    timeStart: +data.timeStart,
                    timeEnd: +data.timeEnd,
                    // cover: data.file.path,
                    // idCover: data.file.filename,
                    firstContent: data.firstContent ?? '',
                    lastContent: data.lastContent ?? '',
                });

                let arrProductEvent = arrProduct?.map((item) => ({
                    id: uuidv4(),
                    idEventPromotion,
                    idProduct: item.id,
                }));

                await db.productEvents.bulkCreate(arrProductEvent, {
                    individualHooks: true,
                });

                arrProduct?.forEach(async (item) => {
                    await db.promotionProduct.update(
                        {
                            timePromotion: +data.timeEnd,
                            numberPercent: +item.numberPercent,
                        },
                        {
                            where: {
                                idProduct: item.id,
                            },
                        }
                    );
                });

                const date = new Date(+data.timeStart);
                const date2 = new Date().getTime();

                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                const formattedDate = `${day}/${month}/${year}`;

                let listUser = await db.User.findAll({
                    where: {
                        idTypeUser: '3',
                        statusUser: {
                            [Op.ne]: 'false',
                        },
                    },
                });
                listUser?.forEach((item) => {
                    db.notifycations.create({
                        id: uuidv4(),
                        title: data.nameEvent,
                        content: `Sự kiến mới sắp ra mắt từ ${formattedDate}`,
                        timeCreate: date2,
                        typeNotify: 'promotion',
                        idUser: item.id,
                        redirect_to: `/promotion/${idEventPromotion}`,
                    });
                });

                handleEmit('new-notify-all', {
                    title: data.nameEvent,
                    content: `Sự kiến mới sắp ra mắt từ ${formattedDate}`,
                });

                resolve({
                    errCode: 0,
                    idEventPromotion,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const upLoadImageCoverPromotion = ({ file, query }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file || !query.idEventPromotion) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data,
                });
            } else {
                await db.eventPromotions.update(
                    { cover: file.path, idCover: file.filename },
                    {
                        where: {
                            id: query.idEventPromotion,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListEventPromotion = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let date = new Date().getTime();
            let listEventPromotion = await db.eventPromotions.findAll({
                where: {
                    timeEnd: {
                        [Op.gt]: date,
                    },
                },
                order: [['stt', 'DESC']],
                attributes: {
                    exclude: ['firstContent', 'lastContent'],
                },
            });

            resolve({
                errCode: 0,
                data: listEventPromotion,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const editEventPromotion = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.accessToken ||
                !data.nameEvent ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.idEventPromotion
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data: data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                await db.eventPromotions.update(
                    {
                        nameEvent: data.nameEvent,
                        timeStart: +data.timeStart,
                        timeEnd: +data.timeEnd,
                        firstContent: data.firstContent ?? '',
                        lastContent: data.lastContent ?? '',
                    },
                    {
                        where: {
                            id: data.idEventPromotion,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListBillByTypeAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                console.log('idbill', data.idBill || '-');
                if (+data.type === 1 || +data.type === 3 || +data.type === 4) {
                    if (+data.type === 3) {
                        let listBill = await db.bill.findAll({
                            where: {
                                id: {
                                    [Op.substring]: data.idBill || '-',
                                },
                                idStatusBill: {
                                    [Op.between]: [2.99, 3],
                                },
                            },
                            order: [['updatedAt', 'DESC']],
                        });
                        resolve({
                            errCode: 0,
                            data: listBill,
                        });

                        return;
                    }
                    let listBill = await db.bill.findAll({
                        where: {
                            id: {
                                [Op.substring]: data.idBill || '-',
                            },
                            idStatusBill: +data.type,
                        },
                        order: [['updatedAt', 'DESC']],
                    });
                    resolve({
                        errCode: 0,
                        data: listBill,
                    });
                } else if (+data.type === 2) {
                    let listBill = await db.bill.findAll({
                        where: {
                            id: {
                                [Op.substring]: data.idBill || '-',
                            },
                            idStatusBill: {
                                [Op.between]: [2, 2.98],
                            },
                        },
                        order: [['updatedAt', 'DESC']],
                    });
                    resolve({
                        errCode: 0,
                        data: listBill,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateStatusBillAdminWeb = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idBill || !data.status) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill,
                    },
                    raw: false,
                });

                if (!bill) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy hóa đơn!',
                    });
                    return;
                }

                let date = new Date().getTime();
                //xac nhan
                if (data.status === 'confirm') {
                    if (bill.idStatusBill === 1) {
                        bill.idStatusBill = 2;
                        await bill.save();

                        await db.statusBills.create({
                            id: uuidv4(),
                            idBill: bill.id,
                            nameStatus: 'Đang giao',
                            idStatusBill: bill.idStatusBill,
                            timeStatus: new Date().getTime(),
                        });

                        let user = await db.User.findOne({
                            include: [
                                {
                                    model: db.bill,
                                    where: {
                                        id: data.idBill,
                                    },
                                },
                            ],
                            nest: true,
                            raw: false,
                        });
                        await db.notifycations.create({
                            id: uuidv4(),
                            title: 'Đơn hàng đã xác nhận',
                            content: `Đơn hàng ${data.idBill} đã được xác nhận`,
                            timeCreate: date,
                            typeNotify: 'order',
                            idUser: user.id,
                            redirect_to: '/user/purchase?type=2',
                        });

                        handleEmit(`new-notify-${user.id}`, {
                            title: 'Đơn hàng của bạn đã được xác nhận',
                            content: 'Vào website để xem chi tiết',
                        });

                        //send email
                        if (user?.typeAccount === 'web') {
                            let content = contentEmailConfirmBill();
                            sendEmail(
                                user.email,
                                'Đơn hàng của bạn đã được xác nhận',
                                content
                            );
                        }
                    }
                    resolve({
                        errCode: 0,
                    });
                    return;
                }

                //thay doi trang thai
                if (data.status === 'change') {
                    if (!data.nameStatus) {
                        resolve({
                            errCode: 4,
                            errMessage:
                                'Vui lòng cung cấp mô tả cho cập nhật này!',
                        });
                        return;
                    }

                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill,
                                },
                            },
                        ],
                        nest: true,
                        raw: false,
                    });

                    bill.idStatusBill = (bill.idStatusBill + 0.01).toFixed(2);
                    bill.timeBill = date;
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: data.nameStatus,
                        idStatusBill: bill.idStatusBill,
                        timeStatus: new Date().getTime(),
                    });

                    // await notifycations.destroy({
                    //     where: {
                    //         title: `Cập nhật trạng thái đơn hàng ${data.idBill}`
                    //     }
                    // });

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Cập nhật trạng thái đơn hàng ${data.idBill}`,
                        content: data.nameStatus,
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=2',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: data.nameStatus,
                        content: 'Vào website để xem chi tiết',
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentUpdateStatusBill();
                        sendEmail(
                            user.email,
                            'Cập nhật trạng thái đơn hàng',
                            content
                        );
                    }

                    resolve({
                        errCode: 0,
                    });
                    return;
                }

                //hoan thanh
                if (data.status === 'success') {
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill,
                                },
                            },
                        ],
                        nest: true,
                        raw: false,
                    });

                    bill.idStatusBill = 2.99;
                    bill.timeBill = date;
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã giao',
                        idStatusBill: 2.99,
                        timeStatus: new Date().getTime(),
                    });

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã hoàn thành`,
                        content: 'Đơn hàng đã đến tay người mua',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=3',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao thành công',
                        content: `Đơn hàng ${data.idBill} đã được hoàn thành`,
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentSuccessBill();
                        sendEmail(user.email, 'Giao hàng thành công', content);
                    }

                    resolve({
                        errCode: 0,
                    });
                    return;
                }

                //huy don
                if (data.status === 'cancel') {
                    if (!data.noteCancel) {
                        resolve({
                            errCode: 4,
                            errMessage:
                                'Vui lòng cung cấp mô tả cho cập nhật này!',
                        });
                        return;
                    }
                    let user = await db.User.findOne({
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    id: data.idBill,
                                },
                            },
                        ],
                        nest: true,
                        raw: false,
                    });

                    bill.idStatusBill = 4;
                    bill.timeBill = date;
                    bill.noteCancel = data.noteCancel;
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã hủy',
                        idStatusBill: 4,
                        timeStatus: new Date().getTime(),
                    });

                    //increase amount product
                    let detailBills = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id,
                        },
                    });

                    detailBills.forEach(async (item) => {
                        let classify = await db.classifyProduct.findOne({
                            where: {
                                id: item.idClassifyProduct,
                            },
                            raw: false,
                        });
                        if (classify) {
                            classify.amount = classify.amount + item.amount;
                            await classify.save();
                        }
                    });

                    //notify
                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã bị hủy`,
                        content: 'Giao hàng thất bại',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=4',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao hàng thất bại',
                        content: `Đơn hàng ${data.idBill} đã bị hủy`,
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentFailBill();
                        sendEmail(
                            user.email,
                            `Đơn hàng ${data.idBill} đã bị hủy`,
                            content
                        );
                    }

                    resolve({
                        errCode: 0,
                    });
                    return;
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListVideoAdminByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let where = null;
                if (data.idSearch) {
                    where = {
                        id: {
                            [Op.substring]: data.idSearch,
                        },
                    };
                } else if (data.titleSearch) {
                    where = {
                        content: {
                            [Op.substring]: data.titleSearch,
                        },
                    };
                }

                let listVideo = await db.shortVideos.findAll({
                    where: where,
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    include: [
                        {
                            model: db.User,
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let count = await db.shortVideos.count({ where: where });

                resolve({
                    errCode: 0,
                    data: listVideo,
                    count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteShortVideoAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idShortVideo || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                // let user1 = await db.User.findOne({
                //     include: [
                //         {
                //             model: db.shortVideos,
                //             where: {
                //                 id: data.idShortVideo
                //             }
                //         }
                //     ],
                //     nest: true,
                //     raw: false
                // })
                // console.log(!user1);
                // resolve({
                //     errCode: 0,
                //     errMessage: 'Not found',
                // })
                // return

                let shortVideo = await db.shortVideos.findOne({
                    where: {
                        id: data.idShortVideo,
                    },
                    raw: false,
                });

                if (!shortVideo) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Not found',
                    });
                    return;
                }

                cloudinary.v2.uploader.destroy(`${shortVideo.idCloudinary}`);
                GG_Drive.deleteFile(shortVideo.idDriveVideo);

                db.hashTagVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                });

                db.commentShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                });

                db.likeShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                });

                db.collectionShortVideos.destroy({
                    where: {
                        idShortVideo: data.idShortVideo,
                    },
                });

                //thong bao
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.shortVideos,
                            where: {
                                id: data.idShortVideo,
                            },
                        },
                    ],
                    nest: true,
                    raw: false,
                });

                console.log(user);
                let date = new Date().getTime();

                if (!user) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy tác giả này',
                    });
                    return;
                }

                await db.notifycations.create({
                    id: uuidv4(),
                    title: `Video của bạn đã bị xóa`,
                    content: data.note,
                    timeCreate: date,
                    typeNotify: 'short_video',
                    idUser: user.id,
                    redirect_to: '/short-video/user',
                });

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Video của bạn đã bị xóa',
                    content: `${data.note}`,
                });

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentSuccessBill();
                    sendEmail(user.email, 'Video của bạn đã bị xóa', content);
                }

                shortVideo.destroy();
                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListReportAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listReportVideo = await db.reportVideos.findAll({
                    where: {
                        status: 'true',
                    },
                    include: [
                        {
                            model: db.shortVideos,
                            attributes: ['id', 'urlImage'],
                            where: {
                                id: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.User,
                            attributes: ['id', 'firstName'],
                        },
                    ],
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    raw: false,
                    nest: true,
                });

                let count = await db.reportVideos.count({
                    where: {
                        status: 'true',
                    },
                });

                resolve({
                    errCode: 0,
                    data: listReportVideo,
                    count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const skipReportVideoAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idReportVideo) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                await db.reportVideos.update(
                    { status: 'false' },
                    {
                        where: {
                            id: data.idReportVideo,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListBlogAdminByPage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let where = null;
                if (data.idSearch) {
                    where = {
                        id: {
                            [Op.substring]: data.idSearch,
                        },
                    };
                } else if (data.contentSearch) {
                    where = {
                        contentHTML: {
                            [Op.substring]: data.contentSearch,
                        },
                    };
                }

                let listBlog = await db.blogs.findAll({
                    where: where,
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'firstName'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let count = await db.blogs.count({ where: where });

                resolve({
                    errCode: 0,
                    data: listBlog,
                    count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteBlogAdminById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idBlog || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                //xoa blog
                let blog = await db.blogs.findOne({
                    where: {
                        id: data.idBlog,
                    },
                    raw: false,
                });

                if (!blog) {
                    resolve({
                        errCode: 3,
                        errMessage: 'Not found!',
                    });
                    return;
                }

                let videoBlog = await db.videoBlogs.findOne({
                    where: {
                        idBlog: data.idBlog,
                    },
                    raw: false,
                });
                if (videoBlog) {
                    GG_Drive.deleteFile(videoBlog.idDrive);
                    videoBlog.destroy();
                }
                let imageBlogs = await db.imageBlogs.findAll({
                    where: {
                        idBlog: data.idBlog,
                    },
                });
                if (imageBlogs && imageBlogs.length > 0) {
                    imageBlogs.map((item) => {
                        cloudinary.v2.uploader.destroy(item.idCloudinary);
                    });
                }
                db.imageBlogs.destroy({
                    where: {
                        idBlog: data.idBlog,
                    },
                });

                db.likeBlog.destroy({
                    where: {
                        idBlog: data.idBlog,
                    },
                });

                db.blogShares.destroy({
                    where: {
                        idBlog: data.idBlog,
                    },
                });

                db.commentBlog.destroy({
                    where: {
                        idBlog: data.idBlog,
                    },
                });

                //thong bao
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.blogs,
                            where: {
                                id: data.idBlog,
                            },
                        },
                    ],
                    nest: true,
                    raw: false,
                });

                // console.log(user);
                let date = new Date().getTime();

                if (!user) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy tác giả này',
                    });
                    return;
                }

                await db.notifycations.create({
                    id: uuidv4(),
                    title: `Bài viết của bạn đã bị xóa`,
                    content: data.note,
                    timeCreate: date,
                    typeNotify: 'blog',
                    idUser: user.id,
                    redirect_to: '/blogs/blog-user',
                });

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Bài viết của bạn đã bị xóa',
                    content: `${data.note}`,
                });

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentSuccessBill();
                    sendEmail(
                        user.email,
                        'Bài viết của bạn đã bị xóa',
                        content
                    );
                }
                blog.destroy();
                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListReportBlogAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.page) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listReportBlog = await db.reportBlogs.findAll({
                    where: {
                        status: 'true',
                    },
                    include: [
                        {
                            model: db.blogs,
                            attributes: ['id'],
                            where: {
                                id: {
                                    [Op.ne]: 'false',
                                },
                            },
                        },
                        {
                            model: db.User,
                            attributes: ['id', 'firstName'],
                        },
                    ],
                    limit: 10,
                    offset: (+data.page - 1) * 10,
                    raw: false,
                    nest: true,
                });

                let count = await db.reportBlogs.count({
                    where: {
                        status: 'true',
                    },
                });

                resolve({
                    errCode: 0,
                    data: listReportBlog,
                    count,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const skipReportBlogAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idReportBlog) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                await db.reportBlogs.update(
                    { status: 'false' },
                    {
                        where: {
                            id: data.idReportBlog,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getStatisticalAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                //countproduct
                let countProduct = await db.product.count();

                //sum price bill
                let revenue = await db.bill.sum('totals', {
                    where: {
                        idStatusBill: 3,
                    },
                });

                //count bill
                let countBill = await db.bill.count({
                    where: {
                        idStatusBill: 3,
                    },
                });

                //avg evaluate
                let countEvaluate = await db.evaluateProduct.count();
                let sumEvaluate = await db.evaluateProduct.sum('starNumber');

                //count user
                let countUser = await db.User.count({
                    where: {
                        idTypeUser: '3',
                    },
                });

                //count Video
                let countVideo = await db.shortVideos.count();

                //count blog
                let countBlog = await db.blogs.count();

                //count bill to day
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                const startOfDayTimestamp = currentDate.getTime();
                let countBillToday = await db.bill.count({
                    where: {
                        idStatusBill: {
                            [Op.gte]: 1,
                        },
                    },
                    include: [
                        {
                            model: db.statusBills,
                            where: {
                                idStatusBill: 1,
                                timeStatus: {
                                    [Op.gt]: startOfDayTimestamp,
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                //sum price bill today
                let listBillToday = await db.bill.findAll({
                    where: {
                        idStatusBill: {
                            [Op.gte]: 1,
                        },
                    },
                    include: [
                        {
                            model: db.statusBills,
                            where: {
                                idStatusBill: 1,
                                timeStatus: {
                                    [Op.gt]: startOfDayTimestamp,
                                },
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let revenueToday = 0;
                listBillToday.forEach((item) => {
                    revenueToday += item.totals;
                });

                resolve({
                    errCode: 0,
                    data: {
                        countProduct,
                        revenue,
                        countBill,
                        avgStart: (sumEvaluate / countEvaluate).toFixed(1),
                        countUser,
                        countVideo,
                        countBlog,
                        countBillToday: countBillToday,
                        revenueToday:
                            countBillToday === 0
                                ? 0
                                : revenueToday / countBillToday,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const StatisticalEvaluateAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let include = null;
                if (data.idProduct) {
                    console.log('vao1', data.idProduct);
                    let product = await db.product.findOne({
                        where: {
                            id: data.idProduct,
                        },
                    });
                    if (product)
                        include = [
                            {
                                model: db.product,
                                where: {
                                    id: data.idProduct.trim(),
                                },
                            },
                        ];
                }

                if (data.idTypeProduct) {
                    console.log('vao2');
                    include = [
                        {
                            model: db.product,
                            where: {
                                idTypeProduct: data.idTypeProduct,
                            },
                        },
                    ];
                }

                if (data.idTrademark) {
                    console.log('vao3');
                    include = [
                        {
                            model: db.product,
                            where: {
                                idTrademark: data.idTrademark,
                            },
                        },
                    ];
                }

                let count = await db.evaluateProduct.count({
                    include: include,
                });

                let count1 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 1,
                    },
                    include: include,
                });

                let count2 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 2,
                    },
                    include: include,
                });

                let count3 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 3,
                    },
                    include: include,
                });

                let count4 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 4,
                    },
                    include: include,
                });

                let count5 = await db.evaluateProduct.count({
                    where: {
                        starNumber: 5,
                    },
                    include: include,
                });

                // console.log('count', count);
                // console.log('count1', count1);
                // console.log('count2', count2);
                // console.log('count3', count3);
                // console.log('count4', count4);
                // console.log('count5', count5);

                // if (count === 0) {
                //     resolve({
                //         errCode: 0,
                //         errMessage: 'Not found product'
                //     })
                //     return
                // }

                resolve({
                    errCode: 0,
                    data: {
                        count1: count !== 0 ? (count1 / count) * 100 : 0,
                        count2: count !== 0 ? (count2 / count) * 100 : 0,
                        count3: count !== 0 ? (count3 / count) * 100 : 0,
                        count4: count !== 0 ? (count4 / count) * 100 : 0,
                        count5: count !== 0 ? (count5 / count) * 100 : 0,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getStatisticalSale = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let whereTypeProduct = null;
                if (data.idTypeProduct) {
                    whereTypeProduct = {
                        idTypeProduct: data.idTypeProduct,
                    };
                }

                let detailbills = await db.detailBill.findAll({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                idStatusBill: 3,
                            },
                        },
                        {
                            model: db.product,
                            where: whereTypeProduct,
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let arr = [];
                for (let i = 0; i < 12; i++) {
                    let rand = 0;
                    arr.push(rand);
                }

                detailbills?.forEach((item) => {
                    let month = new Date(item.updatedAt).getMonth();
                    let year = new Date(item.updatedAt).getFullYear();

                    if (year === +data.year) {
                        arr[month] = arr[month] + (item.amount + 5);
                    }
                });

                // console.log('arr', arr);

                resolve({
                    errCode: 0,
                    data: {
                        arr,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListKeyWordAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let where = null;
                if (data.nameKeyword) {
                    where = {
                        keyword: {
                            [Op.substring]: data.nameKeyword,
                        },
                    };
                }

                let listKeyWord = await db.keywordSearchs.findAll({
                    limit: 20,
                    where: where,
                    order: [['amount', 'DESC']],
                });

                resolve({
                    errCode: 0,
                    data: listKeyWord,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const editKeyWordSearchAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idKeyWord || !data.nameKeyword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                await db.keywordSearchs.update(
                    { keyword: data.nameKeyword },
                    {
                        where: {
                            id: data.idKeyWord,
                        },
                    }
                );

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteKeyWordAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idKeyWord) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                await db.keywordSearchs.destroy({
                    where: {
                        id: data.idKeyWord,
                    },
                });

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListUserTypeAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let decoded = decodeToken(
                    data.accessToken,
                    process.env.ACCESS_TOKEN_SECRET
                );
                if (!decoded) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chua co dang nhap!',
                    });
                    return;
                }

                let user = await db.User.findOne({
                    where: {
                        id: decoded.id,
                        idTypeUser: '1',
                    },
                });

                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'khong co quyen truy cap!',
                    });
                    return;
                }

                let where = {
                    idTypeUser: '2',
                };
                if (data.nameUser) {
                    where = {
                        firstName: {
                            [Op.substring]: data.nameUser,
                        },
                        idTypeUser: '2',
                    };
                }

                let listUser = await db.User.findAll({
                    where: where,
                    limit: 30,
                });

                resolve({
                    errCode: 0,
                    data: listUser,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const deleteEventPromotionAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idEvent) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let event = await db.eventPromotions.findOne({
                    where: {
                        id: data.idEvent,
                    },
                    raw: false,
                });
                if (event) {
                    await cloudinary.v2.uploader.destroy(`${event.idCover}`);
                    await event.destroy();
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

const getCountBillOfMonth = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.year) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listBill = await db.bill.findAll({
                    where: {
                        idStatusBill: 3,
                    },
                });

                let arr = [];
                for (let i = 0; i < 12; i++) {
                    arr.push(0);
                }

                console.log(listBill.length);

                listBill.forEach((item) => {
                    let month = new Date(item.updatedAt).getMonth();
                    let year = new Date(item.updatedAt).getFullYear();

                    if (year === +data.year) {
                        arr[month] = arr[month] + 1;
                    }
                });

                resolve({
                    errCode: 0,
                    data: arr,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getMoneyOfMonth = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.year) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listMoney = await db.moneyBills.findAll({
                    where: {
                        year: +data.year,
                    },
                });

                let arr1 = [];
                let arr2 = [];
                for (let i = 0; i < 12; i++) {
                    arr1.push(0);
                    arr2.push(0);
                }

                listMoney.forEach((item) => {
                    if (item.type === 'nhap') {
                        arr1[item.month - 1] =
                            arr1[item.month - 1] + item.money / 1000000;
                    } else {
                        arr2[item.month - 1] =
                            arr2[item.month - 1] + item.money / 1000000;
                    }
                });

                resolve({
                    errCode: 0,
                    data: {
                        arr1,
                        arr2,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailBillByIdAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idBill) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listProduct = await db.detailBill.findAll({
                    where: {
                        idBill: data.idBill,
                    },
                    include: [
                        {
                            model: db.classifyProduct,
                        },
                        {
                            model: db.product,
                            include: [
                                {
                                    model: db.imageProduct,
                                    as: 'imageProduct-product',
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                let adderssBill = await db.addressUser.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill,
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve({
                    errCode: 0,
                    data: {
                        listProduct,
                        adderssBill,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getInventoryByTypeProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idTypeProduct) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let isLogin = await checkLoginAdmin(data.accessToken);
                if (!isLogin) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chưa có đăng nhập!',
                    });
                    return;
                }

                let listproduct = await db.product.findAll({
                    where: {
                        idTypeProduct: {
                            [Op.substring]: data.idTypeProduct,
                        },
                    },
                });

                let arrId = listproduct.map((item) => item.id);

                let sum = await db.classifyProduct.sum('amount', {
                    where: {
                        idProduct: {
                            [Op.in]: arrId,
                        },
                    },
                });

                resolve({
                    errCode: 0,
                    data: {
                        sum: sum || 0,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const adminLogin = (data, header) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.pass) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email,
                        typeAccount: 'web',
                    },
                });

                if (!user) throw createError.NotFound('Not found account.');

                if (user.idTypeUser !== '1' && user.idTypeUser !== '2')
                    throw createError.Unauthorized('Login with account admin');

                if (user.statusUser === 'false')
                    throw createError.Unauthorized('Account was blocked.');

                if (user.statusUser !== 'true' && user.statusUser !== 'false') {
                    let now = new Date().getTime();
                    let time_block = +user.statusUser;

                    if (now < time_block)
                        throw createError.Unauthorized('Account was blocked.');
                }

                if (!commont.comparePassword(data.pass, user.pass))
                    throw createError.Unauthorized('Incorrect password');

                const accessToken = await signAccessToken(user.id);
                const refreshToken = await signRefreshToken(
                    user.id,
                    header['user-agent']
                );

                resolve({
                    errCode: 0,
                    data: {
                        accessToken,
                        refreshToken,
                    },
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const checkLoginWithAdmin = (data, payload) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idType)
                throw createError.BadRequest('Missing required para,eter.');
            console.log('Payload: ', payload);
            let user = await db.User.findOne({
                where: {
                    id: payload.id,
                },
            });

            if (!user) throw createError.NotFound('Not found account.');

            if (user.statusUser === 'false')
                throw createError.Unauthorized('Account was blocked.');
            if (user.statusUser !== 'true' && user.statusUser !== 'false') {
                let now = new Date().getTime();
                let time_block = +user.statusUser;
                if (now < time_block)
                    throw createError.Unauthorized('Account was blocked.');
            }

            if (data.idType === '2' && user.idTypeUser === '3')
                throw createError.Unauthorized('Login with account admin.');
            if (data.idType === '1' && user.idTypeUser !== '1') {
                return resolve({
                    errCode: 1,
                    errMessage: 'Login with admin root',
                });
            }

            resolve({
                errCode: 0,
            });
        } catch (e) {
            reject(e);
        }
    });
};

//winform
const getListBillNoConfirm = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listBills = await db.bill.findAll({
                where: {
                    idStatusBill: 1,
                },
            });

            resolve(listBills);
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([]);
            } else {
                let { count, rows } = await db.detailBill.findAndCountAll({
                    where: {
                        idBill: data.idBill,
                    },
                    include: [
                        {
                            model: db.product,
                            // include: [
                            //     {
                            //         model: db.classifyProduct, as: 'classifyProduct-product'
                            //     }
                            // ]
                        },
                        {
                            model: db.classifyProduct,
                        },
                    ],
                    nest: true,
                    raw: false,
                });

                let data2 = [];

                for (let i = 0; i < count; i++) {
                    let donGia;
                    if (
                        rows[i].classifyProduct.nameClassifyProduct !==
                        'default'
                    )
                        donGia = rows[i].classifyProduct.priceClassify;
                    else donGia = rows[i].product.priceProduct * 1;

                    let obj = {
                        maSP: rows[i].product.id,
                        tenSP: rows[i].product.nameProduct,
                        donGia,
                        soLuong: rows[i].amount,
                        phanLoai: rows[i].classifyProduct.nameClassifyProduct,
                    };
                    data2.push(obj);
                }

                resolve(data2);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListImageProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([]);
            } else {
                let images = await db.imageProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                    },
                });
                // console.log('images', images);

                resolve(images);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getInfoProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([]);
            } else {
                let product = await db.product.findOne({
                    where: {
                        id: data.idProduct,
                    },
                    include: [
                        { model: db.typeProduct },
                        { model: db.trademark },
                    ],
                    raw: false,
                    nest: true,
                });

                resolve([
                    {
                        tenSP: product.nameProduct,
                        daBan: product.sold,
                        tinhTrang:
                            product.isSell === 'true' ? 'Còn bán' : 'Ngừng bán',
                        danhMuc: product.typeProduct.nameTypeProduct,
                        thuongHieu: product.trademark.nameTrademark,
                    },
                ]);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getClassifyProductAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct) {
                resolve([]);
            } else {
                let listClassifys = await db.classifyProduct.findAll({
                    where: {
                        idProduct: data.idProduct,
                    },
                });

                resolve(listClassifys);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getAddressBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([]);
            } else {
                let address = await db.addressUser.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill,
                            },
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                // console.log(address);

                resolve([
                    {
                        tenNguoiMua: address.fullname,
                        soDienThoai: address.sdt,
                        ghiChuDiaChi: address.addressText,
                        tinhThanh: provinces[address.country * 1].name,
                        quanHuyen:
                            provinces[address.country * 1].districts[
                                address.district * 1
                            ].name,
                    },
                ]);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const contentEmailConfirmBill = () => {
    return `
        <h2>Vào website để xem chi tiết</h2>
    `;
};

const confirmBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve(false);
            } else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill,
                        idStatusBill: 1,
                    },
                    raw: false,
                });

                if (!bill) {
                    resolve(false);
                    return;
                }

                bill.idStatusBill = 2;
                await bill.save();

                await db.statusBills.create({
                    id: uuidv4(),
                    idBill: bill.id,
                    nameStatus: 'Đang giao',
                    idStatusBill: bill.idStatusBill,
                    timeStatus: new Date().getTime(),
                });

                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill,
                            },
                        },
                    ],
                    nest: true,
                    raw: false,
                });
                let date = new Date().getTime();
                await db.notifycations.create({
                    id: uuidv4(),
                    title: 'Đơn hàng đã xác nhận',
                    content: `Đơn hàng ${data.idBill} đã được xác nhận`,
                    timeCreate: date,
                    typeNotify: 'order',
                    idUser: user.id,
                    redirect_to: '/user/purchase?type=2',
                });

                handleEmit(`new-notify-${user.id}`, {
                    title: 'Đơn hàng của bạn đã được xác nhận',
                    content: 'Vào website để xem chi tiết',
                });

                //send email
                if (user?.typeAccount === 'web') {
                    let content = contentEmailConfirmBill();
                    sendEmail(
                        user.email,
                        'Đơn hàng của bạn đã được xác nhận',
                        content
                    );
                }

                resolve(true);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let contentUpdateStatusBill = () => {
    return `
    <h3>Vào website để xem chi tiết</h3>
    `;
};

let contentSuccessBill = () => {
    return `
    <h3>Vào website để xem chi</h3>
    `;
};

let contentFailBill = () => {
    return `
    <h3>Vào website để xem chi tiết</h3>
    `;
};

const updateStatusBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill || !data.nameStatus) {
                resolve(false);
            } else {
                let bill = await db.bill.findOne({
                    where: {
                        id: data.idBill,
                        idStatusBill: {
                            [Op.between]: [2, 2.99],
                        },
                    },
                    raw: false,
                });

                if (!bill) {
                    resolve(false);
                    return;
                }

                let date = new Date().getTime();
                let user = await db.User.findOne({
                    include: [
                        {
                            model: db.bill,
                            where: {
                                id: data.idBill,
                            },
                        },
                    ],
                    nest: true,
                    raw: false,
                });

                if (data.nameStatus === 'success') {
                    bill.idStatusBill = 2.99;
                    bill.timeBill = date;
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã giao',
                        idStatusBill: 2.99,
                        timeStatus: new Date().getTime(),
                    });

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã hoàn thành`,
                        content: 'Đơn hàng đã đến tay người mua',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=3',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao thành công',
                        content: `Đơn hàng ${data.idBill} đã được hoàn thành`,
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentSuccessBill();
                        sendEmail(user.email, 'Giao hàng thành công', content);
                    }
                } else if (data.nameStatus === 'fail') {
                    bill.idStatusBill = 4;
                    bill.timeBill = date;
                    bill.noteCancel = 'Giao hàng thất bại';
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: 'Đã hủy',
                        idStatusBill: 4,
                        timeStatus: new Date().getTime(),
                    });

                    //increase amount product
                    let detailBills = await db.detailBill.findAll({
                        where: {
                            idBill: bill.id,
                        },
                    });

                    detailBills.forEach(async (item) => {
                        let classify = await db.classifyProduct.findOne({
                            where: {
                                id: item.idClassifyProduct,
                            },
                            raw: false,
                        });
                        if (classify) {
                            classify.amount = classify.amount + item.amount;
                            await classify.save();
                        }
                    });

                    //notify
                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Đơn hàng ${data.idBill} đã bị hủy`,
                        content: 'Giao hàng thất bại',
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=4',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: 'Giao hàng thất bại',
                        content: `Đơn hàng ${data.idBill} đã bị hủy`,
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentFailBill();
                        sendEmail(
                            user.email,
                            `Đơn hàng ${data.idBill} đã bị hủy`,
                            content
                        );
                    }
                } else {
                    bill.idStatusBill = (bill.idStatusBill + 0.01).toFixed(2);
                    bill.timeBill = date;
                    await bill.save();

                    await db.statusBills.create({
                        id: uuidv4(),
                        idBill: bill.id,
                        nameStatus: data.nameStatus,
                        idStatusBill: bill.idStatusBill,
                        timeStatus: new Date().getTime(),
                    });

                    await db.notifycations.create({
                        id: uuidv4(),
                        title: `Cập nhật trạng thái đơn hàng ${data.idBill}`,
                        content: data.nameStatus,
                        timeCreate: date,
                        typeNotify: 'order',
                        idUser: user.id,
                        redirect_to: '/user/purchase?type=2',
                    });

                    handleEmit(`new-notify-${user.id}`, {
                        title: data.nameStatus,
                        content: 'Vào website để xem chi tiết',
                    });

                    //send email
                    if (user?.typeAccount === 'web') {
                        let content = contentUpdateStatusBill();
                        sendEmail(
                            user.email,
                            'Đơn hàng của bạn đã được xác nhận',
                            content
                        );
                    }
                }

                resolve(true);
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListStatusBillAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBill) {
                resolve([]);
            } else {
                let statusBills = await db.statusBills.findAll({
                    where: {
                        idBill: data.idBill,
                    },
                    order: [['stt', 'ASC']],
                });
                resolve(statusBills);
            }
        } catch (e) {
            reject(e);
        }
    });
};

//end winform

//music app
const themCaSi = ({ file, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.tenCaSi || !data.moTa) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                console.log('vao');
                let check = await db.casi.findOne({
                    where: {
                        tenCaSi: data.tenCaSi.trim(),
                    },
                });

                if (check) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Ca sĩ này đã tồn tại!',
                    });
                }

                let caSiMoi = await db.casi.create({
                    id: uuidv4(),
                    tenCaSi: data.tenCaSi.trim(),
                    moTa: data.moTa.trim(),
                    idAnh: file.filename,
                    anh: file.path,
                });

                resolve({
                    errCode: 0,
                    data: caSiMoi,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const layDsCaSi = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dsCaSi = await db.casi.findAll({
                order: [['createdAt', 'desc']],
            });

            resolve({
                errCode: 0,
                data: dsCaSi,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const xoaCaSi = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let casi = await db.casi.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (!casi) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Ca sĩ này không tồn tại!',
                    });
                }
                cloudinary.v2.uploader.destroy(`${casi.idAnh}`).then((res) => {
                    console.log('res: ', res);
                });

                await casi.destroy();

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const suaCaSi = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id | !data.tenCaSi | !data.moTa) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let casi = await db.casi.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (!casi) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Ca sĩ này không tồn tại!',
                    });
                }

                casi.tenCaSi = data.tenCaSi.trim();
                casi.moTa = data.moTa.trim();

                await casi.save();

                resolve({
                    errCode: 0,
                    data: casi,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const themBaiHat = ({ files, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.tenBaiHat || //r
                !data.loiBaiHat || //r
                !data.listIdCaSi || //r
                !data.thoiGian || //r
                !data.tenNhacSi || //r
                !data.theLoai ||  //r
                !data.nhaCungCap || //r
                !data.ngayPhatHanh || //r
                data.listIdCaSi.length === 0
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let fileImage = files.find((item) =>
                    item.mimetype.includes('image')
                );
                let fileAudio = files.find((item) =>
                    item.mimetype.includes('audio')
                );
                console.log(fileImage, fileAudio);
                let luotNghe = Math.random() * 100000 + 500;


                let idBaiHat = uuidv4();
                let [row, created] = await db.baihat.findOrCreate({
                    where: {
                        tenBaiHat: data.tenBaiHat,
                    },

                    defaults: {
                        id: idBaiHat,

                        loiBaiHat: data.loiBaiHat,
                        anhBia: fileImage.path,
                        linkBaiHat: fileAudio.path,

                        thoiGian: +data.thoiGian,
                        linkMV: data.linkMV || 'false',
                        luotNghe,
                        tenNhacSi: data.tenNhacSi,
                        theLoai: data.theLoai,
                        nhaCungCap: data.nhaCungCap,
                        ngayPhatHanh: data.ngayPhatHanh
                    }

                });

                if (!created) {

                    return resolve({
                        errCode: 2,
                        errMessage: 'Bài hát đã tồn tại',
                    })
                }

                data.listIdCaSi.forEach(async item => {
                    await db.baiHat_caSi.create({
                        id: uuidv4(),
                        idBaiHat: idBaiHat,
                        idCaSi: item
                    })
                })


                let arrayTitle = [
                    'Ra mắt bài hát mới',
                    `"${data.tenBaiHat}" đã có trên ứng dụng`,
                    'Ngày mới vui vẻ cùng bài hát mới',
                    `Ra mắt bài hát mới "${data.tenBaiHat}"`,
                    `Cùng nghe bài hát mới nào`,
                    'Mời bạn lắng nghe',
                    `Ca khúc mới có tên "${data.tenBaiHat}"`,
                ];

                let arrContent = [
                    `"${data.tenBaiHat}" - một bài hát mới của [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu đơn phương, mang đến cho người nghe những cảm xúc lắng đọng và sâu sắc.

                    Lời bài hát như một lời tự sự của một người đang yêu thầm một ai đó. Những câu hát mộc mạc, giản dị, nhưng đầy chân thành, đã chạm đến trái tim của nhiều người yêu nhạc.
                    
                    "${data.tenBaiHat}" không chỉ là một bài hát về tình yêu đơn phương, mà còn là một bài hát về sự dũng cảm để theo đuổi ước mơ và tình yêu của bản thân.
                    
                    Hãy cùng thưởng thức "${data.tenBaiHat}" và cảm nhận những cung bậc cảm xúc của tình yêu đơn phương nhé!`,
                    `"${data.tenBaiHat}" - một bài hát mới của [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu đơn phương, mang đến cho người nghe những cảm xúc lắng đọng và sâu sắc.

                    Giai điệu của bài hát du dương, ngọt ngào, kết hợp với giọng hát đầy cảm xúc của [tên nghệ sĩ/nhóm nhạc], đã mang đến cho khán giả những cảm xúc lắng đọng.
                    
                    "${data.tenBaiHat}" là một bài hát dễ nghe, dễ nhớ, và dễ đi vào lòng người. Bài hát chắc chắn sẽ là một bản hit trong thời gian tới.`,
                    `"${data.tenBaiHat}" - một bài hát mới của [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu đơn phương, mang đến cho người nghe những cảm xúc lắng đọng và sâu sắc.

                    Bài hát được sáng tác bởi [tên nhạc sĩ]. Giai điệu bài hát du dương, ngọt ngào, kết hợp với giọng hát đầy cảm xúc của [tên nghệ sĩ/nhóm nhạc], đã mang đến cho khán giả những cảm xúc lắng đọng.
                    
                    MV của bài hát được quay tại [địa điểm quay]. MV được đạo diễn bởi [tên đạo diễn]. MV tái hiện câu chuyện tình yêu đơn phương của [tên nghệ sĩ/nhóm nhạc] một cách chân thực và đầy cảm xúc.
                    
                    "${data.tenBaiHat}" là một bài hát có ý nghĩa sâu sắc. Bài hát không chỉ là một bài hát về tình yêu đơn phương, mà còn là một bài hát về sự dũng cảm để theo đuổi ước mơ và tình yêu của bản thân.`,
                    `"${data.tenBaiHat}" - một bài hát mới của [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu đơn phương, mang đến cho người nghe những cảm xúc lắng đọng và sâu sắc.

                    Bài hát đã nhận được nhiều lời khen ngợi từ khán giả và giới chuyên môn. "${data.tenBaiHat}" được đánh giá là một bài hát xuất sắc, và là một trong những bài hát đáng nghe nhất trong năm.
                    
                    Hãy cùng thưởng thức "${data.tenBaiHat}" và cảm nhận những cung bậc cảm xúc của tình yêu đơn phương nhé!`,
                    `"${data.tenBaiHat}" - một bài hát mới của [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu đơn phương, mang đến cho người nghe những cảm xúc lắng đọng và sâu sắc.

                    Bài hát là một lời tự sự của một người đang yêu thầm một ai đó. Những câu hát mộc mạc, giản dị, nhưng đầy chân thành, đã chạm đến trái tim của nhiều người yêu nhạc.
                    
                    "${data.tenBaiHat}" không chỉ là một bài hát về tình yêu đơn phương, mà còn là một bài hát về sự dũng cảm để theo đuổi ước mơ và tình yêu của bản thân.
                    
                    Bài hát mang đến cho khán giả một thông điệp rằng: Tình yêu đơn phương cũng là một loại tình yêu, và nó cũng đáng được trân trọng.
                    
                    Hãy cùng thưởng thức "${data.tenBaiHat}" và cảm nhận những cung bậc cảm xúc của tình yêu đơn phương nhé!`,
                    `"${data.tenBaiHat}" - một bài hát mới của ca sĩ/nhóm nhạc [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu, mang đến cho người nghe những cảm xúc ngọt ngào và lãng mạn.

                    Lời bài hát như một lời tỏ tình của một người đang yêu. Những câu hát ngọt ngào, lãng mạn, đã chạm đến trái tim của nhiều người yêu nhạc.
                    
                    Giai điệu của bài hát nhẹ nhàng, êm ái, kết hợp với giọng hát đầy cảm xúc của [tên nghệ sĩ/nhóm nhạc], đã mang đến cho khán giả những cảm xúc ngọt ngào.
                    
                    "${data.tenBaiHat}" là một bài hát dễ nghe, dễ nhớ, và dễ đi vào lòng người. Bài hát chắc chắn sẽ là một bản hit trong thời gian tới.`,
                    `"${data.tenBaiHat}" - một bài hát mới của ca sĩ/nhóm nhạc [tên nghệ sĩ/nhóm nhạc] đã chính thức ra mắt. Đây là một bài hát về tình yêu, mang đến cho người nghe những cảm xúc ngọt ngào và lãng mạn.

                    Bài hát được sáng tác bởi [tên nhạc sĩ]. Giai điệu của bài hát nhẹ nhàng, êm ái, kết hợp với giọng hát đầy cảm xúc của [tên nghệ sĩ/nhóm nhạc], đã mang đến cho khán giả những cảm xúc ngọt ngào.
                    
                    MV của bài hát được quay tại [địa điểm quay]. MV được đạo diễn bởi [tên đạo diễn]. MV tái hiện câu chuyện tình yêu ngọt ngào và lãng mạn của [tên nghệ sĩ/nhóm nhạc].
                    
                    "${data.tenBaiHat}" là một bài hát có ý nghĩa sâu sắc. Bài hát không chỉ là một bài hát về tình yêu, mà còn là một bài hát về sự trân trọng những điều nhỏ bé trong cuộc sống.`,
                ];

                const number = Math.floor(Math.random() * arrayTitle.length);
                const number2 = Math.floor(Math.random() * arrContent.length);
                const number3 = Math.floor(Math.random() * 15);

                const time = new Date().getTime();

                await db.thongBao.create({
                    id: uuidv4(),
                    title: arrayTitle[number],
                    content: arrContent[number2],
                    timeCreate: time,
                    urlImage: `https://source.unsplash.com/random?sig=${number3}`,
                });

                handleEmit('new_thong_bao', {
                    title: arrayTitle[number],
                    content: arrContent[number2],
                    timeCreate: time,
                    urlImage: `https://source.unsplash.com/random?sig=${number3}`,
                });

                resolve({
                    errCode: 0,
                    data: row,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const layDsBaiHat = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dsBaiHat = await db.baihat.findAll({
                include: [
                    {
                        model: db.baiHat_caSi,
                        include: [
                            { model: db.casi }
                        ]
                    },
                ],
                raw: false,
                nest: true,
                order: [['createdAt', 'desc']],
            });

            resolve({
                errCode: 0,
                data: dsBaiHat,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const xoaBaiHat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let baihat = await db.baihat.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (!baihat) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Bài hát này không tồn tại!',
                    });
                }

                let idAnh = baihat.anhBia.substring(
                    baihat.anhBia.indexOf('music/'),
                    baihat.anhBia.lastIndexOf('.')
                );

                // let idAudio = baihat.linkBaiHat.substring(
                //     baihat.linkBaiHat.indexOf('music/'),
                //     baihat.linkBaiHat.lastIndexOf('.')
                // );

                cloudinary.v2.uploader.destroy(`${idAnh}`).then((res) => {
                    console.log('res image: ', res);
                });
                // cloudinary.v2.uploader
                //     .destroy(`gfq2d71lk2amq1vsvmnm`)
                //     .then((res) => {
                //         console.log('res audio: ', res);
                //     });

                await baihat.destroy();

                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const suaBaiHat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id | !data.tenBaiHat | !data.loiBaiHat) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let baihat = await db.baihat.findOne({
                    where: {
                        id: data.id,
                    },
                    raw: false,
                });

                if (!baihat) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Bài hát này không tồn tại!',
                    });
                }

                baihat.tenBaiHat = data.tenBaiHat.trim();
                baihat.loiBaiHat = data.loiBaiHat.trim();
                baihat.linkMV = data.linkMV || 'false'

                await baihat.save();

                resolve({
                    errCode: 0,
                    data: baihat,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const timKiemBaiHatById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBaiHat) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                let baihat = await db.baihat.findOne({
                    where: {
                        id: data.idBaiHat,
                    },
                    include: [
                        {
                            model: db.baiHat_caSi,
                            include: [
                                {
                                    model: db.casi
                                }
                            ]
                        }
                    ],
                    nest: true,
                    raw: false,
                });

                if (!baihat) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Bài hát này không tồn tại!',
                    });
                }


                resolve({
                    errCode: 0,
                    data: baihat,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const themLoiBaiHat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBaiHat || !data.thoiGian) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let loiBaiHat = data.loiBaiHat || ""


                await db.loiBaiHat.create({
                    id: uuidv4(),
                    idBaiHat: data.idBaiHat,
                    loiBaiHat: loiBaiHat.trim(),
                    thoiGian: +data.thoiGian,
                })


                resolve({
                    errCode: 0,
                    // data: baihat,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListLoiBaiHat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idBaiHat) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {


                let list = await db.loiBaiHat.findAll({
                    where: {
                        idBaiHat: data.idBaiHat,
                    },
                    order: [['thoiGian', 'asc']]
                })


                resolve({
                    errCode: 0,
                    data: list,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const suaLoiBaiHatById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idLoiBaiHat || !data.loiBaiHat) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {


                let loiBaiHat = await db.loiBaiHat.findOne({
                    where: {
                        id: data.idLoiBaiHat,
                    },
                    raw: false
                })

                if (loiBaiHat !== null) {
                    loiBaiHat.loiBaiHat = data.loiBaiHat;
                    await loiBaiHat.save()
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

const suaThoiGianBaiHatById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idLoiBaiHat || !data.thoiGian) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {


                let loiBaiHat = await db.loiBaiHat.findOne({
                    where: {
                        id: data.idLoiBaiHat,
                    },
                    raw: false
                })

                if (loiBaiHat !== null) {
                    loiBaiHat.thoiGian = data.thoiGian;
                    await loiBaiHat.save()
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

const xoaLoiBaiHatById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idLoiBaiHat) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {


                let loiBaiHat = await db.loiBaiHat.findOne({
                    where: {
                        id: data.idLoiBaiHat,
                    },
                    raw: false
                })

                if (loiBaiHat !== null) {
                    await loiBaiHat.destroy()
                    resolve({
                        errCode: 0,
                    });
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "ko tim thay loi bai hat"
                    });
                }



            }
        } catch (e) {
            reject(e);
        }
    });
};


//end music app


//khach san
const themBaiVietks = ({ file, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.tieuDe || !data.moTa) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,

                let currenttime = new Date()

                const timeString = currenttime.getDate() + "-" + (currenttime.getMonth() + 1) + "-" +
                    currenttime.getFullYear();

                let newRow = await db.ksBaiViet.create({
                    id: uuidv4(),
                    anhBia: file.path,
                    tieuDe: data.tieuDe,
                    timeText: timeString,
                    description: data.moTa,
                    // contentHtml: data.contentHtml,
                    timeDouble: currenttime.getTime(),
                })



                resolve({
                    errCode: 0,
                    data: newRow,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const layDanhSachBaiViet = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let maxCount = +data.maxCount || 10
            let page = +data.page || 1
            let order = data.order || 'timeDouble'
            let order_style = data.order_style || 'desc'



            let list = await db.ksBaiViet.findAll({
                limit: maxCount,
                offset: (page - 1) * maxCount,
                order: [[order, order_style]],
                attributes: {
                    exclude: ['contentHtml']
                }
            })




            resolve({
                errCode: 0,
                data: list,
            });
        } catch (e) {
            reject(e);
        }
    });
};




const suaBaiVietks = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.tieuDe || !data.contentHtml || !data.moTa || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,

                let baiviet = await db.ksBaiViet.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })

                if (!baiviet) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Not found bai viet'
                    });
                }

                baiviet.tieuDe = data.tieuDe
                baiviet.description = data.moTa
                baiviet.contentHtml = data.contentHtml
                await baiviet.save()


                resolve({
                    errCode: 0,
                    data: baiviet,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const xoaBaiVietks = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,

                let baiviet = await db.ksBaiViet.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })

                if (!baiviet) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Not found bai viet'
                    });
                }

                await baiviet.destroy()


                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const layNoiDungBaiVietKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,

                let baiviet = await db.ksBaiViet.findOne({
                    where: {
                        id: data.id
                    },
                    attributes: ['contentHtml']
                })

                if (!baiviet) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Not found bai viet'
                    });
                }


                resolve({
                    errCode: 0,
                    data: baiviet
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const themChiNhanhKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.tenChiNhanh || !data.diaChi || !data.tenTinhThanh) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,
                console.log('vao 1');


                let [newTP, created] = await db.ksThanhPho.findOrCreate({
                    where: {
                        tenThanhPho: data.tenTinhThanh.toLowerCase().trim()
                    },
                    defaults: {
                        id: uuidv4()
                    }
                })

                console.log('vao 2');

                let [newChiNhanh, created2] = await db.ksChiNhanh.findOrCreate({
                    where: {
                        tenChiNhanh: data.tenChiNhanh,
                        diaChi: data.diaChi,
                        idThanhPho: newTP.id
                    },
                    defaults: {
                        id: uuidv4()
                    }

                })

                console.log('vao 3');

                if (!created2) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Chi nhánh đã tồn tại!'
                    });
                }
                else {
                    resolve({
                        errCode: 0,
                        data: newChiNhanh
                    });

                }


            }
        } catch (e) {
            reject(e);
        }
    });
};

const layDanhSachChiNhanhKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let list = await db.ksChiNhanh.findAll()

            resolve({
                errCode: 0,
                data: list,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const themPhongKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idChiNhanh ||
                !data.tenPhong ||
                !data.tienIch ||
                !data.moTa ||
                !data.soNguoi ||
                !data.soGiuongDoi ||
                !data.soPhongTam ||
                !data.donGia ||
                !data.dienTich
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                // idAnh: file.filename,
                // anh: file.path,

                let newData = await db.ksPhong.create({
                    id: uuidv4(),
                    idChiNhanh: data.idChiNhanh,
                    tenPhong: data.tenPhong,
                    tienIch: data.tienIch,
                    moTa: data.moTa,
                    soNguoi: +data.soNguoi,
                    soGiuongDoi: +data.soGiuongDoi,
                    soPhongTam: +data.soPhongTam,
                    donGia: +data.donGia,
                    dienTich: +data.dienTich,
                    khuyenMai: 0,
                    trangThai: 1,
                })

                resolve({
                    errCode: 0,
                    data: newData
                });



            }
        } catch (e) {
            reject(e);
        }
    });
};


const themAnhPhongKS = ({ files, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let arrImage = files.map(item => {
                    return {
                        id: uuidv4(),
                        idPhong: data.idPhong,
                        urlAnh: item.path,
                        idAnh: item.filename,
                    }
                })

                await db.ksAnhPhong.bulkCreate(arrImage, {
                    individualHooks: true,
                })



                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const layDanhSachPhongKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // idAnh: file.filename,
            // anh: file.path,

            let idChiNhanh = data.idChiNhanh || ""
            let tenPhong = data.tenPhong || ""
            let limit = +data.limit || 10
            let page = +data.page || 1

            let listPhong = await db.ksPhong.findAll({
                where: {
                    idChiNhanh: {
                        [Op.substring]: idChiNhanh
                    },
                    tenPhong: {
                        [Op.substring]: tenPhong
                    }
                },
                limit,
                offset: (page - 1) * limit,
                raw: false
            })


            resolve({
                errCode: 0,
                data: listPhong
            });



        } catch (e) {
            reject(e);
        }
    });
};

const datPhongKSAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.hoTen ||
                !data.email ||
                !data.sdt
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let [newKhach, created] = await db.ksKhachHang.findOrCreate({
                    where: {
                        sdt: data.sdt
                    },
                    defaults: {
                        id: uuidv4(),
                        hoTen: data.hoTen,
                        email: data.email,
                        diem: 0
                    },
                    raw: false
                })
                if (!created) {
                    newKhach.hoTen = data.hoTen
                    newKhach.email = data.email
                    await newKhach.save()
                }

                let phong = await db.ksPhong.findOne({
                    where: {
                        id: data.idPhong
                    }
                })

                if (!phong) {
                    return resolve({
                        errCode: 2,
                        errMessage: "Không tìm thấy phòng"
                    });
                }
                //check trang thai phong
                if (phong.trangThai === 2) {
                    return resolve({
                        errCode: 3,
                        errMessage: "Phòng đã tạm dừng cho thuê!"
                    });
                }

                //check ngay
                let checkTime = await db.ksDatPhong.findOne({
                    where: {
                        idPhong: data.idPhong,
                        timeEnd: {
                            [Op.gte]: +data.timeStart  // >=
                        },
                        timeStart: {
                            [Op.lte]: +data.timeEnd // <=
                        },
                        trangThai: {
                            [Op.ne]: 3
                        }
                    }
                })
                if (checkTime) {
                    return resolve({
                        errCode: 3,
                        errMessage: "Đã có khách đạt phòng trong khoản thời gian này!"
                    });
                }





                //tao don dat phong
                let tien = phong.donGia
                let khuyenMai = phong.khuyenMai
                let ghiChu = ''
                if (newKhach.diem >= 5) {
                    khuyenMai += 10
                    newKhach.diem = 0
                    ghiChu = "Ưu đãi khách đặt phòng 5 lần giảm 10%"
                    await newKhach.save()
                }

                let soNgayThue = (+data.timeEnd - +data.timeStart) / 86400 + 1

                let thanhTien = Math.floor(tien * (100 - khuyenMai) / 100) * soNgayThue

                console.log('thanh tien: ', tien, thanhTien);


                await db.ksDatPhong.create({
                    id: uuidv4(),
                    idPhong: data.idPhong,
                    idKhach: newKhach.id,
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd,
                    khuyenMai: khuyenMai,
                    thanhTien: thanhTien,
                    loaiThanhToan: 1,//1 tien mat, 2 paypal, 3 orther bank
                    isThanhToan: 0, //0 chua, 1 roi
                    trangThai: 1, //1 dat truoc, 2 nhan phong, 3 ket thuc
                    ghiChu: ghiChu
                })

                //gửi email kèm link
                let linkTT = `${process.env.LINK_FONTEND}/thong-tin-dat-phong/${newKhach.id}`
                commont.sendEmail(data.email,
                    "Đặt phòng tại TBT Hotel",
                    `Thông tin chi tiết vui lòng xem tại: 
                    <a href="${linkTT}">${linkTT}</a>
                    `
                );


                resolve({
                    errCode: 0,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const checkStatusPhongKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const timestamp = today.getTime() / 1000;


                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        idPhong: data.idPhong,
                        timeStart: {
                            [Op.lte]: timestamp
                        },
                        timeEnd: {
                            [Op.gte]: timestamp
                        },
                        trangThai: {
                            [Op.ne]: 3
                        }
                    },
                    include: [
                        {
                            model: db.ksKhachHang
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (!datPhong) {
                    return resolve({
                        errCode: 0,
                        data: null
                    })
                }

                resolve({
                    errCode: 0,
                    data: datPhong
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const huyDatPhongKsAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.idDatPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: data.idDatPhong,
                        idPhong: data.idPhong
                    },
                    raw: false
                })
                if (!datPhong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy đơn đạt phòng nào'
                    });
                }



                datPhong.trangThai = 3
                await datPhong.save()

                let khach = await db.ksKhachHang.findOne({
                    where: {
                        id: datPhong.idKhach
                    }
                })

                if (khach) {
                    let linkTT = `${process.env.LINK_FONTEND}/thong-tin-dat-phong/${khach.id}`
                    commont.sendEmail(khach.email,
                        "Hủy phòng tại TBT Hotel",
                        `Phòng của bạn đã bị hủy, Thông tin chi tiết vui lòng xem tại: 
                        <a href="${linkTT}">${linkTT}</a>
                        `
                    );
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


const getInfoKhachHangBySdt = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.sdt
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let khachHang = await db.ksKhachHang.findOne({
                    where: {
                        sdt: data.sdt
                    }
                })

                if (!khachHang) {
                    return resolve({
                        errCode: 2,
                        errMessage: "Not found user"
                    });
                }


                resolve({
                    errCode: 0,
                    data: khachHang
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListDisableDateDatPhongKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const timestamp = today.getTime() / 1000;

                let listDatPhong = await db.ksDatPhong.findAll({
                    where: {
                        idPhong: data.idPhong,
                        timeStart: {
                            [Op.gte]: timestamp
                        },
                        trangThai: {
                            [Op.ne]: 3
                        }
                    }
                })




                resolve({
                    errCode: 0,
                    data: listDatPhong

                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListDatPhongKSTheoThang = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.typeSearch
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                if (data.typeSearch === 'all') {
                    let listDatPhong = await db.ksDatPhong.findAll({
                        where: {
                            idPhong: data.idPhong,
                        },
                        include: [
                            {
                                model: db.ksKhachHang
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }

                else if (data.typeSearch === 'fromMonth') {
                    let monthStart = +data.monthStart || 0

                    let listDatPhong = await db.ksDatPhong.findAll({
                        where: {
                            idPhong: data.idPhong,
                            timeStart: {
                                [Op.gte]: monthStart
                            }
                        },
                        include: [
                            {
                                model: db.ksKhachHang
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }
                else if (data.typeSearch === 'monthToMonth') {
                    let monthStart = +data.monthStart || 0
                    let monthEnd = +data.monthEnd || 0

                    let listDatPhong = await db.ksDatPhong.findAll({
                        where: {
                            idPhong: data.idPhong,
                            timeStart: {
                                [Op.gte]: monthStart
                            },
                            timeEnd: {
                                [Op.lte]: monthEnd
                            }
                        },
                        include: [
                            {
                                model: db.ksKhachHang
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }



                resolve({
                    errCode: 2,
                    errMessage: 'Not found logic!',
                });



            }
        } catch (e) {
            reject(e);
        }
    });
};

const nhanPhongKs = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.idDatPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: data.idDatPhong,
                        idPhong: data.idPhong
                    },
                    raw: false
                })
                if (!datPhong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy đơn đạt phòng nào'
                    });
                }

                let phong = await db.ksPhong.findOne({
                    where: {
                        id: data.idPhong
                    }
                })

                if (!phong) {
                    return resolve({
                        errCode: 3,
                        errMessage: "Không tìm thấy phòng"
                    });
                }
                //check trang thai phong
                if (phong.trangThai === 2) {
                    return resolve({
                        errCode: 4,
                        errMessage: "Phòng đã tạm dừng cho thuê!"
                    });
                }



                datPhong.trangThai = 2
                datPhong.isThanhToan = 1
                await datPhong.save()

                //doanh thu
                let date = new Date()
                await db.ksDoanhThu.create({
                    id: uuidv4(),
                    thang: date.getMonth() + 1,
                    nam: date.getFullYear(),
                    tien: datPhong.thanhTien,
                    loaiTien: 1, //1 lai, 2 lo
                    ghiChu: "Khách hàng nhận phòng"
                })

                //tăng điểm cho khách
                let khachhang = await db.ksKhachHang.findOne({
                    where: {
                        id: datPhong.idKhach
                    },
                    raw: false
                })
                if (khachhang) {
                    khachhang.diem = khachhang.diem + 1
                    await khachhang.save()
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


const traPhongKsAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.idDatPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: data.idDatPhong,
                        idPhong: data.idPhong
                    },
                    raw: false
                })
                if (!datPhong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy đơn đạt phòng nào'
                    });
                }

                datPhong.trangThai = 3
                await datPhong.save()

                //send email
                let khach = await db.ksKhachHang.findOne({
                    where: {
                        id: datPhong.idKhach
                    }
                })
                let linkTT = `${process.env.LINK_FONTEND}/lien-he`
                commont.sendEmail(khach.email,
                    "Trả phòng tại TBT Hotel",
                    `Bạn có thể cho chúng tôi đánh giá thông qua: 
                    <a href="${linkTT}">${linkTT}</a>
                    `
                );


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const toggleKhoaPhongKSAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let phong = await db.ksPhong.findOne({
                    where: {
                        id: data.idPhong,
                    },
                    raw: false
                })
                if (!phong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phòng nào'
                    });
                }

                phong.trangThai = phong.trangThai === 1 ? 2 : 1
                await phong.save()


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateKhuyenMaiPhongKSAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.khuyenMai
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let phong = await db.ksPhong.findOne({
                    where: {
                        id: data.idPhong,
                    },
                    raw: false
                })
                if (!phong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phòng nào'
                    });
                }

                phong.khuyenMai = +data.khuyenMai
                await phong.save()


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const updateThongTinPhongKsAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong ||
                !data.tenPhong ||
                !data.tienIch ||
                !data.moTa ||
                !data.soNguoi ||
                !data.soGiuongDoi ||
                !data.soPhongTam ||
                !data.donGia ||
                !data.dienTich
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let phong = await db.ksPhong.findOne({
                    where: {
                        id: data.idPhong,
                    },
                    raw: false
                })
                if (!phong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy phòng nào'
                    });
                }

                phong.tenPhong = data.tenPhong
                phong.tienIch = data.tienIch
                phong.moTa = data.moTa
                phong.soNguoi = +data.soNguoi
                phong.soGiuongDoi = +data.soGiuongDoi
                phong.soPhongTam = +data.soPhongTam
                phong.donGia = +data.donGia
                phong.dienTich = +data.dienTich
                await phong.save()


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};


const getListDatPhongKSAllTheoThang = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.typeSearch
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {
                console.log("typeSearch", data.typeSearch);

                if (data.typeSearch === 'all') {
                    let sdt = data.sdt || ''
                    let listDatPhong = await db.ksDatPhong.findAll({
                        include: [
                            {
                                model: db.ksKhachHang,
                                where: {
                                    sdt: {
                                        [Op.substring]: sdt
                                    }
                                }
                            },
                            {
                                model: db.ksPhong
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }

                else if (data.typeSearch === 'fromMonth') {
                    let monthStart = +data.monthStart || 0
                    let sdt = data.sdt || ''

                    let listDatPhong = await db.ksDatPhong.findAll({
                        where: {
                            timeStart: {
                                [Op.gte]: monthStart
                            }
                        },
                        include: [
                            {
                                model: db.ksKhachHang,
                                where: {
                                    sdt: {
                                        [Op.substring]: sdt
                                    }
                                }
                            },
                            {
                                model: db.ksPhong
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }
                else if (data.typeSearch === 'monthToMonth') {
                    let monthStart = +data.monthStart || 0
                    let monthEnd = +data.monthEnd || 0
                    let sdt = data.sdt || ''

                    let listDatPhong = await db.ksDatPhong.findAll({
                        where: {
                            timeStart: {
                                [Op.gte]: monthStart
                            },
                            timeEnd: {
                                [Op.lte]: monthEnd
                            }
                        },
                        include: [
                            {
                                model: db.ksKhachHang,
                                where: {
                                    sdt: {
                                        [Op.substring]: sdt
                                    }
                                }
                            },
                            {
                                model: db.ksPhong
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    return resolve({
                        errCode: 0,
                        data: listDatPhong
                    });
                }




                resolve({
                    errCode: 2,
                    errMessage: 'Not found logic!',
                });



            }
        } catch (e) {
            reject(e);
        }
    });
};

const timKiemPhongKsUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idChiNhanh ||
                !data.soNguoi
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let dsPhongDaDat = await db.ksPhong.findAll({
                    include: [
                        {
                            model: db.ksChiNhanh,
                            where: {
                                id: data.idChiNhanh
                            }
                        },
                        {
                            model: db.ksDatPhong,
                            where: {
                                timeStart: {
                                    [Op.lte]: +data.timeStart || 0
                                },
                                timeEnd: {
                                    [Op.gte]: +data.timeStart || 0
                                },
                                trangThai: {
                                    [Op.ne]: 3
                                }
                            }
                        }
                    ],
                    raw: false,
                    nest: true
                })

                let arr = dsPhongDaDat.map(item => item.dataValues.id)

                console.log(arr);

                let dsPhongTrong = await db.ksPhong.findAll({
                    where: {
                        id: {
                            [Op.notIn]: arr
                        },
                        soNguoi: {
                            [Op.gte]: +data.soNguoi || 0
                        }
                    },
                    include: [
                        {
                            model: db.ksChiNhanh,
                            where: {
                                id: data.idChiNhanh
                            }
                        },
                        {
                            model: db.ksAnhPhong
                        }
                    ],
                    raw: false,
                    nest: true
                })




                resolve({
                    errCode: 0,
                    data: dsPhongTrong
                });



            }
        } catch (e) {
            reject(e);
        }
    });
};

const datPhongKSLoai1User = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong || data.idPhong.length === 0 ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.hoTen ||
                !data.email ||
                !data.sdt
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                verifier_email.verify(
                    data.email,
                    { hardRefresh: true },
                    async (err, res) => {
                        if (err) {
                            throw err;
                        }
                        if (res.smtpCheck === "false") {
                            resolve({
                                errCode: 3,
                                errMessage:
                                    "Email này không tồn tại, vui lòng kiểm tra lỗi chính tả!",
                            });
                            return;
                        } else {

                            //logic
                            let [newKhach, created] = await db.ksKhachHang.findOrCreate({
                                where: {
                                    sdt: data.sdt
                                },
                                defaults: {
                                    id: uuidv4(),
                                    hoTen: data.hoTen,
                                    email: data.email,
                                    diem: 0
                                },
                                raw: false
                            })
                            if (!created) {
                                newKhach.hoTen = data.hoTen
                                newKhach.email = data.email
                                await newKhach.save()
                            }

                            let checkPhong = true
                            let newArr = []
                            for (const id of data.idPhong) {

                                let phong = await db.ksPhong.findOne({
                                    where: {
                                        id: id
                                    }
                                })

                                if (!phong || phong.trangThai === 2) {
                                    checkPhong = false
                                }

                                let checkTime = await db.ksDatPhong.findOne({
                                    where: {
                                        idPhong: id,
                                        timeEnd: {
                                            [Op.gte]: +data.timeStart  // >=
                                        },
                                        timeStart: {
                                            [Op.lte]: +data.timeEnd // <=
                                        },
                                        trangThai: {
                                            [Op.ne]: 3
                                        }
                                    }
                                })

                                if (checkTime) {
                                    return resolve({
                                        errCode: 3,
                                        errMessage: `${phong.tenPhong} đã có người đặt trước`
                                    });
                                }

                                let tien = phong.donGia
                                let khuyenMai = phong.khuyenMai
                                let ghiChu = ''
                                if (newKhach.diem >= 5) {
                                    khuyenMai += 10
                                    newKhach.diem = 0
                                    ghiChu = "Ưu đãi khách đặt phòng 5 lần giảm 10%"
                                    await newKhach.save()
                                }

                                let soNgayThue = (+data.timeEnd - +data.timeStart) / 86400 + 1

                                let thanhTien = Math.floor(tien * (100 - khuyenMai) / 100) * soNgayThue

                                newArr.push({
                                    id: uuidv4(),
                                    idPhong: id,
                                    idKhach: newKhach.id,
                                    timeStart: data.timeStart,
                                    timeEnd: data.timeEnd,
                                    khuyenMai: khuyenMai,
                                    thanhTien: thanhTien,
                                    loaiThanhToan: 1,//1 tien mat, 2 paypal, 3 orther bank
                                    isThanhToan: 0, //0 chua, 1 roi
                                    trangThai: 1, //1 dat truoc, 2 nhan phong, 3 ket thuc
                                    ghiChu: ghiChu
                                })



                            }

                            if (!checkPhong) {
                                return resolve({
                                    errCode: 3,
                                    errMessage: "Không tìm thấy hoặc phòng không còn hoạt động nửa!"
                                });
                            }

                            await db.ksDatPhong.bulkCreate(newArr,
                                { individualHooks: true }
                            )

                            //gửi email kèm link
                            let linkTT = `${process.env.LINK_FONTEND}/thong-tin-dat-phong/${newKhach.id}`
                            commont.sendEmail(data.email,
                                "Đặt phòng tại TBT Hotel",
                                `Thông tin chi tiết vui lòng xem tại: 
                                <a href="${linkTT}">${linkTT}</a>
                                `
                            );


                            //tb socket
                            handleEmit("new_dat_phong", null)


                            resolve({
                                errCode: 0,
                            });


                        }
                    }
                );



            }
        } catch (e) {
            reject(e);
        }
    });
};

const datPhongKSLoai2User = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong || data.idPhong.length === 0 ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.hoTen ||
                !data.email ||
                !data.sdt
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                console.log('vao 0');

                // verifier_email.verify(
                //     data.email,
                //     { hardRefresh: true },
                //     async (err, res) => {
                //         if (err) {
                //             throw err;
                //         }
                //         if (res.smtpCheck === "false") {
                //             resolve({
                //                 errCode: 3,
                //                 errMessage:
                //                     "Email này không tồn tại, vui lòng kiểm tra lỗi chính tả!",
                //             });
                //             return;
                //         } else {

                console.log('vao 1');

                //logic
                let [newKhach, created] = await db.ksKhachHang.findOrCreate({
                    where: {
                        sdt: data.sdt
                    },
                    defaults: {
                        id: uuidv4(),
                        hoTen: data.hoTen,
                        email: data.email,
                        diem: 0
                    },
                    raw: false
                })
                if (!created) {
                    newKhach.hoTen = data.hoTen
                    newKhach.email = data.email
                    await newKhach.save()
                }

                let checkPhong = true
                let newArr = []
                let totals = 0;

                for (const id of data.idPhong) {

                    let phong = await db.ksPhong.findOne({
                        where: {
                            id: id
                        },
                        include: [
                            {
                                model: db.ksChiNhanh
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    if (!phong || phong.trangThai === 2) {
                        checkPhong = false
                    }

                    let checkTime = await db.ksDatPhong.findOne({
                        where: {
                            idPhong: id,
                            timeEnd: {
                                [Op.gte]: +data.timeStart  // >=
                            },
                            timeStart: {
                                [Op.lte]: +data.timeEnd // <=
                            },
                            trangThai: {
                                [Op.ne]: 3
                            }
                        }
                    })

                    if (checkTime) {
                        return resolve({
                            errCode: 3,
                            errMessage: `${phong.tenPhong} đã có người đặt trước`
                        });
                    }

                    let tien = phong.donGia
                    let khuyenMai = phong.khuyenMai
                    if (newKhach.diem >= 5) {
                        khuyenMai += 10
                    }

                    let soNgayThue = (+data.timeEnd - +data.timeStart) / 86400 + 1

                    let thanhTien = Math.floor(tien * (100 - khuyenMai) / 100) * soNgayThue
                    totals += Math.floor(thanhTien / 23000) * soNgayThue;

                    newArr.push({
                        name: phong.tenPhong,
                        sku: phong?.ksChiNhanh?.tenChiNhanh,
                        price: Math.floor(thanhTien / 23000) + ".00",
                        currency: "USD",
                        quantity: soNgayThue,
                    })


                }

                if (!checkPhong) {
                    return resolve({
                        errCode: 3,
                        errMessage: "Không tìm thấy hoặc phòng không còn hoạt động nửa!"
                    });
                }



                const create_payment_json = {
                    intent: "sale",
                    payer: {
                        payment_method: "paypal",
                    },
                    redirect_urls: {
                        return_url: `${process.env.LINK_BACKEND
                            }/api/v1/dat-phong-ks-loai2-user-success?price=${totals + ".00"
                            }&idPhong=${data.idPhong}&idKhach=${newKhach.id}&timeStart=${data.timeStart}&timeEnd=${data.timeEnd}`,
                        cancel_url: `${process.env.LINK_FONTEND}/`,
                    },
                    transactions: [
                        {
                            item_list: {
                                items: newArr,
                            },
                            amount: {
                                currency: "USD",
                                total: totals + ".00",
                            },
                            description: "TBT Hotel dịch vụ chất lượng.",
                        },
                    ],
                };

                console.log('vao 2');

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        throw error;
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === "approval_url") {
                                // res.redirect(payment.links[i].href);
                                resolve({
                                    errCode: 0,
                                    errMessage: "ok",
                                    link: payment.links[i].href,
                                });
                            }
                        }
                    }
                });


                //         }
                //     }
                // );



            }
        } catch (e) {
            reject(e);
        }
    });
};

const datPhongKSLoai2UserSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const payerId = data.PayerID;
            const paymentId = data.paymentId;
            const price = data.price;
            const listIdPhong = data.idPhong.split(',')
            const idKhach = data.idKhach
            const timeStart = data.timeStart
            const timeEnd = data.timeEnd

            console.log("listIdPhong: ", listIdPhong);

            const execute_payment_json = {
                payer_id: payerId,
                transactions: [
                    {
                        amount: {
                            currency: "USD",
                            total: price,
                        },
                    },
                ],
            };
            paypal.payment.execute(
                paymentId,
                execute_payment_json,
                async function (error, payment) {
                    if (error) {
                        console.log(error.response);
                        throw error;
                    } else {
                        //logic

                        let newArr = []
                        let khach = await db.ksKhachHang.findOne({
                            where: {
                                id: idKhach
                            },
                            raw: false
                        })

                        for (const id of listIdPhong) {

                            let phong = await db.ksPhong.findOne({
                                where: {
                                    id: id
                                },
                                include: [
                                    {
                                        model: db.ksChiNhanh
                                    }
                                ],
                                raw: false,
                                nest: true
                            })




                            let tien = phong.donGia
                            let khuyenMai = phong.khuyenMai
                            let ghiChu = ''
                            if (khach.diem >= 5) {
                                khuyenMai += 10
                                khach.diem = 0
                                ghiChu = "Ưu đãi khách đặt phòng 5 lần giảm 10%"
                                await khach.save()
                            }

                            let soNgayThue = (+timeEnd - +timeStart) / 86400 + 1

                            let thanhTien = Math.floor(tien * (100 - khuyenMai) / 100) * soNgayThue

                            newArr.push({
                                id: uuidv4(),
                                idPhong: id,
                                idKhach: idKhach,
                                timeStart: timeStart,
                                timeEnd: timeEnd,
                                khuyenMai: khuyenMai,
                                thanhTien: thanhTien,
                                loaiThanhToan: 2,//1 tien mat, 2 paypal, 3 orther bank
                                isThanhToan: 1, //0 chua, 1 roi
                                trangThai: 1, //1 dat truoc, 2 nhan phong, 3 ket thuc
                                ghiChu: ghiChu
                            })


                        }

                        await db.ksDatPhong.bulkCreate(newArr,
                            { individualHooks: true }
                        )

                        //gửi email kèm link
                        let linkTT = `${process.env.LINK_FONTEND}/thong-tin-dat-phong/${idKhach}`
                        commont.sendEmail(khach.email,
                            "Đặt phòng tại TBT Hotel",
                            `Thông tin chi tiết vui lòng xem tại: 
                            <a href="${linkTT}">${linkTT}</a>
                            `
                        );

                        handleEmit("new_dat_phong", null)

                        resolve({
                            errCode: 0,
                            idKhach
                        });


                    }
                }
            );


        } catch (e) {
            reject(e);
        }
    });
};

const datPhongKSLoai3User = ({ file, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idPhong || data.idPhong.length === 0 ||
                !data.timeStart ||
                !data.timeEnd ||
                !data.hoTen ||
                !data.email ||
                !data.sdt
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                verifier_email.verify(
                    data.email,
                    { hardRefresh: true },
                    async (err, res) => {
                        if (err) {
                            throw err;
                        }
                        if (res.smtpCheck === "false") {
                            resolve({
                                errCode: 3,
                                errMessage:
                                    "Email này không tồn tại, vui lòng kiểm tra lỗi chính tả!",
                            });
                            return;
                        } else {

                            //logic
                            let [newKhach, created] = await db.ksKhachHang.findOrCreate({
                                where: {
                                    sdt: data.sdt
                                },
                                defaults: {
                                    id: uuidv4(),
                                    hoTen: data.hoTen,
                                    email: data.email,
                                    diem: 0
                                },
                                raw: false
                            })
                            if (!created) {
                                newKhach.hoTen = data.hoTen
                                newKhach.email = data.email
                                await newKhach.save()
                            }

                            let checkPhong = true
                            let newArr = []
                            let strIdPhong = ''

                            for (const id of data.idPhong) {

                                let phong = await db.ksPhong.findOne({
                                    where: {
                                        id: id
                                    }
                                })

                                if (!phong || phong.trangThai === 2) {
                                    checkPhong = false
                                }

                                let checkTime = await db.ksDatPhong.findOne({
                                    where: {
                                        idPhong: id,
                                        timeEnd: {
                                            [Op.gte]: +data.timeStart  // >=
                                        },
                                        timeStart: {
                                            [Op.lte]: +data.timeEnd // <=
                                        },
                                        trangThai: {
                                            [Op.ne]: 3
                                        }
                                    }
                                })

                                if (checkTime) {
                                    return resolve({
                                        errCode: 3,
                                        errMessage: `${phong.tenPhong} đã có người đặt trước`
                                    });
                                }

                                let tien = phong.donGia
                                let khuyenMai = phong.khuyenMai
                                let ghiChu = ''
                                if (newKhach.diem >= 5) {
                                    khuyenMai += 10
                                    newKhach.diem = 0
                                    ghiChu = "Ưu đãi khách đặt phòng 5 lần giảm 10%"
                                    await newKhach.save()
                                }

                                let soNgayThue = (+data.timeEnd - +data.timeStart) / 86400 + 1

                                let thanhTien = Math.floor(tien * (100 - khuyenMai) / 100) * soNgayThue

                                newArr.push({
                                    id: uuidv4(),
                                    idPhong: id,
                                    idKhach: newKhach.id,
                                    timeStart: data.timeStart,
                                    timeEnd: data.timeEnd,
                                    khuyenMai: khuyenMai,
                                    thanhTien: thanhTien,
                                    loaiThanhToan: 3,//1 tien mat, 2 paypal, 3 orther bank
                                    isThanhToan: 0, //0 chua, 1 roi
                                    trangThai: 1, //1 dat truoc, 2 nhan phong, 3 ket thuc
                                    ghiChu: ghiChu
                                })

                                if (!strIdPhong) {
                                    strIdPhong = id.toString()
                                }
                                else {
                                    strIdPhong += "," + id.toString()
                                }


                            }

                            if (!checkPhong) {
                                return resolve({
                                    errCode: 3,
                                    errMessage: "Không tìm thấy hoặc phòng không còn hoạt động nửa!"
                                });
                            }

                            await db.ksDatPhong.bulkCreate(newArr,
                                { individualHooks: true }
                            )

                            await db.ksChuyenKhoan.create({
                                id: uuidv4(),
                                idDatPhong: strIdPhong,
                                trangThai: 0, //0 chua xem, 1 da xac minh, 3 ko hop le
                                urlAnh: file.path,
                                ghiChu: "",
                            })


                            //gửi email kèm link
                            let linkTT = `${process.env.LINK_FONTEND}/thong-tin-dat-phong/${newKhach.id}`
                            commont.sendEmail(data.email,
                                "Đặt phòng tại TBT Hotel",
                                `Thông tin chi tiết vui lòng xem tại: 
                                <a href="${linkTT}">${linkTT}</a>
                                `
                            );

                            handleEmit("new_dat_phong", null)

                            resolve({
                                errCode: 0,
                            });


                        }
                    }
                );



            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListDatPhongByIdKhach = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idKhach
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let listDatPhong = await db.ksDatPhong.findAll({
                    where: {
                        idKhach: data.idKhach
                    },
                    include: [
                        {
                            model: db.ksPhong,
                            include: [
                                {
                                    model: db.ksChiNhanh
                                }
                            ]
                        },
                    ],
                    order: [['createdAt', 'desc']],
                    raw: false,
                    nest: true
                })




                resolve({
                    errCode: 0,
                    data: listDatPhong
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};


const guiMaHuyPhongAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idDatPhong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: data.idDatPhong
                    },
                    raw: false,
                })

                if (!datPhong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy đơn đặt phòng nào!'

                    });
                }

                let khachHang = await db.ksKhachHang.findOne({
                    where: {
                        id: datPhong.idKhach
                    }
                })

                if (!khachHang) {
                    return resolve({
                        errCode: 3,
                        errMessage: 'Không tìm thấy email!'

                    });
                }


                let rd = Math.floor(Math.random() * 900000) + 100000;
                console.log("verifyCode: ", rd);
                datPhong.verifyCode = rd.toString();
                await datPhong.save()


                commont.sendEmail(
                    khachHang.email,
                    "Mã xác nhận TBT HoTel",
                    `<h3>Mã xác nhận của bạn là: ${rd}</h3>
                    <div>Lưu ý: không gửi mã này cho bất kì ai.</div>
                    `
                );


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const huyPhongByUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idDatPhong || !data.verifyCode
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: data.idDatPhong,
                        verifyCode: data.verifyCode
                    },
                    raw: false,
                })

                if (!datPhong) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Không tìm thấy đơn đặt phòng nào!'

                    });
                }

                datPhong.trangThai = 3;
                datPhong.verifyCode = ''
                await datPhong.save()


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const getListChuyenKhoanLoai3 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let listChuyenKhoan = await db.ksChuyenKhoan.findAll({
                where: {
                    trangThai: 0
                },
                include: [
                    {
                        model: db.ksDatPhong,
                        include: [
                            { model: db.ksPhong },
                            { model: db.ksKhachHang },
                        ]
                    }
                ],
                raw: false,
                nest: true
            });



            resolve({
                errCode: 0,
                data: listChuyenKhoan
            });

        } catch (e) {
            reject(e);
        }
    });
};

const huyThanhToanLoai3 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idChuyenKhoan
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let chuyenKhoan = await db.ksChuyenKhoan.findOne({
                    where: {
                        id: data.idChuyenKhoan
                    },
                    raw: false
                })

                if (!chuyenKhoan) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Not found chuyenKhoan by id'
                    });
                }

                chuyenKhoan.trangThai = 2
                await chuyenKhoan.save()

                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};


const xacNhanThanhToanLoai3 = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.idChuyenKhoan
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let chuyenKhoan = await db.ksChuyenKhoan.findOne({
                    where: {
                        id: data.idChuyenKhoan
                    },
                    raw: false
                })

                if (!chuyenKhoan) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Not found chuyenKhoan by id'
                    });
                }

                chuyenKhoan.trangThai = 1
                await chuyenKhoan.save()

                let datPhong = await db.ksDatPhong.findOne({
                    where: {
                        id: chuyenKhoan.idDatPhong
                    },
                    raw: false
                })

                datPhong.isThanhToan = 1
                await datPhong.save()


                resolve({
                    errCode: 0,
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};

const themNhanVienKS = ({ file, data }) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.hoTen ||
                !data.email ||
                !data.sdt ||
                !data.ngaySinh ||
                !data.queQuan ||
                !data.chucVu ||
                !data.gioiTinh ||
                !data.caLamViec
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let luongCB = data.chucVu === 'quản lý' ? 800000 : data.chucVu === 'lễ tân' ? 500000 :
                    data.chucVu === 'nhân viên phục vụ' ? 400000 : 300000

                let [row, created] = await db.ksNhanVien.findOrCreate({
                    where: {
                        hoTen: data.hoTen,
                        email: data.email,
                        sdt: data.sdt,
                        ngaySinh: data.ngaySinh,
                        queQuan: data.queQuan,
                        chucVu: data.chucVu,
                        gioiTinh: data.gioiTinh,
                        caLamViec: data.caLamViec,
                        ghiChu: data.ghiChu || "",
                        luongCoBan: luongCB
                    },
                    defaults: {
                        id: uuidv4(),
                        anh: file.path,
                    }
                })

                if (!created) {
                    return resolve({
                        errCode: 2,
                        errMessage: 'Nhân viên này đã tồn tại!'
                    });
                }


                resolve({
                    errCode: 0,
                    data: row
                });

            }
        } catch (e) {
            reject(e);
        }
    });
};


const getListNhanVienKS = ({ file, data }) => {
    return new Promise(async (resolve, reject) => {
        try {

            let listNV = await db.ksNhanVien.findAll({
                include: [
                    {
                        model: db.ksChiNhanh
                    }
                ],
                nest: true,
                raw: false
            })



            resolve({
                errCode: 0,
                data: listNV
            });

        } catch (e) {
            reject(e);
        }
    });
};

const getBangLuongNhanVienKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.thangLuong ||
                !data.namLuong
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required paramteter!',
                    data,
                });
            } else {

                let now = new Date();
                if (+data.namLuong > now.getFullYear() || +data.thangLuong > now.getMonth() + 1) {
                    return resolve({
                        errCode: 0,
                        data: [],
                    });
                }


                let checkLuong = await db.ksLuongNhanVien.findAll({
                    where: {
                        thang: +data.thangLuong,
                        nam: +data.namLuong
                    },
                    include: [
                        {
                            model: db.ksNhanVien
                        }
                    ],
                    raw: false,
                    nest: true
                })

                if (checkLuong && checkLuong.length !== 0) {
                    return resolve({
                        errCode: 0,
                        data: checkLuong
                    });
                }
                else {

                    let listNV = await db.ksNhanVien.findAll()

                    let newListLuong = listNV.map((item, index) => {
                        let ngayCong = Math.floor(Math.random() * 3) + 24;
                        let ngayPhep = Math.floor(Math.random() * 4);
                        let tangCa = Math.floor(Math.random() * 4);
                        let luongThuong = item.luongCoBan * ngayCong;

                        let rdPhuCap = Math.floor(Math.random() * 3)
                        let phuCap = rdPhuCap === 0 ? 0 : rdPhuCap === 1 ? 500000 : 1000000;

                        let rdUngLuong = Math.floor(Math.random() * 2)
                        let ungLuong = rdUngLuong === 0 ? 0 : 500000

                        let thucLanh = luongThuong + phuCap + (tangCa * 100000) - ungLuong

                        return {
                            id: uuidv4(),
                            idNhanVien: item.id,
                            ngayCong: ngayCong, //so ngay lam
                            ngayPhep: ngayPhep, //so ngay nghi
                            tangCa: tangCa, //so ngay tang ca
                            thang: +data.thangLuong,
                            nam: +data.namLuong,
                            luongThuong: luongThuong, //luong ngay thuong
                            thucLanh: thucLanh, //tong luong
                            phuCap: phuCap, //tien cong them
                            ungLuong: ungLuong,
                        }
                    })

                    await db.ksLuongNhanVien.bulkCreate(newListLuong, { individualHooks: true })

                    let listLuong = await db.ksLuongNhanVien.findAll({
                        where: {
                            thang: +data.thangLuong,
                            nam: +data.namLuong
                        },
                        include: [
                            {
                                model: db.ksNhanVien
                            }
                        ],
                        raw: false,
                        nest: true
                    })



                    resolve({
                        errCode: 0,
                        data: listLuong
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};


const getListKhachHangKS = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let listKhachHang = await db.ksKhachHang.findAll()



            resolve({
                errCode: 0,
                data: listKhachHang
            });
        } catch (e) {
            reject(e);
        }
    });
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
    //end music app

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
    guiMaHuyPhongAdmin,
    huyPhongByUser,
    getListChuyenKhoanLoai3,
    huyThanhToanLoai3,
    xacNhanThanhToanLoai3,
    themNhanVienKS,
    getListNhanVienKS,
    getBangLuongNhanVienKS,
    getListKhachHangKS
};
