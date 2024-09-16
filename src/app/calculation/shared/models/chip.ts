export class Chip {
  name: string;
  type: string;
  datatype: string;
  constructor(name, type, datatype) {
    (this.name = name), (this.type = type), (this.datatype = datatype);
  }
}
