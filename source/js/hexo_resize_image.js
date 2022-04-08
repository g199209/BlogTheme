// Usage: ?<width>x<height>
function hexo_resize_image() {
  var imgs = document.getElementsByTagName('img');
  for (var i = imgs.length - 1; i >= 0; i--) {
    var img = imgs[i];
    var src = img.getAttribute('src').toString();
    var fields = src.match(/(?<=\?)\d*x\d*/g);

    if (fields && fields.length == 1) {
      var values = fields[0].split("x");
      if (values.length == 2) {
        var width = values[0];
        var height = values[1];

        if (width.length == 0) {
          img.setAttribute("height", height + "px");
        } else if (height.length == 0) {
          img.setAttribute("width", width + "px");
        } else {
          img.setAttribute("width", width + "px");
          img.setAttribute("height", height + "px");
        }
      }
    }
  }
}
$(document).ready(hexo_resize_image);
