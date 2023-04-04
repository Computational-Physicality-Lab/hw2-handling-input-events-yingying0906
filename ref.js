/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

var targets = document.getElementsByClassName("target");

let isDragging = false,
	isDblClick = false,
	isEsc = false;
let clickTimer;
let originalX, originalY, OffsetX, OffsetY;

let selected_div = null;
let dragging_div = null;

for (let i = 0; i < targets.length; i++) {
	targets[i].style.zIndex = 0;

	targets[i].addEventListener("mousedown", function (event) {
		if (isDblClick) {
			isDragging = false;
			isDblClick = false;
			dragging_div = null;
			targets[i].style.zIndex = 1;
		} else {
			isDragging = false;
			isEsc = false;

			/* original coordinate */
			originalX = targets[i].offsetLeft;
			originalY = targets[i].offsetTop;

			/* relative x, y */
			OffsetX = event.clientX - originalX;
			OffsetY = event.clientY - originalY;

			clickTimer = setTimeout(function () {
				isDragging = true;
			}, 70);
		}
	});

	targets[i].addEventListener("mousemove", function (event) {
		if (isDragging) {
			console.log("Dragging detected");

			dragging_div = targets[i];
			targets[i].style.zIndex = 99;

			let left = event.clientX - OffsetX;
			let top = event.clientY - OffsetY;

			targets[i].style.left = left + "px";
			targets[i].style.top = top + "px";
		}
		if (isDblClick) {
			console.log("Dblclick Dragging detected");

			dragging_div = targets[i];
			targets[i].style.zIndex = 99;

			let left = event.clientX - OffsetX;
			let top = event.clientY - OffsetY;

			targets[i].style.left = left + "px";
			targets[i].style.top = top + "px";
		}
	});

	targets[i].addEventListener("mouseup", function (event) {
		clearTimeout(clickTimer);
		if (!isDragging && isEsc === false) {
			if (event.button === 0) {
				console.log("Single click detected");

				if (selected_div !== null) {
					selected_div.style.backgroundColor = "red";
				}
				selected_div = targets[i];
				selected_div.style.backgroundColor = "blue";
			}
		} else {
			isDragging = false;
			dragging_div = null;
			targets[i].style.zIndex = 1;
		}
	});

	targets[i].addEventListener("dblclick", function (event) {
		clearTimeout(clickTimer);
		if (!isDragging) {
			console.log("Double click detected");

			if (selected_div !== null) {
				selected_div.style.backgroundColor = "red";
			}
			selected_div = targets[i];
			selected_div.style.backgroundColor = "blue";

			isDblClick = true;
		}
	});

	targets[i].addEventListener("contextmenu", function (event) {
		event.preventDefault();
	});

	targets[i].addEventListener("click", (event) => {
		event.stopPropagation();
	});
}

/* Background cancel */
document.body.addEventListener("click", function (event) {
	console.log("backgound touch");
	var clickedElement = document.elementFromPoint(
		event.clientX,
		event.clientY
	);
	if (
		event.target === document.body ||
		clickedElement.id.toLowerCase() === "workspace"
	) {
		console.log("backgound touch2");
		if (isEsc !== true) {
			if (selected_div !== null) {
				console.log("seleceting: " + selected_div);
				selected_div.style.backgroundColor = "red";
				selected_div = null;
			}
			isEsc = false;
		}
	}
});

/* Escape */

window.addEventListener("keydown", function (event) {
	if (isDragging) {
		isEsc = true;
		isDragging = false;

		dragging_div.style.left = originalX + "px";
		dragging_div.style.top = originalY + "px";
		dragging_div.style.zIndex = 1;

		dragging_div = null;
	}
	if (isDblClick) {
		isEsc = true;
		isDblClick = false;

		dragging_div.style.left = originalX + "px";
		dragging_div.style.top = originalY + "px";
		dragging_div.style.zIndex = 1;

		dragging_div = null;
	}
});
