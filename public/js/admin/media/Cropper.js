function Cropper(image, help, post_id, index_) {
    var $image = $(image),
        $help = $(help);
    var $buttons = [];

    return {
        register : function register(button, ratio) {
            var $button = $(button);
            $button.ratio = ratio;
            $buttons.push($button);
        },
        start : function start() { // Actually starts listening for events
            reset();
            function reset() {
                $help.html('');
                $buttons.forEach(function(element, index, array) {
                    var $button = element;
                    $button.off();
                    $button.click(function(e) {
                        // Turn off other buttons
                        $buttons.forEach(function(element, index, array) {
                            element.off();
                        });
                        // Help block tells user to crop -- also provide helpful directions
                        $help.html('You can set the location of the top-left corner of the crop box by clicking on the image. You can set the width with SHIFT + click.')
                        // Button changes to 'Crop & save!'
                        var original_text = $button.html();
                        $button.html('Crop & save!');
                        $button.click(function(e) {
                            $.ajax({
                                type: 'POST',
                                data: {
                                    type: original_text, // TODO: Need a less hackish way of getting this value
                                    dim: dim
                                },
                                url: '/admin/crop/' + post_id + '/' + index_,
                                success: function() {
                                    $button.html('Refresh to see changes');
                                    $help.html(original_text + 'successfully cropped!')
                                    $image.off();
                                    $cancel.remove();
                                    $crop_box.remove();
                                    reset();
                                },
                                error: function() {
                                    $help.html("We're having trouble. Try again?");
                                }
                            })
                        })
                        // Add button to cancel cropping
                        $cancel = $('<button></button>')
                            .html('cancel')
                            .addClass('btn btn-warning')
                            // if cancel button clicked, resets the entire thing
                            .click(function(e) {
                                $button.html(original_text);
                                $(this).remove();
                                $image.off();
                                $crop_box.remove();
                                reset();
                            })
                            .insertAfter($button);
                        // When user clicks on image, place div on top, and keep track of dimensions
                        // TODO: doesn't seem to be croping correctly
                        // Check that the dimensions are correct
                        var width = 100,
                            height = 100 * $button.ratio;
                        $crop_box = $('<div></div>')
                                .css('position', 'absolute')
                                .css('border', '1px solid black')
                                .css('background-color', 'white')
                                .css('opacity', '0.5')
                                .width(width)
                                .height(height);
                        var crop_box_on_screen = false;
                        var dim = {
                            x: 0,
                            y: 0,
                            width: width / $image.width(),
                            height: height / $image.height()
                        };
                        $image.click(function(e) {
                            if(!crop_box_on_screen) {
                                $crop_box.insertAfter($image);
                            }
                            if(e.shiftKey) {
                                $crop_box.width(function() {
                                    width = e.pageX - $(this).offset().left;
                                    dim.width = width / $image.width();
                                    return width;
                                }).height(function() {
                                    height = $(this).width() * $button.ratio;
                                    dim.height = height / $image.height();
                                    return height;
                                });
                            } else {
                                $crop_box.offset({
                                    top : e.pageY,
                                    left : e.pageX
                                })
                                dim.x = (e.pageX - $image.offset().left) / $image.width();
                                dim.y = (e.pageY - $image.offset().top) / $image.height();
                            }
                        });
                    })
                });
            }
        }
    }
}