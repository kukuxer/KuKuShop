class Product {
  constructor(
    public id: string,
    public shopId: string,
    public name: string,
    public description: string,
    public price: string,
    public categories: string[],
    public imageUrl: string = "logo.svg",
    public rating: number,
    public quantity: number,
    public favorite: boolean,
    public inBasket: boolean,
    public reviews: number,
  ) {}
}

export default Product;
