

//----------------------------------------------FETCH PRODUTOS -----------------------------------------
//a busca é feita nos parâmetros da url, então pode ser tipo:
// http://localhost:8000/produtos?busca=brigadeiro
// http://localhost:8000/produtos?loja=3
// http://localhost:8000/produtos?categoria=3
async function fetchProdutos() {
  try {
    const res = await fetch("http://localhost:8000/produtos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar produtos: " + res.status);
    }

    const data = await res.json();
    console.log("Produtos recebidos:", data.result);

    const container = document.getElementById("listaProdutos");
    container.innerHTML = "";

    if (!data.result || data.result.length === 0) {
      container.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    data.result.forEach((produto) => {
      const div = document.createElement("div");
      div.classList.add("item-produto");
      const categorias = produto.categorias.join(", ");



      div.innerHTML = `
        <img src="${produto.midia.imagens[0].path}" alt="${produto.nome}" width="120">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p><strong>Preço:</strong> R$ ${produto.valor_uni}</p>
        <p><strong>Prazo:</strong> ${produto.prazo} dias</p>
        <p><strong>Categorias:</strong>: ${categorias}</p>
        <button class="btn-add-carrinho" data-id="${produto.id_produto}">
          Adicionar ao carrinho
        </button>
      `;

      container.appendChild(div);
    });


    // adiciona evento pros botões criados dinamicamente
    document.querySelectorAll(".btn-add-carrinho").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const idProduto = e.target.getAttribute("data-id");
        await adicionarAoCarrinho(idProduto);
      });
    });

    alert("Produtos carregados com sucesso!");
  } catch (erro) {
    console.error("Erro no fetchProdutos:", erro);
    alert("Erro ao buscar produtos. Veja o console.");
  }
}


    fetchProdutos();

//--------------------------------------------------ADICIONA AO CARRINHO--------------------------------
//ESSE AQUI PRECISA DO TOKEN, ID DO PRODUTO E QUANTIDADE.

async function adicionarAoCarrinho(idProduto) {
    
console.log(idProduto);
  try {
    const res = await fetch("http://localhost:8000/carrinho?id=" + idProduto, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
      },
      body: JSON.stringify({ qtd: 1 }),
    });

    const data = await res.json();
    console.log(data)
    alert(data.message || "Produto adicionado ao carrinho!");
  } catch (erro) {
    console.error("Erro em adicionarAoCarrinho:", erro);
    alert("Falha ao adicionar ao carrinho. Veja o console.");
  }
}


//---------------------------------ADICIONA PRODUTO (APENAS PARA LOJAS)-------------------------------------
document.getElementById("formProduto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = new FormData(e.target);

  try {
    const res = await fetch("http://localhost:8000/produtos", {
      method: "POST",
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem("tokenLoja"),
      },
      body: form,
    });

    const data = await res.json();
    console.log("Resposta do servidor:", data);
    alert("Produto enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar produto:", err);
    alert("Falha no envio. Veja o console.");
  }
});
