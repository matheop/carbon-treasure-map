// // UNUSED FILE

// class Treasure {
//     static allInstances = [];

//     constructor(x, y, qty) {
//         this.name = `T(${qty})`;
//         this.x = x;
//         this.y = y;
//         this.totalQty = qty;
//         this.currentQty = qty;
//         Treasure.allInstances.push(this);
//     }

//     static findTreasure() {}

//     updateName(qty) {
//         this.name = `T(${this.currentQty})`;
//     }

//     updateQuantity() {
//         this.currentQty--;
//         if (this.currentQty === 0) this.remove();
//         else this.updateName();
//         console.log("this:", this);
//     }
// }

// module.exports = Treasure;
