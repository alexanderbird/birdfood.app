export class Core {
  constructor(data) {
    this.data = data;
  }

  listItems() {
    return this.data.listItems();
  }
}
