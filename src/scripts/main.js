
// Dynamically update the year and date of last modification
window.onload = () => {
    document.getElementById("currentyear").textContent = new Date().getFullYear();
    document.getElementById(
      "lastModified"
    ).textContent = `Last Modification: ${document.lastModified}`;
  };
  