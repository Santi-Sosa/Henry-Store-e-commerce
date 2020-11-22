const server = require("express").Router();
const { Images, Product} = require("../db.js");

//Ruta para obtener todas las imagenes del producto que viene como parametro
server.get("/:idProduct", (req, res, next) => {
  const idProduct = req.params.idProduct;
  Images.findAll({
    where: {
      productId: idProduct,
    }
  })
    .then((data) => res.status(200).send(data))
    .catch(next);
});

server.delete("/:idImage", (req, res, next) => {
  const {idImage} = req.params;
  Images.destroy({
    where: {
      id: idImage,
    }
  })
    .then((data) => res.send())
    .catch(next);
});

module.exports = server;