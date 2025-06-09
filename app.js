// ...código existente...

// Carregar produtos do localStorage ao iniciar
let products = JSON.parse(localStorage.getItem('products')) || [];

// Salvar produtos no localStorage sempre que houver alteração
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

// Modifique todas as funções que alteram 'products' para chamar saveProducts()
function addProduct(product) {
  products.push(product);
  saveProducts();
  updateTable();
  updateDashboard();
  showToast('Produto adicionado com sucesso!', 'success');
}

// Faça o mesmo para editar e remover produtos
function editProduct(index, updatedProduct) {
  products[index] = updatedProduct;
  saveProducts();
  updateTable();
  updateDashboard();
  showToast('Produto editado com sucesso!', 'success');
}

function removeProduct(index) {
  products.splice(index, 1);
  saveProducts();
  updateTable();
  updateDashboard();
  showToast('Produto removido com sucesso!', 'success');
}

// ...código existente...