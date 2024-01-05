//the enum
const CheckedBy = {
	NONE: 0,
	USER: 1,
	COMP: 2
};

let posInView = Symbol("Position in view"), checkedByWho = Symbol("Who clicked it?");
class Box {
	constructor(pos/*position in view*/) {
		this[checkedByWho] = CheckedBy.NONE;
		this[posInView] = pos;
	}

	get checkedBy() {
		return this[checkedByWho];
	}
	set checkedBy(value) {
		if(value > 3 || value < 0)
			throw new Error("Your trying to set checkedBy of box and the value \nyou tryna set is not valid ");
		
		this[checkedByWho] = value;
	}

	getPosInView() {
		return this[posInView];
	}
	setPosInView(value) {
		this[posInView] = value;
	}
}

let wholeThing =  Symbol("The multidimensional array"); //to make whole thing private
class Model {
	constructor() {
		//creating the multidimensional array
		this[wholeThing] = [[], [], []];
		//filling all the the three arrays with three elements each
		this[wholeThing].forEach((array, y) => {
			for(let x = 0; x < 3; x++) {
				let thePos = 3*y + x; //(3y + x) is the formula I devised for computing pos of bla bla from bla bla bla
				array.push(new Box(thePos));
			}
		});
	}

	//setter and getter for em boxes
	 getBox(y, x) {
		return  this[wholeThing][y][x];
	}
	setBox(y, x, value) {
		if(typeof value != "number" || value > 2 || value < 0) {
			console.log("You did not enter a valid value for the clicker/checker");
			return;
		}
		this[wholeThing][y][x].checkedBy = value;
	}

	//the reset method
	reset() {
		//clearing all the boxes
		this[wholeThing].forEach(row => {
			row.forEach(el => el.checkedBy = CheckedBy.NONE)
		});
	}

	//get whole thing
	getWholeThing() {
		return this[wholeThing];
	}

	//the gbam gbam checkForStraightUps method... Gbam gbam
	//which one is gbam gbam again as if I've not already done it down on paper
	//E gats work!
	checkForStraightUps(y, x, checkedBy) {
		//first checking horizontally
		let horEl /*horizontal elements*/ = [];
		for(let i = 0; i < 3; i++) {
			horEl.push(this[wholeThing][y][i]);
		}
		//checking if they all clicked
		let checkedBySame = horEl.every(el => el.checkedBy == checkedBy);
		if(checkedBySame) {
			return  {
				checkedBy,
				elements: horEl
			}; //stop here... someone done won
		}

		//got here means we aint got shit on the horizontal... so I'm gon check the vertical
		let verEl /*vertical elements*/ = [];
		for(let i = 0; i < 3; i++) {
			verEl.push(this[wholeThing][i][x]);
		}
		//checking if they all clicked
		checkedBySame = verEl.every(el => el.checkedBy == checkedBy);
		if(checkedBySame) {
			return {
				checkedBy,
				elements: verEl
			}; //stop here... someone done won
		}

		//next, going for the diagonals
		//if this bitch has diagonals
		let diagonals1 = [[0,0], [1,1], [2,2]], diagonals2 = [[0,2], [1,1], [2,0]];
		//first checking for first set of diagonals
		if(diagonals1.some(([b, a]) => (b==y)&&(a==x))) {
			let diag1El /*first diagonal elements*/ = [];
			diag1El = diagonals1.map(([b, a]) => this[wholeThing][b][a]);
			//checking if they all clicked
			checkedBySame = diag1El.every(el => el.checkedBy == checkedBy);
			if(checkedBySame) {
				return {
					checkedBy,
					elements: diag1El
				}; //stop here... someone done won
			}						
		}
		//next set of diagonals
		if(diagonals2.some(([b, a]) => (b==y)&&(a==x))) {
			let diag2El =  diagonals2.map(([b, a]) => this[wholeThing][b][a]);
			//checking if they all clicked
			checkedBySame = diag2El.every(el => el.checkedBy == checkedBy);
			if(checkedBySame) {
				return {
					checkedBy,
					elements: diag2El
				}; //you know what went down here
			}
		}

		//got here means no straight-up was matched
		return null;
	}

	//check if everywhere don full
	everywhereFull() {
		return this.getWholeThing().every(row => row.every(el => el.checkedBy  != CheckedBy.NONE));
	}
}

//exporting the model class
export {Model};