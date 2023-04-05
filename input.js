/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

/* ---------- Reference ---------- */
// 1. mobile device detect (non-jquery): https://stackoverflow.com/questions/3514784/how-to-detect-a-mobile-device-using-jquery
// 2. Single tap and double tap: https://appcropolis.com/blog/implementing-isDoubleTap-on-iphones-and-ipads

var targets = document.getElementsByClassName("target");

/* ---------- Global variable ---------- */
var selectedElement = null,
	movingElement = null;
var startPosX, startPosY, startOffsetX, startOffsetY, newPosX, newPosY;
var isMoving = false;

/* mobile variable */
var isFollowing = false;
var isDoubleTap = false;
var touchStartTime = 0,
	lastTouchEndTime = 0,
	touchTimeout = null;

var touchStartX = null,
	touchStartY = null;

/* BG Mobile*/
var isBGTouchMove = false,
	isResizing = false;
var touchBGX = null,
	touchBGY = null;
var numFinger = 0;
var OriFingerDis, OriWidth, OriOffsetLeft, OriOffsetTop, OriCenter;

/* All: select element */
function selecting(element) {
	// unselect the previous one
	if (selectedElement) {
		selectedElement.style.backgroundColor = "red";
	}

	// select the new element
	selectedElement = element;
	selectedElement.style.backgroundColor = "blue";
}

/* ---------- Mobile function ---------- */
function handleTouchStart(event) {
	event.stopPropagation();
	if (isFollowing && event.target === followingElement) {
		// if following mode, then stop following (touch the element)
		stopFollowing(event);
	} else if (!isFollowing && !isMoving && !isResizing) {
		// prevent touch other when moving or following
		// Get touch time
		touchStartTime = new Date().getTime();

		// Get the touch pos
		touchStartX = event.changedTouches[0].clientX;
		touchStartY = event.changedTouches[0].clientY;

		// original touch pos
		startPosX = event.touches[0].pageX;
		startPosY = event.touches[0].pageY;

		// original element pos
		startOffsetX = event.target.offsetLeft;
		startOffsetY = event.target.offsetTop;

		// confirm
		isMoving = false;

		// Check for double tap
		if (touchTimeout !== null) {
			// second tap
			clearTimeout(touchTimeout);
			touchTimeout = null;
			isDoubleTap = true;
		} else {
			// first tap
			touchTimeout = setTimeout(function () {
				touchTimeout = null;
				isDoubleTap = false;
			}, 300);
		}
	}
}

/* Mobile:  Touch Move (dragging)*/
function handleTouchMove(event) {
	if (!isFollowing) {
		event.preventDefault();
		console.log("Dragging");
		movingElement = event.target;
		isMoving = true;

		// distance changed
		var deltaX = event.touches[0].pageX - startPosX;
		var deltaY = event.touches[0].pageY - startPosY;

		event.target.style.left = event.target.offsetLeft + deltaX + "px";
		event.target.style.top = event.target.offsetTop + deltaY + "px";

		// update the new position
		startPosX = event.touches[0].pageX;
		startPosY = event.touches[0].pageY;

		// add touch start for stop and back
		document.addEventListener("touchstart", StopAndBack, { once: true });
	}
}

/* Mobile: following mode move */
function followingMove(event) {
	if (isFollowing) {
		console.log("following move");
		// distance
		var deltaX = event.touches[0].pageX - startPosX;
		var deltaY = event.touches[0].pageY - startPosY;

		followingElement.style.left =
			followingElement.offsetLeft + deltaX + "px";
		followingElement.style.top = followingElement.offsetTop + deltaY + "px";

		// update the new position
		startPosX = event.touches[0].pageX;
		startPosY = event.touches[0].pageY;

		// touch bg to stop and back to original pos
		document.addEventListener("touchstart", StopAndBack, { once: true });
	}
}

/* Mobile:  Stop by 2nd finger */
function StopAndBack(event) {
	// following stop and back
	if (isFollowing && event.touches.length > 1) {
		console.log("stop following and back");
		document.removeEventListener("touchmove", followingMove);

		followingElement.style.left = startOffsetX + "px";
		followingElement.style.top = startOffsetY + "px";

		isFollowing = false;
		followingElement = null;
	}
	// moving stop and back
	if (isMoving && event.touches.length > 1) {
		console.log("stop moving and back");
		document.removeEventListener("touchmove", followingMove);

		movingElement.style.left = startOffsetX + "px";
		movingElement.style.top = startOffsetY + "px";

		isMoving = false;
		movingElement = null;
	}
}

/* Mobile:  stop following mode by touch the element */
function stopFollowing(event) {
	// stop following by touchstart again
	if (isFollowing) {
		console.log("stop following");
		document.removeEventListener("touchmove", followingMove);
		isFollowing = false;
		followingElement = null;
	}
}

/* Mobile: finger up */
function handleTouchEnd(event) {
	// touchend time
	var touchEndTime = new Date().getTime();

	// touch end pos
	var touchEndX = event.changedTouches[0].clientX;
	var touchEndY = event.changedTouches[0].clientY;

	// check time and distance
	var touchDuration = touchEndTime - touchStartTime;
	var touchDistance = Math.sqrt(
		Math.pow(touchEndX - touchStartX, 2) +
			Math.pow(touchEndY - touchStartY, 2)
	);

	// if not double tap + touch time small + no dragging (tolerate 10px move shrinking)
	if (!isDoubleTap && touchDuration < 300 && touchDistance < 10) {
		console.log("Single tap");

		selecting(event.target);
	} else if (isDoubleTap) {
		console.log("Double tap");

		isFollowing = true;
		followingElement = event.target;
		document.addEventListener("touchmove", followingMove);

		isDoubleTap = false;
	}

	isMoving = false;

	// Set a timeout to clear the touchTimeout variable
	setTimeout(function () {
		touchTimeout = null;
	}, 100);
}
/* ---------- PC function ---------- */
/* PC: MouseDown */
function handleMouseDown(event) {
	event.preventDefault();

	if (!isMoving) {
		// prevent moving and click other element
		//console.log("mouse down");

		// element record
		movingElement = event.target;

		// mouse starting position (check dragging or not)
		startPosX = event.clientX;
		startPosY = event.clientY;

		// element starting position
		startOffsetX = event.target.offsetLeft;
		startOffsetY = event.target.offsetTop;

		// add mouse move event
		document.addEventListener("mousemove", handleMouseMove);
		//add Esc Press event
		document.addEventListener("keydown", handleEscStop, { once: true });
		// add mouseup event
		document.addEventListener("mouseup", handleMouseUp, {
			once: true,
		});
	}
}

/* PC: MouseMove */
function handleMouseMove(event) {
	//console.log("Mouse Moving");
	isMoving = true;

	// Position change
	newPosX = startPosX - event.clientX;
	newPosY = startPosY - event.clientY;

	// Update starting position
	startPosX = event.clientX;
	startPosY = event.clientY;

	// New posisition
	movingElement.style.top = movingElement.offsetTop - newPosY + "px";
	movingElement.style.left = movingElement.offsetLeft - newPosX + "px";
}

/* PC: MouseUp */
function handleMouseUp(event) {
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("keydown", handleEscStop);

	// If not moving
	if (
		!isMoving &&
		event.clientX === startPosX &&
		event.clientY === startPosY
	) {
		console.log("single click");
		selecting(event.target);
	} else {
		console.log("Dragging");
	}

	isMoving = false;
	movingElement = null;
}

/* PC: Double Click */
function handleDoubleClick(event) {
	console.log("Double click");
	event.preventDefault;

	// select the element first
	selecting(event.target);

	// element record
	movingElement = event.target;

	/// mouse starting position (check dragging or not)
	startPosX = event.clientX;
	startPosY = event.clientY;

	// element starting position
	startOffsetX = event.target.offsetLeft;
	startOffsetY = event.target.offsetTop;

	// add Mouse move event
	document.addEventListener("mousemove", handleMouseMove);

	// add stopping event ("Mouseup again or Esc")
	document.addEventListener("keydown", handleEscStop, { once: true });
	document.addEventListener("mouseup", handleDblMouseUp, { once: true });
}

/* DblClick Mouse Up */
function handleDblMouseUp(event) {
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("keydown", handleEscStop);
	// remove esc
	isMoving = false;
	movingElement = null;
}

/* Esc Stop */
function handleEscStop(event) {
	if (event.key === "Escape") {
		console.log("Esc stop");

		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
		document.removeEventListener("mouseup", handleDblMouseUp);

		// back to original
		movingElement.style.left = startOffsetX + "px";
		movingElement.style.top = startOffsetY + "px";

		movingElement = null;
		isMoving = false;
	}
}

/* ---------- Backgound function ---------- */
/* ---------- (PC) ---------- */
function handleClickBG(event) {
	// check if click the background or the element
	var clickedElement = document.elementFromPoint(
		event.clientX,
		event.clientY
	);
	if (
		event.target === document.body ||
		clickedElement.id.toLowerCase() === "workspace"
	) {
		console.log("Click BG and unselect");
		if (selectedElement !== null) {
			selectedElement.style.backgroundColor = "red";
			selectedElement = null;
		}
	}
}

/* ---------- (Mobile) ---------- */
function handleTouchstartBG(event) {
	isBGTouchMove = false;

	if (!isFollowing && !isMoving) {
		// prevent canceling trigger bg event
		if (event.touches.length === 1) {
			// single finger touch
			console.log("1 finger");
			if (!isFollowing) {
				touchBGX = event.touches[0].pageX;
				touchBGY = event.touches[0].pageY;
			}
			numFinger = 1;
		} else if (event.touches.length === 2) {
			// two finger touch
			console.log("2 fingers");
			numFinger = 2;

			// finger distance
			OriFingerDis = Math.abs(
				event.touches[0].pageX - event.touches[1].pageX
			);

			// if selected element exist, record the original info
			if (selectedElement) {
				OriWidth = parseInt(selectedElement.style.width);
				OriOffsetLeft = parseInt(selectedElement.style.left);
				OriOffsetTop = parseInt(selectedElement.style.top);
				OriCenter = OriOffsetLeft + OriWidth / 2;
				isResizing = true;
			}
		} else if (event.touches.length === 3 && isResizing) {
			console.log("cancel resizing");
			isResizing = false;

			selectedElement.style.width = OriWidth + "px";
			selectedElement.style.left = OriOffsetLeft + "px";
			selectedElement.style.top = OriOffsetTop + "px";
		}
	}
}

function handleTouchmoveBG(event) {
	isBGTouchMove = true;

	if (numFinger === 2 && selectedElement !== null && isResizing) {
		// resize by finger distance
		var leftTouchX = event.touches[0].pageX;
		var rightTouchX = event.touches[1].pageX;

		var fingerDis = Math.abs(leftTouchX - rightTouchX);
		var widthChange = fingerDis - OriFingerDis;
		var newWidth = OriWidth + widthChange;

		// if too small, keep the size
		if (newWidth < 20) {
			newWidth = 20;
		}
		var newLeft = OriCenter - newWidth / 2;

		selectedElement.style.width = newWidth + "px";
		selectedElement.style.left = newLeft + "px";
	}
}

function handleTouchendBG(event) {
	if (numFinger === 1) {
		// unselect
		if (
			touchBGX !== null &&
			touchBGY !== null &&
			!isBGTouchMove &&
			!isFollowing
		) {
			// single click to bg
			var clickedElement = document.elementFromPoint(touchBGX, touchBGY);
			if (clickedElement.id.toLowerCase() === "workspace") {
				if (!isFollowing) {
					console.log("Background and cancel select!");

					if (selectedElement !== null) {
						selectedElement.style.backgroundColor = "red";
						selectedElement = null;
					}
				}
			}
		}
	}
	touchBGX = null;
	touchBGY = null;
	isResizing = false;
	bgtouchmove = false;
}
/* ---------- main ---------- */
if (
	navigator.userAgent.match(
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	)
) {
	/* ---------- Mobile ---------- */
	console.log("Mobile Device detected");

	for (var i = 0; i < targets.length; i++) {
		/* touch event */
		targets[i].addEventListener("touchstart", handleTouchStart);

		/* move event */
		targets[i].addEventListener("touchmove", handleTouchMove);

		/* up event */
		targets[i].addEventListener("touchend", handleTouchEnd);
	}

	/* Backgound Event */
	document.body.addEventListener("touchstart", handleTouchstartBG);
	document.body.addEventListener("touchmove", handleTouchmoveBG);
	document.body.addEventListener("touchend", handleTouchendBG);
} else {
	/* ---------- Computer ---------- */
	console.log("Computer detected");

	/* Mouse Down Event*/
	for (var i = 0; i < targets.length; i++) {
		targets[i].addEventListener("mousedown", handleMouseDown);
		targets[i].addEventListener("dblclick", handleDoubleClick);
	}

	/* Backgound Event */
	document.body.addEventListener("mousedown", handleClickBG);
}
