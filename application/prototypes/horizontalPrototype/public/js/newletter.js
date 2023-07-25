document.addEventListener("DOMContentLoaded", function () {
    const subscribeForm = document.getElementById("subscribe-form");
    const messageElement = document.getElementById("newletter-message");
  
    subscribeForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const emailInput = subscribeForm.querySelector('input[name="email"]');
      const email = emailInput.value.trim();
  
      try {
        const response = await fetch("/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        if (response.ok) {
          messageElement.textContent = data.message;
          emailInput.value = ""; 
        } else {
          messageElement.textContent = data.error;
        }
      } catch (error) {
        console.error("Error:", error);
        messageElement.textContent = "An error occurred while subscribing.";
      }
    });
  });
  