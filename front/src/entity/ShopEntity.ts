class ShopEntity {
  constructor(
    public name: string,
    public ownerName: string,
    public description: string,
    public imageUrl: string,
    public rating: number,
    public isTrusted: boolean
  ) { }
}

export default ShopEntity;

