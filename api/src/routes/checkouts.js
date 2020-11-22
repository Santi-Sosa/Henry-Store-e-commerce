const server = require("express").Router();
const { Checkout, Order, Users, Product,OrderLine } = require("../db.js");
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY, SENDGRID_TEMPLATE_ID, SENDGRID_SENDER_EMAIL, SENDGRID_SENDER_NAME } = process.env;
//Ruta que trae todos los checkouts
server.get("/", (req, res, next) => {
  Checkout.findAll()
    .then((data) => res.status(200).send(data))
    .catch(next);
});

//Ruta para agregar una direccion y un medio de pago a un usuario
server.post("/:idUser/add/", (req, res, next) => {
  const { idUser } = req.params;
  const { address, payment, orderId } = req.body;

  Checkout.create({
    address: address,
    payment: payment,
    userId: idUser,
    orderId: orderId,
  })
    .then((data) => res.status(200).json(data))
    .catch(next);
});

//Ruta para modificar un checkout
server.put("/:idUser/update", (req, res, next) => {
  const { idUser } = req.params;
  const { address, payment } = req.body;

  Checkout.findByPk(idUser)
    .then((data) => {
      if (address) data.address = address;
      if (payment) data.payment = payment;
      if (idUser) data.userId = idUser;
      data.save();
      res.status(200).send(data);
    })
    .catch(next);
});

//Elimina un checkout segun su id
server.delete("/:id/delete", (req, res, next) => {
  const id = req.params.id;

  Checkout.destroy({ where: { id } })
    .then((rows) => res.status(200).json(rows))
    .catch(next);
});

//Marca una orden como despachada
server.put("/:idOrder/completed", (req, res, next) => {
  const { idOrder } = req.params;

  Order.findAll({
    where: { id: idOrder },
    include: [
      {
        model: Product,
        as: "products",
        required: false,
        // Pass in the Product attributes that you want to retrieve
        attributes: ["id", "name", "description", "stock", "price"],
        through: {
          // This block of code allows you to retrieve the properties of the join table
          model: OrderLine,
          as: "amount",
          attributes: ["amount"],
        },
      },
      {
        model: Users,
        as: 'user'
      }
    ],
  }).then((order) => {
    res.send(order)
    order[0].state = "complete";
    order[0].save();
    sgMail.setApiKey(SENDGRID_API_KEY);

    const msg = {
      template_id: SENDGRID_TEMPLATE_ID,
      from: {
        email: SENDGRID_SENDER_EMAIL,
        name: SENDGRID_SENDER_NAME,
      },
      personalizations: [
        {
          to: [
            {
              email: order[0].user.email,
            },
          ],
          dynamic_template_data: {
            order: order[0].products,
            subject: `Tu orden con ID ${order[0].id} está en camino`,
          },
        },
      ],
    };
    sgMail
      .send(msg)
      .then((email) => {})
      .catch((error) => {
        // Log friendly error
        console.error(error);

        if (error.response) {
          // Extract error msg
          const { message, code, response } = error;

          // Extract response msg
          const { headers, body } = response;

          console.error(body);
        }
      });
    res.status(200).send({success: true, message: 'La orden fue despachada con éxito'});
  });
});

module.exports = server;
