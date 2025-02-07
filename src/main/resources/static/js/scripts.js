const ComputerBinder = {
  toDom: function(computer) {
    document.querySelector('[name=id]').value = computer.id
    document.querySelector('[name=name]').value = computer.name
    document.querySelector('[name=price]').value = computer.price
    document.querySelector('[name=isInStock]').checked = computer.isInStock
    document.querySelector('[name=releaseDate]').value = computer.releaseDate
  },
  fromDom: function() {
    return {
      id: document.querySelector('[name=id]').value,
      name: document.querySelector('[name=name]').value,
      price: document.querySelector('[name=price]').value,
      isInStock: document.querySelector('[name=isInStock]').checked,
      releaseDate: document.querySelector('[name=releaseDate]').value,
    }
  }
}

function loadComputers() {
  showLoader()
  axios
    .get('/get-all')
    .then(result => {
      var tbody = document.getElementById('rows')
      for (let c of result.data) {
        let tr = tbody.children[0];
        let clone = tr.cloneNode(true)
        clone.children[0].innerText = c.name
        clone.children[1].innerText = `${c.price} €`
        clone.children[2].children[0].onclick = () => showDetails(c.id)
        clone.children[3].children[0].onclick = () => deleteComputer(c.id)
        clone.style.display = 'table-row';
        tbody.appendChild(clone)
      }
    })
    .catch(err => alert(err))
    .finally(() => hideLoader())
}

function showDetails(id) {
  document.getElementById('save').onclick = put
  showLoader()
  showDetailsSection()
  axios
    .get('/get/' + id)
    .then(success => ComputerBinder.toDom(success.data))
    .catch(err => alert(err))
    .finally(() => hideLoader())
}

function put() {
  showLoader()
  var computer = ComputerBinder.fromDom()
  axios
    .put('/put', computer)
    .then(success => {
      alert('computer successfully saved!')
      location.reload()
    })
    .catch(err => alert(err))
    .finally(() => hideLoader())
}

function deleteComputer(id) {
  showLoader()
  if (confirm(`Do you really want to remove the computer with id ${id}?`)) {
    axios.delete(`/delete/${id}`)
      .then(() => {
        alert('computer successfully deleted!')
        location.reload()
      })
      .catch(err => alert(err))
      .finally(() => hideLoader())
  }
}

function addComputer() {
    showDetailsSection()
    document.getElementById('save').onclick = post
}

function post() {
  showLoader()
  var computer = ComputerBinder.fromDom()
  var noIdComputer = {
      name: computer.name,
      price: computer.price,
      isInStock: computer.isInStock,
      releaseDate: computer.releaseDate
  }
  axios
    .post('/post', noIdComputer)
    .then(success => {
      alert('computer successfully added!')
      location.reload()
    })
    .catch(err => alert(err))
    .finally(() => hideLoader())
}

function showLoader() {
  document.getElementById('loading-container').style.display = 'flex'
}

function hideLoader() {
  document.getElementById('loading-container').style.display = 'none'
}

function showDetailsSection() {
  document.getElementById('details').style.display = 'block'
}

function hideDetailsSection() {
  document.getElementById('details').style.display = 'none'
}

function undo() {
  hideDetailsSection()
}

window.onload = () => {
  loadComputers()
  document.getElementById('add-computer-button').onclick = addComputer
}
