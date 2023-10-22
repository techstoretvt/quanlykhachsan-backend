'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasMany(models.cart, { foreignKey: 'idUser' });
            User.hasMany(models.bill, { foreignKey: 'idUser' });
            User.hasMany(models.evaluateProduct, { foreignKey: 'idUser' });
            User.hasMany(models.blogs, { foreignKey: 'idUser' });
            User.hasMany(models.commentBlog, { foreignKey: 'idUser' });
            User.hasMany(models.likeBlog, { foreignKey: 'idUser' });
            User.hasMany(models.addressUser, { foreignKey: 'idUser' });
            User.hasMany(models.collectionBlogs, { foreignKey: 'idUser' });
            User.hasMany(models.shortVideos, { foreignKey: 'idUser' });
            User.hasMany(models.commentShortVideos, { foreignKey: 'idUser' });
            User.hasMany(models.collectionShortVideos, {
                foreignKey: 'idUser',
            });
            User.hasMany(models.notifycations, { foreignKey: 'idUser' });
            User.hasMany(models.reportVideos, { foreignKey: 'idUser' });
            User.hasMany(models.reportBlogs, { foreignKey: 'idUser' });
            User.hasMany(models.danhSachPhat, { foreignKey: 'idUser' });

            User.hasMany(models.yeuThichBaiHat, { foreignKey: 'idUser' });
            User.hasMany(models.quanTamCaSi, { foreignKey: 'idUser' });
            User.hasMany(models.commentBHParent, { foreignKey: 'idUser' });
            User.hasMany(models.commentBHCon, { foreignKey: 'idUser' });
        }
    }
    User.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: DataTypes.STRING,
            keyVerify: DataTypes.STRING,
            pass: DataTypes.STRING,
            avatar: DataTypes.TEXT,
            idTypeUser: DataTypes.STRING,
            //1 admin root, 2 admin phu, 3 user

            statusUser: DataTypes.STRING, //true, false , timestamp, wait
            idGoogle: DataTypes.STRING,
            avatarGoogle: DataTypes.TEXT,
            typeAccount: DataTypes.STRING, //web, google, facebook, github
            idFacebook: DataTypes.STRING,
            idGithub: DataTypes.STRING,
            avatarFacebook: DataTypes.TEXT,
            avatarGithub: DataTypes.TEXT,

            sdt: DataTypes.STRING,
            gender: DataTypes.STRING,
            birtday: DataTypes.STRING,
            avatarUpdate: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'User',
        }
    );
    return User;
};
