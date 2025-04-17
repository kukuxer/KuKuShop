class ShopEntity {
  constructor(
    public name: string,
    public ownerName: string,
    public description: string,
    public imageUrl: string,
    public rating: any,
    public isTrusted: boolean
  ) {}
}

export default ShopEntity;

