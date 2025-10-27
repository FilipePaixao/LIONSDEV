import bcrypt from 'bcrypt'
import RegisterUserMGS from '../../Schemas/SchemaRegister.js'
import { RetornarSucesso, RetornarErro } from '../../Utils/utils.js'

async function AddUser(req, res) {
    try {
        const Dados = req.body
        const HashSenha = await bcrypt.hash(Dados.Senha, 12)
        const NewUser = await RegisterUserMGS.create({
            ...Dados,
            Senha: HashSenha
        })

        NewUser.Senha = undefined

        return RetornarSucesso(res, "Ususario Criado com sucesso!!")
    } catch(error) {
        console.error(error)
        return RetornarErro(res, "Não foi possivel realizar o registro! Erro interno")
    }
}

export { AddUser }