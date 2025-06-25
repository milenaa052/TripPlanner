import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import UsuarioModel from "./UsuarioModel"

class ViagemModel extends Model {
    idViagem: number | undefined
    localOrigem: string | undefined
    localDestino: string | undefined
    codigoPais: string | undefined
    dataInicial: Date | undefined
    dataFinal: Date | undefined
    usuarioId: number | undefined
}

ViagemModel.init({
    idViagem: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    localOrigem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localDestino: {
        type: DataTypes.STRING,
        allowNull: false
    },
    codigoPais: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataInicial: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dataFinal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "ViagemModel",
    tableName: "viagens"
})

ViagemModel.belongsTo(UsuarioModel, {
    foreignKey: "usuarioId",
    as: "usuarios"
})

UsuarioModel.hasMany(ViagemModel, {
    foreignKey: "usuarioId",
    as: "viagens"
})

export default ViagemModel