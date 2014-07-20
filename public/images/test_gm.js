var gm = require('../../routes/utilities/gm');

var image_file = "default.jpg";
var crop_dim = {
  width: 0.5,
  height: 0.5,
  x: 0.4,
  y: 0.4
};
var final_dim = {
  width: 500,
  height: 500
};
var callback = function(filename) {
};
gm.crop(image_file, crop_dim, final_dim, callback);
