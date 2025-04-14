// ... existing code ...

// This is likely where the checkout function is being called
const handleCheckout = async (plan: string) => {
  try {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: plan, // Make sure this matches a key in your PLANS object
        interval: "monthly", // Or "yearly" depending on your selection
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao criar sessão de checkout");
    }

    // Redirect to Stripe checkout
    window.location.href = data.url;
  } catch (error) {
    console.error("Erro no registro:", error);
    // Show error to user
  }
};

// ... rest of the code
