class ShopEntity {
  constructor(
    public name: string,
    public ownerName: string,
    public description: string,
    public imageUrl: string,
    public rating: number,
    public trusted: boolean
  ) { }
}

export default ShopEntity;

