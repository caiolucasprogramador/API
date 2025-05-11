document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        createUserForm: '#createUserForm',
        updateUserForm: '#updateUserForm',
        deleteUserForm: '#deleteUserForm',
        listUsersButton: '#list-users-button',
        userList: '#user-list',
        createMessageDiv: '#create-message',
        updateMessageDiv: '#update-message',
        deleteMessageDiv: '#delete-message',
        listMessageDiv: '#list-message'
    }

    const $ = (selector) => document.querySelector(selector)
    const API_URL = 'http://localhost:3000/usuarios'

    const showMessage = (elementSelector, message, type = 'info') => {
        const el = $(elementSelector)
        el.textContent = message
        el.className = `message ${type}`
        setTimeout(() => {
            el.textContent = ''
            el.className = 'message'
        }, 3000)
    }

    const handleCreateUser = async (event) => {
        event.preventDefault()
        const form = event.target
        const newUser = {
            name: form.querySelector('#create-name').value,
            email: form.querySelector('#create-email').value,
            age: form.querySelector('#create-age').value ? parseInt(form.querySelector('#create-age').value) : undefined,
            description: form.querySelector('#create-description').value,
            interests: form.querySelector('#create-interests').value || null
        }

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            })
            const data = await res.json()
            if (res.ok) {
                showMessage(elements.createMessageDiv, 'Usuário criado!', 'success')
                form.reset()
                fetchUsers()
            } else {
                showMessage(elements.createMessageDiv, `Erro ao criar: ${data.message || 'Algo deu errado'}`, 'error')
            }
        } catch (err) {
            console.error('Falha ao criar usuário:', err)
            showMessage(elements.createMessageDiv, 'Problema de conexão.', 'error')
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch(API_URL)
            const users = await res.json()
            const userListEl = $(elements.userList)
            userListEl.innerHTML = ''
            if (res.ok) {
                if (users.length) {
                    users.forEach(user => {
                        const li = document.createElement('li')
                        li.textContent = `${user.name} (ID: ${user.id}, Email: ${user.email})`
                        userListEl.appendChild(li)
                    })
                    showMessage(elements.listMessageDiv, 'Usuários carregados.', 'success')
                } else {
                    showMessage(elements.listMessageDiv, 'Nenhum usuário por aqui.')
                }
            } else {
                showMessage(elements.listMessageDiv, 'Erro ao buscar usuários.', 'error')
            }
        } catch (err) {
            console.error('Erro ao buscar:', err)
            showMessage(elements.listMessageDiv, 'Sem conexão com o servidor.', 'error')
        }
    }

    const handleUpdateUser = async (event) => {
        event.preventDefault()
        const form = event.target
        const id = form.querySelector('#update-id').value
        const updatedUser = {
            name: form.querySelector('#update-name').value,
            email: form.querySelector('#update-email').value,
            age: form.querySelector('#update-age').value ? parseInt(form.querySelector('#update-age').value) : undefined,
            description: form.querySelector('#update-description').value,
            interests: form.querySelector('#update-interests').value || null
        }

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            })
            if (res.ok) {
                showMessage(elements.updateMessageDiv, 'Usuário atualizado!', 'success')
                form.reset()
                fetchUsers()
            } else {
                const errorData = await res.json()
                showMessage(elements.updateMessageDiv, `Falha ao atualizar: ${errorData.error || 'Erro inesperado'}`, 'error')
            }
        } catch (err) {
            console.error('Erro na atualização:', err)
            showMessage(elements.updateMessageDiv, 'Sem comunicação com o servidor.', 'error')
        }
    }

    const handleDeleteUser = async (event) => {
        event.preventDefault()
        const id = event.target.querySelector('#delete-id').value

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                showMessage(elements.deleteMessageDiv, 'Usuário deletado com sucesso!', 'success')
                event.target.reset()
                fetchUsers()
            } else {
                const errorData = await res.json()
                showMessage(elements.deleteMessageDiv, `Erro ao deletar: ${errorData.error || 'Algo deu errado'}`, 'error')
            }
        } catch (err) {
            console.error('Erro ao deletar:', err)
            showMessage(elements.deleteMessageDiv, 'Problema ao conectar.', 'error')
        }
    }

    $(elements.createUserForm).addEventListener('submit', handleCreateUser)
    $(elements.updateUserForm).addEventListener('submit', handleUpdateUser)
    $(elements.deleteUserForm).addEventListener('submit', handleDeleteUser)
    $(elements.listUsersButton).addEventListener('click', fetchUsers)
})