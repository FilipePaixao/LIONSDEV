import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import RegisterUserMGS from "../../Schemas/SchemaRegister.js";
import { RetornarSucesso, RetornarErro } from "../../Utils/utils.js";

async function RemoveUser(req, res) {
    try {
        const { id } = req.params;
        const { Senha } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return RetornarErro(res, "ID de usuário inválido.", 400);
        }
        if (!Senha) {
            return RetornarErro(res, "A senha é obrigatória para deletar a conta.", 400);
        }
        
        const user = await RegisterUserMGS.findById(id);
        if (!user) {
            return RetornarErro(res, "Usuário não encontrado.", 404);
        }
        
        const senhaCorreta = await bcrypt.compare(Senha, user.Senha);
        if (!senhaCorreta) {
            return RetornarErro(res, "Senha inválida.", 401);
        }
        
        await RegisterUserMGS.findByIdAndDelete(id);
        return RetornarSucesso(res, "Usuário deletado com sucesso.", 200);
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        return RetornarErro(res, "Ocorreu um erro interno no servidor.", 500);
    }
}

export { RemoveUser };