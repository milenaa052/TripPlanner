import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import ViagemModel from "./ViagemModel"
import DespesaModel from "./DespesaModel"

class TransporteModel extends Model {
    idTransporte: number | undefined
    tipoTransporte: string | undefined
    origemTransporte: string | undefined
    destinoTransporte: string | undefined
    gastoTransporte: number | undefined
    dataTransporte: Date | undefined
    viagemId: number | undefined
}

TransporteModel.init({
    idTransporte: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tipoTransporte: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    origemTransporte: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    destinoTransporte: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gastoTransporte: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    dataTransporte: {
        type: DataTypes.DATE,
        allowNull: false
    },
    viagemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "TransporteModel",
    tableName: "transportes",
    hooks: {
        async afterCreate(transporte){
            if(typeof transporte.gastoTransporte === "number" && transporte.gastoTransporte > 1) {
                await DespesaModel.create({
                    tipoDespesa: `Transporte - Até: ${transporte.destinoTransporte}`,
                    gasto: transporte.gastoTransporte,
                    dataDespesa: transporte.dataTransporte,
                    viagemId: transporte.viagemId,
                    transporteId: transporte.idTransporte
                })   
            }
        }, 
        async afterUpdate(transporte) {
            await DespesaModel.update({
                tipoDespesa: `Transporte - Até: ${transporte.destinoTransporte}`,
                gasto: transporte.gastoTransporte,
                dataDespesa: transporte.dataTransporte
            }, 
            { where: { 
                viagemId: transporte.viagemId,
                transporteId: transporte.idTransporte
            } })
        },
        async afterDestroy(transporte) {
            await DespesaModel.destroy({
                where: {
                    transporteId: transporte.idTransporte
                }
            })
        }
    }
})

TransporteModel.belongsTo(ViagemModel, {
    foreignKey: "viagemId",
    as: "viagens"
})

ViagemModel.hasMany(TransporteModel, {
    foreignKey: "viagemId",
    as: "transportes"
})

export default TransporteModel