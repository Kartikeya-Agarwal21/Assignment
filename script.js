document.addEventListener('DOMContentLoaded', function() {
  const userList = document.getElementById('userList');
  const createUserBtn = document.getElementById('createUserBtn');
  const userModal = document.getElementById('userModal');
  const closeModal = document.getElementsByClassName('close')[0];
  const userForm = document.getElementById('userForm');
  const pagination = document.getElementById('pagination');

  let currentPage = 1;
  const usersPerPage = 10;
  const maxPagesToShow = 5;

  function fetchUsers(page = 1) {
      currentPage = page;
      fetch(`https://gorest.co.in/public-api/users?page=${page}&per_page=${usersPerPage}`)
          .then(response => response.json())
          .then(data => {
              userList.innerHTML = '';
              data.data.forEach((user, index) => {
                  userList.innerHTML += `
                      <tr>
                          <td>${(page - 1) * usersPerPage + index + 1}</td>
                          <td>${user.name}</td>
                          <td>
                              <a href="#" onclick="viewUser(${user.id})">Show</a>
                              <a href="#" onclick="editUser(${user.id})">Edit</a>
                              <a href="#" onclick="deleteUser(${user.id})">Delete</a>
                          </td>
                      </tr>
                  `;
              });
              setupPagination(data.meta.pagination);
          });
  }

  function setupPagination(paginationData) {
      pagination.innerHTML = '';
      const { page, pages } = paginationData;
      const startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
      const endPage = Math.min(startPage + maxPagesToShow - 1, pages);

      if (page > 1) {
          pagination.innerHTML += `<a href="#" onclick="fetchUsers(${page - 1})">&laquo;</a>`;
      }

      for (let i = startPage; i <= endPage; i++) {
          pagination.innerHTML += `<a href="#" onclick="fetchUsers(${i})" ${i === page ? 'class="active"' : ''}>${i}</a>`;
      }

      if (page < pages) {
          pagination.innerHTML += `<a href="#" onclick="fetchUsers(${page + 1})">&raquo;</a>`;
      }
  }

  createUserBtn.onclick = function() {
      userForm.reset();
      userModal.style.display = 'block';
  }

  closeModal.onclick = function() {
      userModal.style.display = 'none';
  }

  window.onclick = function(event) {
      if (event.target == userModal) {
          userModal.style.display = 'none';
      }
  }

  userForm.onsubmit = function(event) {
      event.preventDefault();
      const formData = new FormData(userForm);
      const userData = {
          name: formData.get('name'),
          email: formData.get('email'),
          gender: formData.get('gender'),
          status: formData.get('status')
      };
      fetch('https://gorest.co.in/public-api/users', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
          },
          body: JSON.stringify(userData)
      }).then(response => response.json())
      .then(data => {
          if (data.code === 201) {
              fetchUsers();
              userModal.style.display = 'none';
          } else {
              alert('Error creating user');
          }
      });
  };

  window.viewUser = function(id) {
      alert('View user details not implemented yet');
  };

  window.editUser = function(id) {
      alert('Edit user not implemented yet');
  };

  window.deleteUser = function(id) {
      if (confirm('Are you sure you want to delete this user?')) {
          fetch(`https://gorest.co.in/public-api/users/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
              }
          }).then(response => response.json())
          .then(data => {
              if (data.code === 204) {
                  fetchUsers();
              } else {
                  alert('Error deleting user');
              }
          });
      }
  };

  fetchUsers();
});
