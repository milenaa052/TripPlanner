import { DataTypes, Model } from "sequelize"
import sequelize from "../config/database"
import ViagemModel from "./ViagemModel"
import DespesaModel from "./DespesaModel"

class PasseioModel extends Model {
    idPasseio: number | undefined
    dataPasseio: Date | undefined
    localPasseio: string | undefined
    horaInicial: string | undefined
    horaFinal: string | undefined
    gastoPasseio: number | undefined
    viagemId: number | undefined
}

PasseioModel.init({
    idPasseio: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    dataPasseio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    localPasseio: {
        type: DataTypes.STRING,
        allowNull: false
    },
    horaInicial: {
        type: DataTypes.TIME,
        allowNull: false
    },
    horaFinal: {
        type: DataTypes.TIME,
        allowNull: false
    },
    gastoPasseio: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    viagemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "PasseioModel",
    tableName: "passeios",
    hooks: {
        async afterCreate(passeio) {
            if(typeof passeio.gastoPasseio === "number" && passeio.gastoPasseio > 1) {
                await DespesaModel.create({
                    tipoDespesa: `Passeio - ${passeio.localPasseio}`,
                    gasto: passeio.gastoPasseio,
                    dataDespesa: passeio.dataPasseio,
                    viagemId: passeio.viagemId,
                    passeioId: passeio.idPasseio
                })
            }
        }, 
        async afterUpdate(passeio) {
            await DespesaModel.update({
                tipoDespesa: `Passeio - ${passeio.localPasseio}`,
                gasto: passeio.gastoPasseio,
                dataDespesa: passeio.dataPasseio
            },
            { where: { 
                viagemId: passeio.viagemId,
                passeioId: passeio.idPasseio 
            } })
        },
        async afterDestroy(passeio) {
            await DespesaModel.destroy({
                where: {
                    passeioId: passeio.idPasseio
                }
            })
        }
    }
})

PasseioModel.belongsTo(ViagemModel, {
    foreignKey: "viagemId",
    as: "viagens"
})

ViagemModel.hasMany(PasseioModel, {
    foreignKey: "viagemId",
    as: "passeios"
})

export default PasseioModel