// ERB style templates for jQuery in hardly any code.
//
// Based on http://ejohn.org/blog/javascript-micro-templating/
// 
// A tiny and simple plugin to allow erb style template rendering within jQuery.
// 
// Make a template:
// 
// <script type="text/html" id="template1">
// <% $.each(items, function(i, image) { %>
//   <p><img src="<%= image.media.m %>" alt="<%= image.title %>"></p>
// <% }); %>
// </script>
// 
// Render the template into the dom with some data:
// 
// <script type="text/javascript">
// jQuery(function($) {
//   $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=jordan%20III&format=json&jsoncallback=?", function(data) {
//     $('#test').render('template1', data);
//   });
// });
// </script>
//
// Alternatively, you can load templates from files:
//
// $('#test').render('template.ejs', data);

jQuery(function($) {
  var cache = {};
  
  function compile(source) {
    return new Function("obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
     
          "with(obj){p.push('" +
     
          source
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
  }
  
  function load(template) {
    if (!(/\W/).test(template)) {
      return compile($("#" + template).html());
    } else {
      var source;
    
      $.ajax({
        async: false,
        url: template,
        dataType: 'text',
        success: function(data) {
          source = data;
        }
      });
    
      return compile(source);
    }
  }
  
  $.template = function(template, data) {
    var fn = cache[template] = cache[template] || load(template);
    
    if (data) return fn(data);
  }
  
  $.fn.render = function(str, data) {
    return this.each(function() {
      $(this).html($.template(str, data));
    });
  };
});
