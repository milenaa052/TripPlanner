import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import ViagemModel from "./ViagemModel"
import HospedagemModel from "./HospedagemModel"
import TransporteModel from "./TransporteModel"
import PasseioModel from "./PasseioModel"

class DespesaModel extends Model {
    idDespesa: number | undefined
    tipoDespesa: string | undefined
    gasto: number | undefined
    dataDespesa: Date | undefined
    viagemId: number | undefined
    hospedagemId: number | undefined
    transporteId: number | undefined
    passeioId: number | undefined
}

DespesaModel.init({
    idDespesa: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipoDespesa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gasto: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    dataDespesa: {
        type: DataTypes.DATE,
        allowNull: false
    },
    viagemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hospedagemId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
    },
    transporteId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
    },
    passeioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
    }
},
{
    sequelize,
    modelName: "DespesaModel",
    tableName: "despesas" 
})

export default DespesaModel