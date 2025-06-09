let products = [
  { id: 1, name: "Cimento 50kg", quantity: 100, category: "Construção", price: 35.90 },
  { id: 2, name: "Tinta Branca 18L", quantity: 5, category: "Pintura", price: 120.00 },
  { id: 3, name: "Parafusos 100un", quantity: 200, category: "Ferragens", price: 15.50 },
];
let editId = null;
let sortColumn = 'id';
let sortDirection = 'asc';

function showToast(message, type) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function validateForm(name, quantity, category, price) {
  const errors = {};
  if (!name.trim()) errors.name = "Nome é obrigatório";
  if (!quantity || quantity <= 0) errors.quantity = "Quantidade deve ser maior que 0";
  if (!category.trim()) errors.category = "Categoria é obrigatória";
  if (!price || price <= 0) errors.price = "Preço deve ser maior que 0";

  ['name', 'quantity', 'category', 'price'].forEach(field => {
    const input = document.getElementById(`product-${field}`);
    const errorEl = document.getElementById(`error-${field}`);
    if (errors[field]) {
      input.classList.add('error');
      errorEl.textContent = errors[field];
      errorEl.classList.remove('hidden');
    } else {
      input.classList.remove('error');
      errorEl.classList.add('hidden');
    }
  });

  return Object.keys(errors).length === 0;
}

function openModal(mode, product = {}) {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modal-title');
  const saveButton = document.getElementById('modal-save');

  document.getElementById('product-name').value = product.name || '';
  document.getElementById('product-quantity').value = product.quantity || '';
  document.getElementById('product-category').value = product.category || '';
  document.getElementById('product-price').value = product.price || '';

  title.textContent = mode === 'add' ? 'Adicionar Produto' : 'Editar Produto';
  saveButton.textContent = mode === 'add' ? 'Adicionar' : 'Salvar';
  editId = mode === 'edit' ? product.id : null;
  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  ['name', 'quantity', 'category', 'price'].forEach(field => {
    document.getElementById(`product-${field}`).classList.remove('error');
    document.getElementById(`error-${field}`).classList.add('hidden');
  });
}

function saveProduct() {
  const name = document.getElementById('product-name').value;
  const quantity = parseInt(document.getElementById('product-quantity').value);
  const category = document.getElementById('product-category').value;
  const price = parseFloat(document.getElementById('product-price').value);

  if (!validateForm(name, quantity, category, price)) {
    showToast('Corrija os erros no formulário.', 'error');
    return;
  }

  if (editId) {
    products = products.map(p => p.id === editId ? { id: editId, name, quantity, category, price } : p);
    showToast('Produto atualizado com sucesso!', 'success');
  } else {
    products.push({ id: products.length + 1, name, quantity, category, price });
    showToast('Produto adicionado com sucesso!', 'success');
  }

  closeModal();
  updateUI();
}

function removeProduct(id) {
  products = products.filter(p => p.id !== id);
  showToast('Produto removido com sucesso!', 'success');
  updateUI();
}

function exportToCSV() {
  const headers = ['ID,Nome,Quantidade,Categoria,Preço'];
  const rows = products.map(p => `${p.id},${p.name},${p.quantity},${p.category},${p.price}`);
  const csvContent = headers.concat(rows).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'estoque.csv';
  a.click();
  window.URL.revokeObjectURL(url);
  showToast('Estoque exportado como CSV!', 'success');
}

function resetData() {
  products = [
    { id: 1, name: "Cimento 50kg", quantity: 100, category: "Construção", price: 35.90 },
    { id: 2, name: "Tinta Branca 18L", quantity: 5, category: "Pintura", price: 120.00 },
    { id: 3, name: "Parafusos 100un", quantity: 200, category: "Ferragens", price: 15.50 },
  ];
  showToast('Dados resetados com sucesso!', 'success');
  updateUI();
}

function sortTable(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }

  products.sort((a, b) => {
    const valA = a[column];
    const valB = b[column];
    if (typeof valA === 'string') {
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortDirection === 'asc' ? valA - valB : valB - valA;
  });

  updateUI();
}

function clearFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('category-filter').value = '';
  updateUI();
}

function updateUI() {
  // Atualizar tabela
  const tbody = document.querySelector('#product-table tbody');
  tbody.innerHTML = '';
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filterCategory = document.getElementById('category-filter').value;
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) &&
    (filterCategory ? p.category === filterCategory : true)
  );

  filteredProducts.forEach(p => {
    const row = document.createElement('tr');
    row.className = p.quantity < 10 ? 'low-stock' : '';
    row.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}${p.quantity < 10 ? ' <span class="low-stock-text">(Estoque baixo)</span>' : ''}</td>
      <td>${p.quantity}</td>
      <td>${p.category}</td>
      <td>R$ ${p.price.toFixed(2)}</td>
      <td>
        <button class="edit" onclick="openModal('edit', ${JSON.stringify(p)})">
          <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          Editar
        </button>
        <button class="delete" onclick="removeProduct(${p.id})">
          <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          Remover
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Atualizar dashboard
  document.getElementById('total-products').textContent = products.length;
  document.getElementById('total-quantity').textContent = products.reduce((sum, p) => sum + p.quantity, 0);
  document.getElementById('total-value').textContent = `R$ ${products.reduce((sum, p) => sum + p.quantity * p.price, 0).toFixed(2)}`;

  // Atualizar seletor de categorias
  const categories = [...new Set(products.map(p => p.category))];
  const categoryFilter = document.getElementById('category-filter');
  const currentValue = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="">Todas Categorias</option>' + 
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  categoryFilter.value = currentValue;

  // Atualizar gráfico
  const chart = document.getElementById('stock-chart');
  chart.innerHTML = '';
  const maxQuantity = Math.max(...categories.map(cat => 
    products.filter(p => p.category === cat).reduce((sum, p) => sum + p.quantity, 0)), 1);
  categories.forEach(cat => {
    const quantity = products.filter(p => p.category === cat).reduce((sum, p) => sum + p.quantity, 0);
    const bar = document.createElement('div');
    bar.className = 'chart-bar';
    bar.style.height = `${(quantity / maxQuantity) * 100}%`;
    bar.setAttribute('data-value', `${cat}: ${quantity}`);
    chart.appendChild(bar);
  });

  // Atualizar legenda
  const legend = document.getElementById('chart-legend');
  legend.innerHTML = categories.map(cat => `
    <div class="legend-item">
      <span class="legend-color"></span>
      ${cat}
    </div>
  `).join('');

  // Atualizar ícones de ordenação
  document.querySelectorAll('th .sort-icon').forEach(icon => {
    icon.className = 'sort-icon';
  });
  const sortIcon = document.querySelector(`th[onclick="sortTable('${sortColumn}')"] .sort-icon`);
  if (sortIcon) sortIcon.className = `sort-icon sort-${sortDirection}`;
}

// Inicializar UI e eventos
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  document.getElementById('search-input').addEventListener('input', updateUI);
  document.getElementById('category-filter').addEventListener('change', updateUI);
  document.getElementById('modal').addEventListener('click', function(event) {
    if (event.target === this) {
      closeModal();
    }
  });
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
});