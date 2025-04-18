class Comment {
  constructor(
    public id: string,
    public author: string,
    public comment: string,
    public profileImage: string,
    public username: string,
    public createdAt: string,
    public rating: number,
    public productId: string
  ) { }
}

export default Comment;
