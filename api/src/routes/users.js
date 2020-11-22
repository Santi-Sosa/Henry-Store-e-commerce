const server = require("express").Router();
const { Users, OrderLine, Order, Product } = require("../db.js");
const { Op } = require("sequelize");

// Busca todos los usuarios y los devuelve en un array
server.get("/", (req, res, next) => {
  Users.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
});

// Busca un usuario en particular
server.get("/:idUser", (req, res, next) => {
  const { idUser } = req.params;
  Users.findByPk(idUser)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
});

//Modifica un usuario pasado por id (params)
server.put("/update/:id", (req, res, next) => {
  const { name, username, email, role } = req.body;

  if (name.length < 1 || username.length < 1 || email.length < 1){
    return res.send({
      success: false,
      message: 'Los campos a editar no pueden estar vacios.'
    })
  }

  Users.findByPk(req.params.id)
    .then((data) => {
      if (name && name.length > 1) data.name = name;
      if (username && username.length > 1) data.username = username;
      if (email && email.length>  1) data.email = email;
      if (role && role.length>  1) data.role = role;
      data.save();
      res
        .status(200)
        .send({
         success: true,
         message: 'Actualizaste tu perfil con éxito',
         messageAdmin: `El usuario ${data.dataValues.name} con id ${data.dataValues.id} se actualizó con éxito`
        });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// Ruta para crear un usuario
server.post("/create", (req, res, next) => {
  if(!req.body.role) req.body.role = 'client';
  Users.findOrCreate({
    where: {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password
    },
  })
    .then((user) => {
      //Sucess handler
      res.status(200).send({success: true, message: 'El usuario fue creado con éxito', user: user[0]});
    })
    .catch((err) => {
      //Error Handler
      console.log(err);
      res.status(400).send("No se pudo crear el usuario solicitado");
    });
});

// Ruta para crear una orden a partir de un producto
server.post("/:idUser/cart", (req, res, next) => {
  //suponiendo que en req.body viene el id del producto como 'idProducto'
  // la cantidad de items como 'amount' y el precio como 'price'

  
  const { idUser } = req.params;
  const { idProducto, amount } = req.body;
  
  Order.findAll({
    where: {
      userId: idUser,
      state: "active",
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
    var product = Product.findByPk(idProducto);
    if (order[0]) {
      product.then((data) => {
        var existingProduct = order[0].products.findIndex(
          (e) => e.id === data.id
        );
        if (existingProduct > -1) {
          OrderLine.findOne({
            where: {
              productId: data.id,
            },
          }).then((orderLine) => {
            orderLine.amount += Number(amount);
            orderLine.save();
            res.status(200).send(orderLine);
          });
        } else if (existingProduct === -1) {
          OrderLine.create({
            amount: amount,
            price: data.price,
            orderId: order[0].id,
            productId: idProducto,
          }).then((data) => res.status(200).send(data));
        }
      });
    } else {
      product
        .then((product) => {
          Order.create({
            state: "active",
            userId: idUser,
          })
            .then((orderCreated) => {
              OrderLine.create({
                amount: amount,
                price: product.price,
                orderId: orderCreated.id,
                productId: product.id,
              })
                .then((data) => res.status(200).send(data))
                .catch(next);
            })
            .catch(next);
        })
        .catch(next);
    }
  });
});

// Ruta para editar las cantidades de un producto
server.put("/:idUser/cart", (req, res, next) => {
  //suponiendo que en req.body viene el id del producto como 'productId', el id de la orden a editar como 'orderId' y la cantidad a setear como 'amountToSet'

  const { idUser } = req.params;
  const { productId, orderId, amountToSet } = req.body;

  Order.findOne({
    where: {
      userId: idUser,
      id: orderId,
    },
    include: OrderLine,
  })
    .then((orders) => {
      const toEdit = orders.orderLines.find((e) => e.productId == productId);
      toEdit.amount += Number(amountToSet);
      toEdit.save();
      res.status(200).send(); //No responde nada, ya que solo actualiza, si se quiere mandar un mensaje al usuario hacerlo en base al statusCode
    })
    .catch((err) => res.status(204).send(err));
});

//Borra una orden. Al borrarla tambien se borra la relacion con el usuario, por lo tanto vacia el carrito.
server.delete("/:idOrder", (req, res, next) => {
  let id = req.params.idOrder;
  let { product } = req.body;
  //id de la orderline
  OrderLine.destroy({
    where: {
      orderId: id,
      productId: product,
    },
  })
    .then((deleted) => {
      res.status(200).send(`Se borraron un total de ${deleted} orden/es`);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Trae todas las ordenes de un usuario
server.get("/:userId/orders", (req, res, next) => {
  const id = req.params.userId;
  Order.findAll({
    where: {
      userId: id,
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
      }
    ],
  })
    .then((rows) => res.status(200).json(rows))
    .catch(next);
});

//Eliminar usuario

server.delete("/delete/:id", (req, res, next) => {
  const idUser = req.params.id;
  Users.destroy({ where: { id: idUser } })
    .then((users) => {
      if (users > 0) {
        return res
          .status(200)
          .json({ message: "El Usuario se ha borrado satisfactoriamente." });
      } else {
        return res.status(400).json({
          message: `No hay ningun usuario con el id: ${idUser}`,
        });
      }
    })
    .catch((error) => next(error));
});

//Ruta para promover a un usuario
server.put("/promote/:id", (req, res, next) => {
  const { id } = req.params;

  Users.findByPk(id)
    .then((user) => {
      user.role = "admin";
      user.save().catch(next);
      res.status(200).send(user);
    })
    .catch(next);
});

module.exports = server;
