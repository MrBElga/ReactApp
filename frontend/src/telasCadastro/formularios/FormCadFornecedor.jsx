import React, { useState, useEffect } from "react";
import "./form.css";
import {
  Container,
  Form,
  Row,
  Col,
  FloatingLabel,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  incluirFornecedor,
  atualizarFornecedor,
} from "../../redux/fornecedorReducer";
import ESTADO from "../../recurso/estado.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormCadFornecedor = (props) => {
  const estadoInicialFornecedor = props.fornecedorParaEdicao;
  const FornecedorVazio = {
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    celular: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "SP",
    cep: "",
  };

  const [fornecedor, setFornecedor] = useState(estadoInicialFornecedor);
  const [validated, setValidated] = useState(false);
  const [cnpjDuplicado, setCnpjDuplicado] = useState(false);
  const [emailDuplicado, setEmailDuplicado] = useState(false);

  const { status, mensagem, listaFornecedores } = useSelector(
    (state) => state.fornecedor
  );
  const dispatch = useDispatch();

  useEffect(() => {
    setFornecedor(estadoInicialFornecedor);
  }, [estadoInicialFornecedor]);

  const manipularMudancas = (e) => {
    const componente = e.currentTarget;
    setFornecedor({
      ...fornecedor,
      [componente.name]: componente.value,
    });
  };
  const limparDados = () => {
    setFornecedor(FornecedorVazio);
    props.setModoEdicao(false);
    props.setFornecedorParaEdicao(FornecedorVazio);
    setValidated(false);
    props.setExibirFormulario(false);
  };

  const manipularSubmit = (e) => {
    const form = e.currentTarget;

    if (form.checkValidity()) {
      const cnpjExistente = listaFornecedores.some(
        (itemFornecedor) => itemFornecedor.cnpj === fornecedor.cnpj
      );
      const emailExistente = listaFornecedores.some(
        (itemFornecedor) => itemFornecedor.email === fornecedor.email
      );

      if (!props.modoEdicao) {
        if (cnpjExistente) {
          setCnpjDuplicado(true);
        } else if (emailExistente) {
          setEmailDuplicado(true);
        } else {
          dispatch(incluirFornecedor(fornecedor));
          setFornecedor(FornecedorVazio);
          setValidated(false);
          props.setExibirAlert(true);
          props.setExibirFormulario(false);
        }
      } else {
        dispatch(atualizarFornecedor(fornecedor));
        props.setFornecedorParaEdicao(FornecedorVazio);
        props.setModoEdicao(false);
        setFornecedor(FornecedorVazio);
        setValidated(false);
        props.setExibirAlert(true);
        props.setExibirFormulario(false);
      }
    } else {
      setValidated(true);
    }
    e.stopPropagation();
    e.preventDefault();
  };
  if (status === ESTADO.PENDENTE) {
    toast(
      ({ closeToast }) => (
        <div>
          <Spinner animation="border" role="status"></Spinner>
          <p>Buscando fornecedor....</p>
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
        <Form noValidate validated={validated} onSubmit={manipularSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <FloatingLabel label="Nome:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Informe o nome"
                    id="nome"
                    name="nome"
                    value={fornecedor.nome}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o nome!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <FloatingLabel label="CNPJ:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Informe o CNPJ"
                    id="cnpj"
                    name="cnpj"
                    value={fornecedor.cnpj}
                    readOnly={props.modoEdicao}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o CNPJ!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <FloatingLabel label="Email:" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Informe o email"
                    id="email"
                    name="email"
                    value={fornecedor.email}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe um email válido!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <FloatingLabel label="Telefone:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="(00) 0000-0000"
                    id="telefone"
                    name="telefone"
                    value={fornecedor.telefone}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o Telefone!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <FloatingLabel label="Celular:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="(00) 00000-0000"
                    id="celular"
                    name="celular"
                    value={fornecedor.celular}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o celular!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={10}>
              <Form.Group>
                <FloatingLabel label="Endereço:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Avenida/Rua/Alameda/Viela ..."
                    id="endereco"
                    name="endereco"
                    value={fornecedor.endereco}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o endereco!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <FloatingLabel label="Número" className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Nº"
                    id="numero"
                    name="numero"
                    value={fornecedor.numero}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o número!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group>
                <FloatingLabel label="Bairro:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Bairro/Vila..."
                    id="bairro"
                    name="bairro"
                    value={fornecedor.bairro}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o bairro!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <FloatingLabel label="Cidade" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Cidade"
                    id="cidade"
                    name="cidade"
                    value={fornecedor.cidade}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe a cidade!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <FloatingLabel label="UF:">
                <Form.Select
                  aria-label="Unidades Federativas brasileiras"
                  id="uf"
                  name="uf"
                  value={fornecedor.uf}
                  onChange={manipularMudancas}
                >
                  <option value="SP">São Paulo</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group>
                <FloatingLabel label="CEP:" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="CEP"
                    id="cep"
                    name="cep"
                    value={fornecedor.cep}
                    onChange={manipularMudancas}
                    required
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Informe o CEP!
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="d-flex justify-content-end">
              <Button type="submit" variant="primary">
                {props.modoEdicao ? "Alterar" : "Cadastrar"}
              </Button>

              <Button type="button" variant="secondary" onClick={limparDados}>
                Voltar
              </Button>
            </Col>
          </Row>
          {cnpjDuplicado && (
            <Alert variant="danger">
              O CNPJ já existe. Por favor, escolha outro CNPJ.
            </Alert>
          )}
          {emailDuplicado && (
            <Alert variant="danger">
              O email já existe. Por favor, escolha outro email.
            </Alert>
          )}
        </Form>
      </Container>
    );
  }
};

export default FormCadFornecedor;
