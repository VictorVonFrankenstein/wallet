'use strict';
module.exports = (sequelize, DataTypes) => {
    var tron_reward = sequelize.define(
        'tron_reward',
        {
            username: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            tron_addr: {
                allowNull: true,
                type: DataTypes.CHAR,
            },
            block_num: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED,
            },
            steem_tx_id: {
                allowNull: false,
                type: DataTypes.CHAR,
            },
            reward_vests: {
                allowNull: false,
                type: DataTypes.BIGINT.UNSIGNED,
            },
            reward_steem: {
                allowNull: false,
                type: DataTypes.BIGINT.UNSIGNED,
            },
            reward_sbd: {
                allowNull: false,
                type: DataTypes.BIGINT.UNSIGNED,
            },
            vests_per_steem: {
                allowNull: false,
                type: DataTypes.FLOAT,
            },
        },
        {
            tableName: 'tron_reward',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
        }
    );
    return tron_reward;
};
