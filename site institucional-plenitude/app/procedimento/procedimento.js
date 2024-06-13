function showModal(procedimento) {
    document.getElementById('procedimento').textContent = `Procedimento: ${procedimento}`;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
