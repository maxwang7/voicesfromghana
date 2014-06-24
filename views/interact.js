/*
 * -------------
 * Description: Listens for mouse events. Tells whether the mouse
 * is inside the object contained inside Interact.
 */

function Interact(obj) {
	this.obj = obj;
};

Interact.prototype.is_inside = function() {
	var obj = this.obj;
	var obj_x_min = obj.offset().left;
	var obj_y_min = obj.offset().top;
	var obj_x_max = obj_x_min + obj.width();
	var obj_y_max = obj_y_min + obj.height();
	var mouse_x = event.pageX;
	var mouse_y = event.pageY;
	if(obj_x_min < mouse_x &&
		obj_x_max > mouse_x &&
		obj_y_min < mouse_y &&
		obj_y_max > mouse_y) {
		return true;
	}
	return false;
}