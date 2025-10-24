//aqui precisa estar logado como cliente, e ter o tokenCliente no localstorage

if (!localStorage.getItem("tokenCliente")) {
  alert("Faça o login primeiro");
  window.location.href = "cliente.html";
}

//--------------------------------------------FETCH CARRINHO ------------------------------------------
async function fetchCarrinho() {
  try {
    const res = await fetch("http://localhost:8000/carrinho", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
      },
    });

    if (!res.ok) {
      throw new Error("Erro ao buscar carrinho: " + res.status);
    }

    const data = await res.json();
    console.log("Itens do carrinho recebidos:", data.result);

    const container = document.getElementById("listaCarrinho");
    container.innerHTML = ""; // limpa antes de preencher

    if (!data.result || data.result.length === 0) {
      container.innerHTML = "<p>Carrinho vazio.</p>";
      return;
    }

    data.result.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("item-carrinho");

      div.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}" width="120">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <p><strong>Quantidade:</strong> ${item.quantidade}</p>
        <button class="btn-rmv-carrinho" data-id="${item.id_produto}">
         -1
        </button>
        <p><strong>Valor unitário:</strong> R$ ${item.valor_uni}</p>
        <p><strong>Prazo:</strong> ${item.prazo} dias</p>
       
      `;

      container.appendChild(div);
    });

    alert("Itens do carrinho carregados com sucesso!");
  } catch (erro) {
    console.error("Erro no fetchCarrinho:", erro);
    alert("Erro ao buscar carrinho. Veja o console.");
  }

  // adiciona evento pros botões criados dinamicamente
  document.querySelectorAll(".btn-rmv-carrinho").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idProduto = e.target.getAttribute("data-id");
      await removeDoCarrinho(idProduto);
    });
  });
}


document.addEventListener("DOMContentLoaded", function() {
fetchCarrinho();})


//------------------------------------------REMOVER ITEM CARRINHO------------------------------------
//aqui remove de 1 em 1, mas se você quiser remover o PRODUTO do carrinho, só colocar no qtd o a quantidade total do produto no carrinho. o qtd não é obrigatório

async function removeDoCarrinho(idProduto) {
  console.log(idProduto);
  try {
    const res = await fetch("http://localhost:8000/carrinho?id=" + idProduto, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("tokenCliente"),
      },
      body: JSON.stringify({ qtd: 1 }),
    });

    const data = await res.json();
    console.log(data);
    alert(data.message || "Produto removido do carrinho!");
  } catch (erro) {
    console.error("Erro em removerDoCarrinho:", erro);
    alert("Falha ao remover do carrinho. Veja o console.");
  }
}

