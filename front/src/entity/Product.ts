class Product {
  id: string;
  name: string;
  description: string;
  price: string;  
  categories: string[];  
  imageUrl: string;
  rating: number;
  quantity: number;

  constructor(
    id: string,
    name: string,
    description: string,
    price: string,  
    categories: string[],  
    imageUrl: string,
    rating: number,
    quantity: number
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.categories = categories;
    this.imageUrl = imageUrl;
    this.rating = rating;
    this.quantity = quantity;
  }
}

export default Product;
