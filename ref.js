/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

// reference:
//1. drag: https://devdojo.com/tnylea/how-to-drag-an-element-using-javascript

var targets = document.getElementsByClassName("target");
var selectedElement = null;

let newPosX = 0,
	newPosY = 0,
	startPosX = 0,
	startPosY = 0,
	startOffsetX = 0,
	startOffsetY = 0,
	isMoving = false;
let isEsc = false;

function selectElement(element) {
	// deselect the previously selected element if there is one
	if (selectedElement) {
		selectedElement.style.backgroundColor = "red";
	}

	// select the new element
	selectedElement = element;
	selectedElement.style.backgroundColor = "blue";
}

for (let i = 0; i < targets.length; i++) {
	targets[i].id = i;
	// -------------------------- Computer -------------------------- //
	/* single click or drag */
	targets[i].addEventListener("mousedown", function (e) {
		if (!isMoving) {
			// prevent moving and click other
			e.preventDefault();
			isEsc = false;

			/* starting position (check drag) */
			startPosX = e.clientX;
			startPosY = e.clientY;

			/* Starting Offset */
			startOffsetX = targets[i].offsetLeft;
			startOffsetY = targets[i].offsetTop;

			/* moving event*/
			document.addEventListener("mousemove", moveElement);

			/* stop drag event (mouse up or Esc) */
			document.addEventListener("keydown", keyDownStop, { once: true });
			document.addEventListener("mouseup", mouseUpStop, { once: true });
		}
	});

	/* double click */
	targets[i].addEventListener("dblclick", function (e) {
		e.preventDefault();

		/* change color first */
		selectElement(targets[i]);

		/* Starting Offset */
		startOffsetX = targets[i].offsetLeft;
		startOffsetY = targets[i].offsetTop;

		/* moving event*/
		document.addEventListener("mousemove", moveElement);

		/* stop drag event (mouse up or Esc) */
		document.addEventListener("keydown", keyDownStop, { once: true });
		document.addEventListener("mouseup", dblmouseupStop, { once: true });

		console.log("done");
	});

	/* --- function --- */
	/* Moving function */
	function moveElement(e) {
		isMoving = true;

		newPosX = startPosX - e.clientX;
		newPosY = startPosY - e.clientY;

		startPosX = e.clientX;
		startPosY = e.clientY;

		targets[i].style.top = targets[i].offsetTop - newPosY + "px";
		targets[i].style.left = targets[i].offsetLeft - newPosX + "px";
	}

	/* single click drag mouse up stop */
	function mouseUpStop(e) {
		/* remove moving event */
		document.removeEventListener("mousemove", moveElement);

		/* If it is not moving then change color (selected) */
		if (
			!isMoving &&
			e.clientX === startPosX &&
			e.clientY === startPosY &&
			!isEsc
		) {
			selectElement(targets[i]);
		}

		/* remove esc event */
		document.removeEventListener("keydown", keyDownStop);

		/* stop moving */
		isMoving = false;
	}

	/* esc drop */
	function keyDownStop(e) {
		if (e.key === "Escape") {
			isEsc = true;
			console.log("Esc got");

			/* back to original x,y */
			targets[i].style.left = startOffsetX + "px";
			targets[i].style.top = startOffsetY + "px";

			document.removeEventListener("mousemove", moveElement);
			document.removeEventListener("mouseup", dblmouseupStop);
			isMoving = false;
		}
	}

	/* mouse down for dbl click drop */
	function dblmouseupStop() {
		document.removeEventListener("mousemove", moveElement);
		document.removeEventListener("keydown", keyDownStop);
		isMoving = false;
	}

	// -------------------------- Mobile -------------------------- //
	targets[i].addEventListener("touchstart", function (e) {
		startPosX = e.touches[0].pageX;
		startPosY = e.touches[0].pageY;
		isMoving = false;

		/* touch move */
		function touchMoveElement(e) {
			console.log("touchmove");
			/* distance */
			isMoving = true;
			const currentX = e.touches[0].pageX;
			const currentY = e.touches[0].pageY;
			const deltaX = e.touches[0].pageX - startPosX;
			const deltaY = e.touches[0].pageY - startPosY;

			/* change the position of element */
			targets[i].style.left = targets[i].offsetLeft + deltaX + "px";
			targets[i].style.top = targets[i].offsetTop + deltaY + "px";

			/* record the previous coordinate */
			startPosX = currentX;
			startPosY = currentY;
		}

		targets[i].addEventListener("touchmove", touchMoveElement);

		/* touch end */
		targets[i].addEventListener(
			"touchend",
			function tryyy(e) {
				e.stopPropagation();
				console.log("touchup");

				targets[i].removeEventListener("touchmove", touchMoveElement);
				if (!isMoving) {
					selectElement(targets[i]);
				}
			},
			{ once: true }
		);
	});
}

/* background unselected*/
document.body.addEventListener("mousedown", function (event) {
	//console.log("backgound touch");
	var clickedElement = document.elementFromPoint(
		event.clientX,
		event.clientY
	);
	if (
		event.target === document.body ||
		clickedElement.id.toLowerCase() === "workspace"
	) {
		console.log("backgound touch2");
		if (selectedElement !== null) {
			selectedElement.style.backgroundColor = "red";
			selectedElement = null;
		}
	}
});
