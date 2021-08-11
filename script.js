const cont = document.getElementById( 'cont' );
let flagButton = document.getElementById("flag");


let size = 100; 	// the total number of blocks in the minesweeper grid
let len = parseInt( Math.sqrt( size ) );	// the row or column size of the grid
let bombAmt = 10;	// increase the bomb count to increase the difficulty of the game

let flagOn;
let grid, divs, gridOpened;

flagButton.addEventListener("click", () => {
		flagOn = !flagOn;
		flagButton.classList.toggle("flag-button-on");

		flagButton.innerHTML = flagOn ? "Flag On": "Flag Off";
});


// Creates the Minesweeper Grid
const MinesweeperCreator = (size, bombAmt) => {
	let len = parseInt( Math.sqrt( size ) );

	// For generating the empty grid 
	let grid = [];
	for(let i = 0; i < len; i++)
	{
		grid[i] = [];
		for(let j = 0; j < len; j++)
		{
			grid[i][j] = 0;
		}
	}


	// For generating the random bomb positions
	let bombPos = [];
	for(let i = 0; i < bombAmt; i++)
	{
		// If you want some randomness in the game, so that it does not check if the pos generated is 
		// already a bomb, you can uncomment the code below while commenting the code inside this for loop

		

		// let x = Math.floor( Math.random() * len );
		// let y = Math.floor( Math.random() * len );
		// bombPos[i] = {x, y};

		// You can comment out this section while uncommenting the above section, if you want
		// some randomness in the game
		// from here
		let pos;
		do{
			let x = Math.floor( Math.random() * len );
			let y = Math.floor( Math.random() * len );
			pos = {x, y};

		}while(bombPos.indexOf(pos) != -1);
		// indexOf returns -1 if array doesn't contains it

		bombPos[i] = pos;
		// till here
	}


	// For adding the bombs in the grid as the number -1
	for(let i = 0; i < bombAmt; i++)
	{
		let {x, y} = bombPos[i];
		grid[x][y] = -1;
	}


	// For adding the other elements of the grid ; by counting the number of bombs around it
	// i and j loops go through all the elements in the grid
	// x and y loops go through all the elements surrounding the particular element
	for(let i = 0; i < grid.length; i++)
	{
		for(let j = 0; j < grid[i].length; j++)
		{
			for(let x = -1; x <= 1; x++)
			{
				for(let y = -1; y <= 1; y++)
				{
					/* try catch is used so as to avoid the ArrayIndexOutOfBoundsException 
					for the elements surrounding the elements in the edges */
						try{
						// the grid counts the number of bombs around it
						// if the element itself is not a bomb and the elements around is a bomb
						if(grid[i][j] != -1 && grid[i + x][j + y] == -1)
							grid[i][j]++;
					}
					catch(err){}
				}
			}
		}
	}

	return grid;
}


// Creates the divs for the grid of the game filled with the values of the grid
const divsCreator = (grid) => {
	let divs = [];

	// To create the divs inside the container of the game
	for (let i = 0; i < len; i++) 
	{
		divs[i] = [];
		for (let j = 0; j < len; j++) 
		{
			// Creation of the div and then appending it to the container
			divs[i][j] = document.createElement( "div" );
			cont.appendChild( divs[i][j] );

			divs[i][j].classList.add( "boxes" );
			divs[i][j].innerHTML = grid[i][j];

			// for the bomb in the specific box of the grid ; the bomb image to be applied
			// the bombs in the grid are represented by -1 hence we check for the presence of -1 in the grid
			if(grid[i][j] == -1)
			{
				divs[i][j].classList.add("bomb");
				divs[i][j].innerHTML = "";
			}
			// setting different colors for different numbers 
			setColors(i, j, grid, divs);
			coverWithBlock(divs[i][j]);
		}
	}

	function coverWithBlock(div)
	{
		// Create an img element that is absolutely positioned and cover the entire block
		const img = document.createElement("img");
		div.appendChild(img);
		img.src = "./block.png";
		img.classList.add("block-img");
	}

	function setColors(i, j, grid, divs) 
	{
		// the indices in the array represent the colors of the different numbers
		let colors = ["transparent", "grey", "blue", "black", "purple", "lightgreen", "green", "orange", "red"];

		// colors are decided based on the value in the grid
		divs[i][j].style.color = colors[ grid[i][j] ];
	}

	return divs;
}


// Adds the event Listeners to the buttons and the blocks on the minesweeper board
const addEventListenerToTheBlocks = () => {
	// adds the event Listener of click on every block of the grid
	divs.forEach((item, i) => {
		item.forEach((element, j) => {
			// adds the event Listener
			element.addEventListener("click", () => clickOnABlock(i, j));
		});
	});
}


// initializes all the variables creating the grid, minesweeper board and the buttons
const init = () => {

	// Reseting the flag button
	flagOn = false;
	flagButton.classList.remove("flag-button-on");

	// emptying the container
	cont.innerHTML = "";

	// Creating the new Minesweeper Game
	grid = MinesweeperCreator( size, bombAmt );
	divs = divsCreator( grid );

	// The grid values that have been opened 
	// creates a 2D array filled with zeroes
	gridOpened = new Array( len );
	for (let i = 0; i < gridOpened.length; i++) 
	{
		gridOpened[i] = new Array( len );
		for (let j = 0; j < gridOpened[i].length; j++)
		{
			gridOpened[i][j] = 0;
			if(grid[i][j] == -1)
				gridOpened[i][j] = -2;
		}
	}

	addEventListenerToTheBlocks();
}


// The event to be called when a block is clicked
function clickOnABlock(i, j)
{
	// opened blocks denoted by +1
	// closed blocks denoted by 0
	// blocks with bombs denoted by -1
	// closed blocks with bomb are denoted by -2
	// flagged bombs are denoted by +2
	// wrongly flagged blocks are denoted by -3
	if(flagOn)
	{
		let img = divs[i][j].querySelector("img");
		if(gridOpened[i][j] == -2)
		{
			img.src = "./flagged-block.png";
			gridOpened[i][j] = 2;
		}
		else if(gridOpened[i][j] == 0)
		{
			img.src = "./flagged-block.png";
			gridOpened[i][j] = -3;
		}
		else if(gridOpened[i][j] == 2 || gridOpened[i][j] == -3)
		{
			img.src = "./block.png";
			if(grid[i][j] == -1)
				gridOpened[i][j] = -1;
			else
				gridOpened[i][j] = 0;
		}
	}
	else
	{
		// flagged or opened blocks cannot be clicked on
		if(gridOpened[i][j] == 2 || gridOpened[i][j] == -3 || gridOpened[i][j] == 1)
		{
			return;
		}

		divs[i][j].querySelector("img").remove();
		// clicked on a bomb
		if(gridOpened[i][j] == -2)
		{
			gameOver();
			return;
		}
		gridOpened[i][j] = 1;

		openTheBlocks(i, j);
	}
	checkWin();
}


function openTheBlocks(i, j, level = 1) 
{
	if(level > 4)
		return;
	for(let x = -level; x <= level; x++)
	{
		for(let y = -level; y <= level; y++)
		{
			try{

				if(gridOpened[i + x][j + y] == -2 || gridOpened[i + x][j + y] == 2)
				{
					return;
				}

				divs[i + x][j + y].querySelector("img").remove();
				gridOpened[i + x][j + y] = 1;
			}
			catch(err){}
		}
	}

	openTheBlocks(i, j, level + 1);
}


// For restarting the game
let restart = document.getElementById("restart");
restart.addEventListener("click", init);


// To Start the Game
restart.click();

// Game Over if clicked on the bombs
function gameOver()
{
	// Shows all the bombs if clicked on one
	divs.forEach((item, i) => {
		item.forEach((element, j) => {
			try{
				// To see all the bombs
				if(grid[i][j] == -1)
					element.querySelector("img").remove();
			}catch(err){}
		})
	})

	// To show the game over alert 50ms after bombs have been shown 
	// setTimeout(function, time delay, parameters to pass to the function separated by a ,)
	setTimeout(alert, 50, "Game Over");
}


// Check If the game has been won and displays you win if true
function checkWin() 
{
	// searching for the presence of an element inside a 2D array
	function contains(gridOpened, n)
	{
		for (let i = 0; i < gridOpened.length; i++) 
			for (let j = 0; j < gridOpened[i].length; j++) 
				if(gridOpened[i][j] == n)
					return true;
		return false;
	}

	// there are no closed blocks with bombs or wrongly flagged blocks
	// it does not contain those unflagged blocks with bombs or wrongly flagged blocks
	if(!(contains(gridOpened, -2) || contains(gridOpened, -3)) && !contains(gridOpened, 0))
		setTimeout(alert, 50, "You Win");
}