import { sequelize } from "@services/database";
import { DataTypes, Model } from "sequelize";

export class Pin extends Model {
    public id!: string;
    public sessionId!: string;
    public longitude!: number;
    public latitude!: number;
    public pinName!: string;
    public pinDescription!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}
Pin.init(
    {
        sessionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        id: {
            type: DataTypes.UUID,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: -90, max: 90 }
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: { min: -180, max: 180 }
        },
        pinName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        pinDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
    
    },
    {
        sequelize: sequelize,
        tableName: "Pin",
        timestamps: true,
    }
);

