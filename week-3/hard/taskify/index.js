let todos = [];

function addTodo() {
    const inputElement = document.querySelector("input");
    if (inputElement.value.trim() !== "") {
        todos.push({
            title: inputElement.value
        });
        inputElement.value = ""; // Clear input after adding
    }
    render();
}

function deleteLastTodo() {
    if (todos.length > 0) {
        todos.splice(todos.length - 1, 1);
        render();
    }
}

function deleteFirstTodo() {
    if (todos.length > 0) {
        todos.splice(0, 1);
        render();
    }
}

function deleteTodo(index) {
    todos.splice(index, 1);
    render();
}

function render() {
    const todoContainer = document.querySelector("#todos");
    todoContainer.innerHTML = "";
    
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        const div = document.createElement("div");
        const span = document.createElement("span");
        const button = document.createElement("button");
        
        button.innerHTML = "delete";
        button.addEventListener("click", function() {
            deleteTodo(i);
        });
        
        span.innerHTML = todo.title;
        
        div.append(span);
        div.append(button);
        todoContainer.appendChild(div);
    }
}

// Initialize the render on page load
document.addEventListener("DOMContentLoaded", function() {
    render();
});