import { Router } from "express";
import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/products.json" assert { type: "json" };
import { ProductManager } from "../class/productManager.js";

const router = Router();
const manager = new ProductManager(
  "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/products.json"
);

router.get("/", async (request, response) => {
  const limit = Number(request.query.limit);

  const readFile = await manager.readJSON();

  if (limit < 0) {
    response.status(400).send("limit invalid");
    return;
  }

  if (!limit) {
    response.send(readFile);
    return;
  }

  const limitFilter = readFile.slice(0, limit);

  response.send(limitFilter);
});

router.get("/:pid", async (request, response) => {
  const id = Number(request.params.pid);

  response.send(await manager.getProductById(id));
});

router.post("/", async (request, response) => {
  const { title, description, price, thumbnail, code, stock, category, status } = request.body;
    
  if (typeof status != 'boolean') {
    response.status(400).send('status must be boolean')
    return
  }

  if ( !title || !description || !price || !stock || !code || !category ) {
    response.status(400).send("At least one field is missing");
    return;
  }

  let readFile = await manager.readJSON();

  const validateCode = readFile.find((el) => el.code === code);

  if (validateCode) {
    response.status(400).send("Code indicated already exits");
    return;
  }

  manager.addProduct( title, description, price, thumbnail, code, stock, category, status );

  response.send("Successful request");
});

router.put("/:pid", async (request, response) => {
  const id = Number(request.params.pid);

  const {
    title, description, price, thumbnail, code, stock, category, status
  } = request.body;

  manager.updateProduct( 
    id, title, description, price, thumbnail, code, stock, category, status 
    );

  response.send("Successful request");
});

router.delete("/:pid", async (request, response) => {
  const id = Number(request.params.pid);

  const deleteById = await manager.deleteProduct(id);

  if(deleteById === "Not found"){
    response.status(400).send("Something went wrong: id did not exist on the list, try with another one")
    return
  }

  response.send("Id deleted succesfully");
});

export default router;
