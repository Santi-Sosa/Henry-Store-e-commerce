const server = require("express").Router();
const { Order, OrderLine, Product, Users } = require("../db.js");
const sgMail = require("@sendgrid/mail");

// Busca todas las ordenes y los devuelve en un array y filtra si posee query con status
//no se puede testear por que no existe ruta para crear ordenes
server.get("/", (req, res, next) => {
  var status = req.query.status;
  if (!status) {
    Order.findAll({
      include: Users,
      paranoid: true,
    })
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch(next);
  } else {
    Order.findAll({ where: { state: status }, paranoid: false })
      .then((orders) => {
        res.status(200).send(orders);
      })
      .catch(next);
  }
});

server.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const { state } = req.query;
  //Lo unico que podemos buscar editar es el estado de una orden
  // este estado deberia solo puede tener los values: ['inCart', 'created', 'processing','canceled','complete']
  // dichas limitaciones deben controlarse desde el frontend, y mandar el estado a editar como query ej: http://localhost:3100/orders/1?state=completed
  if (state === "complete") {
    Order.findAll({
      where: {
        id: id,
      },
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
      ],
    }).then((order) => {
      order[0].products.forEach((e) => {
        Product.findByPk(e.id).then((product) => {
          product.stock -= e.amount.amount;
          product.save();
        });
      });
      return res.send(order);
    });
  } else {
    Order.findByPk(id)
      .then((order) => {
        if (state) order.state = state;
        order.save().catch(next);
        res.status(200).send(order);
      })
      .catch(next);
  }
});

//Trae todos los productos de una orden
server.get("/products/:orderId", (req, res, next) => {
  const { orderId } = req.params;

  Order.findAll({
    where: {
      id: orderId,
    },
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
    ],
  })
    .then((order) => {
      res.status(200).send(order);
    })
    .catch(next);
});

//CHECKOUT
server.post("/checkout", (req, res, next) => {
  const { orderId, buyerEmail } = req.body;
  Order.findAll({
    where: {
      id: orderId,
    },
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
    ],
  })
    .then((order) => {
      const SENDGRID_API_KEY =
        "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";

      sgMail.setApiKey(SENDGRID_API_KEY);
      const msg = {
        template_id: "d-62383b725b60484c90e130043f910aa8",
        from: {
          email: "henry.store.ecommerce@gmail.com",
          name: "Henry Store",
        },
        personalizations: [
          {
            to: [
              {
                email: buyerEmail,
              },
            ],
            dynamic_template_data: {
              order: order[0].products,
              subject: `Tu compra con ID ${order[0].id} fue procesada con éxito`,
            },
          },
        ],
      };
      sgMail
        .send(msg)
        .then((email) => {
        })
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
      res.status(200).send(order[0]);
    })
    .catch(next);
});

module.exports = server;
