import { Container, Table, Spinner, Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ESTADO from "../../recurso/estado.js";
import { buscarProdutos, excluirProduto } from "../../redux/produtoReducer";

import "./tabela.css";

export default function TabelaProdutos(props) {
  const { status, mensagem, listaProdutos } = useSelector(
    (state) => state.produto
  );
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [produtoToDelete, setProdutoToDelete] = useState(null);

  useEffect(() => {
    dispatch(buscarProdutos());
  }, [dispatch, produtoToDelete]);

  const customModalStyle = {
    color: "black",
  };

  function Remover(produto) {
    setProdutoToDelete(produto);
    setShowModal(true);
  }

  function confirmarExclusao() {
    if (produtoToDelete) {
      dispatch(excluirProduto(produtoToDelete)).then(() => {
        dispatch(buscarProdutos());
        setShowModal(false);
        setProdutoToDelete(null);
      });
    }
  }

  function cancelarExclusao() {
    setShowModal(false);
    setProdutoToDelete(null);
  }

  function editarProduto(produto) {
    props.setProdutoParaEdicao(produto);
    props.setModoEdicao(true);
    props.exibirFormulario(true);
  }

  if (status === ESTADO.PENDENTE) {
    toast(
      ({ closeToast }) => (
        <div>
          <Spinner animation="border" role="status"></Spinner>
          <p>Buscando produtos....</p>
        </div>
      ),
      { toastId: status }
    );
  } else if (status === ESTADO.ERRO) {
    toast.error(
      ({ closeToast }) => (
        <div>
          <p>{mensagem}</p>
        </div>
      ),
      { toastId: status }
    );
  } else {
    toast.dismiss();
    return (
      <Container>
        <ToastContainer />
        <Button
          type="button"
          onClick={() => {
            props.exibirFormulario(true);
          }}
          variant="primary"
        >
          Novo Produto
        </Button>
        <Table className="table-custom" striped bordered hover>
          <thead>
            <tr>
              <th>Nome do Produto</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Unidades</th>
              <th>Categoria</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaProdutos.map((produto) => {
              return (
                <tr key={produto.nome}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>R$ {produto.preco}</td>
                  <td>{produto.estoque} unidades</td>
                  <td>{produto.categoria.nomeCategoria}</td>

                  <td>
                    <Button
                      className="btn-excluir"
                      onClick={() => {
                        Remover(produto);
                      }}
                    >
                      Excluir
                    </Button>
                    <Button
                      className="btn-editar"
                      onClick={() => {
                        editarProduto(produto);
                      }}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Modal show={showModal} onHide={cancelarExclusao} centered>
          <Modal.Header closeButton>
            <Modal.Title style={customModalStyle}>
              Confirmar Exclusão
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={customModalStyle}>
            Tem certeza de que deseja excluir este produto?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelarExclusao}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
