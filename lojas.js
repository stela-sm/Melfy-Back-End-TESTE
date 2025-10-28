// -------------------------- CADASTRO DE LOJA ----------------------------------------

async function cadastrar(dados) {
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/lojas",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );

  //trata o retorno
  retorno = await res.json();
  console.log(retorno);
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
}

document.getElementById("cadastrarBotaoLoja").addEventListener("click", () => {
  const nome = document.getElementById("cadastroNomeLoja").value.trim();
  const email = document.getElementById("cadastroEmailLoja").value.trim();
  const descricao = document
    .getElementById("cadastroDescricaoLoja")
    .value.trim();
  const telefone = document.getElementById("cadastroTelefoneLoja").value.trim();
  const cpf_cnpj = document.getElementById("cadastroCpfCnpjLoja").value.trim();
  const senha = document.getElementById("cadastroSenhaLoja").value.trim();

  if (!nome || !email || !descricao || !telefone || !cpf_cnpj || !senha) {
    alert("Preencha todos os campos antes de cadastrar.");
    return;
  }

  const dados = { nome, email, descricao, telefone, cpf_cnpj, senha };
  cadastrar(dados);
});

//-----------------------------------------------PEGAR INFO DO CLIENTE -----------------------------------//
//essa rota NECESSITA do token jwt, ela só vai funcionar quando o login já foi feito

async function fetchLoja() {
  try {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/lojas",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
        },
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao buscar loja: " + res.status);
    }

    const data = await res.json();
    console.log("Dados recebidos:", data.result[0]);

    // supondo que o retorno seja um objeto com os campos esperados
    const loja = data.result[0];

    document.getElementById("atualizaNomeLoja").value = loja.nome || "";
    document.getElementById("atualizaEmailLoja").value = loja.email || "";
    document.getElementById("atualizaDescricaoLoja").value =
      loja.descricao || "";
    document.getElementById("atualizaTelefoneLoja").value = loja.telefone || "";
    document.getElementById("atualizaCpfCnpjLoja").value = loja.cpf_cnpj || "";

    alert("Campos preenchidos com sucesso!");
  } catch (erro) {
    console.error("Erro no fetchLoja:", erro);
    alert("Erro ao buscar dados da loja. Veja o console.");
  }
}

// ------------------------------------------- LOGIN DE LOJA -------------------------------

async function logar(email, senha) {
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/lojas/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    }
  );

  //trata o retorno
  json = await res.json();
  console.log(await json);
  //seta o token no localstorage super ultra hiper mega importante. ESSE TOKEN VAI SER ENVIADO EM TODAS AS REQUESTS.
  //Toda vez que o usuário loga, isso muda. Então se quiser fazer logout é só destruir esse token
  localStorage.setItem("tokenLoja", json.token);
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
  fetchLoja();
}

document.getElementById("loginBotaoLoja").addEventListener("click", () => {
  const email = document.getElementById("loginEmailLoja").value.trim();
  const senha = document.getElementById("loginSenhaLoja").value.trim();

  if (!email || !senha) {
    alert("Preencha e-mail e senha para logar.");
    return;
  }

  logar(email, senha);
});

// ------------------------------------ ATUALIZAR LOJA ------------------------------
async function atualizar(dados) {
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/lojas",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
      },
      body: JSON.stringify(dados),
    }
  );

  //trata o retorno
  console.log(await res.json());
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
  fetchCliente();
}

document.getElementById("atualizarBotaoLoja").addEventListener("click", () => {
  const campos = {
    nome: document.getElementById("atualizaNomeLoja").value.trim(),
    email: document.getElementById("atualizaEmailLoja").value.trim(),
    descricao: document.getElementById("atualizaDescricaoLoja").value.trim(),
    telefone: document.getElementById("atualizaTelefoneLoja").value.trim(),
    cpf_cnpj: document.getElementById("atualizaCpfCnpjLoja").value.trim(),
  };

  const dados = {};
  for (let key in campos) {
    if (campos[key]) dados[key] = campos[key];
  }

  if (Object.keys(dados).length === 0) {
    alert("Preencha pelo menos um campo para atualizar.");
    return;
  }

  atualizar(dados);
});

// ------------------------------------------- DELETAR LOJA -------------------------------------

//essa rota também exige o token

async function deletar() {
  console.log(localStorage.getItem("tokenLoja"));
  const res = await fetch(
    "https://melfy-backend-production.up.railway.app/lojas",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
      },
    }
  );
  console.log(await res.json());
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
  //destrói o token
  localStorage.removeItem("tokenLoja");
}

document.getElementById("deletarBotaoLoja").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja deletar esta loja?")) {
    deletar();
  }
});

//---------------------------PEGAR OS PRODUTOS DA LOJA -----------------------------------------------
async function fetchProdutos() {
  try {
    const res = await fetch(
      `https://melfy-backend-production.up.railway.app/produtos/fetch`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
        },
      }
    );

    const data = await res.json();
    console.log("Produtos recebidos:", data);

    const container = document.getElementById("meusProdutos");
    container.innerHTML = ""; // limpa antes de preencher

    data.result.forEach((produto) => {
      const imagem = produto.midia?.imagens?.[0]?.path;
      const div = document.createElement("div");
      div.classList.add("produto");

      div.innerHTML = `
    <img src="${imagem}" alt="${produto.nome}" width="120">
    <h3>${produto.nome}</h3>
    <p>${produto.descricao}</p>
    <p><strong>Valor:</strong> R$ ${produto.valor_uni}</p>
    <p><strong>Prazo:</strong> ${produto.prazo} dias</p>
    <button class="btn-rmv-produto" data-id="${produto.id_produto}">Deletar</button>
  `;

      // adiciona o evento AQUI
      div
        .querySelector(".btn-rmv-produto")
        .addEventListener("click", async (e) => {
          const idProduto = e.target.getAttribute("data-id");
          await deletaProduto(idProduto);
        });

      container.appendChild(div);
    });
  } catch (err) {
    console.log(err);
  }
}

fetchProdutos();

//---------------------------------------------DELETAR PRODUTO----------------------------------------

async function deletaProduto(idProd) {
  try {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/produtos?id=" + idProd,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
        },
      }
    );

    const data = await res.json();
    console.log(data);

    if (res.ok && !data.error) {
      alert("Produto deletado com sucesso!");
      fetchProdutos();
    } else {
      alert("Erro ao deletar produto: " + (data.message || "tente novamente."));
    }
  } catch (erro) {
    console.error("Erro em deletaProduto:", erro);
    alert("Falha ao deletar o produto. Veja o console.");
  }
}

//--------------------------------------NOVO ENDEREÇO----------------------------------------
async function enviarEndereco(data) {
  try {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/lojas/endereco",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
        },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();
    console.log("Resposta da API:", result);
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

document
  .getElementById("enderecoForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      cep: document.getElementById("cep").value,
      pais: document.getElementById("pais").value,
      estado: document.getElementById("estado").value,
      cidade: document.getElementById("cidade").value,
      bairro: document.getElementById("bairro").value,
      rua: document.getElementById("rua").value,
      numero: document.getElementById("numero").value || null,
      bloco: document.getElementById("bloco").value || null,
      apto: document.getElementById("apto").value || null,
      obs: document.getElementById("obs").value || null,
      nome: document.getElementById("nome").value,
    };

    enviarEndereco(data);
  });

//------------------------------------BUSCAR ENDEREÇOS----------------------------------
async function buscarEnderecos() {
  try {
    const res = await fetch(
      "https://melfy-backend-production.up.railway.app/lojas/endereco",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
        },
      }
    );

    if (!res.ok) throw new Error("Erro ao buscar endereços");

    const enderecos = await res.json();
    console.log("Endereços:", enderecos);

    const lista = document.getElementById("listaEnderecos");
    lista.innerHTML = "";

    enderecos.result.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("endereco-item");
      div.dataset.id = item.id; // importante para editar/deletar no backend

      div.innerHTML = `
    <input type="text" class="end-nome" value="${
      item.nome
    }" placeholder="Nome do Endereço">

    <input type="text" class="end-rua" value="${item.rua}" placeholder="Rua">
    <input type="text" class="end-numero" value="${
      item.numero || ""
    }" placeholder="Número">
    <input type="text" class="end-bairro" value="${
      item.bairro
    }" placeholder="Bairro">

    <input type="text" class="end-cidade" value="${
      item.cidade
    }" placeholder="Cidade">
    <input type="text" class="end-estado" value="${
      item.estado
    }" placeholder="Estado" maxlength="2">
    <input type="text" class="end-cep" value="${item.cep}" placeholder="CEP">

    <button class="btn-salvar">Salvar</button>
    <button class="btn-excluir">Excluir</button>
    <hr>
  `;

      lista.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    alert("Falha ao carregar endereços. ");
  }
}

buscarEnderecos();
