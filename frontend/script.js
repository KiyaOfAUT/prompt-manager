document.addEventListener('DOMContentLoaded', () => {
    const promptForm = document.getElementById('promptForm');
    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput')
    const promptList = document.getElementById('promptList');
    const button = document.getElementById('submitButton');
    const favoriteCheck = document.getElementById('favoriteCheck')
    let prompts = [];
    let editId = null;

    async function getData() {
        const url = "http://localhost:3000/prompts";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error.message);
        }
    }

    async function postData(t, d, f){
        const url = "http://localhost:3000/prompts";
        try {
            const response = await fetch(url, {headers: {
                    'Content-Type': 'application/json'
                },method:'POST', body: JSON.stringify({ "title": t, "desc": d, "fav": f})});
            if (!response.ok) {
                console.log(response.text())
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    async function updateData(id, t, d, f) {
        const url = `http://localhost:3000/prompt/${id}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify({"title": t, "desc": d, "fav": f })
            });
            if (!response.ok) {
                console.log(response.text());
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function deleteData(id){
        const url = `http://localhost:3000/prompt/${id}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'DELETE'
            });
            if (!response.ok) {
                console.log(response.text());
                throw new Error(`Response status: ${response.status}`);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function renderPrompts() {
        const data = await getData();
        prompts = data ? data.prompts : [];
        promptList.innerHTML = '';
        for(let key in prompts){
            const is_fav = prompts[key]['fav']
            const li = document.createElement('li');
            let check_box
            if (is_fav) {
                check_box = '<label style="color: orange"><input type="checkbox" disabled checked style="display: none"/> ⭐Favorite</label>'
            } else {
                check_box = '<label style="display: none"><input type="checkbox" disabled/></label>'
            }
            li.innerHTML = `
                        <article style="margin-top: 2rem"">
                            <header>${prompts[key]['title']}</header>
                            <body>
                            <textarea name="read-only" readonly>
                              ${prompts[key]['desc']}
                            </textarea>
                            ${check_box}
                            </body>
                            <footer>
                            <div role="group">
                            <button class="edit" data-id="${key}" style="background-color: lightgreen">Edit</button>
                            <button class="delete" data-id="${key}" style="background-color: lightcoral">Delete</button>
                            </div>
                            </footer>
                        </article>
                    `;
            promptList.appendChild(li);
        }

    };

    promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        const description = descriptionInput.value.trim();
        const favorite = favoriteCheck.checked
        if (title) {
            if (editId !== null) {
                updateData(prompts[editId]['id'], title, description, favorite).then(renderPrompts)
                descriptionInput.value = ''
                editId = null;
            } else {
                postData(title, description, favorite).then(renderPrompts)
                descriptionInput.value = ''
            }
            titleInput.value = '';
            button.value= 'Add Prompt'
        }
    });

    promptList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            editId = e.target.dataset.id;
            titleInput.value = prompts[editId]['title'];
            descriptionInput.value = prompts[editId]['desc'];
            favoriteCheck.checked = prompts[editId]['fav']
            button.value = "Edit Prompt"
            window.scrollTo(0, 0);
        } else if (e.target.classList.contains('delete')) {
            deleteData(prompts[e.target.dataset.id]['id']).then(renderPrompts);
        }
    });
    renderPrompts();
});