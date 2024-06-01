document.addEventListener("DOMContentLoaded", () => {
  // Setup event listeners after the document is fully loaded
  document
    .getElementById("passwordForm")
    .addEventListener("submit", handleSave);
  document.getElementById("clearAll").addEventListener("click", clearAll);
  loadServices();

  // Prepare modal instance for reuse
  const passwordModal = new bootstrap.Modal(
    document.getElementById("passwordModal"),
    {
      keyboard: true, // Allow closing with the keyboard 'ESC' key
    }
  );

  // Function to handle password saving
  function handleSave(event) {
    event.preventDefault();
    const service = document.getElementById("service").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!service || !password) {
      alert("Both fields are required.");
      return;
    }

    const hashed = CryptoJS.SHA256(password).toString();
    localStorage.setItem(service, hashed);
    appendServiceToList(service);
    document.getElementById("service").value = "";
    document.getElementById("password").value = "";
  }

  // Function to add services to the list
  function appendServiceToList(service) {
    const node = document.createElement("li");
    node.className = "list-group-item list-group-item-action";
    node.textContent = service;
    node.addEventListener("click", () => showTestPasswordModal(service));
    document.getElementById("servicesList").appendChild(node);
  }

  // Function to handle password testing
  function showTestPasswordModal(service) {
    const testInput = document.getElementById("testPassword");
    const resultDisplay = document.getElementById("result");

    document.getElementById("test").onclick = function () {
      testPassword(service);
    };

    testInput.value = "";
    resultDisplay.textContent = "";

    // Set up keypress listener on the test password input
    testInput.onkeypress = function (event) {
      if (event.key === "Enter") {
        testPassword(service);
        event.preventDefault(); // Prevent form submission or any default action
      }
    };

    passwordModal.show();
    testInput.focus();
    const closeButton = document
      .querySelector("#passwordModal > div > div > div.modal-header > button")
      .addEventListener("click", () => {
        passwordModal.hide();
      });
  }

  // Function to test the entered password
  function testPassword(service) {
    const testPassword = document.getElementById("testPassword").value;
    const hashedTest = CryptoJS.SHA256(testPassword).toString();
    const storedHash = localStorage.getItem(service);
    if (hashedTest === storedHash) {
      document.getElementById("result").textContent = "Password correct!";
    } else {
      document.getElementById("result").textContent = "Incorrect password!";
    }
  }

  // Function to clear all stored data
  function clearAll() {
    localStorage.clear();
    document.getElementById("servicesList").innerHTML = "";
    alert("All stored data has been cleared.");
  }

  // Function to load all stored services on page load
  function loadServices() {
    Object.keys(localStorage).forEach((service) => {
      appendServiceToList(service);
    });
  }
});
