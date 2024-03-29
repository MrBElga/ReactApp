import Fornecedor from "../Modelo/Fornecedor.js";
import conectar from "../Persistencia/Conexao.js";

export default class FornecedorCTRL {
  async gravar(requisicao, resposta) {
    const conexao = await conectar();
    resposta.setHeader("Content-Type", "application/json");

    if (requisicao.method === "POST") {
      if (requisicao.is("application/json")) {
        const {
          cnpj,
          nome,
          telefone,
          celular,
          endereco,
          numero,
          bairro,
          cidade,
          uf,
          cep,
          email,
        } = requisicao.body;
        const prior = 2;
        if (
          cnpj &&
          nome &&
          telefone &&
          celular &&
          email &&
          endereco &&
          numero &&
          bairro &&
          cidade &&
          uf &&
          cep &&
          prior
        ) {
          const fornecedor = new Fornecedor(
            cnpj,
            nome,
            telefone,
            celular,
            endereco,
            numero,
            bairro,
            cidade,
            uf,
            cep,
            email,
            prior
          );

          fornecedor
            .gravar(conexao)
            .then((fornecedor) => {
              resposta.json({
                status: true,
                codigoGerdao: fornecedor.codigo,
                mensagem: "Fornecedor gravado com sucesso!",
              });
            })
            .catch((erro) => {
              resposta.json({
                status: false,
                mensagem: "Erro ao gravar o fornecedor: " + erro.message,
              });
            });
        } else {
          resposta.json({
            status: false,
            mensagem:
              "Verifique a documentação da API e informe todos os dados necessários de um fornecedor!",
          });
        }
      } else {
        resposta.json({
          status: false,
          mensagem: "A requisição deve possuir um payload application/json",
        });
      }
    } else {
      resposta.json({
        status: false,
        mensagem: "Para registrar um fornecedor utilize o método POST!",
      });
    }
  }

  async atualizar(requisicao, resposta) {
    const conexao = await conectar();
    resposta.setHeader("Content-Type", "application/json");

    if (requisicao.method === "PUT") {
      if (requisicao.is("application/json")) {
        const { id } = requisicao.params;
        const {
          cnpj,
          nome,
          telefone,
          celular,
          email,
          endereco,
          numero,
          bairro,
          cidade,
          uf,
          cep,
        } = requisicao.body;
        const prior = 2;
        if (
          cnpj &&
          celular &&
          nome &&
          telefone &&
          email &&
          endereco &&
          numero &&
          bairro &&
          cidade &&
          uf &&
          cep &&
          prior
        ) {
          const fornecedor = new Fornecedor(
            cnpj,
            nome,
            telefone,
            celular,
            endereco,
            numero,
            bairro,
            cidade,
            uf,
            cep,
            email,
            prior
          );
          fornecedor.codigo = id;
          fornecedor
            .atualizar(conexao)
            .then(() => {
              resposta.json({
                status: true,
                fornecedor,
                mensagem: "Fornecedor atualizado com sucesso!",
              });
            })
            .catch((erro) => {
              resposta.json({
                status: false,
                mensagem: "Erro ao atualizar o fornecedor: " + erro.message,
              });
            });
        } else {
          resposta.json({
            status: false,
            mensagem:
              "Verifique a documentação da API e informe todos os dados necessários de um fornecedor!",
          });
        }
      } else {
        resposta.json({
          status: false,
          mensagem: "A requisição deve possuir um payload application/json",
        });
      }
    } else {
      resposta.json({
        status: false,
        mensagem: "Para atualizar um fornecedor utilize o método PUT!",
      });
    }
  }

  async excluir(requisicao, resposta) {
    const conexao = await conectar();
    resposta.setHeader("Content-Type", "application/json");

    if (requisicao.method === "DELETE") {
      if (requisicao.is("application/json")) {
        const { id } = requisicao.params;
        console.log(id)
        if (id) {
          const fornecedor = new Fornecedor();
       
          fornecedor
            .excluir(id, conexao)
            .then(() => {
              resposta.json({
                status: true,
                fornecedor,
                mensagem: "Fornecedor excluído com sucesso!",
              });
            })
            .catch((erro) => {
              resposta.json({
                status: false,
                mensagem: "Erro ao excluir o fornecedor: " + erro.message,
              });
            });
        } else {
          resposta.json({
            status: false,
            mensagem:
              "Especifique na URL o CNPJ do fornecedor que deseja excluir!",
          });
        }
      } else {
        resposta.json({
          status: false,
          mensagem: "A requisição deve possuir um payload application/json",
        });
      }
    } else {
      resposta.json({
        status: false,
        mensagem: "Para excluir um fornecedor utilize o método DELETE!",
      });
    }
  }

  async consultar(requisicao, resposta) {
    const conexao = await conectar();
    resposta.type("application/json");

    if (requisicao.method === "GET") {
      const fornecedor = new Fornecedor();
      fornecedor
        .consultar(conexao)
        .then((listaFornecedores) => {
          resposta.json({
            status: true,
            listaFornecedores,
          });
        })
        .catch((erro) => {
          resposta.json({
            status: false,
            mensagem: "Erro ao consultar fornecedores: " + erro.message,
          });
        });
    } else {
      resposta.json({
        status: false,
        mensagem: "Para consultar fornecedores utilize o método GET!",
      });
    }
  }

  async consultarID(requisicao, resposta) {
    const conexao = await conectar();
    resposta.type("application/json");

    if (requisicao.method === "GET") {
      const { id } = requisicao.params;

      if (id) {
        const fornecedor = new Fornecedor();
        fornecedor.codigo = id;
        fornecedor
          .consultarID(id, conexao)
          .then((fornecedorConsultado) => {
            resposta.json(fornecedorConsultado);
          })
          .catch((erro) => {
            resposta.json({
              status: false,
              mensagem: "Erro ao consultar fornecedor por id: " + erro.message,
            });
          });
      } else {
        resposta.json({
          status: false,
          mensagem:
            "Especifique na URL o id do fornecedor que deseja consultar!",
        });
      }
    } else {
      resposta.json({
        status: false,
        mensagem: "Para consultar um fornecedor por id utilize o método GET!",
      });
    }
  }
}
