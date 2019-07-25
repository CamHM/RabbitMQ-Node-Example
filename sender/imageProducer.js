let amqp = require('amqplib/callback_api');
const fs = require('fs');
const path = require('path');

amqp.connect('amqp://rabbit:rabbit@192.168.1.20:5672', (error, connection) => {
    if (error) {
        throw error;
    }

    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }
        let queue = "images";
        let message = fs.readFileSync('../img/prueba1.jpg').toString('base64');
        let message2 = fs.readFileSync('../img/prueba2.jpg').toString('base64');
        let count = 1;

        channel.assertQueue(queue, {
            durable: false   // Indica a RabbitMQ que la cola debe seguir existiendo inclusive si el servidor falla
        });
        channel.sendToQueue(queue, Buffer.from(message), {
            persistent: false    // Indica a RabbitMQ que debe almacenar los mensajes en disco
        });
        channel.sendToQueue(queue, Buffer.from(message2), {
            persistent: false    // Indica a RabbitMQ que debe almacenar los mensajes en disco
        });

        let queueRecive = "resized";

        channel.assertQueue(queueRecive, {
            durable: false   // Indica a RabbitMQ que la cola debe seguir existiendo inclusive si el servidor falla
        });
        // channel.fetch(1); // Establece que el trabajador sólo recibirá un mensaje a la vez
        console.log(" [*] Waiting for works result in %s. To exit press CTRL+C", queueRecive);
        channel.consume(queueRecive, (message) => {
            console.log('Saving image...');
            fs.writeFile(
                path.join(__dirname, '../images/', `name${count++}.jpg`),
                Buffer.from(message.content.toString(), 'base64'),
                (err) => {}
            );
        }, {
            noAck: true // Automatic acknowledgment (data safety) Para evitar la pérdida de mensajes
        });
        // console.log("[x] Sent %s'", message);
    });
});
