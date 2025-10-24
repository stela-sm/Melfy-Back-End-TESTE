//-----------------------------------------------CADASTRAR CLIENTE -----------------------------------//

async function cadastrar(dados) {
  const res = await fetch("http://localhost:8000/clientes", {
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

document
  .getElementById("cadastrarBotao")
  .addEventListener("click", function () {
    const nome = document.getElementById("cadastroNome").value.trim();
    const telefone = document.getElementById("cadastroTelefone").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();
    const cpf = document.getElementById("cadastroCpf").value.trim();
    const data_nasc = document
      .getElementById("cadastrodatanasc")
      .value.trim();

    const dados = {
      nome,
      telefone,
      email,
      senha,
      cpf,
      data_nasc,
    };

    // chama a função logar() passando os dados do formulário
    cadastrar(dados);
  });

//-----------------------------------------------LOGAR CLIENTE -----------------------------------//

async function logar(email, senha) {
  const res = await fetch("http://localhost:8000/clientes/login", {
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
  localStorage.setItem("tokenCliente", json.token);
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
fetchCliente();
}

document.getElementById("loginButton").addEventListener("click", function () {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();

  logar(email, senha);

});

//-----------------------------------------------PEGAR INFO DO CLIENTE -----------------------------------//
//essa rota NECESSITA do token jwt, ela só vai funcionar quando o login já foi feito


async function fetchCliente() {
  try {
    const res = await fetch("http://localhost:8000/clientes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar cliente: " + res.status);
    }

    const data = await res.json();
    console.log("Dados recebidos:", data.result[0]);

    // supondo que o retorno seja um objeto com os campos esperados
    document.getElementById("atualizaNome").value = data.result[0].nome || "";
    document.getElementById("atualizaTelefone").value = data.result[0].telefone || "";
    document.getElementById("atualizaEmail").value = data.result[0].email || "";
    document.getElementById("atualizaCpf").value = data.result[0].cpf || "";
    document.getElementById("atualizadatanasc").value = data.result[0].data_nasc || "";

    alert("Campos preenchidos com sucesso!");
  } catch (erro) {
    console.error("Erro no fetchCliente:", erro);
    alert("Erro ao buscar dados do cliente. Veja o console.");
  }
}
//----------------------------------------------DELETA CLIENTE -----------------------------------------//
//essa rota também exige o token

async function deletar() {
  console.log(localStorage.getItem("tokenCliente"));
  const res = await fetch("http://localhost:8000/clientes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
    },
  });
  console.log(await res.json());
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
  //destrói o token
  localStorage.removeItem("tokenCliente");

}

document.getElementById("deletarBotao").addEventListener("click", () => {
  deletar();

});
//

//----------------------------------------------UPDATE CLIENTE -----------------------------------------//

async function atualizar(dados) {
  const res = await fetch("http://localhost:8000/clientes", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
    },
    body: JSON.stringify(dados),
  });

  //trata o retorno
  console.log(await res.json());
  alert("ROTA CHAMADA COM SUCESSO. RESULTADO NO CONSOLE");
  fetchCliente()
}


document.getElementById("atualizarBotao").addEventListener("click", function () {
  const campos = {
    nome: document.getElementById("atualizaNome").value.trim(),
    telefone: document.getElementById("atualizaTelefone").value.trim(),
    email: document.getElementById("atualizaEmail").value.trim(),
    cpf: document.getElementById("atualizaCpf").value.trim(),
    data_nasc: document.getElementById("atualizadatanasc").value.trim(),
  };

  // remove campos vazios
  const dados = {};
  for (let key in campos) {
    if (campos[key]) dados[key] = campos[key];
  }

  if (Object.keys(dados).length === 0) {
    alert("Preencha pelo menos um campo antes de atualizar.");
    return;
  }

  atualizar(dados);
});
