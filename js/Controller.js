import {Model} from "./Model.js";

//that enum... I dey come, I go check the name jes now
const CheckedBy = {
	NONE: 0,
	USER: 1,
	COMP: 2
};
//next, gon store the texts for x's and o's... E get y.. Nur delete this var abeg
const textMap = ["O", "X"];

let model = Symbol("The reference to the model");
class Controller {

	constructor(mod) {
		this[model] = mod;
	}

	//the updateView method
	updateView(box ) {
		//creating the shit to add based on who clicked
		let newNode;
		(newNode = document.createElement("span")).appendChild(/*x or o*/ document.createTextNode(textMap[box.checkedBy - 1]));
		newNode.className = "XorO" //for styling purposes
		document.getElementById(box.getPosInView()).appendChild(newNode);
	}
	//method for resetting box views
	resetView(box) {
		let boxNode = document.getElementById(box.getPosInView());
		//removing its inner shit
		Array.from(boxNode.childNodes).forEach(child => child.remove());
		//undoing that style shit I did
		boxNode.className = "box";
	}

	//the highlightBoxes method to highlight boxes in the view
	highlightBoxes(wonByWho, ...boxes) {
		
		//validity check... length of boxes has to be 3
		if(boxes.length != 3) {
			throw new Error("check length of boxes supplied to me");			
			return;
		}
		//highlighting the boxes literally... asin view
		let boxNodes = boxes.map(box => document.getElementById(box.getPosInView()/*works cus of the getter I used... feel me? *smirks* */));
		boxNodes.forEach(box => {
			//css class for highlighting it
			box.className += " highlighted";
		});

		//next, telling the winner he/she won(my pc is not the "she")
		switch(wonByWho) {
			case CheckedBy.USER:
				setTimeout(() => {
					window.alert("You win!");
				}, 1500);
				break;
			case CheckedBy.COMP:
				setTimeout(() => {
					window.alert("You lose! My PC beat you\nPlease go and cry");
				}, 1500);
				break;
			default:
				throw new Error("Abeg check argument(wonByWho) supplied to highlightBoxes method in controller");
		}

		//then the view
		setTimeout(() => {
			//resetting e'rything in model
			this[model].reset();
			this[model].getWholeThing().forEach(row => row.forEach(el => this.resetView(el)));
		}, 1900);

		//adding to winner score
		//first the scoreboard and the row to add
		let scoreBoardBody = document.querySelector("#scoreBoard > tbody");
		let row = document.createElement("tr"), winCell;
		(winCell = document.createElement("td")).appendChild(document.createTextNode(textMap[wonByWho - 1]));
		if(wonByWho === CheckedBy.USER) {
			row.appendChild(winCell);
			row.appendChild(document.createElement("td"));
			//adding row to table
			scoreBoardBody.appendChild(row);
		} else if(wonByWho === CheckedBy.COMP) {
			row.appendChild(document.createElement("td"));
			row.appendChild(winCell);
			//adding row to table
			scoreBoardBody.appendChild(row);
		}
	}

	//next, the main handler where everything happens
	main(posInView) {
			//first getting the box  from the model
			let rowWithBox =this[model].getWholeThing().filter(row => row.some(el => el.getPosInView() == posInView ))[0];
			let box = rowWithBox.filter(el =>  el.getPosInView() == posInView)[0];

			if(box.checkedBy == CheckedBy.NONE) {
				//it ain't been clicked before
				box.checkedBy = CheckedBy.USER;
				this.updateView(box);
				let straightUps = null;
				for(let y = 0; y < this[model].getWholeThing().length; ++y) {
					//didnt use forEach cus there's a point where I'd have to use a break
					let row = this[model].getWholeThing()[y];
					for(let x = 0; x < row.length; ++x) {
						straightUps = this[model].checkForStraightUps(y, x, CheckedBy.USER);
						//wanna check for the truthify value of straighups.. if its lit, break and move on
						if(straightUps) {
							this.highlightBoxes(CheckedBy.USER, ...straightUps.elements);
							return; //no further evaluation
						}
					}
				}
				//computer's logic starts here
				//first check if everywhere is full so we can reset
				if(this[model].everywhereFull()) {
					//resetting e'rything in model
					this[model].reset();
					//then the view
					setTimeout(() => {
					this[model].getWholeThing().forEach(row => row.forEach(el => this.resetView(el)));
					}, 1500);
					return; //no further evaluation
				}
				//selecting random position to chceck a new box at
				let newBox = this[model].getWholeThing()[Math.round(Math.random() * 2)][Math.round(Math.random() * 2)];
				while(newBox.checkedBy !== CheckedBy.NONE)
					newBox = this[model].getWholeThing()[Math.round(Math.random() * 2)][Math.round(Math.random() * 2)];

				//checking it in model and view
				newBox.checkedBy = CheckedBy.COMP;
				setTimeout(() => { this.updateView(newBox)}, 450);
				
				//checking for straigh ups again for computer								
				for(let y = 0; y < this[model].getWholeThing().length; ++y) {
					//didnt use forEach cus there's a point where I'd have to use a break
					let row = this[model].getWholeThing()[y];
					for(let x = 0; x < row.length; ++x) {
						straightUps = this[model].checkForStraightUps(y, x, CheckedBy.COMP);
						//wanna check for the truthify value of straighups.. if its lit, break and move on
						if(straightUps) {
							this.highlightBoxes(CheckedBy.COMP, ...straightUps.elements);
							return; //no further evaluation
						}
					}
				}
				//checking if everywhere is full again
				if(this[model].everywhereFull()) {
					//resetting e'rything in model
					this[model].reset();
					//then the view
					setTimeout(() => {
					this[model].getWholeThing().forEach(row => row.forEach(el => this.resetView(el)));
					}, 1500);
					return; //no further evaluation
				}
			}

	}

}

let controller = new Controller(new Model());
//adding the listener to all of the boxes
let boxes = Array.from(document.getElementsByClassName("box"));
boxes.forEach(box => {
	box.onclick = function() {
		controller.main(box.id);
	}
});