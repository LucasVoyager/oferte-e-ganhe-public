const Joi = require('joi').extend(require('@joi/date'))

const esquemaLoja = Joi.object({
    id_loja: Joi.number().integer().required().messages({
        'number.base': 'ID da loja deve ser um número.',
        'number.integer': 'ID da loja deve ser um número inteiro.',
        'any.required': 'ID da loja é obrigatório.'
    }),
    nome_loja: Joi.string().max(255).messages({
        'string.base': 'Nome da loja deve ser uma string.',
        'string.max': 'Nome da loja deve ter no máximo 255 caracteres.',
    }),
    cep_loja: Joi.string().pattern(/^[0-9]{5}-[0-9]{3}$/).messages({
        'string.pattern.base': 'CEP deve estar no formato 00000-000.',
    })
})

const esquemaEstoque = Joi.object({
    id_estoque: Joi.number().integer().messages({
        'number.base': 'ID do estoque deve ser um numero',
        'number.integer': 'ID do estoque deve ser um inteiro',
        'any.allowOnly': 'ID do estoque não pode ser nulo.'
    }),
    status: Joi.string().max(255).messages({
        'string.base': 'status deve ser uma string',
        'string.max': 'status deve ter seu tamanho de no maximo 255'
    }),
    id_loja: Joi.number().integer().messages({
        'number.base': 'ID da loja deve ser um numero',
        'number.integer': 'ID da loja deve ser um inteiro',
        'any.allowOnly': 'ID da loja não pode ser nulo.'
    }),
    quantidade_atual: Joi.number().integer().messages({
        'number.base': 'Quantidade atual deve ser um numero',
        'number.integer': 'Quantidade atual deve ser um inteiro',
        'any.allowOnly': 'Quantidade atual não pode ser nula.'
    }),
    quantidade_minima: Joi.number().integer().messages({
        'number.base': 'Quantidade minima deve ser um numero',
        'number.integer': 'Quantidade minima deve ser um inteiro',
        'any.allowOnly': 'Quantidade minima não pode ser nula.'
    }),
    quantidade_recomendada: Joi.number().integer().messages({
        'number.base': 'Quantidade recomendada deve ser um numero',
        'number.integer': 'Quantidade recomendada deve ser um inteiro',
        'any.allowOnly': 'Quantidade recomendada não pode ser nula.'
    })
})

const esquemaUsuario = Joi.object({
    matricula_usuario: Joi.number().integer().messages({
        'number.base': 'A matrícula do usuário deve ser um número.',
        'number.integer': 'A matrícula do usuário deve ser um número inteiro.',
        'any.allowOnly': 'A matrícula do usuário não pode ser nula.'
    }),
    nome: Joi.string().max(255).messages({
        'string.base': 'O nome deve ser uma string.',
        'string.max': 'O nome deve ter no máximo 255 caracteres.',
        'any.allowOnly': 'O nome não pode ser nulo.'
    }),
    email: Joi.string().email().messages({
        'string.base': 'O email deve ser uma string.',
        'string.email': 'O email deve ser um endereço de email válido.',
        'any.allowOnly': 'O email não pode ser nulo.'
    }),
    senha: Joi.string().max(255).messages({
        'string.base': 'A senha deve ser uma string.',
        'string.max': 'A senha deve ter no máximo 255 caracteres.',
        'any.allowOnly': 'A senha não pode ser nula.'
    }),
    id_loja: Joi.number().integer().messages({
        'number.base': 'O ID da loja deve ser um número.',
        'number.integer': 'O ID da loja deve ser um número inteiro.',
        'any.allowOnly': 'O ID da loja não pode ser nulo.'
    }),
    id_perfil: Joi.number().integer().allow(null).messages({
        'number.base': 'O ID do perfil deve ser um número.',
        'number.integer': 'O ID do perfil deve ser um número inteiro.',
    }),
    criado_por: Joi.string().max(255).messages({
        'string.base': 'O campo "criado por" deve ser uma string.',
        'string.max': 'O campo "criado por" deve ter no máximo 255 caracteres.',
        'any.allowOnly': 'O campo "criado por" não pode ser nulo.'
    })
})

const esquemaPerfil = Joi.object({ 
    id_perfil: Joi.number().integer().messages({ 
        'number.base': 'O ID do perfil deve ser um número.', 
        'number.integer': 'O ID do perfil deve ser um número inteiro.' 
    }), 
    nome_perfil: Joi.string().max(255).messages({ 
        'string.base': 'O nome do perfil deve ser uma string.', 
        'string.max': 'O nome do perfil deve ter no máximo 255 caracteres.',
        'any.allowOnly': 'O nome do perfil não pode ser nulo.'
    }) 
})

const esquemaPermissaoPerfil = Joi.object({ 
    id_permissao_perfil: Joi.number().integer().messages({ 
        'number.base': 'O ID da permissão do perfil deve ser um número.', 
        'number.integer': 'O ID da permissão do perfil deve ser um número inteiro.'
    }), 
    id_permissao: Joi.number().integer().messages({ 
        'number.base': 'O ID da permissão deve ser um número.', 
        'number.integer': 'O ID da permissão deve ser um número inteiro.',
        'any.allowOnly': 'A permissao  não pode ser nula.'
    }), 
    id_perfil: Joi.number().integer().messages({ 
        'number.base': 'O ID do perfil deve ser um número.', 
        'number.integer': 'O ID do perfil deve ser um número inteiro.',
        'any.allowOnly': 'o id do perfil não pode ser nulo.'
    }) 
})

const esquemaTransacao = Joi.object({
    id_talao: Joi.number().integer().messages({
        'number.base': 'O ID do talão deve ser um número.',
        'number.integer': 'O ID do talão deve ser um número inteiro.'
    }),
    quantidade_talao_solicitado: Joi.number().integer().messages({
        'number.base': 'A quantidade de talão solicitado deve ser um número.',
        'number.integer': 'A quantidade de talão solicitado deve ser um número inteiro.',
        'any.allowOnly': 'quantidade talao solicitado não pode ser nulo.'
    }),
    quantidade_talao_enviado: Joi.number().integer().messages({
        'number.base': 'A quantidade de talão enviado deve ser um número.',
        'number.integer': 'A quantidade de talão enviado deve ser um número inteiro.',
        'any.allowOnly': 'quantidade talao enviado não pode ser nulo.'
    }),
    quantidade_talao_recebido: Joi.number().integer().messages({
        'number.base': 'A quantidade de talão recebido deve ser um número.',
        'number.integer': 'A quantidade de talão recebido deve ser um número inteiro.',
        'any.allowOnly': 'quantidade talao recebido não pode ser nulo.'
    }),
    status: Joi.string().max(255).messages({
        'string.base': 'O status deve ser uma string.',
        'string.max': 'O status deve ter no máximo 255 caracteres.',
        'any.allowOnly': 'status não pode ser nulo.'
    }),
    data_hora_envio: Joi.date().format('DD/MM/YYYY').messages({
        'date.base': 'A data e hora de envio deve ser uma data válida.',
        'any.allowOnly': 'data e hora nao podem ser nulas'
    }),
    data_entrega_prevista: Joi.date().format('DD/MM/YYYY').messages({
        'date.base': 'A data de entrega prevista deve ser uma data válida.',
        'any.allowOnly': 'data e hora nao podem ser nulas'
    }),
    data_hora_recebimento: Joi.date().format('DD/MM/YYYY').messages({
        'date.base': 'A data e hora de recebimento deve ser uma data válida.',
        'any.allowOnly': 'data e hora nao podem ser nulas'
    }),
    numero_remessa: Joi.number().integer().messages({
        'number.base': 'O número de remessa deve ser um número.',
        'number.integer': 'O número de remessa deve ser um número inteiro.',
        'any.allowOnly': 'numero da remessa nao pode ser nulo'
    }),
    id_usuario: Joi.number().integer().messages({
        'number.base': 'O ID do usuário deve ser um número.',
        'number.integer': 'O ID do usuário deve ser um número inteiro.',
        'any.allowOnly': 'id usuario nao pode ser nulo'
    }),
    id_loja: Joi.number().integer().messages({
        'number.base': 'O ID da loja deve ser um número.',
        'number.integer': 'O ID da loja deve ser um número inteiro.',
        'any.allowOnly': 'id loja nao pode ser nulo'
    })
})

module.exports = {
    esquemaLoja,
    esquemaEstoque,
    esquemaUsuario,
    esquemaPerfil,
    esquemaPermissaoPerfil,
    esquemaTransacao
}
