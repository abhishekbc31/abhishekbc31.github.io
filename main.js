let quests = [];
let xp = 0;

document.getElementById("quest-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("quest-name").value;
    const progress = parseInt(document.getElementById("quest-progress").value);
    quests.push({ name, progress });
    renderQuests();
});

function renderQuests() {
    const list = document.getElementById("quests-list");
    list.innerHTML = "";
    quests.forEach(q => {
        const li = document.createElement("li");
        li.textContent = `${q.name} - ${q.progress}%`;
        list.appendChild(li);
    });
}
