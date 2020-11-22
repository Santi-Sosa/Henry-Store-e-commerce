const server = require("express").Router();
const { Categories, Product } = require("../db.js");
const { Op } = require("sequelize");

server.get("/", (req, res, next) => {
  // Busca todas las categorias y las devuelve en un array
  Categories.findAll()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch(next);
});

//Trae los detalles de una categoria segun su id
server.get("/:idCategoria", (req, res, next) => {
  Categories.findByPk(req.params.idCategoria)
    .then((categoria) => res.send(categoria))
    .catch(next);
});

server.put("/:idCategory/update", (req, res, next) => {
  const { name, description} = req.body;

    Categories.findByPk(req.params.idCategory)
    .then((data) => {
      if (name) data.name = name;
      if (description) data.description = description;
      data.save();
      res
        .status(200)
        .send(
          `La categoria ${data.dataValues.name} con id ${data.dataValues.id} se actualizó con éxito`
        );
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

//Trae todos los productos de una categoria
server.get("/category/:name", (req, res, next) => {
  const name = req.params.name;
  Categories.findOne({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
    include: Product,
  })
    .then((rows) => res.status(200).json(rows))
    .catch(next);
});


//Elimina una categoria segun su id
server.delete("/:id", (req, res, next) => {
  const id = req.params.id;

  Categories.destroy({ where: { id } })
    .then((rows) => res.status(200).json(rows))
    .catch(next);
});


//Crea una nueva categoria
server.post("/create-category", (req, res, next) => {
  
  Categories.findOrCreate({
    where: {
      name: req.body.name,
      description: req.body.description,
    },
  })
    .then((category) => {
      //Sucess handler
      res
        .status(200)
        .send(`La categoría ${category[0].dataValues.name} se creó con exito`);
    })
    .catch((err) => {
      //Error Handler
      res.status(400).send("No se pudo crear la categoría solicitada");
    });
});

module.exports = server;
