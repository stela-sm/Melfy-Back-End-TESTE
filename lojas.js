// -------------------------- CADASTRO DE LOJA ----------------------------------------


async function cadastrar(dados) {
  const res = await fetch("http://localhost:8000/lojas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

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
    const res = await fetch("http://localhost:8000/lojas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
      },
    });

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
  const res = await fetch("http://localhost:8000/lojas/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      senha: senha,
    }),
  });

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
  const res = await fetch("http://localhost:8000/lojas", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
    },
    body: JSON.stringify(dados),
  });

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
  const res = await fetch("http://localhost:8000/lojas", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
    },
  });
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
    const res = await fetch(`http://localhost:8000/produtos/fetch`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
      },
    });

  

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
  div.querySelector(".btn-rmv-produto").addEventListener("click", async (e) => {
    const idProduto = e.target.getAttribute("data-id");
    await deletaProduto(idProduto);
  });

  container.appendChild(div);
});
  }catch(err){
    console.log(err)
  }}

fetchProdutos();

//---------------------------------------------DELETAR PRODUTO----------------------------------------

async function deletaProduto(idProd) {
  try {
    const res = await fetch("http://localhost:8000/produtos?id=" + idProd, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tokenLoja"),
      },
    });

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

