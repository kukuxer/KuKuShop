class Comment {
  constructor(
    public id: string,
    public author: string,
    public text: string,
    public createdAt: string,
    public productId: string
  ) { }
}

export default Comment;
