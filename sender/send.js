let amqp = require('amqplib/callback_api');

// Conexión con RabbitMQ Server
amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, channel) => {   // Creación del canal
        if (err) {
            throw err;
        }
        const queueHello = "hello"; // Nombre de la cola a la que llegará el mensaje
        const message = "Hello world"; // Mensaje a enviar a la cola

        channel.assertQueue(queueHello, {   // Declaración de la cola
            durable: false
        });

        channel.sendToQueue(queueHello, Buffer.from(message));  //se envía el mensaje a la cola, el contenido del mensaje es un arreglo de bits
        console.log(' [x] Sent %s', message);
    });

    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});
