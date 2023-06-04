import { Router, query } from "express";
import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/cart.json" assert { type: "json" };
import fs, { writeFile } from "fs";
import { ProductManager } from "../class/productManager.js";

const router = Router();
const manager = new ProductManager(
  "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/cart.json"
);

router.post("/", async (request, response) => {
  let id;
  let readFile = await manager.readJSON();

  id = readFile.length === 0 ? 1 : readFile[readFile.length - 1].id + 1;

  let array = [];

  const arrayToAdd = {
    id: id,
    products: [],
  };

  array.push(arrayToAdd);

  const nuevoItem = arrayToAdd;

  let newArray;

  if (readFile.length === 0) {

    try {
      manager.writeFileFunction(array);
    } catch (error) {
      console.error("ha ocurrido un error con el archivo", error);
    }

  } else {
    newArray = [...readFile, nuevoItem];

    manager.orderArray(newArray)
  }

  response.send("cart created");
});

router.get("/:cid", async (request, response) => {
  const id = Number(request.params.cid);

  response.send(await manager.getProductById(id));
});

router.post("/:cid/products/:pid", async (request, response) => {
  const cid = Number(request.params.cid);
  const pid = Number(request.params.pid);

  const readCartFile = await manager.readJSON();
  const readProductsFile = JSON.parse(
    await fs.promises.readFile(
      "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/products.json",
      "utf-8"
    )
  );

  const validateCid = await readCartFile.find((item) => item.id === cid);
  const validatePid = await readProductsFile.find((item) => item.id === pid);

  if (validateCid === undefined || validatePid === undefined) {
    response.status(400).send("Cart or product id does not exist");
    return;
  }

  const itemsCurrentCart = await readCartFile.filter((item) => item.id != cid);

  const validatePidInArray = validateCid.products.find((item) => item.product === pid);

  const otherProductsInCart = validateCid.products.filter((item) => item.product != pid);

  let itemUpdated;
  let newCartContent;

  if (validateCid.products.length === 0) {
    itemUpdated = { id: cid, products: [{ product: pid, quantity: 1 }] };

    newCartContent = [...itemsCurrentCart, itemUpdated];

    manager.orderArray(newCartContent)

    response.send('Cart updated successfully') 
    return;
  }

  if (validatePidInArray === undefined) {
    let productsInCart = await validateCid.products;
      
    itemUpdated = { id: cid, products: [...productsInCart, { product: pid, quantity: 1 }]};

    newCartContent = [...itemsCurrentCart, itemUpdated];

    manager.orderArray(newCartContent)

    response.send('Cart updated successfully')

    return;
  }

  if (validatePidInArray) {
    let newProductContent = { id: cid, products: [ ...otherProductsInCart, { product: pid, quantity: validatePidInArray.quantity + 1 }]};

    newCartContent = [...itemsCurrentCart, newProductContent];

    manager.orderArray(newCartContent)

    response.send('Cart updated successfully')

  }
});

export default router;
