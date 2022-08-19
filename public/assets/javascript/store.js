class Store {
    shoes = [];
    name;
    constructor(storeName) {
        this.name = storeName
    }

    updateShoes(shoe) {
        let shoeIndex = this.shoeExists(shoe);
        if(shoeIndex >= 0){
            this.shoes[shoeIndex].quantity = shoe.quantity;
        }else{
            this.shoes.push(shoe)
        }
    }

    shoeExists(shoe) {
        return this.shoes.findIndex(s => s.name === shoe.name)
    }
}