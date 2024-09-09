document.addEventListener("DOMContentLoaded", function () {
    const nome = localStorage.getItem("nome");
    const instagram = localStorage.getItem("instagram");
  
    if (nome && instagram) {
      document.getElementById("userName").textContent = nome;
      document.getElementById("userInsta").textContent = instagram;
    }
  });