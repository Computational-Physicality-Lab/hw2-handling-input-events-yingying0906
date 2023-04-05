// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

function scrollup() {
	document.getElementById("header").scrollIntoView();
}

let initProducts = () => {
	// To see the shirts object, run:
	// console.log(shirts);

	// Your Code Here
	var main = document.getElementById("product_page");

	for (var i = 0; i < shirts.length; i++) {
		var shirt_obj = shirts[i];

		/* variable initialize */
		var img_src = "shirt_images/not-found.png";
		var name_tmp = "Missing name";
		var color_num_tmp = 0;

		/* div */
		var box = document.createElement("div");
		box.className = "product_box";

		/* fragment */
		var fragment = document.createDocumentFragment();

		/* img */
		var img_button = document.createElement("button");
		var img = document.createElement("img");
		img_button.style.margin = "0";
		img.style.margin = "0";

		/* if no color propert exist */
		if ("colors" in shirt_obj) {
			if (Object.keys(shirt_obj.colors).length != 0) {
				var first_color = Object.keys(shirt_obj.colors)[0];
				/* if no side propert exist */
				if ("front" in shirt_obj.colors[first_color]) {
					img_src = shirt_obj.colors[first_color].front;
				} else if ("back" in shirt_obj.colors[first_color]) {
					img_src = shirt_obj.colors[first_color].back;
				}

				/* color num */
				color_num_tmp = Object.keys(shirt_obj.colors).length;
			}
		}

		img.src = img_src;
		img_button.appendChild(img);
		img_button.className = "img_button";
		img_button.id = i;
		img_button.onclick = function () {
			sp_action(this.id);
		};

		/* product title */
		/* if no name exist */
		if ("name" in shirt_obj) {
			name_tmp = shirt_obj.name;
		}

		var shirt_name = document.createElement("h2");
		shirt_name.className = "title";
		shirt_name.style.color = "#ac2432";
		shirt_name.appendChild(document.createTextNode(name_tmp));

		/* avaliable color*/
		var color_num = document.createElement("h3");
		color_num.className = "text";
		color_num.appendChild(
			document.createTextNode("Available in " + color_num_tmp + " colors")
		);

		/* button */
		var button_div = document.createElement("div");
		var button_qv = document.createElement("button");
		var button_sp = document.createElement("button");

		button_qv.appendChild(document.createTextNode("Quick View"));
		button_sp.appendChild(document.createTextNode("See Page"));

		button_qv.id = i;
		button_sp.id = i;

		button_qv.className = "red_button button_animation_0";
		button_sp.className = "red_button button_animation_0";

		button_qv.onclick = function () {
			qv_action(this.id);
		};
		button_sp.onclick = function () {
			sp_action(this.id);
		};

		button_div.appendChild(button_qv);
		button_div.appendChild(button_sp);

		/* append to main */
		fragment.appendChild(img_button);
		fragment.appendChild(shirt_name);
		fragment.appendChild(color_num);
		fragment.appendChild(button_div);

		box.append(fragment);
		main.appendChild(box);
	}
};

let initDetails = () => {
	// To see the shirts object, run:
	// console.log(shirts);
	// Your Code Here
	var shirt_id = localStorage.getItem("shirt_id");
	var shirt_obj = shirts[shirt_id];

	/* variable initialize */
	var img_src = "shirt_images/not-found.png";
	var name_tmp = "Missing name";
	var price_tmp = "Missing price";
	var description_tmp = "Missing description";

	/* shirt name */
	/* if no name exist */
	if ("name" in shirt_obj) {
		name_tmp = shirt_obj.name;
	}

	var name = document.getElementById("detail_name");
	name.appendChild(document.createTextNode(name_tmp));

	/* shirt img */
	/* if no color propert exist */
	if ("colors" in shirt_obj) {
		if (Object.keys(shirt_obj.colors).length != 0) {
			var first_color = Object.keys(shirt_obj.colors)[0];
			/* if no side propert exist */
			if ("front" in shirt_obj.colors[first_color]) {
				img_src = shirt_obj.colors[first_color].front;
			} else if ("back" in shirt_obj.colors[first_color]) {
				img_src = shirt_obj.colors[first_color].back;
			}
		}
	}

	var img = document.getElementById("detail_img");
	img.src = img_src;

	/* shirt price */
	if ("price" in shirt_obj) {
		price_tmp = shirt_obj.price;
	}

	var price = document.getElementById("detail_price");
	price.appendChild(document.createTextNode(price_tmp));
	price.style.fontWeight = "normal";

	/* shirt description */
	if ("description" in shirt_obj) {
		description_tmp = shirt_obj.description;
	}
	var description = document.getElementById("detail_descript");
	description.appendChild(document.createTextNode(description_tmp));
	description.style.color = "#ac2432";

	/* side button */
	var side = document.getElementById("detail_side");

	var front_button = document.createElement("button");
	var back_button = document.createElement("button");

	front_button.className = "red_button button_animation_0";
	back_button.className = "red_button button_animation_0";
	front_button.appendChild(document.createTextNode("Front"));
	back_button.appendChild(document.createTextNode("Back"));
	front_button.onclick = function () {
		change_side("front");
	};
	back_button.onclick = function () {
		change_side("back");
	};

	side.appendChild(document.createTextNode("Side:"));
	side.appendChild(front_button);
	side.appendChild(back_button);

	/* color button */
	var color_box = document.getElementById("detail_color");
	var fragment = document.createDocumentFragment();
	for (var color_i in shirt_obj.colors) {
		var button = document.createElement("button");
		button.appendChild(document.createTextNode(color_i));
		button.className = "red_button button_animation_1";
		button.style.backgroundColor = color_i;
		if (color_i === "black") {
			button.style.color = "white";
		} else if (color_i === "white") {
			button.style.color = "black";
		}
		button.style.border = "1px #ac2432 solid";
		button.id = color_i;
		button.onclick = function () {
			change_color(this.id);
		};
		fragment.appendChild(button);
	}
	color_box.appendChild(document.createTextNode("Color:"));
	color_box.appendChild(fragment);
};

/* function */
function qv_action(shirt_id) {
	/* get information */
	var shirt_obj = shirts[shirt_id];

	var img_src1 = "shirt_images/not-found.png";
	var img_src2 = "shirt_images/not-found.png";

	var name = "Missing name";
	var description = "Missing description";
	var price = "Missing price";

	/* if no color propert exist */
	if ("colors" in shirt_obj) {
		if (Object.keys(shirt_obj.colors).length != 0) {
			var first_color = Object.keys(shirt_obj.colors)[0];
			/* if no side propert exist */
			if ("front" in shirt_obj.colors[first_color]) {
				img_src1 = shirt_obj.colors[first_color].front;
			}
			if ("back" in shirt_obj.colors[first_color]) {
				img_src2 = shirt_obj.colors[first_color].back;
			}
		}
	}

	/* if no name exist */
	if ("name" in shirt_obj) {
		name = shirt_obj.name;
	}
	if ("description" in shirt_obj) {
		description = shirt_obj.description;
	}
	if ("price" in shirt_obj) {
		price = shirt_obj.price;
	}

	/* change element */
	var parent_left = document.getElementById("qv_left");

	/* img button only */
	var children_left = parent_left.children;
	children_left[0].id = shirt_id;
	children_left[0].onclick = function () {
		sp_action(this.id);
	};

	/* img in img button */
	var children_left2 = children_left[0].children;
	children_left2[0].src = img_src1;
	children_left2[1].src = img_src2;

	var parent_right = document.getElementById("qv_right");
	var children_right = parent_right.children;

	children_right[0].innerHTML = name;
	children_right[1].innerHTML = price;
	children_right[2].innerHTML = description;
	children_right[3].onclick = function () {
		close_qv(children_right[3]);
	};

	/* qv display */
	var qv_window = document.getElementById("qv");
	qv_window.style.display = "flex";
	qv_window.scrollIntoView();
}
function sp_action(shirt_id) {
	localStorage.setItem("shirt_id", shirt_id);
	localStorage.setItem("side", "front");

	var first_color = "none";
	if ("colors" in shirts[shirt_id]) {
		if (Object.keys(shirts[shirt_id].colors).length != 0) {
			first_color = Object.keys(shirts[shirt_id].colors)[0];
		}
	}

	localStorage.setItem("color", first_color);
	location.href = "details.html";
}

function change_side(side) {
	localStorage.setItem("side", side);

	var side = localStorage.getItem("side");
	var shirt_id = localStorage.getItem("shirt_id");
	var color = localStorage.getItem("color");

	var new_src = "shirt_images/not-found.png";
	if (side != "none" && color != "none") {
		if (Object.keys(shirts[shirt_id].colors).length != 0) {
			if (side == "front" && "front" in shirts[shirt_id].colors[color]) {
				new_src = shirts[shirt_id].colors[color][side];
			} else if (
				side == "back" &&
				"back" in shirts[shirt_id].colors[color]
			) {
				new_src = shirts[shirt_id].colors[color][side];
			}
		}
	}

	var img = document.getElementById("detail_img");
	img.src = new_src;
}

function change_color(color_in) {
	localStorage.setItem("color", color_in);

	var color = localStorage.getItem("color");
	var shirt_id = localStorage.getItem("shirt_id");
	var side = localStorage.getItem("side");

	var new_src = "shirt_images/not-found.png";
	if (side != "none" && color != "none") {
		if (Object.keys(shirts[shirt_id].colors).length != 0) {
			if (side == "front" && "front" in shirts[shirt_id].colors[color]) {
				new_src = shirts[shirt_id].colors[color][side];
			} else if (
				side == "back" &&
				"back" in shirts[shirt_id].colors[color]
			) {
				new_src = shirts[shirt_id].colors[color][side];
			}
		}
	}

	var img = document.getElementById("detail_img");
	img.src = new_src;
}

function close_qv(element) {
	element.parentElement.parentElement.style.display = "none";
}
