import { DataTypes, Model } from "sequelize"
import bcrypt from 'bcrypt'
import sequelize from "../config/database"

class UsuarioModel extends Model {
    idUsuario: number | undefined
    nome: string | undefined
    cpfUsuario: string | undefined
    email: string | undefined
    senha: string | undefined

    public async hashSenha() {
        this.senha = await bcrypt.hash(this.senha!, 10)
    }

    public async validarSenha(senha: string) : Promise<boolean> {
        return await bcrypt.compare(senha, this.senha!)
    }

    public static validarNivelSenha(senha: string) {
        const requisitos = {
            temMaiuscula: /[A-Z]/.test(senha),
            temMinuscula: /[a-z]/.test(senha),
            temNumero: /[0-9]/.test(senha),
            temEspecial: /[!@#$%&*°?]/.test(senha),
            tamanhoMinimo: senha.length >= 8
        }
          
        const valida = Object.values(requisitos).every(Boolean)
            
        return {
            valida,
            requisitos,
            mensagem: valida ? 'Senha válida' : 'Senha não atende aos requisitos mínimos'
        }
    }
}

UsuarioModel.init({
    idUsuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cpfUsuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "UsuarioModel",
    tableName: "usuarios"
})

UsuarioModel.beforeCreate(async (usuario: UsuarioModel) => {
    await usuario.hashSenha()
})

UsuarioModel.beforeUpdate(async (usuario: UsuarioModel) => {
    if(usuario.changed('senha')) {
        await usuario.hashSenha()
    }
})

export default UsuarioModel