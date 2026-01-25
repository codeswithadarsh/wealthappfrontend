export const formatINR = (value) => {
    const amount = Number(value);

    if (!amount || isNaN(amount)) {
        return "₹0";
    }

    return `₹${amount.toLocaleString("en-IN")}`;
};
