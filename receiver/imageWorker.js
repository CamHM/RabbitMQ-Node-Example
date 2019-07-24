const amqp = require('amqplib/callback_api');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

amqp.connect('amqp://localhost', (error, connection) => {
    if (error) {
        throw error;
    }
    connection.createChannel((err, channel) => {
        if (err) {
            throw err;
        }

        let queue = "images";
        let queueResized = 'resized';
        // Creación de las colas: queue para consumir trabajos y queueResized para enviar el trabajo terminado
        channel.assertQueue(queue, {
            durable: true   // Indica a RabbitMQ que la cola debe seguir existiendo inclusive si el servidor falla
        });
        channel.assertQueue(queueResized, {
            durable: true
        });
        // Escuchando a queue
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");
        channel.consume(queue, (message) => {
            console.log('Processing image');
            let img = Buffer.from(message.content.toString(), 'base64');
            sharp(img)
                .resize({width: 100})
                .toBuffer()
                .then(data => {
                    channel.sendToQueue(queueResized, Buffer.from(data.toString('base64')));
                    console.log('Mensaje enviado');
                });
        }, {
            noAck: false // Automatic acknowledgment (data safety) Para evitar la pérdida de mensajes
        });
    });
});
