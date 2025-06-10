import DespesaModel from "./DespesaModel"
import HospedagemModel from "./HospedagemModel"
import ViagemModel from "./ViagemModel"
import TransporteModel from "./TransporteModel"
import PasseioModel from "./PasseioModel"

DespesaModel.belongsTo(ViagemModel, {
    foreignKey: "viagemId",
    as: "viagens"
})
ViagemModel.hasMany(DespesaModel, {
    foreignKey: "viagemId",
    as: "despesas"
})

DespesaModel.belongsTo(HospedagemModel, {
    foreignKey: "hospedagemId",
    as: "hospedagens"
})
HospedagemModel.hasOne(DespesaModel, {
    foreignKey: "hospedagemId",
    as: "despesas"
})

DespesaModel.belongsTo(TransporteModel, {
    foreignKey: "transporteId",
    as: "transportes"
})
TransporteModel.hasOne(DespesaModel, {
    foreignKey: "transporteId",
    as: "despesas"
})

DespesaModel.belongsTo(PasseioModel, {
    foreignKey: "passeioId",
    as: "passeios"
})
PasseioModel.hasOne(DespesaModel, {
    foreignKey: "passeioId",
    as: "despesas"
})

HospedagemModel.belongsTo(ViagemModel, {
    foreignKey: "viagemId",
    as: "viagens"
})
ViagemModel.hasMany(HospedagemModel, {
    foreignKey: "viagemId",
    as: "hospedagens"
})