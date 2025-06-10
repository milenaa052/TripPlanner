import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import ViagemModel from "./ViagemModel"
import DespesaModel from "./DespesaModel"

class HospedagemModel extends Model {
    idHospedagem: number | undefined
    localHospedagem: string | undefined
    dataCheckin: Date | undefined
    dataCheckout: Date | undefined
    gastoTotal: number | undefined
    viagemId: number | undefined
}

HospedagemModel.init({
    idHospedagem: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    localHospedagem: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataCheckin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dataCheckout: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gastoTotal: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    viagemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    sequelize,
    modelName: "HospedagemModel",
    tableName: "hospedagens",
    hooks: {
        async afterCreate(hospedagem) {
            if(typeof hospedagem.gastoTotal === 'number' && hospedagem.gastoTotal > 1) {
                await DespesaModel.create({
                    tipoDespesa: `Hospedagem - ${hospedagem.localHospedagem}`,
                    gasto: hospedagem.gastoTotal,
                    dataDespesa: hospedagem.dataCheckin,
                    viagemId: hospedagem.viagemId,
                    hospedagemId: hospedagem.idHospedagem
                })
            }
        },
        async afterUpdate(hospedagem) {
            await DespesaModel.update({
                tipoDespesa: `Hospedagem - ${hospedagem.localHospedagem}`,
                gasto: hospedagem.gastoTotal,
                dataDespesa: hospedagem.dataCheckin
            },
            { where: { 
                viagemId: hospedagem.viagemId,
                hospedagemId: hospedagem.idHospedagem
            } }
            )
        },
        async afterDestroy(hospedagem) {
            await DespesaModel.destroy({
                where: {
                    hospedagemId: hospedagem.idHospedagem
                }
            })
        }
    }
})

export default HospedagemModel