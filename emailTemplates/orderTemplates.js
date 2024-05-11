
const Mailgen = require("mailgen");


const orderSuccessEmail = (name, cartItems) => {
    const email = {
        body: {
            name,
            intro: 'Your order has been placed successfully',
            table: {
                data: cartItems.map(item => ({
                    product: item.name,
                    price: item.price.toFixed(2),
                    quantity: item.cartQuantity,
                    total: (item.price * item.cartQuantity).toFixed(2), 
                })),
                columns: {
                    customWidth: {
                        product: '40%',
                        price: '20%', 
                        quantity: '20%',
                        total: '20%',
                    }
                }
            },
            action: {
                instructions: 'You can check the status of your order and more on your dashboard',
                button: {
                    color: '#48cfad',
                    text: 'Go to dashboard',
                    link: 'http://localhost:3000/home' // Corrected link format
                }
            },
            outro: 'We thank you for your purchase'
        }
    };

    return email;
};

module.exports = {
    orderSuccessEmail
};





