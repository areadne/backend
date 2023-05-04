class ProductManager {
  constructor() {
    this.products = [];
  }

   addProduct = (title, description, price, thumbnail, code, stock) => {
    let id;

    const validateCode = this.products.find((el) => el.code === code);

    if (!title || !description || !price || !thumbnail || !stock || !code) {
      console.log("campos incompletos");
    } else {
      if (validateCode) {
        console.log(`el code ${validateCode.code} ya existe`);
      } else {
        (this.products.length === 0) ? id = 1 : id = this.products[this.products.length - 1].id + 1
        this.products.push( { id, title, description, price, thumbnail, code, stock } );
      }
    }
  }

  getProducts = () => console.log(this.products);
  
  getProductById = (id) => {
    const search = this.products.find((el) => el.id === id);
    search ? console.log(search) : console.log("Not found")
  };
}

const producto = new ProductManager();

producto.addProduct('titulo 1', 'descripcion 1', 5000, 'https://www.pexels.com/es-es/buscar/foto/', 7, 25)
producto.addProduct('titulo 2', 'descripcion 2', 4000, 'https://www.pexels.com/es-es/buscar/foto/', 4, 25)
producto.addProduct('titulo 3', 'descripcion 3', 7000, 'https://www.pexels.com/es-es/buscar/foto/', 5, 25)

producto.getProducts();

producto.getProductById(9);
