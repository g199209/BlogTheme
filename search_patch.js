stripe_code = function(str) { // 去除代码
    return str.replace(/<figure class="highlight.*?<\/figure>/ig, '');
}
stripe = function (str) { // 去除html标签
    return str.replace(/(<([^>]+)>)/ig, '');
}
minify = function (str) { // 压缩成一行
    return str.trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
}
