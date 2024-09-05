var btn = document.getElementsByClassName("planilha-btn")[0];
var modal = document.getElementsByTagName("dialog")[0];

btn.onclick = function () {
 modal.showModal();
};

const cirurgia = document.getElementById("cirugia").value;
const descricao = document.getElementById("descricao").value;

//Cria o objeto de dados para enviar
const requestData = {
 cirugia: cirurgia,
 descricao: descricao,
};

//Fazendo a requisição POST
fetch("http://localhost:8080/api/agendamentos", {
 method: "POST",
 headers: {
   "Content-Type": "application/json",
 },
 body: JSON.stringify(requestData),
})
 .then((data) => {
   // Exibe mensagem de sucesso
   document.getElementById("notification-message").textContent =
     "Agendamento salvo com sucesso!";
 })
 .catch((error) => {
   console.error("Erro ao salvar agendamento:", error);
   document.getElementById("notification-message").textContent =
     "Erro ao salvar agendamento. Tente novamente";
 });

function showForm() {
 const modal = document.getElementById("questionModal");
 modal.style.display = "block";
}

function closeModal() {
 const modal = document.getElementById("questionModal");
 modal.style.display = "none";
}

function showForm2(){

    const modal2 = document.getElementById("modalDesativadas");
    modal2.style.display = "block"

}

function closeModal2(){
    const modal2 = document.getElementById("modalDesativadas");
    modal2.style.display = "none";
}