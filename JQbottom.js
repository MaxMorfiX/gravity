var fieldH = $('#field').height();
function fitToSizeEnd() {
    fieldH = $('#field').height();
}

(function($) {
  $.fn.y = function(bottom) {
    
    var offsetTop = fieldH - this[0].offsetTop - this[0].offsetHeight;
    
    if (typeof bottom !== 'undefined') {
        offsetTop = fieldH - bottom - this[0].offsetHeight;
        this[0].style.top = offsetTop + 'px';
    }
    
    return offsetTop;
  };
})(jQuery);

(function($) {
  $.fn.x = function(left) {
    
    var offsetLeft = this[0].offsetLeft;
    
    if (typeof left !== 'undefined') {
        offsetLeft = left;
        this[0].style.left = offsetLeft + 'px';
    }
    
    return offsetLeft;
  };
})(jQuery);

function cos(number) {
    return Math.cos(number);
}
function sin(number) {
    return Math.sin(number);
}
function tan(number) {
    return Math.tan(number);
}
function atan(number) {
    return Math.atan(number);
}
function sqrt(number) {
    return Math.sqrt(number);
}
