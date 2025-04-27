class Product {
  constructor(
    public id: string,
    public shopId: string,
    public name: string,
    public description: string,
    public price: string,
    public categories: string[],
    public imageUrl: string = "logo.svg",
    public additionalPictures: string[],
    public rating: number,
    public creationDate: Date,
    public quantity: number,
    public favorite: boolean,
    public inBasket: boolean,
    public reviews: number,
    public owner: boolean
  ) {}
}

export default Product;
